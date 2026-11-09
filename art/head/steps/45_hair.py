"""Step 45: hair, beard, mustache and brows as shells of the skin itself.

Each region's skin faces are copied and pushed out along the skin normals, so the hair
follows the head exactly and costs no textures. The copies stay inside the Skin mesh on
two more materials, `Hair` and `Beard`, and keep the skin's Head and Bust weights, so the beard on the
neck bends with it when the head turns. Shell edges taper toward the skin so the hair
thins out instead of ending in a step. These are the base layer; 47_hair_cards.py grows
hair cards out of them.

Regions come from MPFB's `scalp`, `lips` and `ears` groups (kept by 30_bust.py) and from
lines in hero units, tuned by eye against the reference photo. Blender Z up, face to -Y.
"""
import math
import os
import random
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
BEARD_DARK, BEARD_GREY = "352b25", "8c8680"  # salt and pepper: each beard vertex mixes the two
BEARD_FADE_RINGS = 2        # edge rings over which the beard colour fades into the skin
BEARD_EDGE = 0.45           # beard colour share at the very edge, so narrow parts keep their colour
MOUSTACHE_JOIN = 0.35       # beard colour share beside the mouth corners, so the moustache join is faint
HAIRLINE_Z = 0.58           # front hairline height at the centre
HAIRLINE_TEMPLE = 0.48      # hairline height where it turns down past the temples
SIDE_X = 0.62               # beyond this the sides are faded short
TOP_DEPTH, SIDE_DEPTH = 0.05, 0.03   # how far the base layer stands off the scalp
BEARD_DEPTH, BROW_DEPTH = 0.022, 0.025
MOUSTACHE_GAP = (0.27, 0.42)  # |x| band beside the mouth corners where the join is faint
TAPER_RINGS = 2             # edge rings over which a shell thins toward the skin
EDGE_SMOOTH = 10            # passes that round a shell's stepped border into a curve
EDGE_SHARE = 0.25           # the thickness left at the very edge, so it never z-fights
SEED = 7                    # salt and pepper mix


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


def beard(co):
    """Jaw, chin, cheeks and upper lip, plus sideburns up to the hair in front of the ears."""
    if co.y > 0.15:
        return False
    ax = abs(co.x)
    cheek_top = -0.40 + (ax - 0.3) * 0.55 if ax > 0.3 else -0.37  # from the mouth corner, low across the cheek
    if ax > 0.66 and co.y > -0.62:
        cheek_top = 0.05  # sideburns, up to the temple hair
    neck_floor = -1.3 + max(0.0, co.y + 0.4) * 1.5  # a trimmed neckline under the chin, up to the jaw angle
    return neck_floor < co.z < cheek_top


def brow(co, eye):
    dx = abs(co.x) - abs(eye.x)
    if co.y > -0.55 or co.x * eye.x <= 0 or not -0.24 < dx < 0.3:
        return False
    centre = eye.z + 0.12 + 0.02 * (1 - (dx / 0.26) ** 2)
    return abs(co.z - centre) < 0.065


eye_l, eye_r = (Vector(skin[f"joint_{s}_eye"]) for s in ("l", "r"))
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


depth, kind = {}, {}
for v in bm.verts:
    if member(v, "ears") or member(v, "lips"):
        continue
    co = v.co
    if (member(v, "scalp") and hair(co)) or temple(co):
        depth[v.index], kind[v.index] = hair_depth(co), "Hair"
    elif beard(co):
        depth[v.index], kind[v.index] = BEARD_DEPTH, "Beard"
    elif brow(co, eye_l) or brow(co, eye_r):
        depth[v.index], kind[v.index] = BROW_DEPTH, "Hair"

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
surface = BVHTree.FromBMesh(bm)
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

rng = random.Random(SEED)

# Beard colour per vertex: a salt and pepper mix, faded into the skin colour over the edge
# rings and kept faint beside the mouth corners. Every other vertex stays white, so the
# colour attribute leaves the skin and hair materials as they are (glTF puts it on every
# primitive of the mesh, and three.js multiplies each material's colour by it).
skin_rgb = Vector(skin.data.materials["Skin"].node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value[:3])
dark, grey = Vector(lib.srgb(BEARD_DARK)), Vector(lib.srgb(BEARD_GREY))
beard_rgb = {}
for v, i in copy_of.items():
    if kind[i] != "Beard":
        continue
    share = BEARD_EDGE + (1 - BEARD_EDGE) * min(1.0, ring.get(i, BEARD_FADE_RINGS) / BEARD_FADE_RINGS)
    co = skin_co[i]
    if MOUSTACHE_GAP[0] < abs(co.x) < MOUSTACHE_GAP[1] and co.z > -0.78:
        share *= MOUSTACHE_JOIN
    elif abs(co.x) <= MOUSTACHE_GAP[0] and co.z > -0.5:
        share = 1.0  # the moustache strip is too narrow to fade; give it the full colour
    mix = dark.lerp(grey, rng.uniform(0.0, 0.35))
    beard_rgb[v] = skin_rgb.lerp(mix, share)

slots = {}
for name in ("Hair", "Beard"):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    if name == "Beard":
        attr = mat.node_tree.nodes.new("ShaderNodeVertexColor")
        attr.layer_name = "BeardColor"
        mat.node_tree.links.new(attr.outputs["Color"], bsdf.inputs["Base Color"])
    else:
        bsdf.inputs["Base Color"].default_value = (*lib.srgb(HAIR_COLOR), 1.0)
    bsdf.inputs["Roughness"].default_value = 0.85
    skin.data.materials.append(mat)
    slots[name] = len(skin.data.materials) - 1
for f in new_faces:  # a face where hair meets beard goes to whichever most of its corners are
    kinds = [kind[copy_of[v]] for v in f.verts]
    f.material_index = slots[max(set(kinds), key=kinds.count)]
    f.smooth = True
color = bm.loops.layers.float_color.new("BeardColor")
hair_rgb = Vector(lib.srgb(HAIR_COLOR))
for f in bm.faces:
    beard_face = f.material_index == slots["Beard"]
    for loop in f.loops:
        rgb = beard_rgb.get(loop.vert, hair_rgb) if beard_face else (1.0, 1.0, 1.0)
        loop[color] = (*rgb, 1.0)
bm.to_mesh(skin.data)
bm.free()

for name in ("scalp", "lips", "ears"):
    skin.vertex_groups.remove(skin.vertex_groups[name])

lib.save(ns)
print(f"head build: hair and beard shells {len(new_faces)} faces")
