## Why

AgentHub 当前版本页仍以本地推导或 Demo 快照表达版本历史，构建页也没有携带后端要求的草稿 Revision，无法安全接入已经完成的“唯一平台当前版本”后端契约。现在需要把草稿、发布、历史恢复、Client 跟随和导出统一到同一版本模型，避免把未发布修改或 Client 独立版本误认为线上状态。

## What Changes

- 接入 Agent 草稿 Revision、当前版本标识、草稿基础版本和内容 Hash，并在保存时执行乐观并发控制。
- 新增真实发布流程、发布确认与检查状态，发布成功后刷新 Agent 和版本历史。
- 重构版本页，展示平台当前版本、当前草稿、Version Hash、历史记录、版本详情与基于历史版本创建草稿。
- 调整构建页状态文案与操作，明确“线上仍运行当前版本”和“当前草稿”的边界。
- 接入 Client 跟随状态和平台当前版本导出入口，不提供 Client 独立选版本、更新或回退。
- 统一版本业务错误解析与用户提示，覆盖冲突、无变更、不兼容和历史版本不可用等分支。
- 保留 Demo 数据隔离；Live 模式只展示后端真实返回和真实写入结果。

## Capabilities

### New Capabilities

- `agent-version-lifecycle`: Agent 草稿并发保存、平台当前版本发布、版本历史、版本详情和基于历史创建草稿。
- `agent-client-version-following`: Client 跟随平台当前版本、同步状态和当前版本导出，不允许 Client 独立选择 Agent 版本。

### Modified Capabilities

无。

## Impact

- 影响 `src/modules/agents`、`src/modules/agent-build`、`src/modules/agent-versions`、`src/modules/agent-distribution`、公共 API 错误适配器和相关路由页。
- 接入 `GET/PUT /agents/{id}`、`POST /agents/{id}/publish`、版本历史/详情/创建草稿接口，以及 Agent Client 查询、运行版本和导出接口。
- 更新 `src/config/capabilities.ts`，将后端已交付的版本与 Client 能力标记为 Live。
- 增加契约测试、交互状态测试、设计参考和浏览器 QA 证据；不新增 npm 依赖，不修改后端字段。
