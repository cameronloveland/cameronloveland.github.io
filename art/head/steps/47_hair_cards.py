"""Step 47: hair cards, so the hair, beard and brows read as hair rather than solid shells.

Cards grow out of the shells 45_hair.py made (found by their Hair and Beard materials),
which stay underneath as the dense base colour:
- top: long cards swept up, forward and toward his right, tallest along the centre ridge,
  turned in clumps by a smooth swirl so neighbours point together and clumps disagree,
  with a few flyaways and varied lift and curl (the messy faux hawk);
- sides and back: short cards lying down and back (the fade);
- beard and moustache: short, fine cards lying close along the face from a denser strand
  texture, shorter at the edges, dark and grey mixed for salt and pepper; the moustache
  keeps its full length and combs down over the lip;
- brows: fine cards pointing outward.
Cards stay inside the Skin mesh with the weights of the shell under them, so they turn and
bend with it. Hero units, Blender Z up, face toward -Y.
"""
import math
import os
import random
import sys

import bmesh
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cards  # noqa: E402
import lib  # noqa: E402

ns = lib.parse_args()
skin = lib.get("Skin")

SEED = 11
HAIR_DARK, HAIR_LIGHT, LIGHT_SHARE = "2a1d16", "5b4636", 0.2
BEARD_DARK, BEARD_GREY, GREY_SHARE = "3a2e27", "8f8983", 0.38
BROW_Z = 0.42           # Hair-shell faces below this (and in front) are brows
TOP_X = 0.62            # |x| inside which the top gets the long faux hawk cards
# (cards per unit area, length range, width, segments, lift degree range, curl range)
TOP = (260, (0.22, 0.55), 0.14, 3, (40, 80), (-0.7, 0.2))
SIDE = (260, (0.06, 0.1), 0.08, 1, (10, 20), (-0.15, -0.05))
BEARD = (1700, (0.06, 0.1), 0.06, 1, (20, 38), (-0.15, 0.0))
BROW = (900, (0.05, 0.07), 0.035, 1, (10, 14), (-0.1, -0.1))
SWIRL_DEG, SWIRL_FREQ = 50, (5.0, 4.0)   # clump turn: size and spatial frequency in x and y
FLYAWAY_SHARE, FLYAWAY_DEG = 0.08, 70     # a few top cards turned far off their clump
HAWK_WIDTH, HAWK_SIDE = 0.55, 0.45   # top length falls from the ridge to this share at HAWK_WIDTH
SWEEP = Vector((-0.35, -0.45, 0.0))   # the top sweeps toward his right and forward
EDGE_RINGS = 2          # beard cards shorten over this many face rings in from the edge
U_SPAN = 0.5            # each card shows a random half of the strand texture's width

rng = random.Random(SEED)
image = cards.strand_texture("HairStrands")
beard_image = cards.strand_texture("BeardStrands", strands=200, seed=5)

bm = bmesh.new()
bm.from_mesh(skin.data)
deform = bm.verts.layers.deform.active
uv = bm.loops.layers.uv.active
slot = {m.name: i for i, m in enumerate(skin.data.materials)}
for name in ("Hair", "Beard"):
    if name not in slot:
        lib.fail(f"Skin has no {name} material; 45_hair.py must run first")

new_slots = {}
for name, color, tex in (("HairCard", HAIR_DARK, image), ("HairCardLight", HAIR_LIGHT, image),
                         ("BeardCard", BEARD_DARK, beard_image), ("BeardCardGrey", BEARD_GREY, beard_image)):
    skin.data.materials.append(cards.card_material(name, tex, lib.srgb(color)))
    new_slots[name] = len(skin.data.materials) - 1

hair_faces = [f for f in bm.faces if f.material_index == slot["Hair"]]
beard_faces = [f for f in bm.faces if f.material_index == slot["Beard"]]

# Face rings in from the beard's edge, so cards shorten toward it.
beard_set = set(beard_faces)
ring = {}
frontier = {f for f in beard_faces if any(sum(1 for lf in e.link_faces if lf in beard_set) < 2 for e in f.edges)}
level = 0
while frontier:
    for f in frontier:
        ring[f] = level
    frontier = {lf for f in frontier for e in f.edges for lf in e.link_faces if lf in beard_set and lf not in ring}
    level += 1


def tangent(n, want):
    """want projected onto the surface, or a fallback when it points along the normal."""
    t = want - n * want.dot(n)
    if t.length < 1e-4:
        t = Vector((0.0, -1.0, -1.0)) - n * Vector((0.0, -1.0, -1.0)).dot(n)
    return t.normalized()


