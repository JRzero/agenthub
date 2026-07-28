# Design QA: Agent Asset 紧凑外壳

## Source of truth

- 设计稿：`docs/qa/design-reference/professional-config-shell-target.png`
- 调整前：`docs/qa/images/professional-config-shell-before.png`
- 调整后：`docs/qa/images/professional-config-shell-after-1648x928.png`
- 页面：`http://localhost:3002/assets/32/build`
- 视口：1648 × 928，Demo 数据，角色人格区

## Comparison

### Full-page

- 设计稿和实现均使用全宽品牌顶部栏、顶部栏下方的图标导航栏、紧凑 Agent 信息与生命周期页签、三栏构建工作区。
- 实现保留现有 AgentHub 导航项和真实 Demo Agent 数据，不复制设计稿中的示例角色或未实现功能。

### Focused shell

- 顶部栏：实测 `x=0, y=0, width=1648, height=68`。
- 左侧栏：实测 `x=0, y=68, width=88, height=860`。
- Agent 头部：实测 `x=88, y=68, width=1560, height=123`。
- 页面横向宽度：`scrollWidth=clientWidth=1648`，无横向溢出。
- 构建操作：重置、保存草稿、保存并测试各 1 个可见实例。

## QA history

1. 初始差异：共享工作空间侧栏仍为 224px 完整菜单，顶部栏从侧栏右侧开始，构建页另有一行操作工具栏。
2. 修复：为所有 `/assets/{agentId}/...` 生命周期路由增加共享紧凑外壳；工作空间级页面保持原样。
3. 修复：品牌标识和工作空间选择器进入全宽 68px 顶部栏；桌面全局导航缩为 88px 图标栏。
4. 修复：构建操作通过共享 Agent 头部插槽呈现，移除可见的重复工具栏。
5. 回归：`/assets` 仍为 224px 完整菜单和 60px 顶部栏；390px 移动端抽屉仍为 224px 且显示全部标签。

## Result

结构和密度与设计稿一致；内容差异来自现有产品导航、Demo Agent 和后端能力边界。

## Collapsible navigation follow-up

- Evidence, compact hover: `docs/qa/images/professional-config-navigation-collapsed-hover-1648x928.png`
- Evidence, expanded labels: `docs/qa/images/professional-config-navigation-expanded-1648x928.png`
- Compact state: rail 88px; main desktop padding 88px; hovered Agent Asset tooltip visible with opacity 1.
- Expanded state: rail 224px; main desktop padding 224px; persistent labels and the Collapse navigation control visible.
- Collapse restoration: rail and main desktop padding both return to 88px.
- Workspace route regression: `/assets` remains a 224px labeled sidebar and does not render the Agent-only toggle.
- Mobile regression at 390 x 844: the drawer remains 224px, Agent Asset and Settings labels remain visible, and the desktop toggle is hidden.
- Horizontal overflow: none in compact, expanded, workspace, or mobile checks.

## 2026-07-15 compact density follow-up

- Design source: `docs/qa/design-reference/professional-config-shell-target.png`.
- Pre-change implementation: `docs/qa/design-reference/current-density-review.png`.
- Requested viewport and state: desktop Agent Build workspace with the Persona section active.
- Full-view comparison found excess vertical space in the shared top bar and Agent identity header, plus excess horizontal and vertical space in the Build configuration rail.
- Focused implementation changes: 60px compact top bar, 64px Agent identity row, 52px avatar, tighter lifecycle tabs, 196px Build rail, and 40px minimum rail-item targets.
- Typography intent, product copy, colors, imagery, Runtime behavior, and save semantics were intentionally left unchanged.
- Automated verification passed: lint, typecheck, 129 tests, production build, strict OpenSpec validation, and `git diff --check`.

### Browser capture status

- Post-change implementation screenshot: unavailable.
- The in-app browser runtime failed during initialization with `Cannot redefine property: process`.
- Because the final implementation was not captured at the same viewport, spacing, alignment, overflow, and compact/expanded preview coexistence remain visually unverified.
- This is a QA tooling blocker, not a recorded visual pass.

## 2026-07-20 export dialog short-viewport follow-up

- Source visual truth: `docs/qa/images/export-dialog-overflow-reference.png`.
- Implementation route: `http://localhost:3002/assets/29/distribution`.
- Viewport: 1024 ? 650, short desktop viewport.
- State: export dialog expected to be open with generic configuration selected.
- Full-view comparison: the source shows the dialog extending below the viewport and hiding part of the footer; the implementation now constrains the dialog to `100dvh - 2rem`.
- Focused comparison: the dialog header and footer are non-shrinking regions, while the middle form is the only vertical scroll container.
- Typography, color tokens, icons, copy and image assets were intentionally unchanged.

