# LYN-005-I3 R37 completion report

## Implemented

- Removed the Hero capability-boundary `<dl>` from the rendered tree.
- Removed all desktop and mobile `.heroStats` CSS.
- Set CTA-to-status spacing to 32px desktop and 24px mobile without changing CTA geometry.
- Replaced public product-illustration `DEMO/Demo` labels with neutral Chinese example wording.
- Updated DOM, state and typography contracts plus the active OpenSpec statements that explicitly required the removed statistics row or public demo labels.

## Verification

- Focused tests: 20/20 passed.
- Browser: desktop 1440×900 and mobile 390×844; console errors 0; overflow 0; 12/12 Hero images loaded on desktop; CTA href unchanged.
- Visual: same-canvas source/before/after comparisons reviewed; P0/P1/P2 = 0/0/0.
- Full gates: 93 files / 473 Vitest tests, lint, typecheck, production build, OpenSpec strict 37/37 and `git diff --check` passed.

## Boundaries

- R36 card wall geometry and all downstream sections remain unchanged.
- No dependencies, routes, APIs, authentication behavior or configuration changed.
- The pre-existing `docs/qa/images/lyn-005-i3-hero-perfect-r17/after/mobile-390x844-pass4.png` remains unmodified by R37 and unstaged.

final result: passed
