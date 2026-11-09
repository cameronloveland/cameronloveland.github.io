"""Step 55: dark semi-rimless rectangular glasses, as Cameron wears them.

Replaces the `Glasses` empty with a mesh of the same name, still bone-parented to `Head`:
- each lens is a squarish rectangle (a superellipse, flat along the top, a little rounder
  and narrower at the bottom); a thin, crisp black bar (a clear coat over a dark base) runs
  along its top half only, and the bottom half is held by a fine nylon line in a groove,
  so there the lens's own polished edge shows;
- the lenses are thin, faintly tinted and wrapped and tilted to the face;
- a keyhole bridge over the nose, with two clear nose pads on thin metal pad arms;
- the temple arm is a flat bar that tapers from the hinge, runs straight back to the top
  of the ear and tucks down behind it, close to the head.
On the cyborg side the lens and the arm are gone, blown off with that half of the face:
only a snapped stub of rim hangs off the bridge. Placed from the eyes and the head's own
surface, in hero units, Blender Z up, face to -Y.
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Matrix, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
skin = lib.get("Skin")
rig = lib.get("Rig")

LENS_W, LENS_H = 0.52, 0.32     # lens size
LENS_OUT = 0.04                 # lens centre this much further out than the eye
LENS_DROP = 0.02                # lens centre this much below the eye
SQUARE_TOP, SQUARE_BOTTOM = 6.0, 3.6   # superellipse exponents: higher is squarer
BOTTOM_TAPER = 0.06             # the bottom is this share narrower than the top
OUTLINE_POINTS = 40
THICK = 0.014                   # lens thickness
GAP = 0.1                       # lens clearance in front of the face
WRAP_DEG, TILT_DEG = 10, 8      # outer edge swept back; bottom tilted toward the face
RIM_W, RIM_TOP = 0.014, 0.008   # top bar face width over the lens edge, plus this much more at the top
RIM_D = 0.02                    # top bar depth front to back
ROUND = 0.003                   # the bar's and arm's edges are rounded with this small radius
RIM_FROM = -0.1                 # the bar runs over the outline above this share of the half height
LINE_R = 0.0035                 # the nylon line's radius
ARM_H, ARM_TIP_H, ARM_T = 0.036, 0.02, 0.014   # arm height at the hinge and at the tip, thickness
END_LEN = 0.07                  # end piece: from the rim's outer corner back to the hinge
PAD = (0.03, 0.012, 0.048)      # nose pad half-sizes: across, front to back, up and down
PAD_ARM = 0.005                 # pad arm wire radius
GLASS, FRAME, METAL, LINE = "dfe9ee", "121112", "b8bcc2", "aab0b5"

eyes = [lib.get(name).matrix_world.translation.copy() for name in ("EyeHuman", "EyeRed")]
# The head's own surface, without the hair meshes standing off it (they would push the lenses
# forward and the arms out).
HAIR_MESHES = {i for i, m in enumerate(skin.data.materials) if m.name in ("HairModel", "BrowModel", "BeardModel")}
surface = {i for p in skin.data.polygons if p.material_index not in HAIR_MESHES for i in p.vertices}
verts = [skin.matrix_world @ skin.data.vertices[i].co for i in surface]


def lens_frame(eye):
    side = 1.0 if eye.x > 0 else -1.0
    centre = Vector((eye.x + side * LENS_OUT, 0.0, eye.z - LENS_DROP))
    # The face's front-most point behind the middle of the lens sets the lens plane.
    core = [v for v in verts if abs(v.x - centre.x) < LENS_W * 0.3 and abs(v.z - centre.z) < LENS_H * 0.4 and v.y < 0]
    if not core:
        lib.fail("no face surface behind the lens; check LENS_OUT and LENS_DROP against the eyes")
    centre.y = min(v.y for v in core) - GAP
    rot = (Matrix.Rotation(math.radians(-side * WRAP_DEG), 3, "Z") @ Matrix.Rotation(math.radians(-TILT_DEG), 3, "X"))
    return centre, rot, side


def outline():
    """The lens shape in its plane (x across, z up), counter-clockwise seen from the front:
    a superellipse, squarer along the top than the bottom, the bottom slightly narrower."""
    pts = []
    a, b = LENS_W / 2, LENS_H / 2
    for i in range(OUTLINE_POINTS):
        t = 2 * math.pi * i / OUTLINE_POINTS - math.pi / 2
        c, s_ = math.cos(t), math.sin(t)
        n = SQUARE_TOP if s_ > 0 else SQUARE_BOTTOM
        x = a * math.copysign(abs(c) ** (2 / n), c)
        z = b * math.copysign(abs(s_) ** (2 / n), s_)
        if z < 0:
            x *= 1 - BOTTOM_TAPER * (-z / b)
        pts.append((x, z))
    return pts


def edge(side, z_share, inner=False):
    """The outline point on one vertical edge (outer, or inner toward the nose) nearest to
    z = z_share of the half height."""
    want = -side if inner else side
    pts = [q for q in outline() if q[0] * want > 0]
    return min(pts, key=lambda q: abs(q[1] - z_share * LENS_H / 2))


def top(x_target):
    return min((q for q in outline() if q[1] > 0), key=lambda q: abs(q[0] - x_target))


bm = bmesh.new()
faces = []  # (face, material name)


def add(vs, away_from, mat):
    """A face that points away from `away_from` (inside the solid it bounds)."""
    f = bm.faces.new(vs)
    f.normal_update()
    if f.normal.dot(f.calc_center_median() - away_from) < 0:
        f.normal_flip()
    faces.append((f, mat))
    return f


def bevelled(w, h, r, steps=2):
    """A rounded rectangle profile (a across, b up), centred: corner radius r, `steps`
    segments per corner."""
    a, b = w / 2, h / 2
    r = min(r, a * 0.9, b * 0.9)
    pts = []
    for cx, cy, start in ((a - r, -b + r, -90), (a - r, b - r, 0), (-a + r, b - r, 90), (-a + r, -b + r, 180)):
        for i in range(steps + 1):
            t = math.radians(start + 90 * i / steps)
            pts.append((cx + r * math.cos(t), cy + r * math.sin(t)))
    return pts


def sweep(rings, centres, mat, closed=False):
    """Skin consecutive rings of equal size; cap the ends of an open sweep."""
    n = len(rings[0])
    pairs = list(range(len(rings))) if closed else list(range(len(rings) - 1))
    for i in pairs:
        r0, r1 = rings[i], rings[(i + 1) % len(rings)]
        axis = (centres[i] + centres[(i + 1) % len(centres)]) / 2
        for k in range(n):
            add((r0[k], r0[(k + 1) % n], r1[(k + 1) % n], r1[k]), axis, mat)
    if not closed:
        add(rings[0], centres[1], mat)
        add(rings[-1], centres[-2], mat)


def rim(centre, rot, pts, closed=True):
    """The acetate rim round the lens outline points (x, z): a chamfered bar whose inner
    edge overlaps the lens edge, wider toward the top."""
    n = len(pts)
    rings, centres = [], []
    for i, (x, z) in enumerate(pts):
        if closed:
            px, pz = pts[i - 1]
            nx_, nz_ = pts[(i + 1) % n]
        else:
            px, pz = pts[max(i - 1, 0)]
            nx_, nz_ = pts[min(i + 1, n - 1)]
        tx, tz = nx_ - px, nz_ - pz
        length = math.hypot(tx, tz) or 1.0
        ox, oz = tz / length, -tx / length  # outward in the lens plane
        up = max(0.0, min(1.0, (z / (LENS_H / 2) - 0.2) / 0.6))
        w = RIM_W + RIM_TOP * up * up * (3 - 2 * up)
        ring = []
        for a, b in bevelled(w, RIM_D, ROUND):
            r = a + w / 2 - 0.008  # from just inside the lens edge outward
            ring.append(bm.verts.new(centre + rot @ Vector((x + ox * r, b, z + oz * r))))
        rings.append(ring)
        centres.append(centre + rot @ Vector((x + ox * (w / 2 - 0.008), 0.0, z + oz * (w / 2 - 0.008))))
    sweep(rings, centres, "GlassesFrame", closed)


def bar(path, heights, thickness, mat):
    """A flat bar along path points, `heights` at each point, upright (Z) where it can be."""
    rings = []
    for i, p in enumerate(path):
        d = (path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)]).normalized()
        up = Vector((0, 0, 1)) - d * d.z
        if up.length < 1e-4:
            up = Vector((0, 1, 0)) - d * d.y
        up.normalize()
        side = d.cross(up)
        rings.append([bm.verts.new(p + side * a + up * b) for a, b in bevelled(thickness, heights[i], ROUND * 0.8)])
    sweep(rings, path, mat)


def blob(c, radii, mat, segs=8, rings_=5):
    """A small ellipsoid (nose pad)."""
    grid = []
    for j in range(1, rings_):
        t = math.pi * j / rings_
        grid.append([bm.verts.new(c + Vector((radii[0] * math.sin(t) * math.cos(2 * math.pi * k / segs),
                                                radii[1] * math.sin(t) * math.sin(2 * math.pi * k / segs),
                                                radii[2] * math.cos(t)))) for k in range(segs)])
    top, bottom = bm.verts.new(c + Vector((0, 0, radii[2]))), bm.verts.new(c - Vector((0, 0, radii[2])))
    for j in range(len(grid) - 1):
        for k in range(segs):
            add((grid[j][k], grid[j][(k + 1) % segs], grid[j + 1][(k + 1) % segs], grid[j + 1][k]), c, mat)
    for k in range(segs):
        add((top, grid[0][k], grid[0][(k + 1) % segs]), c, mat)
        add((bottom, grid[-1][(k + 1) % segs], grid[-1][k]), c, mat)


def wire(a, b, r, mat, sides=6):
    d = (b - a).normalized()
    u = d.orthogonal().normalized()
    v = d.cross(u)
    ring_a = [bm.verts.new(a + (u * math.cos(2 * math.pi * k / sides) + v * math.sin(2 * math.pi * k / sides)) * r) for k in range(sides)]
    ring_b = [bm.verts.new(b + (u * math.cos(2 * math.pi * k / sides) + v * math.sin(2 * math.pi * k / sides)) * r) for k in range(sides)]
    sweep([ring_a, ring_b], [a, b], mat)


anchors = {}
for eye in eyes:
    centre, rot, side = lens_frame(eye)
    front_normal = (rot @ Vector((0, -1, 0))).normalized()
    hx = LENS_W / 2
    tx, tz = top(-side * (hx - 0.05))
    lx, lz = edge(side, 0.2, inner=True)
    ox, oz = edge(side, 0.55)
    anchors[side] = {
        "inner_top": centre + rot @ Vector((tx, 0.0, tz + RIM_W + RIM_TOP * 0.5)),
        "inner_low": centre + rot @ Vector((lx - side * RIM_W * 0.4, 0.0, lz)),
        "outer": centre + rot @ Vector((ox + side * RIM_W * 0.7, 0.0, oz)),
        "rot": rot,
        "front": front_normal,
    }
    pts = outline()
    upper = [i for i, (x, z) in enumerate(pts) if z >= RIM_FROM * LENS_H / 2]
    first, last = upper[0], upper[-1]  # outline() starts at the bottom, so the top half is one run
    if side > 0:
        # Cyborg side: the top bar's inner end only, snapped off near the bridge. Kept in
        # outline order (counter-clockwise), so rim() offsets it outward.
        rim(centre, rot, [q for q in pts[first:last + 1] if q[0] < -LENS_W * 0.22], closed=False)
        continue
    front, back = [], []
    for x, z in outline():
        p = Vector((x, 0.0, z))
        front.append(bm.verts.new(centre + rot @ (p + Vector((0, -THICK / 2, 0)))))
        back.append(bm.verts.new(centre + rot @ (p + Vector((0, THICK / 2, 0)))))
    faces.append((bm.faces.new(front), "GlassesLens"))       # faces -Y, out of the lens
    faces.append((bm.faces.new(back[::-1]), "GlassesLens"))  # faces +Y, toward the eye
    n = len(front)
    for i in range(n):
        j = (i + 1) % n
        faces.append((bm.faces.new((front[j], front[i], back[i], back[j])), "GlassesEdge"))
    rim(centre, rot, pts[first:last + 1], closed=False)
    # The nylon line round the bottom half, in a groove in the lens edge.
    lower = pts[last:] + pts[:first + 1]
    line = [centre + rot @ Vector((x, 0.0, z)) for x, z in lower]
    for a, b in zip(line, line[1:]):
        wire(a, b, LINE_R, "GlassesLine", sides=5)

# Keyhole bridge: a rim-profile arch between the inner tops, sitting a little behind the rims.
l, r = anchors[1.0]["inner_top"], anchors[-1.0]["inner_top"]
mid = (l + r) / 2 + Vector((0.0, 0.03, 0.035))
path = [r, r.lerp(mid, 0.5) + Vector((0, 0.01, 0.02)), mid, l.lerp(mid, 0.5) + Vector((0, 0.01, 0.02)), l]
bar(path, [0.024, 0.02, 0.018, 0.02, 0.024], RIM_D * 0.8, "GlassesFrame")

# Nose pads: clear pads on metal arms from the lower inner rim back toward the nose.
for side in (-1.0, 1.0):
    a = anchors[side]["inner_low"]
    pad = a + Vector((side * -0.035, 0.07, -0.02))
    wire(a + Vector((0, 0.01, 0)), pad, PAD_ARM, "GlassesMetal")
    blob(pad + Vector((side * -0.005, 0.012, 0.0)), PAD, "GlassesPad")

# Arm: a flat bar from the hinge at the end piece straight back to the top of the ear,
# where it rests on the crease between ear and head, then a hook that follows the head
# down behind the ear, just off its surface.
EAR_Y = 0.1             # where the arm crosses the top of the ear
CLEAR = 0.02            # gap between the arm and the temple in front of the ear
TUCK = ARM_T + 0.008    # gap between the hook and the head behind the ear


def head_x(side, y, z, reach=0.05):
    near = [abs(v.x) for v in verts if abs(v.y - y) < reach and abs(v.z - z) < reach and v.x * side > 0]
    if not near:
        lib.fail(f"no head surface near y {y:.2f}, z {z:.2f} for the glasses arm")
    return max(near)


for side in (-1.0,):  # the human side only; the cyborg side's arm is gone
    corner = anchors[side]["outer"]
    hinge = corner + (anchors[side]["rot"] @ Vector((side * 0.012, END_LEN, 0.0)))
    # End piece: a short block from the rim's outer corner back to the hinge.
    bar([corner + anchors[side]["front"] * 0.01, hinge], [ARM_H * 1.15, ARM_H * 1.1], ARM_T * 1.5, "GlassesFrame")
    ear_z = hinge.z - 0.03
    # Straight from the hinge: wide enough at the ear to rest on it and to pass the temple.
    ear_x = head_x(side, EAR_Y, ear_z) + ARM_T
    temple = [v for v in verts if abs(v.z - hinge.z) < 0.06 and v.x * side > 0 and hinge.y + 0.05 < v.y < EAR_Y - 0.15]
    for v in temple:
        ear_x = max(ear_x, abs(hinge.x) + (abs(v.x) + CLEAR - abs(hinge.x)) * (EAR_Y - hinge.y) / (v.y - hinge.y))
    ear = Vector((side * ear_x, EAR_Y, ear_z))
    path = [hinge, hinge.lerp(ear, 0.5), ear]
    for y, dz in ((0.2, -0.04), (0.27, -0.12), (0.31, -0.22), (0.32, -0.3)):
        z = ear_z + dz
        path.append(Vector((side * (head_x(side, y, z) + TUCK), y, z)))
    heights = [ARM_H + (ARM_TIP_H - ARM_H) * min(1.0, i / 2) for i in range(len(path))]
    bar(path, heights, ARM_T, "GlassesFrame")

mesh = bpy.data.meshes.new("Glasses")
bm.normal_update()
mats = {}
# (name, colour, alpha, metallic, roughness, clear coat)
for name, color, alpha, metallic, rough, coat in (("GlassesLens", GLASS, 0.07, 0.0, 0.02, 0.0),
                                                  ("GlassesEdge", GLASS, 0.45, 0.0, 0.05, 0.0),
                                                  ("GlassesLine", LINE, 0.6, 0.0, 0.3, 0.0),
                                                  ("GlassesFrame", FRAME, 1.0, 0.0, 0.35, 1.0),
                                                  ("GlassesMetal", METAL, 1.0, 1.0, 0.25, 0.0),
                                                  ("GlassesPad", GLASS, 0.45, 0.0, 0.1, 0.0)):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*lib.srgb(color), 1.0)
    bsdf.inputs["Alpha"].default_value = alpha
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Coat Weight"].default_value = coat  # glossy acetate (KHR_materials_clearcoat)
    bsdf.inputs["Coat Roughness"].default_value = 0.04
    if alpha < 1.0:
        mat.surface_render_method = "BLENDED"
    mesh.materials.append(mat)
    mats[name] = len(mesh.materials) - 1
for f, name in faces:
    f.material_index = mats[name]
    f.smooth = name in ("GlassesFrame", "GlassesMetal", "GlassesPad", "GlassesLine")
bm.to_mesh(mesh)
bm.free()

# Swap the empty for the mesh under the same name and the same bone parent.
old = lib.get("Glasses")
bpy.data.objects.remove(old, do_unlink=True)
glasses = bpy.data.objects.new("Glasses", mesh)
skin.users_collection[0].objects.link(glasses)
bpy.context.view_layer.update()
glasses.parent, glasses.parent_type, glasses.parent_bone = rig, "BONE", "Head"
bpy.context.view_layer.update()
glasses.matrix_world = Matrix.Identity(4)  # bone children sit at the bone tail; keep the world placement
bpy.context.view_layer.update()

lib.save(ns)
print(f"head build: glasses {len(mesh.polygons)} faces, lenses at y {anchors[1.0]['inner_top'].y:.2f}")
