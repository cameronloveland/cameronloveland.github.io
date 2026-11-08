"""Shared helpers for the head build steps.

Every step runs in its own headless Blender process:
    blender -b [previous.blend] --python-exit-code 1 --python NN_step.py -- --out build/NN_step.blend
art/head/build.mjs runs the steps in filename order and chains the .blend files.
"""
import argparse
import os
import sys

import bpy
from mathutils import Vector

# Values from docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md, "Contract with the hero".
HEAD_HEIGHT = 2.2      # crown to chin in glTF units, before HEAD_SCALE in the hero
EYE_LOCAL_Y = 0.14     # eye line above the Head pivot, as in the placeholder


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser(prog=os.path.basename(sys.argv[-1]))
    p.add_argument("--out", required=True, help="where this step saves its .blend")
    p.add_argument("--glb", help="where the export step writes the raw GLB")
    p.add_argument("--renders", help="where the export step writes preview renders")
    return p.parse_args(argv)


def save(ns):
    os.makedirs(os.path.dirname(os.path.abspath(ns.out)), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(ns.out))


def fail(message):
    """Exit with a readable message; the driver shows stderr and stops."""
    print(f"head build: {message}", file=sys.stderr)
    sys.exit(1)


def mpfb():
    """Import the MPFB 2 services, or fail with a message that names MPFB."""
    try:
        from bl_ext.user_default.mpfb.services.humanservice import HumanService
        from bl_ext.user_default.mpfb.services.assetservice import AssetService
        from bl_ext.user_default.mpfb.services.targetservice import TargetService
    except ImportError as e:
        fail(f"MPFB 2 is not installed or enabled in Blender ({e}). Install it from extensions.blender.org.")
    return HumanService, AssetService, TargetService


def group_centroid(obj, name):
    """World-space centroid of the vertices in vertex group `name` (evaluated mesh)."""
    group = obj.vertex_groups.get(name)
    if group is None:
        fail(f"{obj.name} has no vertex group {name}")
    idx = group.index
    pts = [obj.matrix_world @ v.co for v in obj.data.vertices if any(g.group == idx and g.weight > 0.5 for g in v.groups)]
    if not pts:
        fail(f"vertex group {name} on {obj.name} is empty")
    return sum(pts, Vector()) / len(pts)


def get(name):
    obj = bpy.data.objects.get(name)
    if obj is None:
        fail(f"expected an object named {name}; did an earlier step run?")
    return obj
