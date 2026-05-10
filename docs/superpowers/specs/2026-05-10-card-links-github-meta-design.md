# Card Links and GitHub Metadata Design

**Date:** 2026-05-10
**Status:** Approved

## Summary

Improve the project cards on the portfolio site with more visible links following a consistent pattern, and add live GitHub metadata to each card's footer.

## Link Style

Each published card gets pill badge links in a fixed order: `↗ live site` then `⌥ github`. Badges use a muted surface background with 11px text - visible but not loud.

Cards with no GitHub repo (Cosmic Drift - live site only; Tavernborn - live site + devpost) get whatever links apply. Tavernborn's devpost link stays as the second badge until a GitHub repo is confirmed.

Coming-soon cards (Strength Path) are unchanged.

## GitHub Metadata Footer

Cards with a `data-github="owner/repo"` attribute get a two-row footer separated from the card body by a thin border:

- **Row 1:** Language dots (top 3 languages by byte count, GitHub-style colored dot + name)
- **Row 2:** `{N} commits · started {Mon YYYY} · updated {X ago}`

Cards without a `data-github` attribute render no footer at all. API failures are silent - the footer just doesn't appear.

## Data Fetching

On `DOMContentLoaded`, JS scans all `[data-github]` cards and fires three parallel requests per card (unauthenticated, public repos only):

- `GET https://api.github.com/repos/{owner}/{repo}` - `created_at`, `pushed_at`
- `GET https://api.github.com/repos/{owner}/{repo}/languages` - byte count per language
- `GET https://api.github.com/repos/{owner}/{repo}/commits?per_page=1` + `Link` header for total count

Rate limit: 60 req/hour unauthenticated. With 2 repos and 3 calls each that's 6 requests per page load - well within limits.

## Repos

- Space Portfolio: `cameronloveland/space-portfolio`
- Tavernborn: no GitHub repo confirmed - devpost stays as second link
- Cosmic Drift: no GitHub repo - live site link only, no metadata footer

## CSS Changes

New `.card-meta` block added below `.card-body`. Uses `--border` for the divider and `--text-muted` for all text. Language dot colors are inlined from a hardcoded language-to-color map.

## Out of Scope

- Authentication / private repo support
- Stars or forks count
- Caching API responses across page loads
