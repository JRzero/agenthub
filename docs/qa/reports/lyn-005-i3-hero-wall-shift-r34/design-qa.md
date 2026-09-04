# LYN-005-I3 R34 Hero wall shift and main-role swap QA

## 1. Fresh baseline audit

- Source evidence: `docs/qa/design-reference/lyn-005-i3-hero-wall-shift-r34/user-annotation.png`.
- Fresh R33 desktop capture: `before/desktop-1440x900-r33.png`. The 1152 × 863.40 stage started at x=277 and the main card at x=879.25, leaving the wall visually late on the right.
- Fresh R33 mobile capture: `before/mobile-390x844-r33.png`. The 540 × 404.72 stage started at x=-91 and the main card at x=207.37.
- Finding: P1 wall alignment and P1 requested main-role mismatch. No unrelated Hero or downstream issue was found in scope.

## 2. Implementation

- Desktop stage right inset changed from `0` to `5vw`, resolving to 72px at 1440px. The complete wall moved left as one object: stage x 277 → 205 and main x 879.25 → 807.25. All twelve slot percentages and the R33 three-track geometry remain unchanged.
- Mobile stage right inset changed from `-70px` to `-44px`, a deliberate 26px left shift. The main card moved x 207.37 → 181.37 without moving the copy, CTA or proof block.
- `main` now consumes `hero-silver-world-guardian-r32.webp` at equal-axis `scale(.92) translate(0, 2%)`. Hair, pointed ears, shoulders, gloves and chest ornament remain visible with a dark top buffer.
- `bottom-fantasy` now consumes `hero-main-r32.webp` at equal-axis `scale(1.12) translate(0, 3%)`. The prior main role remains recognizable in the partially bled supporting slot.
- No image was generated, deleted or duplicated. The twelve Hero sources remain unique and each appears once.

## 3. Visual comparison

- Desktop source / R33 / R34: `docs/qa/images/lyn-005-i3-hero-wall-shift-r34/comparison/source-before-after-desktop.png`.
- Main-card focus before / after: `docs/qa/images/lyn-005-i3-hero-wall-shift-r34/comparison/main-card-before-after.png`.
- Mobile before / after: `docs/qa/images/lyn-005-i3-hero-wall-shift-r34/comparison/mobile-before-after.png`.
- Result: the wall enters earlier, the silver guardian is the clear center, the left title remains readable against the existing black safety fade, and desktop/mobile retain the same card geometry and bleed rhythm. P0/P1/P2 = 0/0/0.

## 4. Runtime and accessibility checks

- Desktop: 12/12 role images loaded; mobile: 7/7 visible role images loaded.
- Horizontal overflow: 0 at 1440 × 900 and 390 × 844.
- Browser console errors: 0; no Next.js error dialog.
- CTA href remains `/login?next=%2Fassets%2Fcreate`; navigation and downstream page content are unchanged.
- Composed subject matrices remain equal-axis and orthogonal: desktop maximum axis delta `2.98e-14`, maximum absolute dot `3.19e-7`; mobile `2.22e-15` / `8.17e-8`.

## 5. Evidence limits

- This QA verifies the requested local frontend composition and existing repository assets. It does not assert any production deployment or external asset licensing change.

final result: passed
