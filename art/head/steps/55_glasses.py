"""Step 55: rimless rectangular glasses, as in the reference photo.

Replaces the `Glasses` empty with a mesh of the same name, still bone-parented to `Head`:
two thin see-through lenses with rounded corners, wrapped and tilted to the face, a thin
metal bridge over the nose and temple arms that run back past the ears and hook down
behind them. The glasses stay whole on the cyborg side; the red eye glows through the lens.
Placed from the eyes and the head's own surface, in hero units, Blender Z up, face to -Y.
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

LENS_W, LENS_H = 0.58, 0.36     # lens size
LENS_OUT = 0.04                 # lens centre this much further out than the eye
LENS_DROP = 0.02                # lens centre this much below the eye
CORNER = 0.08                   # corner radius
CORNER_STEPS = 4
THICK = 0.016                   # lens thickness
GAP = 0.1                       # lens clearance in front of the face
WRAP_DEG, TILT_DEG = 10, 8      # outer edge swept back; bottom tilted toward the face
WIRE = 0.014                    # bridge and arm radius
WIRE_SIDES = 6
GLASS, METAL = "e8eef2", "b9bec6"

eyes = [lib.get(name).matrix_world.translation.copy() for name in ("EyeHuman", "EyeRed")]
# The head's own surface, without the hair cards standing off it (they would push the lenses
# forward and the arms out).
CARDS = {i for i, m in enumerate(skin.data.materials) if m.name.startswith(("HairCard", "BeardCard"))}
surface = {i for p in skin.data.polygons if p.material_index not in CARDS for i in p.vertices}
verts = [skin.matrix_world @ skin.data.vertices[i].co for i in surface]


def lens_frame(eye):
    side = 1.0 if eye.x > 0 else -1.0
    centre = Vector((eye.x + side * LENS_OUT, 0.0, eye.z - LENS_DROP))
    # The face's front-most point behind the middle of the lens sets the lens plane.
    core = [v for v in verts if abs(v.x - centre.x) < LENS_W * 0.3 and abs(v.z - centre.z) < LENS_H * 0.4 and v.y < 0]
    centre.y = min(v.y for v in core) - GAP
    rot = (Matrix.Rotation(math.radians(-side * WRAP_DEG), 3, "Z") @ Matrix.Rotation(math.radians(-TILT_DEG), 3, "X"))
    return centre, rot, side


def outline():
    """Rounded rectangle in the lens plane (x across, z up), counter-clockwise seen from the front."""
    pts = []
    hx, hz = LENS_W / 2 - CORNER, LENS_H / 2 - CORNER
    for cx, cz, start in ((hx, -hz, -90), (hx, hz, 0), (-hx, hz, 90), (-hx, -hz, 180)):
        for i in range(CORNER_STEPS + 1):
            a = math.radians(start + 90 * i / CORNER_STEPS)
            pts.append((cx + CORNER * math.cos(a), cz + CORNER * math.sin(a)))
    return pts


bm = bmesh.new()
faces = []  # (face, material name)


def tube(points):
    """A thin round wire through the points."""
    rings = []
    for i, p in enumerate(points):
        d = (points[min(i + 1, len(points) - 1)] - points[max(i - 1, 0)]).normalized()
        a = d.orthogonal().normalized()
        b = d.cross(a)
        rings.append([bm.verts.new(p + (a * math.cos(2 * math.pi * k / WIRE_SIDES) + b * math.sin(2 * math.pi * k / WIRE_SIDES)) * WIRE)
                      for k in range(WIRE_SIDES)])
    for r0, r1 in zip(rings, rings[1:]):
        for k in range(WIRE_SIDES):
            k2 = (k + 1) % WIRE_SIDES
            faces.append((bm.faces.new((r0[k], r0[k2], r1[k2], r1[k])), "GlassesMetal"))
    for ring, flip in ((rings[0], True), (rings[-1], False)):
        faces.append((bm.faces.new(ring[::-1] if flip else ring), "GlassesMetal"))


anchors = {}
for eye in eyes:
    centre, rot, side = lens_frame(eye)
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
    # Where the bridge and the arm meet this lens: its inner and outer top corners.
    anchors[side] = {
        "inner": centre + rot @ Vector((-side * (LENS_W / 2 - 0.02), 0.0, LENS_H / 2 - 0.06)),
        "outer": centre + rot @ Vector((side * (LENS_W / 2 - 0.01), 0.0, LENS_H / 2 - 0.08)),
    }

# Bridge: an arch over the nose between the inner corners.
l, r = anchors[1.0]["inner"], anchors[-1.0]["inner"]
mid = (l + r) / 2 + Vector((0.0, 0.02, 0.05))
tube([r, r.lerp(mid, 0.5) + Vector((0, 0, 0.02)), mid, l.lerp(mid, 0.5) + Vector((0, 0, 0.02)), l])

# Arms: one straight wire from the lens's outer corner to just over the ear, splayed out just
# enough to clear the side of the head, then a curved hook down behind the ear.
EAR_Y = 0.1             # where the arm passes over the ear
CLEAR = 0.04            # gap between the arm and the head
for side in (1.0, -1.0):
    start = anchors[side]["outer"]
    band = [v for v in verts if abs(v.z - start.z) < 0.08 and v.x * side > 0 and start.y + 0.1 < v.y < EAR_Y]
    if not band:
        lib.fail("no head surface beside the glasses arm")
    # The arm's x at the ear so the line from start passes outside every band point.
    ear_x = max(abs(start.x) + (abs(v.x) + CLEAR - abs(start.x)) * (EAR_Y - start.y) / (v.y - start.y) for v in band)
    ear = Vector((side * ear_x, EAR_Y, start.z - 0.02))
    along = (ear - start).normalized()
    hook = [ear + along * 0.08 + Vector((side * -0.01, 0, -0.03)),
            ear + along * 0.14 + Vector((side * -0.03, 0, -0.1)),
            ear + along * 0.17 + Vector((side * -0.05, 0, -0.2))]
    tube([start, ear] + hook)

mesh = bpy.data.meshes.new("Glasses")
bm.normal_update()
mats = {}
for name, color, alpha, metallic, rough in (("GlassesLens", GLASS, 0.06, 0.0, 0.05),
                                             ("GlassesEdge", GLASS, 0.35, 0.0, 0.1),
                                             ("GlassesMetal", METAL, 1.0, 0.9, 0.25)):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*lib.srgb(color), 1.0)
    bsdf.inputs["Alpha"].default_value = alpha
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = rough
    if alpha < 1.0:
        mat.surface_render_method = "BLENDED"
    mesh.materials.append(mat)
    mats[name] = len(mesh.materials) - 1
for f, name in faces:
    f.material_index = mats[name]
    f.smooth = name == "GlassesMetal"
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
print(f"head build: glasses {len(mesh.polygons)} faces, lenses at y {anchors[1.0]['inner'].y:.2f}")
