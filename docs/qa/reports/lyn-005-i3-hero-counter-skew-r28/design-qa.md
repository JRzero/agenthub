# LYN-005-I3 R28 Hero Counter-skew Design QA

## Scope and visual truth

- Source: `docs/qa/design-reference/lyn-005-i3-hero-counter-skew-r28/user-reference.png` (`2990 × 1468`).
- Scope: only the twelve independent Hero role-card nodes and their transform layers. Hero copy, navigation, CTA, proof, all images/crops/slots/z-indexes, R22–R27 changes, downstream sections, routes and product behavior remain unchanged.
- The reference uses a dense diagonal wall with visibly sheared card frames: the long frame edges lean down-left while the raster subjects remain naturally proportioned. R27's rigid 3.5–4.5° rotation preserved subjects but left the frame silhouette too rectangular.

## R28 implementation

- Position layer: `.heroRoleCard`; retains the established slot coordinates, z-index and rigid `rotateZ(4deg)` language (`3.5deg` near, `4.5deg` outer).
- Frame layer: `.heroRoleFrame`; owns radius, clipping, dark border/shadow and desktop `skewX(-12deg)`.
- Image layer: `.heroRoleImage`; owns the equal opposite desktop `skewX(12deg)` and a uniform `1.08 × existing crop scale` compensation. The actual `img` remains untransformed, `100% × 100%`, and `object-fit: cover`.
- Mobile keeps the same layering with a gentler `-8deg/+8deg` pair. Only the seven existing representative slots are visible; no desktop geometry is mechanically compressed.
- No `perspective`, `rotateX`, `rotateY`, `translateZ`, `scaleX`, `scaleY`, canvas, sprite, composite wall image or new asset is present.

## Matrix proof

Browser-computed CSS matrices are recorded for all twelve cards in `transform-metrics.json`. Multiplication uses the same 2D affine order as DOMMatrix: `position × frame × image`.

- Main: position `matrix(0.997564, 0.0697565, -0.0697565, 0.997564, 0, 0)`; frame `matrix(1, 0, -0.212557, 1, 0, 0)`; image `matrix(1.08, 0, 0.229561, 1.08, 0, 0)`.
- Main composite: `matrix(1.07736912, 0.07533702, -0.07533758, 1.07736908, 0, 0)`; axis lengths `1.0799999478 / 1.0799999478`; delta `1.45e-13`; dot product `-6.05e-7`.
- Across all twelve cards, maximum axis-length delta is below `4e-13` and maximum absolute dot product is below `1.2e-6`. This is numerically a uniform scale plus rigid rotation, not shear or non-uniform scaling.
- The browser surface did not expose a constructible `DOMMatrix`; therefore the report records its computed transform strings and applies equivalent 2D affine multiplication rather than substituting a guessed matrix.

## Visual comparison

- `comparison/reference-r27-r28-desktop.png`: source, fresh R27 baseline and R28 at a normalized `1429 × 702` Hero ratio.
- `comparison/reference-r28-card-wall-focus.png`: source/R28 wall-only focus.
- `comparison/r27-r28-desktop.png`: fresh 1440 desktop before/after.
- `comparison/r27-r28-mobile.png`: fresh 390 mobile before/after.
- Desktop preserves the left black copy field, central dominant main card, dense three-column clipping and the reference's shared diagonal silhouette. Faces, shoulders, robot helmet and alpaca head remain natural.
- Mobile keeps the copy/CTA clear, retains a readable diagonal wall below the proof block, and has zero horizontal overflow.

## Findings

- P0: 0.
- P1: 0. The R27 under-specified frame silhouette is corrected by the paired counter-skew layers.
- P2: 0. No clipping seam, corner leak, transformed raster distortion or responsive overflow remains.
- Console/runtime: no visible error overlay; all twelve desktop images loaded; navigation anchors and the real creation/login CTA remain unchanged.

final result: passed
