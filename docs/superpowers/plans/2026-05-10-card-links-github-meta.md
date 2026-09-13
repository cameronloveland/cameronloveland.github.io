# Card Links and GitHub Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace muted text links on project cards with pill badges in a consistent order, and add a live GitHub metadata footer (languages, commit count, date range) to the Space Portfolio card via client-side GitHub API fetch.

**Architecture:** Pure static HTML/CSS site with no build step. CSS additions define the pill badge and metadata footer styles. HTML changes update link labels and add the metadata container. An inline `<script>` block at the bottom of `index.html` fetches GitHub API data on page load and populates the metadata row; failed fetches silently hide the row.

**Tech Stack:** Vanilla HTML, CSS custom properties, vanilla JS (ES5-compatible), GitHub REST API v3 (unauthenticated)

---

### Task 1: Add CSS for pill badges and metadata footer

**Files:**
- Modify: `style.css:172-183` (`.card-link`, `.card-link:hover`, `.card-links`)

- [ ] **Step 1: Replace the `.card-link` and `.card-links` block in `style.css`**

Find and replace this exact block (lines 172-183):

```css
.card-link {
  font-size: 12px;
  color: var(--text-muted);
  text-decoration: none;
}

.card-link:hover { color: var(--text-secondary); }

.card-links {
  display: flex;
  gap: 12px;
}
```

With:

```css
.card-link {
  font-size: 11px;
  color: var(--text-secondary);
  text-decoration: none;
  background: var(--border);
  border-radius: 4px;
  padding: 3px 8px;
  display: inline-block;
}

.card-link:hover { color: var(--text); }

.card-links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
```

- [ ] **Step 2: Append card metadata styles to the end of `style.css`**

Add after the last line (`footer a:hover { color: var(--text-secondary); }`):

```css

/* Card GitHub metadata footer */
.card-meta {
  border-top: 1px solid var(--border);
  padding: 8px 14px;
}

.card-meta-languages {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 5px;
}

.card-meta-lang {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted);
}

.card-meta-lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.card-meta-stats {
  font-size: 11px;
  color: var(--text-muted);
}
```

- [ ] **Step 3: Open `index.html` in a browser and verify**

