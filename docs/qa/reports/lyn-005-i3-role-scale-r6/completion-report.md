# LYN-005-I3 R6 Role Asset Scale Completion Report

## Scope

- Removed the user-marked current-role summary paragraph from `PublicLandingPage` and its CSS.
- Moved the accessible live role name/type to the existing count element without adding a new visible or empty placeholder.
- Reduced only the role carousel section geometry at desktop and mobile widths. Hero, sticky five-stage flow, scenarios, intent, footer, authentication, workspace, and Agent surfaces were not changed.

## Final geometry

| Surface | Before | After | Change |
| --- | ---: | ---: | ---: |
| Desktop focus card | 330 × 500 | 280 × 410 | width −15.2%, height −18.0%, area −30.4% |
| Desktop carousel / layer | 570 / 545 high | 476 / 450 high | stage −16.5% |
| Desktop measured section | 714 high | 604 high | −15.4% |
| Mobile focus card | 248 × 365 | 212 × 300 | width −14.5%, height −17.8%, area −29.8% |
| Mobile carousel / layer | 420 / 395 high | 350 / 326 high | stage −16.7% |
| Mobile measured section | 912 high | 816 high | −10.5% |

Near cards retain scale `.88` desktop / `.8` mobile; far cards retain `.7` desktop / `.62` mobile. Offsets, card copy, shadow, and progress spacing were reduced proportionally.

## Files and evidence

- Implementation: `src/modules/landing/public-landing-page.tsx`, `src/modules/landing/public-landing-page.module.css`.
- Contract coverage: `src/modules/landing/public-landing-page.test.tsx`, `src/modules/landing/public-landing-typography.test.ts`.
- Visual truth: `docs/qa/design-reference/lyn-005-i3-role-scale-r6/`.
- Before/after and comparison canvases: `docs/qa/images/lyn-005-i3-role-scale-r6/`.
- Detailed QA: `docs/qa/reports/lyn-005-i3-role-scale-r6/design-qa.md`.

## Verification

- Focused landing tests: passed, 2 files / 16 tests.
- In-app browser 1440 × 1000 and 390 × 844: passed, no clipping/overlap/horizontal overflow, console errors 0.
- Manual side/progress changes, three-second autoplay, hover pause, and focus-within pause: passed.
- Shared autoplay contracts cover transition, hidden-document, and reduced-motion pause branches.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 93 files / 469 tests.
- `npm run build`: passed, 19 static pages generated.
- `openspec validate --all --strict`: passed, 37/37.
- `git diff --check`: passed.

## Repository boundary

- No dependencies, lockfile, configuration, backend/API/authentication, credentials, commit, push, merge, deployment, or external environment changed.
- Worktree remains intentionally dirty and uncommitted for user review.

final result: passed
