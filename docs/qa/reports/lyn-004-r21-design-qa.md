# LYN-004-R21 Talkie-style Layered Carousel Design QA

## Source and implementation

- User visual truth: `docs/qa/images/lyn-004-r21/01-talkie-user-reference.png`.
- R20 baseline: `docs/qa/images/lyn-004-r20/22-r20-1440.png` and the R20 time sequence under `docs/qa/images/lyn-004-r20/`.
- R21 implementation: `docs/qa/images/lyn-004-r21/11-r21-demo-1536-final.png`, `12-r21-1440-viewport.png`, `13-r21-1280-viewport.png`, and `10-r21-responsive-720-viewport.png`.
- Combined comparisons: `20-talkie-reference-r21-comparison.png`, `21-r20-r21-1440-comparison.png`, and `22-r21-start-mid-end-sequence.png`.

## Comparison history

### Initial findings

- P1: R20 moves a keyed complete current/incoming group, so the motion reads as scene replacement despite opacity remaining 1.
- P2: R20's flat three-card grid lacks the far/near/focus depth hierarchy visible in the user reference.

### Fix and visible result

- Every participating Agent has one stable card root keyed only by `agent.id`; there is no transition-segment key or second complete group.
- Signed circular slots map to far previous `-2`, previous `-1`, focus `0`, next `1`, and far next `2`, with offstage `-3/+3` buffers for larger collections.
- Desktop geometry is `0px/1/50` for focus, `±188px/0.84/40` for near neighbors, and `±318px/0.68/30` for far neighbors (translateX/scale/z-index). At 720px it becomes `±116px/0.76` and `±202px/0.58` while the center card remains readable at 280 × 420px.
- Per-card transform uses the 720ms ease-in-out curve, while z-index linearly crosses from `50→40` and `40→50` over the same 720ms so both layers meet at `45` near the midpoint. Card/stage opacity is always 1; no black overlay, brightness animation, spring, overshoot, whole-stage key, or width/height/top/left animation exists.
- Existing Agent imagery, crop, status, description, CTA, detail, ordering, navigation, API, and data are unchanged.

## Motion and continuity evidence

- Final motion: 720ms `cubic-bezier(0.42, 0, 0.58, 1)` (Browser computed `ease-in-out`).
- Numeric Browser samples for the outgoing card: 23.39% at 293ms, 57.37% at 435ms, 92.60% at 622ms, and 100% at 761ms. Scale interpolates monotonically from 1 toward 0.84; opacity remains 1 at every sample.
- Final z-index handoff is contract-tested as a 720ms linear interpolation: outgoing/incoming layers are `50/40` at start, meet at `45/45` at 50%, and finish `40/50`. The idle and transform/opacity Browser captures remain geometrically representative; the final z-index token was verified by stylesheet and production-build gates after the Browser tab was finalized.
- The in-app Browser action round trip makes 293ms the first reliable measured point, so screenshot filenames express start/mid/complete sequence positions rather than false exact timestamps. Raw values are in `r21-720ms-frame-metrics.json`.
- DOM/source continuity: the same two real Demo ids (`32`, `19`) are present before, during, and after with `connected=true`; source maps all participating records once with `key={agent.id}` and contains no keyed transition group. Five-plus behavior is covered with synthetic id-only unit data rather than added visible fixture Agents.
- Rapid input: two next requests during one segment left phase `sliding`, kept two connected visible nodes and a non-empty layer, then ended `idle` on the last requested target (`林月`) without catch-up accumulation.
- Circular previous/next and direct selection from the exposed neighboring card landed on the correct real Agent without empty frames.

## Responsive, accessibility, and states

| Viewport | Document / viewport | Stage | Carousel | Center / near card | Page overflow |
| ---: | --- | --- | --- | --- | ---: |
| 1536 | 1536 / 1536 | 984 × 522 | 900 × 420 | 360 / 302.4px | 0 |
| 1440 | 1440 / 1440 | 888 × 522 | 838 × 420 | 360 / 302.4px | 0 |
| 1280 | 1269 / 1280 | 717 × 522 | 667 × 420 | 360 / 302.4px | 0 |
| 720 | 709 / 720 | 639.83 × 522 | 589.83 × 420 | 280 / 233.83px | 0 |

- Arrow controls remain native buttons with `上一个 Agent` / `下一个 Agent` accessible names; side cards expose native `切换到 …` buttons only when selectable. CTA links are removed from keyboard order while a card is not the committed focus.
- The Browser automation surface could enumerate the native keyboard targets but did not advance focus with its synthetic Tab command. Keyboard semantics are therefore grounded by unchanged native buttons, explicit source assertions, and browser-visible labels rather than a claimed successful synthetic key activation.
- Missing-artwork behavior is visible on the existing `知识向导` fixture and remains the established `AgentArtwork` fallback; no new asset or Agent was added.
- Reduced motion remains runtime delay 0 plus CSS `transition-duration: 0.01ms`; the in-app Browser exposes no media-emulation control, so this is verified by unit and stylesheet contract tests rather than a claimed emulated screenshot.
- Fresh isolated Demo Browser console: error 0 / warning 0.
- Persistent Live handoff: `http://127.0.0.1:3002/login`, `/workbench`, and `/assets` return HTTP 200 under `com.linkyun.agenthub.r21-live` (final PID 45795). A fresh in-app Browser tab showed no Demo marker and console error 0 / warning 0. The unchanged Agent collection request still settles to the existing HTTP 404 honest error boundary, so Live remains fixture-free and the carousel motion evidence remains isolated Demo-only.
- Live evidence: `docs/qa/images/lyn-004-r21/31-r21-live-3002-settled.png`.

## Evidence boundary

- The repository's honest Demo contains two Agents, so Browser captures show a center plus one distinct neighbor. No duplicate or invented Agent was added to force five visible cards.
- Five-card/five-plus slot assignment, circular wrap, and offstage buffers are verified with synthetic id-only unit data. The user reference establishes the intended five-card hierarchy.
- Talkie's private easing remains unknown; R21's easing is a locally measured AgentHub decision.

## Final findings

- P0: 0
- P1: 0
- P2: 0

final result: passed
