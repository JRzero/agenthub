# LYN-005-I3 R12 Hero composite visual audit

## Evidence

- Sole source: `docs/qa/design-reference/lyn-005-i3-hero-composite-r12/reference.png`
  (`1449 × 1086`).
- Fresh R11 baseline captured before editing:
  `docs/qa/images/lyn-005-i3-hero-composite-r12/before/desktop-1440x1000.png`
  and `before/mobile-390x844.png`.
- Both source and baseline were opened and visually inspected before implementation.

## Source construction

1. The source is one finished two-dimensional raster composite, not an NFT/card-wall
   interface. Its left roughly `28–31%` is a continuous black field and the first
   clearly readable portrait cards begin around source x≈390–420.
2. About ten background card positions form a dense three-row diagonal masonry field.
   Top, right, and bottom cards deliberately cross the canvas edge. Gaps are roughly
   `20–45px`; corners read around `22–30px` with a restrained dark-gray outline.
3. The cards share a two-dimensional oblique projection: vertical edges drift left as
   they descend, approximately equivalent to `skewX(-9deg…-11deg)` plus only a small
   clockwise planar rotation. Horizontal edges stay nearly parallel. There is no
   visible rotateX/rotateY narrowing or focal-card corner lift.
4. The focal card occupies approximately source x≈750–1360 and y≈205–805, about
   `42%` of source width and `55%` of source height. It is near-square, not a tall
   poster. Hierarchy comes from scale, overlap, and black shadow already baked into the
   raster.

## Why R11 is wrong for this source

- R11 reconstructs eleven DOM cards under `perspective: 1800px`, a pitched/yawed
  parent plane, and a `translateZ(72px)` focal card. That produces converging edges and
  an intentionally lifted upper-right corner that the R12 source does not contain.
- R11's `530 × 730px` focal card is vertically dominant; the R12 focal face is close
  to square and materially shorter relative to the Hero.
- Independent DOM crops cannot reproduce the supplied composite's exact overlap,
  black negative space, masonry rhythm, baked shadows, or edge crops without creating
  a second approximation of an already finished asset.

## Implementation decision

Use the exact supplied `1449 × 1086` image as one Hero raster layer at
`public/images/agenthub-site/hero-role-collage-r12.png`. Desktop normalizes it to the
frozen `820px` Hero height (`≈1094px` intrinsic display width), right-aligned at x≈346
inside the 1440 viewport. Mobile reuses the same raster with a dedicated crop in the
Hero lower half. Remove the old card-wall DOM and all perspective/X/Y/Z/focal geometry
rules. Do not add an extra halo, shadow, CSS card, or generated asset over the supplied
composite.

Initial findings: P0 = 0, P1 = 2, P2 = 1.

- P1: R11 uses the wrong 3D transform language.
- P1: R11 focal-card aspect ratio and height materially diverge from the near-square
  source focal card.
- P2: R11 mobile rebuilds the wall from separate nodes instead of preserving the
  source's exact masonry crop.
