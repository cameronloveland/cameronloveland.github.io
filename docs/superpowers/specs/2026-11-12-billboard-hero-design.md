# Billboard hero - design

Status: draft for Cameron's approval. Short design (a small change to the redesign hero).

## Intent

The redesign hero opened on a wall of screens with the cyborg bust looking around at them,
after a long intro. It is impressive once and heavy every time after. The hero should open
like a project studio or game studio front page: the work, full screen, straight away. The
bust, the intro and the screen wall stay in the site as things a curious visitor can turn
on, not things every visitor has to sit through.

## Goals

- The hero is the Billboard slideshow: one featured project fills the screen, with a
  caption (category, title, one line, open link, "all projects" link), progress pips and
  an "Up next" rail of the next three projects.
- The page opens with the short slide-up/slide-in arrival only. No intro by default.
- The bust is off by default.
- The extras are out of the way: one quiet "Extras" control holds "Watch intro",
  "Show the bust" and "Screen wall". Nothing else about them is visible until it is opened.
- A returning visitor gets the same fast open every time; the bust and screen wall choices
  are remembered per browser, the intro never replays on its own.

## Non-goals

- Porting the redesign hero into `src/`. This design governs the hero mockup today and the
  real site when the redesign is ported.
- A phone layout for Billboard. It is needed before the port and gets its own pass.
- Enhancing the 3D model with the new asset tools. The bust roadmap carries on separately.

## Anti-goals

- Any extra that plays, moves or loads on a first visit without being asked for.
- A settings panel. Three switches in one small menu is the ceiling.

## Constraints

- No new dependencies. The three.js bust code and the GLB load only when the bust, the
  intro or the screen wall is turned on, so the default hero costs no 3D.
- Reduced motion: no slide zoom, no arrival, slides change by plain swap, and the intro is
  not offered.
- The slideshow holds while the caption, pips or rail are hovered or focused, and answers
  the arrow keys, as the mockup does now.

## Approaches

Three layouts were mocked up over the same slideshow engine:

- Marquee: full-bleed art, big centred title, a named segment bar. Loud, and the title
  fights the artwork.
- Billboard (picked by Cameron): full-bleed art, caption low on the left, "Up next" rail
  on the right. Reads as a studio front page and gives the artwork the most room.
- Index: a title list on the left, art in a panel on the right. Calm, but the art is small
  and it looks like a menu, not a hero.

For the extras, three ways to treat the bust in Billboard were considered: a host standing
on the right in place of the rail, the scroll peek only, or switching to the screen wall.
Cameron's call was to hide the extras, so the bust stays small: see Decided.

## Decided

- Billboard is the only layout. Marquee, Index and Reel are removed from the hero.
- The slideshow always opens on Cosmic Drift, the most polished project, playing its
  video. (Cameron, 2026-11-13) The Futuristic HUD Portfolio slide comes second: that
  picture of Cameron is the introduction to him. (Cameron) The rest follow in the
  existing featured order. This replaces the 2026-11-12 decision to open on the HUD
  slide, which is what the plan of that date records.
- "Watch intro" plays the existing intro once, then returns to the Billboard. (Cameron)
- The bust is opt-in. (Cameron)
- The extras are hidden. (Cameron) How, below, is Claude's call:
  - One "Extras" control at the bottom edge of the hero, styled as a quiet text link, not
    a pill. It opens a three-item menu.
  - "Show the bust" adds the scroll peek only: the bust and its hands rise over the ledge
    as the visitor scrolls past the hero. It does not stand in the slideshow.
  - "Screen wall" swaps the hero to the existing wall with the bust in it, and the menu
    then offers "Back to the slideshow".
  - Under reduced motion the menu offers "Screen wall" only. "Show the bust" is left out
    as well as the intro, because its only effect in Billboard is the scroll peek, which
    does not run under reduced motion. A stored bust choice is ignored, not erased.
- `docs/VISION.md` opening line changes from "the hero centres on a live head" to say the
  hero is the Billboard slideshow and the bust is an extra a visitor can turn on. The bust
  roadmap items stay as they are; "Done when" for the bust reads against the extras, not
  the default hero.

## Left to the builder

- Exact placement and wording of the "Extras" control, within "quiet and at the bottom".
- Lazy-loading mechanics for the 3D module.
- Storage keys and cleanup of the mockup's layout switcher.

## Done when

- A fresh visit shows the Billboard within the arrival animation: no intro, no bust, no
  canvas work.
- The only visible trace of the extras is the one "Extras" control.
- Each extra works from the menu, and the bust and screen wall choices survive a reload.
- Reduced motion and keyboard use behave as listed under Constraints.
