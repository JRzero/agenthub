# AgentHub 架构边界

本文记录当前仓库已确认的前端结构、数据流和安全边界。它不定义后端实现，也不把规划项描述为已交付能力。

## 运行结构

- AgentHub 使用 Next.js 15 App Router 和 React 19；`src/app/` 负责路由、布局和页面入口。
- 产品界面分为两层：工作空间层提供资产、资源、Clients、运营、分析、治理、收益和设置；Agent Asset 工作区提供单个资产的概览、构建、测试、版本和发行。
- `src/modules/` 按业务能力组织组件、状态、类型和端点封装。可复用的跨模块 UI、请求、hooks 和工具位于 `src/shared/`；复杂业务逻辑不应堆积在页面入口。
- `src/config/capabilities.ts` 是前端能力可用性的唯一判定入口，`src/fixtures/` 只承载明确隔离的 Demo 数据。

## 浏览器到上游服务的数据流

```text
浏览器中的 App Router 页面与业务组件
  -> 所属 src/modules/<name>/ 的状态、查询与端点封装
  -> src/shared/api/ 的 API base 与公共请求行为
  -> Linkyun Agent HTTP API
```

业务模块负责自身端点和模型转换；公共 API 层负责 API base 解析、通用请求头、响应解析及统一的认证失效信号。组件不得硬编码后端域名。后端能力或接口需要变化时，本仓只记录前端契约和跨仓请求，不直接实现后端行为。

## Live、Demo 与不可用能力

- `NEXT_PUBLIC_AGENTHUB_DATA_MODE=live` 时只展示 Linkyun Agent 已真实支持的数据与操作。
- `demo` 模式可使用 `src/fixtures/` 的隔离数据演示交互，但 Demo 缓存和提交路径不得与 Live 混用。
- 尚未获得后端支持的能力在 Live 模式保持 `unavailable`、待接入或只读；不得用静态数据、随机值或本地假写入伪装成功。

## 安全边界

- 浏览器认证通过既有 `X-API-Key` 契约，工作空间上下文通过 `X-Workspace-Code` 传递；敏感值不得写入日志、fixture 或 QA 证据。
- API 地址统一由公共解析逻辑取得。认证失效由公共请求层处理，页面不各自复制退出逻辑。
- 需要认证的 SSE 使用 `fetch`、`ReadableStream` 和 `AbortController`，以便携带请求头和中止连接；不使用原生 `EventSource`。
- 仓库不包含 Linkyun Agent 后端、数据库或生产环境配置，也不从其他源码仓库直接导入文件。

## 规划项与未确认项

- 未由 `src/config/capabilities.ts` 标记为 Live 的平台能力仍是待接入项，不在本文中推定其后端实现。
- 仓库级 CI、部署平台以及自动化跨仓契约门禁在当前基线未确认；本地 `scripts/verify` 不是 CI 或发布授权。
- 若未来调整路由、公共模型、数据模式或跨模块结构，应先通过适用的 OpenSpec change 记录设计和影响。

## 事实来源

- [`AGENTS.md`](../AGENTS.md)
- [`src/app/`](../src/app/)
- [`src/modules/`](../src/modules/)
- [`src/shared/api/`](../src/shared/api/)
- [`src/config/capabilities.ts`](../src/config/capabilities.ts)
