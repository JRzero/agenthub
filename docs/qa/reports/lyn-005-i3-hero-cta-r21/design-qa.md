# LYN-005-I3 R21 Hero CTA / proof-rhythm design QA

## Comparison target

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-hero-cta-r21/user-annotation.png` (2930×1604 physical pixels, Retina 2×, normalized to 1465×802 CSS pixels).
- Desktop before: `docs/qa/images/lyn-005-i3-hero-cta-r21/before/desktop-1465x802.png`.
- Desktop implementation: `docs/qa/images/lyn-005-i3-hero-cta-r21/after/desktop-1465x802.png`.
- Mobile before / implementation: `docs/qa/images/lyn-005-i3-hero-cta-r21/before/mobile-390x844.png` and `docs/qa/images/lyn-005-i3-hero-cta-r21/after/mobile-390x844.png`.
- Full-view source comparison: `docs/qa/images/lyn-005-i3-hero-cta-r21/comparison/reference-vs-after.png`.
- Focused comparison: `docs/qa/images/lyn-005-i3-hero-cta-r21/comparison/desktop-cta-proof-focus.png`.
- Responsive comparison: `docs/qa/images/lyn-005-i3-hero-cta-r21/comparison/mobile-before-after.png`.
- State: anonymous public Hero at page top; desktop 1465×802 and mobile 390×844; implementation captures are 1× CSS density.

## Comparison history

1. Fresh baseline found one scoped P2: the desktop CTA rendered at 116×44 / 13px and the 24px CTA-to-status gap made the handoff/proof stack read denser than the user annotation. Mobile rendered at 112×46 / 12px with a 16px gap. No frozen-region mismatch or functional regression was found.
2. The CTA was enlarged without adding an icon, and only the CTA-to-status margin was increased. Fresh same-viewport captures show the proof group moving as one unit while title, lead, wall, Hero frame, and status-to-stats rhythm remain unchanged.
3. Post-fix comparison found P0 = 0, P1 = 0, P2 = 0.

## Measured result

| Viewport | CTA before | CTA after | font | CTA → status | status → stats |
| --- | --- | --- | --- | --- | --- |
| 1465×802 | 116×44 | 148×52 | 13px → 14px | 24px → 38px | 29px → 29px |
| 390×844 | 112×46 | 126×48 | 12px → 13px | 16px → 25px | 20px → 20px |

- Desktop proof bottom: 677.77px → 699.77px inside the unchanged 802px Hero.
- Mobile proof bottom: 470.61px → 481.61px inside the unchanged 844px Hero.
- Desktop frozen anchors remained exact: H1 `(145.03, 171, 540×234.02)`, lead `(145.03, 440.02, 390×50.95)`, wall `(0, 0, 1465×802)`.
- Mobile frozen anchors remained exact: H1 `(34, 108, 322×133.55)`, lead `(34, 263.55, 322×41.27)`, wall `(-90, 508, 600×450)`.
- Document widths equal viewport widths at both sizes: 1465/1465 and 390/390.

## Required fidelity surfaces

- Fonts and typography: only CTA font size changed to 14px desktop / 13px mobile; title, lead, status, and data typography are pixel-stable.
- Spacing and layout rhythm: the CTA grows to the requested compact emphasis; CTA-to-status increases by 14px desktop and 9px mobile; the internal proof gap is unchanged.
- Colors and tokens: lime surface, hover color, black field, border radius, and proof colors are unchanged.
- Image quality: all twelve independent Hero role cards, sources, crops, transforms, masks, and luminance remain unchanged.
- Copy/content: no text, metric boundary label, route, or accessible name changed; no icon or arrow was introduced.
- Accessibility and behavior: semantic link and `/login?next=%2Fassets%2Fcreate` remain unchanged; existing hover, `:focus-visible`, keyboard, and reduced-motion rules remain in force; mobile CTA remains a 48px tap target.

## Findings

- P0: 0.
- P1: 0.
- P2: 0.
- Residual P3: none in the annotated scope.

## Browser verification

- CTA destination: `/login?next=%2Fassets%2Fcreate` at both viewports.
- Console: desktop 0 errors / 0 warnings; mobile 0 errors / 0 warnings (React development info only).
- Horizontal overflow: 0 at both viewports.
- Frozen-region geometry: unchanged for title, lead, role wall, Hero frame, header, R20 role section, R19 intent, downstream sections, and footer.

final result: passed
