# LYN-004-R23 current-state audit

Date: 2026-08-07
Baseline: R22 `2fff887262c61c50b2f74172f5e59713ef723074`
Viewport: 1536 × 1000 CSS px, isolated Demo data

## Numbered audit

1. Open `/workbench` with the R22 Demo and wait for the layered carousel to settle.
2. Confirm the visible autoplay control, card geometry, current interval contract, and page overflow.
3. Compare the visible state with the R23 user requirement: no pause/resume control and silent three-second autoplay.

## Findings

- **P1 — Unwanted autoplay control remains visible.** The stage has exactly one `workbench-autoplay-toggle` labeled “暂停自动轮播”, occupying the top-right of the carousel panel. R23 explicitly requires its complete removal without reserved space.
- **P1 — Autoplay cadence is too slow.** The existing constant is 6000ms; R23 requires one eligible advance at exactly 3000ms.
- **P0 — None.** The stage remains usable and the carousel still advances.
- **P2 — None beyond the requested local simplification.** R22 geometry remains correct: 326px center, 280.36px near card, opacity 1, and no document overflow (`scrollWidth = innerWidth = 1536`).

## Evidence

- R22 before: `docs/qa/images/lyn-004-r23/01-r22-before-1536x1000.png`

Accessibility boundary: R23 removes the explicit pause control by user direction but retains hover, focus-within, hidden-document, reduced-motion, active-transition, and single-Agent silent pause protections.
