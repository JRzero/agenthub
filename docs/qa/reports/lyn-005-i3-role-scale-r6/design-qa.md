# LYN-005-I3 R6 Role Asset Scale Design QA

## Comparison target

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-role-scale-r6/user-annotation-desktop.png` (2980 × 1390 px). The red annotations request removal of the visible current-role summary and a smaller layered carousel stage.
- Rendered implementation: `docs/qa/images/lyn-005-i3-role-scale-r6/after/desktop-role-section-1440x1000.jpg` (1440 × 1000 px) and `after/mobile-role-section-390x844.jpg` (390 × 844 px).
- CSS viewports and output density: 1440 × 1000 and 390 × 844 at DPR 1; implementation screenshot pixels equal CSS pixels.
- State: public homepage `#assets`, idle role transition. Desktop and mobile after captures pause autoplay through hover so the focused card is fully settled.
- Full-view comparisons: `comparison/desktop-before-after-1440x1000.jpg` and `comparison/mobile-before-after-390x844.jpg`.
- Focused source/implementation comparison: `comparison/annotation-vs-final-role-focus.jpg`. The 2980 × 1390 annotation was normalized to a 1440 × 672 left panel; the implementation used the identical 1440 px page width and a 1440 × 672 role-region crop on the right.

## Findings and iteration history

1. [P1 fixed] The visible summary below the carousel controls duplicated content already present on the focused role card. It was a separate `p[aria-live="polite"]` and consumed the empty space specifically marked by the user. The paragraph and all `.assetCurrent` styling were removed from the DOM/CSS. The existing counter now owns the live accessible label, so selection changes remain announced without a replacement visual block.
2. [P1 fixed] The 330 × 500 desktop focus card dominated the 310 px title rail and approached the exhibition edge. It is now 280 × 410 (15.2% narrower, 18% shorter, 30.4% less area); the stage changed from 570/545 px to 476/450 px, with proportional near/far offsets and preserved depth scales.
3. [P2 fixed] The 248 × 365 mobile focus card made the role section 912 px tall and pushed the next section beyond a comfortable scroll beat. It is now 212 × 300 (14.5% narrower, 17.8% shorter, 29.8% less area), with a 350/326 px stage and a measured 816 px section height.
4. Post-fix visible review of all three combined canvases found no remaining actionable P0/P1/P2 issue. The left title and right carousel carry comparable weight, adjacent cards remain legible, the main card clears the section edge, and neither viewport clips or overflows.

## Required fidelity surfaces

- Fonts and typography: passed unchanged. The landing-scoped display/body stacks, title hierarchy, counter baseline, and card copy remain intact; the removed summary introduces no orphaned label or awkward line wrap.
- Spacing and layout rhythm: passed. Desktop stage/card reductions follow the requested 15–22% visual range; mobile is independently recomposed rather than desktop-scaled. Measured document overflow is 0 at both viewports.
- Colors and tokens: passed unchanged. Near-black surfaces, lime focus/progress, muted supporting copy, borders, and shadows remain on existing landing tokens.
- Image quality and assets: passed unchanged. Existing reviewed raster portraits keep their crop and sharpness; no CSS/SVG substitute or new asset was introduced.
- Copy and content: passed. The duplicated summary is gone; focused cards retain truthful Demo/example boundaries, names, types, and descriptions.
- Interaction and accessibility: passed. Previous/next, side-card focus, progress buttons, three-second autoplay, hover pause, focus-within pause, hidden/reduced-motion/transition helper semantics, visible focus, and accessible current-role announcement remain available.

## Browser evidence

- Desktop measured focus card/stage: 280 × 410, layer 450, carousel 476, section 604; horizontal overflow 0.
- Mobile measured focus card/stage: 212 × 300, layer 326, carousel 350, section 816; horizontal overflow 0.
- DOM: `#assets p[aria-live="polite"]` absent; the existing counter is `SPAN[aria-live="polite"][aria-atomic="true"]` with the current role in its `aria-label`.
- Manual side-card focus changed the active progress state and accessible label.
- Autoplay changed the focused role after the shared three-second cadence; while hovered and while a progress control retained focus, the accessible label stayed unchanged beyond 3.7 seconds.
- Browser console errors: 0.
- Reduced motion and document-hidden pause branches are covered by the landing contract and shared workbench autoplay test suite because the selected in-app browser does not expose media/visibility emulation.

## Final findings

- P0: 0
- P1: 0
- P2: 0
- P3: 0

final result: passed
