# 后端请求：Agent 专业配置自动保存与草稿预览契约 — 2026-07-22

> 状态：待后端 Agent 评估
>
> 发起方：AgentHub 前端
>
> 接收方：`linkyun-agent` 后端 Agent
>
> 目标：支持专业配置工作台统一自动保存、草稿 Revision 冲突控制，以及不产生正式会话的当前草稿预览。

## 1. 背景

AgentHub 专业配置交互已经锁定以下规则：

- 所有进入 Agent 版本的配置统一自动保存，不再保留手动“保存草稿”。
- 自动保存必须完整表达未保存、保存中、成功、失败和草稿冲突状态。
- 右侧实时预览使用最新一次成功保存的当前草稿。
- 预览不创建正式 Session，不进入会话管理、运营统计或真实用户记忆。
- 发布前必须确认所有自动保存已经完成，且使用最新 `draft_revision`。

当前通用 Agent 更新接口已经支持乐观锁，但技能、头像和角色设定稿等专用写接口尚未统一进入相同的草稿 Revision 模型，前端无法仅靠交互层保证草稿一致性。

产品与交互依据：

- `product-design/docs/01-AgentHub/02-专业配置/AgentHub专业配置前端Agent任务单.md`
- `product-design/docs/01-AgentHub/02-专业配置/AgentHub专业配置模式前端交互改造说明.md`
- `product-design/docs/01-AgentHub/03-版本管理/当前方案/AgentHub-Agent单运行版本管理方案.md`
- `product-design/docs/01-AgentHub/03-版本管理/当前方案/AgentHub-Agent版本管理前端接口文档.md`

## 2. 当前接口情况与缺口

### 2.1 已符合 Revision 模型

`PUT /api/v1/agents/{id}`：

- 要求 `expected_draft_revision`。
- Revision 不一致时返回 `409 DRAFT_CONFLICT`。
- 成功后返回完整 Agent。
- 可用于身份信息、角色系统提示词、运行配置、知识库绑定、长期记忆和已接入安全设置等字段。

### 2.2 尚未统一 Revision 的 Agent 级写操作

| 配置 | 当前接口 | 当前主要缺口 |
| --- | --- | --- |
| 对话前技能 | `PUT /agents/{id}/pre-skills` | 不接收 Revision，只返回 `message` |
| 对话中技能 | `PUT /agents/{id}/mid-skills` | 不接收 Revision，只返回 `message` |
| 对话后技能 | `PUT /agents/{id}/post-skills` | 不接收 Revision，只返回 `message` |
| 内置上传技能 | `POST /agents/{id}/pre-skills/add-builtin-*` | 不接收 Revision，无法进入统一保存状态 |
| 头像上传/删除 | `POST/DELETE /agents/{id}/avatar` | 返回 Agent，但无乐观锁校验 |
| 角色设定稿确认 | `POST /agents/{id}/character-design/save` | 返回 Agent，但无乐观锁校验 |

这些操作修改的内容会进入 Agent 草稿或发布版本，因此必须与 `PUT /agents/{id}` 使用同一套并发控制。仅在前端写入后重新 GET Agent 不能解决问题：如果后端没有原子增加 Revision，多页面修改仍无法被检测。

### 2.3 需要明确区分的非 Agent 草稿写入

- Creator 全局技能配置属于独立技能资产，不应触发某个 Agent 的自动保存状态。
- Agent 对技能的选择、阶段、具体版本引用和 Agent 覆盖配置属于 Agent 草稿。
- Motherland 生成中的候选内容不属于草稿；用户确认后的头像或设定稿成品才属于草稿。
- 朋友圈内容、排期和发布记录不属于 Agent 草稿与版本。

## 3. P0 请求：统一 Agent 草稿写操作契约

### 3.1 请求规则

所有会改变 Agent 草稿或版本内容的接口必须接收：

```json
{
  "expected_draft_revision": 12
}
```

JSON 接口放入请求体；头像等 multipart 接口可使用同名表单字段。若后端希望统一使用 `If-Match`，需要同步更新现有 `PUT /agents/{id}` 契约，当前阶段建议继续使用请求字段以降低改造范围。

### 3.2 原子事务规则

每个 Agent 草稿写操作应在同一事务中完成：

1. 锁定或原子校验当前 Agent 的 `draft_revision`。
2. Revision 不匹配时不执行任何业务写入。
3. 更新 Agent 字段、技能关联表或媒体引用。
4. 重新计算草稿内容状态或草稿内容 Hash（如当前实现需要）。
5. `draft_revision + 1`。
6. 返回最新完整 Agent 和本次写入结果。

