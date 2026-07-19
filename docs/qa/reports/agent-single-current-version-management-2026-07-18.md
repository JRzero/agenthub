# Agent 单运行版本管理 QA 报告

日期：2026-07-18

## 范围

- 单一平台当前发布版本与单一可编辑草稿
- 草稿乐观并发保存、发布幂等和错误状态
- 版本历史、版本详情、从历史版本创建新草稿
- Client 跟随平台当前版本与确认状态
- 当前版本导出及内部存储路径无下载地址时的明确提示

## 规格与设计依据

- 产品方案：`product-design/docs/01-AgentHub/03-版本管理/当前方案/AgentHub-Agent单运行版本管理方案.md`
- 后端交接：`linkyun-agent/docs/cross-repo-requests/frontend-handoff-agent-single-current-version-2026-07-18.md`
- 设计参考：`docs/qa/design-reference/version-management-single-current/`
- OpenSpec：`openspec/changes/agent-single-current-version-management/`

## 自动验证

- `npm run lint`：通过
- `npm run typecheck`：通过
- `npm test -- --run`：37 个测试文件、146 个测试全部通过
- `npm run build`：通过
- `openspec validate --all --strict`：通过（最终复核见交付记录）

## 浏览器验证

- 已在 `1646 × 956` 视口、Demo 数据模式下逐页对照八张设计稿，完成版本页、构建草稿态、Client 运行页及发布/恢复/导出弹窗的视觉验收。
- 视觉证据与结论见 `docs/qa/reports/design-qa.md` 和对应 `docs/qa/images/*design-parity-2026-07-18.png`。
- Live 模式仍保持真实接口边界；本机后端 404 阻塞证据继续保留，待接口部署后补充端到端联调。

## 接口与上线前置条件

1. 部署后端交接文档中的版本、Client runtime-version 与 export 接口。
2. 执行迁移 `000110`、`000111`，并按后端交接要求对 active Agent 做 dry-run/backfill，确保 `current_version_id` 完整。
3. 部署后重新执行八张设计状态的桌面与窄屏视觉验收。
4. export 接口当前只保证内部 `storage_path`；在后端提供签名下载 URL 前，前端会明确显示“已生成但暂无可下载地址”，不会把内部路径当作公网链接。

## 结论

前端实现、自动门禁和 Demo 设计视觉验收已完成；真实接口联调仍需等待本机后端部署新端点。