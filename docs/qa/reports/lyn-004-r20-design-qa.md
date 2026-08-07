# LYN-004-R20 Slower Ease-In-Out Carousel Design QA

## Source and implementation

- Source visual truth: R19 current-run sequence at `docs/qa/images/lyn-004-r20/01-r19-start.png`, `02-r19-action-return.png`, and `03-r19-complete.png`.
- Implementation: R20 sequence at `docs/qa/images/lyn-004-r20/11-r20-start.png`, `12-r20-mid.png`, `13-r20-deceleration.png`, and `14-r20-complete.png`.
- Full comparison: `docs/qa/images/lyn-004-r20/31-r19-r20-sequence-comparison.png`.
- Focus comparison: `docs/qa/images/lyn-004-r20/32-r19-r20-mid-focus-comparison.png`.
- Viewport/state normalization: both sequences use the same 1440 × 900 CSS viewport, 1429 × 893 captured pixels, 1× density, dark theme, fixture records, start Agent, and next direction.

## Comparison history

### Initial finding

- P2: R19's 420ms `cubic-bezier(0.16, 1, 0.3, 1)` reaches 66.43% around 101ms and 77.87% around 130ms, concentrating travel before users can comfortably follow the card identities.

### Candidate evaluation and fix

- The preferred candidate `cubic-bezier(0.4, 0, 0.2, 1)` was evaluated at 520ms. It met the first-100ms target but reached 77.556% at the exact midpoint, outside the requested 50–75% midpoint range.
- Final parameters: 520ms and `cubic-bezier(0.42, 0, 0.58, 1)` (Browser canonical computed value: `ease-in-out`). Only `transform` is animated.
- Exact curve samples: 1.821% at 50ms, 7.533% at 100ms, 12.916% at 130ms, 33.804% at 210ms, 50% at 260ms, 72.18% at 330ms, 92.467% at 420ms, 98.179% at 470ms, and 100% at 520ms.
- Browser observed 41.22% at 272ms and 85.69% at 428ms; both samples kept stage/track opacity at 1, stage height at 522px, and horizontal overflow at 0.

## Interaction and stability

- Next direction moves x from 0 toward -827px; previous direction moves x from -485.995px through -90.6013px to 0 without reversal.
- Rapid double input keeps one active segment plus the final queued target: first segment was active at 280ms, the single queued return began by 574ms, and the final state was idle on the expected Agent at 1230ms.
- Native direction buttons, accessible names, and focus retention remain unchanged. The state machine, last-target queue, per-segment key, order, looping semantics, cards, CTA, navigation, and data were not rewritten.
- Reduced motion remains 0ms runtime delay plus 0.01ms CSS duration, with no transform removal or opacity path.

## Responsive and console

| Viewport | Client / scroll | Stage | Carousel | Hero | Overflow |
| ---: | --- | --- | --- | --- | ---: |
| 1536 | 1525 / 1525 | 973 × 522 | 900 × 420 | 360 × 420 | 0 |
| 1440 | 1429 / 1429 | 877 × 522 | 827 × 420 | 360 × 420 | 0 |
| 1280 | 1269 / 1269 | 717 × 522 | 667 × 420 | 360 × 420 | 0 |
| 720 | 709 / 709 | 660.77 × 522 | 610.77 × 420 | 280 × 420 | 0 |

- Fresh isolated Demo tab: console error 0 / warning 0.
- Persistent Live handoff: `http://127.0.0.1:3002/login`, `/workbench`, and `/assets` return HTTP 200 under `com.linkyun.agenthub.r20-live` (PID 40956). A fresh in-app Browser tab showed no Demo marker and console error 0 / warning 0. The unchanged Agent collection request still resolves to the existing HTTP 404 error state, so animation evidence remains isolated Demo-only and Live contains no fixture fallback.
- Raw evidence: `r19-r20-curve-comparison.json`, `r20-520ms-frame-metrics.json`, `r20-previous-frame-metrics.json`, `r20-rapid-frame-metrics.json`, and `r20-responsive-metrics.json` in `docs/qa/images/lyn-004-r20/`.

## Required fidelity surfaces

- Fonts/typography: unchanged.
- Spacing/layout rhythm: unchanged; stage stays 522px high and final geometry is identical.
- Colors/tokens: unchanged; stage and track opacity remain 1.
- Image quality/assets: unchanged; no scale, opacity, overlay, generated asset, or crop change.
- Copy/content/icons: unchanged.
- Responsiveness/accessibility: no overflow; native button labels/focus remain; reduced-motion contract remains effectively instant.

## Final findings

- P0: 0
- P1: 0
- P2: 0

final result: passed
