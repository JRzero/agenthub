# LYN-005-I3 R10 · Hero cinematic card-wall design QA

## Comparison target

- Sole visual truth: `docs/qa/design-reference/lyn-005-i3-hero-wall-r10/reference.png` (3022 × 1488 px).
- Pre-implementation measurement: `measurement-before.md` in this directory.
- Baseline: `docs/qa/images/lyn-005-i3-hero-wall-r10/before/desktop-1440x1000.png` and `before/mobile-390x844.png`.
- Final: `docs/qa/images/lyn-005-i3-hero-wall-r10/after/desktop-1440x1000.png` and `after/mobile-390x844.png`.
- Required same-canvas comparison: `docs/qa/images/lyn-005-i3-hero-wall-r10/comparison/reference-vs-implementation-full.png` and `reference-vs-implementation-wall-focus.png`.
- Before/after canvases: `comparison/before-vs-after-desktop.png` and `comparison/before-vs-after-mobile.png`.

## Measured implementation

- Desktop Hero remains frozen at 1380 × 820 CSS px inside the 1440 × 1000 viewport.
- The card wall owns the full Hero background layer. Eleven DOM card slots form three staggered multirow columns and are cropped by the Hero on the top, right and bottom.
- Every card uses the same flat `rotate(6deg)` axis. There is no `perspective`, `rotateY`, independent counter-rotation, green fog or CSS halo.
- Desktop focal card CSS size is 440 × 622 px: 31.9% of the Hero width and 75.9% of the Hero height. Its rotated bounding box measured 502.6 × 664.6 px at x≈730/y≈79 in the 1440 px screenshot.
- Background columns enter structurally between 26–31% of the Hero width and drift left on lower rows. A neutral black mask keeps the copy field effectively black and reveals the wall progressively from 24–50% without decorative color.
- Focal/near/outer brightness levels are `.96` / `.70` / `.42`; radius is 30 px on the focal card and 28 px on background cards, with one dark shadow system.
- Mobile keeps the Hero at 390 × 760, renders one 230 × 320 focal card plus four background cards, and measures 390/390 for document/client width.

## Findings and fixes

1. **P1 fixed — sparse card widget instead of a wall.** R9 contained five isolated cards beginning at 55% width. R10 contains eleven densely staggered positions with top, right and bottom crops and clear cross-row occlusion.
2. **P1 fixed — conflicting 3D geometry.** R9 relied on `rotateY(-10deg)` and a narrow perspective stage. R10 uses one flat 6° clockwise axis and positional row drift, matching the reference's right-up → left-down flow.
3. **P1 fixed — focal card scale and placement.** The prior 340 × 468 card was undersized and floated low/right. The 440 × 622 focal card now occupies the measured 30–34% × 72–78% envelope and sits center-right as part of the same wall.
4. **P2 fixed — empty edges and weak crop rhythm.** Three top fragments, three lower fragments and a right-edge fragment now continue beyond the Hero boundary, removing unowned holes.
5. **P2 fixed — incorrect depth cues.** Depth now comes from occlusion and three brightness bands rather than disparate 3D transforms or colored glows. The existing character raster's internal rim color remains inside the image; no surrounding halo was added.
6. **P2 fixed — mobile reverted to a row.** Mobile now keeps five overlapping, diagonally staggered positions and crops them within the frozen 760 px Hero.

## Behavioral and accessibility checks

- Header links and the Hero creation CTA retain their original DOM, accessible names and scroll targets; direct browser activation reached the role-assets and creation sections.
- The figure is non-interactive, labelled as a brand-example wall, uses empty alt text for decorative repeated images, and has a visually hidden explanatory caption.
- No new animation was added; the existing reduced-motion contract remains unchanged.
- In-app browser console errors: 0. Horizontal overflow: 0 at 1440 and 390.
- The public Hero copy, navigation, CTA, 820/760 heights and every section after the Hero remain unchanged.

## Final severity

- P0: 0
- P1: 0
- P2: 0

final result: passed
