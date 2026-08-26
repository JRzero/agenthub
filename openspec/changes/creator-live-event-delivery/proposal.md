## Why

Creator 当前把“开演前配置的后续事件卡”和“运行中的一次性现场事件”混在同一操作语境中，导致非草稿世界仍展示必然失败的编辑入口，并把状态或权限冲突误报为通用 500。后端 LYN-002-RE-B 已冻结现场事件候选链契约，现在需要让 Creator 按真实 runtime fence/revision 安全投放并准确对账。

## What Changes

- draft 世界继续提供预开演事件卡 CRUD；非 draft 世界只读展示事件卡并明确它们属于开演契约，隐藏所有创建、编辑和删除入口。
- 在 running/content_idle 的 World runtime 工作台新增 owner/operator 可用的现场事件投放区，使用当前居民选择器采集最多四名活跃参与者。
- 在提交前展示影响预览和一次明确确认；提交绑定当前 run epoch、fencing token、state revision 和稳定幂等键，且不自动触发 Tick。
- 对未知提交结果仅通过单项 GET 对账，展示 pending、selected、committed、rejected、expired 全状态，并为权限、生命周期、过期 fence/revision、预算/breaker、非法参与者和秘密文本提供精确中文错误。
- 补齐 API/组件契约测试和 QA 报告，不新增依赖、不访问真实环境或模型服务。

## Capabilities

### New Capabilities

- `living-world-live-events`: Creator 现场事件的状态门禁、居民选择、影响预览、确认提交、runtime 绑定、未知结果对账、状态展示和精确错误恢复。

### Modified Capabilities

None.

## Impact

- 影响 `src/modules/living-worlds/` 的类型、API/query keys、事件卡工作区、runtime console、现场事件组件及定向测试。
- 对接后端 `POST/GET /api/v1/worlds/{world_code}/runtime/live-events` 与单项 GET，不改变后端契约或自动调用 Tick。
- 增加 repo-local OpenSpec 与 `docs/qa/reports/` 证据；无 npm 依赖、全局认证、导航或工程配置变化。
