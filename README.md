# cameronloveland.github.io

Personal project showcase, some finished, most in progress. An Astro static site hosted
on GitHub Pages, with no client framework and no tracking.

## Local preview

```sh
npm install
npm run dev        # dev server with live reload
npm run build      # astro check + astro build -> dist/
npm run preview    # serve the built dist/
```

## Adding a project

Add a markdown file to `src/content/projects/` (copy an existing one) and a WebP
image to `public/images/`. The frontmatter is validated by the schema in
`src/content/config.ts`; a bad file fails the build. The homepage renders the hero
reel, the gallery and the timeline from that one collection.

## Deploy

Push or merge to `main`. `.github/workflows/deploy.yml` builds the site with GitHub
Actions and publishes `dist/` to GitHub Pages.

One-time setup: Repo Settings > Pages > Source = **GitHub Actions**.

## Design

The visual direction (palette, type, the "instrument" hero) is written up in
`docs/superpowers/specs/2026-09-12-award-gauntlet-design-direction.md`. Set in
Schibsted Grotesk (OFL, self-hosted).
