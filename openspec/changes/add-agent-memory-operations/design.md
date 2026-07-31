## Context

AgentHub 已有两层信息架构：工作空间层用于跨 Agent 的平台能力，`/assets/[agentId]` 用于单个 Agent Asset 的构建、测试、版本和发行。现有 LinkYun Agent Creator API `GET /api/v1/agents/{agent_id}/memory-analytics` 只返回当前 Agent 的匿名聚合快照，包含覆盖数量、可选的关系/情绪聚合段和 `partial`，不包含上游数据时间、历史序列、用户或单份 Memory。

实现必须继续复用公共 API base、`X-API-Key`、`X-Workspace-Code`、统一 401 处理、TanStack Query 和现有 Agent Asset shell。Live 数据不得由本地 fixture 或假写入补齐；Demo 数据必须与 Live query key 和请求路径隔离。

## Goals / Non-Goals

**Goals:**

- 在 Agent Asset 上下文提供易懂的中文只读记忆服务状态页面。
- 对覆盖、关系阶段、情绪记录形成、近期状态和整体心境做严格、可测试的匿名聚合展示。
- 明确区分“暂未获取”的服务信号失败与“尚未积累”的可访问无样本状态。
- 对部分响应、模块省略、无 active Memory、`null` 和各类 HTTP 错误提供确定性状态。
- 仅支持创作者主动触发的手动刷新，并只标注前端本次获取时间。
- 提供隔离 Demo fixture，用于后端或认证不可用时的视觉 QA。

**Non-Goals:**

- 不提供用户、Memory、事实、消息或单份分数的列表、筛选、下钻、导出和管理。
- 不提供历史趋势、版本或 Client 归因、query/write 指标、效果结论或阈值告警。
- 不修改 LinkYun Agent 后端合同，不新增依赖，不复制原型工程代码。

## Decisions

### Agent 级路由和导航

新增 `/assets/[agentId]/memory`，并在 `assetNavigation` 中加入“记忆服务”。页面继续经过 `[agentId]/layout.tsx`，复用现有 Agent 名称、头像与生命周期上下文。相比放入 `/analytics`，该路径不会把一个 Agent 的快照误表达为跨平台用户分析。

### 独立 module 与数据流

`src/modules/agent-memory-operations/` 包含：

- 原始 API 类型和 `getAgentMemoryAnalytics`；
- 纯函数模型转换、比例计算、标签映射、诊断和错误展示模型；
- `useAgentMemoryAnalytics` 查询；
- 页面 UI 与可复用展示组件。

API 封装只把 `/agents/{id}/memory-analytics` 交给 `apiRequest`，沿用统一认证和工作空间头。查询以 Agent、工作空间和数据模式分区；不配置轮询，并关闭窗口聚焦与网络重连触发的自动重取，仅在首次进入或创作者点击刷新时请求。TanStack Query 的已有 `data` 在刷新失败时作为旧快照保留，UI 同时展示刷新错误。

### Live/Demo 能力判定

能力矩阵新增 `agentMemoryAnalytics`：Live 为 `live`，Demo 为 `demo`。Live query 只调用真实 API；Demo query 只读取 `src/fixtures/agent-memory-operations.ts` 中的匿名聚合 fixture。query key 包含 `DATA_MODE`，避免两种数据进入同一缓存。

### 原始类型与视图模型

原始类型精确表达两个可省略模块以及可为 `null` 的聚合值。转换层遵循以下规则：

- 覆盖率分母是 `total_active_memories`；
- 关系阶段占比分母是 `relationship_available`；
- 情绪形成和状态覆盖占比分母是 `emotion_available`；
- 分母为 0 时比例为 `null`，UI 显示“暂无样本”；
- API `null` 保持为 `null`，不转为 0；
- `state_distribution` 每项独立计算，不要求合计为 100%；
- 情绪 `empty` 显示“尚未积累”，不可用覆盖显示“暂未获取”。

前端保留未知阶段、状态和心境键并使用安全回退标签，不丢弃上游聚合数据。若阶段计数和关系可用数不一致，展示口径提示而不在前端补数。

### UI 结构与视觉

页面在真实 shell 中采用现有 `panel`、按钮、状态 badge、颜色 token 和 Phosphor 图标：

1. 标题、说明、本次获取时间和手动刷新；
2. 四项摘要；
3. 关系/情绪双通道完整度与当前情况/建议；
4. 关系阶段与情绪记录形成情况；
5. 近期状态与整体心境；
6. 聚合体验信号和指标说明。

条形图使用 HTML/CSS 渲染匿名分布，不引入图表依赖。颜色表达通道与可用性，不表达好坏。

### 错误与旧快照

API 错误通过 `ApiError.status/code` 映射：

- 400：Agent 参数异常，不自动重试；
- 401：公共层触发重新鉴权，页面显示登录态失效；
- 404：Agent 不存在或无查看权限；
- 503：记忆分析服务暂未配置；
- 500/其他：暂时无法获取，可重试。

没有成功数据时显示全页状态；已有成功快照时继续展示并标注“上次获取于…”，同时把错误呈现为旧数据提示。HTTP retry 只对 500 类临时错误进行有限重试，不对 400、401、404、503 自动重试。

## Risks / Trade-offs

- [接口没有快照生成时间] → 只保存客户端成功响应时刻并称为“本次获取时间”或“上次获取时间”。
- [Demo 与 Live 视觉结果可能混淆] → 能力矩阵、query key 和 fixture import 明确按 `DATA_MODE` 分离，页面 Demo 状态显示数据来源标记。
- [状态/心境动态键可能产生未知标签] → 采用已知中文映射加原始键回退，不删除或推测数据。
- [小样本可能被创作者从业务背景间接识别] → 不提供交叉筛选、组合下钻、用户导出或单份数值。
- [页面长时间停留时数据可能变旧] → 明示本次获取时间，并提供清晰的手动刷新入口。
- [前端保留旧快照可能被误认作最新数据] → 刷新失败时显示醒目的旧数据状态和上次成功获取时间。

## Migration Plan

该能力是新增路由和导航，无持久化数据迁移。上线时随前端版本发布；若需回滚，移除导航入口和路由即可，既有 Agent Asset 路由、公共 API 与 localStorage 合同不变。

## Open Questions

- 真实本地联调依赖可用的 LinkYun Agent 服务和 Creator 认证；若当前环境不可用，本 change 以契约测试与隔离 Demo 浏览器 QA 完成前端验证，并在 QA 报告中记录缺口。
