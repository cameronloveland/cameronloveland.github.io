"""Step 45: a dark scalp shell of the skin itself, under the hair mesh.

The scalp's skin faces are copied and pushed out along the skin normals, so the shell
follows the head exactly and costs no texture. The copy stays inside the Skin mesh on one
more material, `Hair`, and keeps the skin's weights. Its edges taper toward the skin so it
thins out instead of ending in a step. It sits just under the fitted hair mesh
(42_hair_models.py), so the cut-out gaps in the hair show dark hair, not bare scalp, and
the faded sides read as short hair. The beard and brows are their fitted meshes alone.

The region comes from MPFB's `scalp`, `lips` and `ears` groups (kept by 30_bust.py) and
from lines in hero units, tuned by eye against the reference photo. Blender Z up, face to -Y.
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

HAIR_COLOR = "2a1d16"       # dark brown
HAIRLINE_Z = 0.58           # front hairline height at the centre
HAIRLINE_TEMPLE = 0.48      # hairline height where it turns down past the temples
SIDE_X = 0.62               # beyond this the sides are faded short
TOP_DEPTH, SIDE_DEPTH = 0.02, 0.015  # how far the base layer stands off the scalp (under the hair mesh)
TAPER_RINGS = 2             # edge rings over which a shell thins toward the skin
EDGE_SMOOTH = 10            # passes that round a shell's stepped border into a curve
EDGE_SHARE = 0.25           # the thickness left at the very edge, so it never z-fights


def temple(co):
    """Short side hair from the temple down in front of the ear, joining the sideburn."""
    return abs(co.x) > 0.66 and -0.62 < co.y < 0.05 and 0.0 < co.z < 0.7


def hair(co):
    if co.y < -0.3:  # the front: above a hairline that dips at the temples
        line = HAIRLINE_Z - (HAIRLINE_Z - HAIRLINE_TEMPLE) * min(1.0, abs(co.x) / SIDE_X) ** 2
        line += 0.035 * math.sin(co.x * 13.0 + 0.6)  # uneven, so it reads as hair, not a cap
        return co.z > line
    return co.z > -0.55  # sides and back down to the nape; the scalp group bounds it


def hair_depth(co):
    side = min(1.0, max(0.0, (abs(co.x) - SIDE_X) / 0.25)) * (1.0 if co.z < 0.6 else 0.0)
    return TOP_DEPTH + (SIDE_DEPTH - TOP_DEPTH) * side


groups = {g.name: g.index for g in skin.vertex_groups}
for name in ("scalp", "lips", "ears"):
    if name not in groups:
        lib.fail(f"Skin has no {name} group; 30_bust.py must keep MPFB's region groups")

bm = bmesh.new()
bm.from_mesh(skin.data)
deform = bm.verts.layers.deform.active
bm.verts.ensure_lookup_table()


def member(v, name):
    return v[deform].get(groups[name], 0.0) > 0.5


skin_slot = skin.data.materials.find("Skin")
skin_verts = {v for f in bm.faces if f.material_index == skin_slot for v in f.verts}
depth = {}
for v in bm.verts:
    if v not in skin_verts or member(v, "ears") or member(v, "lips"):
        continue
    co = v.co
    if (member(v, "scalp") and hair(co)) or temple(co):
        depth[v.index] = hair_depth(co)

faces = [f for f in bm.faces if all(v.index in depth for v in f.verts)]
inside = {v.index for f in faces for v in f.verts}
face_set = set(faces)

# Rings in from the shell's edge: 0 on the border, counting up toward the middle.
ring = {}
frontier = {v.index for f in faces for e in f.edges
            if sum(1 for lf in e.link_faces if lf in face_set) < 2 for v in e.verts}
level = 0
while frontier:
    for i in frontier:
        ring[i] = level
    nxt = set()
    for i in frontier:
        for e in bm.verts[i].link_edges:
            j = e.other_vert(bm.verts[i]).index
            if j in inside and j not in ring:
                nxt.add(j)
    frontier = nxt
    level += 1

normals = {i: bm.verts[i].normal.copy() for i in inside}
skin_co = {i: bm.verts[i].co.copy() for i in inside}
skin_faces = [f for f in bm.faces if f.material_index == skin_slot]  # not the joined hair meshes
surface = BVHTree.FromPolygons([v.co.copy() for v in bm.verts], [[v.index for v in f.verts] for f in skin_faces])
originals = {bm.verts[i] for i in inside}
dup = bmesh.ops.duplicate(bm, geom=faces)
for old, new in dup["vert_map"].items():  # the map runs both ways; take original -> copy
    if old not in originals:
        continue
    i = old.index
    taper = EDGE_SHARE + (1 - EDGE_SHARE) * min(1.0, ring.get(i, TAPER_RINGS) / TAPER_RINGS)
    new.co = old.co + normals[i] * depth[i] * taper

# Round the stepped borders: relax each border loop along itself, then put it back on the
# skin at the edge thickness. Face-by-face selection on a coarse mesh leaves stair steps.
new_faces = [g for g in dup["geom"] if isinstance(g, bmesh.types.BMFace)]
copy_of = {new: old.index for old, new in dup["vert_map"].items() if old in originals}
edges = {e for f in new_faces for e in f.edges if len(e.link_faces) == 1}
border_nbrs = {}
for e in edges:
    for v in e.verts:
        border_nbrs.setdefault(v, []).append(e.other_vert(v))
for _ in range(EDGE_SMOOTH):
    moved = {v: v.co * 0.5 + sum((n.co for n in nbrs), Vector()) * (0.5 / len(nbrs)) for v, nbrs in border_nbrs.items()}
    for v, co in moved.items():
        hit, normal, _, _ = surface.find_nearest(co)
        v.co = hit + normal * depth[copy_of[v]] * EDGE_SHARE

mat = bpy.data.materials.new("Hair")
mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (*lib.srgb(HAIR_COLOR), 1.0)
bsdf.inputs["Roughness"].default_value = 0.85
skin.data.materials.append(mat)
hair_slot = len(skin.data.materials) - 1
for f in new_faces:
    f.material_index = hair_slot
    f.smooth = True
bm.to_mesh(skin.data)
bm.free()

for name in ("scalp", "lips", "ears"):
    skin.vertex_groups.remove(skin.vertex_groups[name])

lib.save(ns)
print(f"head build: scalp shell {len(new_faces)} faces")
