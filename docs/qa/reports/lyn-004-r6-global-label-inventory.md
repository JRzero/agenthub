# LYN-004-R6 全站标签 Inventory

## 审计口径

- 基线：`task/lyn-004-r5-status-label-theme_2026-08-05@ade435eb9c9fd572cd0b96770f5acb69bfd048c2`。
- 搜索范围：`src/` 内 `Badge/Tag/Pill/status/label` 命名、`status-badge` 与 `status-*`、带 `rounded + px + text-xs` 的标签候选、浅色背景类、语义色内联组合和硬编码颜色。
- 计数单位：源码渲染调用点；同一动态调用点可能覆盖多个业务状态。
- 候选总数：52；其中 38 个既有共享 `status-badge` 生产调用点、14 个额外圆角标签/相似组件候选。
- 分类结果：49 个范围内非交互式标签，3 个范围外相似组件；迁移后共有 49 个 `status-badge` 调用点，分布于 36 个生产源码文件。

## 共享组件与 Token

| 入口 | 修前状态 | 迁移目标 | 结果 |
| --- | --- | --- | --- |
| `src/app/globals.css` `.status-badge` | 统一尺寸，但无最大宽度/长文案保护 | 统一 inline-flex、圆角、细边框、长文案保护 | 完成 |
| `.status-success` | 默认分支使用 `emerald-50` 浅色实心底 | 深色 success ghost | 完成 |
| `.status-warning` | 默认分支使用 `amber-50` 浅色实心底 | 深色 warning ghost | 完成 |
| `.status-info` | 通用 surface + border | 独立深色 info ghost | 完成 |
| `.status-danger` | 通用 surface + border | 独立深色 danger ghost | 完成 |
| `.status-neutral` | 通用 surface + border | 独立深色 neutral ghost | 完成 |
| `.status-live` / `.status-saved` / `.status-draft` | R5 专用深色 token | success / warning 兼容别名 | 完成 |
| `src/shared/ui/source-badge.tsx` | live/derived/demo/unavailable 已有语义 class | 保持映射，改由五类 token 统一渲染 | 已验证 |
| `src/modules/agents/lifecycle.ts` | creating/archived/unpublished/published/draft | info/neutral/warning/success/warning | 已验证 |

## 范围内调用点 Inventory

| 页面/路由 | 文件与标签 | 当前问题/语义 | 迁移结果 |
| --- | --- | --- | --- |
| 全局壳 `/workbench` 等 | `src/shared/layout/topbar.tsx` 演示数据 | ad hoc warning 标签 | 已迁移为 `status-badge status-warning` |
| 工作台 `/workbench` | `src/modules/workbench/workbench.tsx` 生命周期；`src/shared/ui/source-badge.tsx` 数据来源 | 共享 class；覆盖 success/warning/info/neutral | 已验证 |
| Agent 列表 `/assets` | `src/app/(workspace)/assets/page.tsx` 图片覆盖和表格状态 | 图片覆盖 success 仍可能继承浅色底 | 已由共享 token 修复并截图验证 |
| Agent 详情 `/assets/[agentId]/overview` | `asset-workspace-header.tsx` 当前草稿；`adapter-panel.tsx` 运行/待更新/草稿；`activity-panel.tsx` 更新/发布/警告 | running 错用 success、draft 错用 neutral；update 使用品牌色 | 已迁移为 info/warning/info |
| Agent 构建 `/assets/[agentId]/build` | `build-workspace.tsx` 保存状态；`agent-avatar-editor.tsx` 已保存；`narrative-optimizer-panel.tsx` 已应用/待确认；`media-assets-panel.tsx`、`motherland-asset-drawer.tsx` 保存/降级；`moment-schedule-panel.tsx` 排期元数据；`motherland-chat-panel.tsx` 阶段；`staged-skills-panel.tsx` 已启用；`build-fields.tsx` 已绑定；`skill-config-dialog.tsx` 凭据状态 | 3 个 ad hoc success、排期 neutral、阶段使用品牌底 | 已迁移为 success/neutral/info |
| Agent 测试 `/assets/[agentId]/test` | `evaluation-panel.tsx` 评估良好/需注意 | success/warning 已映射 | 已由共享 token 验证 |
| Agent 版本 `/assets/[agentId]/versions` | `versions-workspace.tsx` 当前/历史/撤销版本 | 撤销使用浅 rose 内联底 | 已迁移为 danger |
| Agent 发行 `/assets/[agentId]/distribution`、`/distribution` | `distribution-workspace.tsx` 发布状态/Client 状态；`distribution-launcher.tsx` 生命周期；`distribution-dialog.tsx` 待接入 | 待接入使用浅 slate 实心底 | 已迁移为 neutral |
| Agent 创建 `/assets/create` | `agent-create-workspace.tsx` 待更新、已安装、创建阶段 | 已使用五类语义 | 已由共享 token 验证 |
| Agent 记忆 `/assets/[agentId]/memory` | `memory-operations-workspace.tsx` 诊断、模式、阶段/口径元数据 | 阶段元数据为 ad hoc neutral | 已迁移为 neutral |
| 资源 `/resources` | `marketplace-skill-detail.tsx` 分类；`source-badge.tsx` 来源 | 分类为 ad hoc surface 标签 | 已迁移为 neutral |
| Clients `/clients`、`/clients/[clientId]` | `clients-workspace.tsx` 同步状态；`client-detail-workspace.tsx` 启用状态 | success/warning/neutral 已映射 | 已由共享 token 验证 |
| 应用与渠道 `/operations` | `operations-workspace.tsx` 应用类型、群标记；`conversation-panel.tsx` 群聊；`session-list.tsx` 认证/复核；`moments/*` 发布/未发布/排期状态 | 应用类型/群聊 ad hoc 品牌底；失败状态用浅 rose | 已迁移为 neutral/danger |
| 治理 `/governance`、`/governance/[area]` | `risk-table.tsx` 风险级别；`risk-inspector.tsx` 风险详情 | high/medium/low 使用内联背景 | 已迁移为 danger/warning/success |
| 收益 `/revenue` | `revenue-table.tsx` 入账/待结算 | 内联 `bg-success/10` / `bg-warning/10` | 已迁移为 success/warning |
| 设置 `/settings` | 顶栏 `SourceBadge`/演示数据；页面保存反馈为普通 `role=status` 文本 | 只有顶栏属于标签；保存反馈不属于 Pill | 已验证且未改反馈文本 |

