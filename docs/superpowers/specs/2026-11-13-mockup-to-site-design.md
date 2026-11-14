# Mockup to site - design

Status: decided by Cameron, 2026-11-13. Built on the `billboard-site` branch.

## Intent

The mockup page that Cameron reviewed through November (served locally from
`.superpowers/brainstorm/.../hero-layouts.html`) becomes the real homepage. Everything he
approved there ships; nothing he did not see is added. The mockup is the spec: where this
document and the mockup disagree, the mockup wins unless this document says it changes.

## Goals

- The homepage looks and behaves like the mockup with its pickers removed:
  - header band: maker initials, Gallery and Timeline tabs, GitHub and LinkedIn;
  - hero: full-bleed stage with the playlist panel ("Featured projects", 7 items) on the
    right and the caption, links and "Browse all projects" on the left;
  - player row: play/pause, thick scrub bar with hover time, duration, quality menu
    (Auto, 1280p AV1, 960p H.264, 640p data saver), "Extras";
  - playlist model: a video plays to its end, then the next item plays; a still plays a
    12 s zoom-and-pan clip with the same player; after the last item it loops to the first;
  - Showcase bento and the Project gallery with the Timeline view;
  - labels: icon ribbon (line icon in a dark square, category-colour ribbon, the square
    grows on hover); section titles: Plate;
  - Strength Path slide: the Noir squat background with the phone framed over it;
  - Extras menu: Watch intro, Show the bust, Screen wall (the wall turns the bust on).
- Project data still comes from the content collection, so adding a project stays "add
  a markdown file and an image".
- `npm run build` passes; the page stays static on GitHub Pages.

## Non-goals

- New features or restyling beyond the mockup.
- The Strength Path app screen recording (a later item).
- Changes to the bust model itself.

## Anti-goals

- A first visit that loads 3D, plays the intro or downloads more than the first video
  before it is asked for.
- Pickers, test switches or mockup notes in the shipped page.

## Approaches

- A, components from the collection (recommended): rebuild the mockup as Astro
  components (`Nav`, `Hero` with the player, `Showcase`, `Gallery`, `Timeline`,
  `Extras`) fed by `getCollection('projects')`; mockup CSS moves into
  `portfolio.css` as tokens and rules; mockup scripts become the components' scripts.
  Keeps the content collection and the repo's conventions. About a session of work.
- B, paste the mockup in: the mockup HTML becomes `index.astro` almost as is, with its
  hard-coded project list. Fastest, but every project lives twice (markdown and the page),
  and it leaves two styling systems.
- C, hybrid: paste the mockup's CSS and scripts, generate only the project markup from
  the collection. Quicker than A, but leaves a 2,000-line page that nobody can maintain.

## Decided

- Approach B. Cameron: "whatever just merge this into main". The mockup page ships as
  `public/index.html` with its picks locked in and the pickers removed; its `/files/`
  paths point at `public/images`, `public/videos`, `public/models` and `public/js`. The
  old Astro components, layout, stylesheet and utils are deleted. The content collection
  stays for its schema check. Moving the page onto the collection (approach A) is a later
  item.
- three.js is an npm dependency (0.160.0, exact), copied into `public/vendor/three/` before
  dev and build, and served by the site (Cameron's pick over the CDN).
- Dark only; the light theme and its toggle go (Cameron's pick).
- Slide order: Cosmic Drift, Futuristic HUD Portfolio, 2100, Gnome Glider, Knight Life,
  Antikythera Mechanism, Strength Path.
- The 2100 and Knight Life cards use the frames from their new videos, as the playlist
  thumbnails do (Cameron). The hero label sits under the title (Cameron).
- The four open PRs (#103 to #106) are merged into `billboard-site`; one PR replaces them.
- The page still loads its fonts from Google Fonts, as the mockup did. Self-hosting them
  is a later item.

## Left to the builder

- Component boundaries and file names within approach A.
- Storage keys (the mockup's quality, bust and wall keys carry over; picker keys go).
- The phone layout follows the mockup's 720px rules; anything the mockup never showed on
  a phone is fitted to the same look and flagged in the PR for Cameron.

## Done when

- Side by side at 1440x900 and at a phone width, the local site matches the mockup.
- The playlist advances on video end and on the still clip's end, and loops.
- Scrub, play/pause and quality work; the Extras items work and load 3D only on demand.
- `npm run build` passes, the review is clean, and Cameron says it is good to merge.
