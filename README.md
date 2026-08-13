# cameronloveland.github.io

Personal project showcase — static HTML/CSS site hosted on GitHub Pages.

## Local preview

Open `index.html` in a browser. No build step required.

## Adding a project

Edit the project cards in `index.html`. Each card is an `<a class="card">` element
with an `<h3>` name, `<p>` description, and `<span class="card-link">` for the
destination domain.

## Deploy

Push or merge to `main`. The `.github/workflows/deploy.yml` GitHub Actions workflow
publishes the repo root to GitHub Pages automatically (no build step).

One-time setup: Repo Settings > Pages > Source = **GitHub Actions**.
