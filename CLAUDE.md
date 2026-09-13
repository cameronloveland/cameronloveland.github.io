# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal project-showcase site for Cameron Loveland, hosted on GitHub Pages. It is
built with [Astro](https://astro.build) as a fully static site (`output: "static"`) -
no server, no client-side framework, no tracking. The small interactive parts (theme
toggle, featured-project reel, gallery/timeline switch, category filter) are vanilla
`<script>` blocks inside their components.

Design direction lives in `docs/superpowers/specs/2026-09-12-award-gauntlet-design-direction.md`
(palette, type, radius scale, principles, the "instrument" idea). Read it before changing
anything visual; it is the contract every visual change is judged against.

## Workflow

- **Preview:** `npm install`, then `npm run dev` (Astro's dev server) or `npm run build`
  followed by `npm run preview` to serve the built `dist/`.
- **Build:** `npm run build` runs `astro check` (type and content-schema validation) and
  `astro build`, producing static output in `dist/`.
- **Deploy:** push or merge to `main`. `.github/workflows/deploy.yml` (GitHub Actions)
  installs dependencies, builds the site, and deploys `dist/` via
  `actions/upload-pages-artifact` + `actions/deploy-pages`. One-time repo setting:
  Settings > Pages > Source = **GitHub Actions**.
- There is no test suite beyond Astro's content collection schema validation (see
  below) - a project with malformed frontmatter fails `npm run build`.

## Project data (`src/content/projects/`)

Each project is a markdown file with frontmatter validated against the schema in
`src/content/config.ts`: `title`, `description`, `section`
(`web` | `games` | `mobile-apps` | `experiments`), `startDate`, `updatedDate`
(optional), `links` (label/href/primary; the primary link's wording comes from the
section via `src/utils/linkLabel.ts`: Play now, Open website, Visit website, Open
project), `languages` (name/color, following GitHub's linguist colors), `stack`,
`commits` (optional), `image` (optional, WebP under `public/images/`), `stageImage`
(optional, a different picture for the wide hero stage), `imageFocus` (optional
object-position pair for the crop), `stageFit` (`cover` | `contain`), `video`
(optional, under `public/videos/`), `unpublished` (default `false`, shown as
"In progress").

To add a project, add a markdown file to `src/content/projects/` and a WebP image
(1600px wide is plenty; keep PNG sources out of `public/`). The homepage
(`src/pages/index.astro`) reads the collection with `getCollection('projects')` and
renders the gallery and the timeline from the same data; the hero reel shows the
projects with an image, in the order set at the top of `ProjectCarousel.astro`.

## Components (`src/components/`)

- `ProjectCarousel.astro` - the hero: a wide stage (image or video, caption, CTA) and
  the instrument under it: a brass arc carrying one body per featured project, with
  ticks, a sliding hand and a sweep that times the slideshow. Phones swap the arc for
  a scroll-snap strip of chips and put prev/next on the stage. Its script owns play,
  pause, hover hold, keyboard pause, swipe, the arrival animation and the
  `--reel-index` custom property that also turns the maker's mark in the header.
- `SkyField.astro` - the starfield and three meteors behind the fold (dark theme).
- `Card.astro` - a gallery card (kicker with category and status, title, description,
  facts plate, links).
- `ViewToggle.astro` - the Gallery/Timeline switch plus the category filter logic; view
  and filter changes run inside the View Transitions API where available.
- `Timeline.astro` - the chronological view: a month scale, one lane per project in
  start-date order, rods in category color, dashed to Now while in progress.
- `Closing.astro` - the "Now" section above the footer.
- `ThemeToggle.astro` - the dark/light toggle (crossfades via a view transition).
- `ExternalLinkIcon.astro` - the shared new-tab glyph.

`src/layouts/Layout.astro` holds the `<head>` (theme init, font preload, Open Graph
meta), the header band (maker's mark, wordmark, links, theme toggle), the fold, the
main slot, the closing section and the footer.

## Styling (`src/styles/portfolio.css`)

- One stylesheet. Tokens for both themes sit at the top: colors (`:root` is the light
  "Daylight" theme, `[data-theme="dark"]` is "Night"), the four category colors
  (`--cat-games`, `--cat-web`, `--cat-mobile`, `--cat-experiments`), type scale,
  weights, radius scale (24 / 16 / 12 / 6 / pill), spacing and motion tokens
  (`--dur-fast/base/slow`, `--ease-out`, `--ease-in-out`). Nothing outside the token
  blocks declares a color.
- The active theme is stored in `localStorage` under `theme` and applied to
  `document.documentElement` before first paint by the inline script in `Layout.astro`.
- One family, Schibsted Grotesk (variable, self-hosted in `public/fonts/`, OFL). No
  monospace anywhere.
- Reduced motion: the block at the end of the stylesheet stops every animation and
  transition; the scripts also skip view transitions and the arrival under it.
- Phone layout changes at 720px; the arc instrument needs 721px and up.

## Conventions

- Hand-written, dependency-free style: semantic HTML, BEM-ish class names, inline SVG
  icons, CSS-first animation. No new dependencies without asking.
- Sentence case everywhere. No all-caps eyebrows, no middle-dot meta strings, no
  numbering that is not a real sequence. No em dashes in code, comments or copy.
- Brass (`--accent`) marks only what is active or pressable; categories use their own
  colors; "in progress" is a state (hollow lamp, dashed rod), not a color.
- External links use `target="_blank" rel="noopener noreferrer"` and carry the
  external-link glyph.
- Planning and design docs live in `docs/superpowers/{plans,specs}/` with date-prefixed
  filenames; follow that naming when adding new ones.
