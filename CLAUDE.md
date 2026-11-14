# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal project-showcase site for Cameron Loveland, hosted on GitHub Pages. Astro
builds it as a fully static site (`output: "static"`), with no server and no tracking.

The homepage is one hand-written page, `public/index.html`. It is the billboard mockup,
approved by Cameron in November 2026 and shipped as is (spec
`docs/superpowers/specs/2026-11-13-mockup-to-site-design.md`). Its CSS and vanilla scripts are
inline, and its project data is the `P` list in its first script. The hero is a playlist:
a video plays to its end, then the next item plays; a still plays a 12 s zoom and pan;
after the last item it loops. The player row has play/pause, a scrub bar and a quality menu
that picks among each take's three encodes (`<name>-av1.mp4` 1280p, `<name>.mp4` 960p,
`<name>-phone.mp4` 640p). The Extras menu (intro, bust, screen wall) imports
`public/js/hero-extras.js`, which loads three.js from `/vendor/three/` and the bust from
`public/models/head.glb`. The page is dark only.

## Workflow

- **Preview:** `npm install`, then `npm run dev` (Astro's dev server) or `npm run build`
  followed by `npm run preview` to serve the built `dist/`.
- **Build:** `npm run build` runs `astro check` (type and content-schema validation) and
  `astro build`, producing static output in `dist/`.
- **Deploy:** push or merge to `main`. `.github/workflows/deploy.yml` (GitHub Actions)
  installs dependencies, builds the site, and deploys `dist/` via
  `actions/upload-pages-artifact` + `actions/deploy-pages`. One-time repo setting:
  Settings > Pages > Source = **GitHub Actions**.
- `predev` and `prebuild` run `scripts/vendor-three.mjs`, which copies the three.js files the
  Extras need from `node_modules` into `public/vendor/three/` (gitignored).
- There is no test suite beyond Astro's content collection schema validation (see
  below) - a project with malformed frontmatter fails `npm run build`.
- **Roadmap:** `docs/VISION.md` (consumed by `/next-goal`). Current goal: the cyborg head
  bust, spec `docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md`.
- **Gates:** `npm run build`; for `art/head/` items also `npm run head` (headless Blender
  build plus GLB budget check, created by the first roadmap item).
- **Run by hand:** `npm run build`, then serve `dist/` with range requests (videos need them)
  and check the homepage at 1440x900 and at a phone width; `npm run head` for the bust renders.

## Project data (`src/content/projects/`)

Each project is still a markdown file validated against `src/content/config.ts` (title,
description, section, dates, links, languages, stack, image, stageImage, video, videoAv1,
videoPhone, unpublished), so `npm run build` catches malformed data. The homepage does not
read the collection yet: adding or changing a project means editing the `P` list in
`public/index.html` (and the Showcase markup, if it is featured) as well as its markdown.
Images are WebP under `public/images/`, videos under `public/videos/`.

## Conventions

- Hand-written, dependency-free style: semantic HTML, BEM-ish class names, inline SVG
  icons, CSS-first animation. No new dependencies without asking.
- Sentence case everywhere. No all-caps eyebrows, no middle-dot meta strings, no
  numbering that is not a real sequence. No em dashes in code, comments or copy.
- Mint (`--mint`) marks what is active or pressable; categories use their own colors
  (`--cat-games`, `--cat-web`, `--cat-mobile`, `--cat-prototypes`). Item labels are icon
  ribbons; section titles are Plates.
- External links use `target="_blank" rel="noopener noreferrer"` and carry the
  external-link glyph.
- Planning and design docs live in `docs/superpowers/{plans,specs}/` with date-prefixed
  filenames; follow that naming when adding new ones.
