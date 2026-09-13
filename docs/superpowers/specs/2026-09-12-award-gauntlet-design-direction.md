# Award gauntlet design direction

Status: direction set; foundation (tokens, type, labels) implemented in this piece.
The hero identity moment, motion, and layout refinements are later pieces.

## Context

The page currently reads as a generic developer template: Inter, a blue-hour
palette that overrides an earlier acid-green one, monospace all-caps eyebrows,
"01 / PROJECT" counters on cards that are not a sequence, a "PROJECT SPOTLIGHT"
badge that names the component instead of the content, and a middle-dot tagline.
None of that says anything about the person or the work.

The work itself is specific. Three of the five projects are warm brass or amber
on a dark ground (Antikythera Mechanism, Tavernborn, Strength Path); the other two
are neon on deep violet (Cosmic Drift, HUD Portfolio). The recurring subjects are
orbit and space, curious old mechanisms and gears, arcade energy, and disciplined
training. The site's earlier incarnation was a night sky with meteors. That is the
raw material for an ownable identity.

## Subject, audience, and primary job

- Subject: Cameron Loveland, software engineer. Games (Cosmic Drift, Tavernborn),
  a mobile app in progress (Strength Path), an experiment (Antikythera Mechanism),
  and web (Futuristic HUD Portfolio).
- Audience: hiring managers and engineers who will spend under a minute here, and
  design-literate visitors who decide in a few seconds whether the page is worth
  attention.
- Primary job: put five projects on screen in a form that is instantly legible
  (what it is, whether you can use it now, where to open it), and make the page
  feel like it belongs to one specific person rather than a template.

## Concept: the instrument

The unifying idea is an astronomical instrument, an orrery. The Antikythera
mechanism is an ancient computer for predicting the sky; the games and the HUD
portfolio are set in that sky; the old site was that sky. Brass rings on a night
ground is the image the whole system serves: warm metal instruments against deep
indigo, with a single neon note for the arcade side.

## Palette

Dark is the primary theme. Light is a real daytime counterpart, not an inversion.
The night ground is a saturated indigo, deliberately not a tinted near-black.
Brass is the accent in both themes; in light mode the text-safe accent shifts to
a darker bronze while fills (buttons, the active view toggle) stay brass so the
identity survives the theme switch.

Dark theme:

| Name | Hex | Role |
| --- | --- | --- |
| Night | #0e1128 | page ground |
| Nightfall | #181c3a | raised surface (cards, controls) |
| Dusk | #242a55 | second raise (active selector, chips) |
| Starlight | #eef0fb | primary text |
| Brass | #e9bb5c | accent: links, active states, fills; never a category, so chrome and category never share a hue |
| Ion | #79d5ef | category: experiments; text selection, sky zenith |
| Rose | #f088b8 | category: games |
| Periwinkle | #a3a6ff | category: web |
| Verdigris | #62d5a0 | category: mobile apps |
| Ember | #f5a66a | category: prototypes (redder than Brass so chrome and category stay apart) |

Light theme:

| Name | Hex | Role |
| --- | --- | --- |
| Daylight | #f3f4fa | page ground (pale periwinkle, not cream, not white) |
| Paper | #ffffff | raised surface |
| Haze | #e3e6f3 | second raise |
| Ink | #151934 | primary text (same hue family as Night) |
| Bronze | #855810 | accent for text and links (5.6:1 on Daylight) |
| Deep Ion | #0b6a84 | category: experiments; sky zenith |
| Deep Rose | #b3266e | category: games |
| Indigo | #4b4fd6 | category: web |
| Deep Verdigris | #1a6f4e | category: mobile apps |
| Rust | #9c400a | category: prototypes (6.2:1 on Daylight) |