- All card links should now appear as small pill badges with a surface background
- The "coming soon" span on Strength Path should also appear as a faded pill (the card has `opacity: 0.6` already)
- No metadata footer should be visible yet (it doesn't exist in the HTML yet)

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "style: add pill badge and card metadata footer styles"
```

---

### Task 2: Update card HTML

**Files:**
- Modify: `index.html:46-94` (all four card divs)

- [ ] **Step 1: Replace the Space Portfolio card**

Find:
```html
        <div class="card">
          <div class="card-preview">
            <img src="images/space-portfolio.png" alt="Futuristic HUD Portfolio preview" loading="lazy">
          </div>
          <div class="card-body">
            <h3>Futuristic HUD Portfolio</h3>
            <p>A space cockpit-themed interactive portfolio built in Next.js with particle effects and HUD-style UI panels.</p>
            <div class="card-links">
              <a href="https://cameronloveland.github.io/space-portfolio/" target="_blank" rel="noopener noreferrer" class="card-link">live site ↗</a>
              <a href="https://github.com/cameronloveland/space-portfolio" target="_blank" rel="noopener noreferrer" class="card-link">github/space-portfolio ↗</a>
            </div>
          </div>
        </div>
```

Replace with:
```html
        <div class="card" data-github="cameronloveland/space-portfolio">
          <div class="card-preview">
            <img src="images/space-portfolio.png" alt="Futuristic HUD Portfolio preview" loading="lazy">
          </div>
          <div class="card-body">
            <h3>Futuristic HUD Portfolio</h3>
            <p>A space cockpit-themed interactive portfolio built in Next.js with particle effects and HUD-style UI panels.</p>
            <div class="card-links">
              <a href="https://cameronloveland.github.io/space-portfolio/" target="_blank" rel="noopener noreferrer" class="card-link">↗ live site</a>
              <a href="https://github.com/cameronloveland/space-portfolio" target="_blank" rel="noopener noreferrer" class="card-link">↗ github</a>
            </div>
          </div>
          <div class="card-meta" style="display:none">
            <div class="card-meta-languages"></div>
            <div class="card-meta-stats"></div>
          </div>
        </div>
```

- [ ] **Step 2: Replace the Tavernborn card links**

Find:
```html
            <div class="card-links">
              <a href="https://tavernborn.com" target="_blank" rel="noopener noreferrer" class="card-link">tavernborn.com ↗</a>
              <a href="https://devpost.com/software/tavernborn" target="_blank" rel="noopener noreferrer" class="card-link">devpost ↗</a>
            </div>
```

Replace with:
```html
            <div class="card-links">
              <a href="https://tavernborn.com" target="_blank" rel="noopener noreferrer" class="card-link">↗ live site</a>
              <a href="https://devpost.com/software/tavernborn" target="_blank" rel="noopener noreferrer" class="card-link">↗ devpost</a>
            </div>
```

- [ ] **Step 3: Replace the Cosmic Drift card link**

Find:
```html
            <div class="card-links">
              <a href="https://cosmicdrift.clovola.workers.dev/" target="_blank" rel="noopener noreferrer" class="card-link">live site ↗</a>
            </div>
```

Replace with:
```html
            <div class="card-links">
              <a href="https://cosmicdrift.clovola.workers.dev/" target="_blank" rel="noopener noreferrer" class="card-link">↗ live site</a>
            </div>
```

- [ ] **Step 4: Open `index.html` in a browser and verify**

- Space Portfolio: two pill badges `↗ live site` and `↗ github`, no metadata footer visible yet
- Tavernborn: two pill badges `↗ live site` and `↗ devpost`
- Cosmic Drift: one pill badge `↗ live site`
- Strength Path: faded `coming soon` pill badge

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: update card links to pill badge style with consistent order"
```

---

### Task 3: Add GitHub API fetch script

**Files:**
- Modify: `index.html:106-113` (the existing `<script>` block at the bottom)

- [ ] **Step 1: Add the GitHub fetch script after the existing `<script>` block**

Find:
```html
<script>
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
</script>
```

Replace with:
```html
<script>
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
</script>

<script>
  (function () {
    var LANG_COLORS = {
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      CSS: '#563d7c',
      HTML: '#e34c26',
      Python: '#3572A5',
      Go: '#00ADD8',
      Rust: '#dea584',
      Shell: '#89e051',
      Vue: '#41b883',
      Swift: '#fa7343',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB'
    };

    function timeAgo(dateStr) {
      var days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
      if (days === 0) return 'today';
      if (days < 30) return days + 'd ago';
      var months = Math.floor(days / 30);
      if (months < 12) return months + 'mo ago';
      return Math.floor(months / 12) + 'y ago';
    }

    function formatMonth(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    document.querySelectorAll('[data-github]').forEach(function (card) {
      var repo = card.dataset.github;
      var meta = card.querySelector('.card-meta');
      if (!meta) return;

      var base = 'https://api.github.com/repos/' + repo;

      Promise.all([
        fetch(base).then(function (r) { return r.json(); }),
        fetch(base + '/languages').then(function (r) { return r.json(); }),
        fetch(base + '/commits?per_page=1').then(function (r) {
          var link = r.headers.get('Link') || '';
          var m = link.match(/page=(\d+)>; rel="last"/);
          return m ? parseInt(m[1], 10) : 1;
        })
      ]).then(function (results) {
        var repoData = results[0];
        var langs = results[1];
        var commitCount = results[2];

        var langNames = Object.keys(langs).slice(0, 3);
        meta.querySelector('.card-meta-languages').innerHTML = langNames.map(function (lang) {
          var color = LANG_COLORS[lang] || '#6b7280';
          return '<span class="card-meta-lang">'
            + '<span class="card-meta-lang-dot" style="background:' + color + '"></span>'
            + lang
            + '</span>';
        }).join('');

        meta.querySelector('.card-meta-stats').textContent =
          commitCount + ' commits · started ' + formatMonth(repoData.created_at)
          + ' · updated ' + timeAgo(repoData.pushed_at);

        meta.style.display = '';
      }).catch(function () {
        meta.style.display = 'none';
      });
    });
  }());
</script>
```

- [ ] **Step 2: Open `index.html` in a browser and verify**

Open the browser's Network tab before loading the page. After load:
- Three requests to `api.github.com/repos/cameronloveland/space-portfolio` should appear (repo, languages, commits)
- The Space Portfolio card should show a metadata footer with language dots on row 1 and commit stats on row 2
- Tavernborn and Cosmic Drift cards should have no metadata footer
- If the GitHub API rate limit is hit (60/hr unauthenticated), the footer silently stays hidden - test by checking the network response status

- [ ] **Step 3: Verify light mode**

Toggle the theme button to light mode and confirm:
- Pill badges use the light border color as background (`#e5e7eb`)
- Metadata text is readable against the white card surface

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add live GitHub metadata footer to Space Portfolio card"
```
