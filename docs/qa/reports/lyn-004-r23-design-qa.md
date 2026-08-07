# LYN-004-R23 Design and Interaction QA

Date: 2026-08-07
Scope: Workbench autoplay cadence and removal of the R22 pause/resume control only.

## Comparison target

- Source visual truth: `docs/qa/images/lyn-004-r23/01-r22-before-1536x1000.png` plus the R23 contract requiring the visible control to be absent.
- Implementation: `docs/qa/images/lyn-004-r23/02-r23-after-1536x1000.png`.
- Viewport and density: both 1536 × 1000 CSS px, 1536 × 1000 output pixels, DPR 1; no normalization required.
- State: isolated Demo, dark theme, Agent 19 focused, carousel held by hover for a stable comparison.
- Full-view evidence: `docs/qa/images/lyn-004-r23/04-r22-r23-same-viewport-comparison.png`.
- Focused evidence: `docs/qa/images/lyn-004-r23/05-r22-r23-stage-focus-comparison.png` and `06-r22-r23-control-focus-comparison.png`.

## Comparison history

1. Initial R22 audit — blocked.
   - P1: the top-right Pause/Play pill remained visible despite the user's explicit removal request.
   - P1: the autoplay contract remained 6000ms rather than 3000ms.
2. R23 post-fix comparison — passed.
   - The control, its icons, labels, user-pause state, policy field, and reserved UI footprint are absent.
   - The one-shot scheduler fires once at 3000ms, remains idle at 2999ms in controlled-clock coverage, and never overlaps the 720ms transition.
   - No P0/P1/P2 differences remain.

## Required fidelity surfaces

- Fonts and typography: unchanged from R22; heading, card copy, metadata, and CTA metrics match the same-state baseline.
- Spacing and layout rhythm: stage remains 522px high; center remains 326 × 420px desktop and 280 × 420px at 720. Removing the pill leaves no placeholder, padding change, or displaced content.
- Colors and tokens: unchanged; no replacement surface or new token was introduced.
- Image quality and assets: Agent artwork, fallback artwork, crop, brightness, and Phosphor navigation arrows are unchanged. Pause/Play imports were removed rather than replaced with custom art.
- Copy and content: Agent data and product copy are unchanged; only the explicitly unwanted “暂停轮播/继续轮播” chrome was removed.

## Interaction and responsive evidence

- Controlled clock: 2999ms does not advance; 3000ms advances exactly once; another timer is scheduled only after the 720ms landing.
- Hover: holding the pointer over the stage for 3200ms kept Agent 32 focused; after pointer exit, the full three-second interval ran before advancing.
- Focus-within: keyboard/button focus held the landed Agent beyond 3200ms. Focus leaving the stage restored silent scheduling.
- Manual reset: previous/next/neighbor actions still increment the reset generation; fake-timer cancellation/restart coverage proves a fresh 3000ms delay.
- Hidden document, active transition, reduced motion, and single Agent remain explicit eligibility blockers in controlled-clock tests.
- Desktop: 1536 `scrollWidth = innerWidth = 1536`; center width 326px; near width 280.36px; opacity 1.
- Narrow: 720 `scrollWidth = 709 <= innerWidth = 720`; center 280px, near 212.8px, opacity 1; no clipping of arrows or CTA.
- Fresh isolated Demo Browser console: 0 errors / 0 warnings.

## Local Live handoff

- `com.linkyun.agenthub.r23-live` (PID 49087) persistently serves the R23 production build at `http://127.0.0.1:3002` in Live mode with the unchanged public local API base `http://localhost:8080`.
- `/login`, `/workbench`, and `/assets` each return HTTP 200.
- Fresh in-app Browser console: 0 errors / 0 warnings; no Demo marker is present.
- The unchanged Agent request returns HTTP 404, so the Live page honestly shows its existing unavailable-data boundary and does not mix in Demo fixtures. Evidence: `docs/qa/images/lyn-004-r23/07-r23-live-3002.jpg`.

## Findings

- P0: 0
- P1: 0
- P2: 0

## Evidence limit

The in-app Browser does not expose document-visibility or reduced-motion emulation. Those conditions are verified by the same pure eligibility policy and controlled-clock suite. The existing Demo still uses its two honest fixture Agents; no additional data was invented.

final result: passed
