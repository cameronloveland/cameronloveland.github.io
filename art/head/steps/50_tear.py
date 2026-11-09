"""Step 50: the tear. A ragged patch of skin on the cyborg side (character left, +X) is torn
away from the temple across the eye and cheek to the jaw, showing a metal skull under it.

- Torn skin: skin, hair and beard faces inside a noisy patch are removed; the skin's new
  border is extruded inward into a thin lip of flesh, so the skin reads as having depth.
- Metal skull: a copy of the skin under the patch (plus a margin that tucks under the
  torn edge) shrunk inward, then shaped like a robot skull: a heavy brow ridge, a squared
  eye socket sunk deep with a housing ring round the eye, a cheekbone bar running back
  toward the ear over a dark recess, inlaid seams that split it into machined plates,
  and two hydraulic pistons in the recess running down toward the jaw hinge.
- Hair, brow and beard mesh faces with any vertex over the patch go too, so none hangs over metal.
- EyeRed: a black lens with a small glowing red dot, Terminator style, instead of a whole
  red eye.

Everything new stays inside the Skin mesh (materials Metal, MetalDark, Flesh) and carries
full Head weight, so the node contract is unchanged and the skull turns with the head.
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
MODEL_STANDOFF = 0.1    # how far the hair meshes can stand off the skin
BROW = (0.22, 0.08, 0.15)      # height above the eye, half-height, how far it stands out
BROW_SPAN = 0.36                # |x - eye.x| the brow ridge runs across
CHEEKBONE = (-0.24, 0.05, 0.14)  # same, below the eye; it rises 0.3 per unit toward the ear
HOLLOW = (-0.42, 0.12, -0.14)   # the recess under the cheekbone, where the pistons sit
SOCKET_RADIUS, SOCKET_DEPTH = 0.34, 0.22  # a squared bowl: radius in a 4-norm across x and z
SEAM_R = 0.013                  # inlaid seam beads, half sunk into the plates
PISTON_R = (0.045, 0.022)       # sleeve and rod radii
PISTONS = ((0.42, 0.5), (0.56, 0.63))   # (x at the top, x at the bottom) of each piston
HEAD_AXIS_Y = -0.3              # seams are cast toward the vertical axis through here
PISTON_Z = (-0.12, -0.8)        # top under the cheekbone, bottom on under the skin toward the jaw hinge
ARCH_R = 0.035                  # the cheekbone bar (zygomatic arch) laid over the shaped cheekbone
SKULL_SMOOTH = 3        # smoothing passes before the bone is shaped (one more after), ironing out the coarse mesh's creases
RING_MAJOR, RING_MINOR = 1.1, 0.045  # housing ring radius as a share of the eye radius, tube radius
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
head_group = skin.vertex_groups["Head"].index
skin_slot = skin.data.materials.find("Skin")

slots = {}
for mat in (srgb_mat("Metal", METAL, 0.95, 0.2), srgb_mat("MetalDark", METAL_DARK, 0.9, 0.35),
            srgb_mat("Flesh", FLESH, 0.0, 0.6)):
    skin.data.materials.append(mat)
    slots[mat.name] = len(skin.data.materials) - 1

inside = {v: torn(v.co) and v.co.x > 0 for v in bm.verts}
gone = [f for f in bm.faces if all(inside[v] for v in f.verts)]
# The fitted hair, brow and beard meshes stand off the skin, so test each of their
# vertices pulled in toward the head by MODEL_STANDOFF; a face goes if any vertex is in.
model_slots = {i for i, m in enumerate(skin.data.materials) if m.name in ("HairModel", "BrowModel", "BeardModel")}
gone_set = set(gone)
for f in bm.faces:
    if f.material_index in model_slots and f not in gone_set:
        if any(torn(v.co - v.co.normalized() * MODEL_STANDOFF) and v.co.x > 0 for v in f.verts):
            gone.append(f)
            gone_set.add(f)
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
    if abs(dx) < BROW_SPAN:
        height, half, push = BROW
        t = min(1.0, 1.6 * (1 - min(1.0, abs(co.z - (eye.z + height)) / half)))  # flat topped, hard edged
        new.co += n * push * t * min(1.0, 3 * (1 - abs(dx) / BROW_SPAN))
    for height, half, push in (CHEEKBONE, HOLLOW):
        line = eye.z + height + 0.3 * max(0.0, dx)
        t = 1 - min(1.0, abs(co.z - line) / half)
        new.co += n * push * (t if push > 0 else t * t)
    # The socket: a squared bowl round the eye, deepest at the rim of the eye.
    d = ((co.x - eye.x) ** 4 + (co.z - eye.z) ** 4) ** 0.25
    if d < SOCKET_RADIUS and co.y < eye.y + 0.3:
        t = min(1.0, 1.4 * (1 - d / SOCKET_RADIUS))
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
ring_centre = eye + axis * eye_radius * 0.05  # set into the socket, not standing on it
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

# Seams and pistons sit on the skull, found by casting from the front onto it.
live = [f for f in skull_faces if f.is_valid]
sv = list({v for f in live for v in f.verts})
si = {v: i for i, v in enumerate(sv)}
skull_bvh = BVHTree.FromPolygons([v.co.copy() for v in sv], [[si[v] for v in f.verts] for f in live])


def on_skull(x, z):
    """The skull straight behind (x, z) seen from the front."""
    hit, normal, *_ = skull_bvh.ray_cast(Vector((x, -4.0, z)), Vector((0.0, 1.0, 0.0)))
    return (hit, normal) if hit else (None, None)


def round_skull(degrees, z):
    """The skull at height z, `degrees` round from the front toward his left ear."""
    a = math.radians(degrees)
    out = Vector((math.sin(a), -math.cos(a), 0.0))
    hit, normal, *_ = skull_bvh.ray_cast(Vector((0.0, HEAD_AXIS_Y, z)) + out * 4.0, -out)
    return (hit, normal) if hit else (None, None)


def tube(points, radius, name, sides=5, caps=True):
    """A thin tube through the points, its cross-section kept square to the viewer (-Y)."""
    rings = []
    for i, p in enumerate(points):
        d = (points[min(i + 1, len(points) - 1)] - points[max(i - 1, 0)]).normalized()
        ref = Vector((0.0, -1.0, 0.0))
        a = ref - d * ref.dot(d)
        a = a.normalized() if a.length > 1e-4 else d.orthogonal().normalized()
        b = d.cross(a)
        rings.append([head_vert(p + (a * math.cos(2 * math.pi * k / sides) + b * math.sin(2 * math.pi * k / sides)) * radius)
                      for k in range(sides)])
    for r0, r1 in zip(rings, rings[1:]):
        for k in range(sides):
            k2 = (k + 1) % sides
            extra.append((bm.faces.new((r0[k], r0[k2], r1[k2], r1[k])), name))
    if caps:
        extra.append((bm.faces.new(rings[0][::-1]), name))
        extra.append((bm.faces.new(rings[-1]), name))


def seam(path, steps):
    """A bead along a path in (degrees, z) round the head, on the skull, in runs where it is hit."""
    run = []
    for i in range(steps + 1):
        hit, normal = round_skull(*path(i / steps))
        if hit is None:
            if len(run) > 1:
                tube(run, SEAM_R, "MetalDark", 4, False)
            run = []
            continue
        run.append(hit - normal * SEAM_R * 0.3)
    if len(run) > 1:
        tube(run, SEAM_R, "MetalDark", 4, False)


# Plate edges: one over the brow ridge round to the temple, one up the temple, one up the
# forehead, so the metal reads as machined plates rather than one cast piece.
top = eye.z + BROW[0] + BROW[1] + 0.04
seam(lambda t: (8 + 80 * t, top + 0.03 * t), 18)
seam(lambda t: (62, top + (1.05 - top) * t), 10)
seam(lambda t: (24, top + (1.05 - top) * t), 10)

# The cheekbone bar: a chrome rod along the cheekbone from under the eye back toward the ear.
arch = []
for i in range(13):
    deg = 18 + 60 * i / 12
    x_guess = 0.85 * math.sin(math.radians(deg))
    hit, normal = round_skull(deg, eye.z + CHEEKBONE[0] + 0.3 * max(0.0, x_guess - eye.x))
    if hit is not None:
        arch.append(hit + normal * ARCH_R * 0.5)
if len(arch) > 1:
    tube(arch, ARCH_R, "Metal", 6)

# Two pistons in the recess: a thick sleeve from under the cheekbone, a thin rod into the jaw,
# hung from a bracket under the bar.
mounts = []
for x_top, x_bottom in PISTONS:
    top_hit, top_n = on_skull(x_top, PISTON_Z[0])
    for k in range(9):  # the lowest point toward PISTON_Z[1] that is still on the skull
        bottom_hit, bottom_n = on_skull(x_bottom, PISTON_Z[1] + (PISTON_Z[0] - PISTON_Z[1]) * k / 10)
        if bottom_hit is not None:
            break
    if top_hit is None or bottom_hit is None:
        continue
    p0 = top_hit + top_n * PISTON_R[0] * 0.8
    p1 = bottom_hit + bottom_n * PISTON_R[0] * 0.8
    tube([p0, p0.lerp(p1, 0.45)], PISTON_R[0], "MetalDark", 6)
    tube([p0.lerp(p1, 0.4), p1], PISTON_R[1], "Metal", 6)
    mounts.append(p0)
if len(mounts) == 2:
    tube([mounts[0] + (mounts[0] - mounts[1]).normalized() * 0.04, mounts[1] + (mounts[1] - mounts[0]).normalized() * 0.04],
         PISTON_R[1] * 1.2, "MetalDark", 6)

for f, name in extra:
    f.material_index = slots[name]
    f.smooth = name != "Metal"
bm.normal_update()

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
