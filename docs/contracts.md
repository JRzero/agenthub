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

### Agent Version OpenAPI 消费者候选

- 版本模块的最小消费者投影为 [`src/modules/agent-versions/openapi-consumer-contract.json`](../src/modules/agent-versions/openapi-consumer-contract.json)，确定性消费者摘要为 [`openapi-consumer-contract.sha256`](../src/modules/agent-versions/openapi-consumer-contract.sha256)：`a571d24411684a27dcc027c54121c60b8da8ec93d7cddeba4d68f3b67091896c`。
- 消费者投影绑定 AgentHub 基线 `2fc749a9691129fd5437491f67a93709a5499d87`，覆盖版本/上下架、Client CRUD 与 runtime version、Agent 通用导出、Client 兼容导出和 ZIP 下载共 12 paths / 14 operations，并固定发布/恢复/Client 更新并发字段、9 个稳定版本错误码及 runtime/export 语义。
- 离线门禁位于 [`src/modules/agent-versions/openapi-contract.test.ts`](../src/modules/agent-versions/openapi-contract.test.ts)。测试通过调用现有 API wrapper 发现端点与方法，并校验投影摘要、请求字段、类型和语义；它不访问网络或真实 API。
- 生产者候选来自 `LYN-HAR-001-HAR-06C-LA`：未提交候选基线 `1a15df62f4954ca0fbb13c35b58f62df5a506cee`，权威路径 `docs/openapi/openapi.yaml`，候选 OpenAPI SHA-256 `e80b042cc1cf81f4da388073351d364c594e8d92541439c6a3499a84f4ac2b26`，覆盖 14 paths / 16 operations。其状态只能记为 `candidate_uncommitted`，消费者绑定只能记为 `candidate-bound-to-uncommitted-producer` / `partial`，不得写成 committed 或 active。
- 生产者比当前消费者多 Agent Client heartbeat 与 acknowledgement 两个操作；它们是明确的“上游已覆盖、当前前端未消费”项，不是消费者 contract gap。当前消费者 14 个操作全部落在生产者候选范围内，`consumer_operations_outside_producer_candidate` 为空。
- 生产者版本生命周期稳定错误使用 `data.code` / `data.error`，RespondErrorCode 与导出错误使用 `error.code` / `error.message`；离线投影分别固定这两种信封。
- 只有生产者候选正式提交并再次核验 artifact SHA-256 后，才可通过独立变更提升绑定状态；不能因为候选通过 fast/full、vet 或总控只读核验就声称 active。

## 变更约束

- Live 模式不能用 Demo fixture 或本地假写入替代缺失的上游能力。
- 后端返回的 UGC 字段直接展示；前端按钮、标题和空状态等 chrome 文案由本仓维护。
- 不记录或输出 API Key、JWT、工作空间邀请码或生产响应中的敏感数据。
