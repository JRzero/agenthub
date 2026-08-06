# LYN-004-R17 Design QA

## Scope and fix

- Scope is limited to confirmed light-theme semantic residues on the Agent memory page.
- The partial/stale status notice now uses the existing dark warning surface: `--color-status-warning-bg`, `border-warning`, and `--color-status-warning-text`.
- Relationship, emotion, activity, and unavailable channel surfaces keep their established indigo/cyan/amber/slate meanings while using 10% dark tints, high-contrast foregrounds, and explicit inset semantic rings.
- No shared component, global token, layout, copy, API, data, or operation logic changed.

## Contrast evidence

| Surface | Text/icon contrast | Boundary contrast |
| --- | ---: | ---: |
| Warning | 11.03:1 | 10.61:1 |
| Relationship / indigo | 8.41:1 | 6.34:1 |
| Emotion / cyan | 11.07:1 | 10.47:1 |
| Activity / amber | 10.98:1 | 11.33:1 |
| Unavailable / slate | 11.64:1 | 3.98:1 |

All ordinary foregrounds exceed 4.5:1 and all semantic boundaries exceed 3:1.

## Browser evidence

- Partial before: `docs/qa/images/lyn-004-r17/03-before-partial-visible-default.png`.
- Partial after: `docs/qa/images/lyn-004-r17/04-after-partial-visible-default.png`.
- No-sample before: `docs/qa/images/lyn-004-r17/02-before-empty-visible-default.png`.
- No-sample after: `docs/qa/images/lyn-004-r17/05-after-empty-visible-default.png`.
- Narrow partial after, 720 × 900 CSS px: `docs/qa/images/lyn-004-r17/06-after-partial-narrow-720x900.png`.
- Full same-state comparison: `docs/qa/images/lyn-004-r17/07-before-after-partial-comparison.png`.
- Focused same-state comparison: `docs/qa/images/lyn-004-r17/08-before-after-focus-comparison.png`.

The feedback notice remains 1133 × 51px at the default desktop viewport and 661 × 51px at 720px. At 720px, `scrollWidth = clientWidth = 709`; no clipping, extra wrapping, or horizontal overflow was introduced. The disclosure opened and closed, Agent navigation moved to Overview and back to Memory, and fresh Browser console output contained 0 errors and 0 warnings. Refresh, reset, delete, save, publish, and export actions were not invoked.

## Evidence boundary

Visual QA used the isolated Demo because the unchanged Live backend currently returns HTTP 404 for `/assets`. Live mode remains free of fixture fallback. The page-owned error-panel icon was not visually reproduced and was intentionally left unchanged rather than expanded into R17 by source inspection alone.

## Result

- Initial: P0 = 0, P1 = 1, P2 = 1.
- Post-fix: P0 = 0, P1 = 0, P2 = 0.

final result: passed
