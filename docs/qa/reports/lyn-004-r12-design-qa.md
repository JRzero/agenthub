# LYN-004-R12 Design QA

Date: 2026-08-06

Route/state: `/assets`, card view, dark theme, loaded Demo fixture for deterministic geometry; authenticated Live shell and production CSS checked separately.

## Comparison target

- Design truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/25-agent-library-four-column-feedback.png` (2254×1590 px).
- User Live feedback: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-ab3f65b1-028d-4eb7-9d44-f185b23db90f.png` (2048×1024 px).
- Before implementation: `docs/qa/images/lyn-004-r12/01-before-assets-1440.png` (1440×1000 px; 1440×1000 CSS px, DPR 1).
- After implementation: `docs/qa/images/lyn-004-r12/03-after-assets-1440.png` (1440×1000 px; 1440×1000 CSS px, DPR 1).
- Same-viewport comparison: `docs/qa/images/lyn-004-r12/compare-before-after-1440.png`.
- Focused grid comparison: `docs/qa/images/lyn-004-r12/compare-grid-focus-1440.png`.
- Design/after comparison: `docs/qa/images/lyn-004-r12/compare-design-after.png`; both panels normalized to 1000px height without changing their aspect ratios.
- User-feedback/after comparison: `docs/qa/images/lyn-004-r12/compare-user-after.png`; both panels normalized to 1000px height without changing their aspect ratios.

## Findings

- P0: 0
- P1: 0
- P2: 0
- P3: 0 introduced by R12.

The initial P1 was the 1440px desktop three-column layout. Moving only the four-column media threshold from 1536px to 1440px resolves it. The 1440px content grid is 1184px wide and now computes four 284px tracks with 16px gaps, 420px card height, no overlap, and no overflow.

## Required fidelity surfaces

- **Fonts and typography:** unchanged from R10/R11. At the narrowest four-column state, names remain single-line truncated, descriptions remain two-line clamped, and 12px metadata remains readable without reduction.
- **Spacing and layout rhythm:** page shell, 16px grid gap, 420px card height, 92px metadata footer, image area, padding, radii, and borders are unchanged. Only the four-column activation point changed.
- **Colors and tokens:** unchanged semantic canvas, surface, border, text, status, focus, and primary tokens.
- **Image quality and asset fidelity:** existing Agent artwork and the existing missing-image treatment are preserved. No image, generated asset, placeholder Agent, CSS art, or SVG was added.
- **Copy and content:** no product or dynamic copy changed. Demo screenshots contain only the repository's existing non-sensitive fixture; Live content was not copied or fabricated.
- **Icons and interactions:** Phosphor icons, card menu, whole-card link, search, status tabs/counts, sorting, view switch, and preference behavior are unchanged.

## Responsive measurements

| CSS viewport | Content/grid width | Columns | Card width | Gap | Card height | Page/grid overflow |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1920 | 1664px | 4 | 404px | 16px | 420px | none |
| 1680 | 1424px | 4 | 344px | 16px | 420px | none |
| 1536 | 1280px | 4 | 308px | 16px | 420px | none |
| 1440 | 1184px | 4 | 284px | 16px | 420px | none |
| 1280 | 1024px | 3 | 330.66px | 16px | 420px | none |
| 720 | 661px | 1 | 661px | 16px | 420px | none |

Screenshots: `after-assets-1920.png`, `after-assets-1680.png`, `after-assets-1536.png`, `after-assets-1440.png`, `after-assets-1280.png`, and `after-assets-720.png` under `docs/qa/images/lyn-004-r12/`.

## Interaction and runtime QA

- Search narrowed the existing fixture to one matching card; clear restored both cards.
- Draft status narrowed to one card; All restored the loaded collection.
- Sorting changed to `名称 A–Z`.
- List view and card view each became visible when selected.
- The card menu exposed `迁移工作空间` and `删除 Agent` without invoking either action.
- Whole-card activation navigated to `/assets/32/overview`; Back returned to `/assets`.
- Console: 0 page errors, 0 page warnings.
- Final Live production CSS at 1440 contains the active 1440 four-column utility and contains neither obsolete 1536 nor 1800 four-column utilities; the negative test strings are split so Tailwind does not compile them as false-positive candidates.
- Live boundary: authenticated R11 Live loaded the real shell and production CSS, but the existing `/assets` Agent request returned HTTP 404, so real-data grid geometry could not be captured in this run. No credentials or browser storage were inspected. The supplied user screenshot is retained as the real-data visual evidence.

## Comparison history

1. **Initial comparison — blocked.** P1: 1440 CSS px rendered three 384px cards because `min-[1536px]:grid-cols-4` did not match. Evidence: `01-before-assets-1440.png`, `compare-before-after-1440.png`, and `lyn-004-r12-current-audit.md`.
2. **Fix.** Changed only `/assets` from `min-[1536px]:grid-cols-4` to `min-[1440px]:grid-cols-4`; updated the focused source-contract test.
3. **Post-fix comparison — passed.** 1440 renders four 284px tracks; 1280 safely remains three columns; 720 remains one column. Fixed height, metadata, artwork, controls, navigation, and overflow all pass. Evidence: `03-after-assets-1440.png`, focused comparison, responsive screenshots, and the table above.

final result: passed
