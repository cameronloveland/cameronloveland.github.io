"""Step 90: preview renders and the raw GLB export. Always the last step.

Renders go to --renders (gitignored) for review. The raw GLB goes to --glb; build.mjs
compresses it and checks it before it replaces art/head/head.glb.
"""
import math
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
if not ns.glb or not ns.renders:
    lib.fail("90_export.py needs --glb and --renders")
for name in ("Head", "Bust", "EyeHuman", "EyeRed", "Glasses"):
    lib.get(name)

scene = bpy.context.scene
for engine in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT", "BLENDER_WORKBENCH"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
scene.render.resolution_x = scene.render.resolution_y = 900
scene.render.film_transparent = False
world = bpy.data.worlds.new("Preview") if scene.world is None else scene.world
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.03, 0.03, 0.04, 1)

target = bpy.data.objects.new("Target", None)
target.location = (0, 0, -0.7)
scene.collection.objects.link(target)
helpers = [target]


def add_light(name, kind, energy, loc, color=(1, 1, 1)):
    light = bpy.data.objects.new(name, bpy.data.lights.new(name, kind))
    light.data.energy = energy
    light.data.color = color
    light.location = loc
    con = light.constraints.new("TRACK_TO")
    con.target = target
    scene.collection.objects.link(light)
    helpers.append(light)


add_light("Key", "AREA", 1500, (-4, -7, 4))
add_light("RimL", "AREA", 600, (-6, 6, 2), (0.55, 0.5, 1.0))
add_light("RimR", "AREA", 600, (6, 6, 2), (0.55, 0.5, 1.0))

cam = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
cam.data.lens = 85
cam.constraints.new("TRACK_TO").target = target
scene.collection.objects.link(cam)
scene.camera = cam
helpers.append(cam)

os.makedirs(ns.renders, exist_ok=True)
for label, angle in (("front", 0), ("three-quarter", 45)):
    a = math.radians(angle)
    cam.location = (15 * math.sin(a), -15 * math.cos(a), -0.4)
    scene.render.filepath = os.path.join(os.path.abspath(ns.renders), f"{label}.png")
    bpy.ops.render.render(write_still=True)

for obj in helpers:
    bpy.data.objects.remove(obj, do_unlink=True)

os.makedirs(os.path.dirname(os.path.abspath(ns.glb)), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=os.path.abspath(ns.glb),
    export_format="GLB",
    export_yup=True,
    export_apply=True,
    export_animations=False,
    export_morph=False,
    export_skins=False,
    export_cameras=False,
    export_lights=False,
)
lib.save(ns)
print(f"head build: exported {ns.glb}")
