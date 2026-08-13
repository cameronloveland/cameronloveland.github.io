# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal project-showcase site for Cameron Loveland, hosted on GitHub Pages. It is a
single static page with **no build step, no dependencies, and no framework**. Everything
ships from three files at the repo root: `index.html`, `style.css`, and image assets in
`images/`.

## Workflow

- **Preview:** open `index.html` directly in a browser. There is no dev server or build.
- **Deploy:** push or merge to `main`. `.github/workflows/deploy.yml` (GitHub Actions)
  uploads the repo root as a Pages artifact and deploys it via `actions/deploy-pages` —
  no build step. One-time repo setting: Settings > Pages > Source = **GitHub Actions**.
  `.nojekyll` disables Jekyll processing.
- There are no tests, linters, or package manager. Do not add a `package.json` or build
  tooling unless explicitly asked — the no-build simplicity is intentional. If a build
  step is ever needed, add it between the checkout and `upload-pages-artifact` steps and
  point the artifact `path` at the build output.
- The workflow stages only the site files (`index.html`, `style.css`, `images/`, plus a
  `.nojekyll`) into a `_site/` dir and publishes that — `docs/`, `README.md`, `CLAUDE.md`,
  and `LICENSE` are intentionally not served. If you add a new top-level asset the site
  needs (e.g. a `favicon.ico` or another stylesheet), add it to the "Stage static site"
  step or it won't be published.

Note: the old `portfolio/` Next.js project that this workflow used to build has been
refactored out to a separate repo (`space-portfolio`); this repo is now static-only.

## Page structure (`index.html`)

The page is organized into `<section>`s — Web, Games, Mobile Apps, Experiments — each with
an `id` used for sidebar navigation. Inside each section, a `.grid` holds project `.card`
elements. The card is the core repeating unit; to add a project, copy an existing `.card`
and fill in:

- `.card-preview > img` — screenshot from `images/` (use `loading="lazy"`).
- `.card-body` — `<h3>` title, `<p>` description, and `.card-links` with one or more
  `.card-link` anchors (live site, github, devpost, etc.).
- `.card-meta` — optional footer with `.card-meta-languages` (colored `.card-meta-lang-dot`
  + name), `.card-meta-stack` (`.card-meta-tag` pills), and `.card-meta-stats` (commit
  count / dates). Language dot colors follow GitHub's linguist colors.

Variants: `.card--unpublished` dims a card for coming-soon items; `.card-preview--strength`
is a gradient placeholder used when there is no screenshot.

Three small inline scripts at the bottom of `index.html` (no external JS) handle:
1. Theme init (runs in `<head>` to avoid flash) + `toggleTheme()`.
2. Sidebar active-link highlighting via `IntersectionObserver` on sections.

## Styling (`style.css`)

- Theming is driven by CSS custom properties on `:root` (light) and `[data-theme="dark"]`.
  The active theme is stored in `localStorage` under key `theme` and applied to
  `document.documentElement`. Always use the `--bg`, `--surface`, `--border`, `--text`,
  `--text-secondary`, `--text-muted` variables rather than hardcoding colors so both themes
  stay consistent.
- The decorative `.sky-scene` (stars/meteors/clouds) is a fixed-position layer behind the
  content, animated purely in CSS; meteor animations are gated to dark mode.
- Mobile layout collapses at `max-width: 768px`.

## Conventions

- Match the existing hand-written, dependency-free style: semantic HTML, BEM-ish class
  names (`.card-meta-lang-dot`), inline SVG icons, and CSS-only animation.
- External links use `target="_blank" rel="noopener noreferrer"`.
- Planning and design docs live in `docs/superpowers/{plans,specs}/` with date-prefixed
  filenames; follow that naming when adding new ones.
