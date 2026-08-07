## 1. Autoplay simplification

- [x] 1.1 Change the one-shot Workbench autoplay delay to 3000ms without changing transition overlap protection.
- [x] 1.2 Remove the visible pause/resume control, user-pause state, icons, labels, styling, and policy field.
- [x] 1.3 Preserve hover, focus-within, hidden-document, reduced-motion, active-transition, single-Agent, and manual-reset behavior.

## 2. Automated coverage

- [x] 2.1 Update fake-timer coverage for 2999ms no advance, 3000ms one advance, pause/recovery, manual reset, reduced motion, and no repeated tick.
- [x] 2.2 Assert control-specific markup/state/icons are absent while R22 geometry and R21 720ms motion assertions remain unchanged.
- [x] 2.3 Run related tests and inspect source for any stale six-second or pause-control references.

## 3. Browser and Design QA

- [x] 3.1 Capture R22 before and R23 after at matching 1536 and 720 viewports, including same-state combined comparison evidence.
- [x] 3.2 Verify no control or reserved gap, automatic advance after three seconds, hover/focus pause, manual reset, opacity 1, and fresh Console 0/0.
- [x] 3.3 Record responsive geometry stability, Design QA P0/P1/P2=0, and final result passed.

## 4. Gates and local handoff

- [x] 4.1 Run lint, typecheck, full tests, production build, OpenSpec strict validation, and git diff-check.
- [x] 4.2 Update 127.0.0.1:3002 Live to R23 without changing Live mode, API, CORS, backend, or data, and verify HTTP/Browser health.
- [x] 4.3 Commit locally on the R23 branch and confirm final commit/tree/parent and a clean worktree without push, PR, or deployment.
