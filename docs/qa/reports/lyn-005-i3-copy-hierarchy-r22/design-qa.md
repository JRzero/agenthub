# LYN-005-I3 R22 Design QA

Date: 2026-08-31
Surface: `PublicLandingPage` only
Viewports: 1465×802 desktop and 390×844 mobile

## Visual truth and method

The supplied DOCX was rendered as three pages and its seven embedded screenshots were separately extracted and inspected. The repository keeps those review references in `docs/qa/design-reference/lyn-005-i3-copy-hierarchy-r22/`. Fresh before and after captures were made in the in-app browser; the matching section crops were placed with the document annotations and with their before states on the same comparison canvases.

## Product decision

The annotated intent copy proposed a search-and-management message, but the existing control is a real creation-intent organizer. To avoid promising a search capability that the control does not provide, the implementation uses the approved truthful mapping: “快速创建、测试与管理 Agent，让每一个角色的运营更简单。” The placeholder, validation, submit result, login/invitation continuation, and `/assets/create` boundary are unchanged.

## Comparison history

1. **Pass 1 / fresh before:** P1 flow meaning was too poetic; P1 scenario value text was clipped by `nowrap + ellipsis`; P1 intent title did not set a concrete expectation; P2 square chips lacked an explicit focus-visible contract.
2. **Pass 2:** exact approved lifecycle copy, complete scenario values, removed tags/ellipsis, two-line desktop intent title, and 11px chips cleared the structural findings. A P2 brand-hierarchy difference remained because the flow outcome no longer carried the established lime emphasis.
3. **Pass 3 / final:** the second flow line uses the existing lime emphasis token while preserving the new wording. Desktop and mobile full views and focused comparisons show coherent hierarchy, complete text, unchanged cinematic imagery, and no section collision.

## Final visual and behavior checks

- Flow title: 60px / 61.8px on desktop, two semantic lines; mobile reflows without clipping. Five stage controls and the sticky product stage remain operational.
- Scenario title: 28px / 34.16px on desktop. All three values are visible with `white-space: normal`, `overflow: visible`, and no ellipsis.
- Intent title: 58px / 68.44px on desktop, two lines; the two semantic spans reflow to four readable lines at 390px. The form and Footer do not overlap.
- Suggestion chips: 11px radius, explicit 2px lime focus outline with 2px offset; click-to-fill and submission/return behavior passed.
- Desktop document: client/scroll width 1454/1454; mobile 379/379. Horizontal overflow is zero at both viewports.
- Fresh final root loads report title `AgentHub｜让一个想法，长成一个 Agent` and zero console errors or warnings.
- Reduced-motion behavior is covered by the unchanged `prefers-reduced-motion` rules and existing tests; the selected in-app browser does not expose runtime media emulation, so that point is a contract-level rather than visual-runtime observation.

## Evidence

- Before: `docs/qa/images/lyn-005-i3-copy-hierarchy-r22/before/`
- After: `docs/qa/images/lyn-005-i3-copy-hierarchy-r22/after/`
- Full and focused comparison canvases: `docs/qa/images/lyn-005-i3-copy-hierarchy-r22/comparison/`
- Fresh audit: `docs/qa/reports/lyn-005-i3-copy-hierarchy-r22/audit-before.md`

## Findings

- P0: 0
- P1: 0
- P2: 0
- P3: 0 newly introduced; no deferred visible issue in scope

final result: passed
