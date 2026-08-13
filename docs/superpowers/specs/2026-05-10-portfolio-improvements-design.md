# Portfolio Improvements Design

**Date:** 2026-05-10
**Status:** Approved

## Goal

Reposition the portfolio from a hobby project gallery to a professional engineer's curated project showcase, while keeping the clean dark aesthetic. Changes are scoped to `index.html` and `style.css` only.

## Decisions Made

### Header

- Rewrite subtitle: "Software engineer - hobby projects & experiments" -> "Software engineer building full-stack apps, mobile tools, and interactive web experiences."
- Add LinkedIn link to nav alongside existing GitHub link.
- Remove Email from nav.
- Keep the existing icon-based dark/light mode toggle unchanged.
- No intro paragraph block - keep it minimal.

### Layout

- Widen site container from 720px to 960px max-width.
- Add a left sidebar (160px wide, 32px right padding) alongside a content area that remains ~720px wide.
- Sidebar is sticky, positioned at top: 40px.
- On mobile (under 768px), sidebar collapses to a compact horizontal anchor row above the content.

### Sidebar navigation

- Scroll-linked anchor nav: sections stack vertically, sidebar highlights the active section as the user scrolls.
- Active state: full text color + left border highlight (2px, var(--text-muted)).
- Labels: Websites, Games, Apps, Experiments.
- Experiments shown at reduced opacity (placeholder for future content).
- Implementation: IntersectionObserver watches each section, updates active class on the corresponding nav item.

### Sections and project assignments

| Section | Projects |
|---|---|
| Websites | Futuristic HUD Portfolio |
| Games | Tavernborn, Cosmic Drift |
| Apps | Strength Path (coming soon) |
| Experiments | (empty - dashed placeholder) |

- Section label uses existing `.section-label` style (uppercase, muted, small).
- Each section has its own `<section id="...">` element as the scroll target.
- Experiments section shows a dashed-border placeholder box.

### Card descriptions (rewrites)

**Futuristic HUD Portfolio**
> Interactive Next.js portfolio prototype featuring layered parallax, particle effects, animated HUD panels, and responsive project presentation.

**Tavernborn**
> Daily text RPG prototype with persistent character progression, AI-assisted story generation, and a tavern-centered fantasy loop. Built during the Bolt.new hackathon.

**Cosmic Drift**
> Three.js/Vite space racing prototype focused on responsive controls, visual effects, and arcade-style progression.

**Strength Path**
> React Native strength training app focused on staged progression, workout tracking, plate-aware warmups, and long-term training consistency.

### Section label

- "PROJECTS" section label is removed; section identity is now handled by the sidebar nav and per-section labels.

## Out of Scope

- Intro paragraph block (kept intentionally minimal per user preference).
- Resume link (not added to nav).
- Stack visualization / graphical tech representation (planned as a future separate project).
- Any changes to card meta (languages, stack tags, history stats).
- Any changes to the footer.
- Changes to any file other than `index.html` and `style.css`.

## Open Items

- LinkedIn URL: needs to be supplied before implementation. Placeholder `href` will be used in the meantime.

## Files Changed

- `index.html` - header copy, nav links, layout structure, section grouping, card descriptions
- `style.css` - wider container, sidebar styles, scroll-linked nav active state, mobile collapse styles
