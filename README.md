# AgentHub

AgentHub 是 LinkYun 的独立 Creator 前端，用于构建、测试、管理和多端发行 Agent Asset。

工程采用两层工作区结构：

1. 工作空间：资产库、资源库、Clients、应用运营、分析、治理、收益和设置。
2. Agent Asset 工作区：概览、构建、测试、版本与发行。

后端由独立的 LinkYun Agent 服务提供，本仓库不包含后端代码。

## 技术栈

- Next.js 15、React 19、TypeScript
- Tailwind CSS 3
- TanStack Query
- Vitest
- npm + `package-lock.json`

## 本地启动

```powershell
npm install
npm run dev
```

默认访问 `http://localhost:3002`，默认后端为 `http://localhost:8080`。

需要覆盖后端地址时使用：

```powershell
$env:NEXT_PUBLIC_API_URL='https://api.example.com'
npm run dev
```

使用隔离演示数据：

```powershell
$env:NEXT_PUBLIC_AGENTHUB_DATA_MODE='demo'
npm run dev
```

## 常用命令

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## 目录

```text
src/                    应用路由、业务模块和共享组件
public/                 静态资源
docs/qa/                迁移审计、浏览器 QA 和设计对照证据
openspec/changes/       AgentHub 已完成变更的规格与任务
.codex/skills/          OpenSpec 工作流技能
```

## 兼容约定

- API base：`NEXT_PUBLIC_API_URL`
- API base 浏览器覆盖键：`linkyun-api-url-override`
- 登录态：`linkyun_auth`
- 当前工作空间：`linkyun_current_workspace_code`
- 请求头：`X-API-Key`、`X-Workspace-Code`
- 主题：`linkyun-theme`

Live 模式不会伪造后端未提供的数据；未接入能力会明确显示为待接入。Demo 模式的交互只保存在本地页面状态。
