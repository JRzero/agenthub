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

---

# Agent 单运行版本管理设计 QA

日期：2026-07-18

## 验收范围

按 `docs/qa/design-reference/version-management-single-current/` 的八张设计稿复核：

- 版本总览、历史列表和版本详情
- 构建草稿态与草稿发布入口
- 发布新版本、基于历史版本创建草稿、导出当前版本弹窗
- Client 运行列表、同步状态、运行配置与 Session 版本语义
- 首次发布与发布受阻状态的组件实现

## 设计对齐结果

- 版本页已改为“当前版本摘要 + 左侧历史 + 右侧详情”的双栏结构，并保留不可变历史快照语义。
- 构建页头部显示当前草稿 Hash、基线版本和草稿操作；编辑区显示平台仍运行当前版本的提示。
- Client 运行页已改为 Client 列表与运行详情双栏，统计口径按 4 个 Client、2 个已同步、1 个等待同步、1 个本地导出展示。
- 发布、恢复和导出弹窗均按设计稿展示版本迁移关系、内容清单、兼容检查及 Session 影响。
- 版本与 Client 页不再重复显示页面级操作；全局 Agent 头部承担测试、编辑和导出入口。
- 网页公开分享属于既有发行能力，保留在 Client 运行主区下方，不混入版本跟随逻辑。

## 浏览器证据

同一视口 `1646 × 956`、Demo 数据模式下逐页与设计稿并排比较：

- `docs/qa/images/agent-version-management-design-parity-2026-07-18.png`
- `docs/qa/images/agent-build-version-state-design-parity-2026-07-18.png`
- `docs/qa/images/agent-client-runtime-design-parity-2026-07-18.png`
- `docs/qa/images/agent-version-publish-dialog-design-parity-2026-07-18.png`
- `docs/qa/images/agent-version-restore-dialog-design-parity-2026-07-18.png`
- `docs/qa/images/agent-client-export-dialog-design-parity-2026-07-18.png`

## Live 边界

Demo 仅用于视觉状态验收；Live 模式仍只调用真实版本与 Client 接口，不会用 fixture 伪装后端成功。当前本机后端对新版本接口返回 404 的证据保留在 `docs/qa/images/agent-version-management-backend-not-deployed-2026-07-18.png`，真实接口部署后仍需补一次端到端联调。
