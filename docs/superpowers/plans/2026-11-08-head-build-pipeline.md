# Head build pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `npm run head` rebuilds a neutral MPFB bust from nothing in headless Blender and ships a meshopt-compressed `art/head/head.glb` that honours the hero node contract and passes a budget check.

**Architecture:** Numbered Python steps in `art/head/steps/` each run in their own headless Blender process, open the previous step's `.blend` and save their own under `art/head/build/`. A Node driver (`art/head/build.mjs`) runs the steps in filename order, compresses the raw export with `@gltf-transform/cli meshopt`, then runs a dependency-free GLB checker (`art/head/check.mjs`) that reads the GLB's JSON chunk. The shipped GLB is only replaced when the check passes.

**Tech Stack:** Blender 5.2.1 with MPFB 2 (`bl_ext.user_default.mpfb`), Node 20+ (`node:test`), `@gltf-transform/cli` (dev only, approved).

**Spec:** `docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md` ("Constraints", "Contract with the hero")

## Global Constraints

- Web budget: under 3 MB GLB (3 * 1024 * 1024 bytes), at most 40,000 triangles, textures at most 2048 px.
- Node names: `Bust`, `Head`, `EyeHuman`, `EyeRed`, `Glasses`; the last three are children of `Head`.
- glTF defaults: +Y up, facing +Z. Head height about 2.2 units. `Head` has no translation; its origin is the skull-centre pivot.
- Android side is the character's left = +X (Blender and glTF). `EyeRed` is the +X eye, emissive red.
- Placeholder anchor: eyes at local y 0.14 above the pivot (`EYE_LOCAL_Y = 0.14 * HEAD_SCALE`).
- CC0 only; every source recorded in `art/head/CREDITS.md`. `.blend` and renders are gitignored; the GLB is committed.
- No em dashes anywhere. No new dependencies beyond `@gltf-transform/cli`.

## Review Focus

1. Blender exits 0 on a Python exception unless told otherwise: every step runs with `--python-exit-code 1`, and the driver fails on non-zero exit.
2. Blender missing or not at the default path: the driver honours `BLENDER`, then the default Windows path, then `blender` on PATH, and fails with a message naming `BLENDER`.
3. MPFB not installed or disabled: `10_base.py` fails with a message naming MPFB instead of an ImportError trace.
4. A failed run must not leave a stale `head.glb` that looks fresh: output goes to `build/` and is copied to `art/head/head.glb` only after the check passes.
5. Paths with spaces (`Program Files`): spawn with an argument array, never a shell string.

---

### Task 1: GLB contract and budget checker

**Files:**
- Create: `art/head/check.mjs`
- Test: `art/head/check.test.mjs`

**Interfaces:**
- Produces: `checkGlb(buf: Buffer) -> { ok: boolean, errors: string[], stats: { bytes, triangles, nodes: string[] } }` and a CLI `node art/head/check.mjs <file.glb>` that prints stats and exits 1 on errors. Constants `MAX_BYTES = 3 * 1024 * 1024`, `MAX_TRIANGLES = 40000`.

- [ ] **Step 1: Write failing tests** with a helper `makeGlb(json, binLength)` that packs a GLB header plus JSON chunk. Tests: valid contract passes; missing `Glasses` fails with an error containing `Glasses`; `EyeRed` not under `Head` fails; `Head` with a non-zero translation fails; triangles over 40,000 (indices accessor count 120003, mode 4) fails; a buffer over `MAX_BYTES` fails; a non-GLB buffer fails with `not a GLB`.
- [ ] **Step 2: Run** `node --test art/head/check.test.mjs` - expected FAIL (module not found).
- [ ] **Step 3: Implement** `checkGlb`: parse magic `glTF`, version 2, first chunk type `JSON`; triangles = sum over primitives (mode undefined or 4) of `indices` accessor count / 3, else position count / 3; walk node children to resolve parents.
- [ ] **Step 4: Run** `node --test art/head/check.test.mjs` - expected all pass.
- [ ] **Step 5: Commit** `feat(head): GLB contract and budget checker`.

### Task 2: Blender build steps

**Files:**
- Create: `art/head/steps/lib.py`, `art/head/steps/10_base.py`, `art/head/steps/30_bust.py`, `art/head/steps/90_export.py`

