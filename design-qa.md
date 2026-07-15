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

## Final result

final result: blocked
