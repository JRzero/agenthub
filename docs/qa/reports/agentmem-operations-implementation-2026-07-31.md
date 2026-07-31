# AgentMem Creator 记忆服务状态实施 QA

## 结论

Agent Asset 级“记忆服务状态”页面已在真实 AgentHub shell 中完成视觉与交互验证。默认部分数据、无样本、请求错误和手动刷新状态均符合产品合同；页面不进行轮询、窗口聚焦或网络重连自动刷新，浏览器控制台错误为 0。

真实 LinkYun 后端健康检查可达，但当前 QA 环境没有可用的 Creator API Key，因此未取得真实 `200 memory-analytics` 响应。Live 请求合同由 Vitest 覆盖，视觉状态使用明确的 Demo 隔离 fixture 验证。

## 验证环境

- 日期：2026-07-31
- 浏览器：Codex 内置浏览器
- 目标桌面视口：`1440 × 1024`
- 页面路由：`/assets/[agentId]/memory`
- 默认状态 Agent：`/assets/32/memory`
- 无样本 Agent：`/assets/19/memory`
- 数据模式：`NEXT_PUBLIC_AGENTHUB_DATA_MODE=demo`
- 设计参考：
  - `docs/qa/design-reference/agentmem-operations-target-2026-07-31.png`
  - `docs/qa/design-reference/agentmem-operations-prototype-2026-07-31.png`

用户指定的 `http://localhost:3002` 已被 `/Users/king/Projects/linkyun/agenthub` 的既有开发进程占用。为避免中断用户进程，本工作树的浏览器 QA 临时运行在 `http://localhost:3003`；路由、shell 和构建产物与 3002 启动方式相同。

## 浏览器证据

### 默认 partial 状态

- 截图：
  - `docs/qa/images/agentmem-operations-partial-viewport-2026-07-31.png`
  - `docs/qa/images/agentmem-operations-partial-full-2026-07-31.png`
- 验证：
  - Agent `林月` 的真实 Asset header、生命周期和顶部导航保持可见。
  - “记忆服务”位于 Agent Asset 导航，不在工作空间级数据分析中。
  - 四项摘要显示 `12`、`11 / 12（91.7%）`、`10 / 12（83.3%）`、`46`。
  - 关系阶段按 `relationship_available=11` 计算为 `54.5% / 36.4% / 9.1%`。
  - 情绪记录形成按 `emotion_available=10` 计算为 `90% / 10%`。
  - “暂未获取”和“尚未积累”使用不同文案与视觉。
  - 近期状态按已获取情绪数据计算，各项不要求守恒。
  - 量纲说明读取 Demo 响应的 `score_scales`，不同量纲未做横向比较。
  - 页面未出现用户、单份 Memory、事实、消息、query/write、趋势或效果归因入口。

### 无样本状态

- 截图：
  - `docs/qa/images/agentmem-operations-empty-viewport-2026-07-31.png`
  - `docs/qa/images/agentmem-operations-empty-full-2026-07-31.png`
- 验证：
  - `total_active_memories=0` 时两项完整度显示“暂无样本”，不显示 `0%`。
  - 情绪记录显示 `—` 和“尚未积累情绪记录”，不解释为服务失败。
  - 页面显示引导型“记忆关系尚未积累”，不渲染空分布图。

### 请求错误状态

- 截图：`docs/qa/images/agentmem-operations-error-viewport-2026-07-31.png`
- 方法：在 Demo 隔离 fixture 中短暂注入一次请求失败并热重载，截图后立即恢复零样本 fixture；最终源码不包含错误注入。
- 验证：
  - 没有成功快照时隐藏运营内容。
  - 显示“暂时无法获取记忆服务状态”、临时问题说明和“重试”。
  - 400、401、404、503、500 的专用文案与可重试性另由模型测试覆盖。
  - 已有成功快照后的刷新失败保留旧数据与“上次获取时间”，由模型和查询状态测试覆盖。

## 刷新交互

- 页面只保留手动“刷新”按钮，不显示自动刷新开关或间隔控件。
- 查询未配置轮询，并关闭窗口聚焦和网络重连触发的自动重取。
- 点击“刷新”后显示“数据已刷新”。
- 成功刷新更新前端获取时间；页面只使用“本次获取时间”或“上次获取时间”，未冒充上游更新时间。

## 视觉与可访问性

- 使用现有 AgentHub shell、panel、按钮、状态 badge、颜色 tokens 和 Phosphor 图标。
- 关系通道使用玫红，情绪通道使用绿色；灰/橙仅表示暂未获取，不表示价值好坏。
- 桌面首屏包含页头、刷新控件、摘要、双通道完整度、当前情况和当前互动感受入口。
- 全页截图包含聚合体验信号和指标/隐私说明。
- 刷新、重试和导航均有语义角色或可访问名称。
- 最终页面浏览器控制台 `error` 数量：`0`。

## 真实后端联调

- `GET http://127.0.0.1:8080/health`：HTTP `200`。
- 使用明显的测试凭据 `et_test_agentmem_qa` 请求
  `GET /api/v1/agents/32/memory-analytics`：HTTP `401`，返回无效或过期 API Key。
- 结论：后端服务和路由可达；由于没有真实 Creator API Key 和归属 Agent，未完成真实 `200` 数据响应验证。
- 剩余联调依赖：
  - 有效 Creator `X-API-Key`；
  - 归属该 Creator 且具有 active Memory 的 Agent ID；
  - 可选：包含 partial、整段省略与 `null` 的真实样本用于端到端复核。

## 自动验证

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm test`：59 个测试文件、270 项测试通过。
- `npm run build`：通过，包含动态路由 `/assets/[agentId]/memory`。
- `openspec validate --all --strict`：由最终门禁执行。

## 最终结果

passed with real-200 integration gap documented