### QA history

1. P1: the source state clips the export action footer and provides no usable vertical scroll area.
2. Fix: added a viewport-relative maximum height, flex column layout, middle-region `overflow-y-auto`, and persistent header/footer.
3. Post-fix browser evidence: unavailable because the local page returned `Failed to fetch` before Agent data and the export dialog could render.
4. Automated verification passed for lint, typecheck, focused export tests, strict OpenSpec validation and diff checking.

### Current verification status

- Implementation screenshot: unavailable due the local backend request failure.
- Primary interaction: not testable because the distribution workspace did not finish loading.
- Console errors: the visible application error was `Failed to fetch`.
- The CSS implementation is complete, but visual comparison remains blocked until the local backend is reachable.

## Final result

final result: blocked

---

# Agent 分步创建流程设计 QA

## 对照范围

- 设计源：`/Users/king/Projects/linkyun/product-design/design-output/agenthub/agent-create-flow/guided-wizard/`
- 实现路由：`/assets/create`
- 对照视口：`1600 × 1200`
- 实现证据：`docs/qa/images/agent-create-step-01-basic.jpg` 至 `agent-create-step-06-complete.jpg`

## 逐屏结论

| 状态 | 结果 | 说明 |
| --- | --- | --- |
| 基础输入 | 通过 | 五项输入、四步进度、预览和固定底部操作均在单屏内。 |
| 生成结果确认 | 通过 | 生成内容可编辑，确认前不会进入下一步。 |
| 头像选择 | 通过 | 四个等宽方形候选、单选状态、重新生成、上传和确认操作完整。 |
| 角色设定稿 | 通过 | 候选大图、重新生成、查看大图和显式确认完整。 |
| 技能选择 | 通过 | 从 Workspace 技能资源读取，只显示中文产品名称和说明，支持搜索、选择及跳过。 |
| 创建完成 | 通过 | 明确显示未发布草稿，不展示版本号或 Hash。 |

## 布局与交互检查

- 页面 `documentElement` 与 `body` 高度均为 `1200px`，主页面无纵向滚动。
- 头像候选初次实现曾因弹性高度形成纵向拉伸，已改为固定方形比例并复测。
- 刷新头像步骤后候选、选择和当前步骤可恢复，验证了 Demo 隔离态续建。
- 头像、角色设定稿必须确认；技能可跳过。
- 重新生成只更新候选，不覆盖已确认内容。

## 已知差异与阻塞

- Demo 模式复用仓库现有静态图片，无法按输入语义生成设计稿中的恐龙头像与角色设定稿；真实视觉内容依赖 Motherland 候选接口。
- Live 模式尚缺原子“基础生成并建立创建中草稿”、Revision 自动保存/恢复、稳定技能版本引用等后端契约，因此仅展示明确的待接入状态。
- Workspace 外层导航沿用现有 AgentHub 设计系统，未复制设计稿中的旧版导航结构。

## 最终结果

前端流程、布局和 Demo 验证通过；生产 Live 闭环因后端契约尚未提供而处于阻塞状态。

---

# Agent 概览状态样式 QA

## 对照范围

- Source visual truth：`/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-c246dbdd-bdab-4f37-af1e-0c3900e0fd30.png`
- Source pixels：`1872 × 1282`
- Implementation route：`http://localhost:3002/assets/28/overview`
- Intended state：Agent 概览页“资产组成”列表，桌面端
- Density normalization：未执行；缺少同状态的浏览器实现截图

## Full-view comparison evidence

- 源图显示状态列使用大面积浅色矩形背景，和同表格中“已配置”的轻量图标文字样式不一致。
- 实现已统一为语义图标加短文本：已配置、部分配置、未配置、待接入均不再使用整块背景。

## Focused region comparison evidence

- 聚焦区域为资产组成列表最右侧状态列。
- 静态代码检查确认四种状态均使用相同的行内布局、`17px` 图标和 `text-xs` 文本；部分配置保留琥珀色，其余状态使用成功色或弱化文本色。

## Findings

- [P2] 缺少修改后的浏览器截图，无法确认真实渲染下的列对齐、字色和状态间视觉一致性。
  - Fix：恢复 Chrome 连接后，在同一桌面视口重新加载 Agent 概览并截图复核。

## Comparison history

