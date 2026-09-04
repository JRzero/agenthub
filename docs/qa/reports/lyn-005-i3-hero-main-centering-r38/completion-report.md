# LYN-005-I3 R38 completion report

## Implemented

- Changed only the Hero `main` role's `subjectOffsetX` from `0` to `-8`.
- Preserved `subjectScale: .99`, `subjectOffsetY: 0`, the login portrait source and every stage/card geometry value.
- Updated the focused landing contract to require the negative main offset while retaining the R36 geometry invariants.

## Visual result

- Desktop 1440×900: the head and upper body are optically centered, with full hair, chin and shoulders retained.
- Mobile 390×844: the same offset produces a balanced crop; no mobile-specific adjustment was necessary.
- Same-canvas comparisons show the wall and card edges unchanged; only the raster subject moves inside the main frame.

## Verification

- Browser geometry delta: `0px` for the stage and every Hero card at both viewports.
- Image loading: desktop 12/12, mobile visible 7/7.
- Console errors: 0. Horizontal overflow: 0.
- Focused Vitest: 20/20. Full Vitest: 93 files / 473 tests.
- Lint, typecheck, production build (19 pages), OpenSpec strict 37/37 and `git diff --check`: passed.
- PID 54270 remains bound to `*:3002`; loopback and LAN previews return HTTP 200.
- P0/P1/P2: 0/0/0.

## Boundaries

- No CSS, route, API, authentication, dependency, asset or downstream-section change belongs to R38.
- R37 remains uncommitted as requested.
- The pre-existing `docs/qa/images/lyn-005-i3-hero-perfect-r17/after/mobile-390x844-pass4.png` is not touched or staged by R38.

final result: passed
