# Billboard hero implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The hero mockup opens on the Billboard slideshow alone, HUD profile first, with the intro, the bust and the screen wall behind one quiet "Extras" menu and no 3D loaded until one of them is asked for.

**Architecture:** A new mockup page, `billboard-hero.html`, is cut down from `hero-slideshow.html`: one layout, no mode switcher. The three.js block moves out of the page into `hero-extras.js`, which the page imports on demand. The page itself owns the arrival classes, the slideshow, the Extras menu and the stored choices; the module only draws the bust, plays the intro and reads the hero's classes as it does today.

**Tech stack:** One static HTML page with inline CSS and vanilla scripts, three.js 0.160.0 from the existing import map, served by the brainstorm companion. No build step, no new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-12-billboard-hero-design.md`

## Global constraints

- The mockup lives under `.superpowers/` and is gitignored. The only commits from this plan are the spec, this plan and `docs/VISION.md` (task 4).
- All mockup files are in `.superpowers/brainstorm/79349-1794537008/content/`, called `content/` below. Assets are referenced with the same `/files/<name>` prefix the page already uses for `head.glb`.
- Leave `hero-slideshow.html` untouched: it is the record of the five layouts.
- No new dependencies.
- Copy: sentence case, no em dashes, "cyborg" not "android" in anything newly written. Menu labels are exactly "Extras", "Watch intro", "Show the bust", "Hide the bust", "Screen wall", "Back to the slideshow".
- The slideshow opens on the `hud` project, then `2100`, `gnome`, `anti`, `strength`, `cosmic`, `stickfight`.
- Reduced motion: no slide zoom, no arrival, slides change by plain swap, the intro is not offered.
- The slideshow holds while the caption, pips or rail are hovered or focused, and answers the arrow keys.
- Never commit to `main`. Docs go on a feature branch and reach `main` through a PR after `npm run build` passes and a review is clean.

## Verification method

There is no test suite for the mockup. Each task is checked in a browser:

- The companion server was stopped for low memory. Ask Cameron before starting it
  (`scripts/start-server.sh --project-dir <repo root> --open`, same project dir reuses the
  port). The newest HTML in `content/` is what it serves, so `billboard-hero.html` must be
  the most recently modified file.
- Drive it with the user-level `playwright` MCP server only (`mcp__playwright__*`).
  `browser_evaluate` asks Cameron first; prefer `browser_snapshot`,
  `browser_network_requests`, `browser_console_messages` and screenshots. Save screenshots
  under `.playwright-mcp/` in the repo.
- The headless browser paints the first frames slowly. Wait 5 s after navigation before
  judging the opening state.
- Every check ends with `browser_console_messages` showing no errors.

## Review focus

1. The 3D module fails to load (CDN blocked, offline) with a stored bust or wall choice, or after a menu click: the slideshow keeps running, the switch goes back to off, the stored choice is cleared, nothing is thrown. (Task 3)
2. Reduced motion: the menu offers "Screen wall" only. "Watch intro" is not offered (spec), and "Show the bust" is not offered because its only effect, the scroll peek, does not run under reduced motion. A stored bust choice is ignored. (Task 2; this is Claude's call, flagged to Cameron.)
3. "Watch intro" pressed twice quickly, or again while the intro is playing or the module is still loading: one intro plays once. (Task 3)
4. "Watch intro" pressed while scrolled down the page or with the screen wall on: the page goes to the top, the intro plays, and the hero returns to whichever of the two it was showing. The slideshow holds on its current slide for the length of the intro. (Task 3)
5. Storage unavailable (private window, blocked site data): every switch still works for the visit and nothing is thrown. (Task 2)

---

### Task 1: Billboard-only page

**Files:**
- Create: `content/billboard-hero.html` (copy of `content/hero-slideshow.html`)

**Interfaces:**
- Produces: a hero whose class list is driven by two booleans only. `.hero.show.m-billboard` is the slideshow; `.hero.tvmode` is the screen wall. `.hero.nobust` hides the bust. A global `window.heroState = { bust: false, wall: false }` and `window.applyHero()` which writes those classes from it. `window.__heroCfg` is `{ hide: 1 }` in the slideshow and `{}` on the wall, as today.
- Produces: the arrival, owned by a plain (non-module) script: `lit` added to `.hero` at once, `ready` after 800 ms, both at once under reduced motion.

- [ ] **Step 1: Copy the page.** Copy `hero-slideshow.html` to `billboard-hero.html`.

- [ ] **Step 2: Remove the other layouts.** In the copy, delete the CSS rules for `.hero.m-marquee`, `.hero.m-index` and the Reel-only rules, the `#sx-list` element with its `.sx-list` styles and script code, the Reel markup (`.rc` cards and their script), and from the mode script: `MODES`, the `marquee`, `index` and `reel` entries of `HEADCFG`, the `?m=` and `heroMode2` reads and writes, and the `.hmode` click handlers. Keep everything the screen wall needs.

