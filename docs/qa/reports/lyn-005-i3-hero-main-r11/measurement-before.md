# LYN-005-I3 R11 — focal Hero card pre-implementation measurement

Measured before editing from the original `3022 × 1488` reference at
`docs/qa/design-reference/lyn-005-i3-hero-main-r11/reference.png` and the fresh R10
`1440 × 1000` browser capture in `docs/qa/images/lyn-005-i3-hero-main-r11/before/`.

## Reference card boundary

Long-edge gradient sampling across the original pixels found:

- top edge: approximately `5.65°` clockwise;
- bottom edge: approximately `4.70°` clockwise;
- left edge: approximately `17.22°` left of vertical;
- right edge: approximately `16.30°` left of vertical.

The unequal horizontal-edge angles and strongly leaning side edges show that the
reference focal card is a perspective quadrilateral, not a plain rectangle with a
single 6° rotation. Intersections of the strongest four edge candidates give these
approximate corners:

| Corner | Source x | Source y |
| --- | ---: | ---: |
| top-left | 1856 | 84 |
| top-right | 2731 | 170 |
| bottom-right | 2430 | 1199 |
| bottom-left | 1533 | 1125 |

The source visual envelope is therefore about `1198 × 1115 px`, with the top landing
at about `5.6%` of source height and the bottom at about `80.6%`. The actual top/bottom
card edges are about `879–900 px` long and the side edges about `1070–1090 px`, so the
visible card face is materially broader than the R10 `440 × 622` rectangle.

## R10 implementation baseline

At the exact `1440 × 1000` browser viewport:

- Hero: `1380 × 820`, x=30, y=26.
- CSS focal card: `440 × 622`, `top: 74px`, `left: 53%`, `rotate(6deg)`.
- transformed bounding box: `502.61 × 664.59`, x≈730.10, y≈78.71.
- within the Hero, transformed top≈52.71 and bottom≈717.29, leaving ≈102.71 px below it.

The R10 top edge is uniformly 6°, while the reference's perspective-weighted horizontal
edges average about 5.2° and read more upright because the card is much taller and spans
deeper into the wall. A simple rectangular implementation cannot reproduce both the
reference side convergence and horizontal edges without introducing a new perspective
system, which is outside this focal-only revision.

## Superseded single-rotation calibration

The first R11 comparison pass used a `520 × 730px` rectangular proxy at
`rotate(3.8deg)`. It fixed R10's short `622px` card, but it could not express the
user-specified two-level transform language: one shared webpage plane plus a focal card
lifted above it. That pass is retained as iteration evidence in
`after/desktop-pass1-1440x1000.png`, but it is not the accepted implementation.

## Final R11 two-level 3D calibration

The accepted desktop transform chain is:

1. `.heroPortraits`: `perspective: 1800px`, `perspective-origin: 70% 48%`, and
   `transform-style: preserve-3d`.
2. `.heroPortraitPlane`: `rotateX(3.2deg) rotateY(-4.2deg) rotateZ(3.6deg)` with
   `transform-style: preserve-3d`. All eleven existing slots inherit this one parent
   plane; the ten background slots have no competing local rotation.
3. `.heroPortraitMain`: `translateZ(72px) rotateX(-4deg) rotateY(-1.8deg)
   rotateZ(2.4deg)`, preserving the parent's perspective while lifting the focal card
   and making its upper-right corner subtly nearest to the viewpoint.

CSS resolves the main card's local transform in its own coordinate space, then the
parent plane transform, and finally the stage perspective projection. `translateZ`
therefore remains under a non-flattened perspective ancestor. The former figure mask
was replaced by a neutral black overlay sibling because masking would flatten the 3D
subtree. Stage, plane, and focal card all use `preserve-3d`; the responsive stage keeps
`opacity: 1` for the same reason.

Final desktop geometry at the exact `1440 × 1000` viewport:

- Hero: `1380 × 820`, x=30, y=26.
- focal CSS box: `530 × 730px`, `top: 63px`, `left: 49.7%`;
- CSS height: `89.0%` of the Hero height;
- transformed bounding rect: x≈683.36, y≈29.86, width≈620.82,
  height≈812.03, bottom≈841.90;
- Hero bottom is y=846, leaving ≈4.10px before clipping;
- shadow: `-22px 38px 94px rgb(0 0 0 / 86%)`, placing the deepest falloff below
  and left of the lifted card without a colored halo.

Computed matrices captured from the browser:

```text
parent plane:
matrix3d(0.995347, 0.0586124, 0.0764848, 0,
         -0.0626219, 0.996727, 0.0511199, 0,
         -0.0732382, -0.0556716, 0.995759, 0,
         0, 0, 0, 1)

focal local:
matrix3d(0.99863, 0.0439628, 0.0283857, 0,
         -0.041855, 0.996597, -0.0710074, 0,
         -0.0314108, 0.0697221, 0.997072, 0,
         0, 0, 72, 1)
```

Because `getBoxQuads()` is unavailable in the application browser, the four projected
corners were reconstructed from the two computed `matrix3d` values, transform origins,
and 1800px perspective, then cross-checked against the DOM bounding rectangle:

| Corner | x | y | projected z |
| --- | ---: | ---: | ---: |
| top-left | 754.868 | 29.873 | 51.079 |
| top-right | 1304.420 | 73.635 | 107.732 |
| bottom-right | 1225.379 | 841.914 | 90.970 |
| bottom-left | 683.580 | 773.917 | 34.317 |

The top-right has the greatest projected z, confirming the requested restrained
upper-right lift. The visible top and bottom edges read at approximately `4.55deg` and
`7.15deg`; the left and right sides lean about `5.47deg` and `5.87deg` left of vertical.
This produces small perspective convergence without the exaggerated narrow-edge look
of a strong standalone `rotateY`.

At `390 × 844`, the same hierarchy remains with reduced depth:

- stage perspective `1100px`;
- parent plane `rotateX(1.6deg) rotateY(-2.4deg) rotateZ(2.4deg)`;
- focal local `translateZ(36px) rotateX(-2.2deg) rotateY(-1deg) rotateZ(1.5deg)`;
- focal CSS box `230 × 320px`; transformed rect ≈`259.60 × 347.40px`;
- document/client widths `390 / 390`.

The ten desktop background slots, left copy, navigation, CTA, Hero `820/760px` heights,
images, and every downstream section remain frozen. Only the transform wrapper, focal
geometry, neutral readability overlay, geometry contracts, and R11 evidence changed.
