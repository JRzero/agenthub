# AgentHub 契约索引

本文只索引契约权威来源和兼容要求，不复制上游仓库的完整契约，也不改变任何现有接口。

## 前端请求契约

- 公共 API base 和请求行为：[`src/shared/api/`](../src/shared/api/)。业务端点封装位于所属的 `src/modules/<name>/`。
- 能力可用性权威：[`src/config/capabilities.ts`](../src/config/capabilities.ts)。Live、Demo、derived 和 unavailable 状态必须从这里判定。
- 组件不得硬编码后端域名；401 与认证失效由公共请求层统一处理。

## 兼容键与请求头

以下名称是现有兼容契约，不能直接改名：

| 用途 | 名称 |
| --- | --- |
| 登录态 localStorage | `linkyun_auth` |
| API base 运行时覆盖 localStorage | `linkyun-api-url-override` |
| 当前工作空间 localStorage | `linkyun_current_workspace_code` |
| 主题 localStorage | `linkyun-theme` |
| 用户认证请求头 | `X-API-Key` |
| 工作空间请求头 | `X-Workspace-Code` |

需要迁移 localStorage 键时，必须同时提供旧键读取、数据迁移和回滚方案。修改请求头、公共请求类型或既有端点契约前，必须检查所有调用方并补充相应的前端契约测试。

## 流式交互契约

需要认证的 SSE 以 [`src/modules/agent-runtime/stream-api.ts`](../src/modules/agent-runtime/stream-api.ts) 的 `fetch + ReadableStream + AbortController` 方式实现，从而支持 `X-API-Key` 和 `X-Workspace-Code`。原生 `EventSource` 无法满足自定义认证请求头要求，不作为兼容实现。

## OpenSpec 契约

- 当前仓库使用 change-local OpenSpec：`openspec/changes/<change>/specs/<capability>/spec.md`，配置入口为 [`openspec/config.yaml`](../openspec/config.yaml)。
- 适用变更必须先阅读对应 change 的 proposal、design、specs 和 tasks；实现完成后同步任务状态并执行 strict validation。
- 当前基线未确认 canonical `openspec/specs/` 主规格集。同步或归档是独立决策，不由实现完成自动触发。

## 上游 API 契约

- Linkyun Agent OpenAPI 的权威位置为上游仓库 `linkyun-agent:docs/openapi/openapi.yaml`；本仓消费该契约，但不复制或修改其内容。
- 当前只确认前端依赖该上游 API；自动化跨仓契约门禁尚未确认。若需要新增或调整接口，应在本仓记录前端契约和跨仓请求，由上游仓库独立处理。

## 变更约束

- Live 模式不能用 Demo fixture 或本地假写入替代缺失的上游能力。
- 后端返回的 UGC 字段直接展示；前端按钮、标题和空状态等 chrome 文案由本仓维护。
- 不记录或输出 API Key、JWT、工作空间邀请码或生产响应中的敏感数据。