**Interfaces:**
- Consumes: nothing.
- Produces: each step is run as `blender -b [<prev>.blend] --python-exit-code 1 --python <step>.py -- --out <build>/<step>.blend [--glb <path>] [--renders <dir>]`. `lib.py` gives `parse_args() -> argparse.Namespace`, `save(ns)`, `group_centroid(obj, name) -> Vector`. Later items add steps in the gaps (for example `20_likeness.py` before the bake in `30_bust.py`, `40_tear.py` after it) and the driver picks them up by filename order.

- [ ] **Step 1: `10_base.py`** - clear the scene; import `HumanService`, `AssetService`, `TargetService` from `bl_ext.user_default.mpfb.services` (fail with "MPFB 2 is not installed or enabled" on ImportError); `create_human(scale=0.1)` with default macros; add `low-poly/low-poly.mhclo` eyes with `subdiv_levels=0`; name the basemesh `Human`; MPFB targets stay live so a likeness step can still change them; save.
- [ ] **Step 2: `30_bust.py`** - `TargetService.bake_targets`, record the joint centroids, apply the `Hide helpers` mask; then on the body: bisect at `z_cut = shoulder_z - 0.06` clearing below, then duplicate and bisect at `z_neck = neck_z + 0.02` into `Head` (above) and `Bust` (below). Split the eye mesh by x sign into `EyeHuman` (x < 0) and `EyeRed` (x > 0). Scale everything about the world origin by `k = 2.2 / (2 * (crown_z - eye_z))` (crown = head mesh max z). Pivot = (0, centre of the cranium's y extent, eye_z - 0.14 / k) in pre-scale units; translate all objects so the pivot sits at the origin, set `Head` origin there, parent `EyeHuman`, `EyeRed` and a new empty `Glasses` to `Head` keeping transforms. Materials: Principled skin `#c8957c` roughness 0.55 on `Head`/`Bust`, eye white roughness 0.3 on `EyeHuman`, emission red `#ff2a1a` strength 4 on `EyeRed`. Save.
- [ ] **Step 3: `90_export.py`** - render front (camera on -Y) and three-quarter (45 degrees toward +X) previews with EEVEE at 900 x 900 to `--renders`; export `--glb` with `export_format='GLB'`, `export_yup=True`, `export_apply=True`, no animations, no cameras or lights.
- [ ] **Step 4: Verify** by running the three steps by hand; expected `build/raw.glb` and two PNGs.
- [ ] **Step 5: Commit** `feat(head): headless Blender steps for the MPFB base bust`.

### Task 3: Driver, npm script and docs

**Files:**
- Create: `art/head/build.mjs`, `art/head/README.md`, `art/head/CREDITS.md`, `art/head/head.glb`
- Modify: `package.json` (script `head`, dev dependency `@gltf-transform/cli`), `.gitignore` (`art/head/build/`, `art/head/renders/`)

**Interfaces:**
- Consumes: `checkGlb` (Task 1); step CLI (Task 2).
- Produces: `npm run head` = `node --test art/head/check.test.mjs && node art/head/build.mjs`.

- [ ] **Step 1: Install** `npm i -D @gltf-transform/cli`.
- [ ] **Step 2: Implement `build.mjs`**: resolve Blender (Review Focus 2); run `steps/NN_*.py` in order, chaining blends (Review Focus 1, 5); `node <cli bin> meshopt build/raw.glb build/head.glb`; `checkGlb`; on pass copy to `art/head/head.glb` and print bytes, triangles and node names; on fail print errors and exit 1 (Review Focus 4).
- [ ] **Step 3: Run** `npm run head` - expected the checker tests pass and stats print; then `npm run build` passes.
- [ ] **Step 4: Look at** `art/head/renders/front.png` and `three-quarter.png`: a neutral bald MPFB bust, cut below the shoulders, facing the camera.
- [ ] **Step 5: Docs**: README (run command, steps, outputs, `BLENDER`, how to add a step); CREDITS (MPFB 2 base mesh and low-poly eyes, CC0, MakeHuman/MPFB project).
- [ ] **Step 6: Commit** `feat(head): npm run head builds and checks the bust GLB`.
