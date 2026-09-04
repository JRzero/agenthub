# LYN-005-I3 R39 Fluorescent CTA State QA

## Comparison target

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-cta-hover-r39/user-hover-issue.png` (`272 × 168`, Retina 2× focus crop, normalized CSS region approximately `136 × 84`).
- Implementation route: `http://127.0.0.1:3002/#top`.
- Browser viewport: `1440 × 900` CSS px; in-app Browser screenshot content is `1429 × 893` px. Mobile regression viewport: `390 × 844`; screenshot content is `379 × 820` px.
- State: desktop default, `:hover`, keyboard-focus contract, and mobile default.
- Focus normalization: the 136×84 CSS region around the 94×40 login action was extracted from before/after captures and scaled to `272 × 168` so it can be compared at the source crop's Retina density.

## Findings

- [P1 resolved] Login-action label vanished on hover.
  - Location: `PublicLandingPage` header `.loginLink`.
  - Before evidence: `.nav a:hover, .loginLink:hover` assigned `var(--lime)` to the label while the button retained the same `var(--lime)` background. Browser-computed hover colors were `rgb(199, 255, 24)` on `rgb(199, 255, 24)`.
  - Fix: separate ordinary navigation hover from the filled login action, then explicitly keep `.loginLink:hover`, `.loginLink:focus-visible`, and `.loginLink:active` at `#070806`.
  - After evidence: browser-triggered hover keeps `rgb(7, 8, 6)` text on `rgb(199, 255, 24)` with an estimated 16.96:1 contrast ratio.
- [P2 prevented] Shared fluorescent CTA labels could be vulnerable to a future link-color cascade.
  - Location: `.heroCta` and `.primaryButton`.
  - Fix: their hover/focus-visible/active states explicitly retain `#050604`; the existing hover background and translate motion remain unchanged.
  - Browser evidence: Hero hover computes to `rgb(5, 6, 4)` on `rgb(219, 255, 101)`, approximately 17.89:1, and preserves `/login?next=%2Fassets%2Fcreate`.

## Required fidelity surfaces

- Fonts and typography: unchanged family, 12px/600 header label, 14px/700 Hero CTA, wrapping, baseline, and antialiasing.
- Spacing and layout rhythm: unchanged 94×40 login geometry, 148×52 Hero CTA geometry, 9px radii, header position, Hero composition, and downstream layout.
- Colors and visual tokens: default fluorescent surfaces remain `#c7ff18`; Hero hover remains `#dbff65`; filled-action text is explicitly dark in default, hover, focus-visible, and active states. Ordinary navigation still turns lime on hover.
- Image quality and asset fidelity: all Hero raster assets, crop, stacking, transforms, and brightness remain unchanged.
- Copy and content: `登录平台`, `进入工作台`, navigation labels, and every destination remain unchanged.

## Browser and interaction evidence

- Login default: `#070806` on `#c7ff18`; `94 × 40`; href `/login?next=%2Fassets%2Fcreate`.
- Login hover: actual pointer hover matched; `#070806` on `#c7ff18`; label remains visible.
- Hero hover: actual pointer hover matched; `#050604` on `#dbff65`; unchanged href.
- Focus/active: component-level CSS contract locks the same dark foreground while the existing global `2px solid var(--lime)` focus-visible outline remains intact. Focus behavior is covered by the targeted stylesheet test.
- Overflow: document `scrollWidth 1429 ≤ innerWidth 1440` desktop and `379 ≤ 390` mobile.
- Console: 0 errors. One pre-existing Next.js development-only LCP priority warning appeared after reload; no runtime error or failed resource was observed.

## Comparison history

- Pass 0: source and fresh before capture reproduce the P1 blank fluorescent button. The full-view capture confirms no layout defect accompanies it.
- Pass 1: after separating the cascade and adding filled-action state tokens, the same pointer-hover crop shows the complete dark label. Full-view before/after confirms the page geometry is unchanged. P0/P1/P2 = 0/0/0.

## Evidence

- Source / before / after hover board, left to right: `docs/qa/images/lyn-005-i3-cta-hover-r39/comparison/source-before-after-hover.png`.
- Full-view before / after board: `docs/qa/images/lyn-005-i3-cta-hover-r39/comparison/before-after-full.png`.
- Fresh before: `docs/qa/images/lyn-005-i3-cta-hover-r39/before/`.
- Final desktop/mobile: `docs/qa/images/lyn-005-i3-cta-hover-r39/after/`.

final result: passed
