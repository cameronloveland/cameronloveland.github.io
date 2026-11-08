# Cyborg head bust

The source of the hero's head. Numbered Python steps rebuild it from nothing in
headless Blender; `head.glb` is the committed output. Design and node contract:
`docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md`.

## Run

```
npm install
npm run head
```

Needs Blender 5.2 with the MPFB 2 extension installed and enabled. If Blender is not at
the default install path, set `BLENDER` to its executable first.

`npm run head` runs the checker's tests, then `art/head/build.mjs`:

1. every `steps/NN_*.py` in filename order, each in its own headless Blender process
   that opens the previous step's `.blend` and saves its own to `build/`;
2. `gltf-transform meshopt` on `build/raw.glb` (meshopt compression plus quantization);
3. `check.mjs`, which fails the run if a contract node is missing or misplaced, `Head`
   has a translation, the GLB is 3 MB or more, or it has over 40,000 triangles.

Only a passing build replaces `head.glb`. Front and three-quarter previews land in
`renders/`. `build/` and `renders/` are gitignored. Check any GLB on its own with
`node art/head/check.mjs <file.glb>`.

## Steps

| Step | What it does |
| --- | --- |
| `10_base.py` | MPFB base human with low-poly eyes; MPFB targets stay live |
| `30_bust.py` | Bakes the targets, cuts the bust, splits `Head` from `Bust` at the neck and the eyes by side, scales and pivots to the hero contract, simple materials |
| `90_export.py` | Preview renders and the raw GLB export; always last |

Add a step by dropping a new numbered script in a gap: anything that changes MPFB
macros or targets goes before `30` (for example `20_likeness.py`), anything that works
on the cut bust goes between `30` and `90`. Start from `steps/lib.py` for the argument
parsing, `save()`, `get()` and `fail()`.

## The GLB

- glTF defaults: +Y up, facing +Z. Head about 2.2 units crown to chin; the eye line sits
  0.14 above the `Head` origin, the skull-centre pivot.
- Nodes: `Bust` and `Head` at the root; `EyeHuman` (character right, -X), `EyeRed`
  (character left, +X, the android side) and `Glasses` (empty for now) under `Head`.
- Quantization folds a scale and offset into node transforms and can move a mesh into an
  unnamed child node, so `Head` is a plain group. Find nodes by name, never assume `Head`
  is a Mesh, and rotate only `Head`.
- Loading in Three.js needs `GLTFLoader` with `MeshoptDecoder`.
