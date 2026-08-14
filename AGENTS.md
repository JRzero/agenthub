# AGENTS.md

> AgentHub 独立前端仓库的 AI 操作手册。产品介绍和启动方式见 [`README.md`](./README.md)，已完成变更的规格、设计与任务记录见 [`openspec/changes/`](./openspec/changes/)。

## Harness 导航

- 仓库责任、禁止范围和协作规则：本文件。
- Repository Harness 清单：[`harness.yaml`](./harness.yaml)。
- 已确认的架构边界：[`docs/architecture.md`](./docs/architecture.md)。
- 契约权威来源与兼容索引：[`docs/contracts.md`](./docs/contracts.md)。
- 统一验证入口：`./scripts/verify fast` 或 `./scripts/verify full`。

## 0. 项目与协作边界

- 本仓库是可独立安装、构建、测试和发布的 AgentHub 前端项目。
- 仓库维护前端源码、前端契约测试、QA 证据和 OpenSpec，不包含后端代码。
- 后端能力由 LinkYun Agent 服务提供；需要新增或调整接口时，在本仓记录前端契约和跨仓请求。
- 不引入指向其他源码仓库的相对路径依赖，不从其他项目直接 import 源文件。
- 迁移过程、个人开发环境和临时路径不属于稳定协作规则，不写入本文档。

## 1. 产品定位

AgentHub 是 LinkYun 的 Agent Asset 构建、管理与多端发行平台，不是某个单一应用端的后台。

产品采用两层结构：

1. **工作空间**：资产库、资源库、Clients、应用运营、分析、治理、收益和设置。
2. **Agent Asset 工作区**：概览、构建、测试、版本和发行。

OYIIOYII 等应用只是 AgentHub 的发行或运行客户端之一。新增功能不得把 AgentHub 重新收窄成单一聊天应用或单一 Creator 后台。

## 2. 技术栈与运行约定

| 项目 | 约定 |
| --- | --- |
| 框架 | Next.js 15 App Router + React 19 |
| 语言 | TypeScript，保持严格类型检查 |
| 样式 | Tailwind CSS 3 |
| 数据请求 | TanStack Query + `src/shared/api/` |
| 测试 | Vitest + jsdom |
| Node.js | 固定 `24.19.0`，`package.json` engines 为 `>=24.19.0 <25` |
| 包管理器 | npm，锁文件为 `package-lock.json` |
| OpenSpec | 固定仓内 `node_modules/.bin/openspec` 1.6.0，不依赖全局安装 |
| 开发端口 | `3002` |
| 默认后端 | `http://localhost:8080` |
| API 环境变量 | `NEXT_PUBLIC_API_URL` |
| 数据模式 | `NEXT_PUBLIC_AGENTHUB_DATA_MODE=live|demo` |
| 构建输出 | Next.js standalone |

常用命令：

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
npm run dev:webpack
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

默认使用 Turbopack 开发；只有排查 Turbopack 特有问题时才使用 `npm run dev:webpack`。

## 3. 目录边界

```text
src/
├── app/                 Next.js 路由、布局和页面入口
├── config/              能力矩阵和运行配置
├── fixtures/            明确隔离的 Demo 数据
├── modules/             业务能力模块
├── shared/              跨模块 UI、API、hooks 和工具
└── types/               跨模块公共类型

docs/qa/                 QA 报告、截图和设计参考
openspec/changes/        规格化变更的 proposal/design/specs/tasks
.codex/skills/           本仓 OpenSpec 工作流技能
public/                  静态资源
```

`src/modules/` 当前按业务能力划分：

- `agent-assets`：Agent Asset 列表和资产模型
- `agent-build`：构建工作区、提示词、知识、工具和协作能力
- `agent-test`：对话测试、评估和高级测试能力
- `agent-versions`：版本记录和版本操作
- `agent-distribution`：发布、渠道、分享和二维码
- `agent-runtime`：运行态与流式交互契约
- `resources`：模型、知识库、技能、MCP 等资源
- `workbench`：工作台聚合视图
- `operations`：Clients 和应用运营
- `analytics`、`governance`、`revenue`：平台经营与治理中心
- `workspace`、`settings`、`auth`：工作空间、设置和认证

