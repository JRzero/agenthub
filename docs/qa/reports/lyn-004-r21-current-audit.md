# LYN-004-R21 Current Carousel Audit

## Scope and source

- Surface: `/workbench` Agent stage.
- Fixed source: R20 commit `ddf105e77ab906b2e5644a2a3c87660e6434008e` / tree `b1292c6b65237d07cfbf44a6e48f72f27d17f6bb`.
- R20 Browser evidence reused from `docs/qa/images/lyn-004-r20/11-r20-start.png`, `12-r20-mid.png`, and `14-r20-complete.png`; no source code was changed before the R21 branch was created.
- User visual truth: `docs/qa/images/lyn-004-r21/01-talkie-user-reference.png`.

## Numbered audit

1. **Static Workbench composition** — healthy. Agent data, artwork, descriptions, status, CTA, detail panel, state summary, and recent continuation are correct and remain in scope only as unchanged context.
2. **Transition ownership** — P1. R20 keys a complete transition segment and mounts current/incoming three-card groups on a 200%-wide strip. The stage stays opaque, but the visible scene still behaves as one mechanical sheet rather than persistent Agent identities.
3. **Layer hierarchy** — P2. R20 exposes the focused card and immediate neighbors as a flat grid. It does not reproduce the user-approved persistent five-position hierarchy of far neighbor, near neighbor, focus, near neighbor, and far neighbor.
4. **Timing and queue** — healthy. R20's 520ms symmetric ease-in-out, last-target queue, circular selection, and reduced-motion helper are stable and suitable to preserve while the presentation layer changes.

## Initial findings

- P0: 0
- P1: 1 — keyed whole-group movement obscures per-Agent continuity.
- P2: 1 — missing persistent far/near/focus layer model.

## External-reference evidence limit

The Talkie public page repeatedly timed out in the in-app Browser because of page weight/connectivity. Per the user's explicit instruction, it was not retried. The supplied screenshot is the visual truth for the visible five-card relationship and public arrow/continuous-card structure. Talkie's private easing, DOM, and implementation are not claimed or reverse engineered.
