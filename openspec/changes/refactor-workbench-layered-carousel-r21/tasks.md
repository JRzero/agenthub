## 1. Carousel model and presentation

- [x] 1.1 Add deterministic circular slot geometry for unique Agent cards, including five visible layers and small-collection behavior.
- [x] 1.2 Replace the keyed two-group strip with stable per-Agent card nodes and transform/scale/stack slot styling.
- [x] 1.3 Tune the 650–800ms transition, last-target queue integration, fixed stage, and reduced-motion completion without opacity or brightness animation.

## 2. Automated regression coverage

- [x] 2.1 Cover slot assignment, circular direction, one/two/three/five-plus Agents, and stable card identity with unit/component tests.
- [x] 2.2 Cover previous/next, direct neighbor, keyboard controls, rapid input, reduced motion, missing artwork, responsive overflow, and unchanged CTA/navigation behavior.

## 3. Browser and design QA

- [x] 3.1 Capture the R20 baseline and R21 start/mid/end sequences for forward, backward, rapid input, loop, reduced motion, and node-continuity measurements.
- [x] 3.2 Verify 1536, 1440, 1280, and 720 responsive states with fresh Console 0/0 and no stage/page overflow or layout shift.
- [x] 3.3 Create user-reference plus R21 same-screen comparisons, document the Talkie easing evidence limit, and record Design QA P0/P1/P2=0 with final result passed.

## 4. Gates and local handoff

- [x] 4.1 Run lint, typecheck, related and full tests, production build, OpenSpec strict validation, and git diff-check.
- [x] 4.2 Update the existing 127.0.0.1:3002 Live preview to R21 without changing Live mode, API, CORS, backend, or data, and verify HTTP/Browser health.
- [x] 4.3 Commit locally on the R21 branch and confirm the final commit/tree/parent and a clean worktree without push, PR, or deployment.
