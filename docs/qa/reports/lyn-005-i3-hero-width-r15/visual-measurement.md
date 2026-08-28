# LYN-005-I3 R15 visual measurement

## Comparison target

- Frozen R13 1440 composition: `docs/qa/images/lyn-005-i3-hero-width-r15/before/desktop-1440x1000.png`.
- Fresh wide-screen baselines: `docs/qa/images/lyn-005-i3-hero-width-r15/before/desktop-1920x1000.png` and `desktop-2048x1000.png`.
- Frozen mobile source: `docs/qa/images/lyn-005-i3-hero-cards-r13/after/mobile-390x844.png`.

The target is responsive proportional continuity: keep the accepted R13 1440 geometry, enlarge the same coordinate stage with viewport width, and let the 820px Hero crop vertically. No card-internal geometry is reinterpreted.

## Stage and visible envelope

`Visible envelope` is the union of all transformed card bounding boxes after clipping to the Hero and viewport.

| Viewport | Before stage | After stage | Before visible envelope | After visible envelope | After envelope left |
| --- | --- | --- | --- | --- | --- |
| 1440 | 1094.09px / 75.98% | 1094.40px / 76.00% | 833.31px / 57.87% | 833.55px / 57.89% | 576.45px / 40.03% |
| 1680 | 1094.09px / 65.12%* | 1276.80px / 76.00% | 833.31px / 49.60%* | 972.47px / 57.89% | 677.53px / 40.33% |
| 1920 | 1094.09px / 56.98% | 1459.20px / 76.00% | 833.31px / 43.40% | 1111.39px / 57.88% | 778.61px / 40.55% |
| 2048 | 1094.09px / 53.42% | 1556.48px / 76.00% | 833.31px / 40.69% | 1185.49px / 57.89% | 832.51px / 40.65% |

`*` The 1680 before value is derived from the measured fixed 1094.09px stage/envelope geometry; the other before and every after value are direct application-browser measurements.

## Crop and containment

- 1440 stage bounds: y=25.89–846.11, effectively identical to the former y=26–846.
- 1680: y=-42.46–914.46; top row and lower operators crop inside the Hero.
- 1920: y=-110.82–982.82.
- 2048: y=-147.27–1019.27.
- In every case the Hero remains y=26–846 with `overflow: hidden`; no card is visible in the role-assets section below.
- The visible wall begins between 40.03% and 40.65% of the viewport. Visual review confirms the earliest cards at title height stay to the right of the actual glyphs, while darker lower cards may sit behind the supporting-copy field without reducing legibility.

## Frozen mobile

390×844 remains stage x=-70/y=398, 560×420, twelve card nodes, six visible cards, `transform: none`, and document/client width 390/390.
