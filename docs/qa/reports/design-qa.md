# AgentHub Platform Centers Design QA

## Evidence

- Analytics source: `../design-reference/08-analytics.png`
- Governance source: `../design-reference/09-governance.png`
- Revenue source: `../design-reference/10-revenue.png`
- Settings source: `../design-reference/11-settings.png`
- Browser screenshots: `../images/qa-analytics-viewport.png`, `../images/qa-governance-viewport.png`, `../images/qa-revenue-viewport.png`, `../images/qa-settings-viewport.png`
- Combined inputs: `../images/qa-analytics-comparison.png`, `../images/qa-governance-comparison.png`, `../images/qa-revenue-comparison.png`, `../images/qa-settings-comparison.png`
- Routes: `/analytics`, `/governance`, `/revenue`, `/settings`
- Viewport: 1280 x 720 CSS pixels, light theme, demo workspace
- Browser: Codex in-app browser

Each source was normalized to the implementation viewport and placed beside its browser screenshot before judgment.

## Findings

No actionable P0, P1, or P2 difference remains.

- Information architecture: passed. Each center keeps the approved workspace shell, title/action hierarchy, dense metric or form panels, tables, and contextual detail areas.
- Typography: passed. Chinese system typography, metric emphasis, table labels, helper copy, and status badges remain legible and consistent with the wider AgentHub shell.
- Spacing and layout: passed. At 1280 px, cards and content grids preserve the source hierarchy without horizontal page overflow; tables use contained scrolling when needed.
- Colors and tokens: passed. Violet primary selection, green success, amber warning, red risk, neutral borders, and light surfaces use the shared AgentHub design tokens.
- Data visualization: passed. Trend visuals are rendered from explicit data through an accessible canvas component rather than static decoration.
- Copy and provenance: passed. Analytics, Governance, and Revenue visibly identify demo data and fall back to unavailable states in live mode. Settings distinguishes real account APIs from browser-local workspace preferences.
- Interaction states: passed. Filters, metric tabs, risk selection/resolution, governance tabs, revenue selectors, settings tabs, preference save, profile save, and capability-boundary states operate correctly.
- Accessibility: passed for this slice. Controls have semantic roles or accessible labels, tables retain headers, the canvas has a text alternative, and focus styling remains available.

## Primary Interactions Tested

- Analytics: switch the primary metric, choose an Agent, and verify filter context and chart state.
- Governance: select a risk, resolve it locally, and open Policy and Audit tabs.
- Revenue: change granularity and source filters and verify accessible chart context.
- Settings: persist browser-local preferences, edit the demo profile, synchronize the topbar username, and open an unsupported API-key setting.
- Reload all four routes after a production build and a clean server restart; application console errors and warnings: none.

## Verification

- ESLint: passed with zero errors and zero warnings.
- TypeScript: passed.
- Unit and API contract tests: 57 passed across 21 files.
- Next.js production build: passed.
- Strict OpenSpec validation: passed.
- Horizontal overflow at 1280 px: none on all four routes.

## Comparison History

The initial combined comparisons found no P0, P1, or P2 issue. The Settings capture was repeated after restoring the approved simplified-Chinese state and top scroll position.

## Follow-up Polish

- P3: replace demo-only Analytics, Governance, and Revenue stores with service-backed contracts when the backend exposes auditable metric, policy, risk, and settlement APIs.
- P3: add workspace-avatar persistence after a workspace settings API is available; Creator avatar upload/delete is already wired to the existing profile contract.

final result: passed
