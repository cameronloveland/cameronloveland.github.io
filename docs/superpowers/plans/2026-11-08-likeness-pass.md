# Likeness pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the neutral MPFB bust into a stylized-real likeness of Cameron (face shape, hair, beard, brows, skin tone, brown eyes) and produce side-by-side review renders for his sign-off.

**Architecture:** A new `20_likeness.py` sets MPFB macros, face targets and a light resting smile while targets are still live, then refits the eyes. `30_bust.py` gets the new skin tone and an iris and pupil on `EyeHuman`. A new `45_hair.py` (after the hoodie, so the hoodie never sees the shells) grows hair, beard, mustache and brows as offset shells of the skin's own faces, kept inside the `Skin` mesh (`Hair` and `Beard` materials), so they share its weights and bend with the neck. `90_export.py` adds face close-ups. The photo comparison is assembled outside the repo.

**Tech Stack:** Blender 5.2 headless, MPFB 2.0.17 (`HumanService`, `TargetService`), bmesh, Node build driver `art/head/build.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md`

## Global Constraints

- Reference photo is reference only: never committed, never projected, never read by a script in the repo. Likeness lives as numbers.
- Stylized and warm beats realistic and dead; if a change makes the face creepier, back it out.
- CC0 or made here only; record every source in `art/head/CREDITS.md`.
- Node contract unchanged: `Bust`, `Head`, `EyeHuman`, `EyeRed`, `Glasses`; one skinned `Skin` mesh driven by `Bust` and `Head`.
- Budget: GLB under 3 MB, at most 40,000 triangles (enforced by `check.mjs`).
- Android side is character left (+X); human eye is `EyeHuman` (-X).
- No em dashes in code, comments or docs.

## Review Focus

1. Shells at the hero's turn limits: beard and neck shell faces must carry the same `Head`/`Bust` weights as the skin under them, so `turned-down` and `turned-up` show no gap or poke-through. Checked in Task 3 step 4.
2. Shell z-fighting or skin showing through: offset large enough to clear the skin at every view in the renders. Task 3 step 4.
3. Eyes after target changes: refit after every target change (README rule), or the eyes float off the sockets. Task 1 step 3.
4. Hoodie fit after a heavier body: `40_hoodie.py` places by joints, so the collar must still hug the neck in the renders. Task 1 step 4.
5. Triangle budget: shells add faces; the build's triangle count must stay under 40,000. Task 3 step 4.

---

### Task 1: Face shape (`20_likeness.py`)

**Files:**
- Create: `art/head/steps/20_likeness.py`

**Interfaces:**
- Consumes: `Human` and `Eyes` from `10_base.py`; `lib.parse_args`, `lib.mpfb`, `lib.mpfb_data`, `lib.get`, `lib.save`, `lib.fail`.
- Produces: `Human` with macros and face targets set (still live shape keys), eyes refit. Later steps see only the shaped mesh.

- [ ] **Step 1:** Set macros through `HumanObjectProperties.set_value(name, value, entity_reference=human)` then `TargetService.reapply_macro_details(human)`. Starting values: gender 1.0, age 0.58 (about 35), weight 0.68, muscle 0.45, proportions 0.5, race caucasian 0.9 / asian 0.05 / african 0.05. Tune against the photo.
- [ ] **Step 2:** Load face targets with `TargetService.load_target(human, mpfb_data("targets", <dir>, <name>.target.gz), weight=w)`, held in one `TARGETS = {name: weight}` dict at the top. Start from: head-round, head-fat-incr, both cheek-volume-incr, chin-width-incr, nose-volume-incr, eye-scale-decr, and the caucasian expression unit `mouth-corner-puller` at about 0.3 for the warm resting look. Fail with the target name if a file is missing.
- [ ] **Step 3:** `HumanService.refit(eyes)` after all targets; fail if the eye centroid moves more than 0.05 m from the `joint-l-eye`/`joint-r-eye` centroids.
- [ ] **Step 4:** Run `npm run head`. Expected: passes; renders show a male mid-30s face with rounder cheeks; hoodie collar still hugs the neck; neck clean in the turned views.
- [ ] **Step 5:** Iterate the values in steps 1 and 2 against the photo until the head shape reads as Cameron, then commit `20_likeness.py` and `head.glb`.

