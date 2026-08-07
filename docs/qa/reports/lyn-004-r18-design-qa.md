# LYN-004-R18 Design and Interaction QA

## Fix under test

- One 240ms horizontal track animation using `cubic-bezier(0.22, 1, 0.36, 1)`.
- Next: two-group track moves `translate3d(0, 0, 0) → translate3d(-50%, 0, 0)`.
- Previous: track moves `translate3d(-50%, 0, 0) → translate3d(0, 0, 0)`.
- The stage panel, viewport, title, detail panel, status summary, and recent list do not animate opacity or layout properties.
- The outgoing and incoming groups coexist for the full slide. The incoming group is `aria-hidden` and `inert` until it becomes current, preventing duplicate focus targets while keeping its cards/images mounted before commit.

## Same-state evidence

- User feedback + post-fix comparison: `docs/qa/images/lyn-004-r18/53-feedback-after-comparison.png`.
- Same-browser before/after midframe comparison: `docs/qa/images/lyn-004-r18/54-before-after-midframe-comparison.png`.
- Before next sequence: `docs/qa/images/lyn-004-r18/51-before-next-sequence.png`.
- After next sequence: `docs/qa/images/lyn-004-r18/52-after-next-sequence.png`.
- After previous: `docs/qa/images/lyn-004-r18/31-after-prev-0.png` through `34-after-prev-complete.png`.
- Rapid input: `docs/qa/images/lyn-004-r18/35-after-rapid-start.png`, `36-after-rapid-mid.png`, `37-after-rapid-complete.png`.
- Responsive: `docs/qa/images/lyn-004-r18/61-after-final-1280.png`, `63-after-final-1440.png`; 720px measured evidence in `44-after-narrow-720-final.png`.

## Frame measurements

| State | Stage opacity | Track opacity | Stage geometry | Overflow |
| --- | ---: | ---: | --- | --- |
| 1440 start | 1 | n/a | 877 × 522px | 0px |
| next moving | 1 | 1 | 877 × 522px | 0px |
| next midpoint | 1 | 1 | 877 × 522px | 0px |
| next complete | 1 | n/a | 877 × 522px | 0px |
| previous moving | 1 | 1 | 877 × 522px | 0px |
| 720 responsive | 1 | 1 when moving | stage 672 × 522px; hero x=220..500 | 0px |

The stage background remained `rgb(15, 17, 19)` and the viewport remained 827 × 420px in every 1440 sequence sample. No black overlay, filter, opacity keyframe, or cleared stage exists in the post-fix CSS/DOM.

## Interaction and resilience

- **Next/previous:** direction attributes and track transforms agree; both settle on the expected Agent.
- **Rapid double input:** the active target completes without being replaced mid-frame; one last-target queue is then replayed. The transition key includes displayed/target/direction so a same-direction queued slide restarts rather than sticking at its first endpoint.
- **Looping:** `relativeAgentId` wraps first/last with modulo arithmetic; 1/2/3-Agent model coverage remains green.
- **Cold/missing image:** the incoming group is mounted for the whole transition while the outgoing group stays visible; existing `AgentArtwork` placeholder behavior remains intact. No stage is cleared while a new image decodes.
- **Reduced motion:** runtime completion delay becomes 0ms and CSS duration becomes 0.01ms; there is no opacity or black-frame path.
- **Accessibility:** controls retain native buttons, stable accessible names, focus-visible styling, and DOM focus through selection updates. The duplicate incoming group cannot receive focus.
- **Console:** fresh isolated Demo tab recorded 0 errors and 0 warnings after the final build state.

## Responsive and data boundary

- 1536 measured `scrollWidth = clientWidth = 1525`; stage 973 × 522px and focus card 360 × 420px.
- 1440 measured `scrollWidth = clientWidth = 1429`.
- 1280 measured `scrollWidth = clientWidth = 1269`.
- 720 measured `scrollWidth = clientWidth = 720`; focus card rect stayed inside the stage.
- The existing Demo fixture has two Agents, so Browser time-series evidence uses that honest dataset. Three-plus ordering/loop behavior is covered by existing model tests and the transition reducer; no fake Agent was added. Live mode was not given a fixture fallback.
- Final Live runtime is `com.linkyun.agenthub.r18-live` on `127.0.0.1:3002` (PID 38064 during verification); `/login`, `/workbench`, and `/assets` each returned HTTP 200. The in-app Browser found no `演示数据` marker and no console error/warning. The existing non-Docker service was restarted as `com.linkyun.lyn004s1` (PID 38085), but the authenticated Live Agent request still returned the unchanged HTTP 404 boundary, so motion acceptance remains grounded in the isolated Demo and Live contains no fixture fallback.

## Final findings

- P0: 0
- P1: 0
- P2: 0
- Optional P3: none recorded.

final result: passed
