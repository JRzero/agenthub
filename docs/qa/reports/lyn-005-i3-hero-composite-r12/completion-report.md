# LYN-005-I3 R12 completion report

## Outcome

The Hero no longer rebuilds the user's composition from eleven DOM cards. It consumes
the exact supplied `1449 × 1086` PNG as one decorative, unoptimized responsive image.
The source itself now owns the black negative space, two-dimensional skew, near-square
focal card, masonry positions, overlaps, outlines, shadows, and edge crops.

## Files

- Asset: `public/images/agenthub-site/hero-role-collage-r12.png`.
- Component: `src/modules/landing/public-landing-page.tsx`.
- Responsive placement: `src/modules/landing/public-landing-page.module.css`.
- Contracts: `src/modules/landing/public-landing-page.test.tsx` and
  `src/modules/landing/public-landing-typography.test.ts`.
- OpenSpec: `openspec/changes/add-agenthub-public-site/` decision 23, task group 17,
  and final supplied-composite scenario.
- Source/before/after/comparison evidence:
  `docs/qa/design-reference/lyn-005-i3-hero-composite-r12/` and
  `docs/qa/images/lyn-005-i3-hero-composite-r12/`.
- Audit and QA: this directory's `visual-audit.md` and `design-qa.md`.

## Frozen and removed behavior

- Frozen: left Hero copy, navigation, CTA, `820/760px` Hero heights, role carousel,
  five-stage flow, scenarios, creation intent, Footer, routes, auth, APIs, dependencies,
  configuration, and all downstream interactions.
- Removed from Hero DOM/CSS: eleven wall slots, wall-plane wrapper, perspective,
  rotateX/rotateY/translateZ, per-card crop/brightness rules, focal-card geometry,
  overlay mask, and separate card shadows.
- Preserved on disk: all earlier R9 raster files. They are no longer consumed by Hero.
- No new generated image was created; the only new production asset is the exact
  user-supplied composite.

## Verification

- Exact final desktop raster bounds: x≈315.45, y=26, `1094.55 × 820px`.
- Exact mobile raster bounds before Hero clipping: x=-70, y=398, `560 × 420px`.
- Desktop/mobile document overflow: 0.
- Browser console errors: 0; navigation and primary CTA passed.
- Targeted 17/17 and full 93 files / 470 tests passed.
- Lint, typecheck, build, OpenSpec strict 37/37, and diff check passed.
- Local preview remains on port 3002 only; no commit, push, merge, or deployment was
  performed.

P0 = 0, P1 = 0, P2 = 0.

final result: passed
