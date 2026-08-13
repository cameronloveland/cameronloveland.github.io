# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal project-showcase site for Cameron Loveland, hosted on GitHub Pages. It is
built with [Astro](https://astro.build) as a fully static site (`output: "static"`) -
no server, no client-side framework beyond vanilla JS for small interactive bits
(theme toggle, sidebar highlighting, grid/timeline view switch).

## Workflow

- **Preview:** `npm install`, then `npm run dev` (starts Astro's dev server).
- **Build:** `npm run build` runs `astro check` (type/content-schema validation) and
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
(optional), `links` (label/href/primary), `languages` (name/color, following GitHub's
linguist colors), `stack`, `commits` (optional), `image` (optional, path under
`public/images/`), `unpublished` (default `false`).

To add a project, add a new markdown file to `src/content/projects/`. The homepage
(`src/pages/index.astro`) reads the collection with `getCollection('projects')` and
renders both the grouped grid and the chronological timeline from the same data - no
per-page edits needed beyond adding the file.

## Components (`src/components/`)

- `Card.astro` / `CardMeta.astro` - the project card and its languages/stack/history
  footer, rendered in the grid view. `CardMeta` is only rendered for published
  projects.
- `Sidebar.astro` - section navigation with `IntersectionObserver`-driven active-link
  highlighting.
- `ThemeToggle.astro` - the dark/light toggle button and its script.
- `ViewToggle.astro` - the Grid/Timeline switch; hides the sidebar while the timeline
  is showing, since section anchors don't apply to a chronological view.
- `Timeline.astro` - chronological view, one entry per project sorted by `startDate`.
- `SkyScene.astro` - the decorative stars/meteors/clouds background layer.

`src/layouts/Layout.astro` holds the `<head>` theme-init script, header, footer, and
sky-scene, with named slots for `view-toggle`, `sidebar`, and the default (main
content) slot.

## Styling (`src/styles/global.css`)

- Theming is driven by CSS custom properties on `:root` (light) and
  `[data-theme="dark"]`. The active theme is stored in `localStorage` under key
  `theme` and applied to `document.documentElement`. Always use the `--bg`,
  `--surface`, `--border`, `--text`, `--text-secondary`, `--text-muted` variables
  rather than hardcoding colors so both themes stay consistent.
- Meteor animations are gated to dark mode.
- Mobile layout collapses at `max-width: 768px`.

## Conventions

- Match the existing hand-written, dependency-free style within components: semantic
  HTML, BEM-ish class names (`.card-meta-lang-dot`), inline SVG icons, CSS-only
  animation.
- Small interactive scripts (theme toggle, sidebar highlighting, view toggle) use
  Astro's `<script is:inline>` directive so they run synchronously in place, matching
  the site's original plain-`<script>` behavior (this matters for the theme-init
  script in particular, to avoid a flash of the wrong theme).
- External links use `target="_blank" rel="noopener noreferrer"`.
- Planning and design docs live in `docs/superpowers/{plans,specs}/` with date-prefixed
  filenames; follow that naming when adding new ones.