- [ ] **Step 3: Add `heroState` and `applyHero()`** in the script that held `setMode`. `applyHero()` toggles `tvmode` from `heroState.wall`, `show` and `m-billboard` from `!heroState.wall`, `nobust` from `!heroState.bust && !heroState.wall` (the wall always has the bust in it), and sets `window.__heroCfg`. Call it once at load with both false.

- [ ] **Step 4: Move the arrival out of the module.** Add the `lit`/`ready` script from Interfaces. In the module, delete the line `introEl.classList.add('gone'); hero.classList.add('lit');` only after confirming `.intro` starts hidden without it; if it does not, add the `gone` class in the markup.

- [ ] **Step 5: Hold on focus and plain swap.** The slideshow holds on hover today. Make `focusin` on the caption, pips or rail hold it too and `focusout` release it. Under reduced motion, confirm slides change with no crossfade or zoom and fix the CSS if they do not.

- [ ] **Step 6: Check.** Navigate to the page. Expect: Billboard with the Futuristic HUD Portfolio slide first, caption, pips and "Up next" rail showing `2100`, `gnome`, `anti`; no bust; arrows change slides; hovering the caption, or tabbing to its link, holds the progress pip. The old controls pill still shows and its layout buttons are gone or inert (it is replaced in task 2). No console errors.

### Task 2: Extras menu

**Files:**
- Modify: `content/billboard-hero.html` (the `.placeholder-tag` markup near the end of the hero, its CSS, and the plain script from task 1)

**Interfaces:**
- Consumes: `heroState`, `applyHero()` from task 1.
- Produces: markup, replacing the `.placeholder-tag` pill:

```html
<div class="extras">
  <button id="extras-btn" aria-expanded="false" aria-controls="extras-menu">Extras</button>
  <ul id="extras-menu" hidden>
    <li><button id="x-intro">Watch intro</button></li>
    <li><button id="x-bust" aria-pressed="false">Show the bust</button></li>
    <li><button id="x-wall" aria-pressed="false">Screen wall</button></li>
  </ul>
</div>
```

- Produces: `window.setBust(on: boolean)` and `window.setWall(on: boolean)`. Each updates `heroState`, calls `applyHero()`, updates its button (`aria-pressed`, and the label pairs "Show the bust"/"Hide the bust" and "Screen wall"/"Back to the slideshow") and stores `'1'` or `'0'` under `heroBust` or `heroWall`. `window.store = { get(key), set(key, value) }` wraps `localStorage` in try/catch and is the only storage access on the page.
- Produces: a `watch-intro` click on `#x-intro` with no handler yet (task 3 wires it).

- [ ] **Step 1: Markup and style.** Replace the pill with the markup above. `.extras` sits on the bottom edge of the hero, `z-index` above the slideshow pieces. `#extras-btn` is a quiet text link in the caption's secondary text colour, not a pill, with a visible focus ring. The menu opens upward. Nothing overlaps the caption, pips or rail at 1280x720 or 1920x1080.

- [ ] **Step 2: Menu behaviour.** `#extras-btn` toggles `hidden` on the menu and `aria-expanded`. The menu closes on Escape (focus returns to `#extras-btn`), on a click outside, when focus leaves `.extras`, and after any item is chosen.

- [ ] **Step 3: `store`, `setBust`, `setWall`.** Implement them as in Interfaces and wire `#x-bust` and `#x-wall` to flip their state. At load, read `?bust=1`, `?wall=1`, then `heroBust` and `heroWall`, and apply.

- [ ] **Step 4: Reduced motion.** Under `(prefers-reduced-motion: reduce)` remove the `#x-intro` and `#x-bust` list items at load and ignore a stored or query bust choice.

