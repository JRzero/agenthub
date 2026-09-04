## Context

`src/modules/agent-versions/api.ts` 已封装版本生命周期、Agent Client、runtime version 和导出端点，`types.ts` 与 `model.ts` 也承载并发字段和稳定错误码语义。现有测试验证了若干调用，但没有一个机器可读的消费者投影把这些行为连接到 `linkyun-agent:docs/openapi/openapi.yaml`，Harness 也只能把上游关系标为笼统的 `partial`。

`HAR-06C-LA` 已提供未提交生产者候选基线 `1a15df62f4954ca0fbb13c35b58f62df5a506cee` 与权威 OpenAPI SHA-256 `e80b042cc1cf81f4da388073351d364c594e8d92541439c6a3499a84f4ac2b26`，但其状态仍是 `candidate_uncommitted`。实现必须完全离线、不改变运行请求或 UI，并保持绑定为 candidate/partial，直到生产者正式提交后复核。

## Goals / Non-Goals

**Goals:**

- 用仓内 JSON 投影固定版本模块所消费的端点、HTTP 方法、并发/幂等字段、稳定错误码和 Client runtime/export 语义。
- 对投影原始字节生成 SHA-256 sidecar，让同一候选内容在任意机器上得到相同摘要。
- 用行为级 Vitest 调用现有 API 封装并与投影比较，使实现或投影的单边漂移立即失败。
- 在文档与 Harness 中区分“消费者候选摘要”和“尚缺的生产者 OpenAPI 精确摘要”。

**Non-Goals:**

- 不复制完整上游 OpenAPI，不伪造 `HAR-06C-LA` 摘要。
- 不生成 API client，不改变现有 TypeScript public types、请求路径、请求体、错误文案或 UI。
- 不联网、安装依赖、访问真实 API、提交、发布或部署。

## Decisions

### 1. 使用最小消费者投影而不是复制完整 OpenAPI

在 `src/modules/agent-versions/` 相邻 fixture 中保存 JSON 投影，只包含该模块真正依赖的契约切片。投影的 `authority` 指向上游仓库与文件，精确记录 `HAR-06C-LA` 的候选基线和 SHA-256，`producer_status` 明确为 `candidate_uncommitted`，`binding_status` 明确为 `candidate-bound-to-uncommitted-producer`。

备选方案是从任务描述虚构一个上游摘要，或复制无法验证来源的 OpenAPI 片段；两者都会制造错误的已绑定证据，因此不采用。

### 2. 摘要覆盖 fixture 原始字节

sidecar 文件保存 fixture UTF-8 原始字节的 SHA-256。测试直接读取字节并计算摘要，避免对象键排序、换行平台或序列化实现造成歧义。fixture 使用仓库统一 LF 和结尾换行；任何变更都必须显式更新摘要。

生产者摘要与消费者摘要分开记录：前者证明上游权威 artifact 的身份，后者证明当前仓库投影的确定内容，不能互相替代。

### 3. 通过现有函数调用发现端点与方法

契约测试 mock 公共 `apiRequest` 和 `fetch`，调用版本模块的公开 API，再把观测到的 path/method 与 fixture 中按 operation id 查得的期望比较。这样不扫描实现字符串，也不改变运行请求行为；路径、方法或导出下载语义的破坏会在离线测试中暴露。

### 4. 分别固定关键语义

- 发布请求必须精确携带 `expected_draft_revision`、`expected_current_version_id`、`release_note` 和 `request_key`。
- 历史恢复必须携带 `expected_draft_revision` 与 `confirm_replace`；Client 更新必须携带 `expected_capability_hash`。
- 每个稳定版本业务错误码必须解析为专用用户提示，而不能回退到原始未知消息。
- Client runtime 继续从后端 `version` 表示平台当前版本，前端兼容 alias 必须由该对象派生。
- Agent 通用导出不要求 Client；Client 导出仅作为兼容端点；下载必须是认证 ZIP 且内部 `storage_path` 不是下载 URL。

## Risks / Trade-offs

- [生产者 OpenAPI 候选尚未提交，已核验摘要仍可能在正式提交前变化] → 保持 `candidate-bound-to-uncommitted-producer` / partial，记录候选基线与摘要，禁止描述为 committed、active 或 confirmed。
- [手工投影可能遗漏新操作] → 投影列出当前模块全部 API 封装；后续生产者摘要接入时应从权威 OpenAPI 重建切片并复核 operation coverage。
- [fixture 与测试同时被错误更新] → SHA-256 证明确定性而非正确性；正确性最终仍依赖 `HAR-06C-LA` 的生产者摘要和跨仓比对。
- [源码类型只在编译期存在] → 使用 `expectTypeOf` 固定 runtime/export 关键字段，并通过仓库 typecheck 共同验证。

## Migration Plan

1. 提交消费者 fixture、摘要 sidecar 和离线契约测试。
2. 更新契约索引与 Harness，保持上游关系为 partial/candidate。
3. 运行模块 Vitest、typecheck、OpenSpec strict 和统一验证入口。
4. 生产者候选正式提交后，重新计算权威 OpenAPI SHA-256；只有摘要仍匹配且消费者投影复核通过，才通过独立变更把 binding 状态提升为 confirmed。

回滚只需移除候选 fixture、测试和索引条目，不影响运行请求或持久数据。

## Open Questions

- `HAR-06C-LA` 未提交候选何时形成正式 commit，以及正式 artifact SHA-256 是否保持不变？
- 上游是否将 Client-specific export 继续定义为兼容端点，还是计划正式弃用？在权威摘要到达前，本候选保持现有兼容调用不变。
