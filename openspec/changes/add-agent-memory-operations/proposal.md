## Why

Agent 创作者目前无法在 AgentHub 内确认一个 Agent 的匿名记忆关系与情绪信号是否已形成、是否完整，只能依赖后端排障或把“没有样本”误判为“服务失败”。现有 `GET /api/v1/agents/{agent_id}/memory-analytics` 已提供严格匿名的 Agent 级聚合合同，因此需要在 Agent Asset 工作区补齐一套只读、可解释且符合隐私边界的运营观测能力。

## What Changes

- 在 Agent Asset 工作区新增“记忆服务”导航和 `/assets/[agentId]/memory` 路由，保持 Agent 上下文，不将其放入工作空间级用户分析。
- 新增独立的记忆运营业务 module，包含严格 TypeScript 响应类型、公共请求层上的 API 封装、模型转换、确定性诊断和 TanStack Query 查询。
- 展示记忆关系数、关系数据完整度、情绪数据完整度、情绪记录、双通道覆盖、关系阶段、情绪记录形成情况、近期状态、整体心境、当前情况与建议及指标说明。
- 使用与 AgentHub shell 一致的中性数据仪表盘视觉：靛蓝紫表达关系通道、青蓝表达情绪通道、琥珀表达暂未获取，避免用红绿暗示业务好坏。
- 正确区分无样本、尚未积累、暂未获取、部分数据、模块省略与 HTTP 错误；支持保留上次成功快照和手动刷新，不进行后台自动刷新。
- Live 模式仅请求真实聚合 API；Demo 模式使用明确隔离的匿名聚合 fixture，供本地视觉和交互 QA 使用。
- 增加 API、模型、状态和交互测试，并记录浏览器 QA 截图与报告。

## Capabilities

### New Capabilities

- `agent-memory-operations`: Agent Asset 级匿名记忆服务状态观测、刷新、状态解释、隐私边界与错误处理。

### Modified Capabilities

无。

## Impact

- 新增 `/assets/[agentId]/memory` 页面和 Agent Asset 顶部导航入口。
- 新增 `src/modules/agent-memory-operations/` 以及 Demo fixture、能力矩阵项和对应测试。
- 复用 `src/shared/api/`、现有认证、工作空间请求头、TanStack Query、Phosphor 图标、全局 tokens 和控件样式。
- 只依赖现有 LinkYun Agent Creator API，不增加 npm 依赖、不修改后端、不新增单用户或单 Memory 数据访问。
