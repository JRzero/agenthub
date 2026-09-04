## Why

AgentHub 的版本模块已经消费 Linkyun Agent 的版本、Client runtime 和导出接口，但这些调用与类型目前只由手写单元测试保护，没有记录权威 OpenAPI 来源或可复现的消费者摘要。上游端点、并发字段、稳定错误码或 runtime/export 语义发生变化时，前端需要在离线验证阶段立即发现，而不是等到联调或生产失败。

## What Changes

- 为 `src/modules/agent-versions/` 增加版本化的 OpenAPI 消费者契约投影，记录权威来源、未提交生产者候选状态、生产者/消费者确定性 SHA-256 摘要和正式提交后的复核依赖。
- 增加离线 Vitest 契约门禁，校验端点与方法、乐观并发和幂等字段、稳定业务错误码、Client runtime 跟随语义及通用/Client 导出语义。
- 在 Harness 与契约索引中登记该消费者候选、验证入口和 `HAR-06C-LA` 上游摘要缺口。
- 不修改 UI、运行时请求行为、认证存储、依赖、锁文件或部署配置。

## Capabilities

### New Capabilities

- `agent-version-openapi-consumption`: 定义 AgentHub 版本模块如何离线绑定并验证 Linkyun Agent 权威 OpenAPI 的消费者投影。

### Modified Capabilities

无。

## Impact

- 影响 `src/modules/agent-versions/` 相邻契约 fixture 与 Vitest 测试、`docs/contracts.md`、`harness.yaml` 和本 change 的 OpenSpec artifacts。
- 上游权威契约仍位于 `linkyun-agent:docs/openapi/openapi.yaml`；本仓绑定 `HAR-06C-LA` 已提供精确 SHA-256 的未提交候选，并保持 `candidate/partial`，不宣称 committed 或 active。
- 不新增 npm 依赖，不改变任何现有请求、响应类型或用户界面行为。
