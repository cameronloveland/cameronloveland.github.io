"""Step 30: bake the human, cut the bust and build the node contract.

Produces, in glTF-ready units (Blender Z up, facing -Y, which the exporter maps to +Y up,
facing +Z):
- Bust: neck base and the top of the shoulders, static.
- Head: everything above the neck cut, origin at the skull-centre pivot, no translation.
- EyeHuman (character right, -X) and EyeRed (character left, +X, the android side),
  children of Head with their origins at the eye centres.
- Glasses: an empty child of Head until the glasses item fills it.
"""
import os
import sys

import bmesh
import bpy
from mathutils import Matrix, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
HumanService, AssetService, TargetService = lib.mpfb()

human = lib.get("Human")
eyes = lib.get("Eyes")

# Bake the targets, read the joints, then drop the helper geometry.
if human.data.shape_keys:
    TargetService.bake_targets(human)
joint = {n: lib.group_centroid(human, f"joint-{n}") for n in ("l-eye", "r-eye", "neck", "head", "l-shoulder", "r-shoulder")}
bpy.context.view_layer.objects.active = human
for mod in list(human.modifiers):
    bpy.ops.object.modifier_apply(modifier=mod.name)

# Put every mesh in world space with identity transforms and no parents.
for obj in (human, eyes):
    mw = obj.matrix_world.copy()
    obj.parent = None
    obj.data.transform(mw)
    obj.matrix_world = Matrix.Identity(4)


def bisect(obj, z, keep_above):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, z), plane_no=(0, 0, 1),
                           clear_inner=keep_above, clear_outer=not keep_above)
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()


shoulder_z = (joint["l-shoulder"].z + joint["r-shoulder"].z) / 2
neck_z = joint["neck"].z
bisect(human, shoulder_z - 0.06, keep_above=True)   # clean horizontal cut below the shoulders' top line

head = human
bust = human.copy()
bust.data = human.data.copy()
human.users_collection[0].objects.link(bust)
bisect(head, neck_z + 0.02, keep_above=True)
bisect(bust, neck_z + 0.02, keep_above=False)
head.name, head.data.name = "Head", "Head"
bust.name, bust.data.name = "Bust", "Bust"
for obj in (head, bust):
    obj.vertex_groups.clear()

# Split the eyes by side.
bm = bmesh.new()
bm.from_mesh(eyes.data)
left = [f for f in bm.faces if f.calc_center_median().x > 0]
bmesh.ops.delete(bm, geom=left, context="FACES")
right_mesh = bpy.data.meshes.new("EyeHuman")
bm.to_mesh(right_mesh)
bm.free()
bm = bmesh.new()
bm.from_mesh(eyes.data)
bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().x <= 0], context="FACES")
bm.to_mesh(eyes.data)
bm.free()
eyes.name, eyes.data.name = "EyeRed", "EyeRed"
eye_human = bpy.data.objects.new("EyeHuman", right_mesh)
eyes.users_collection[0].objects.link(eye_human)
eye_red = eyes

# Scale and pivot: head height is taken as twice the crown-to-eye distance (eyes sit at
# half head height), and the pivot sits EYE_LOCAL_Y below the eye line, centred in the
# cranium front to back, so the hero's fixed EYE_LOCAL_Y peek math holds.
verts = [v.co for v in head.data.vertices]
eye_z = (joint["l-eye"].z + joint["r-eye"].z) / 2
crown_z = max(v.z for v in verts)
k = lib.HEAD_HEIGHT / (2 * (crown_z - eye_z))
cranium = [v.y for v in verts if v.z > eye_z]
pivot = Vector((0.0, (min(cranium) + max(cranium)) / 2, eye_z - lib.EYE_LOCAL_Y / k))
to_hero = Matrix.Scale(k, 4) @ Matrix.Translation(-pivot)
for obj in (head, bust, eye_human, eye_red):
    obj.data.transform(to_hero)
    obj.data.update()

# Eye origins at their own centres, so a later item can turn them in place.
for obj in (eye_human, eye_red):
    c = sum((v.co for v in obj.data.vertices), Vector()) / len(obj.data.vertices)
    obj.data.transform(Matrix.Translation(-c))
    obj.location = c

glasses = bpy.data.objects.new("Glasses", None)
head.users_collection[0].objects.link(glasses)
for obj in (eye_human, eye_red, glasses):
    obj.parent = head
    obj.matrix_parent_inverse = Matrix.Identity(4)


def material(name, color, roughness, emission=None):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission[0], 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission[1]
    return mat


def srgb(hex_color):
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(lin(int(hex_color[i:i + 2], 16)) for i in (0, 2, 4))


skin = material("Skin", srgb("c8957c"), 0.55)
red = srgb("ff2a1a")
mats = {head: skin, bust: skin,
        eye_human: material("EyeWhite", srgb("f2efe9"), 0.3),
        eye_red: material("EyeRed", red, 0.2, emission=(red, 4.0))}
for obj, mat in mats.items():
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.material_index = 0
        poly.use_smooth = True

for obj in list(bpy.data.objects):
    if obj not in mats and obj is not glasses:
        bpy.data.objects.remove(obj, do_unlink=True)

lib.save(ns)
top = max(v.co.z for v in head.data.vertices)
low = min(v.co.z for v in bust.data.vertices)
print(f"head build: k {k:.3f}, crown {top:.2f}, bust bottom {low:.2f}, eyes at {tuple(round(x, 2) for x in eye_red.location)}")
