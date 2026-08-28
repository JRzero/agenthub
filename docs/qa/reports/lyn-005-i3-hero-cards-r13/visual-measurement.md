# R13 independent Hero cards — visual measurement

## Source and baseline

- Sole geometry reference: `docs/qa/design-reference/lyn-005-i3-hero-cards-r13/reference.png` (`1449 × 1086`).
- Fresh pre-edit browser capture: `docs/qa/images/lyn-005-i3-hero-cards-r13/before/desktop-fresh-1280x720.png`; the in-app screenshot surface initially returned its ambient 1280×720 size even though the page had requested the 1440×1000 override.
- Exact accepted R12 1440×1000 and 390×844 baseline frames were copied into the same `before/` directory for like-for-like comparison. They use the identical supplied source and frozen Hero state.

## Coordinate system

The runtime uses one absolutely positioned `1449 / 1086` stage. At 1440×1000 the frozen Hero is `1380 × 820` at `(30, 26)`, and the stage is `1094.09 × 820` at `(315.91, 26)`. Every percentage below is relative to that stage, not the viewport.

The supplied slot percentages describe visible card envelopes. Applying `skewX(-10deg) rotateZ(2deg)` expands the DOM box, so the CSS widths were calibrated smaller to make the final browser bounding boxes match the supplied percentages rather than applying the percentage twice.

| Slot | CSS x/y/w/h | Visible bbox px (x/y/w/h, stage-relative) | z | tone | mobile |
| --- | --- | --- | ---: | --- | --- |
| top-strategist | 38/1/21/26% | 394.0/4.3/273.2/221.1 | 1 | outer | no |
| top-anime | 60/1/20/26% | 634.7/4.4/262.3/220.7 | 1 | near | yes |
| top-support | 84/1/19/26% | 897.2/4.6/251.5/220.3 | 1 | near | no |
| mid-expert | 31/29/13/24% | 318.9/235.4/182.8/201.6 | 2 | outer | yes |
| mid-fantasy | 46/29/12/24% | 482.9/235.6/171.9/201.3 | 2 | near | no |
| mid-right-partial | 94/31/14/24% | 1008.2/251.6/193.7/202.0 | 2 | outer | no |
| bottom-robot | 26/57/15/28% | 260.8/464.6/211.5/235.2 | 1 | near | yes |
| bottom-companion | 42/59/11/27% | 436.6/481.8/166.3/225.5 | 2 | near | yes |
| bottom-operator | 54/75/20/29% | 566.4/611.3/267.5/245.3 | 1 | outer | no |
| bottom-fantasy | 75/78/22/29% | 796.3/635.5/289.3/246.1 | 1 | outer | yes |
| right-mid-fantasy | 91/60/14/22% | 977.1/489.4/190.2/185.6 | 2 | outer | no |
| main | 56/19/33/53% | 568.0/149.6/450.4/446.9 | 6 | main | yes |

All twelve computed transforms are the same matrix: `matrix(0.993237, 0.0348995, -0.211119, 0.999391, 0, 0)`. No card or ancestor uses perspective, `rotateX`, `rotateY`, or `translateZ`.

## Visible judgment

1. The black field occupies the left portion of the Hero and the first visible card begins at the reference-aligned lower-left wall onset; copy and CTA remain unobstructed.
2. Three top cards, three middle fragments, five lower/edge cards, and one focal card produce the same three-row masonry density and four-edge clipping rhythm.
3. The focal card's final visible envelope is `41.2% × 54.5%` of the stage and begins at `51.9% × 18.2%`, matching the source's near-square focal geometry.
4. Card content differs by contract because R9 assets are reused, but geometry, common slope, overlap, crop, outline, luminance hierarchy, and neutral shadow match the source.
