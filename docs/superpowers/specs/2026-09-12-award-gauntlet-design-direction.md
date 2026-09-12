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
| Brass | #e9bb5c | accent: links, live status, active states, fills |
| Ion | #79d5ef | secondary: in-progress status, text selection |

Light theme:

| Name | Hex | Role |
| --- | --- | --- |
| Daylight | #f3f4fa | page ground (pale periwinkle, not cream, not white) |
| Paper | #ffffff | raised surface |
| Haze | #e3e6f3 | second raise |
| Ink | #151934 | primary text (same hue family as Night) |
| Bronze | #855810 | accent for text and links (5.6:1 on Daylight) |
| Deep Ion | #0b6a84 | secondary: in-progress status |

Brass (#e9bb5c) is also the fill color in light mode, with Ink text on it.
Supporting tokens (secondary and muted text, borders) are derived in the same hue
family and meet AA for normal text on their ground.

## Typography

One family: Bricolage Grotesque (variable, OFL, self-hosted, latin subset with
weight and optical size axes, 77 KB). It is a grotesk with visible quirks at
display sizes and a calm, readable text cut at small optical sizes, so a single
file covers both roles and the page never mixes a "display" personality with a
neutral body face. No monospace anywhere: dates, counts, and tags are set in the
same family with tabular numerals.

Roles and scale (fluid where it matters):

| Role | Size | Weight | Optical size | Tracking | Line height |
| --- | --- | --- | --- | --- | --- |
| Display (hero title) | clamp(2rem, 1.2rem + 3.2vw, 3.25rem) | 800 | 96 | -0.035em | 1.0 |
| Title (page h1, card h3) | clamp(1.5rem, 1.2rem + 1.2vw, 1.875rem) | 700 | 48 | -0.025em | 1.1 |
| Year (timeline) | clamp(2.5rem, 2rem + 2vw, 3.75rem) | 800 | 96 | -0.04em | 1.0 |
| Heading (journal h4) | 1.5rem | 700 | 48 | -0.02em | 1.15 |
| Wordmark | 1.25rem | 700 | 32 | -0.02em | 1.2 |
| Body | 1.0625rem (17px) | 400 | 14 | 0 | 1.55 |
| UI (buttons, links, filters) | 0.9375rem (15px) | 500 | 14 | 0 | 1.4 |
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
| radius-frame | 24px | the hero instrument frame |
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
2. One accent, spent on one thing at a time. Brass marks what is live and what
   is active. Ion marks only what is still in progress.
3. Both themes are finished. Light mode has its own ground, its own accent
   contrast, and its own elevation model.
4. The instrument, not the template. Round forms (rings, dials, pills), warm
   metal on night, and a display face with character are the identity. Grey
   hairlines, mono captions, and eyebrow labels are not.
5. Restraint in copy. Sentence case, plain verbs, and names that say what a thing
   does ("Play project", "Open project", "Back to top").

## The one memorable thing

Above the fold, the featured-project stage becomes the face of an orrery. Thin
brass orbit rings, drawn as inline SVG, ring the stage (or sweep out from its
lower-left corner) with fine engraved tick marks like the Antikythera calendar
ring. Each of the five projects sits on its own ring as a small brass body with
its title beside it; the active project's body glows and its ring brightens,
and the rings turn one notch when the carousel advances. The selector row below
the stage is the crank: choosing a project turns the mechanism to it. The stage
itself is masked by the large-radius frame like a porthole, which is the HUD
portfolio's own window over Earth.

In dark mode a sparse, static field of Starlight points sits behind the rings.
In light mode the rings render as fine ink lines on Daylight, like an engraving
plate. A single meteor streak, rare and CSS-only, may return from the old site
if a later piece finds it earns its place.

Everything in this piece serves that moment: Brass is the ring metal, Night is
the sky, the pill and frame radii are the ring geometry, and the display face is
the engraved label.

## What this piece implements

- Bricolage Grotesque self-hosted in `public/fonts/`, declared with
  `font-display: swap` and preloaded in `Layout.astro`.
- The token block in `src/styles/portfolio.css`: color (light and dark parity),
  type scale, radius scale, spacing scale, elevation.
- All label treatments replaced: no eyebrows, no "01 / PROJECT", no
  "PROJECT SPOTLIGHT", no middle-dot tagline, no number prefixes on carousel
  selectors, no monospace. Status is "Live" or "In progress" everywhere.
- Text glyph controls (arrows, pause bars) replaced with inline SVG icons.

## Left for later pieces

- The orrery hero identity moment described above.
- Motion choreography (page-load reveal, ring rotation on slide change).
- Any change to the hero, card grid, or timeline layout dimensions.