Brass (#e9bb5c) is also the fill color in light mode, with Ink text on it.
Supporting tokens (secondary and muted text, borders) are derived in the same hue
family and meet AA for normal text on their ground.

## Typography

One family: Schibsted Grotesk (variable, OFL, self-hosted, latin subset with
a weight axis from 400 to 900, 47 KB). It is an editorial grotesk: firm and
legible as text, with enough character at heavy weights to carry a title over
imagery, so a single file covers both roles and the page never mixes a
"display" personality with a neutral body face. It replaced Bricolage Grotesque
after the owner compared eleven faces on the hero stage. No monospace anywhere: dates, counts, and tags are set in the
same family with tabular numerals.

Roles and scale (fluid where it matters):

| Role | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Display (hero title) | clamp(2rem, 1.2rem + 3.2vw, 3.25rem) | 700 | -0.02em | 1.0 |
| Title (page h1, card h3) | clamp(1.5rem, 1.2rem + 1.2vw, 1.875rem) | 700 | -0.025em | 1.1 |
| Year (timeline) | clamp(2.5rem, 2rem + 2vw, 3.75rem) | 800 | -0.04em | 1.0 |
| Heading (journal h4) | 1.5rem | 700 | -0.02em | 1.15 |
| Wordmark | 1.25rem | 400 first name, 700 surname | -0.02em | 1.2 |
| Body | 1.0625rem (17px) | 400 | 0 | 1.55 |
| UI (buttons, links, filters) | 0.9375rem (15px) | 500 | 0 | 1.4 |
| Small (meta, tags, status) | 0.8125rem (13px) | 500 | 12 | 0.005em | 1.4 |

Rules: sentence case everywhere, including labels. No tracked-out capitals. No
number prefixes on things that are not a sequence. Timeline years and dates are
the only numerals that lead anything, because the timeline is a real sequence.

## Layout

The page is a single left-aligned column with one shared left edge: wordmark,
hero caption, page title, cards, timeline, and footer all sit on it. Content
stays left-aligned; nothing is centered except the empty state. The hero frame,
card media, and journal cards are the only large rounded objects; everything
else is text on the ground.

Radius encodes hierarchy rather than decorating everything equally:

| Token | Value | Used for |
| --- | --- | --- |
| radius-frame | 24px | the hero stage |
| radius-card | 16px | card media, journal cards, empty state |
| radius-control | 12px | grouped controls (view toggle shell) |
| radius-tag | 6px | stack tags, category chips |
| radius-pill | 999px | anything you press: filters, buttons, the theme toggle |

Elevation in dark mode is a lighter surface plus a one-pixel inner rim light at
the top edge, the way brass catches light; drop shadows are reserved for the hero
frame. In light mode elevation is a soft ink-tinted shadow, never a neutral grey.

Spacing uses a 4px scale (4, 8, 12, 16, 24, 32, 48, 64, 96). The hero, card grid,
and timeline keep their current structure and dimensions in this piece.

## Principles

1. Labels carry information or they go. A card shows its category and whether
   it is live or in progress. It never shows "01 / PROJECT".
2. One accent, spent on one thing at a time. Brass marks what is active and
   what can be pressed. Each category owns one color (`--cat-*`), read on the
   timeline rods, the status lamps and the category word; in progress is a
   state, not a color: a hollow lamp and a dashed rod end.
3. Both themes are finished. Light mode has its own ground, its own accent
   contrast, and its own elevation model.
4. The instrument, not the template. Round forms (rings, dials, pills), warm
   metal on night, and a display face with character are the identity. Grey
   hairlines, mono captions, and eyebrow labels are not.
5. Restraint in copy. Sentence case, plain verbs, and names that say what a thing
   does ("Play now", "Open website", "Visit website", "Open project", "Back to top"; the primary link is named by category in src/utils/linkLabel.ts).

## The one memorable thing

Above the fold, the featured project fills a wide stage, the full width of the
column in the large-radius frame, with the category, the status lamp and the
title over the artwork at the bottom left and the one thing to press at the
bottom right. Under the stage sits the instrument, one row: a shallow brass
arc, drawn as inline SVG, that runs from the previous terminal at its left end
to the next terminal at its right, two round buttons the arc visibly joins.
The arc is engraved like the Antikythera calendar ring, fine ticks along its
length and a heavier major at each body, and it carries the bodies. Each
featured project is a small brass body on the arc with its title and category
beneath it; the active body takes the brass fill and glows, a small brass hand
rides the arc to sit over it when the reel turns, always square to the curve,
and the slide timer is a brass line that draws along the arc from the active
body toward the next. Pause sits at the next terminal's side. The bodies are
the selector: choosing one turns the mechanism to it. Positions are shares of
the width, so the arc takes any number of projects; past seven, only the
active body and its neighbours are named, and when the spacing gets narrower
than the widest title only the active body is.

On first paint the instrument winds up once: the stage settles in, the arc
draws itself from terminal to terminal, its ticks come up, the bodies take
their places in order, and the hand travels along the arc to the first project
before the timer starts. The maker's mark in the header is the instrument in
miniature: its one body turns about the ring by the share of the arc the hand
has travelled, at the hand's pace. Under reduced motion everything is simply
there, and the mark is simply at its angle.

Phones get the stage and a different selector, since the arc is not practical
that narrow: a strip of chips under the stage, one per project with its
thumbnail, title and category, that scrolls sideways and snaps chip by chip.
The active chip takes the brass ring and carries the timer as a brass line
along its top edge; previous and next sit on the stage at its sides, pause in
its top corner, and the stage takes a swipe.

In dark mode a sparse, static field of Starlight points sits behind the stage,
kept out of the header band so nothing lands beside the name. In light mode
the arc and its ticks render as fine ink lines on Daylight, like an engraving
plate. A single meteor streak, rare and CSS-only, crosses the band of sky
above the stage.

Everything in this piece serves that moment: Brass is the metal of the arc, the
hand and the bodies, Night is the sky, the pill and frame radii are the
instrument's geometry, and the display face is the engraved label.

## What this piece implements

- Schibsted Grotesk self-hosted in `public/fonts/`, declared with
  `font-display: swap` and preloaded in `Layout.astro`.
- The token block in `src/styles/portfolio.css`: color (light and dark parity),
  type scale, radius scale, spacing scale, elevation.
- All label treatments replaced: no eyebrows, no "01 / PROJECT", no
  "PROJECT SPOTLIGHT", no middle-dot tagline, no number prefixes on carousel
  selectors, no monospace. Status is "Live" or "In progress" everywhere.
- Text glyph controls (arrows, pause bars) replaced with inline SVG icons.

## Left for later pieces

- The instrument hero identity moment described above.
- Motion choreography (page-load reveal, the hand's travel on slide change).
- Any change to the hero, card grid, or timeline layout dimensions.
