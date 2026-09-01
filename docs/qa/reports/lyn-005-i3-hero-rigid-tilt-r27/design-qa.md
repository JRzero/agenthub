# LYN-005-I3 R27 Design QA

Date: 2026-08-31
Surface: `PublicLandingPage` Hero role wall only

## Source and normalization

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-hero-rigid-tilt-r27/user-reference.png`, `2990 × 1468` pixels.
- Source normalized to `1429 × 702`, matching the application capture produced by a `1440 × 707` CSS viewport at DPR 1 with the in-app browser's 11px scrollbar gutter.
- Standard responsive evidence: `1440 × 1000` CSS → `1429 × 992` pixels and `390 × 844` CSS → `379 × 820` pixels.
- State: anonymous public landing Hero at `#top`, default motion, no interaction overlay.

## Reference measurement

- Main-card visible long edges measure about `4.5°` and `4.9°` clockwise; background-card long edges fall roughly between `3.5°` and `5°`.
- The main card remains centered in the right wall, spans multiple masonry rows, and is visually dominant through size/z-index rather than character deformation.
- The user's explicit geometry rule takes precedence over any apparent flattened-composite perspective: R27 uses only rigid planar rotation and existing slot offsets.

## Comparison evidence

- Full same-ratio source/implementation: `docs/qa/images/lyn-005-i3-hero-rigid-tilt-r27/comparison/reference-vs-after-full.png`
- Right-wall focus: `docs/qa/images/lyn-005-i3-hero-rigid-tilt-r27/comparison/reference-vs-after-card-wall-focus.png`
- Desktop before/after: `docs/qa/images/lyn-005-i3-hero-rigid-tilt-r27/comparison/before-vs-after-desktop.png`
- Mobile before/after: `docs/qa/images/lyn-005-i3-hero-rigid-tilt-r27/comparison/before-vs-after-mobile.png`

## Findings and comparison history

### Pass 0 — blocked by P1 insufficient plane tilt

- All cards used `rotateZ(1deg)`, computed as `matrix(0.999848, 0.0174524, -0.0174524, 0.999848, 0, 0)`. The matrix was already orthogonal and distortion-free after R25, but the wall read almost upright against the 3.5–5° reference.
- Images already used `cover` and only uniform inline `scale(n)` values, so image data, crop and object position did not require modification.

### Pass 1 — passed

- Main cards now use `rotateZ(4deg)`, near cards `3.5deg`, and outer cards `4.5deg`. The variation is restrained and all cards rotate clockwise.
- Computed matrices are recorded in `transform-metrics.json`. For each matrix, both basis-vector lengths are 1 and their dot product is 0: there is no shear, non-uniform scale, or 3D projection.
- The `<img>` layer explicitly remains `width:100%; height:100%; object-fit:cover`; existing inline transforms remain equal-axis `scale(n)` only. Face width, shoulder width, robot circular helmet, alpaca head and fantasy silhouettes stay natural.
- Card size, slot position, z-index, radius, border, shadow, source, crop, Hero copy/CTA/navigation/proof, left black safety area, and all downstream sections are unchanged.
- P0/P1/P2 = 0/0/0.

## Required fidelity surfaces

- **Fonts/copy:** unchanged Hero copy, wrapping, navigation, CTA and truthful 05/DEMO/LIVE proof.
- **Spacing/layout:** all twelve slot coordinates and CSS card sizes are unchanged; only rigid rotation increased.
- **Colors/tokens:** black/lime palette, brightness tiers, borders and shadows are unchanged.
- **Image quality:** all twelve independent raster sources and object positions are unchanged; no pre-warping, composite image or new asset was introduced.
- **Content:** role subjects, labels and product capability boundaries are unchanged.
- **Interaction/accessibility:** navigation, CTA href/focus, decorative alt semantics and reduced-motion behavior are untouched.
- **Responsiveness:** 1440 and 390 document overflow are zero; mobile retains seven visible independent cards and a readable copy area.

## Verification

- Focused Vitest: 2 files / 20 tests passed.
- CSS contract requires the three explicit `rotateZ` angles, image `100% × 100% / cover`, and rejects skew, perspective, rotateX/Y, scaleX/Y and authored shear matrices.
- Browser computed matrices, card/image sizes and natural dimensions were inspected at desktop and mobile; no runtime error overlay or horizontal overflow was present.
- Remaining command gates and preview results are recorded in `completion-report.md`.

final result: passed