### Task 2: Skin tone and brown eyes (`30_bust.py`)

**Files:**
- Modify: `art/head/steps/30_bust.py` (the `material()` / `mats` block at the end)

**Interfaces:**
- Consumes: `material(name, color, roughness, emission=None)` and `srgb(hex)` in `30_bust.py`.
- Produces: `Skin` material `Skin` in a fair warm tone; `EyeHuman` with material slots `EyeWhite`, `Iris`, `Pupil`.

- [ ] **Step 1:** Skin base colour from `c8957c` to a fairer warm tone (start `e0b096`), roughness unchanged.
- [ ] **Step 2:** On `EyeHuman`, assign faces by the angle between the face normal and the eye's forward axis (-Y): within the pupil cone `Pupil` (`0b0807`), within the iris cone `Iris` (`5a3a24`), else `EyeWhite`. Pick the cones so the iris reads about 40 percent of the visible eye width. `EyeRed` stays all red and emissive.
- [ ] **Step 3:** Run `npm run head`. Expected: passes; the human eye shows a brown iris looking straight ahead in `front.png`.
- [ ] **Step 4:** Commit.

### Task 3: Hair, beard, mustache and brows (`45_hair.py`)

**Files:**
- Create: `art/head/steps/45_hair.py`

**Interfaces:**
- Consumes: `Skin` in hero units with `Head`/`Bust` groups and the `joint_*` custom properties from `30_bust.py`; `Rig`.
- Produces: extra faces inside `Skin` on material slot `Hair` (dark brown `2a1d16`, roughness 0.8). No new objects or nodes, so `40_hoodie.py`, `90_export.py` and `check.mjs` need no change.

- [ ] **Step 1:** Region tests as functions of a vertex position in hero units, each with its constants at the top: `scalp(co)` (above a hairline that sits on the forehead at the front and drops to just above the ears at the sides, shorter on the sides for the fade), `beard(co)` (jaw, chin, cheeks below a line from the ear to above the mouth corner, down to the upper neck, leaving the lips clear), `mustache(co)` (between nose base and upper lip), `brows(co)` (a strip above each eye joint). Positions come from `joint_l_eye`, `joint_r_eye`, `joint_neck`.
- [ ] **Step 2:** Duplicate the selected skin faces in bmesh, push the copies out along vertex normals (scalp about 0.05, beard about 0.04, mustache 0.03, brows 0.02, in hero units), keep the duplicated vertices' deform weights, and close nothing: the shells are open caps. Assign them to slot `Hair`.
- [ ] **Step 3:** Print the added face count with the `head build:` prefix.
- [ ] **Step 4:** Run `npm run head`. Expected: passes (triangles under 40,000); renders show short dark hair, a short full beard and mustache, dark brows; no gap or skin poke-through in `turned-down.png` and `turned-up.png`.
- [ ] **Step 5:** Iterate the region constants against the photo, then commit `45_hair.py` and `head.glb`.

### Task 4: Review renders, docs

**Files:**
- Modify: `art/head/steps/90_export.py` (the `VIEWS` table and camera distance)
- Modify: `art/head/README.md` (steps table, renders list), `art/head/CREDITS.md`

**Interfaces:**
- Consumes: the existing render loop in `90_export.py`.
- Produces: `renders/face-front.png` and `renders/face-three-quarter.png`, framed on the face at rest.

- [ ] **Step 1:** Add a per-view camera distance and target height so the two face views frame crown to chin; keep the four existing views as they are.
- [ ] **Step 2:** README steps table gains `20_likeness.py` and `45_hair.py`; the renders paragraph names the face views. CREDITS gains the MPFB face targets and expression unit (CC0) and the hair shells (made here).
- [ ] **Step 3:** Run `npm run head` and `npm run build`. Expected: both pass.
- [ ] **Step 4:** Outside the repo, compose the photo next to `face-front.png` and `face-three-quarter.png` into `%USERPROFILE%\Pictures\portfolio-head\likeness-review.png` with a scratch script, and show it to Cameron.
- [ ] **Step 5:** Commit; open the PR. Merge and check off the roadmap only after Cameron signs off on the likeness (the spec's one review stop).
