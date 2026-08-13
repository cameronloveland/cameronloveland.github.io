# Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the portfolio from a hobby project gallery to a professional curated showcase with a left sidebar section nav, wider layout, rewritten header tagline, LinkedIn link, and improved card descriptions.

**Architecture:** Pure static HTML/CSS with a small IntersectionObserver script for scroll-linked sidebar highlighting. No build step. All changes confined to `index.html` and `style.css`.

**Tech Stack:** HTML, CSS custom properties, vanilla JS (IntersectionObserver)

**LinkedIn URL:** `https://www.linkedin.com/in/cameron-loveland/`

---

### Task 1: Widen layout and add sidebar CSS

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Update the site container width and add body layout styles**

In `style.css`, replace:
```css
.site {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px;
}
```
With:
```css
.site {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
}
```

Then add these new rules after the `.site` block:
```css
/* Body layout */
.body-layout {
  display: flex;
  align-items: flex-start;
  padding-top: 40px;
}

/* Sidebar */
.sidebar {
  width: 160px;
  flex-shrink: 0;
  position: sticky;
  top: 40px;
  padding-right: 32px;
}

.sidebar-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-link {
  font-size: 13px;
  color: var(--text-muted);
  padding: 4px 8px 4px 10px;
  border-left: 2px solid transparent;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s;
  display: block;
}

.sidebar-link:hover { color: var(--text-secondary); }

.sidebar-link.active {
  color: var(--text);
  border-left-color: var(--text-muted);
}

.sidebar-link.sidebar-link--empty { opacity: 0.4; }

/* Content area */
.content {
  flex: 1;
  min-width: 0;
  padding-bottom: 60px;
}
```

- [ ] **Step 2: Add section and empty-section styles**

Add after the `.content` rule:
```css
.section { margin-bottom: 48px; }

.section-empty {
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
}
```

- [ ] **Step 3: Add mobile styles**

Find the existing `@media (max-width: 600px)` block and replace it with:
```css
@media (max-width: 768px) {
  .body-layout { flex-direction: column; }

  .sidebar {
    width: 100%;
    position: static;
    padding-right: 0;
    padding-bottom: 24px;
  }

  .sidebar nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
  }

  .sidebar-link {
    border-left: none;
    border-bottom: 2px solid transparent;
    padding: 3px 10px 3px 10px;
    font-size: 12px;
  }

  .sidebar-link.active {
    border-left-color: transparent;
    border-bottom-color: var(--text-muted);
  }

  .grid { grid-template-columns: 1fr; }
  header { flex-direction: column; }
}
```

