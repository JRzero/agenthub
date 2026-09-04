# LYN-005-I3 R30 Hero main-card framing QA

## Scope and source

- Scope is limited to the Hero main-card raster, its main-only subject framing rule, focused contracts, and R30 evidence.
- Supplied expanded-canvas source: `docs/qa/design-reference/lyn-005-i3-hero-main-framing-r30/source-expanded-canvas.png` (`1152 × 1366`, 1,296,946 bytes).
- Runtime asset: `public/images/agenthub-site/hero-main-reference-r30.webp` (`1152 × 1366`, 94,370 bytes, Sharp WebP quality 92).
- R29 wall slots, main-card frame size/position, background sources, z-index, desktop `-9deg/+9deg` and mobile `-6deg/+6deg` counter-skew pairs, navigation, copy, CTA, proof and downstream sections are unchanged.

## Fresh audit and correction

1. **R29 baseline — P1:** the old R18 extraction filled almost the complete frame. The forehead sat close to the upper edge, the shoulders met both side edges, and the visible crop read as a large head-and-shoulders portrait rather than a composed character card.
2. **Expanded source — healthy:** the supplied source adds genuine black canvas above, beside and below the same character. It preserves the face, jacket, lime details and original aspect ratio without synthesizing margins in CSS.
3. **Pass 1 — P2:** `scale(.94) translateY(-5%)` restored the torso but retained roughly 14–15% visible headroom. The subject was still slightly low relative to the requested 8–12% headroom.
4. **Final — passed:** the main image alone uses uniform `scale(.92)` with `translateY(-8%)`. Visual inspection at 1440×900 puts the subject envelope at approximately 76–78% of card height, headroom at approximately 10–12%, and the lower/side breathing space at approximately 10–13%. The face sits above the vertical center and the jacket remains continuous.

## Geometry and transform proof

- Desktop card bbox: `x 832.709 / y 83.202 / 420.918 × 616.597`.
- Desktop transformed image bbox: `x 802.664 / y 46.075 / 484.499 × 590.905`.
- Mobile card bbox: `x 247.790 / y 550.160 / 178.420 × 307.179`.
- Mobile transformed image bbox: `x 240.811 / y 532.439 / 194.117 × 292.816`.
- Desktop matrices remain: position `rotateZ(2deg)` → frame `skewX(-9deg)` → counter layer `skewX(9deg) scale(1.04)` → subject `translateY(-8%) scale(.92)`.
- Mobile retains the same hierarchy with `skewX(-6deg/+6deg)` and the same main-only uniform subject transform.
- The subject transform is equal-axis scale plus translation only. It adds neither shear nor non-uniform scaling; the natural `1152:1366` raster ratio is preserved through `object-fit: cover`.
- The counter-skew layer retains 11% desktop / 8% mobile horizontal overscan. Its main-only black surface matches the source black canvas, so the reduced subject scale creates no exposed edge or color seam.

## Visual and interaction verification

- Desktop 1440×900 and mobile 390×844 preserve the R29 wall density, main-card placement, frame silhouette, left copy safety and background-card crops.
- Desktop and mobile document overflow deltas are `0px`.
- The Hero CTA href remains `/login?next=%2Fassets%2Fcreate`; navigation and all frozen Hero content are unchanged.
- Fresh browser inspection found console errors `0`. A development-only Next LCP advisory for the frozen robot background image was observed; it is not an R30 runtime error and changing that frozen card is outside scope.
- P0/P1/P2 after final visual review: `0 / 0 / 0`.

## Evidence

- Before desktop: `docs/qa/images/lyn-005-i3-hero-main-framing-r30/before/desktop-1440x900.png`
- Before mobile: `docs/qa/images/lyn-005-i3-hero-main-framing-r30/before/mobile-390x844.png`
- Final desktop: `docs/qa/images/lyn-005-i3-hero-main-framing-r30/after/desktop-1440x900.png`
- Final mobile: `docs/qa/images/lyn-005-i3-hero-main-framing-r30/after/mobile-390x844.png`
- Main focus source/before/after: `docs/qa/images/lyn-005-i3-hero-main-framing-r30/comparison/source-before-after-main-focus.png`
- Desktop before/after: `docs/qa/images/lyn-005-i3-hero-main-framing-r30/comparison/desktop-before-after.png`
- Mobile before/after: `docs/qa/images/lyn-005-i3-hero-main-framing-r30/comparison/mobile-before-after.png`

## Gates

- Focused Vitest: 2 files / 20 tests passed.
- ESLint: passed.
- TypeScript `--noEmit`: passed after the production build completed; the initial parallel run raced Next's `.next/types` regeneration and was rerun cleanly.
- Next production build: passed; 19 static pages generated.
- OpenSpec strict: 37/37 passed.
- `git diff --check`: passed.

final result: passed
