# Skinned neck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split `Head`/`Bust` meshes with one skinned skin mesh driven by two joints, so the hero can turn the head to its limits without a seam.

**Architecture:** `30_bust.py` keeps the body as one mesh (`Skin`), builds `Head` and `Bust` vertex groups from MPFB's CC0 default-rig weights before the helper geometry is removed, and binds the mesh to a two-bone armature whose bones both start at the origin and point straight up (identity rest in glTF). Eyes and `Glasses` are bone-parented to `Head`. The exporter drops the armature object, so `Bust` is the scene root joint and `Head` its child.

**Tech Stack:** Blender 5.2.1, MPFB 2.0.17 `rigs/standard/weights.default.json` (CC0), glTF skins, `@gltf-transform/cli meshopt`.

**Spec:** `docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md` ("Contract with the hero", updated 2026-11-08)

## Global Constraints

- The hero turns `Head` with `head.rotation.set(pitch, yaw, roll)`: yaw up to 0.744 rad, pitch up to 0.504 rad, roll up to 0.16 rad, and writes `head.position.y` (bob of 0.03). `Head` must have zero translation and identity rest rotation, or the JS overwrites part of its rest pose.
- `Bust` is the root joint at the origin with identity rotation; `Head` is its child.
- Budget unchanged: under 3 MB, at most 40,000 triangles. CC0 only; record the weights in CREDITS.
- No em dashes.

## Review Focus

1. Head weights must cover the jaw, chin, ears and eyes fully, or the face smears when the head turns: Head weight 1.0 above the neck band, verified by the turned renders.
2. Bone-parented eyes must stay in their sockets when the head turns: the turned renders show the eyes in place.
3. Quantization on a skinned mesh must not break the bind: the checker reads the shipped GLB, and the turned renders are made from the Blender scene, so a manual load check of the GLB follows in item (b).

---

### Task 1: Checker contract for joints

**Files:** Modify `art/head/check.mjs`, `art/head/check.test.mjs`

- [ ] **Step 1: Failing tests:** `Bust` must be a scene root; `Head` may be a root or a child of `Bust`; `Head` with a non-identity `rotation` fails ("rest rotation"); a GLB with a skin whose `joints` lack `Head` fails ("skin"); a GLB with no skin fails.
- [ ] **Step 2: Run** `node --test art/head/check.test.mjs` - expected the new tests fail.
- [ ] **Step 3: Implement** in `inspect()`.
- [ ] **Step 4: Run** - expected all pass.

### Task 2: One skinned mesh in `30_bust.py`

**Files:** Modify `art/head/steps/30_bust.py`, `art/head/steps/90_export.py`, `art/head/steps/lib.py`

- [ ] **Step 1:** Before `bake_targets`, load `weights.default.json` from MPFB's data dir and write groups: `Bust` share 1.0 for body bones (spine, clavicle, shoulder, arms, hands, breast, pelvis, root, legs), 0.8 / 0.4 / 0.0 for neck01 / neck02 / neck03, 0 for every other bone; `Head = 1 - Bust` normalised; Head forced to 1.0 above y -0.5 after scaling. Drop all other groups after the mask is applied.
- [ ] **Step 2:** One bisect below the shoulders, no neck split; name the mesh `Skin`. Scale and pivot as before.
- [ ] **Step 3:** Armature `Rig` with bones `Bust` and `Head`, both head (0, 0, 0), tail (0, 0, 1), roll 0, `Head` parented to `Bust` unconnected; `Skin` gets an Armature modifier; eyes and `Glasses` bone-parented to `Head` keeping their world transforms.
- [ ] **Step 4:** `90_export.py`: `export_skins=True`, `export_armature_object_remove=True`; add renders `turned-down.png` (pitch 0.504, yaw 0.744, roll 0.16) and `turned-up.png` (all negated) by posing the `Head` bone in `ZYX` mode (Three's `XYZ`), then reset the pose before export.
- [ ] **Step 5: Run** `npm run head` - expected pass; look at the turned renders for gaps, face smear and eye drift.
- [ ] **Step 6:** README (nodes, known issues removed), CREDITS (weights). Commit.
