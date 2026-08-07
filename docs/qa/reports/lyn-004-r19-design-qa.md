# LYN-004-R19 Buffered Carousel Motion Design QA

## Final motion parameters

- Duration: 420ms.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Animated property: `transform` only.
- Next: `translate3d(0, 0, 0)` to `translate3d(-50%, 0, 0)`.
- Previous: `translate3d(-50%, 0, 0)` to `translate3d(0, 0, 0)`.
- No scale interpolation was added; final and intermediate image sharpness/brightness remain unchanged.
- Reduced motion: runtime delay 0ms and CSS duration 0.01ms.

## R18/R19 frame comparison

| Actual sample | R18 progress | R19 progress | Reading |
| ---: | ---: | ---: | --- |
| ~43–70ms | 51.64% at 70ms | 11.96% at 43ms; 41.37% at 71ms | R19 starts on the first frame but does not jump halfway immediately. |
| ~100ms | 80.05% | 66.43% | Direction and handoff remain visibly in motion. |
| ~130ms | 90.55% | 77.87% | The first 30% of time has clear travel rather than near-completion. |
| ~170–221ms | 97.55–99.59% | 87.32–95.99% | R19 preserves a readable mid-to-late deceleration window. |
| ~293–433ms | complete | 98.95–100.00% | Soft monotonic settle; no overshoot, rebound, or second movement. |

- Full two-row sequence: `docs/qa/images/lyn-004-r19/31-r18-r19-sequence-comparison.png`.
- Early/mid focused comparison: `docs/qa/images/lyn-004-r19/32-r18-r19-early-mid-comparison.png`.
- Raw R18 measurements: `docs/qa/images/lyn-004-r19/r18-240ms-frame-metrics.json`.
- Raw R19 measurements: `docs/qa/images/lyn-004-r19/r19-420ms-frame-metrics.json`.

## Stability and interaction

- Every moving sample reported `stageOpacity = 1` and `trackOpacity = 1`; the stage stayed 522px high.
- Progress was monotonic and never exceeded 1.0, proving no spring, overshoot, rebound, or endpoint correction.
- Previous direction moved from x=-483.36px through -118.56px and -5.85px to 0, with no reversed frame. See `r19-previous-frame-metrics.json`.
- Rapid double input kept one active transition and one last-target queue. At 194ms the first slide was active; at 516ms the one queued slide was active; at 914ms the state was idle on the final valid Agent. A new reducer test proves a third request overwrites the pending target rather than adding another catch-up slide.
- The R18 two-group track, incoming `inert`/`aria-hidden` behavior, last-target queue, and per-segment displayed/target/direction key remain unchanged.
- Direction controls remain native buttons with stable accessible names and retained focus-visible behavior.

## Responsive and console

| Viewport | Client / scroll width | Stage | Focus card | Overflow |
| ---: | --- | --- | --- | ---: |
| 1536 | 1525 / 1525 | 973 × 522px | 360 × 420px | 0px |
| 1440 | 1429 / 1429 | 877 × 522px | 360 × 420px | 0px |
| 1280 | 1269 / 1269 | 717 × 522px | 360 × 420px | 0px |
| 720 | 709 / 709 | 660.77 × 522px | 280 × 420px | 0px |

- Fresh isolated Demo tab: console error 0 / warning 0.
- Persistent Live handoff: `http://127.0.0.1:3002/workbench` returned HTTP 200 under `com.linkyun.agenthub.r19-live` (PID 39151), showed no Demo marker or fetch-failure state, and a fresh in-app Browser tab reported console error 0 / warning 0. The unchanged local backend remained listening on 127.0.0.1:8080; its `/healthz` route is not implemented and returned HTTP 404.
- Final screenshots: `docs/qa/images/lyn-004-r19/41-r19-final-1280.png`, `42-r19-final-1440.png`.
- Existing Demo fixture has two Agents. Three-plus looping and one/two-Agent behavior remain covered by model and transition tests; no Agent or image fixture was added.

## Final findings

- P0: 0
- P1: 0
- P2: 0

final result: passed