不得先更新技能或媒体，再因 Revision 冲突只回滚 Agent 表而留下部分写入。

### 3.3 推荐成功响应

为减少前端针对不同接口编写分支，推荐统一返回：

```json
{
  "success": true,
  "data": {
    "agent": {
      "id": 123,
      "draft_revision": 13
    },
    "draft_revision": 13,
    "changed_sections": ["skills"],
    "saved_at": "2026-07-22T10:30:00+08:00"
  }
}
```

`agent` 应为前端现有 `GET /agents/{id}` 的完整可编辑 Agent 结构，避免局部响应造成缓存字段丢失。`changed_sections` 和 `saved_at` 为推荐字段，不是并发正确性的硬性依赖。

如果为了兼容现有前端仍直接返回 Agent，最低要求是返回新的 `draft_revision`，并保证所有 Agent 草稿写接口结构一致。

### 3.4 冲突响应

继续使用现有业务错误：

```http
409 Conflict
```

```json
{
  "success": false,
  "data": {
    "code": "DRAFT_CONFLICT",
    "error": "Draft revision changed",
    "current_draft_revision": 13
  }
}
```

要求：

- 冲突请求不得产生任何部分写入。
- 前端不会自动覆盖或静默重试。
- 前端将停止该 Agent 后续自动保存，并提示用户重新载入。

## 4. 各配置项建议

### 4.1 身份、人格、运行、知识、记忆和安全

继续通过 `PUT /agents/{id}` 部分更新即可。后端无需为每个字段增加独立接口，但应保证：

- 不传字段表示不修改。
- 显式 `null` 的解绑语义保持稳定。
- 成功响应包含完整 Agent 和新 Revision。

### 4.2 技能

短期建议保留现有阶段接口，但补齐 Revision 和统一响应，而不是要求前端同时再调用一次 `PUT /agents/{id}`。

请求示例：

```json
{
  "expected_draft_revision": 12,
  "mid_skills": [
    {
      "creator_skill_id": 31,
      "creator_skill_version_id": 45,
      "config": {
        "default_city": "上海"
      }
    }
  ]
}
```

需要后端确认：

1. Agent 发布时是否锁定 `creator_skill_version_id`，而不是只引用可变的 `creator_skill_id`。
2. Creator 全局技能配置变化后，历史 AgentVersion 是否仍能准确还原。
3. 内置技能添加接口是否可以并入阶段技能更新，减少一种特殊写路径。

如果技能资产当前没有不可变版本 ID，需要后端给出满足既有版本方案的替代内容 Hash 或快照规则。

### 4.3 知识

当前通过 `PUT /agents/{id}` 更新 `knowledge_base_id` 可以继续使用。需要后端确认发布快照锁定的是知识库确定版本引用，而不是运行时始终读取知识库最新内容。

### 4.4 头像和角色设定稿

建议现有确认/上传接口增加 `expected_draft_revision`，成功后返回完整 Agent 和新 Revision。

候选生成接口保持只生成临时结果，不增加 Revision：

- `POST /agents/{id}/avatar/generate-preview`
- `POST /agents/{id}/character-design/generate-spec`
- `POST /agents/{id}/character-design/generate-sheet`

只有以下确认操作增加 Revision：

- 确认头像上传或替换。
- 删除当前头像。
- 确认角色设定稿成品。

确认失败或冲突时，临时候选可以继续保留供用户查看，但不得替换当前草稿内容。

## 5. P0 请求：当前草稿实时预览

### 5.1 推荐复用接口

优先评估扩展现有：

```http
POST /api/v1/agents/{id}/simulate
```

该接口已有“不创建真实 Session”的基础语义，适合作为构建页实时预览入口。构建页不应调用正式 Session 创建和消息接口。

### 5.2 推荐请求

```json
{
  "expected_draft_revision": 13,
  "messages": [
    { "role": "user", "content": "你好" },
    { "role": "assistant", "content": "你好，有什么可以帮你？" },
    { "role": "user", "content": "介绍一下自己" }
  ]
}
```

如果当前接口只接受单条 `message`，可以先保留单轮预览；多轮消息不是本期 P0，不能因此改用正式 Session。

### 5.3 推荐响应

```json
{
  "success": true,
  "data": {
    "reply": "……",
    "used_draft_revision": 13,
    "usage": {
      "total_tokens": 120
    }
  }
}
```

