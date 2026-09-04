# LYN-005-I3 R17 Hero measurement

## Source and normalization

- Unique source: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-cf6d7445-100b-4246-a850-f5bbe8fa4d4b.png`.
- Source pixels: 3006×1468 at Retina 2×.
- CSS-space truth: 1503×734, DPR 1 for implementation capture.
- Repository copies: `docs/qa/design-reference/lyn-005-i3-hero-perfect-r17/reference-3006x1468.png` and `reference-1503x734.png`.
- Measurement overlay: `docs/qa/design-reference/lyn-005-i3-hero-perfect-r17/reference-measurement-grid.png`.

## Reference anchors

1. Header rail begins at x≈130 and y≈38; visible logo pixels occupy rows 53–66. The login button begins at x≈1279.
2. Heading begins at x≈149/y≈171. Visible glyph rows are 175–245, 260–331, and 345–417; the left white glyph envelope is x152–663.
3. Body glyph rows are 453–464 and 478–490. The lime CTA occupies y519–561.
4. Status text occupies y589–597. The three proof values occupy y645–658.
5. The role wall is intentionally edge-cropped. Active reference pixels begin at x641 on y25, x543 on y200, x401 on y300, x481 on y500, and x401 on y650; the right edge reaches x1442 or the viewport crop.
6. The focal card visually spans about x764–1360 and y48–603 after common projection. Cards share a small two-dimensional clockwise/slanted matrix, a dark 1px outline, 18–30px source-equivalent rounding, black backgrounds, and neutral black shadows.

## Final browser geometry at 1503×734

| Element | Browser bounding rect / token |
| --- | --- |
| Header | x130, y38, 1243×40 |
| Hero copy rail | x148.8, width 540 |
| Heading | x148.8, y171, 540×240.1; 76.95px / 80.03px |
| Body | x148.8, y446.1, 390×51; visible glyphs align with reference rows |
| CTA | x148.8, y519, 116×44, 9px radius |
| Status | x148.8, y587, 540×28 |
| Proof rail | x148.8, y644, 310×39.8 |
| Role stage | x0, y0, 1503×734 |
| Focal card visual bbox | x764.2, y47.4, 590.7×558.5, bottom 605.9 |
| Card transform | `matrix(0.996138, 0.0174524, -0.229977, 0.999848, 0, 0)` = shared `skewX(-12deg) rotateZ(1deg)` |
| Focal image crop | `hero-main-reference-r18.png`; 1200×1420; `object-position: 50% 50%`; `scale(1)`; no image-level transform origin override |
| Raw wall envelope | x366.7–1667.3, y-61.1–876.3; clipped by Hero and neutral left mask |

The wall/text overlap is visually prevented by the Hero's solid black left protection layer. The document width remains exactly 1503px at the truth viewport.

## R18 pass 4 focal extraction

- Source frame: 3006×1468, processed at the original 2× raster density.
- Measured outer-corner intersections, clockwise from top-left: approximately `(1840,90)`, `(2745,155)`, `(2505,1210)`, `(1560,1110)`.
- FFmpeg homography source points after the 1280×1180 bounding crop: top-left `(350,20)`, top-right `(1255,85)`, bottom-left `(70,1040)`, bottom-right `(1015,1140)`.
- After rectification, a 60/50px inset and 1130×1080 interior crop remove the source frame and adjacent-card remnants; Lanczos output is 1200×1420.
- The output aspect ratio `0.8451` matches the raw focal-card slot ratio (`31vw` × `75vh` at the truth viewport) before the shared card matrix.
- Runtime verification: optimized browser image 480×568, card bbox x764.2/y47.4/590.7×558.5, `imageTransform = matrix(1,0,0,1,0,0)`, and the unchanged shared card matrix only.

## Pass 4 semantic slot map

| Slot | Role source |
| --- | --- |
| top-strategist | `role-strategist-demo.png` — glasses strategist |
| top-anime | `role-gamehost-demo.png` — orange-haired headset/game host |
| top-support | `hero-headset-operator-r17.png` — headset woman |
| mid-expert | `hero-senior-scientist-r17.png` — senior scientist/scholar |
| mid-fantasy | `hero-rounded-fantasy-r17.png` — rounded fantasy character |
| mid-right-partial | `hero-game-architect-r9.png` — game-concept role |
| bottom-robot | `hero-robot-tester-r9.png` — robot |
| bottom-companion | `hero-alpaca-companion-r17.png` — alpaca companion |
| bottom-operator | `hero-young-operator-r17.png` — young operator |
| bottom-fantasy | `hero-silver-fantasy-r17.png` — silver-haired fantasy woman |
| right-mid-fantasy | `hero-anime-curator-r9.png` — anime/fantasy edge role |
| main | `hero-main-reference-r18.png` — perspective-corrected reference focal character |
