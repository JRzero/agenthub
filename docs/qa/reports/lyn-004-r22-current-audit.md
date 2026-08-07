# LYN-004-R22 current-state audit

Date: 2026-08-07
Baseline: R21 `576b5b27e00b523791c7604862f685fffcdd53e1`
Viewport: 1536 × 1000 CSS px, isolated Demo data

## Numbered audit

1. Open `/workbench` and wait for the R21 layered carousel to settle.
2. Measure the stage, local carousel viewport, center card, near card, document width, transform, opacity, and stacking order.
3. Compare the current geometry with the user feedback reference.

## Findings

- **P1 — Center card dominates the stage.** The settled center card is 360 × 420 px. The R22 target is 320–332 px, so the R21 center is 8.4–12.5% larger than the requested range.
- **P1 — Near-neighbor exposure is insufficient.** At 1536 px, the near card is 302.4 px wide after scale and only 159.2 px remains visible beyond the center card: 52.6%, below the requested 58–68%.
- **P2 — No explicit autoplay control.** R21 advances only through arrows or neighboring cards; it has no six-second auto-advance or visible pause/resume control.
- **P0 — None.** The stage remains opaque, the card nodes are continuous, and the document width equals the viewport width (1536 px), so there is no page-level horizontal overflow.

## Measured baseline

| Element | Measurement |
| --- | --- |
| Stage | 984 × 522 px |
| Carousel viewport | 900 × 420 px |
| Center | 360 × 420 px; slot 0; opacity 1; z-index 50 |
| Near neighbor | 302.4 × 352.8 px; slot 1; translateX 188 px; scale 0.84; opacity 1; z-index 40 |
| Near exposure | 159.2 / 302.4 = 52.6% |
| Document overflow | 1536 scrollWidth / 1536 innerWidth = none |

## Evidence

- User feedback: `docs/qa/images/lyn-004-r22/01-user-feedback.png`
- R21 before, same local state: `docs/qa/images/lyn-004-r22/02-r21-before-1536x1000.png`

Evidence boundary: the isolated Demo currently contains two real fixture Agents, so the far-neighbor ratio is established from the existing five-slot CSS geometry and will be verified with deterministic geometry tests rather than inventing additional visible Demo Agents.
