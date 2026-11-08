"""Step 30: bake the human, cut the bust and build the node contract.

Produces, in glTF-ready units (Blender Z up, facing -Y, which the exporter maps to +Y up,
facing +Z):
- Skin: one continuous mesh from the crown to a clean cut below the shoulders, skinned to
  the two joints below, so turning the head bends the neck instead of opening a seam.
- Rig: an armature with two bones, Bust (root, static) and Head (its child), both at the
  skull-centre pivot and pointing straight up, which the exporter writes as joints with
  no translation and no rotation. The armature object itself is dropped on export.
- EyeHuman (character right, -X) and EyeRed (character left, +X, the android side),
  bone-parented to Head with their origins at the eye centres.
- Glasses: an empty bone-parented to Head until the glasses item fills it.
"""
import json
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

# Head and Bust weights from MPFB's CC0 default-rig weights, indexed by base-mesh vertex,
# so this runs before the helper geometry is removed. Torso bones count toward Bust, the
# neck bones hand over from Bust to Head bottom to top, and every other bone (skull, jaw,
# eyes and the many face bones) counts fully toward Head.
TORSO = ("spine", "clavicle", "shoulder", "upperarm", "breast", "pelvis", "root")
NECK_BUST_SHARE = {"neck01": 0.8, "neck02": 0.4, "neck03": 0.0}


def bust_share(bone):
    if bone in NECK_BUST_SHARE:
        return NECK_BUST_SHARE[bone]
    return 1.0 if bone.startswith(TORSO) else 0.0


with open(lib.mpfb_data("rigs", "standard", "weights.default.json"), encoding="utf8") as f:
    rig_weights = json.load(f)["weights"]
head_w = [0.0] * len(human.data.vertices)
total_w = [0.0] * len(human.data.vertices)
for bone, pairs in rig_weights.items():
    share = 1.0 - bust_share(bone)
    for index, weight in pairs:
        head_w[index] += share * weight
        total_w[index] += weight
head_w = [h / t if t > 0 else 0.0 for h, t in zip(head_w, total_w)]
g_head = human.vertex_groups.new(name="Head")
g_bust = human.vertex_groups.new(name="Bust")
for index, w in enumerate(head_w):
    w = min(1.0, w)
    if w > 0.0:
        g_head.add([index], w, "REPLACE")
    if w < 1.0:
        g_bust.add([index], 1.0 - w, "REPLACE")

# Bake the targets, read the joints, then drop the helper geometry.
if human.data.shape_keys:
    TargetService.bake_targets(human)
joint = {n: lib.group_centroid(human, f"joint-{n}") for n in ("l-eye", "r-eye", "l-shoulder", "r-shoulder")}
bpy.context.view_layer.objects.active = human
for mod in list(human.modifiers):
    bpy.ops.object.modifier_apply(modifier=mod.name)
for group in list(human.vertex_groups):
    if group.name not in ("Head", "Bust"):
        human.vertex_groups.remove(group)

# Put every mesh in world space with identity transforms and no parents.
for obj in (human, eyes):
    mw = obj.matrix_world.copy()
    obj.parent = None
    obj.data.transform(mw)
    obj.matrix_world = Matrix.Identity(4)

# Clean horizontal cut below the shoulders' top line (bmesh keeps the weights).
shoulder_z = (joint["l-shoulder"].z + joint["r-shoulder"].z) / 2
bm = bmesh.new()
bm.from_mesh(human.data)
bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
                       plane_co=(0, 0, shoulder_z - 0.06), plane_no=(0, 0, 1), clear_inner=True)
bm.to_mesh(human.data)
bm.free()
skin = human
skin.name, skin.data.name = "Skin", "Skin"

# Split the eyes by side.
bm = bmesh.new()
bm.from_mesh(eyes.data)
bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().x > 0], context="FACES")
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
verts = [v.co for v in skin.data.vertices]
eye_z = (joint["l-eye"].z + joint["r-eye"].z) / 2
crown_z = max(v.z for v in verts)
k = lib.HEAD_HEIGHT / (2 * (crown_z - eye_z))
cranium = [v.y for v in verts if v.z > eye_z]
pivot = Vector((0.0, (min(cranium) + max(cranium)) / 2, eye_z - lib.EYE_LOCAL_Y / k))
to_hero = Matrix.Scale(k, 4) @ Matrix.Translation(-pivot)
for obj in (skin, eye_human, eye_red):
    obj.data.transform(to_hero)
    obj.data.update()

# Eye origins at their own centres, so a later item can turn them in place.
for obj in (eye_human, eye_red):
    c = sum((v.co for v in obj.data.vertices), Vector()) / len(obj.data.vertices)
    obj.data.transform(Matrix.Translation(-c))
    obj.location = c

# Two-bone armature at the pivot. Bones pointing straight up with no roll export as glTF
# joints with identity rotation, which the hero's head.rotation.set() needs.
rig = bpy.data.objects.new("Rig", bpy.data.armatures.new("Rig"))
skin.users_collection[0].objects.link(rig)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode="EDIT")
bones = rig.data.edit_bones
bust_bone = bones.new("Bust")
head_bone = bones.new("Head")
for bone in (bust_bone, head_bone):
    bone.head, bone.tail, bone.roll = (0, 0, 0), (0, 0, 1), 0.0
head_bone.parent, head_bone.use_connect = bust_bone, False
bpy.ops.object.mode_set(mode="OBJECT")
mod = skin.modifiers.new("Rig", "ARMATURE")
mod.object = rig

glasses = bpy.data.objects.new("Glasses", None)
skin.users_collection[0].objects.link(glasses)
bpy.context.view_layer.update()
for obj in (eye_human, eye_red, glasses):
    mw = obj.matrix_world.copy()
    obj.parent, obj.parent_type, obj.parent_bone = rig, "BONE", "Head"
    bpy.context.view_layer.update()
    obj.matrix_world = mw  # bone children sit at the bone tail; keep the world placement
bpy.context.view_layer.update()


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


red = srgb("ff2a1a")
mats = {skin: material("Skin", srgb("c8957c"), 0.55),
        eye_human: material("EyeWhite", srgb("f2efe9"), 0.3),
        eye_red: material("EyeRed", red, 0.2, emission=(red, 4.0))}
for obj, mat in mats.items():
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.material_index = 0
        poly.use_smooth = True

for obj in list(bpy.data.objects):
    if obj not in mats and obj not in (glasses, rig):
        bpy.data.objects.remove(obj, do_unlink=True)

lib.save(ns)
top = max(v.co.z for v in skin.data.vertices)
low = min(v.co.z for v in skin.data.vertices)
print(f"head build: k {k:.3f}, crown {top:.2f}, bust bottom {low:.2f}, eyes at {tuple(round(x, 2) for x in eye_red.matrix_world.translation)}")
