## Context

Living World Creator 已有事件卡 CRUD、runtime projection 与只在本会话 bootstrap 后可用的 `runtimeFence` query cache。固定后端 `530871a` 新增不可变现场事件候选接口，但没有单独读取当前 instance fence 的端点；projection revision 也不是可替代的命令 fence。现场事件创建只进入候选链，不执行 Tick、不调用模型、不直接写时间线。

## Goals / Non-Goals

**Goals:**

- 把 draft 的预开演事件卡与运行中的一次性现场事件分成两个准确入口。
- 使用后端真实地点、活跃居民和 runtime fence/revision 构造严格请求，提供预览、一次确认、稳定幂等和 GET 对账。
- 让状态门禁、候选状态和常见错误对 Creator 可理解、可恢复并可键盘操作。

**Non-Goals:**

- 不新增 runtime fence 读取端点，不从 projection revision、旧事件或本地猜测命令身份。
- 不自动 Tick、不写时间线、不承诺居民响应，也不新增自由台词或结局编辑器。
- 不变更认证、全局权限、导航、依赖或其他业务模块。

## Decisions

1. **现场事件复用 runtime console 中的服务端真源。** 表单只在 world 为 `running`、projection health 为 `running` 或 `content_idle`、角色为 owner/world_owner/operator、且 query cache 中有当前 `run_epoch`、`fencing_token`、`state_revision` 时启用。替代方案是从 projection revision 或最近事件推测 fence；这会提交过期命令，故拒绝。
2. **居民和地点只通过选择器产生。** 地点来自 World content，参与者来自 projection 的 `public_residents` 且状态为 active，最多四个、去重。UI 不提供 code 文本输入，避免跨世界、已召回或格式错误的参与者。
3. **幂等键覆盖一个用户意图的完整生命周期。** 首次确认时生成稳定 key；服务端已知成功或确定性拒绝会结束该意图，未知结果则保留原 key 和提交快照。网络/超时等未知结果先 GET 列表并按提交快照精确匹配，找不到时保持未知和禁用再次 POST，只允许继续 GET 对账。已知 event code 使用单项 GET 更新状态。
4. **错误映射优先使用本地已知上下文与稳定后端 code。** 角色、生命周期、无 fence、字段/秘密文本、参与者选择在提交前给精确原因；`WORLD_CONFLICT` 映射为过期 fence/revision 或幂等 payload 冲突；`WORLD_INVALID_STATE` 映射为 runtime 状态、预算或 breaker 阻止；404 保持权限/下架不可枚举；未知连接结果进入对账态。后端未提供 invalid-state 子原因，前端不得虚构更细诊断。
5. **事件卡保留读取但按 world status 门禁写入。** draft 完整 CRUD；非 draft 只显示开演前配置快照及说明，不渲染创建、编辑、删除表单按钮。运行中现场事件位于 runtime console，避免把两种事件混成同一契约。

## Risks / Trade-offs

- [刷新页面后没有可恢复的 fence] → 明确禁用现场事件并说明需由后端提供只读命令身份或在当前会话完成 bootstrap；绝不猜测。
- [未知 POST 后列表中存在内容完全相同的历史事件] → 额外比较 exact runtime snapshot 与创建时间窗口；仍不唯一时保持未知，不自动重提。
- [后端把多种拒绝统一为 `WORLD_INVALID_STATE`] → 文案列出确切类别但不谎称具体命中项，提示刷新 runtime 真源。
- [projection 或事件状态随后变化] → 使用独立 query keys、手动 GET 对账和 mutation 后失效刷新，不本地伪造 selected/committed。

## Migration Plan

该变更是向前兼容的前端增量，无数据迁移。回滚时删除现场事件类型/API/query/component，并恢复事件卡 workspace 的旧渲染；后端候选不受前端回滚影响。OpenSpec 归档、部署和发布均不在本任务范围。

## Open Questions

- 后端未来是否提供当前 runtime command identity 的只读恢复端点，由后续跨仓任务决定；本轮固定契约不包含该能力。
