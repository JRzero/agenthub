# LYN-005-I3 R33 Hero role-wall measurement

## Inputs

- Geometry truth: `docs/qa/design-reference/lyn-005-i3-hero-composition-r33/source-reference.png` (1449 × 1086). This is the repository-stable byte-identical copy of the accepted early reference; the original temporary clipboard path was no longer present when R33 started.
- User R32 finding: `docs/qa/design-reference/lyn-005-i3-hero-composition-r33/r32-user-before.png` (2978 × 1436, Retina 2×).
- Fresh runtime baseline: `docs/qa/images/lyn-005-i3-hero-composition-r33/before/desktop-1440x900.jpg` and `before/mobile-390x844.jpg`.

## Source geometry

Measurements are expressed in the 1449 × 1086 source design plane.

1. The first recognisable card edge begins at about x = 350–420 px (24–29%); the darker left envelope remains visually black until about 35–40% once the fade and peripheral brightness are included.
2. The main card occupies approximately x = 750–1360 px, y = 205–805 px: about 42% of the design-plane width and 55% of its height. Its transformed silhouette is near-square rather than a tall poster.
3. Supporting cards are approximately 220–360 px wide and 250–340 px high. Gaps are 20–45 px, and several adjacent silhouettes overlap by roughly 6–14% after the shared shear.
4. Three diagonal tracks are legible: a top track clipped by the upper edge, a middle track wrapping the main card, and a bottom track clipped by the lower edge. The right-most cards also bleed outside the source.
5. Five to seven supporting cards touch or visually bracket the main card; it is not isolated by a continuous black moat.

## R32 runtime baseline at 1440 × 900

The browser-reported content width is 1429 px because the vertical scrollbar occupies the remaining viewport width.

- Stage: 1429 × 900 px (100% of the Hero instead of a 4:3 design plane).
- Main wrapper: x = 832.71, y = 83.20, w = 420.92, h = 616.60. It occupies 29.5% of the content width and 68.5% of the Hero height, so it reads as an isolated tall poster.
- Supporting wrappers: about 236–313 px wide and 232–348 px high, but large 70–190 px black gaps remain between the three rows.
- Wall visible envelope: x = 438.67 to beyond 1564.36; top and bottom bleed exist, but the middle row does not continuously bridge the main card to the peripheral cards.
- Tone-specific rotations (1.5°, 2°, 2.5°) create a scattered-album rhythm instead of one coherent wall direction.

## R33 implementation targets

- Restore a 1449:1086 internal stage sized by viewport width (`clamp(1024px, 80vw, 1600px)`), centered vertically so the Hero clips the top and bottom naturally.
- Place the first visible supporting cards at 23–33% of the stage, which yields a 38–42vw wall onset at 1440 px while preserving the black copy zone.
- Increase supporting card widths to 17–25% of the stage and reduce the main to 36% × 58% of the stage; the shared shear expands its visible silhouette toward the reference near-square proportion.
- Use a single 2° position-plane rotation, paired frame/image shears of −8°/+8° on desktop and −5°/+5° on mobile, and no 3D or non-uniform scale.
- Reframe each R32 subject with per-card uniform scale and translation only; source images remain unchanged.
