# Cyborg head bust - design

Date: 2026-11-08
Status: draft, awaiting approval

## Intent

The hero of the redesigned portfolio has a live Three.js head that follows the mouse and
glances at the active project. Today it is a placeholder built from primitives: a sphere
split into a skin half and a metal half. This goal replaces it with a real model: a bust
of Cameron, half human and half android, with a red robot eye. It is the signature image
of the site, so it should read as "that's Cameron, part machine" at a glance.

It is a likeness, not a copy. Friends should recognise him; it does not need to pass as
a scan.

## Goals

- A stylized-real bust (head, neck, top of the shoulders) that resembles Cameron's photo:
  a rounder face, full dark beard and mustache, short dark hair with faded sides, rimless
  rectangular glasses, mid-30s, a warm resting expression.
- A Terminator-style patch torn open on one side: from the temple, across the eye socket
  and cheek, down toward the jaw. Ragged skin edge, metal skull and mechanics underneath,
  a red glowing robot eye in that socket. The mouth, nose, most of the beard, the ear and
  the neck stay human, so the face still reads as Cameron.
- A simple collared shirt on the shoulders, like the reference photo.
- The glasses stay whole on both sides; the red eye glows through the lens.
- A drop-in replacement for the placeholder: same behaviour, no new interactions.
- Free and CC0 throughout.

## Non-goals (for now)

- Eye tracking, blinking, expressions, lip sync, shape keys for the face.
- Photoreal skin, strand hair, subsurface tricks that the web cannot afford.
- The hands that grip the hero edge. They stay placeholders.
- The Astro site build. The redesign has not been built yet; this goal ends with the head
  working in the hero mockup and a GLB ready for the site.

## Anti-goals

- An uncanny face. Stylized and warm beats realistic and dead. If a step makes the face
  creepier, back it out.
- A seam that looks like two models glued together. The tear must read as skin peeled
  back from one continuous head.
- Anything not CC0 (or self-made) in the shipped model.
- A download that slows the hero. The intro already runs about 6 s; the head must be ready
  inside it on a normal connection.

## Constraints

- Tools: Blender 5.2 with MPFB 2 (2.0.17, installed). Blender runs headless from scripts
  (`blender -b --python ...`), which is verified to work with MPFB loaded. The official
  Blender Lab MCP server is available for live viewport work but is optional.
- Licensing: MPFB output and bundled assets are CC0. Any other asset (beard, glasses,
  textures, kitbash parts) must be CC0 or made here. Record every source in
  `art/head/CREDITS.md`.
- Installed MPFB assets: eyes (high and low poly), 12 eyebrows, 4 eyelashes, 10 hair
  styles. No skin textures and no beards or glasses are installed; those are found (CC0)
  or built.
- Web budget: under 3 MB GLB, roughly 20k to 40k triangles, textures at most 2048 px,
  meshopt geometry compression and KTX2 textures. Blender's exporter writes neither, so
  `@gltf-transform/cli` is added as a dev-only dependency (approved by Cameron 2026-11-08)
  to compress the exported GLB. Loaded with `GLTFLoader` plus `MeshoptDecoder` and
  `KTX2Loader` (Three.js r160, already in the mockup via import map).
- Reference photo: Cameron's own photo, kept outside the repo (the repo is public). It is
  reference only: never committed and never projected onto the model. Scripts encode the
  likeness as numbers (MPFB targets, sculpt values); they do not read the photo.
- No em dashes in code, comments or docs (repo rule).

## Decided

From Cameron:
- Likeness from his photo, not a copy.
- Ragged Terminator tear, not a clean panel seam.
- The tear is a patch (temple, eye socket, cheek, toward the jaw), not a full vertical half.
- Glasses whole, red eye glowing through the lens.
- Stylized real now; may push toward realism later, so keep the pipeline able to.
- Behaviour matches the placeholder exactly: head follows the mouse, glances at the
  active project after 2.5 s idle, the scroll peek and its rise, the dim-then-lit intro.

Calls made for him (he can overrule):
- One model, not two. One base head; a mask (vertex group or alpha) removes skin on the
  android side; an inner skull shell, a shrunken copy of the same head, carries the
  hard-surface parts. Eyes, glasses and the seam all share one base so nothing drifts.
- Android side is Cameron's left, the viewer's right. This matches the placeholder and
  its android hand (`side: 1`).
- Red eye is the one colour outside the site palette (mint stays reserved for pressable
  things, indigo for selected). It is emissive and gets a small red point light in
  Three.js. The placeholder's mint droid eye and mint seam go away.
- Bust ends in a clean horizontal cut just below the shoulders' top line, wearing a simple
  collared shirt.
- Cameron reviews likeness renders (front and three-quarter, next to the photo) before any
  tear or android work starts. That review is the only stop in an otherwise unattended run.
- "Rebuilds the same GLB" means visually equivalent, not byte-identical.
- Sources live in the repo under `art/head/`: numbered Python build scripts are the source
  of truth and rebuild the head from nothing. `.blend` files are build outputs and are
  gitignored. Preview renders go to `art/head/renders/` (gitignored). The shipped GLB is
  committed.

## Contract with the hero

The GLB must slot into the existing rig in the mockup
(`.superpowers/brainstorm/.../full-page.html`, the "Placeholder head" block):

- Units and orientation: glTF defaults (+Y up, facing +Z). Scaled so the skull is about
  the placeholder's size (head height about 2.2 units before `HEAD_SCALE`), so the scroll
  peek math, the hands and `EYE_LOCAL_Y` keep working with at most a constant change.
- Nodes, by name:
  - `Bust`: shoulders and neck, static (attached to `rig`).
  - `Head`: everything above the neck, pivot at the skull centre, where the placeholder
    `head` group pivots, so the motion feels the same and the fixed `EYE_LOCAL_Y` scroll
    peek math holds. The JS rotates this node exactly as it rotates the placeholder `head`
    group today. The JS writes `head.position.y` for the idle bob, so the node carries no
    translation of its own (wrap it in a group if needed).
  - `EyeRed`: the robot eye, emissive material, child of `Head`.
  - `EyeHuman`: the human eye, child of `Head`.
  - `Glasses`: child of `Head`.
- Loading: the placeholder stays until the GLB has loaded, then swaps out. On load failure
  the placeholder stays. Reduced motion behaves as today.

## Left to the builder

- Exact MPFB macro and target values for the likeness.
- How the beard and hair are made (MPFB hair asset, sculpted shell with normal map, hair
  cards), as long as they fit the budget and read as stylized real.
- Skin material approach (procedural or baked), the tear mask technique, and the android
  part design, as long as the tear reads ragged and the metal reads as an inner skull.
- Lighting used for preview renders. In the hero the existing lights (key white, indigo
  rims) are the judge.
- Retopo and decimation strategy to hit the budget.

## Done when

- The hero mockup shows the bust instead of the placeholder, with identical behaviour.
- Side by side with the photo, the human half reads as Cameron.
- The tear reads as ragged skin over metal, and the red eye glows through the glasses.
- The GLB is under 3 MB and the page holds 60 fps on a mid-range laptop.
- Running the scripts in `art/head/` from a clean checkout rebuilds a visually equivalent
  GLB.

Note: the hero mockup lives under the gitignored `.superpowers/`, so the hero integration
is not committed. What ships in git is `art/head/` (scripts, credits, a README with the
run command) and the GLB. The Astro redesign consumes the GLB and the node contract above.