业务实现优先放入对应 module；只有真正跨模块的代码才放入 `shared`。不要在页面文件中堆积可复用的 API、模型转换或复杂状态逻辑。

## 4. Live 与 Demo 边界

能力是否可用以 `src/config/capabilities.ts` 为唯一前端判定入口，并结合 `NEXT_PUBLIC_AGENTHUB_DATA_MODE`：

- `live`：只展示后端真实支持的数据与操作。
- `demo`：允许使用 `src/fixtures/` 中的隔离数据演示交互。
- 后端尚未提供的能力在 Live 模式必须明确显示 `unavailable`、待接入或只读状态。
- 不得用静态数组、随机数或本地假写入伪装成 Live 后端成功。
- Demo 数据和 Live 数据不得混入同一个持久化缓存或提交路径。

新增平台中心时，应先明确属于：真实后端能力、前端可推导能力、还是 Demo 展示能力，再实现 UI。

## 5. API、认证与兼容约定

公共请求逻辑集中在 `src/shared/api/`，业务端点封装放在对应 `src/modules/<name>/` 内。

固定兼容项：

| 维度 | 名称 |
| --- | --- |
| 登录态 localStorage | `linkyun_auth` |
| API base 运行时覆盖 | `linkyun-api-url-override` |
| 当前工作空间 | `linkyun_current_workspace_code` |
| 主题 | `linkyun-theme` |
| 用户认证请求头 | `X-API-Key` |
| 工作空间请求头 | `X-Workspace-Code` |

这些键是从旧 Creator 延续的兼容契约，不得直接改名。确需迁移时必须同时提供旧键读取、数据迁移和回滚方案。

API 规则：

- 统一通过 API base 解析逻辑生成 URL，不在组件中硬编码后端域名。
- 401 和认证失效由公共请求层统一处理，不在每个页面各写一套退出逻辑。
- 不记录或输出 `X-API-Key`、JWT、工作空间邀请码等敏感值。
- 后端返回的 UGC 字段直接展示；按钮、标题、空状态等产品文案属于前端 chrome。
- 修改公共请求类型或现有端点契约前，先检查所有调用方和对应测试。
- 若使用 SSE，必须采用支持 `X-API-Key` 的 `fetch + ReadableStream + AbortController`，不能使用无法自定义请求头的原生 `EventSource`。

## 6. 路由与界面结构

当前主要路由：

- 工作空间层：`/workbench`、`/assets`、`/resources`、`/clients`、`/operations`、`/analytics`、`/governance`、`/revenue`、`/settings`
- Agent Asset 层：`/assets/[agentId]/overview`、`build`、`test`、`versions`、`distribution`
- 认证：`/login`、`/register`

新增 Agent 级能力时优先放入 `/assets/[agentId]/...`；平台级能力放在工作空间层。不要把两层导航和状态混为一套页面。

旧 Creator 的 `/dashboard/*` 路由不是本项目的新信息架构。只有明确需要兼容历史外链时才增加重定向，并为重定向行为补测试。

## 7. OpenSpec 工作流

下列变更应走 OpenSpec：

- 新增或重构完整业务能力
- 公共 API 契约或关键数据模型变化
- 跨多个 module 的结构调整
- 路由、认证、数据模式或兼容策略变化
- npm 依赖或 Next.js、TypeScript、Tailwind 等工程配置变化

小范围文案、样式或明确的一行缺陷修复可以直接修改，但仍需运行与影响范围匹配的验证。

实施前：

1. `node_modules/.bin/openspec list` 确认是否已有对应 change。
2. 阅读该 change 的 `proposal.md`、`design.md`、`specs/` 和 `tasks.md`。
3. 不要跳过未确认的 artifact 阶段直接扩大实现范围。

实施后：

