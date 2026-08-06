## 1. Baseline and inventory

- [x] 1.1 Capture the R5/test Live pre-change state at matching desktop and focused label viewports without reading credentials or mutating external data
- [x] 1.2 Create the global label inventory covering shared components, tokens, inline styles, route semantics, exclusions, and migration targets

## 2. Theme implementation

- [x] 2.1 Define dark ghost tokens and shared CSS for success, warning, info, danger, and neutral variants with compatibility aliases
- [x] 2.2 Migrate every in-scope inline or ad hoc label style to one of the five semantic variants without changing business state, copy, icons, logic, or layout
- [x] 2.3 Confirm buttons, Tabs, filters, selectors, inputs, segmented controls, notifications, Toasts, Tooltips, and progress indicators retain their existing styling

## 3. Automated verification

- [x] 3.1 Add tests for semantic mappings, five variant contrast ratios, and the light solid label fill prohibition
- [x] 3.2 Add source-level inventory coverage and representative non-label isolation assertions

## 4. Browser and design QA

- [x] 4.1 Verify all real workspace and Agent Asset routes plus relevant empty/loading/error label states in local Live
- [x] 4.2 Capture matching desktop evidence and verify inherited paint-only 1280px and 720px/200% geometry, including image overlay, dense list/table, detail title bar, long copy, and five semantic mappings
- [x] 4.3 Run iterative combined-image Design QA, fix all P0/P1/P2 findings, and finish project-root design-qa.md with final result passed and a fresh-console zero error/warning result

## 5. Gates and handoff

- [x] 5.1 Run lint, typecheck, full tests, build, OpenSpec strict validation, and git diff check
- [x] 5.2 Update inventory and completion report with counts, route coverage, mappings, contrast, screenshots, Live URL, risks, and rollback
- [x] 5.3 Keep R6 local Live available, create a local commit, and record the final commit and tree without push, PR, deployment, or publication
