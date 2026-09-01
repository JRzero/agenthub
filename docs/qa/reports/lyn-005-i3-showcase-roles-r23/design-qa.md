# LYN-005-I3 R23 Design QA

Date: 2026-08-31
Surface: `PublicLandingPage` role-asset carousel only
Viewports: 1440×1000 desktop and 390×844 mobile

## Source and normalization

- Style reference: `docs/qa/design-reference/lyn-005-i3-showcase-roles-r23/reference-close-portrait.png`, 658×568 pixels.
- Five source portraits: 1122×1402 PNG at their supplied density; paths and hashes are listed in the adjacent design-reference README.
- Runtime assets: independent 1122×1402 lossless WebP, no resize, crop or composite baked into the files.
- Implementation screenshots: 1440×1000 and 390×844 browser captures at matching CSS viewport sizes. The browser capture density is 1 CSS pixel per screenshot pixel.
- Focus evidence: five 280×410 desktop card crops assembled into `comparison/five-role-focus-contact-sheet.png`; the style reference and 墨衡 focus card are placed on one 800×432 comparison canvas without treating their unequal component frames as pixel-identical layout targets.

## Findings

No actionable P0/P1/P2 mismatch remains.

- **Fonts and typography:** unchanged landing display/body stacks, weight and lime kicker treatment. New role titles, types, capability labels and descriptions fit without truncation on the active desktop card; the existing compact mobile hierarchy remains legible.
- **Spacing and layout rhythm:** the frozen 280×410 desktop / 212×300 mobile card frames, 18px / 14px radii, overlap, depth, progress and section seams are unchanged.
- **Colors and tokens:** all five images preserve the requested black scene, warm key/rim light and restrained cool edge. Existing lime boundary and active-border tokens retain sufficient contrast.
- **Image quality and fidelity:** all five are coherent photorealistic close portraits. Foreheads, chins, hair silhouettes, eyeglasses, headset and shoulder lines remain naturally framed at their calibrated positions; no PNG/WebP comparison revealed ringing, transparency halo, softness or visible compression damage.
- **Copy and content:** every role uses the exact approved name, positioning, complete description and capability focus. `品牌示例` remains visible and the former mixed `Demo Asset` / `示例角色` boundary is absent.
- **Interaction and accessibility:** progress selection focused all five roles; the live current-role label updated with name/type. Three-second autoplay, hover pause, carousel focus-within pause, arrows and click focus passed. The shared hidden/reduced-motion contract and existing focus semantics remain unchanged.
- **Responsiveness:** browser document overflow is zero at 1440 and 390. Adjacent cards remain clipped by the carousel rather than the document; active and inactive rounded clipping stays intact.

## Comparison history

1. **Fresh before:** the carousel mixed five different legacy/demo art directions, used one `Demo Asset`, and had inconsistent role specificity relative to the supplied R23 portrait target.
2. **Pass 1 / final:** installed five lossless independent portrait assets, calibrated their crops, replaced the complete role data, and rendered `品牌示例 · capability focus`. Full-view, mobile, source/focus and five-role same-canvas checks found P0/P1/P2 = 0/0/0; no visual correction loop was necessary.

## Evidence

- Before: `docs/qa/images/lyn-005-i3-showcase-roles-r23/before/`
- After: `docs/qa/images/lyn-005-i3-showcase-roles-r23/after/`
- Same-canvas comparisons: `docs/qa/images/lyn-005-i3-showcase-roles-r23/comparison/`

## Residual limits

- Browser media emulation for reduced motion and document visibility is unavailable in this in-app surface; those pause conditions are covered by the unchanged shared workbench unit contracts.
- Generated portrait public-use/licensing status is not established. No deployment was performed.

final result: passed
