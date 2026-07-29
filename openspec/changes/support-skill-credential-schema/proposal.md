## Why

Creator Skill 的 API Key 等敏感凭证现在由后端通过独立的 `credential_schema` 描述并加密保存，不能继续被当作普通 Skill `config` 或 Agent 级配置处理。前端需要提供只写、状态可见的凭证管理界面，确保设置、轮换和清除操作符合新的安全契约。

## What Changes

- 扩展 Marketplace Skill 与 Creator Skill 类型，支持 `credential_schema`、`api_key_configured` 和顶层凭证更新字段。
- 仅在“技能默认配置”页渲染凭证字段，Agent 级配置页不展示或提交凭证。
- 对 `format: password`、`writeOnly: true` 的字段提供不回填的密码输入、配置状态、轮换和二次确认清除交互。
- 保存时将凭证字段放在 Creator Skill 更新请求体顶层，并区分新增/轮换、留空保留和明确清除三种语义。
- 保存成功后清空本地密码输入，并以最新响应刷新配置状态。
- 补充 API 请求体、状态转换和敏感值隔离测试。

## Capabilities

### New Capabilities

- `skill-credential-management`: 规定 Creator Skill 敏感凭证的 Schema 渲染、只写处理、状态展示和安全更新语义。

### Modified Capabilities

无。

## Impact

- 影响 `resources` 中的 Skill 类型与 Creator Skill 更新请求契约。
- 影响 `agent-build` 的 Skill 配置弹窗、全局配置保存流程和对应测试。
- 不修改 Agent 版本结构，不新增 npm 依赖，不将凭证写入前端持久化存储。
