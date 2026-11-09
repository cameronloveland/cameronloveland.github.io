"""Step 40: a hoodie on the bust, hood down.

Built here from the bust itself, so it is CC0 by construction:
- body: the skin below the collar line, smoothed (no anatomy shows through cloth) and
  pushed out along its normals;
- hood: a soft roll swept around the neckline, thin at the front where its two edges cross
  in a shallow V and thick at the back and sides where the lowered hood bunches up, with a
  flattened, uneven section and folds along it so it reads as cloth, not a tube;
- drawstrings: two flat cords of uneven length coming out of metal eyelets, following the
  chest with a slight drift, a knot and an aglet at each tip.
The skin hidden under the hoodie is deleted so it cannot poke through. The hoodie is
bone-parented to Bust (static), so the neck above the collar still bends with Head.
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
skin = lib.get("Skin")
rig = lib.get("Rig")

# Hero units (glTF Y up is Blender Z up here; the face points to -Y). Placement follows
# the joints that 30_bust.py records, so a likeness step that reshapes the neck or the
# shoulders moves the hoodie with them. Values were tuned on the default MPFB body.
neck = Vector(skin["joint_neck"])
shoulder_half_width = abs(Vector(skin["joint_l_shoulder"]).x)
# The neckline tilts like a real one: low at the front of the neck, higher at the back.
COLLAR_MID, COLLAR_TILT = neck.z - 0.20, 0.25   # z at y 0, and the rise per unit toward the back


def collar_z(y):
    return COLLAR_MID + COLLAR_TILT * y


EASE = 0.09                 # how far the cloth sits off the body
SMOOTH_PASSES = 4           # enough to lose the anatomy, not the shoulders
HIDDEN_DEPTH = 0.35         # skin this far below the neckline is under the hoodie
ROLL_FRONT, ROLL_BACK = 0.07, 0.30  # hood roll radius at the front and back of the neck
CORD_X = 0.114 * shoulder_half_width
CORD_LENGTHS = {-1: 0.98, 1: 0.84}  # the cords never hang level
CORD_R, CORD_FLAT = 0.02, 0.45   # half width, and depth as a share of it (a flat cord)
CORD_ROWS = 18
FOLDS = ((7, 0.5, 0.10), (13, 2.0, 0.05), (4, 1.1, 0.06))  # (count round the roll, phase, size)
V_DIP, V_HALF = 0.07, 0.22       # the front crossover dips this much over this half width
UP = Vector((0, 0, 1))


def face_out(bm, verts, centre):
    """Add a face and make it point away from `centre` (the axis of the tube it is on)."""
    f = bm.faces.new(verts)
    f.normal_update()
    if f.normal.dot(f.calc_center_median() - centre) < 0:
        f.normal_flip()
    return f


# --- body ---------------------------------------------------------------------------
bm = bmesh.new()
bm.from_mesh(skin.data)
for layer in list(bm.loops.layers.uv.values()):  # the cloth carries no texture or weights
    bm.loops.layers.uv.remove(layer)
for layer in list(bm.verts.layers.deform.values()):
    bm.verts.layers.deform.remove(layer)
bmesh.ops.delete(bm, geom=[f for f in bm.faces if not all(v.co.z < collar_z(v.co.y) for v in f.verts)], context="FACES")
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
inner = [v for v in bm.verts if not v.is_boundary]
for _ in range(SMOOTH_PASSES):
    bmesh.ops.smooth_vert(bm, verts=inner, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
bm.normal_update()
for v in bm.verts:
    v.co += v.normal * EASE
for _ in range(2):
    bmesh.ops.smooth_vert(bm, verts=inner, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)

# The neckline: walk the boundary edges from the highest boundary vertex (the bottom cut
# is far below) until the loop closes, so the order follows the mesh, not an angle.
start = max((v for v in bm.verts if v.is_boundary), key=lambda v: v.co.z)
loop, prev, cur = [start], None, start
for _ in range(len(bm.verts)):
    nxt = next((e.other_vert(cur) for e in cur.link_edges if e.is_boundary and e.other_vert(cur) is not prev), None)
    if nxt is None:
        lib.fail("hoodie neckline is not a closed loop")
    if nxt is start:
        break
    loop.append(nxt)
    prev, cur = cur, nxt
else:
    lib.fail("hoodie neckline did not close")
if len(loop) < 12:
    lib.fail(f"hoodie neckline too short ({len(loop)} verts)")
ring = [v.co.copy() for v in loop]
if sum(a.x * b.y - b.x * a.y for a, b in zip(ring, ring[1:] + ring[:1])) < 0:
    ring.reverse()  # counter-clockwise seen from above, so (t.y, -t.x) points outward
# The cut edge zigzags along the mesh; average neighbours so the roll follows a smooth line.
for _ in range(6):
    ring = [(ring[i - 1] + ring[i] * 2 + ring[(i + 1) % len(ring)]) / 4 for i in range(len(ring))]
cx = sum(p.x for p in ring) / len(ring)
cy = sum(p.y for p in ring) / len(ring)
body = bpy.data.meshes.new("HoodieBody")
bm.to_mesh(body)
bm.free()

# --- hood roll ----------------------------------------------------------------------
# Sweep a circle around the neckline, resampled evenly by arc length. `back` is 0 at the
# front of the neck and 1 at the back, where the lowered hood bunches up.
SEG, SIDES = 96, 14
seglen = [(ring[(i + 1) % len(ring)] - ring[i]).length for i in range(len(ring))]
total = sum(seglen)


def ring_at(dist):
    """Neckline point `dist` along the loop, and the loop's tangent there."""
    dist %= total
    for i, length in enumerate(seglen):
        if dist <= length or i == len(seglen) - 1:
            a, b = ring[i], ring[(i + 1) % len(ring)]
            return a.lerp(b, dist / length if length else 0.0), (b - a).normalized()
        dist -= length