- [ ] **Step 4: Open index.html in a browser and confirm the page still renders correctly (no visual regressions at this point - the new classes aren't used yet)**

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "style: widen layout to 960px and add sidebar + section CSS"
```

---

### Task 2: Update header - tagline and LinkedIn link

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Rewrite the subtitle and add LinkedIn to nav**

Find in `index.html`:
```html
    <div class="header-left">
      <h1>Cameron Loveland</h1>
      <p>Software engineer - hobby projects &amp; experiments</p>
    </div>
    <nav class="header-links" aria-label="Site links">
      <a href="https://github.com/cameronloveland" target="_blank" rel="noopener noreferrer">GitHub</a>
```

Replace with:
```html
    <div class="header-left">
      <h1>Cameron Loveland</h1>
      <p>Software engineer building full-stack apps, mobile tools, and interactive web experiences.</p>
    </div>
    <nav class="header-links" aria-label="Site links">
      <a href="https://github.com/cameronloveland" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://www.linkedin.com/in/cameron-loveland/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
```

- [ ] **Step 2: Also update the meta description tag at the top of `<head>`**

Find:
```html
  <meta name="description" content="Software engineer - hobby projects and experiments by Cameron Loveland.">
```

Replace with:
```html
  <meta name="description" content="Cameron Loveland - software engineer building full-stack apps, mobile tools, and interactive web experiences.">
```

- [ ] **Step 3: Verify in browser - header should show updated tagline and GitHub + LinkedIn in nav**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: update header tagline and add LinkedIn nav link"
```

---

### Task 3: Restructure main content into sidebar + sectioned layout

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the `<main>` block with the new sidebar + section structure**

Find the entire `<main>` block (lines 41-142):
```html
  <main>
    <section>
      <h2 class="section-label">Projects</h2>
      <div class="grid">
        ...all four cards...
      </div>
    </section>
  </main>
```

Replace with (keep all four cards in place - just restructure around them):
```html
  <div class="body-layout">
    <aside class="sidebar">
      <div class="sidebar-label">Sections</div>
      <nav aria-label="Page sections">
        <a class="sidebar-link" href="#websites">Websites</a>
        <a class="sidebar-link" href="#games">Games</a>
        <a class="sidebar-link" href="#apps">Apps</a>
        <a class="sidebar-link sidebar-link--empty" href="#experiments">Experiments</a>
      </nav>
    </aside>

    <main class="content">

      <section class="section" id="websites">
        <h2 class="section-label">Websites</h2>
        <div class="grid">
          <!-- Futuristic HUD Portfolio card goes here (unchanged) -->
        </div>
      </section>

      <section class="section" id="games">
        <h2 class="section-label">Games</h2>
        <div class="grid">
          <!-- Tavernborn card goes here (unchanged) -->
          <!-- Cosmic Drift card goes here (unchanged) -->
        </div>
      </section>

      <section class="section" id="apps">
        <h2 class="section-label">Apps</h2>
        <div class="grid">
          <!-- Strength Path card goes here (unchanged) -->
        </div>
      </section>

      <section class="section" id="experiments">
        <h2 class="section-label">Experiments</h2>
        <div class="section-empty">Coming soon</div>
      </section>

    </main>
  </div>
```

Move each card into its correct section:
- Futuristic HUD Portfolio card -> `#websites` grid
- Tavernborn card -> `#games` grid
- Cosmic Drift card -> `#games` grid
- Strength Path card -> `#apps` grid

- [ ] **Step 2: Verify in browser - four sections visible, cards in correct sections, sidebar shows section labels**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: restructure main content into sidebar + sectioned layout"
```

---

### Task 4: Add IntersectionObserver for scroll-linked sidebar

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the IntersectionObserver script before `</body>`**

Find the closing `</body>` tag and add the following script block just before it (after the existing `toggleTheme` script):
```html
<script>
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

- [ ] **Step 2: Verify in browser - scroll through the page and confirm the active sidebar link updates as each section comes into view. Check that the initial active state is "Websites" on page load.**

If no section is active on load (all sections below fold), add a manual initial active state. Find the Websites sidebar link and add `active` class directly:
```html
<a class="sidebar-link active" href="#websites">Websites</a>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add IntersectionObserver scroll-linked sidebar highlighting"
```

---

### Task 5: Rewrite card descriptions

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update Futuristic HUD Portfolio description**

Find:
```html
            <p>A space cockpit-themed interactive portfolio built in Next.js with particle effects and HUD-style UI panels.</p>
```
Replace with:
```html
            <p>Interactive Next.js portfolio prototype featuring layered parallax, particle effects, animated HUD panels, and responsive project presentation.</p>
```

- [ ] **Step 2: Update Tavernborn description**

Find:
```html
            <p>A daily text RPG built for the Bolt.new dev hackathon. You are the Tavernborn - return to claim your destiny one day at a time. Early prototype.</p>
```
Replace with:
```html
            <p>Daily text RPG prototype with persistent character progression, AI-assisted story generation, and a tavern-centered fantasy loop. Built during the Bolt.new hackathon.</p>
```

- [ ] **Step 3: Update Cosmic Drift description**

Find:
```html
            <p>A space racing game.</p>
```
Replace with:
```html
            <p>Three.js/Vite space racing prototype focused on responsive controls, visual effects, and arcade-style progression.</p>
```

- [ ] **Step 4: Update Strength Path description**

Find:
```html
            <p>A React Native mobile app for tracking strength training progress and building consistent habits.</p>
```
Replace with:
```html
            <p>React Native strength training app focused on staged progression, workout tracking, plate-aware warmups, and long-term training consistency.</p>
```

- [ ] **Step 5: Verify all four descriptions in browser**

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: rewrite card descriptions to highlight technical and product depth"
```

---

### Task 6: Final verification

- [ ] **Step 1: Open in browser at desktop width (~1200px) - confirm layout looks correct with sidebar beside content**

- [ ] **Step 2: Resize to mobile width (~375px) - confirm sidebar collapses to horizontal anchor row above content**

- [ ] **Step 3: Check dark mode and light mode both render correctly**

- [ ] **Step 4: Verify all card links still work (live site, github, devpost)**

- [ ] **Step 5: Verify LinkedIn nav link opens `https://www.linkedin.com/in/cameron-loveland/` in a new tab**

- [ ] **Step 6: Scroll through all sections and confirm IntersectionObserver highlights update correctly**
