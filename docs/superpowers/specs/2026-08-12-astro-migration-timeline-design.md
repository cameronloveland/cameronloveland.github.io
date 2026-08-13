# Astro migration + dev timeline — design

## Context

This site is currently hand-written static HTML/CSS with no build step
(`index.html`, `style.css`, `images/`), deployed to GitHub Pages via a
GitHub Actions workflow that stages and uploads those files as-is.

Two goals for this change:

1. Convert the site to [Astro](https://astro.build) so project cards are
   rendered from structured data instead of hand-copied HTML blocks.
2. Add a toggleable dev timeline: a chronological view of when each
   project was started/updated, as an alternative to the current
   grouped-by-category grid.

Astro is a good fit for GitHub Pages: its default `output: "static"`
mode produces pre-rendered HTML/CSS/JS with no server required, which is
all GitHub Pages can serve anyway. Because this repo is the special
`<username>.github.io` "user site" repo, the site deploys at the domain
root — no `base` path config needed, same URL structure as today.

Astro does **not** meaningfully change the site's styling capability —
the point of migrating is componentization and structured content, not
CSS. `style.css` ports over close to unchanged.

## Architecture

Three pieces, built in order:

1. **Astro migration** — scaffold Astro, port `index.html`/`style.css`
   into components + a base layout, model each project as a content
   collection entry, update the deploy workflow to build before
   publishing.
2. **Grouping toggle** — a Grid/Timeline pill switches `<main>` between
   the existing section-grouped grid and a chronological view of the
   same project data.
3. **Timeline** — a vertical, changelog-style scrolling list of
   projects sorted by start date.

No UI framework (React/Vue/etc.) is added. All interactivity (theme
toggle, sidebar active-link highlighting, the view toggle, and the
timeline itself) stays vanilla JS via plain `<script>` tags / Astro
client-side script blocks, matching the site's existing zero-framework
approach and keeping shipped JS minimal.

## File layout

```
astro.config.mjs
package.json
public/
  images/                   # project screenshots, moved from images/
src/
  content/
    config.ts               # Zod schema for the "projects" collection
    projects/
      hud-portfolio.md
      cosmic-drift.md
      tavernborn.md
      strength-path.md
  components/
    Card.astro
    CardMeta.astro
    Sidebar.astro
    ThemeToggle.astro
    SkyScene.astro
    ViewToggle.astro        # Grid | Timeline pill
    Timeline.astro
  layouts/
    Layout.astro             # <head> theme-init script, header, sky-scene, footer
  pages/
    index.astro
  styles/
    global.css                # ported style.css, custom properties unchanged
```

Screenshots move from `images/` to `public/images/` and are referenced
as plain `<img>` tags (no Astro image optimization for now — keeps
behavior identical to today; can be revisited later).

## Data model

`src/content/config.ts` defines a `projects` collection with this
schema:

- `title: string`
- `description: string`
- `section: enum("web" | "games" | "mobile-apps" | "experiments")`
- `startDate: date` (required — every project has one, including
  unpublished/in-progress ones)
- `updatedDate: date` (optional)
- `links: { label: string, href: string, primary?: boolean }[]`
- `languages: { name: string, color: string }[]`
- `stack: string[]`
- `commits: number` (optional)
- `image: string` (optional — path under `public/images/`)
- `unpublished: boolean` (default `false`)

Astro validates every entry against this schema at build time
(`astro build` / `astro check`), so a malformed project fails the build
loudly instead of silently rendering wrong. This is the project's
equivalent of a test gate — there's no runtime logic to unit test, but
bad content data can't ship.

`index.astro` reads the collection once and both the grid and timeline
render from the same in-memory list — no duplicate data source.

## Grouping toggle

`ViewToggle.astro` renders a "Grid / Timeline" pill pair near the
sidebar, styled like the existing pill badges. Behavior:

- Default view on page load is Grid. No persistence (e.g. no
  `localStorage`) for now — simplest option; can be added later if
  people flip it often.
- Switching to Timeline hides the section sidebar (its anchor-link
  highlighting doesn't apply to a chronological view) and swaps
  `<main>`'s visible content to the timeline.
- Switching back restores the grid and sidebar.
- Implemented as a small vanilla JS toggle (class/`hidden` attribute
  swap), no framework.

## Timeline

A single vertical line down the page, entries sorted by `startDate`
ascending. Each entry shows:

- Date
- Project title
- Section badge
- Description (same copy as the card)
- The same `card-links` pill row as the grid card

If `updatedDate` differs from `startDate`, a small "updated {date}"
sub-line appears under the date. Unpublished projects render with the
existing `card--unpublished` dimming treatment and no live-site link,
per the "include unpublished projects" decision below — they still get
a `startDate` and appear in their chronological position.

Granularity is one entry per project (not per-milestone) — this reuses
the same `startDate`/`updatedDate` fields the cards already need, with
no extra authoring burden.

## Deploy pipeline changes

`.github/workflows/deploy.yml` gains a build step before staging:

```yaml
- name: Install dependencies
  run: npm ci
- name: Build
  run: npm run build
```

...and uploads `dist/` (Astro's build output) instead of copying
`index.html`/`style.css`/`images/` directly. This is the only pipeline
change; `actions/upload-pages-artifact` and `actions/deploy-pages`
stay as-is.

This intentionally reverses the "no build step" simplicity documented
in `CLAUDE.md` — that file will need a matching update once this ships
(workflow section, page-structure section, and the "no build tooling"
note all currently describe the pre-Astro setup).

## Decisions made during design

- Project data becomes a structured content collection now, not a
  later cleanup — this is what removes the copy-paste-per-card pain
  and gives the timeline a ready-made data source.
- No UI framework — vanilla JS only, consistent with the site's
  current near-zero-JS footprint.
- The toggle switches between two render modes of the same project
  data (grouped-by-category vs chronological), not a separate page.
- Timeline is vertical/changelog-style, scrolling with the page (not a
  horizontal scroll-axis widget).
- One timeline entry per project (start + optional updated date), not
  multiple milestones per project.
- Unpublished/coming-soon projects are included in the timeline.

## Out of scope

- Astro image optimization (`<Image />` component) — plain `<img>` for
  now.
- Timeline entry persistence of the toggle state across page loads.
- Per-project multiple milestones/events.
- Reconciling this repo's diverged `origin/main` history and flipping
  the GitHub Pages source setting to "GitHub Actions" — tracked
  separately as the publish-fix work already in progress on the
  `static-site-publish-fix` branch. This migration should land on its
  own branch and merge after (or be rebased onto) that fix.