half_depth = max(abs(p.y - cy) for p in ring) or 1.0
bm = bmesh.new()
rows, centres = [], []
for i in range(SEG):
    t = i / SEG
    p, tangent = ring_at(total * t)
    out = Vector((tangent.y, -tangent.x, 0)).normalized()
    back = min(1.0, max(0.0, ((p.y - cy) / half_depth + 1) / 2))
    w = back * back * (3 - 2 * back)  # smoothstep
    fold = sum(size * math.sin(2 * math.pi * count * t + phase) for count, phase, size in FOLDS)
    r = (ROLL_FRONT + (ROLL_BACK - ROLL_FRONT) * w) * (1 + fold * (0.4 + 0.6 * w))
    flat = 1.0 - 0.35 * w   # the bunched hood lies flatter on the shoulders and back
    front = max(0.0, 1 - abs(p.x - cx) / V_HALF) * (1 - w)
    centre = p + out * (r * 0.55) + Vector((0, 0.10 * w, -0.10 * w + r * 0.25 * flat - V_DIP * front * front))
    centres.append(centre)
    ripple = 2 * math.pi * t * 5
    rows.append([bm.verts.new(centre + r * (1 + 0.08 * math.sin(3 * a + ripple)) * (math.cos(a) * out + flat * math.sin(a) * UP))
                 for a in (2 * math.pi * k / SIDES for k in range(SIDES))])
for i in range(SEG):
    a, b = rows[i], rows[(i + 1) % SEG]
    axis = (centres[i] + centres[(i + 1) % SEG]) / 2
    for k in range(SIDES):
        face_out(bm, (a[k], a[(k + 1) % SIDES], b[(k + 1) % SIDES], b[k]), axis)
roll = bpy.data.meshes.new("HoodieRoll")
bm.to_mesh(roll)
bm.free()

# --- drawstrings --------------------------------------------------------------------
# Each cord leaves an eyelet at the front of the roll and falls down the chest just off
# its surface, drifting a little outward with a gentle sway. The cord is flat (wider than
# deep) and ends in a knot and an aglet.
body_bvh = BVHTree.FromPolygons([v.co for v in body.vertices], [p.vertices for p in body.polygons])
bm = bmesh.new()
metal_faces = set()
front_y = min(p.y for p in ring)
CORD_SIDES = 8


def cord_ring(p, d, half, depth):
    across = Vector((1, 0, 0)) - d * d.x
    across.normalize()
    deep = d.cross(across)
    return [bm.verts.new(p + across * (half * math.cos(a)) + deep * (depth * math.sin(a)))
            for a in (2 * math.pi * k / CORD_SIDES for k in range(CORD_SIDES))]


def band(r0, r1, axis):
    return [face_out(bm, (r0[k], r0[(k + 1) % CORD_SIDES], r1[(k + 1) % CORD_SIDES], r1[k]), axis)
            for k in range(CORD_SIDES)]


