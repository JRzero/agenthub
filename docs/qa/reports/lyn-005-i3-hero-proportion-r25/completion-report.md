# LYN-005-I3 R25 completion report

## Root cause

The raster files and image-level scales were already proportional. Distortion came from the common card ancestor's `skewX(-12deg)`, which propagated a -0.229977 shear into every subject.

## Minimal correction

- `.heroRoleCard`: `skewX(-12deg) rotateZ(1deg)` → `rotateZ(1deg)`.
- Added contracts that require the rotation-only card plane, prohibit a Hero-card skew, and require every Hero image inline transform to remain a single uniform `scale(n)`.
- No DOM, image, slot, card size, crop, object position, radius, border, z-index, copy, link, route, dependency or configuration change.

## Evidence

- Before/after screenshots: `docs/qa/images/lyn-005-i3-hero-proportion-r25/`
- Same-canvas comparisons: `docs/qa/images/lyn-005-i3-hero-proportion-r25/comparison/`
- Computed matrices and per-card ratios: `docs/qa/reports/lyn-005-i3-hero-proportion-r25/transform-metrics.json`
- Design QA: `docs/qa/reports/lyn-005-i3-hero-proportion-r25/design-qa.md`

## Result

- Desktop 12/12 and mobile visible 7/7 cards inspected.
- Hero navigation/CTA boundary intact; console errors and horizontal overflow are zero.
- Focused Vitest 20/20, lint, typecheck, production build and `git diff --check` passed.
- PID 13832 remains bound to `*:3002`, and the final in-app browser deliverable is open on the Hero.
- P0/P1/P2 = 0/0/0.
- No commit, push, merge, deployment, asset replacement or dependency change.