`used_draft_revision` 用于前端确认回复确实来自当前成功保存的草稿。若请求 Revision 与当前服务端 Revision 不一致，建议返回 `409 DRAFT_CONFLICT` 或单独的 `PREVIEW_REVISION_MISMATCH`，不要悄悄使用其他 Revision。

### 5.4 数据隔离要求

草稿预览必须满足：

- 不创建 `sessions` 记录。
- 不创建正式消息记录。
- 不出现在应用运营的会话管理中。
- 不写入真实用户长期记忆或会话记忆。
- 不触发用户通知、朋友圈、会话分享和正式运营统计。
- 可记录脱敏的技术调用日志，但不得将其作为真实用户行为。

技能、知识、模型、记忆策略或系统提示词变化并成功保存后，前端会清空或重建预览上下文。

## 6. 前端配合方案

后端契约就绪后，前端将实现单 Agent 串行自动保存协调器：

1. 文本输入停止约 800ms 后保存。
2. 下拉、开关、资源选择和删除确认后立即保存。
3. 同一 Agent 同时最多一个保存请求在途。
4. 保存期间产生的新修改合并到下一次请求。
5. 每次请求使用上一次成功响应的 `draft_revision`。
6. 成功后以响应中的完整 Agent 更新 Query Cache 和预览来源。
7. `DRAFT_CONFLICT` 后停止自动保存，不自动覆盖。
8. 保存失败时保留本地输入，测试和发布暂时不可用。
9. 测试或发布前等待保存队列清空。

前端不会使用“专用接口成功后再额外 PUT Agent”来人为增加 Revision，因为两次请求不是同一事务，并会制造新的冲突窗口。

## 7. 后端验收用例

### 7.1 Revision 与事务

- [ ] 使用正确 Revision 修改 Agent 字段，成功且 Revision 增加 1。
- [ ] 使用正确 Revision 修改技能阶段，成功且 Revision 增加 1。
- [ ] 使用正确 Revision 确认头像或角色设定稿，成功且 Revision 增加 1。
- [ ] 使用旧 Revision 修改任一配置，返回 `DRAFT_CONFLICT` 且数据无变化。
- [ ] 两个并发请求携带相同 Revision 时只能有一个成功。
- [ ] 技能关联表写入失败时 Agent Revision 不增加。
- [ ] Agent Revision 更新失败时技能或媒体引用不落库。
- [ ] 成功响应中的 Agent 与随后 GET 的 Agent 内容和 Revision 一致。

### 7.2 版本边界

- [ ] Agent 发布快照包含技能和知识的确定版本引用。
- [ ] Agent 发布快照包含确认后的运行媒体成品和文件 Hash。
- [ ] 未确认的 Motherland 候选不进入草稿或版本。
- [ ] Creator 全局技能配置后续变化不改变历史 AgentVersion。
- [ ] 朋友圈内容和运营记录不影响 Agent Revision 或 Version Hash。

### 7.3 草稿预览

- [ ] 使用当前 Revision 可以预览当前草稿。
- [ ] 使用旧 Revision 不会静默预览其他草稿状态。
- [ ] 预览结束后数据库中没有新增正式 Session 和消息。
- [ ] 预览不写入真实用户记忆、运营统计或通知。
- [ ] 预览响应返回实际使用的 `used_draft_revision`。

## 8. 请后端 Agent 确认的问题

1. 是否接受所有 Agent 草稿写接口统一接收并原子更新 `expected_draft_revision`？
2. 专用接口统一返回完整 Agent 是否存在性能或兼容性问题？
3. 技能和知识当前是否已有不可变版本引用；发布快照实际锁定了哪些字段？
4. `POST /agents/{id}/simulate` 当前是否保证不创建 Session、不写用户记忆和运营统计？
5. `simulate` 是否可以增加 Revision 校验和 `used_draft_revision` 响应字段？
6. 头像、角色设定稿与技能关联更新能否和 Agent Revision 更新放入同一数据库事务？
7. 是否需要保留现有无 Revision 请求的兼容期；如需要，计划如何避免旧调用绕过并发控制？

## 9. 非目标

- 不要求重做 Agent 单当前版本模型。
- 不新增 Client 独立版本选择。
- 不把预览升级为正式会话管理。
- 不为朋友圈增加 Agent 版本语义。
- 不要求在本次请求中重做完整测试评估模块。

## 10. 期望后端交付

- 接口取舍与字段确认。
- 数据库事务和 Revision 更新策略。
- 兼容策略及 migration（如需要）。
- 接口文档和后端测试。
- 一份前端交接说明，列明已上线接口、请求示例、响应示例和错误码。