1. 更新 `tasks.md` 的完成状态。
2. 保证代码、规格和 `docs/qa/` 证据一致。
3. 执行 `node_modules/.bin/openspec validate --all --strict`。
4. 归档属于独立决策，不因代码完成而自动归档。

## 8. 验证与 QA

默认通过统一入口运行门禁：日常快速检查使用 `./scripts/verify fast`，完整交付检查使用 `./scripts/verify full`。统一入口不替代下面列出的底层命令及与改动范围相关的浏览器、视觉和契约验证要求。

代码变更提交前最低门禁：

```powershell
npm run lint
npm run typecheck
npm test
npm run build
node_modules/.bin/openspec validate --all --strict
```

验证要求：

- API 或模型变更必须补对应 Vitest 契约测试。
- 路由、布局和交互变更除自动验证外，还需在 `http://localhost:3002` 做浏览器验证。
- 视觉重构要与 `docs/qa/design-reference/` 对照，并把最终证据放入 `docs/qa/images/`。
- QA 结论写入 `docs/qa/reports/`，不要把截图散落到仓库根目录。
- 构建日志可临时写入 `*.log`，完成后清理；不要提交日志、`.next/` 或测试缓存。
- Windows 下发现中文乱码时，先以 UTF-8 或构建工具复核文件内容，不要凭终端显示直接重写文件。

## 9. Security

严禁提交：

- `.env`、`.env.local`、真实 API Key、JWT、Cookie 或私钥
- 真实用户手机号、邮箱、邀请码、会话内容或生产日志
- 录制自真实环境且未脱敏的 fixture、截图或网络响应
- `node_modules/`、`.next/`、`coverage/`、`*.log`、`tsconfig.tsbuildinfo`

测试中统一使用明显的假值，例如 `et_test_xxx`、`mock_jwt_xxx`。环境变量示例只能写入 `.env.example`，且不得包含有效凭据。

## 10. 修改边界

始终遵守：

- 只修改当前独立仓库内的文件。
- 保留用户已有的未提交修改，不清理或覆盖无关文件。
- 先阅读真实代码和现有测试，再判断是否缺失功能。
- 删除旧实现前先确认无 import、无路由入口、无兼容用途。
- 公共类型和能力状态保持明确，不用 `any` 隐藏契约问题。
- 使用 npm，不引入 pnpm workspace 或跨仓相对路径依赖。

需要先说明影响并获得确认：

- 新增 npm 依赖
- 修改 `next.config.ts`、`tsconfig.json`、`tailwind.config.js`、`.gitignore`
- 删除或修改已有公共 API、localStorage 键和请求头
- 大范围目录重构、数据迁移或 OpenSpec 归档
- 部署、推送远端或强制 Git 操作

禁止：

- 直接修改外部后端仓库来绕过前端契约问题
- 从其他仓库直接 import 源文件或建立本机路径依赖
- 用 Demo 数据掩盖后端能力缺失
- 为通过验证而删除测试、降低类型约束或忽略真实错误
- 主动 push、force-push 或删除用户分支

## 11. Git 与交付

- 默认分支为 `main`。
- 日常任务分支使用 `task/<topic>_<YYYY-MM-DD>`，其中 `<topic>` 使用小写 kebab-case，例如 `task/agent-share-link_2026-07-13`。
- 发布分支使用 `releaseYYYYMMDD`；同一天需要多个发布分支时追加递增序号，例如 `release20260713-2`。
- 不设置长期 `develop` 或 `test` 分支；任务分支从最新 `main` 创建，验证通过后合并回 `main`。
- 除非用户明确要求，否则不直接在远端 `main` 上提交或推送。
- Commit 应按目的拆分，推荐：`feat(agenthub): ...`、`fix(agenthub): ...`、`test(agenthub): ...`、`docs(openspec): ...`、`chore(agenthub): ...`。
- 不主动提交或 push；用户要求后再执行。
- 交付说明必须包含：修改范围、验证结果、尚未接入的后端能力、需要用户决策的后续项。
