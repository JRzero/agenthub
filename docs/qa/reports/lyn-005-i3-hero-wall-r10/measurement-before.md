# LYN-005-I3 Hero card-wall R10 — pre-implementation measurement

Measured before editing against the only R10 reference:
`docs/qa/design-reference/lyn-005-i3-hero-wall-r10/reference.png` (3022 × 1488).
The current R9 baseline is recorded at `docs/qa/images/lyn-005-i3-hero-wall-r10/before/`.

## 1. Reference geometry

1. **Wall onset and crop** — the first discernible card material begins at about `x = 760 px`, or `25.15%` of the 3022 px viewport. The card wall continues beyond the top, right and bottom edges; it is not a bounded right-column widget.
2. **Left readability mask** — the reference holds the copy side effectively black through roughly the first quarter, then suppresses card contrast through about `x = 42%`. The implementation target is a neutral-black visibility mask only: opaque through `24%`, feathering between `24–46%`, with no green fog, glow or decorative color wash.
3. **Common axis** — visible card top/bottom edges rise from left to right by roughly `5–7°`; the implementation seed is `6deg` clockwise. No visible `rotateY` narrowing is present. Downstream rows drift left, establishing a right-up → left-down wall axis.
4. **Density** — three staggered columns and multiple rows produce at least 11 visible card positions. Typical clear gaps are approximately `18–36 px`, while the enlarged focal card overlaps neighbouring rows and columns. Three cropped fragments are visible along the top edge and at least three fragments are cropped along the bottom/right edges.
5. **Focal card** — approximate reference corner envelope is `x ≈ 1550–2740`, `y ≈ 90–1200`. Its visible bounding box is about `29–32%` of viewport width and `72–76%` of viewport height, with a target corner radius of `30 px`, a thin dark-gray edge and deep black shadow. It sits center-right and spans about two background rows.
6. **Depth by luminance, not 3D** — focal card is 100% brightness; near cards target `60–75%`; outer cards `25–50%`. Occlusion, crop and luminance create depth. Purple/blue halo and green atmosphere are explicitly excluded.

## 2. R9 baseline finding

- Desktop R9 contains five cards only, begins at `55%` viewport width, and uses `perspective(1400px) rotateY(-10deg) rotateZ(4deg)`.
- The focal card is only `340 × 468 px` (about 24% of the 1440 viewport width and 57% of the fixed 820 px Hero height) and floats within large unoccupied areas.
- Background cards use four disconnected corner positions; there is no multirow wall, no top/bottom crop rhythm and no shared flat-card axis.
- Mobile similarly collapses to a sparse row, so it does not preserve the dense diagonal-wall reading.

These are P1 composition mismatches. R10 will change only the Hero figure DOM/CSS and its contracts/evidence; navigation, copy, CTA, Hero height and every downstream section remain frozen.
