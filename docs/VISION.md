# Portfolio Vision

The redesigned portfolio's hero is a Billboard slideshow of the work. A live head that
follows the visitor's mouse and glances at the active project is an extra the visitor can
turn on, alone over the ledge as the page scrolls or inside the screen wall. This goal replaces the primitive placeholder with a
stylized-real bust of Cameron: a likeness from his photo, torn open Terminator-style in a
patch from temple to jaw to show a metal skull and a red robot eye, wearing his rimless
glasses. It is built free and CC0 with MPFB 2 in headless Blender and ships as a small
GLB, for visitors to the site and for Cameron as its signature image.

## Done when
- With the bust or the screen wall turned on, the hero shows the bust instead of the
  placeholder, with identical behaviour.
- Side by side with his photo, the human side reads as Cameron.
- The tear reads as ragged skin over metal, and the red eye glows through the glasses.
- The GLB is under 3 MB and the hero holds 60 fps on a mid-range laptop.
- `art/head/` rebuilds a visually equivalent GLB from a clean checkout.

## Pillars
1. Likeness first: warm and recognisable beats realistic and uncanny.
2. One model: the tear, the metal skull and the eyes share one base head.
3. Scripted and reproducible: headless Blender scripts are the source, the GLB is output.

## Design
See `docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md`: the node contract with
the hero (`Bust`, `Head`, `EyeHuman`, `EyeRed`, `Glasses`), the web budget, the CC0 rule,
the reference photo rule, and the decisions and calls already made.

The default hero is specified in `docs/superpowers/specs/2026-11-12-billboard-hero-design.md`.

## Roadmap

Append-only. Check an item with the date and a one-line note. A struck item reads
`- [x] ~~text~~ (YYYY-MM-DD: dropped - reason)`. Never delete. `next-goal` picks
the first `- [ ]` line, top tier first; `- [~] text (branch: x, plan: y)` marks the
item in progress. Spec: docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md. Approval: once.

### Next: crisp video samples in the hero (Cameron, 2026-11-13)

Record these on the PC, not in a cloud session: the sites are live 3D and a cloud session
has no graphics card, so a capture there comes out choppy and soft. Close other heavy apps
first; the PC runs low on memory. Shared recipe: capture the live site in real Chrome at
1920 wide or more with no upscaling, about 12 to 15 s that loops cleanly, no audio, H.264
with faststart at a quality that keeps edges and text sharp at full hero width, a poster
frame as WebP, and the hero mockup and the project's `video` field both pointed at it.

- [ ] Cosmic Drift: re-record the hero clip crisp. Open question for Cameron: keep the title screen, or show a race in progress, since the title screen's own logo and menu sit behind the caption
- [ ] Antikythera Mechanism: re-record the hero clip, the current one is blurry
- [ ] Gnome Glider: record a hero clip
- [ ] Futuristic HUD Portfolio: record a hero clip

### Working: the bust is in the hero with matched behaviour, rough likeness, basic tear, red eye
- [x] Head build pipeline: `art/head/` headless Blender scripts export a compressed MPFB base bust GLB with the spec's node names, plus `npm run head` and a budget check (2026-11-08: PR #97, 70 KB neutral MPFB bust; neck seam opens on turn, skinned-neck fix proposed in art/head/README.md)
- [x] ~~Hero mockup loads the head GLB in place of the placeholder with matched mouse follow, idle glance, scroll peek and load fallback~~ (2026-11-08: split into a/b)
- [x] (a) Skinned neck: one continuous bust mesh with `Bust` and `Head` as glTF joints at the origin and the neck weighted between them, so the head turns without a seam (2026-11-08: PR #98, neck bends cleanly at the hero's turn limits)
- [x] (b) Hero mockup loads the head GLB in place of the placeholder with matched mouse follow, idle glance, scroll peek and load fallback (2026-11-08: PR #99, bust swaps in after load and copies the placeholder's pose; placeholder stays on failure)
- [x] Hoodie on the `Bust` shoulders, hood down behind the neck, hiding the bust's cut edge (2026-11-08: PR #100, hoodie built from the bust, hood roll and drawstrings, no poke-through at the turn limits)
- [ ] Likeness pass on the MPFB base: face shape, haircut, beard, skin tone and eyes tuned to the photo, with side-by-side review renders for Cameron's sign-off
- [ ] Basic patch tear: a mask removes skin from temple to jaw on the android side over an inner metal skull shell
- [ ] Red robot eye: emissive `EyeRed` in the torn socket, with a red point light in the hero

### Good: it clearly reads as Cameron, ragged tear over a real metal skull, glasses, hair, inside 3 MB
- [ ] Ragged tear edge: torn skin geometry with thickness and an irregular border over the metal
- [ ] Android mechanics under the patch: eye housing, cheek and jaw pistons, cables, panel detail
- [ ] Rimless rectangular `Glasses` on the head, with the red eye glowing through the lens
- [ ] Hair pass: full beard and mustache volume plus the faded short haircut in stylized-real form
- [x] ~~Collared shirt on the `Bust` shoulders~~ (2026-11-08: dropped - replaced by the hoodie item in Working, Cameron's call)
- [ ] Human hands that grip the hero edge, replacing the capsule placeholders, the android-side hand in metal
- [ ] Web budget pass: decimation, baked normal maps, KTX2 textures and meshopt bring the GLB under 3 MB

### Polished: detail, lighting match with the hero, performance
- [ ] Hero lighting match: materials tuned under the hero's key and indigo rim lights, red eye glow balanced
- [ ] Skin and metal detail maps: pores, beard texture, metal wear and scratches within budget
- [ ] Hero performance: GLB preloaded during the intro, 60 fps on a mid-range laptop, phone fallback checked
