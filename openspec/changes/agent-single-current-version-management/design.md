## Context

后端已经提供“可编辑草稿 + 不可变历史版本 + 唯一平台当前版本”的完整 P0 契约，以及 Client 跟随和当前版本导出的 P1 契约。现有前端把版本历史标记为 unavailable，并从 Agent 当前字段推导 Demo 时间线；构建保存没有携带 `expected_draft_revision`，发行页仍保留按 Client 独立发布的旧心智。

设计稿统一为 1646×956 桌面布局，沿用 AgentHub 紧凑顶部信息栏、左侧工作区导航和既有表单/弹窗组件。实现必须保持 Live/Demo 隔离，不能在 Live 模式伪造历史版本、兼容检查或导出成功。

## Goals / Non-Goals

**Goals:**

- 让构建草稿保存具备 Revision 乐观并发控制，并明确草稿与线上运行版本的边界。
- 接入发布、历史列表/详情、基于历史创建草稿和版本业务错误分支。
- 让版本页忠实表达平台当前版本、唯一当前草稿、Version Hash、Session 绑定影响和 Client 跟随状态。
- 接入 Client 列表、运行版本与平台当前版本导出；删除 Client 独立选版本、单独更新和回退心智。
- 通过 TanStack Query 统一缓存更新与失效，确保构建、版本和发行页面状态一致。

**Non-Goals:**

- 不修改后端接口字段、版本号或 Hash 计算规则。
- 不允许前端选择 Session 版本或强制迁移既有 Session。
- 不实现历史版本直接设为当前版本。
- 不把 `storage_path` 当作公开下载地址，也不伪造本地运行包下载。
- 不解决测试环境尚未执行 migration/backfill 的部署问题。

## Decisions

### 1. 使用后端 Agent 作为草稿状态唯一来源

扩展公共 `Agent` 类型承载版本状态字段。每次保存将当前 `draft_revision` 序列化为 `expected_draft_revision`，成功后以响应 Agent 整体替换 Query cache 和编辑表单。发生 `DRAFT_CONFLICT` 时重新拉取 Agent 并保留明确提示，不自动覆盖或重试。

备选方案是在前端递增 Revision；该方案会与并发编辑和后端事务状态失配，因此不采用。

### 2. 版本 API 放在 agent-versions 模块

发布、历史、详情和创建草稿使用独立 typed API 与 Query hooks。列表只渲染摘要，详情按需读取完整快照。发布成功更新 Agent cache，并失效版本历史、详情和 Client 查询。

发布动作在弹窗打开时生成 `request_key`；同一次失败重试保留该 key，草稿再次发生变化后创建新的 key。

### 3. 公共请求层兼容两种错误信封

`apiRequest` 同时读取 `error.code/message` 和 `data.code/error`，并允许 `ApiError` 持有可选详情数据。版本页和构建页只依据规范化后的 `ApiError.code` 决定刷新、覆盖确认或兼容性提示，不在组件内重复解析原始响应。

### 4. 版本页面使用主从布局

版本路由上方显示平台当前版本/草稿摘要；左侧历史列表，右侧选中版本详情。当前版本提供编辑和导出入口，历史版本提供“基于此版本创建草稿”。没有平台当前版本时展示首次发布空状态。所有弹窗复用既有按钮、颜色、圆角和遮罩模式。

### 5. 构建页发布入口使用真实草稿状态

顶部操作改为放弃修改、保存草稿、测试草稿和发布草稿。编辑区显示“平台仍运行 vN”和“草稿 Hash 发布后生成”。只有发布成功更新平台当前版本；保存与测试不改变线上状态。

### 6. Client 只跟随平台当前版本

发行页从旧的多端独立发布矩阵收敛为 Client 列表与详情。托管 Client、远程 Client 和本地 Client 展示跟随/等待同步/已导出状态；不显示版本选择器。导出只调用选中本地 Client 的 `/exports`，结果展示记录元数据，不把内部存储路径渲染成下载链接。

### 7. Demo 与 Live 分离

Live 能力开关更新为真实 version history 与 client adapters；package export 仅在真实接口成功时显示完成。Demo 继续使用 fixture，但不得写入 Live cache 或 localStorage。

## Risks / Trade-offs

- [后端未完成 migration/backfill 导致历史 Agent 无当前版本] → 展示首次发布/部署错误状态，不增加永久兼容推导。
- [发布超时导致用户重复点击] → 同一发布尝试复用 `request_key`，按钮锁定并显示发布中。
- [列表接口携带大快照造成渲染压力] → 列表只计算轻量摘要，完整对象仅在详情区按需展示。
- [Client 能力变化导致发布检查过期] → 对 `CLIENT_CAPABILITIES_CHANGED` 失效 Client 查询并要求重新检查。
- [现有发行 Demo 与新真实模型冲突] → 保留公开分享等独立发行能力，但移除 Client 独立版本控制文案与操作。

## Migration Plan

1. 先扩展公共类型、请求错误和 typed API，并补契约测试。
2. 接入构建草稿 Revision 与发布动作，再重构版本页。
3. 接入 Client 跟随与导出页面，更新能力矩阵。
4. 执行 lint、typecheck、Vitest、build 和 OpenSpec strict validation。
5. 在本地 Live/Demo 两种数据模式验证主要状态；若后端环境未完成 backfill，记录为联调阻塞而不伪造数据。

回滚时可恢复旧版本/发行组件与能力开关；后端数据和接口不需要迁移或回滚。

## Open Questions

- 导出接口当前只返回内部 `storage_path`，真正可下载的签名 URL 或文件流需要后续后端契约。
- 发布兼容性错误的详情字段未在交接文档中固定，前端先展示规范化错误消息和可选详情，后续可补强结构化 Client 问题列表。
