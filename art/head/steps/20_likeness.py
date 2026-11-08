"""Step 20: the likeness. MPFB macros and face targets tuned by eye against Cameron's
reference photo (kept outside the repo; this script never reads it).

Runs while the MPFB targets are still live, before 30_bust.py bakes them. MPFB fits the
eyes when they are added and does not refit them on a target change, so this step
refits them last.
"""
import importlib
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
HumanService, AssetService, TargetService = lib.mpfb()
HumanObjectProperties = importlib.import_module(
    sys.modules[HumanService.__module__].__package__.rsplit(".", 1)[0] + ".entities.objectproperties"
).HumanObjectProperties

human = lib.get("Human")
eyes = lib.get("Eyes")

# Macros, 0..1. Age 0.5 is 25 years and 1.0 is 90, so 0.58 is about 35.
MACROS = {
    "gender": 1.0,
    "age": 0.58,
    "weight": 0.68,
    "muscle": 0.45,
    "proportions": 0.5,
    "asian": 0.05,
    "caucasian": 0.9,
    "african": 0.05,
}

# Face targets as (directory under data/targets, file stem): weight. A rounder face and
# fuller cheeks, a broader chin under the beard, a softer nose, slightly smaller eyes
# behind the glasses, a slightly wider and shorter head, and a wider mouth with lifted
# corners for his easy smile.
TARGETS = {
    ("head", "head-round"): 0.5,
    ("head", "head-fat-incr"): 0.4,
    ("cheek", "l-cheek-volume-incr"): 0.5,
    ("cheek", "r-cheek-volume-incr"): 0.5,
    ("chin", "chin-width-incr"): 0.3,
    ("nose", "nose-volume-incr"): 0.3,
    ("eyes", "l-eye-scale-decr"): 0.2,
    ("eyes", "r-eye-scale-decr"): 0.2,
    ("eyes", "l-eye-height2-decr"): 0.3,
    ("eyes", "r-eye-height2-decr"): 0.3,
    ("head", "head-scale-horiz-incr"): 0.25,
    ("head", "head-scale-vert-decr"): 0.15,
    ("mouth", "mouth-angles-up"): 0.9,
    ("mouth", "mouth-scale-horiz-incr"): 0.3,
}


def eye_centre():
    pts = [eyes.matrix_world @ v.co for v in eyes.data.vertices]
    return sum(pts, Vector()) / len(pts)


for name, value in MACROS.items():
    HumanObjectProperties.set_value(name, value, entity_reference=human)
TargetService.reapply_macro_details(human)

for (folder, stem), weight in TARGETS.items():
    path = lib.mpfb_data("targets", *folder.split("/"), f"{stem}.target.gz")
    TargetService.load_target(human, path, weight=weight, name=stem)

bpy.context.view_layer.update()
HumanService.refit(human)
bpy.context.view_layer.update()



def shaped_centroid(group_name):
    """Like lib.group_centroid, but on the shaped mesh (targets are still shape keys)."""
    idx = human.vertex_groups[group_name].index
    members = [v.index for v in human.data.vertices if any(g.group == idx and g.weight > 0.5 for g in v.groups)]
    shaped = human.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
    pts = [human.matrix_world @ shaped.vertices[i].co for i in members]
    human.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh_clear()
    return sum(pts, Vector()) / len(pts)


# The refit eyes must sit on the shaped eye joints. Masked helper geometry is removed by a
# modifier, so read the shaped positions with the modifiers off.
masks = [m for m in human.modifiers if m.show_viewport]
for m in masks:
    m.show_viewport = False
bpy.context.view_layer.update()
joints = (shaped_centroid("joint-l-eye") + shaped_centroid("joint-r-eye")) / 2
for m in masks:
    m.show_viewport = True
drift = (eye_centre() - joints).length
if drift > 0.05:
    lib.fail(f"eyes sit {drift:.3f} m off the eye joints after the refit")

lib.save(ns)
print(f"head build: likeness macros {len(MACROS)}, targets {len(TARGETS)}, eye drift {drift * 1000:.1f} mm")