1. Earlier finding：状态标签整块底色过重，和“已配置”样式不统一。
2. Fix：移除“部分配置 / 未配置 / 待接入”的块状背景，改为语义图标 + 状态文字。
3. Post-fix evidence：lint、typecheck 与 diff check 通过；浏览器连接中断，未取得渲染截图。

## Final result

final result: blocked

---

# Client 与应用运营 V1 设计 QA

## 结论

**PASS**

验收范围覆盖 Clients 列表、详情、新建接入，Agent 发行联动，OyiiOyii 会话管理、朋友圈三栏管理、生成与编辑、预览发布、发布失败保留输入、评论和删除确认。

## 对照基线

- 视觉参考：`/Users/king/Projects/linkyun/product-design/design-output/agenthub/moments-operations/01-oyiioyii-moments-management.png`
- 实现截图：`docs/qa/images/client-operations-v1-moments-reference-viewport.png`
- 同尺寸并排对照：`docs/qa/images/client-operations-v1-design-comparison.png`
- 参考稿仅用于三栏布局、生成编辑和发布预览结构；按最终方案移除了状态流转、审核、浏览量、运营日志、设置和多 Client 切换。

## 验收结果

| 维度 | 结果 | 说明 |
| --- | --- | --- |
| 信息架构 | 通过 | 会话与朋友圈为真实模块；用户反馈、记忆问题、活动与渠道明确标记规划中；应用端配置隐藏 |
| 布局 | 通过 | 朋友圈采用列表、详情、互动评论三栏；大屏区域独立滚动 |
| 响应式 | 通过 | 1440×900 与 1280×720 均无页面横向溢出 |
| 字体与层级 | 通过 | 沿用 AgentHub 现有字号、字重、行高和信息层级 |
| 色彩与表面 | 通过 | 沿用现有 token；状态、危险操作、选中态和焦点态清晰 |
| 图片质量 | 通过 | 使用项目内真实位图资产，裁切比例稳定，无 CSS/SVG 占位绘图 |
| 图标 | 通过 | 统一使用现有 Phosphor 图标集，尺寸和描边一致 |
| 状态与交互 | 通过 | 加载、空态、失败重试、成功、冲突、评论、发布、删除确认均有明确反馈 |
| 可访问性 | 通过 | 表单具备可访问名称；原生控件可键盘操作；删除弹层使用 `dialog` 与 `aria-modal` |

## 浏览器验证

- Clients：列表筛选、稳定详情路由、配置保存、停用、重新启用、新建接入闭环通过。
- 会话管理：按 Agent、共享用户、会话列表和详情保持可用。
- 朋友圈：生成候选、编辑、预览、发布成功回列表、评论、删除确认与删除通过。
- Live 失败态：发布接口返回 503 后仍停留在预览页，正文与素材选择保留，错误可见并可重试。
- 旧入口：`section=moments` 安全迁移到媒体资产，并提示前往应用运营；构建导航不再显示朋友圈。
- 发行联动：Agent 发行页存在带 Agent 筛选的“管理朋友圈”入口。
- 规划占位：三个占位模块可路由且不触发不支持的接口；应用端配置不出现在导航中。

## 最终复核

未发现阻断或高优先级视觉问题。实现与最终产品边界一致；与早期概念稿的差异均来自已锁定的信息架构调整，不属于视觉缺失。

---

# Moment Agent Selector Design QA

## Comparison target

- Source visual truth: `/Users/king/.codex/generated_images/019fa2d7-5040-7163-ba02-3a73b1703f8b/call_ga3sOaYRq0Rp22gXpxLGbnat.png`
- Implementation screenshot: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-open-final-2026-07-27.png`
- Combined comparison evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-comparison-final-2026-07-27.png`
- Closed-state evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-closed-2026-07-27.png`
- Responsive evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-responsive-1024-2026-07-27.png`
- Route: `http://localhost:3002/operations?module=moments`
- State: live data, Moment creation step 1, Agent selector open, `可发布` filter selected

## Viewport and normalization

- Source pixels: 1797 × 875
- Implementation browser viewport: 1464 × 714 CSS px
- Implementation screenshot pixels: 1453 × 709
- Browser density: 1 CSS px to 1 screenshot px
- Comparison normalization: source downsampled with aspect-preserving contain to 1453 × 709; implementation retained at 1453 × 709; both stacked in one 1453 × 1426 comparison image
- Responsive check: 1024 × 768 CSS px, no horizontal overflow (`scrollWidth` 1013, `clientWidth` 1013)

## Full-view comparison

