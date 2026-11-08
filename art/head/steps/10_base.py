"""Step 10: the MPFB 2 base human with low-poly eyes.

MPFB targets stay live as shape keys, so a likeness step (20_*) can still change the
macros and targets before 30_bust.py bakes them.
"""
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

ns = lib.parse_args()
HumanService, AssetService, TargetService = lib.mpfb()

for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

human = HumanService.create_human(scale=0.1)  # default macros; meters, feet on the ground
human.name = "Human"

eyes_path = AssetService.find_asset_absolute_path("low-poly/low-poly.mhclo", asset_subdir="eyes")
if eyes_path is None:
    lib.fail("MPFB's low-poly eyes asset is missing; reinstall the MPFB 2 extension")
HumanService.add_mhclo_asset(eyes_path, human, asset_type="eyes", subdiv_levels=0, material_type="MAKESKIN")
eyes = [o for o in bpy.data.objects if o.parent == human and o.type == "MESH"]
if len(eyes) != 1:
    lib.fail(f"expected one eyes mesh under Human, found {len(eyes)}")
eyes[0].name = "Eyes"

lib.save(ns)
print(f"head build: base human {len(human.data.vertices)} verts, eyes {len(eyes[0].data.vertices)} verts")
