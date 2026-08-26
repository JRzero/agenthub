# LYN-002-RE-H Creator 现场事件投放 QA 报告

## 固定身份

- 前端起始 commit：`087e01867c3bc2e07b7995ef8a59b1a49aa06a31`
- 前端起始 tree：`dd97d047a953abd9700b580604323b20dbb9fcea`
- 后端 OpenAPI commit：`530871a7250c3b911ee5f4cb3ddd638e2046001e`
- 后端 OpenAPI tree：`57d6eea340198f49fa47834c3381c2d423a51895`
- 数据边界：只读查看固定后端 worktree；未访问真实环境、凭据或 LLM。

## Creator 交互映射

| 场景 | 前端行为 | API / 真源 |
| --- | --- | --- |
| draft 事件卡 | 完整 CRUD，保存前再次检查 world status | 既有 `/worlds/{world_code}/event-cards` |
| 非 draft 事件卡 | 只读显示“预开演事件卡”，不渲染编辑/删除/创建表单 | GET event cards + World detail status |
| 现场事件资格 | owner/world_owner/operator；World `running`；runtime health `running`/`content_idle`；必须有服务端 fence | World detail、projection、当前会话 bootstrap 写入的 `runtime-fence` query |
| 地点与居民 | 地点来自 World content；0–4 居民来自 projection active residents；无 code 文本输入 | World detail + `/worlds/{world_code}/projection` |
| 影响预览与确认 | 展示标题、地点、公开开端、居民、最大影响、TTL，并明确候选链/不保证响应/不 Tick | 纯前端确认，不发送请求 |
| 投放一次 | 一次 POST，绑定 `run_epoch`、`fencing_token`、`expected_revision`、稳定 `idempotency_key` | `POST /worlds/{world_code}/runtime/live-events` |
| 未知结果 | 保留 request snapshot 与幂等键，禁用 POST；列表 GET 精确匹配，不能唯一匹配则继续未知 | `GET /worlds/{world_code}/runtime/live-events` |
| 已知事件对账 | 单项 GET 更新 pending/selected/committed/rejected/expired，不伪造时间线 | `GET /worlds/{world_code}/runtime/live-events/{event_code}` |

## 错误与状态映射

- 本地门禁：无权限、draft/published/paused/blocked/archived/takedown、非 running/content_idle、无 fence 分别给出中文原因并阻止 POST。
- `400 WORLD_INVALID_REQUEST`：指向严格字段、地点、活跃居民、最大影响、TTL 或公开文本；秘密/私有/系统/凭据标记有前端专门提示。
- `404 WORLD_NOT_FOUND`：保持资源/权限/下架不可枚举，不泄露 World 是否存在。
- `409 WORLD_CONFLICT`：提示过期 fence/revision 或同幂等键 payload 改变，刷新真源且不自动重提。
- `409 WORLD_INVALID_STATE`：准确限定为 runtime 状态、预算/breaker 或失效地点/参与者类别；固定后端没有子原因字段，前端不虚构具体命中项。
- 网络/超时/5xx：进入未知对账态，保留表单和稳定幂等键，不误报字段错误，不重复 POST。

## 自动验证

- `npm run lint`：PASS。
- `npm run typecheck`：PASS。
- Living World 定向 Vitest：PASS，5 files / 41 tests。
- `npm test`：PASS，64 files / 316 tests。
- `npm run build`：PASS，Next.js 生成 21/21 静态页面；只有仓库既有的 Next ESLint plugin 提示。
- `openspec validate --all --strict`：PASS，30/30 changes。
- `git diff --check`：PASS。
- npm 门禁均在 `/private/tmp` 验证副本复用同仓已有本地 `node_modules`；当前 worktree 未安装或新增依赖。

## 已知限制与人工验证边界

- 固定 OpenAPI 没有“刷新后读取当前 runtime command identity”的只读端点。刷新后只有 projection revision，不能安全替代 `run_epoch/fencing_token/state_revision`；因此表单明确禁用，绝不从旧事件或 projection 猜 fence。
- 未知 POST 丢失响应时没有按 idempotency key 查询端点；列表 GET 只能按完整 runtime/payload snapshot 与创建时间窗口唯一匹配。存在多个完全相同的近期候选时保持未知，不自动重提。
- `WORLD_INVALID_STATE` 将 runtime 状态、预算、breaker、地点和参与者失效合并为一个稳定 code，UI 只能准确说明类别而不能断言具体子原因。
- 合同指定人工浏览器验证由 `LYN-002-RE-Q` 完成；本任务不访问真实环境、不启动浏览器或后端服务。

## 安全检查

- UI 不展示 API key、JWT、Cookie、隐藏真相、私有记忆、版本 hash 或内部数据库 ID。
- 现场事件仅允许公开可观察文本；错误与对账消息不回显认证材料。
- 未调用 Tick、模型、真实环境、部署、发布、push、PR、merge 或 rebase。
