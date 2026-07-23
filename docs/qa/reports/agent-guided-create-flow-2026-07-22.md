# Agent 分步创建流程 QA 报告

## 验证范围

- 四步全页向导与固定视口
- 基础生成后创建中草稿状态
- 候选隔离与强制确认
- Demo 自动保存、刷新恢复与退出保护
- Workspace 技能选择与未发布完成态
- Live / Demo 能力边界

## 自动验证

- 定向测试：4 个文件、36 项通过
- 全量测试：40 个文件、170 项通过（使用 jsdom 所需的 Node localStorage 文件参数）
- ESLint：通过
- TypeScript：通过
- Next.js production build：通过
- OpenSpec strict validation：当前环境未安装 `openspec` CLI，未执行

## 浏览器验证

- 视口：1600 × 1200
- 浏览器：Codex 内置浏览器
- 主页面滚动：无，页面高度始终等于视口高度
- 续建：头像候选生成并自动保存后刷新，步骤、候选和选择均恢复
- 完成态：显示“未发布草稿”，未出现版本号或 Hash
- 技能：只显示资源库中的中文名称与产品说明

## 证据

- `docs/qa/images/agent-create-step-01-basic.jpg`
- `docs/qa/images/agent-create-step-02-review.jpg`
- `docs/qa/images/agent-create-step-03-avatar.jpg`
- `docs/qa/images/agent-create-step-04-character-sheet.jpg`
- `docs/qa/images/agent-create-step-05-skills.jpg`
- `docs/qa/images/agent-create-step-06-complete.jpg`

## 未完成的生产依赖

详见 `docs/cross-repo-requests/backend-request-agent-guided-create-flow-2026-07-22.md`。在接口接入前，Live 模式不会创建空 Agent 或以本地假数据伪装成功。
