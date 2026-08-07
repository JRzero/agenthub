## 1. Geometry and autoplay controller

- [x] 1.1 Tune desktop focus, near, far, and offstage slot geometry to the measured exposure bands without responsive overflow.
- [x] 1.2 Add the six-second one-shot autoplay scheduler, eligibility policy, visibility/reduced-motion tracking, and manual reset generation.
- [x] 1.3 Add the visible pause/resume control while preserving R21 transition, queue, card identity, and navigation behavior.

## 2. Automated regression coverage

- [x] 2.1 Cover desktop slot exposure math, responsive safe widths, one/two/three/five-plus Agent collections, and unchanged node continuity.
- [x] 2.2 Cover six-second advance with fake timers, every pause condition, full-delay resume, manual reset, no overlap, reduced motion, and single-Agent behavior.
- [x] 2.3 Preserve previous/next, neighboring-card selection, keyboard controls, circular boundaries, last-valid queue, CTA/navigation, missing data, and request states.

## 3. Browser and design QA

- [x] 3.1 Capture R21 baseline and R22 full/close-up comparisons with measured card exposure at matching desktop viewports.
- [x] 3.2 Verify automatic advance, pause/resume, hover, focus-within, hidden-document logic, manual reset, node continuity, opacity 1, and fresh Console 0/0.
- [x] 3.3 Verify 1536, 1440, 1280, and 720 responsive states with no stage/page overflow or layout drift, then record Design QA P0/P1/P2=0 and final result passed.

## 4. Gates and local handoff

- [x] 4.1 Run lint, typecheck, related and full tests, production build, OpenSpec strict validation, and git diff-check.
- [x] 4.2 Update 127.0.0.1:3002 Live to R22 without changing Live mode, API, CORS, backend, or data, and verify HTTP/Browser health.
- [x] 4.3 Commit locally on the R22 branch and confirm final commit/tree/parent and a clean worktree without push, PR, or deployment.
