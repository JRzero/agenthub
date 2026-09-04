# LYN-005-I3 R4 Scoped Typography Design QA

## Comparison target

- Source visual truth: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/agenthub-management-reference-desktop-final.png` (1440 × 1024 px) and `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/agenthub-management-reference-mobile.png` (390 × 844 px).
- Exact pre-change browser evidence: `docs/qa/images/lyn-005-i3-typography-r4/before/01-home-desktop-full.jpg`, `02-home-mobile-full.jpg`, `03-hero-desktop.jpg`, and `04-hero-mobile.jpg`.
- Final browser implementation: `docs/qa/images/lyn-005-i3-typography-r4/after/01-home-desktop-full.jpg`, `02-home-mobile-full.jpg`, and focused captures `03` through `11`.
- Viewports: 1440 × 1000 and 390 × 844 CSS/output px at DPR 1. The desktop source was top-cropped to 1440 × 1000; the mobile source already matched 390 × 844. Before and after browser captures use identical CSS and output pixels.
- State: public homepage default Hero; focused role-assets, sticky flow, intent, and footer states were captured separately so small Chinese copy and control baselines remain legible.

## Same-canvas evidence

- Source versus final Hero: `after/compare-reference-after-hero-desktop.jpg` and `after/compare-reference-after-hero-mobile.jpg`.
- Exact implementation before versus after: `after/compare-before-after-hero-desktop.jpg` and `after/compare-before-after-hero-mobile.jpg`.
- Focused implementation evidence: `after/04-assets-desktop.jpg`, `05-flow-desktop.jpg`, `06-intent-footer-desktop.jpg`, `08-assets-mobile.jpg`, `09-flow-mobile.jpg`, `10-intent-footer-mobile.jpg`, and `11-footer-mobile.jpg`.

## Findings and comparison history

- [P2 fixed] The previous landing root began with Arial and used no explicit body/display distinction. The final landing root uses local-only `--font-body` and `--font-display` stacks, with body copy falling through SF Pro Text/PingFang-compatible faces and marketing display text through SF Pro Display/PingFang-compatible faces.
- [P2 fixed] Hero and section headings previously used weight 900 with `-.065em` to `-.075em` tracking. The final Hero uses 800 / `-.052em` / `.96` on desktop and 800 / `-.04em` / `.98` on mobile; section headings use 800 with `-.045em` desktop and `-.035em` mobile tracking.
- [P2 fixed] Supporting copy was optically tight and inconsistent with the reference rhythm. Final body descriptions use 400–450 visual weights and 1.72–1.75 leading; navigation and buttons use 600–700; role and product titles use 720 with less aggressive tracking.
- Post-fix evidence preserves the approved two-line Hero, role-card title fit, five-stage navigation alignment, input/button baselines, footer wrapping, and document widths of 1440/1440 and 390/390.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

## Required fidelity surfaces

- Fonts and typography: passed. Display/body stacks, fallback order, weights, tracking, leading, antialiasing, hierarchy, wrapping, truncation, form copy, and compact English kicker spacing were inspected from rendered computed styles and focused screenshots. No remote font is loaded.
- Spacing and layout rhythm: passed. The existing Hero, role carousel, sticky stage, scenarios, intent, and footer geometry is unchanged; type reflow does not clip cards, change button height, or introduce document overflow.
- Colors and tokens: passed unchanged. Near-black, white/gray, and fluorescent lime tokens were not modified.
- Image quality and asset fidelity: passed unchanged. Existing raster atmosphere, roles, and scenarios retain their crop and sharpness; no new asset or code-drawn replacement was added.
- Copy and content: passed unchanged. Creator-first headline, truthful Demo boundaries, anchors, intent, and authentication continuation are unchanged.

## Browser and interaction checks

- 1440 × 1000 and 390 × 844: Chinese glyph weight, letter spacing, line height, line breaks, clipping, CTA baseline, role title, stage labels, textarea, suggestions, and footer inspected.
- Document/client widths: 1440/1440 and 390/390; horizontal overflow: none.
- Console errors: 0. The development-only React DevTools info and existing Next Image LCP warning are not console errors and do not affect typography behavior.
- Existing carousel, five-stage controls, anchors, intent form, authentication links, focus styling, and reduced-motion rules remain unchanged; focused landing tests cover their behavior.
- Typography scope was verified from the CSS Module root: no global font rule, authentication font change, workspace font change, dependency, or remote asset was introduced.

final result: passed
