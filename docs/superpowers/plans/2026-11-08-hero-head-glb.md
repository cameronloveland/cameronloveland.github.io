# Hero head GLB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The hero mockup shows the Blender bust (`art/head/head.glb`) in place of the primitive placeholder, with identical behaviour, and keeps the placeholder if the GLB fails to load.

**Architecture:** The mockup's animation code keeps driving the placeholder `head` group exactly as today. A loader block adds the GLB scene to `rig`, hides the placeholder `head` group and neck, and each frame copies `head.rotation` and `head.position.y` onto the GLB's `Head` joint (identity rest, no translation, per the contract). The mockup is gitignored (`.superpowers/`), so nothing here is committed except this plan and the roadmap.

**Tech Stack:** Three.js r160 from the import map, `GLTFLoader` and `MeshoptDecoder` from `three/addons/`.

**Spec:** `docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md` ("Contract with the hero", "Loading")

## Global Constraints

- Behaviour matches the placeholder: mouse follow, 2.5 s idle glance, scroll peek and rise, dim-then-lit intro (CSS), reduced motion as today.
- On load failure the placeholder stays. No new interactions, no new dependencies.
- `Skin.frustumCulled = false` (Three computes skinned bounds once).

## Review Focus

1. GLB 404 or decode error: the placeholder stays and the page keeps animating (verify by renaming the file).
2. A GLB missing `Head` or `Bust`: treated as a failure, placeholder stays.
3. Load finishing mid-intro: the swap happens on the next frame with the current pose, no jump.

---

### Task 1: Load and swap

**Files:** Modify `.superpowers/brainstorm/21243-1794156690/content/full-page.html` (import map; a block after the hands setup; one line in `frame()`); copy `art/head/head.glb` next to it.

- [ ] **Step 1:** Import map gains `"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"`; import `GLTFLoader` and `MeshoptDecoder`.
- [ ] **Step 2:** Loader block: load `head.glb`; on success with both joints present, `rig.add(gltf.scene)`, `head.visible = neck.visible = false`, keep `headJoint`; on error or missing joints, do nothing.
- [ ] **Step 3:** In `frame()`, after the `head.position.y` line: `if (headJoint) { headJoint.rotation.copy(head.rotation); headJoint.position.y = head.position.y; }`.
- [ ] **Step 4: Verify by hand** in the browser: after the intro the bust is in the hero, follows the mouse, glances at the active project after 2.5 s idle, peeks while scrolling; with `head.glb` renamed the placeholder shows and the console stays clean apart from the 404.
