# LYN-005-I3 R7 Hero Bottom Cleanup Design QA

## Comparison target

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-hero-cleanup-r7/user-annotation-desktop.png` (2422 × 1062 px). Its red frame marks the Hero-only four-stage prompt rail plus the lower overlapping portrait cards for deletion.
- Rendered implementation: `docs/qa/images/lyn-005-i3-hero-cleanup-r7/after/desktop-hero-1440x1000.jpg` (1440 × 1000 px) and `after/mobile-hero-390x844.jpg` (390 × 844 px), DPR 1.
- State: public homepage top, default Hero. The later role carousel and formal five-stage product flow are outside the deletion scope.
- Full-view comparisons: `comparison/desktop-before-after-1440x1000.jpg` and `comparison/mobile-before-after-390x844.jpg`.
- Focused source/implementation comparison: `comparison/annotation-vs-final-hero-focus.jpg`. The source annotation was normalized to a 1440 × 632 panel and paired with the same-width implementation Hero crop.

## Findings and comparison history

1. [P1 fixed] The Hero duplicated four creation stages that already exist as the complete interactive five-stage `#product` flow. The `heroTrail` wrapper, four anchor children, accessible ledger label, and all desktop/mobile trail rules were removed from DOM/CSS.
2. [P1 fixed] Two lower portrait cards visually depended on that bottom ledger and occupied the user-marked area. Their `heroPortraitLower` and `heroPortraitFar` nodes and responsive rules were removed; the Hero now retains the primary right portrait with two restrained upper supporting portraits.
3. [P2 fixed] Removing those nodes initially would have left the prior 948/844 px Hero with an empty lower band. Desktop height is now 820 px at 1440 × 1000 (`max(780px, calc(100vh - 180px))`), copy starts 32 px earlier, and mobile is 760 px with the remaining portrait group lifted 10 px and reduced to a 330 px stage.
4. Post-fix combined review found no actionable P0/P1/P2. Title, supporting copy, CTA, and right imagery remain balanced; the next role-assets section begins within the viewport transition instead of leaving an unused lower screen.

## Required fidelity surfaces

- Fonts and typography: passed unchanged. Hero display/body stacks, title wrap, body leading, navigation, and CTA baselines remain intact at both viewports.
- Spacing and layout rhythm: passed. Desktop Hero reduced from 948 to 820 px and mobile from 844 to 760 px; the remaining visual group and text align without a new empty band.
- Colors and tokens: passed unchanged. Near-black, white, muted gray, and fluorescent lime tokens remain scoped to the landing page.
- Image quality and assets: passed. Only existing raster portrait nodes were removed; the retained imagery keeps the original crop and sharpness. No CSS/SVG/placeholder asset was introduced.
- Copy and content: passed. Hero retains the creator-first title, supporting copy, and single `开始创建` CTA. The formal five-stage flow still renders all five truthful stages and remains interactive.
- Interaction and accessibility: passed. Header anchors and CTA keep their original href/scroll behavior; the five-stage navigation retains five semantic buttons and `aria-current` state. Removed links leave no unreachable or duplicate focus stops.

## Browser evidence

- Desktop 1440 × 1000: Hero 820 px, 3 portrait images in the retained visual group, no `heroTrail`, no horizontal overflow.
- Mobile 390 × 844: Hero 760 px, retained portrait stage 430 × 330 at y=410, no trail or lower cards, no horizontal overflow.
- `#product [aria-label="五步创作流程"]` still contains five buttons. Selecting `知识与技能` set `aria-current="step"` and updated the product panel to `把真实能力接进来`.
- Header navigation and `开始创建` (`href="#create"`) still scroll to their real sections.
- Browser console errors: 0.

## Final findings

- P0: 0
- P1: 0
- P2: 0
- P3: 0

final result: passed
