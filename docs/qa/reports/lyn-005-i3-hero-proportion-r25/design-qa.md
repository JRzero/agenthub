# LYN-005-I3 R25 Design QA

Date: 2026-08-31
Surface: `PublicLandingPage` Hero role wall only

## Source and normalization

- Problem evidence: `docs/qa/design-reference/lyn-005-i3-hero-proportion-r25/user-proportion-issue.png`, 2994×1448 pixels.
- Desktop browser override: 1440×1000 CSS; captured implementation pixels: 1429×992.
- Mobile browser override: 390×844 CSS; captured implementation pixels: 379×820.
- Before and after were captured after explicit reloads at identical viewport, route, content and density.
- Full metrics for all 12 desktop and 7 visible mobile cards: `transform-metrics.json`.

## Comparison evidence

- Source and after: `docs/qa/images/lyn-005-i3-hero-proportion-r25/comparison/reference-and-after.png`
- Desktop before/after: `docs/qa/images/lyn-005-i3-hero-proportion-r25/comparison/desktop-before-after.png`
- Card-wall focus: `docs/qa/images/lyn-005-i3-hero-proportion-r25/comparison/card-wall-focus-before-after.png`
- Mobile before/after: `docs/qa/images/lyn-005-i3-hero-proportion-r25/comparison/mobile-before-after.png`

## Findings and comparison history

### Pass 0 — blocked by P1 shared subject shear

- Every `<Image>` already used `object-fit: cover`, preserved natural dimensions, and applied only a uniform inline scale such as `matrix(1.05, 0, 0, 1.05, 0, 0)`.
- The common card ancestor applied `skewX(-12deg) rotateZ(1deg)`, producing `matrix(0.996138, 0.0174524, -0.229977, 0.999848, 0, 0)`. The -0.229977 shear made its axes non-orthogonal and expanded the vertical-axis vector to about 1.026, visibly widening faces and round/non-human forms.
- Main desktop card: unchanged CSS box ratio 0.589572, but transformed bbox ratio 0.810114. Robot: unchanged CSS ratio 0.637566, transformed bbox ratio 0.857361.
- Main mobile card: unchanged CSS ratio 0.547619, transformed bbox ratio 0.771655. Robot: 0.591716 → 0.815796.

### Pass 1 — passed

- Replaced only the shared transform with `rotateZ(1deg)`, computed as `matrix(0.999848, 0.0174524, -0.0174524, 0.999848, 0, 0)`. Both basis vectors have unit length and zero dot product to rounding, so there is rotation without shear or unequal scale.
- Main desktop bbox ratio is now 0.601895 and robot 0.649496, close to their unchanged CSS frames once the 1° rotated bounding box is accounted for.
- Main mobile bbox ratio is now 0.563149 and robot 0.607620.
- All 12 desktop cards and all 7 visible mobile cards retain their exact slot, CSS box, `object-position`, uniform image scale, z-index, tone, clipping, radius and shadow.
- P0/P1/P2: 0/0/0.

## Required fidelity surfaces

- **Fonts/copy:** unchanged Hero typography, line breaks, navigation, CTA and proof copy.
- **Spacing/layout:** slot coordinates, card CSS dimensions and wall stacking are unchanged. The wall retains its diagonal masonry distribution and 1° planar tilt.
- **Colors/tokens:** black/lime palette, brightness tones, borders and shadows are unchanged.
- **Image quality:** no file, source, natural ratio, crop or object position changed. `cover` provides crop without raster stretch; every inline image scale remains equal on X/Y.
- **Interaction/accessibility:** CTA keeps `/login?next=%2Fassets%2Fcreate`; navigation semantics, focus and reduced-motion behavior are untouched.
- **Responsiveness:** 1440 and 390 document overflow is zero; the seven-card mobile composition remains clipped inside Hero.

## Verification

- Focused Vitest: 2 files / 20 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 19 application pages generated.
- `git diff --check`: passed.
- Browser: 12 desktop / 7 mobile visible cards inspected; role-assets navigation scrolled to the 82px anchor offset; CTA navigated to `/login?next=%2Fassets%2Fcreate`; console errors 0 and horizontal overflow 0.
- Preview: PID 13832 remains bound to `*:3002`.

## Residual limits

- The selected in-app browser does not expose runtime reduced-motion emulation; no motion contract changed in R25.
- Development-only Next.js LCP warnings may appear for existing Hero images, but console errors are zero.

final result: passed
