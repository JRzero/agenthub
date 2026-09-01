# LYN-005-I3 R24 completion report

## Change

- Replaced the shared role-card copy surface from a uniform 88%-opaque black board with a soft transparent-to-dark tonal transition already used by the workbench visual system.
- Reduced the desktop copy footprint from 156px to 150px and moved its top from 253px to 259px.
- Reduced the mobile copy footprint from 94px to 91px and moved its top from 205px to 208px.
- Added a restrained dark text shadow so lime/white/muted copy remains readable across all five portraits.
- Added CSS contracts confirming the old uniform board cannot return and the desktop/mobile fade and spacing values remain scoped to the carousel.

## Frozen surfaces

- No JSX/DOM, image, role data, card size, crop, radius, border, transform, z-index, navigation, Hero, route, authentication, API, dependency or configuration change.
- Existing R22/R23 dirty work and the unrelated pre-existing R17 screenshot were preserved.

## Evidence

- Before: `docs/qa/images/lyn-005-i3-showcase-overlay-r24/before/`
- After: `docs/qa/images/lyn-005-i3-showcase-overlay-r24/after/`
- Comparison: `docs/qa/images/lyn-005-i3-showcase-overlay-r24/comparison/`
- QA: `docs/qa/reports/lyn-005-i3-showcase-overlay-r24/design-qa.md`

## Result

- Five roles focused at desktop and mobile with zero document overflow and zero console errors.
- Focused Vitest 20/20, lint, typecheck, production build and `git diff --check` passed.
- PID 13832 remains bound to `*:3002`; the local preview returned HTTP 200 and the in-app browser deliverable remains on `#assets`.
- P0/P1/P2 = 0/0/0.
- No commit, push, merge, deployment or dependency change was performed.