## 空、加载与错误状态

| 状态 | 审计结论 |
| --- | --- |
| `src/app/(workspace)/loading.tsx` 与资源 skeleton | 骨架块，不是标签；排除且不改 |
| `/assets` 空结果 | 图标、说明和按钮；没有 Badge/Tag/Pill，排除且不改 |
| `error-feedback`、`role=alert`、创建/版本/朋友圈错误块 | 通知/反馈面板，明确排除且不改 |
| 保存中、创建中、同步中 | 仅当以 `status-badge` 呈现时纳入 info；普通加载文本/Spinner 不纳入 |

## 范围外相似组件（3）

| 文件 | 候选 | 排除原因 | 保护方式 |
| --- | --- | --- | --- |
| `src/modules/operations/operations-workspace.tsx` | “按 Agent 查看 / 全部共享会话”圆角项 | 可点击 segmented control | 保留按钮样式；测试禁止 `status-badge` |
| `src/modules/agent-runtime/runtime-input-bar.tsx` | 附件 chip | 内含移除按钮的交互式输入附件 | 保留输入附件样式；测试禁止 `status-badge` |
| `src/modules/agent-distribution/distribution-side-panel.tsx` | 隐私说明/删除消息 | 通知与操作反馈，不是标签 | 保留通知块样式 |

## 语义迁移字典

| Variant | 业务语义 | 本次代表文案 |
| --- | --- | --- |
| success | 发布、实时、已保存、在线、成功、已启用/已绑定 | 已发布、实时数据、所有更改已保存、已安装、已认证、已入账 |
| warning | 草稿、待处理、需复核、需要注意 | 草稿、待更新、待确认、有未保存更改、待结算 |
| info | 创建中、运行中、同步/保存中、信息阶段 | 创建中、运行中、保存中、第 1 步、前端派生 |
| danger | 失败、错误、风险、禁用/撤销 | 保存失败、排期失败、高风险、已撤销 |
| neutral | 归档、未启用、类型、分类、权限、普通元数据 | 已归档、待接入、历史版本、群聊、应用类型、技能分类、排期时间 |

## 路由覆盖结果

- 工作空间已查：`/workbench`、`/assets`、`/resources`、`/clients`、`/clients/new`、`/operations`、`/distribution`、`/analytics`、`/governance`、`/governance/roles`、`/governance/safety`、`/revenue`、`/settings`。
- Agent Asset 已查：`/assets/905/overview`、`/assets/904/build`、`/assets/905/test`、`/assets/905/versions`、`/assets/905/distribution`、`/assets/905/memory`，以及 `/assets/create`。
- 20 个真实 Live 路由均存在主内容且无错误边界；新鲜 Console 会话为 0 error / 0 warning。
- 图片覆盖、密集列表/表格、详情标题栏和长文案由 R6 共享 class、截图及源码断言覆盖。Live 数据实际出现 success/warning/info/neutral；danger 在 Live 当前数据中未触发，使用真实 danger 调用点、五类 token/映射测试与 9.01:1 对比度验证覆盖。
