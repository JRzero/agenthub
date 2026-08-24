# LYN-005-I2 Design QA

## Comparison target

- Source visual truth: `docs/qa/images/lyn-005-i2/reference-feedback-1644x1322.png`
- Desktop implementation: `docs/qa/images/lyn-005-i2/desktop-hero-visible-1633x1121.png`
- Mobile implementation: `docs/qa/images/lyn-005-i2/mobile-hero-390x844.png`
- Full-view comparison: `docs/qa/images/lyn-005-i2/comparison-reference-vs-implementation-1644x1322.png` (source left, implementation right)
- Focused CTA comparison: `docs/qa/images/lyn-005-i2/comparison-hero-cta-focused.png` (source left, implementation right)
- Route and state: public `/`, top-of-page Hero, default state, no dialog or hover state.

## Viewport and normalization

| Evidence | CSS viewport / content width | Source pixels | Implementation pixels | Normalization |
| --- | --- | --- | --- | --- |
| Desktop | Browser override `1644 × 1322`; page client width `1633` after the vertical scrollbar | `1644 × 1322` | visible capture `1633 × 1121` | The implementation capture was placed at 1:1 in a `1644 × 1322` canvas with right/bottom padding only; no scaling or density interpolation. |
| Mobile | Browser override `401 × 844`; page client width exactly `390` after the vertical scrollbar | n/a | `390 × 844` | The top `390 × 844` CSS-pixel viewport was cropped from the browser-rendered full capture without scaling. |

Browser-reported `devicePixelRatio` was `1` for the final desktop and mobile captures. The source is a user-supplied annotated screenshot; the red rectangle is feedback markup, not production UI.

## Findings

No actionable P0, P1, or P2 findings remain within LYN-005-I2 scope.

- The entire Hero note “先整理创作意图，生成与保存前需登录并完成邀请码验证。” is absent from rendered desktop and mobile text.
- The focused comparison shows that the CTA is followed by uninterrupted Hero background rather than a residual line box or reserved `heroNote` gap.
- Desktop and mobile both reported `scrollWidth === clientWidth`; no horizontal overflow was present.
- At 390 px, the CTA, Hero image, capability chips, and following section remain visible without overlap or clipping.
- Differences in overall Hero scale and section depth between the annotated feedback screenshot and the current approved public-site baseline predate this scoped deletion. The task explicitly preserves the title, lead, CTA, imagery, and all other copy, so they are not treated as repair candidates here.

## Required fidelity surfaces

- Fonts and typography: title, lead, CTA typography, wrapping, weights, and line heights remain unchanged. Only the requested note text was removed.
- Spacing and layout rhythm: the CTA retains its original position and dimensions (`194 × 54` desktop, `170 × 48` mobile). The removed note leaves clean background space; no empty element or `heroNote` CSS remains.
- Colors and visual tokens: background, coral CTA, text colors, borders, and section tokens remain unchanged.
- Image quality and asset fidelity: the existing Hero asset, crop, sharpness, and capability imagery remain unchanged.
- Copy and content: only the requested Hero sentence is removed. The main title, introduction, CTA, other public-site copy, and bottom creation-intent authentication disclosure remain present.

## Interaction and runtime checks

- Hero CTA scrolled to the `#create` intent section at desktop/mobile responsive layout.
- Submitting the non-sensitive QA intent exposed the existing login and invitation-registration links:
  - `/login?next=%2Fassets%2Fcreate`
  - `/register?next=%2Fassets%2Fcreate`
- The active browser already had a local authenticated session, so “登录后开始创建” continued through to `/assets/create`, confirming the creation entry remained reachable.
- Console errors on the public route: none.

## Comparison history

### Pass 1 — final

- Earlier target finding: the annotated source called for removal of the full note beneath the Hero CTA.
- Fix applied: removed the note element, desktop style, mobile override, and added a regression assertion.
- Post-fix evidence: both the full-view and focused comparisons show the note absent; desktop and mobile DOM checks return `targetTextPresent: false`; no P0/P1/P2 issue remains.

## Follow-up polish

None for this scoped change.

final result: passed
