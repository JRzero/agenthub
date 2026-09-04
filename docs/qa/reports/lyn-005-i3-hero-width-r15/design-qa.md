# LYN-005-I3 R15 design QA

## Findings and iteration history

- [P1 fixed] At 1920 and 2048 the fixed 1094px stage shrank to 56.98% and 53.42% of the viewport, leaving the accepted R13 role wall visually stranded at the right edge. The desktop stage now uses a capped 76vw width while retaining its coordinate system.
- [P2 fixed] The first responsive pass inherited desktop `translateY(-50%)` into the 390px override and moved the mobile stage from y=398 to y=188. The mobile rule now explicitly sets `transform: none`; the final R13/R15 mobile board is visually unchanged.
- Post-fix result: P0 = 0, P1 = 0, P2 = 0.

## Required fidelity surfaces

| Surface | Result | Evidence |
| --- | --- | --- |
| Spacing/layout | passed | Stage remains 76.00vw from 1440–2048; visible envelope remains 57.89vw and begins at 40.03–40.65vw. |
| Responsive crop | passed | 1440 is effectively unchanged; 1680–2048 crop symmetrically above/below the 820px Hero; mobile is frozen. |
| Typography | passed unchanged | Hero and R14 intent font stacks, weight, leading, tracking, wrapping, and measures are untouched. |
| Colors/tokens | passed unchanged | Near-black, lime, card luminance, outline, and shadow tokens are untouched. |
| Image quality/assets | passed unchanged | Same twelve independent R9 images, crops, transforms, and z-index; no composite, sprite, new asset, or CSS illustration. |
| Copy/content | passed unchanged | Creator-first Hero, CTA, navigation, downstream sections, and truthful boundaries are unchanged. |
| Interaction/accessibility | passed | CTA `#create`, navigation scroll, twelve-card semantics, focus/reduced-motion contracts, and 390px containment remain intact. |

## Evidence

- Before: `docs/qa/images/lyn-005-i3-hero-width-r15/before/`.
- After: `docs/qa/images/lyn-005-i3-hero-width-r15/after/`.
- Wide-screen boards: `comparison/before-vs-after-1920.png`, `before-vs-after-2048.png`, and `responsive-width-matrix.png`.
- Frozen mobile board: `comparison/r13-vs-r15-mobile.png`.
- Viewports are CSS/output pixels at DPR 1; boards scale equal-view source/implementation pairs to equal panel sizes without changing crop.

Application-browser checks: console errors/warnings 0, no horizontal overflow at 1440/1680/1920/2048/390, page title correct, CTA/navigation working, twelve cards present, one main card present, and zero R12 composite images.

final result: passed
