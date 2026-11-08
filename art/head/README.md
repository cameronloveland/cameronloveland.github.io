# Cyborg head bust

The source of the hero's head. Numbered Python steps rebuild it from nothing in
headless Blender; `head.glb` is the committed output. Design and node contract:
`docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md`.

## Run

```
npm install
npm run head
```

Needs Blender 5.2 (built with 5.2.1) and the MPFB 2 extension (built with 2.0.17),
installed and enabled from any extension repository. A different MPFB version can
change the base mesh, so note the versions when you rebuild. If Blender is not at the
default install path, set `BLENDER` to its executable first.

`npm run head` runs the checker's tests, then `art/head/build.mjs`:

1. every `steps/NN_*.py` in filename order, each in its own headless Blender process
   that opens the previous step's `.blend` and saves its own to `build/`;
2. `gltf-transform meshopt` on `build/raw.glb` (meshopt compression plus quantization);
3. `check.mjs`, which fails the run if a contract node is missing or misplaced (`Bust`
   a scene root, `Head` its child, the rest children of `Head`), `Head` has a
   translation or a rest rotation, no skin is driven by both joints, the GLB is 3 MB or
   more, or it has over 40,000 triangles.

Only a passing build replaces `head.glb`. Previews land in `renders/`: front and
three-quarter at rest, plus `turned-down` and `turned-up` with the head at the hero's turn
limits, to check the neck bends cleanly. `build/` and `renders/` are gitignored. Check any GLB on its own with
`node art/head/check.mjs <file.glb>`.

## Steps

| Step | What it does |
| --- | --- |
| `10_base.py` | MPFB base human with low-poly eyes; MPFB targets stay live |
| `30_bust.py` | Weights the skin to `Head` and `Bust` from MPFB's default-rig weights, bakes the targets, cuts the bust, splits the eyes by side, scales and pivots to the hero contract, binds the two-bone rig, simple materials |
| `40_hoodie.py` | A hoodie built from the bust: the skin below a tilted neckline smoothed and pushed out, a hood roll swept round the neck (thin at the front, bunched at the back), two drawstrings; hides the skin underneath; bone-parented to `Bust` |
| `90_export.py` | Preview renders and the raw GLB export; always last |

Add a step by dropping a new numbered script in a gap: anything that changes MPFB
macros or targets goes before `30` (for example `20_likeness.py`), anything that works
on the cut bust goes between `30` and `90`. Start from `steps/lib.py` for the argument
parsing, `save()`, `get()` and `fail()`.

MPFB fits the eyes when `10_base.py` adds them and does not refit them when a script
changes targets later, so a likeness step must call `HumanService.refit` on the eyes
(or any other fitted asset) after changing targets.

## The GLB

- glTF defaults: +Y up, facing +Z. Head about 2.2 units crown to chin; the eye line sits
  0.14 above the `Head` origin, the skull-centre pivot.
- One skinned mesh, `Skin`, from the crown to below the shoulders. Two joints drive it:
  `Bust` (the scene root, static) and `Head` (its child), both at the origin with no
  rotation. The neck is weighted between them, so rotating `Head` bends the neck.
- `EyeHuman` (character right, -X), `EyeRed` (character left, +X, the android side) and
  `Glasses` (empty for now) are children of `Head`. `Hoodie` is a static child of `Bust`.
- In Three.js `Head` and `Bust` load as `Bone`s. Find nodes by name, rotate only `Head`
  with `head.rotation.set(...)` as the placeholder does, and add the whole scene to the
  rig. Quantization folds a scale and offset into the eye nodes' transforms.
- Loading needs `GLTFLoader` with `MeshoptDecoder`. Three computes a skinned mesh's
  bounds once, so set `frustumCulled = false` on `Skin` or a turned head near the screen
  edge can be culled early.
