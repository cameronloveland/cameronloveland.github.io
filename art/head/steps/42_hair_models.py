"""Step 42: the fitted hair, brows and beard join the Skin mesh.

20_likeness.py fits three MakeHuman CC0 meshes to the shaped head (hair short01, brows
eyebrow001, beard Sigmund from art/head/assets) and 30_bust.py carries them into hero
units. Here each gets a plain glTF material (its own texture times a tint, alpha cut out
at 0.5, which the exporter writes as alpha MASK), the hair is shaped toward Cameron's cut
(the top lifted and swept into a faux hawk, the sides pulled in tight to the head as a
fade), and all three join Skin with full Head weight, so they turn with the head and the
tear (50_tear.py) cuts them like the skin. Hero units, Blender Z up, face toward -Y.
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
skin = lib.get("Skin")
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEXTURE_SIZE = 1024         # each texture is scaled to this square before packing (budget)
# (object, material name, texture, tint): the tints darken and warm the stock colours.
MODELS = (
    ("HairModel", "HairModel", lib.mpfb_data_asset("hair", "short01", "short01_diffuse.png"), "9a7a64"),
    ("BrowModel", "BrowModel", lib.mpfb_data_asset("eyebrows", "eyebrow001", "eyebrow001.png"), "4a3a30"),
    ("BeardModel", "BeardModel", os.path.join(HERE, "assets", "beard_sigmund", "beard_diffuse.png"), "9a918a"),
)
HAWK_LIFT = 0.2             # the top's centre ridge stands this much higher
HAWK_WIDTH = 0.45           # |x| over which the lift falls to nothing
HAWK_FORWARD = 0.05         # and leans forward this much at the ridge
FADE_FROM = 0.55            # below this z on the sides the hair is pulled in to the scalp
FADE_GAP = 0.02             # how far the faded sides sit off the skin, just outside the scalp shell


def textured(name, path, tint):
    if not os.path.exists(path):
        lib.fail(f"{name}: texture {path} is missing")
    image = bpy.data.images.load(path)
    image.name = name
    if image.size[0] > TEXTURE_SIZE:
        image.scale(TEXTURE_SIZE, TEXTURE_SIZE)
    image.pack()
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = image
    mix = nodes.new("ShaderNodeMix")
    mix.data_type, mix.blend_type = "RGBA", "MULTIPLY"
    mix.inputs["Factor"].default_value = 1.0
    sockets = {s.identifier: s for s in mix.inputs}
    links.new(tex.outputs["Color"], sockets["A_Color"])
    sockets["B_Color"].default_value = (*lib.srgb(tint), 1.0)
    links.new(next(s for s in mix.outputs if s.identifier == "Result_Color"), bsdf.inputs["Base Color"])
    cut = nodes.new("ShaderNodeMath")
    cut.operation = "ROUND"
    links.new(tex.outputs["Alpha"], cut.inputs[0])
    links.new(cut.outputs["Value"], bsdf.inputs["Alpha"])
    bsdf.inputs["Roughness"].default_value = 0.85
    bsdf.inputs["Specular IOR Level"].default_value = 0.25  # hair is not glossy plastic
    mat.surface_render_method = "DITHERED"
    mat.use_backface_culling = False
    return mat


# The skin before anything joins, to pull the faded sides onto it.
scalp = BVHTree.FromPolygons([v.co.copy() for v in skin.data.vertices], [p.vertices[:] for p in skin.data.polygons])
uv_name = skin.data.uv_layers.active.name
head_group = skin.vertex_groups["Head"].name

parts = []
for obj_name, mat_name, path, tint in MODELS:
    obj = lib.get(obj_name)
    if obj.data.shape_keys:
        obj.shape_key_clear()
    if not obj.data.uv_layers:
        lib.fail(f"{obj_name} has no UV map")
    obj.data.uv_layers.active.name = uv_name  # join merges UV maps by name
    for extra in [layer for layer in obj.data.uv_layers if layer.name != uv_name]:
        obj.data.uv_layers.remove(extra)
    obj.data.materials.clear()
    obj.data.materials.append(textured(mat_name, path, tint))
    for poly in obj.data.polygons:
        poly.material_index = 0
        poly.use_smooth = True
    for group in list(obj.vertex_groups):
        obj.vertex_groups.remove(group)
    obj.vertex_groups.new(name=head_group).add(range(len(obj.data.vertices)), 1.0, "REPLACE")
    obj.modifiers.clear()
    parts.append(obj)

# Faux hawk and fade on the hair alone.
hair = lib.get("HairModel")
for v in hair.data.vertices:
    co = v.co
    ridge = max(0.0, 1.0 - (abs(co.x) / HAWK_WIDTH) ** 2)
    top = min(1.0, max(0.0, (co.z - FADE_FROM) / 0.25))
    co.z += HAWK_LIFT * ridge * top
    co.y -= HAWK_FORWARD * ridge * top
    if co.z < FADE_FROM and abs(co.x) > 0.4:
        hit, normal, _, _ = scalp.find_nearest(co)
        if hit is not None:
            pull = min(1.0, (FADE_FROM - co.z) / 0.2)
            co[:] = co.lerp(hit + normal * FADE_GAP, pull)
hair.data.update()

counts = {o.name: len(o.data.polygons) for o in parts}
bpy.ops.object.select_all(action="DESELECT")
for obj in parts:
    obj.select_set(True)
skin.select_set(True)
bpy.context.view_layer.objects.active = skin
bpy.ops.object.join()
if skin.data.uv_layers.active.name != uv_name:
    lib.fail("the joined skin lost its UV map")

lib.save(ns)
print(f"head build: hair models joined ({', '.join(f'{k} {v}' for k, v in counts.items())} faces)")
