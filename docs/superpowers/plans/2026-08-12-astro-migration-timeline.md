# Astro Migration + Dev Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the hand-written static site to Astro with project data as a content collection, then add a toggleable chronological "dev timeline" view alongside the existing grouped grid.

**Architecture:** Astro static output (`output: "static"`), zero UI framework - all interactivity (theme toggle, sidebar highlighting, grid/timeline switch) stays vanilla JS via Astro's `is:inline` script directive. Each project is a markdown file with schema-validated frontmatter in `src/content/projects/`; `index.astro` reads that collection once and renders both the grid and the timeline from the same data.

**Tech Stack:** Astro 5 (static output), TypeScript (content schema only), vanilla JS, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-12-astro-migration-timeline-design.md`

## Global Constraints

- No UI framework - vanilla JS only, via Astro's `<script is:inline>` directive for anything that must run synchronously/unbundled (critical for the theme-init script, to avoid a flash of the wrong theme).
- Astro `output: "static"`, no `base` path - this repo is the `<username>.github.io` user-site repo and deploys at the domain root.
- Content collection schema validation (`astro check` / `astro build`) is this project's test gate - there is no other test framework, matching the "no build tooling unless needed" spirit of the original site, just enforced differently now.
- Every project entry requires a `startDate`, including unpublished/in-progress projects - the timeline needs it.
- `CardMeta` (languages/stack/commits/history) renders only for published projects; unpublished projects still carry a `startDate` for the timeline but show no meta footer on their card, matching today's Strength Path card.
- Default view on page load is Grid. No persistence of the Grid/Timeline choice across loads.
- External links use `target="_blank" rel="noopener noreferrer"` (existing site convention, carries over unchanged).
- Node 20 in CI.

---

### Task 1: Scaffold Astro project and relocate legacy static assets

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Modify: `.gitignore`
- Create: `src/pages/index.astro` (temporary placeholder, replaced in Task 5)
- Move: `images/*.png` → `public/images/*.png`
- Move: `style.css` → `src/styles/global.css`
- Delete: `index.html` (hand-written homepage, fully superseded by Astro pages)

**Interfaces:**
- Produces: `npm run build` command that later tasks rely on as their verification step. `public/images/{space-portfolio,cosmic-drift,tavernborn}.png` at URL paths `/images/*.png`. `src/styles/global.css` (unmodified CSS, same custom properties/selectors as before).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "cameronloveland-github-io",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cameronloveland.github.io',
  output: 'static',
});
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Update `.gitignore`**

Write the full file:

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

.DS_Store
*.pem

# Claude Code and brainstorming artifacts
.claude/
.superpowers/

# Env files
.env*

# Astro build output and caches
node_modules/
dist/
.astro/
```

- [ ] **Step 5: Relocate legacy static assets**

```bash
mkdir -p public/images src/styles
git mv images/space-portfolio.png public/images/space-portfolio.png
git mv images/cosmic-drift.png public/images/cosmic-drift.png
git mv images/tavernborn.png public/images/tavernborn.png
git mv style.css src/styles/global.css
git rm index.html
rmdir images 2>/dev/null || true
```

- [ ] **Step 6: Write a temporary placeholder `src/pages/index.astro`**

This gets fully replaced in Task 5 once the content collection and Card component exist - it only exists now to prove the Astro toolchain builds.

```astro
---
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cameron Loveland</title>
  </head>
  <body>
    <h1>Scaffold OK</h1>
  </body>
</html>
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: completes with a `package-lock.json` created and no errors.

- [ ] **Step 8: Verify the build**

Run: `npm run build`
Expected: succeeds; `dist/index.html` exists and contains the text `Scaffold OK`.

```bash
grep -q "Scaffold OK" dist/index.html && echo "BUILD OK"
```

Expected output: `BUILD OK`

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/pages/index.astro src/styles/global.css public/images
git add -u
git commit -m "chore: scaffold Astro project, relocate legacy static assets"
```

---

### Task 2: Define the projects content collection and author all project entries

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/projects/hud-portfolio.md`
- Create: `src/content/projects/cosmic-drift.md`
- Create: `src/content/projects/tavernborn.md`
- Create: `src/content/projects/strength-path.md`

**Interfaces:**
- Consumes: nothing from Task 1 directly (build tooling only).
- Produces: `projects` content collection, readable via `getCollection('projects')` (from `astro:content`), each entry typed `CollectionEntry<'projects'>` with `.data: { title, description, section, startDate, updatedDate?, links, languages, stack, commits?, image?, unpublished }`. Later tasks (3, 5, 6) depend on this exact shape.

- [ ] **Step 1: Write the schema**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['web', 'games', 'mobile-apps', 'experiments']),
    startDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string().url(),
          primary: z.boolean().optional(),
        })
      )
      .default([]),
    languages: z
      .array(
        z.object({
          name: z.string(),
          color: z.string(),
        })
      )
      .default([]),
    stack: z.array(z.string()).default([]),
    commits: z.number().optional(),
    image: z.string().optional(),
    unpublished: z.boolean().default(false),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Write one deliberately-invalid entry to prove schema validation works**

```markdown
<!-- src/content/projects/hud-portfolio.md -->
---
title: "Futuristic HUD Portfolio"
description: "Interactive Next.js portfolio prototype featuring layered parallax, particle effects, animated HUD panels, and responsive project presentation."
section: "webz"
startDate: 2025-06-01
updatedDate: 2025-09-01
links:
  - label: "live site"
    href: "https://cameronloveland.github.io/space-portfolio/"
    primary: true
  - label: "github"
    href: "https://github.com/cameronloveland/space-portfolio"
languages:
  - name: "TypeScript"
    color: "#3178c6"
  - name: "CSS"
    color: "#563d7c"
stack: ["Next.js", "Three.js", "Tailwind", "Framer Motion"]
commits: 329
image: "/images/space-portfolio.png"
---
```

Note `section: "webz"` - not a valid enum value.

- [ ] **Step 3: Run the build and confirm it fails on the invalid entry**

Run: `npm run build`
Expected: FAIL. Output includes a Zod validation error referencing `section` (e.g. "Invalid enum value" / "webz").

- [ ] **Step 4: Fix the invalid entry and add the remaining three project files**

Fix `hud-portfolio.md`'s `section` to `"web"`:

```markdown
<!-- src/content/projects/hud-portfolio.md -->
---
title: "Futuristic HUD Portfolio"
description: "Interactive Next.js portfolio prototype featuring layered parallax, particle effects, animated HUD panels, and responsive project presentation."
section: "web"
startDate: 2025-06-01
updatedDate: 2025-09-01
links:
  - label: "live site"
    href: "https://cameronloveland.github.io/space-portfolio/"
    primary: true
  - label: "github"
    href: "https://github.com/cameronloveland/space-portfolio"
languages:
  - name: "TypeScript"
    color: "#3178c6"
  - name: "CSS"
    color: "#563d7c"
stack: ["Next.js", "Three.js", "Tailwind", "Framer Motion"]
commits: 329
image: "/images/space-portfolio.png"
---
```

```markdown
<!-- src/content/projects/cosmic-drift.md -->
---
title: "Cosmic Drift"
description: "Three.js/Vite space racing prototype focused on responsive controls, visual effects, and arcade-style progression."
section: "games"
startDate: 2025-10-01
updatedDate: 2026-05-01
links:
  - label: "live site"
    href: "https://cosmicdrift.clovola.workers.dev/"
    primary: true
languages:
  - name: "TypeScript"
    color: "#3178c6"
  - name: "HTML"
    color: "#e34c26"
stack: ["Three.js", "Vite"]
commits: 94
image: "/images/cosmic-drift.png"
---
```

```markdown
<!-- src/content/projects/tavernborn.md -->
---
title: "Tavernborn"
description: "Daily text RPG prototype with persistent character progression, AI-assisted story generation, and a tavern-centered fantasy loop. Built during the Bolt.new hackathon."
section: "games"
startDate: 2025-06-01
updatedDate: 2025-11-01
links:
  - label: "live site"
    href: "https://tavernborn.com"
    primary: true
  - label: "devpost"
    href: "https://devpost.com/software/tavernborn"
languages:
  - name: "TypeScript"
    color: "#3178c6"
  - name: "CSS"
    color: "#563d7c"
stack: ["React", "Three.js", "Vite", "Supabase", "Tailwind"]
commits: 434
image: "/images/tavernborn.png"
---
```

```markdown
<!-- src/content/projects/strength-path.md -->
---
title: "Strength Path"
description: "React Native strength training app focused on staged progression, workout tracking, plate-aware warmups, and long-term training consistency."
section: "mobile-apps"
startDate: 2026-02-01
unpublished: true
links:
  - label: "preview"
    href: "https://strengthpath.app/"
    primary: true
---
```

- [ ] **Step 5: Run the build and confirm it passes**

Run: `npm run build`
Expected: PASS (no Zod errors). `dist/index.html` still contains `Scaffold OK` (index.astro is untouched until Task 5).

- [ ] **Step 6: Commit**

```bash
git add src/content
git commit -m "feat: add projects content collection with schema validation"
```

---

### Task 3: Base layout - header, theme toggle, sky scene, footer

**Files:**
- Create: `src/components/SkyScene.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` (Task 1).
- Produces: `Layout.astro` with `Props: { title: string; description: string }`, named slot `sidebar` and a default slot for main content. `ThemeToggle.astro` (no props, self-contained button + `toggleTheme()` script). `SkyScene.astro` (no props). Tasks 4 and 6 add more named slots to this same `Layout.astro`.

- [ ] **Step 1: Write `SkyScene.astro`**

```astro
---
---
<div class="sky-scene" aria-hidden="true">
  <div class="sky-star s1"></div>
  <div class="sky-star s2"></div>
  <div class="sky-star s3"></div>
  <div class="sky-star s4"></div>
  <div class="sky-star s5"></div>
  <div class="sky-star s6"></div>
  <div class="sky-star s7"></div>
  <div class="sky-star s8"></div>
  <div class="sky-star s9"></div>
  <div class="sky-star s10"></div>
  <div class="sky-meteor m1"></div>
  <div class="sky-meteor m2"></div>
  <div class="sky-cloud c1"></div>
  <div class="sky-cloud c2"></div>
  <div class="sky-cloud c3"></div>
</div>
```

- [ ] **Step 2: Write `ThemeToggle.astro`**

```astro
---
---
<button class="theme-toggle" aria-label="Toggle dark mode" onclick="toggleTheme()">
  <svg class="icon-sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
  <svg class="icon-moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>
<script is:inline>
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
</script>
```

- [ ] **Step 3: Write `Layout.astro`**

```astro
---
import '../styles/global.css';
import SkyScene from '../components/SkyScene.astro';
import ThemeToggle from '../components/ThemeToggle.astro';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  <script is:inline>
    (function () {
      var saved = localStorage.getItem('theme');
      var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', saved || preferred);
    }());
  </script>
</head>
<body>
<div class="site">

  <header>
    <div class="header-left">
      <h1>Cameron Loveland</h1>
      <p class="lede">Software engineer who enjoys building things: games, apps, and interactive experiences.</p>
      <p class="focus-areas">Full-stack · Games · Mobile · Interactive web</p>
    </div>
    <nav class="header-links" aria-label="Site links">
      <a href="https://github.com/cameronloveland" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://www.linkedin.com/in/cameron-loveland/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <ThemeToggle />
    </nav>
  </header>

  <div class="body-layout">
    <slot name="sidebar" />
    <main class="content">
      <slot />
    </main>
  </div>

  <footer>
    <span>&copy; 2026 Cameron Loveland</span>
  </footer>

</div>

<SkyScene />
</body>
</html>
```

- [ ] **Step 4: Update `src/pages/index.astro` to use the new layout**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout
  title="Cameron Loveland"
  description="Cameron Loveland - software engineer building full-stack apps, mobile tools, and interactive web experiences."
>
  <p>Content grid coming soon.</p>
</Layout>
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`

```bash
grep -q "Cameron Loveland" dist/index.html \
  && grep -q 'aria-label="Toggle dark mode"' dist/index.html \
  && grep -q "sky-scene" dist/index.html \
  && grep -q "Content grid coming soon" dist/index.html \
  && echo "BUILD OK"
```

Expected output: `BUILD OK`

- [ ] **Step 6: Commit**

```bash
git add src/components/SkyScene.astro src/components/ThemeToggle.astro src/layouts/Layout.astro src/pages/index.astro
git commit -m "feat: add base layout with header, theme toggle, sky scene"
```

---

### Task 4: Sidebar navigation and active-link highlighting

**Files:**
- Create: `src/components/Sidebar.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Layout.astro`'s `sidebar` named slot (Task 3).
- Produces: `Sidebar.astro` (no props, self-contained nav + `IntersectionObserver` script). Section shells with `id="web"`, `id="games"`, `id="mobile-apps"`, `id="experiments"` for the observer and sidebar anchors to target - later tasks (5) fill these with real content but must keep these exact ids.

- [ ] **Step 1: Write `Sidebar.astro`**

```astro
---
---
<aside class="sidebar">
  <div class="sidebar-label">Sections</div>
  <nav aria-label="Page sections">
    <a class="sidebar-link active" href="#web">Web</a>
    <a class="sidebar-link" href="#games">Games</a>
    <a class="sidebar-link" href="#mobile-apps">Mobile Apps</a>
    <a class="sidebar-link sidebar-link--empty" href="#experiments">Experiments</a>
  </nav>
</aside>
<script is:inline>
  (function () {
    var links = document.querySelectorAll('.sidebar-link');
    var sections = document.querySelectorAll('.section[id]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) { link.classList.remove('active'); });
          var active = document.querySelector('.sidebar-link[href="#' + entry.target.id + '"]');
          if (active) { active.classList.add('active'); }
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }());
</script>
```

- [ ] **Step 2: Update `src/pages/index.astro` with section shells and the sidebar**

```astro
---
import Layout from '../layouts/Layout.astro';
import Sidebar from '../components/Sidebar.astro';
---
<Layout
  title="Cameron Loveland"
  description="Cameron Loveland - software engineer building full-stack apps, mobile tools, and interactive web experiences."
>
  <Sidebar slot="sidebar" />

  <section class="section" id="web">
    <h2 class="section-label">Web</h2>
    <div class="section-empty">Coming soon</div>
  </section>

  <section class="section" id="games">
    <h2 class="section-label">Games</h2>
    <div class="section-empty">Coming soon</div>
  </section>

  <section class="section" id="mobile-apps">
    <h2 class="section-label">Mobile Apps</h2>
    <div class="section-empty">Coming soon</div>
  </section>

  <section class="section" id="experiments">
    <h2 class="section-label">Experiments</h2>
    <div class="section-empty">Coming soon</div>
  </section>
</Layout>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`

```bash
grep -q 'class="sidebar-link active" href="#web"' dist/index.html \
  && grep -q 'id="web"' dist/index.html \
  && grep -q 'id="games"' dist/index.html \
  && grep -q 'id="mobile-apps"' dist/index.html \
  && grep -q 'id="experiments"' dist/index.html \
  && grep -q "rootMargin" dist/index.html \
  && echo "BUILD OK"
```

Expected output: `BUILD OK`

- [ ] **Step 4: Commit**

```bash
git add src/components/Sidebar.astro src/pages/index.astro
git commit -m "feat: add sidebar navigation with active-link highlighting"
```

---

### Task 5: Card, CardMeta, and the full project grid

**Files:**
- Create: `src/utils/formatDate.ts`
- Create: `src/components/Card.astro`
- Create: `src/components/CardMeta.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `projects` collection (Task 2), `Sidebar`/section shells (Task 4).
- Produces: `formatMonthYear(date: Date): string` - used again in Task 6's `Timeline.astro`. `Card.astro` with `Props: { project: CollectionEntry<'projects'> }`. `CardMeta.astro` with `Props: { project: CollectionEntry<'projects'> }`, rendered only for published projects.

- [ ] **Step 1: Write `src/utils/formatDate.ts`**

```typescript
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
```

- [ ] **Step 2: Write `CardMeta.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatMonthYear } from '../utils/formatDate';

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
const { languages, stack, commits, startDate, updatedDate } = project.data;

const historyParts: string[] = [];
if (commits) historyParts.push(`${commits} commits`);
historyParts.push(`started ${formatMonthYear(startDate)}`);
if (updatedDate) historyParts.push(`updated ${formatMonthYear(updatedDate)}`);
const historyText = historyParts.join(' · ');
---
<div class="card-meta">
  {languages.length > 0 && (
    <div class="card-meta-languages">
      <span class="card-meta-label">Languages</span>
      {languages.map((lang) => (
        <span class="card-meta-lang">
          <span class="card-meta-lang-dot" style={`background:${lang.color}`}></span>{lang.name}
        </span>
      ))}
    </div>
  )}
  {stack.length > 0 && (
    <div class="card-meta-stack">
      <span class="card-meta-label">Stack</span>
      {stack.map((tag) => <span class="card-meta-tag">{tag}</span>)}
    </div>
  )}
  <div class="card-meta-stats"><span class="card-meta-label">History</span>{historyText}</div>
</div>
```

- [ ] **Step 3: Write `Card.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import CardMeta from './CardMeta.astro';

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
const { title, description, links, image, unpublished } = project.data;
---
<div class:list={['card', { 'card--unpublished': unpublished }]}>
  <div class:list={['card-preview', { 'card-preview--strength': unpublished && !image }]}>
    {image && <img src={image} alt={`${title} preview`} loading="lazy" />}
  </div>
  <div class="card-body">
    <h3>{title}</h3>
    <p>{description}</p>
    <div class="card-links">
      {links.length > 0 ? (
        links.map((link) => (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class:list={['card-link', { 'card-link--primary': link.primary }]}
          >
            ↗ {link.label}
          </a>
        ))
      ) : (
        <span class="card-link card-link--soon">coming soon</span>
      )}
    </div>
  </div>
  {!unpublished && <CardMeta project={project} />}
</div>
```

- [ ] **Step 4: Update `src/pages/index.astro` to render the full grid from the collection**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';
import Sidebar from '../components/Sidebar.astro';
import Card from '../components/Card.astro';

const projects = await getCollection('projects');

const sections = [
  { id: 'web', label: 'Web' },
  { id: 'games', label: 'Games' },
  { id: 'mobile-apps', label: 'Mobile Apps' },
  { id: 'experiments', label: 'Experiments' },
];

const bySection = Object.fromEntries(
  sections.map(({ id }) => [id, projects.filter((p) => p.data.section === id)])
);
---
<Layout
  title="Cameron Loveland"
  description="Cameron Loveland - software engineer building full-stack apps, mobile tools, and interactive web experiences."
>
  <Sidebar slot="sidebar" />

  {sections.map(({ id, label }) => (
    <section class="section" id={id}>
      <h2 class="section-label">{label}</h2>
      {bySection[id].length > 0 ? (
        <div class="grid">
          {bySection[id].map((project) => <Card project={project} />)}
        </div>
      ) : (
        <div class="section-empty">Coming soon</div>
      )}
    </section>
  ))}
</Layout>
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`

```bash
grep -q "Futuristic HUD Portfolio" dist/index.html \
  && grep -q "Cosmic Drift" dist/index.html \
  && grep -q "Tavernborn" dist/index.html \
  && grep -q "Strength Path" dist/index.html \
  && grep -q "card-preview--strength" dist/index.html \
  && grep -q 'href="https://strengthpath.app/"' dist/index.html \
  && grep -q "card-meta-stats" dist/index.html \
  && echo "BUILD OK"
```

Expected output: `BUILD OK`

- [ ] **Step 6: Commit**

```bash
git add src/utils/formatDate.ts src/components/Card.astro src/components/CardMeta.astro src/pages/index.astro
git commit -m "feat: render project grid from content collection"
```

---

### Task 6: Grid/Timeline view toggle

**Files:**
- Create: `src/components/ViewToggle.astro`
- Create: `src/components/Timeline.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `projects` collection (Task 2), `formatMonthYear` (Task 5), `Layout.astro` (Task 3, gains a new `view-toggle` named slot here).
- Produces: `ViewToggle.astro` (no props). `Timeline.astro` with `Props: { projects: CollectionEntry<'projects'>[] }`.

- [ ] **Step 1: Add a `view-toggle` slot to `Layout.astro`**

In `src/layouts/Layout.astro`, add the new slot immediately before the `body-layout` div:

```astro
  <slot name="view-toggle" />
  <div class="body-layout">
    <slot name="sidebar" />
    <main class="content">
      <slot />
    </main>
  </div>
```

- [ ] **Step 2: Write `ViewToggle.astro`**

```astro
---
---
<div class="view-toggle" role="group" aria-label="View mode">
  <button type="button" class="view-toggle-btn active" data-view="grid">Grid</button>
  <button type="button" class="view-toggle-btn" data-view="timeline">Timeline</button>
</div>
<script is:inline>
  (function () {
    var buttons = document.querySelectorAll('.view-toggle-btn');
    var sidebar = document.querySelector('.sidebar');
    var gridView = document.querySelector('[data-view-panel="grid"]');
    var timelineView = document.querySelector('[data-view-panel="timeline"]');

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var view = button.getAttribute('data-view');
        buttons.forEach(function (b) { b.classList.remove('active'); });
        button.classList.add('active');

        if (view === 'timeline') {
          gridView.hidden = true;
          timelineView.hidden = false;
          if (sidebar) sidebar.hidden = true;
        } else {
          gridView.hidden = false;
          timelineView.hidden = true;
          if (sidebar) sidebar.hidden = false;
        }
      });
    });
  }());
</script>
```

- [ ] **Step 3: Write `Timeline.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatMonthYear } from '../utils/formatDate';

interface Props {
  projects: CollectionEntry<'projects'>[];
}

const { projects } = Astro.props;

const sorted = [...projects].sort(
  (a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf()
);
---
<ol class="timeline" data-view-panel="timeline" hidden>
  {sorted.map(({ data }) => (
    <li class:list={['timeline-entry', { 'card--unpublished': data.unpublished }]}>
      <div class="timeline-entry-date">
        {formatMonthYear(data.startDate)}
        {data.updatedDate && (
          <span class="timeline-entry-updated">updated {formatMonthYear(data.updatedDate)}</span>
        )}
      </div>
      <div class="timeline-entry-body">
        <span class="card-meta-tag">{data.section}</span>
        <h3>{data.title}</h3>
        <p>{data.description}</p>
        <div class="card-links">
          {data.links.length > 0 ? (
            data.links.map((link) => (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                class:list={['card-link', { 'card-link--primary': link.primary }]}
              >
                ↗ {link.label}
              </a>
            ))
          ) : (
            <span class="card-link card-link--soon">coming soon</span>
          )}
        </div>
      </div>
    </li>
  ))}
</ol>
```

- [ ] **Step 4: Wire the toggle and timeline into `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';
import Sidebar from '../components/Sidebar.astro';
import Card from '../components/Card.astro';
import ViewToggle from '../components/ViewToggle.astro';
import Timeline from '../components/Timeline.astro';

const projects = await getCollection('projects');

const sections = [
  { id: 'web', label: 'Web' },
  { id: 'games', label: 'Games' },
  { id: 'mobile-apps', label: 'Mobile Apps' },
  { id: 'experiments', label: 'Experiments' },
];

const bySection = Object.fromEntries(
  sections.map(({ id }) => [id, projects.filter((p) => p.data.section === id)])
);
---
<Layout
  title="Cameron Loveland"
  description="Cameron Loveland - software engineer building full-stack apps, mobile tools, and interactive web experiences."
>
  <ViewToggle slot="view-toggle" />
  <Sidebar slot="sidebar" />

  <div data-view-panel="grid">
    {sections.map(({ id, label }) => (
      <section class="section" id={id}>
        <h2 class="section-label">{label}</h2>
        {bySection[id].length > 0 ? (
          <div class="grid">
            {bySection[id].map((project) => <Card project={project} />)}
          </div>
        ) : (
          <div class="section-empty">Coming soon</div>
        )}
      </section>
    ))}
  </div>

  <Timeline projects={projects} />
</Layout>
```

- [ ] **Step 5: Verify the build and timeline ordering**

Run: `npm run build`

```bash
grep -q "view-toggle-btn" dist/index.html \
  && grep -q 'data-view-panel="grid"' dist/index.html \
  && grep -q 'data-view-panel="timeline"' dist/index.html \
  && grep -q "timeline-entry" dist/index.html \
  && echo "BUILD OK"

grep -o 'timeline-entry-date">[A-Za-z]* [0-9]*' dist/index.html
```

Expected: `BUILD OK`, then four lines in this order: `Jun 2025`, `Jun 2025`, `Oct 2025`, `Feb 2026` (Futuristic HUD Portfolio and Tavernborn tie on start month; Cosmic Drift and Strength Path follow chronologically).

- [ ] **Step 6: Commit**

```bash
git add src/components/ViewToggle.astro src/components/Timeline.astro src/layouts/Layout.astro src/pages/index.astro
git commit -m "feat: add grid/timeline view toggle"
```

---

### Task 7: Update the GitHub Actions deploy workflow to build with Astro

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build` (Task 1) producing `dist/`.

- [ ] **Step 1: Rewrite the workflow to build before publishing**

```yaml
name: Deploy to GitHub Pages

on:
  # Auto-deploy on every merge/push to main
  push:
    branches: [ main ]
  # Allow manual runs from the Actions tab
  workflow_dispatch:

# Permissions needed for the official Pages deploy actions
permissions:
  contents: read
  pages: write
  id-token: write

# Let an in-progress deploy finish; queue the latest without piling up runs
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify**

There's no local Actions runner, so this can't be exercised in isolation - review the diff against the file above for accuracy. It gets its real verification when this branch is pushed and the workflow actually runs (tracked separately: pushing the branch and flipping Settings → Pages → Source to "GitHub Actions" is out of scope for this plan per the design spec).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: build with Astro before publishing to Pages"
```

---

### Task 8: Update CLAUDE.md for the new architecture

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite `CLAUDE.md`**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for Astro architecture"
```

---

### Task 9: Manual browser QA

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background) - note the local URL (default `http://localhost:4321`).

- [ ] **Step 2: Visual and interaction pass in a real browser**

Using the browser automation tooling available in-session (e.g. the Playwright or Chrome DevTools MCP tools), navigate to the dev server URL and confirm each of the following. Fix any regression found before checking it off:

- Page loads with no console errors; grid view shows all four sections (Web, Games, Mobile Apps, Experiments) with the same cards, images, language dots, stack tags, and history text as the pre-migration site.
- Clicking the theme toggle switches between light/dark without a flash, and the choice persists across a reload (`localStorage`).
- Scrolling the page updates the active sidebar link to match the section in view.
- Clicking "Timeline" hides the sidebar and grid, and shows the timeline ordered oldest-to-newest ending with Strength Path (Feb 2026); each entry's links open the correct URL in a new tab.
- Clicking "Grid" restores the original grid and sidebar.
- Resizing to a mobile viewport (375px wide) still collapses the layout the same way it did before the migration.

- [ ] **Step 3: Stop the dev server**

Terminate the background `npm run dev` process.

- [ ] **Step 4: Report results**

Summarize what was checked and confirm all items in Step 2 passed, per this project's requirement to verify UI changes in a real browser before calling the work done.
