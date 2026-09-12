# Future project screenshot refresh

Status: recorded requirement; not implemented.

## User intent

The portfolio is a public showcase of projects in progress. Its images should
reflect recent project updates, rather than remaining the original screenshots.
Cameron specifically noted that Cosmic Drift now looks substantially different
from the image currently used in the hero, gallery, and timeline.

## Desired workflow

- Include fresh screenshot capture in the future project update/refresh workflow
  and portfolio maintenance skill.
- Capture the successfully deployed project version after an update. Track the
  deployed commit/version and capture time so image freshness can be checked.
- Support a project-specific capture recipe: URL, viewport, readiness condition,
  and any steps needed to reach representative gameplay or an app screen.
  A game should show gameplay rather than an incidental loading or menu screen.
- Select a suitable screenshot and crop for the hero, gallery, and timeline from
  one shared project asset record. Do not independently maintain stale copies.
- Preserve the last good image when a deployment or capture fails. A blank,
  loading, error, or broken rendering must not replace it.
- Use versioned asset filenames so updated images are not hidden by browser/CDN
  caching. Keep capture metadata separate from authored project milestones.
- Prepare image changes for review with the corresponding portfolio update.

## First candidate

Cosmic Drift: replace the old screenshot with representative current gameplay
when implementing this workflow. The current image is known to be outdated;
this note does not mean a new capture or automated refresh has been performed.

## Acceptance criteria for future implementation

A successful project update can produce a fresh representative image, record
which deployed version it shows, and update every portfolio view that uses it.
A failed capture leaves the last valid image intact and reports the failure.
