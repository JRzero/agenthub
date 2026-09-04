# LYN-005-I3 R16 Creation-intent Cleanup Design QA

## Evidence

- Before: `docs/qa/images/lyn-005-i3-intent-cleanup-r16/before/desktop-1440x1000.png`, `mobile-390x844.png`
- After: `docs/qa/images/lyn-005-i3-intent-cleanup-r16/after/desktop-1440x1000.png`, `mobile-390x844.png`
- Same-canvas: `docs/qa/images/lyn-005-i3-intent-cleanup-r16/comparison/before-vs-after-desktop.png`, `before-vs-after-mobile.png`, `intent-focus-desktop.png`
- Measurements: `docs/qa/reports/lyn-005-i3-intent-cleanup-r16/visual-measurement.md`

## Five fidelity surfaces

1. **Geometry:** passed. Desktop title→input is 54px, input→suggestions 26px, and suggestions→section bottom 42px. Mobile equivalents are 48px, 26px, and 48.664px.
2. **Typography:** passed unchanged. Desktop title remains 57.6/67.968px and mobile remains 38/45.6px with the existing explicit line groups.
3. **Color/material:** passed unchanged. The near-black field, lime action, low-contrast input, and flat Footer transition are unchanged.
4. **Responsive behavior:** passed. Exact 1440×1000 and 390×844 captures show no clipping, overlap, empty metadata row, or horizontal overflow.
5. **Content and interaction:** passed. The initial subtitle and complete counter/privacy row are absent from DOM; suggestions, textarea validation, 240-character limit, submit action, session-only result, and login/invitation continuation remain functional.

## Iteration history

- Baseline P2: redundant supporting copy and metadata lengthened the close and diluted the primary action.
- Fix: removed both nodes and their CSS, reduced the section container, and preserved a 26px suggestion handoff plus a 42–49px close.
- Final P0/P1/P2: 0 / 0 / 0.

## Browser and accessibility checks

- DOM snapshot contains neither removed sentence, privacy sentence, nor character counter.
- Suggestion selection populated the intent, submission produced the session-only summary, and both `/login?next=%2Fassets%2Fcreate` and `/register?next=%2Fassets%2Fcreate` remained present.
- Required textarea and `maxlength="240"` remain intact.
- Final application-browser console errors: 0.
- Keyboard/focus and reduced-motion contracts remain covered by the landing tests; no motion behavior changed in R16.

final result: passed