for side in (-1, 1):
    length = CORD_LENGTHS[side]
    top_z = collar_z(front_y) - V_DIP * 0.6
    pts = []
    for j in range(CORD_ROWS + 1):
        t = j / CORD_ROWS
        z = top_z - length * t
        x = side * (CORD_X + 0.03 * t * t) + 0.012 * math.sin(math.pi * 1.4 * t + side)
        hit, *_ = body_bvh.ray_cast(Vector((x, front_y - 3, z)), Vector((0, 1, 0)))
        y = (hit.y if hit else front_y) - CORD_R * CORD_FLAT - 0.006
        pts.append(Vector((x, y, z)))
    pts[0].y -= 0.03  # the eyelet sits on the roll, in front of the chest
    rings = []
    for j, p in enumerate(pts):
        d = (pts[min(j + 1, len(pts) - 1)] - pts[max(j - 1, 0)]).normalized()
        knot = 1.7 if j == len(pts) - 4 else 1.0
        rings.append(cord_ring(p, d, CORD_R * knot, CORD_R * CORD_FLAT * knot))
    for j in range(len(rings) - 1):
        band(rings[j], rings[j + 1], (pts[j] + pts[j + 1]) / 2)
    # Aglet: a narrow round tube past the end of the cord, capped.
    d = (pts[-1] - pts[-2]).normalized()
    tip = pts[-1] + d * 0.07
    a0 = cord_ring(pts[-1], d, CORD_R * 0.7, CORD_R * 0.7)
    a1 = cord_ring(tip, d, CORD_R * 0.6, CORD_R * 0.6)
    metal_faces.update(band(a0, a1, (pts[-1] + tip) / 2))
    metal_faces.add(face_out(bm, a1, pts[-1]))
    # Eyelet: a small metal ring round the cord where it leaves the hood, facing forward.
    e, R, r = pts[0] + Vector((0, -0.005, 0.01)), CORD_R * 1.6, 0.007
    us = [2 * math.pi * i / 10 for i in range(10)]
    vs = [2 * math.pi * k / 4 for k in range(4)]
    grid = [[bm.verts.new(e + Vector((math.cos(u) * (R + r * math.cos(v)), -r * math.sin(v), math.sin(u) * (R + r * math.cos(v)))))
             for v in vs] for u in us]
    for i in range(10):
        u = (us[i] + math.pi / 10)
        core = e + Vector((math.cos(u) * R, 0, math.sin(u) * R))
        for k in range(4):
            metal_faces.add(face_out(bm, (grid[i][k], grid[i][(k + 1) % 4], grid[(i + 1) % 10][(k + 1) % 4], grid[(i + 1) % 10][k]), core))
for f in bm.faces:
    f.material_index = 1 if f in metal_faces else 0
cords = bpy.data.meshes.new("HoodieCords")
bm.to_mesh(cords)
bm.free()

# --- one object, two materials ------------------------------------------------------
hoodie_mesh = bpy.data.meshes.new("Hoodie")
bm = bmesh.new()
for part, base in ((body, 0), (roll, 0), (cords, 1)):
    start = len(bm.faces)
    bm.from_mesh(part)
    bm.faces.ensure_lookup_table()
    for f in bm.faces[start:]:
        f.material_index = base + f.material_index  # cords: 0 cord, 1 aglet and eyelet
        f.smooth = True
bm.to_mesh(hoodie_mesh)
bm.free()
for part in (body, roll, cords):
    bpy.data.meshes.remove(part)


def material(name, hex_color, roughness, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    lin = [(int(hex_color[i:i + 2], 16) / 255) for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in lin]
    bsdf.inputs["Base Color"].default_value = (*lin, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


hoodie_mesh.materials.append(material("Hoodie", "1d1d1f", 0.95))  # black
hoodie_mesh.materials.append(material("Drawstring", "2c2c2f", 0.85))
hoodie_mesh.materials.append(material("Aglet", "6e6e72", 0.35, 0.8))
hoodie = bpy.data.objects.new("Hoodie", hoodie_mesh)
skin.users_collection[0].objects.link(hoodie)
bpy.context.view_layer.update()
hoodie.parent, hoodie.parent_type, hoodie.parent_bone = rig, "BONE", "Bust"
bpy.context.view_layer.update()
hoodie.matrix_world = Matrix.Identity(4)  # bone children sit at the bone tail; keep it at the origin
bpy.context.view_layer.update()

# --- hide the skin under the cloth --------------------------------------------------
bm = bmesh.new()
bm.from_mesh(skin.data)
hidden = [f for f in bm.faces if all(v.co.z < collar_z(v.co.y) - HIDDEN_DEPTH for v in f.verts)]
bmesh.ops.delete(bm, geom=hidden, context="FACES")
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
bm.to_mesh(skin.data)
bm.free()
skin.data.update()

lib.save(ns)
print(f"head build: hoodie {len(hoodie_mesh.polygons)} faces, neckline {len(ring)} verts, front z {collar_z(front_y):.2f}, "
      f"skin now {len(skin.data.polygons)} faces")
