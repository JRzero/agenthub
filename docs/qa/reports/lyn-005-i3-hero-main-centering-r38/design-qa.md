# LYN-005-I3 R38 Design QA

## Comparison inputs

- Desktop before/after: `docs/qa/images/lyn-005-i3-hero-main-centering-r38/comparison/desktop-before-after.png`.
- Desktop main-card focus: `docs/qa/images/lyn-005-i3-hero-main-centering-r38/comparison/desktop-main-focus-before-after.png`.
- Mobile before/after: `docs/qa/images/lyn-005-i3-hero-main-centering-r38/comparison/mobile-before-after.png`.

## Visual review

1. Optical centering — passed. The face and upper torso move left into the card's visual center; the source portrait no longer retains the login-layout right bias.
2. Subject integrity — passed. Hair, chin and shoulder contours remain complete. The exposed right field is the source's natural black background and joins the frame cleanly.
3. Geometry freeze — passed. The stage and all twelve card bounding rectangles are identical before and after on desktop and mobile.
4. Transform safety — passed. The subject retains equal-axis `.99` scale with translation only; the counter-skew composition remains orthogonal.
5. Responsive safety — passed. The shared `-8%` offset works at 1440×900 and 390×844 without a mobile override, horizontal overflow or image-load failure.

## Findings

- P0: 0
- P1: 0
- P2: 0
- P3: 0

final result: passed
