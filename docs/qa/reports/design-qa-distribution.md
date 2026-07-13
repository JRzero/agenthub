# AgentHub Distribution Design QA

## Evidence

- Source visual truth: `../design-reference/06-distribution.png`
- Browser-rendered implementation: `../images/qa-distribution-viewport.png`
- Full-view comparison input: `../images/qa-distribution-comparison.png`
- Focused comparison input: `../images/qa-distribution-focused.png`
- Route: `http://localhost:3002/assets/32/distribution`
- Viewport: 1280 x 720 CSS pixels, DPR 2, light theme
- State: demo workspace `星海内容工作室`, Agent `林月`, initial distribution state
- Browser: Codex in-app browser

The source was normalized to the same 1280 x 720 top viewport crop and placed next to the browser screenshot in one comparison input before judgment.

## Findings

No actionable P0, P1, or P2 differences remain.

- Information architecture: passed with an intentional product constraint. The source is a standalone release page, while the implementation keeps the approved two-level `工作空间 + Agent Asset 工作区` header and scoped lifecycle tabs. The release title, primary actions, four-client table, governance controls, warning, and version actions retain the source order and hierarchy.
- Fonts and typography: passed. The implementation uses the project Chinese system stack, with slightly stronger Agent and section headings to remain consistent with the existing Agent Asset shell. Table weights, line height, truncation, and status hierarchy remain readable.
- Spacing and layout rhythm: passed after one P2 iteration. Rows, dividers, action grouping, white surfaces, and section spacing closely match the source. At widths below 1400, governance intentionally moves below the table so all persistent controls remain visible without horizontal overflow; at wider desktop widths it returns to the source-like right rail.
- Colors and visual tokens: passed. Primary violet, success green, warning orange, neutral borders, light canvas, and low-elevation surfaces map to existing project tokens and the source design.
- Image quality and asset fidelity: passed. The source design raster is preserved in-project. The implementation reuses the project AgentHub logo and existing 林月 raster avatar; application endpoints use the installed Phosphor icon family rather than custom SVG or CSS drawings.
- Copy and content: passed. Source labels and governance copy are preserved semantically. Version `3.0` comes from the current Agent fixture instead of copying the source's design-only `3.2.0` value. Public sharing is identified explicitly, and unavailable package capabilities are not presented as production facts.
- Icons and affordances: passed. All primary actions, endpoint icons, overflow menus, governance rows, warning, rollback, and pause actions use one consistent icon family and semantic button states.
- Accessibility: passed for this slice. Interactive elements are semantic buttons/links, modal headings are labelled, the dialog is modal, status feedback uses `role=status`, focus outlines come from shared tokens, and disabled live-only actions retain explanatory copy.

## Focused Region Comparison

`../images/qa-distribution-focused.png` compares the table region directly. Column order, row density, compatibility dots, publication badges, recent release metadata, endpoint actions, dividers, and icon/color semantics align with the source. No additional focused crop was needed because every dense table field is readable in this comparison.

## Primary Interactions Tested

- Generate and preview a Public Agent Card; verified the output contains 林月 and does not contain `system_prompt`.
- Open the export sheet; Public Agent Card is downloadable while Persona, Runtime, and License packages remain explicitly unavailable.
- Configure Brand Private in demo mode and observe compatibility/publication state updates without persistence.
- Open license and memory-boundary governance explanations.
- Pause and restore demo distribution.
- Trigger Web Chat copy feedback without blocking the UI on browser clipboard permission.
- Publish the current demo version and receive success feedback.
- Navigate from rollback to `/assets/32/versions`.
- Reload after a clean server restart; browser console errors and warnings: none.

## Comparison History

1. P2 responsive layout: the first 1280-wide capture placed the 310 px governance rail beside a table whose columns required more width, creating horizontal overflow and clipped persistent content. Fixed by moving the two-column breakpoint to 1400 px and stacking governance below the table at narrower widths. Post-fix evidence: `../images/qa-distribution-viewport.png` and `../images/qa-distribution-comparison.png` show no page-level horizontal overflow.

## Follow-up Polish

- P3: capture an additional 1440+ desktop screenshot when the in-app browser exposes a resizable viewport, to archive the wide right-rail state directly. The current responsive behavior and source-like wide breakpoint are already implemented.

final result: passed