def turn(t, n, degrees):
    """t turned about the normal n by degrees."""
    return (t + n.cross(t) * math.tan(math.radians(max(-80.0, min(80.0, degrees))))).normalized()


def jitter(t, n, degrees):
    return turn(t, n, rng.uniform(-degrees, degrees))


def sample(f):
    w = [rng.random() + 0.05 for _ in f.verts]
    total = sum(w)
    return sum((v.co * (x / total) for v, x in zip(f.verts, w)), Vector())


def grow(faces, spec, pick, direction_of, length_of):
    density, lengths, width, segments, lift, curl = spec
    made = []
    for f in faces:
        count = f.calc_area() * density
        count = int(count) + (1 if rng.random() < count % 1 else 0)
        n = f.normal.copy()
        weights = dict(f.verts[0][deform])
        for _ in range(count):
            root = sample(f) - n * 0.01
            t = direction_of(root, n)
            a = math.radians(rng.uniform(*lift))
            d = (t * math.cos(a) + n * math.sin(a)).normalized()
            length = rng.uniform(*lengths) * length_of(root, f)
            u0 = rng.uniform(0.0, 1.0 - U_SPAN)
            made += [(c, pick()) for c in cards.card(bm, uv, deform, weights, root, d, n, length, width,
                                                     segments, rng.uniform(*curl), (u0, u0 + U_SPAN))]
    return made


def hair_pick():
    return "HairCardLight" if rng.random() < LIGHT_SHARE else "HairCard"


def beard_pick():
    return "BeardCardGrey" if rng.random() < GREY_SHARE else "BeardCard"


def is_brow(f):
    c = f.calc_center_median()
    return c.z < BROW_Z and c.y < -0.5


top = [f for f in hair_faces if not is_brow(f) and abs(f.calc_center_median().x) < TOP_X and f.calc_center_median().z > BROW_Z]
top_set = set(top)
sides = [f for f in hair_faces if not is_brow(f) and f not in top_set]
brows = [f for f in hair_faces if is_brow(f)]


def top_dir(root, n):
    want = Vector((0.0, 0.0, 1.0)) + SWEEP + Vector((-0.25 * math.copysign(1.0, root.x) * min(1.0, abs(root.x) / HAWK_WIDTH), 0.0, 0.0))
    swirl = SWIRL_DEG * math.sin(SWIRL_FREQ[0] * root.x + 1.3) * math.cos(SWIRL_FREQ[1] * root.y + 0.7)
    if rng.random() < FLYAWAY_SHARE:
        swirl += rng.choice((-1, 1)) * FLYAWAY_DEG
    return turn(tangent(n, want), n, swirl + rng.uniform(-15, 15))


def top_len(root, f):
    ax = abs(root.x)
    return HAWK_SIDE + (1 - HAWK_SIDE) * max(0.0, 1 - (ax / HAWK_WIDTH) ** 2)


made = []
made += grow(top, TOP, hair_pick, top_dir, top_len)
counts = {"top": len(made)}
made += grow(sides, SIDE, hair_pick, lambda r, n: jitter(tangent(n, Vector((0.0, 0.4, -1.0))), n, 20), lambda r, f: 1.0)
made += grow(brows, BROW, lambda: "HairCard", lambda r, n: jitter(tangent(n, Vector((math.copysign(1.0, r.x), 0.0, 0.25))), n, 15),
             lambda r, f: 1.0)


def is_moustache(root):
    return root.z > -0.55 and abs(root.x) < 0.3


def beard_dir(root, n):
    want = Vector((0.0, 0.0, -1.0))
    if is_moustache(root):  # combs down and out, over the lip
        want += Vector((math.copysign(0.6, root.x), -0.2, 0.0))
    return jitter(tangent(n, want), n, 20)


def beard_len(root, f):
    if is_moustache(root):
        return 1.2
    return 0.45 + 0.55 * min(1.0, ring.get(f, EDGE_RINGS) / EDGE_RINGS)


counts["sides+brows"] = len(made) - counts["top"]
made += grow(beard_faces, BEARD, beard_pick, beard_dir, beard_len)

color = bm.loops.layers.float_color.get("BeardColor")
for f, name in made:
    f.material_index = new_slots[name]
    f.smooth = True
    if color:
        for loop in f.loops:
            loop[color] = (1.0, 1.0, 1.0, 1.0)
bm.normal_update()
bm.to_mesh(skin.data)
bm.free()

lib.save(ns)
counts["beard"] = len(made) - counts["top"] - counts["sides+brows"]
print(f"head build: hair cards {len(made)} faces ({', '.join(f'{k} {v}' for k, v in counts.items())})")
