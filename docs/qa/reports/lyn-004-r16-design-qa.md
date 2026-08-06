# LYN-004-R16 Design QA

## Final implementation

- Reused the existing R15 info treatment: `border-info`, `--color-status-info-bg`, and `--color-status-info-text`.
- Computed result: foreground `rgb(143, 192, 255)`, background `rgb(13, 23, 34)`, border `rgb(101, 167, 255)`.
- Text contrast: 9.59:1, exceeding the 4.5:1 ordinary-text target.
- Semantic boundary contrast against the surrounding `#0f1113` surface: 7.68:1, exceeding the 3:1 target.
- Geometry remained 647.63 × 42px in the default desktop Browser viewport; radius, 1px border, `px-4`, `py-2.5`, 14px type, and copy are unchanged.

## Browser evidence

- Desktop before: `docs/qa/images/lyn-004-r16/04-before-visible-default.png`.
- Desktop after: `docs/qa/images/lyn-004-r16/05-after-visible-default.png`.
- Narrow after, 720 × 900 CSS px: `docs/qa/images/lyn-004-r16/06-after-narrow-720x900.png`.
- Full-page after: `docs/qa/images/lyn-004-r16/09-after-full-default.png`.
- User feedback + after comparison: `docs/qa/images/lyn-004-r16/07-feedback-after-comparison.png`.
- Before + after focused comparison: `docs/qa/images/lyn-004-r16/08-before-after-focus-comparison.png`.

At 720 × 900, the notice measured 619 × 42px and `scrollWidth = clientWidth = 709`; there was no horizontal overflow, clipping, or unintended wrapping. “查看版本内容” toggled to “收起版本内容”, and both Version Hash copy controls remained reachable. No export or publish action was executed.

The visual evidence was captured in the repository's isolated Demo mode because the unchanged local Live backend currently returns HTTP 404 for `/assets` data. The R16 production frontend is nevertheless running in Live mode at port 3002, contains no “演示数据” marker, and its fresh Browser console has 0 errors and 0 warnings. No Live fallback or fixture mixing was introduced.

## Design QA result

- Initial: P0 = 0, P1 = 1, P2 = 0.
- Post-fix: P0 = 0, P1 = 0, P2 = 0.
- The notice now matches the dark Version detail hierarchy while retaining its information semantics and lower visual weight than actions.

final result: passed
