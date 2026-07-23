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
