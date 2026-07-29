## Context

Skill 配置弹窗当前将 `config_schema` 和现有 `config` 合并后自动渲染，并允许在 Creator Skill 默认配置与 Agent 覆盖配置之间切换。后端新增的 `credential_schema` 与 `config_schema` 平级，凭证由 Creator Skill 单独加密保存，响应只返回 `api_key_configured` 状态而不返回明文。

敏感凭证不能进入普通 `config`、Agent 配置、版本数据、URL、日志或浏览器持久化存储。前端只在用户当前打开的表单内短暂持有新输入值，并在请求完成或关闭弹窗时清除。

## Goals / Non-Goals

**Goals:**

- 根据 `credential_schema.properties` 在 Creator Skill 默认配置页渲染只写凭证字段。
- 支持 API Key 新增、轮换、留空保留和二次确认清除。
- 仅显示 `api_key_configured` 状态，不尝试获取或展示原 Key。
- 保证更新请求中的 `api_key` 位于顶层，普通 `config` 与 Agent 配置不包含凭证。
- 保存成功后清空输入并以响应状态刷新界面。

**Non-Goals:**

- 不在 Agent 级配置中增加凭证覆盖。
- 不实现凭证明文读取、复制、显示/隐藏切换或本地持久化。
- 不改变后端加密、权限和审计机制。
- 不推断未在 `credential_schema` 中声明的敏感凭证字段。

## Decisions

1. **凭证输入与普通配置使用独立状态**
   - 普通字段继续存入 `config` 状态。
   - 凭证只存在于弹窗组件的临时输入状态，初始化始终为空，不从 Creator Skill 或 Agent 数据回填。
   - 关闭弹窗、保存成功或切换到 Agent 配置时清空凭证临时状态。

2. **使用纯函数构造安全请求**
   - 根据 `credential_schema` 从普通配置中移除凭证同名字段。
   - 输入非空时生成顶层 `api_key: string`；留空时省略；确认清除时生成 `api_key: null`。
   - Agent 级保存沿用 `setStageSkills`，不接受任何凭证参数。

3. **清除操作独立确认并立即提交**
   - “清除 Key”按钮只在已配置状态显示。
   - 点击后使用确认对话框二次确认，确认后立即发送顶层 `api_key: null`，避免仅在本地标记却未真正清除。

4. **保存后保持弹窗可见并刷新状态**
   - Creator Skill 更新响应替换查询缓存和当前弹窗 Skill。
   - 弹窗立即清空密码输入，并展示响应中的最新“已配置/未配置”状态与成功提示。

5. **Schema 驱动标签和输入约束**
   - 标签优先使用 `title`，其次使用字段名。
   - `description` 仅作为辅助说明；`format: password` 使用密码输入框，遵循 `maxLength`。
   - 当前更新契约只支持 `api_key` 顶层字段；Schema 类型保持可扩展，但不会把其他凭证错误塞入 `config`。

## Risks / Trade-offs

- [旧数据的普通 `config` 或 Agent 配置中可能残留 `api_key`] → 渲染和保存前按 `credential_schema` 字段名剔除，避免继续显示或回写。
- [清除请求成功但响应缺少 `api_key_configured`] → 保留后端响应语义；测试锁定当前契约，缺失时不推断明文或本地缓存状态。
- [浏览器确认框被用户取消] → 不发送请求、不改变状态。
- [更新请求失败] → 输入仍保留在当前内存表单方便重试，但错误信息不拼接或记录凭证值；关闭弹窗即清除。

## Migration Plan

1. 扩展 Skill Schema 与更新请求类型。
2. 增加凭证隔离和请求构造纯函数及测试。
3. 更新默认配置页与保存流程。
4. 用后端返回的 `api_key_configured` 验证新增、轮换、保留和清除。

回滚时移除凭证 UI 与顶层更新字段；普通 Skill 配置和 Agent 配置流程保持原样。
