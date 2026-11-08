"""Step 50: the tear. A ragged patch of skin on the cyborg side (character left, +X) is torn
away from the temple across the eye and cheek to the jaw, showing a metal skull under it.

- Torn skin: skin, hair and beard faces inside a noisy patch are removed; the skin's new
  border is extruded inward into a thin lip of flesh, so the skin reads as having depth.
- Metal skull: a copy of the skin under the patch (plus a margin that tucks under the
  torn edge) shrunk inward, then shaped like bone: a brow ridge, a cheekbone with a hollow
  under it, and a sunken eye socket with a housing ring round the eye.
- EyeRed: a black lens with a small glowing red dot, Terminator style, instead of a whole
  red eye.

Everything new stays inside the Skin mesh (materials Metal, MetalDark, Flesh) and carries
Head and Bust weights, so the node contract is unchanged and the skull turns with the head.
Hero units, Blender Z up, face toward -Y.
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector, noise
from mathutils.bvhtree import BVHTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
skin = lib.get("Skin")
eye_red = lib.get("EyeRed")

# --- the patch -------------------------------------------------------------------------
PATCH_OFFSET = Vector((0.16, 0.2, -0.12))   # patch centre relative to the red eye
PATCH_RADII = Vector((0.6, 0.6, 0.95))    # ellipsoid half-sizes: across, front to back, up and down
EDGE_NOISE = ((2.5, 0.16), (7.0, 0.06))     # (frequency, amplitude) pairs that rag the border
MOUTH_KEEP = 0.8        # below the eye line the patch keeps x > 0.1 + this * depth, sparing the mouth
EAR_KEEP = (0.7, -0.25)  # x beyond and y behind which the ear stays human

# --- the skull -------------------------------------------------------------------------
METAL_DEPTH = 0.06      # how far under the skin the skull sits
LIP_DEPTH = 0.07        # depth of the torn skin's edge
EDGE_RELAX = 6          # passes that round the face-by-face border before it is ragged
EDGE_RAG = ((6.0, 0.07), (15.0, 0.035))  # (frequency, distance) noise that pushes the border in and out along the skin
MARGIN_RINGS = 2        # face rings of skull that run on under the skin past the tear
BROW = (0.2, 0.07, 0.06)      # height above the eye, half-height, how far it stands out
CHEEKBONE = (-0.24, 0.07, 0.07)  # same, below the eye; it rises 0.3 per unit toward the ear
HOLLOW = (-0.44, 0.1, -0.06)    # the hollow under the cheekbone
SOCKET_RADIUS, SOCKET_DEPTH = 0.28, 0.1
SKULL_SMOOTH = 3        # smoothing passes before the bone is shaped (one more after), ironing out the coarse mesh's creases
RING_MAJOR, RING_MINOR = 1.2, 0.035  # housing ring radius as a share of the eye radius, tube radius
DOT_DEG = 12            # red dot cone round the eye's axis
METAL, METAL_DARK, FLESH = "c9cdd3", "3a3d42", "7a2e28"
LENS, RED = "120707", "ff2a1a"


def srgb_mat(name, hex_color, metallic, roughness, emission=None):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*lib.srgb(hex_color), 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*lib.srgb(emission[0]), 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission[1]
    return mat


eye = eye_red.matrix_world.translation.copy()
centre = eye + PATCH_OFFSET


def torn(co):
    if co.z < eye.z and co.x < 0.1 + MOUTH_KEEP * (eye.z - co.z):
        return False
    if co.x > EAR_KEEP[0] and co.y > EAR_KEEP[1]:
        return False
    d = co - centre
    r = math.sqrt(sum((d[i] / PATCH_RADII[i]) ** 2 for i in range(3)))
    rag = sum(amp * noise.noise(co * freq) for freq, amp in EDGE_NOISE)
    return r < 1.0 + rag


bm = bmesh.new()
bm.from_mesh(skin.data)
bm.verts.ensure_lookup_table()
deform = bm.verts.layers.deform.active
color = bm.loops.layers.float_color["BeardColor"]
head_group = skin.vertex_groups["Head"].index
skin_slot = skin.data.materials.find("Skin")
beard_slot = skin.data.materials.find("Beard")

slots = {}
for mat in (srgb_mat("Metal", METAL, 0.55, 0.3), srgb_mat("MetalDark", METAL_DARK, 0.5, 0.4),
            srgb_mat("Flesh", FLESH, 0.0, 0.6)):
    skin.data.materials.append(mat)
    slots[mat.name] = len(skin.data.materials) - 1

inside = {v: torn(v.co) and v.co.x > 0 for v in bm.verts}
gone = [f for f in bm.faces if all(inside[v] for v in f.verts)]
gone_skin = [f for f in gone if f.material_index == skin_slot]
if not gone_skin:
    lib.fail("the tear patch removes no skin; check PATCH_OFFSET against the red eye")

# Skull source faces: the torn skin plus MARGIN_RINGS rings of skin round it.
under = set(gone_skin)
for _ in range(MARGIN_RINGS):
    under |= {lf for f in list(under) for v in f.verts for lf in v.link_faces
              if lf.material_index == skin_slot and v.co.x > 0}
# The skin alone before the tear, to keep the torn border on it (not on the shells or skull).
skin_faces = [f for f in bm.faces if f.material_index == skin_slot]
skin_verts = list({v for f in skin_faces for v in f.verts})
vert_index = {v: i for i, v in enumerate(skin_verts)}
surface = BVHTree.FromPolygons([v.co.copy() for v in skin_verts], [[vert_index[v] for v in f.verts] for f in skin_faces])
normals = {v: v.normal.copy() for f in under for v in f.verts}
originals = set(normals)
dup = bmesh.ops.duplicate(bm, geom=list(under))
skull = {old: new for old, new in dup["vert_map"].items() if old in originals}
for old, new in skull.items():
    new.co = old.co - normals[old] * METAL_DEPTH
skull_faces = [g for g in dup["geom"] if isinstance(g, bmesh.types.BMFace)]
for f in skull_faces:
    f.material_index = slots["Metal"]
    f.smooth = True

# Shape the skull like bone. Heights are relative to the eye; the cheekbone and hollow rise
# toward the ear. Each band pushes along the skin normal with a smooth falloff.
eye_radius = max(v.co.length for v in eye_red.data.vertices)
for _ in range(SKULL_SMOOTH):
    bmesh.ops.smooth_vert(bm, verts=list(skull.values()), factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
for old, new in skull.items():
    co, n = new.co.copy(), normals[old]
    dx = co.x - eye.x
    if abs(dx) < 0.3:
        for height, half, push in (BROW,):
            t = 1 - min(1.0, abs(co.z - (eye.z + height)) / half)
            new.co += n * push * t * t
    for height, half, push in (CHEEKBONE, HOLLOW):
        line = eye.z + height + 0.3 * max(0.0, dx)
        t = 1 - min(1.0, abs(co.z - line) / half)
        new.co += n * push * t * t
    # The socket: a bowl round the eye, deepest at the rim of the eye.
    d = (co - eye).length
    if d < SOCKET_RADIUS:
        t = 1 - d / SOCKET_RADIUS
        new.co += Vector((0.0, 1.0, 0.0)) * SOCKET_DEPTH * t
bmesh.ops.smooth_vert(bm, verts=list(skull.values()), factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
for new in skull.values():
    if (new.co - eye).length < eye_radius * 1.05:  # never inside the eye
        new.co = eye + (new.co - eye).normalized() * eye_radius * 1.05

bmesh.ops.delete(bm, geom=gone, context="FACES")

# The torn skin's edge: extrude the new border of the skin inward into a lip of flesh.
border = [e for e in bm.edges if e.is_boundary and len(e.link_faces) == 1
          and e.link_faces[0].material_index == skin_slot
          and all(v in normals and v.co.x > 0 for v in e.verts)
          and any(any(inside.get(n2, False) for n2 in (ee.other_vert(v) for ee in v.link_edges)) or inside.get(v, False) for v in e.verts)]
# Round off the face-by-face stair steps along the border, then rag it with noise, sliding
# each vertex along the skin across the border line. Kept on the skin with the BVH.
nbrs = {}
for e in border:
    for v in e.verts:
        nbrs.setdefault(v, []).append(e.other_vert(v))
for _ in range(EDGE_RELAX):
    moved = {v: v.co * 0.5 + sum((n.co for n in ns_), Vector()) * (0.5 / len(ns_)) for v, ns_ in nbrs.items()}
    for v, co in moved.items():
        v.co = surface.find_nearest(co)[0]
for v, ns_ in nbrs.items():
    along = (ns_[0].co - ns_[-1].co).normalized()
    across = normals[v].cross(along).normalized() if v in normals else Vector()
    rag = sum(dist * noise.noise(v.co * freq) for freq, dist in EDGE_RAG)
    v.co = surface.find_nearest(v.co + across * rag)[0]
lip = bmesh.ops.extrude_edge_only(bm, edges=border)
for g in lip["geom"]:
    if isinstance(g, bmesh.types.BMVert):
        base = min((v for v in normals if v.is_valid), key=lambda v: (v.co - g.co).length_squared)
        g.co = g.co - normals[base] * LIP_DEPTH
    elif isinstance(g, bmesh.types.BMFace):
        g.material_index = slots["Flesh"]
        g.smooth = True


def head_vert(co):
    v = bm.verts.new(co)
    v[deform][head_group] = 1.0
    return v


# The housing ring round the eye, on the eye's forward axis.
small = [p for p in eye_red.data.polygons if p.area < 0.25 * max(q.area for q in eye_red.data.polygons)]
axis = sum((p.normal for p in small), Vector()).normalized()
a = axis.orthogonal().normalized()
b = axis.cross(a)
ring_centre = eye + axis * eye_radius * 0.35
SEG, SIDES = 20, 6
rings = []
for i in range(SEG):
    u = 2 * math.pi * i / SEG
    spoke = a * math.cos(u) + b * math.sin(u)
    rings.append([head_vert(ring_centre + spoke * eye_radius * RING_MAJOR
                            + (spoke * math.cos(2 * math.pi * k / SIDES) + axis * math.sin(2 * math.pi * k / SIDES)) * RING_MINOR)
                  for k in range(SIDES)])
extra = []
for i in range(SEG):
    for k in range(SIDES):
        i2, k2 = (i + 1) % SEG, (k + 1) % SIDES
        extra.append((bm.faces.new((rings[i][k], rings[i2][k], rings[i2][k2], rings[i][k2])), "MetalDark"))

for f, name in extra:
    f.material_index = slots[name]
    f.smooth = name != "Metal"
bm.normal_update()

# The beard colour attribute multiplies every material in three.js; keep it white off the beard.
for f in bm.faces:
    if f.material_index != beard_slot:
        for loop in f.loops:
            loop[color] = (1.0, 1.0, 1.0, 1.0)
bm.to_mesh(skin.data)
bm.free()

# EyeRed: a black lens with a small red dot on its axis.
eye_red.data.materials.clear()
bpy.data.materials.remove(bpy.data.materials["EyeRed"])  # free the name for the new dot material
eye_red.data.materials.append(srgb_mat("EyeRed", RED, 0.0, 0.2, emission=(RED, 6.0)))
eye_red.data.materials.append(srgb_mat("EyeLens", LENS, 0.3, 0.12))
for poly in eye_red.data.polygons:
    poly.material_index = 0 if math.degrees(poly.normal.angle(axis)) < DOT_DEG else 1

lib.save(ns)
print(f"head build: tear removed {len(gone)} faces, skull {len(skull_faces)} faces, lip {len(border)} edges, "
      f"eye radius {eye_radius:.2f}")