The implementation matches the selected direction's core composition: a compact selected-Agent control, a constrained searchable list, availability tabs, a parallel writing area, and a persistent right-side OyiiOyii preview. The editor remains visible while the Agent selector is open.

## Focused region comparison

The Agent selector region was checked separately in closed, open, search-result, `可发布`, and `全部` states. Focused evidence was necessary because the full-page comparison cannot show disabled-row semantics, keyboard closure, or search behavior.

## Required fidelity surfaces

- Fonts and typography: existing AgentHub font stack, weights, sizes, line heights, truncation, and hierarchy were preserved.
- Spacing and layout rhythm: selector/editor proportions now follow the reference; the open list is height-constrained and independently scrollable.
- Colors and visual tokens: existing canvas, surface, border, muted text, primary-soft, and primary tokens are used throughout.
- Image quality and assets: existing Agent avatars and the existing Phosphor icon library are used; no replacement placeholders, custom SVGs, or generated raster assets were introduced.
- Copy and content: Chinese labels reflect the live product contract. Unlike the concept image, unpublished Agents are not presented as valid selected values.

## Interaction verification

- Default selection skips unpublished Agents and chooses the first Agent with a platform current version.
- Selector opens and closes from the selected-Agent field.
- Search by Agent name returns the expected single result.
- Selecting a result updates the field and preview, clears the search, and closes the selector.
- `可发布` and `全部` filters work.
- Unpublished Agents remain visible in `全部` but are disabled and explain that a platform version must be published first.
- Escape closes the selector.
- No browser console warnings or errors were present.
- No publish action or backend Moment creation was triggered during QA.

## Comparison history

1. Initial implementation finding — P2: the selector overlay was full-width and obscured the upper writing area.
2. Fix: changed the desktop composition to a parallel Agent-selector and writing layout, while retaining stacked responsive behavior below the desktop breakpoint.
3. Post-fix evidence: `moment-agent-selector-open-final-2026-07-27.png`; the writing controls remain visible while the list is open, with no horizontal overflow at 1024 px.

## Findings

- No remaining P0, P1, or P2 findings.
- P3: the concept image depicts a richer formatting toolbar, but the current Moment contract uses plain text. This was intentionally not added because it is outside the Agent-selection change and would imply unsupported formatting behavior.

## Implementation checklist

- [x] Compact selected-Agent field
- [x] Searchable, scrollable single-select list
- [x] Availability filter and disabled unpublished state
- [x] Published-Agent default selection
- [x] Keyboard and click-away dismissal
- [x] Parallel desktop layout and stacked responsive fallback
- [x] Automated logic, type, lint, browser interaction, responsive, and visual checks

final result: passed

---

# Client 空状态排版 QA

- 验证日期：2026-07-28
- 详细报告：`docs/qa/reports/client-empty-state-layout-2026-07-28.md`
- 当前状态：代码修复与自动检查通过；浏览器渲染复验受 `ERR_BLOCKED_BY_CLIENT` 阻塞。

final result: blocked

---

# AgentHub 自定义下拉组件设计 QA

- 验证日期：2026-07-28
- 验证范围：全局原生下拉替换、macOS 展示一致性、键盘操作与窄视口定位
- 详细报告：`docs/qa/reports/custom-select-design-qa-2026-07-28.md`
- 实现截图：`docs/qa/images/custom-select-open-2026-07-28.png`

final result: passed

---

# Moment Automatic Publication Settings Design QA

## Target and evidence

- Route: `http://localhost:3002/operations?module=moments`
- State: Live data, automatic publication disabled for the selected published Agent
- Default-size evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-auto-publish-settings-live-default-2026-07-28.png`
- Responsive evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-auto-publish-settings-live-2026-07-28.png`

## Product and visual verification

- The entry sits in the Moments management toolbar next to the create action, keeping schedule management at the platform operations layer.
- The modal uses the existing AgentHub surface, border, text, primary, status and elevation tokens.
- The hierarchy is intentionally compact: title and purpose, published-Agent selector, current status, primary scheduling action, then the non-destructive close note.
- The selector exposes 16 published Agents in the verified Live workspace and excludes unpublished Agents.
- At the 1280 × 720 content viewport the 768 px dialog remains fully visible with no horizontal overflow; its body owns vertical scrolling for denser enabled schedules.
- Escape dismissal and reopening work, and no console errors or warnings were recorded.
- Live QA was read-only. No schedule generation, deletion or Moment publication was triggered.

## Findings

- No remaining P0, P1, P2 or P3 findings.
- The design intentionally does not expose manual weekday or time editing because the current backend contract generates the schedule from Agent identity.

final result: passed
