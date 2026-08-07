# LYN-004-R20 Current Motion Audit

## Scope and evidence

- Surface: `/workbench` Agent carousel in isolated Demo mode, using only the repository's existing non-sensitive fixture.
- Fixed source: R19 commit `619553c4e99cc7867c529b8ea12379832e64e4d3`.
- Viewport: 1440 × 900 CSS px; captured image area 1429 × 893 px at 1× density.
- Start: `docs/qa/images/lyn-004-r20/01-r19-start.png`.
- Browser action-return frame: `docs/qa/images/lyn-004-r20/02-r19-action-return.png`.
- Completion: `docs/qa/images/lyn-004-r20/03-r19-complete.png`.
- Curve data: `docs/qa/images/lyn-004-r20/r19-420ms-frame-metrics.json`.

## Numbered audit

1. **Initial selected Agent** — healthy. Static composition, stage geometry, typography, imagery, color, copy, CTA, and detail panel match the accepted R19 state.
2. **Next-Agent trigger** — P2 motion finding. Browser computed style confirms 420ms with `cubic-bezier(0.16, 1, 0.3, 1)`. The committed R19 frame series reached 66.43% around 101ms and 77.87% around 130ms. The current-run action-return frame at 293ms was already 98.95% complete, so most visible travel remained concentrated at the start.
3. **Completion** — healthy. The correct Agent lands without a black or empty frame; stage height remains 522px, opacity remains 1, and document overflow remains 0.

## Initial findings

- P0: 0
- P1: 0
- P2: 1 — strong ease-out front-loads travel and makes the 420ms transition feel faster than its nominal duration.

## Evidence limits

- The in-app Browser intentionally paces pointer actions and returns roughly 273ms after activation. Exact early-time positions therefore use CSS cubic-bezier inversion at identical elapsed-time samples, grounded by Browser-verified computed duration/easing and later observed transforms.
- The in-app Browser exposes no reduced-motion emulation capability. Reduced-motion behavior is verified by the existing runtime helper and CSS contract tests rather than a claimed emulated screenshot.
