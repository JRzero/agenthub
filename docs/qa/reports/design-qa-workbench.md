# AgentHub Workbench Design QA

## Evidence

- Source visual truth: `../design-reference/01-workbench.png`
- Browser implementation: `../images/qa-workbench-viewport.png`
- Combined comparison input: `../images/qa-workbench-comparison.png`
- Route: `http://localhost:3002/workbench`
- Viewport: 1280 x 720 CSS pixels, DPR 2, light theme
- State: demo workspace `星海内容工作室`, initial fixture data
- Browser: Codex in-app browser

The source was normalized to the same top viewport and placed beside the browser screenshot before judgment.

## Findings

No actionable P0, P1, or P2 visual differences remain.

- Information architecture: passed. Workbench title/date, create action, continue-building card, pending tasks, recent assets, and performance region retain the source order and emphasis.
- Fonts and typography: passed. The project Chinese system stack preserves the source hierarchy, table readability, numeric emphasis, and compact labels.
- Spacing and layout rhythm: passed. The dashboard uses the same broad left workstream and narrower performance rail, with matching section gaps, dividers, button density, and low-elevation surfaces.
- Colors and tokens: passed. Primary violet, green readiness/status, warning/info accents, light canvas, and neutral borders use the established AgentHub tokens.
- Image quality: passed. Existing AgentHub and 林月 raster assets are reused; no image target was replaced with CSS art or custom SVG.
- Copy and content: passed with truthful data substitution. Continue-building selects the actual draft Agent, pending work is derived from current fields, and design-only metrics appear only with a demo badge. Live mode renders an unavailable analytics state.
- Icons and affordances: passed. Navigation, create, task, and link affordances use the existing Phosphor family with visible focus styles and semantic controls.
- Responsive behavior: passed at the available viewport; sections wrap without page-level horizontal overflow and primary actions remain reachable.

The full-view comparison is sufficiently legible for the card, task, asset, and metric regions, so a separate focused crop was not needed.

## Primary Interactions Tested

- Open and cancel the New Agent dialog.
- Auto-suggest an ASCII-safe Agent code for Chinese and Latin names.
- Create a demo Agent, update the query cache, and navigate to `/assets/{id}/build`.
- Resolve the session-created demo Agent in the Build route.
- Continue building, enter test, open recent assets, and open all assets.
- Reload after a clean server restart; browser console errors and warnings: none.

## Comparison History

No P0, P1, or P2 issue was found in the first combined comparison. The line-chart region from the concept is intentionally represented as source-labelled client progress bars because there is no real analytics series contract and adding a fake chart would overstate production capability.

## Follow-up Polish

- P3: when a real time-series analytics endpoint is available, replace the demo progress bars with the source-like multi-client chart using the project's approved chart library.

final result: passed
