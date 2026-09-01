# LYN-005-I3 R29 Hero Composition Design QA

## Comparison target

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-hero-composition-r29/user-reference.png` (`2990 × 1468`, normalized to `1429 × 702`).
- Before: `docs/qa/images/lyn-005-i3-hero-composition-r29/before/desktop-1440x1000-r28.png` (`1429 × 992`) and mobile `379 × 820`.
- Final implementation: `docs/qa/images/lyn-005-i3-hero-composition-r29/after/desktop-1440x1000-final.png` (`1429 × 992`) and mobile `379 × 820`.
- CSS viewports: desktop `1440 × 1000`, source-ratio desktop `1440 × 707`, mobile `390 × 844`; in-app browser density output is the browser's native capture size.
- State: `http://127.0.0.1:3002/#top`, anonymous public landing Hero.

## Findings and comparison history

- **Pass 0 / P1 — main card scale and center pressure.** R28 rendered the main card at `480.31 × 580.06`, `x767.28/y36.59` in the normalized viewport. Its face crop dominated the wall and pulled behind the title edge.
  - Fix: `31% × 75% / left55% / top7%` → `28% × 67% / left59% / top10%`; crop compensation multiplier `1.08` → `1.04`.
  - Pass 1 evidence: final main bbox `417.04 × 505.44`, `x834.65/y66.57`; more shoulder/chest is visible and the title has a cleaner black safety field.
- **Pass 0 / P2 — over-strong diagonal edge.** The R28 `±12deg` frame/image pair plus 3.5–4.5° rigid rotation made the frame silhouette visually louder than the supplied source.
  - Fix: desktop pair `-9deg/+9deg`; main/default rotation `2deg`, near `1.5deg`, outer `2.5deg`. Mobile pair `-6deg/+6deg`.
  - Pass 1 evidence: the wall keeps an unmistakable cut-card silhouette but the frame edge no longer competes with faces or copy.
- **Pass 0 / P2 — irregular card exposure.** Upper, middle and lower rows started on inconsistent horizontal tracks and left large black gaps.
  - Fix: upper row begins at 41/60/80%; middle at 35/48/93%; lower at 31/44/57/73/90%, with small vertical corrections preserving top/right/bottom bleed.
  - Pass 1 evidence: every visible supporting card has a recognizable subject region, the three-column cadence is continuous, and no isolated sliver or empty seam remains.
- **Pass 1 result:** no actionable P0/P1/P2 remains.

## Required fidelity surfaces

- Typography: Hero title, lead, CTA, navigation and proof text are frozen and pixel-stable against R28.
- Spacing/layout: the change is limited to role-wall slot percentages, main-card geometry and transform intensity; left copy and Hero height are unchanged.
- Colors/tokens: black, lime, brightness tiers, radius, border and shadows are unchanged.
- Image quality: all twelve existing independent raster assets remain loaded and use `object-fit:cover`; no new asset, composite wall or placeholder is introduced.
- Copy/content: no copy or link changed. CTA remains `/login?next=%2Fassets%2Fcreate`.
- Responsiveness/accessibility: mobile uses the existing seven-card selection with a gentler paired transform; desktop/mobile overflow is zero. Decorative images remain empty-alt and pointer-inert. Focus and reduced-motion contracts are unchanged.

## Matrix and crop proof

- Desktop main matrices: position `matrix(0.999391, 0.0348995, -0.0348995, 0.999391, 0, 0)`; frame `matrix(1, 0, -0.158384, 1, 0, 0)`; image `matrix(1.04, 0, 0.16472, 1.04, 0, 0)`; actual image `none`.
- Desktop main composite axis lengths: `1.0400001799 / 1.0400001799`; delta `1.97e-13`; dot `6.66e-7`.
- Across twelve desktop cards: maximum axis delta `3.14e-13`; maximum absolute dot `9.17e-7`.
- Across seven visible mobile cards: maximum axis delta `1.03e-13`; maximum absolute dot `5.11e-7`.
- This is uniform scale plus rigid rotation; there is no residual shear or unequal-axis scale. Visual inspection confirms no blank image edge after the reduced 11% desktop / 8% mobile overscan.

## Comparison evidence

- Full source/before/final: `docs/qa/images/lyn-005-i3-hero-composition-r29/comparison/source-before-final-desktop.png`.
- Wall focus: `docs/qa/images/lyn-005-i3-hero-composition-r29/comparison/source-r28-r29-wall-pass1.png`.
- Desktop before/final: `docs/qa/images/lyn-005-i3-hero-composition-r29/comparison/r28-r29-desktop-pass1.png`.
- Mobile before/final: `docs/qa/images/lyn-005-i3-hero-composition-r29/comparison/before-final-mobile.png`.
- Computed browser metrics: `docs/qa/reports/lyn-005-i3-hero-composition-r29/transform-metrics.json`.

## Final findings

- P0: 0.
- P1: 0.
- P2: 0.
- P3: none recorded for this frozen scope.

final result: passed
