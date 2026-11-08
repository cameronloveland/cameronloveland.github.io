"""Step 40: a hoodie on the bust, hood down.

Built here from the bust itself, so it is CC0 by construction:
- body: the skin below the collar line, smoothed (no anatomy shows through cloth) and
  pushed out along its normals;
- hood: a soft roll swept around the neckline, thin at the front like a collar rib and
  thick at the back and sides where the lowered hood bunches up;
- drawstrings: two cords hanging down the front.
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
CORD_LENGTH, CORD_R = 0.95, 0.018
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
SEG, SIDES = 72, 14
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
    p, tangent = ring_at(total * i / SEG)
    out = Vector((tangent.y, -tangent.x, 0)).normalized()
    back = min(1.0, max(0.0, ((p.y - cy) / half_depth + 1) / 2))
    w = back * back * (3 - 2 * back)  # smoothstep
    r = ROLL_FRONT + (ROLL_BACK - ROLL_FRONT) * w
    centre = p + out * (r * 0.55) + Vector((0, 0.10 * w, -0.06 * w + r * 0.25))
    centres.append(centre)
    rows.append([bm.verts.new(centre + r * (math.cos(a) * out + math.sin(a) * UP))
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
# Cords fall from the front of the roll, following the hoodie's chest just off its surface.
body_bvh = BVHTree.FromPolygons([v.co for v in body.vertices], [p.vertices for p in body.polygons])
bm = bmesh.new()
front_y = min(p.y for p in ring)
for side in (-1, 1):
    pts = []
    for j in range(9):
        z = collar_z(front_y) - 0.05 - CORD_LENGTH * j / 8
        hit, *_ = body_bvh.ray_cast(Vector((side * CORD_X, front_y - 3, z)), Vector((0, 1, 0)))
        y = (hit.y if hit else front_y) - CORD_R * 1.5
        pts.append(Vector((side * (CORD_X - 0.015 * j / 8), y, z)))
    prev_ring = None
    for j, p in enumerate(pts):
        r = CORD_R * (1.6 if j == len(pts) - 1 else 1.0)  # aglet at the tip
        cur_ring = [bm.verts.new(p + r * Vector((math.cos(a), math.sin(a), 0)))
                    for a in (2 * math.pi * k / 6 for k in range(6))]
        if prev_ring:
            axis = (pts[j - 1] + p) / 2
            for k in range(6):
                face_out(bm, (prev_ring[k], prev_ring[(k + 1) % 6], cur_ring[(k + 1) % 6], cur_ring[k]), axis)
        prev_ring = cur_ring
    face_out(bm, prev_ring, pts[-2])  # cap at the tip, facing down the cord
cords = bpy.data.meshes.new("HoodieCords")
bm.to_mesh(cords)
bm.free()

# --- one object, two materials ------------------------------------------------------
hoodie_mesh = bpy.data.meshes.new("Hoodie")
bm = bmesh.new()
for part, mat_index in ((body, 0), (roll, 0), (cords, 1)):
    start = len(bm.faces)
    bm.from_mesh(part)
    bm.faces.ensure_lookup_table()
    for f in bm.faces[start:]:
        f.material_index = mat_index
        f.smooth = True
bm.to_mesh(hoodie_mesh)
bm.free()
for part in (body, roll, cords):
    bpy.data.meshes.remove(part)


def material(name, hex_color, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    lin = [(int(hex_color[i:i + 2], 16) / 255) for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in lin]
    bsdf.inputs["Base Color"].default_value = (*lin, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


hoodie_mesh.materials.append(material("Hoodie", "77754f", 0.92))  # olive, as in the reference photo
hoodie_mesh.materials.append(material("Drawstring", "c9c6bf", 0.8))
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
