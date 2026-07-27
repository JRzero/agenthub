# Client 与应用运营 V1 QA 报告

## 结果

**通过**

日期：2026-07-27

数据模式：Demo 主流程 + 临时 Live 失败态接口

视口：1440×900、1280×720、参考稿 1486×1058

## 产品验收清单

### Clients

- [x] 每行对应一条独立 AgentClient，保留 Client ID 与所属 Agent。
- [x] 不按名称、类型或 Client Key 合并。
- [x] 聚合查询允许单 Agent 失败，保留其他结果并支持局部重试。
- [x] 详情仅编辑名称、启用状态和现有配置字段；Key、类型和能力声明只读。
- [x] 更新携带预期 capability hash，并对冲突提供重新读取。
- [x] 导出平台当前运行版本。

### Agent 发行

- [x] Clients 与发行页复用同一 AgentClient 接口和记录语义。
- [x] 不提供历史版本选择、独立升级或回退。
- [x] 展示当前版本、Hash、最近确认、连接和同步状态。
- [x] 提供带当前 Agent 筛选的朋友圈管理入口。

### 应用运营

- [x] 页面明确为 OyiiOyii。
- [x] 会话管理和朋友圈管理保持真实可用。
- [x] 用户反馈、记忆问题和活动与渠道显示为明确的“规划中”占位页。
- [x] 占位页不请求未支持接口，不显示 Demo 成功态。
- [x] 隐藏应用端配置和设置入口。
- [x] 朋友圈页不触发会话接口，不因会话接口失败污染朋友圈错误状态。

### 朋友圈

- [x] 从 Agent 构建菜单移除；旧链接安全迁移并说明去向。
- [x] 管理列表只展示已发布内容。
- [x] 候选仅保存在页面状态，不显示草稿或自动保存。
- [x] 重新生成覆盖手改内容前确认。
- [x] 仅点击发布后调用创建接口。
- [x] 发布失败保留正文与素材，并允许重试。
- [x] 评论提交后立即展示真实结果；Demo 与 Live 缓存边界分离。
- [x] 删除使用不可恢复的真实删除语义和自定义二次确认弹层。
- [x] 不展示浏览量、审核、趋势或运营日志等无来源数据。
- [x] 朋友圈内容与互动不进入 Agent 版本。

### Live 数据边界

- [x] Live 成功反馈仅来自接口成功。
- [x] Live 不回退到 fixture 或本地假写入。
- [x] Demo 数据隔离在 fixtures 和页面 Demo 分支。
- [x] 无接口能力的规划入口明确标记不可用；应用端配置继续隐藏。

## 功能证据

| 场景 | 截图 |
| --- | --- |
| Clients 列表 1440×900 | `../images/client-operations-v1-clients-1440x900.png` |
| Client 详情 1440×900 | `../images/client-operations-v1-client-detail-1440x900.png` |
| 新建 Client 1280×720 | `../images/client-operations-v1-client-new-1280x720.png` |
| Agent 发行 1280×720 | `../images/client-operations-v1-distribution-1280x720.png` |
| 会话管理 1440×900 | `../images/client-operations-v1-sessions-1440x900.png` |
| 规划占位页 1280×720 | `../images/client-operations-v1-placeholders-1280x720.png` |
| 朋友圈管理 1440×900 | `../images/client-operations-v1-moments-1440x900.png` |
| 生成与编辑 1280×720 | `../images/client-operations-v1-moment-create-step1-1280x720.png` |
| 预览并发布 1280×720 | `../images/client-operations-v1-moment-create-step2-1280x720.png` |
| 发布失败保留内容 1440×900 | `../images/client-operations-v1-moment-publish-failure-1440x900.png` |
| 删除二次确认 1440×900 | `../images/client-operations-v1-moment-delete-confirm-1440x900.png` |
| 参考稿同尺寸并排对照 | `../images/client-operations-v1-design-comparison.png` |

## 自动验证

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm test`：44 个测试文件、193 项测试全部通过。
- `npm run build`：通过，18 个页面完成构建。
- `openspec validate --all --strict`：通过，20 项变更、0 项失败。

## 现有接口限制

- 工作空间没有 AgentClient 聚合接口，前端需逐 Agent 并发查询。
- AgentClient 重新启用没有独立后端端点时，前端使用现有 PATCH 启用语义。
- 朋友圈列表搜索和时间筛选只针对当前已加载页，不承诺全量历史搜索。
- 是否允许无图发布、自动配图错误信息与权限错误以真实后端响应为准。
- 首版没有朋友圈设置、排期、草稿、审核、下线、浏览量和运营日志接口，因此 UI 不提供这些能力。