- [ ] **Step 5: Check.** Fresh load: the only trace of the extras is the word "Extras". Open it with the keyboard, press Escape, confirm focus is back on the button. Turn on "Screen wall": the wall replaces the slideshow, the item reads "Back to the slideshow"; reload and the wall is still on; turn it off. Turn on "Show the bust": the hero looks the same at the top (the bust appears in task 3's check), the item reads "Hide the bust", and it survives a reload. With `browser_emulate_media` set to reduced motion, the menu holds "Screen wall" only. No console errors in any of these, including one run in a context with storage blocked if the tool allows it; otherwise read `store` and confirm every access is inside try/catch.

### Task 3: 3D on demand

**Files:**
- Create: `content/hero-extras.js`
- Modify: `content/billboard-hero.html` (remove the inline module; add the loader to the plain script)

**Interfaces:**
- Consumes: `heroState`, `setBust`, `setWall`, `store` and the slideshow's hold mechanism from tasks 1 and 2.
- Produces: `hero-extras.js`, an ES module holding the whole former inline module. It exports `startIntro(): void` and `onIntroEnd(cb: () => void): void`. Importing it starts the render loop; it keeps reading `.hero` classes and `window.__heroCfg` each frame as it does now.
- Produces: `window.loadExtras(): Promise<module>` in the page: one cached `import('/files/hero-extras.js')`. The import map stays in the page.

- [ ] **Step 1: Extract.** Move the body of the `<script type="module">` block into `hero-extras.js` unchanged, then: export `startIntro`; add `onIntroEnd` and call its callbacks from `finishIntro`; make `startIntro` return early when an intro is already playing (`!introDone && !quick`); delete the `#replay` listener; keep the `#skip` listener.

- [ ] **Step 2: Loader.** Add `loadExtras()`. Call it when `setBust(true)` or `setWall(true)` runs (including from stored choices at load) and when `#x-intro` is clicked. If the import rejects: call `setBust(false)` and `setWall(false)`, which also clears the stored choices, and leave the slideshow running. Do not show an error to the visitor.

- [ ] **Step 3: Watch intro.** `#x-intro` click: ignore it if a load or an intro is already in progress; otherwise hold the slideshow, `await loadExtras()`, call `startIntro()`, and in `onIntroEnd` release the hold. The hero's `tvmode`/`show` classes are not changed by the intro, so it returns to whichever hero was showing.

- [ ] **Step 4: Check the default costs no 3D.** Fresh load with stored choices cleared. `browser_network_requests` lists no request for `three.module.js`, `hero-extras.js` or `head.glb`.

- [ ] **Step 5: Check each extra.** "Show the bust": the three requests appear; scrolling down the hero brings the bust and its hands up over the ledge; scrolling back parks it. "Screen wall": the wall with the bust in it; "Back to the slideshow" returns. "Watch intro" from the slideshow: the intro plays once and lands on the Billboard at the slide it left; two quick clicks still play one intro; "Skip intro" ends it. "Watch intro" with the wall on and the page scrolled down: scrolls to the top, plays, lands on the wall.

- [ ] **Step 6: Check the failure path.** Temporarily change the import path to a file that does not exist, load with `?bust=1`: Billboard runs, "Show the bust" reads off, no uncaught error in the console (a failed-request line is expected). Restore the path.

### Task 4: Roadmap wording and commit

**Files:**
- Modify: `docs/VISION.md` (first paragraph, and the first "Done when" bullet)
- Commit: `docs/VISION.md`, `docs/superpowers/specs/2026-11-12-billboard-hero-design.md`, `docs/superpowers/plans/2026-11-12-billboard-hero.md`

- [ ] **Step 1: Reword the opening.** Replace the first sentence of `docs/VISION.md` with: "The redesigned portfolio's hero is a Billboard slideshow of the work. A live head that follows the visitor's mouse and glances at the active project is an extra the visitor can turn on, alone over the ledge as the page scrolls or inside the screen wall." Keep the rest of the paragraph.

- [ ] **Step 2: Reword the first "Done when" bullet** to: "With the bust or the screen wall turned on, the hero shows the bust instead of the placeholder, with identical behaviour." Add under Design: "The default hero is specified in `docs/superpowers/specs/2026-11-12-billboard-hero-design.md`." Do not touch the roadmap items.

- [ ] **Step 3: Gates.** Create branch `billboard-hero` from the current branch's merge base with `main` if the working tree allows it, otherwise ask Cameron which branch should carry the docs. Run `npm run build`; expect it to finish with no errors. Grep the three files for a user home path; expect no hits. Run the project's review on the diff and address findings.

- [ ] **Step 4: Commit and open a PR.**

```bash
git add docs/VISION.md docs/superpowers/specs/2026-11-12-billboard-hero-design.md docs/superpowers/plans/2026-11-12-billboard-hero.md
git commit -m "spec: Billboard hero, extras behind a menu"
```

Push the branch and open a non-draft PR.
