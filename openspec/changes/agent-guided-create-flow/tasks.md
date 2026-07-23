## 1. Specification And Contracts

- [x] 1.1 Capture the approved four-step flow, candidate rules, autosave, resume, and unpublished completion requirements
- [x] 1.2 Record backend dependencies without inventing endpoint names or persisted fields
- [ ] 1.3 Validate the OpenSpec change with the repository CLI when available

## 2. Wizard Shell And State

- [x] 2.1 Add `/assets/create` and route Asset Library and Workbench creation actions to it
- [x] 2.2 Keep compact workspace navigation while enforcing a fixed-height, no-page-scroll desktop wizard
- [x] 2.3 Add typed wizard state, validation, progression, candidate isolation, and dependency invalidation
- [x] 2.4 Add progress rail, expanded task surface, fixed bottom actions, and completion surface; keep creation preview hidden

## 3. Basic Setup, Draft And Autosave

- [x] 3.1 Add the exact five basic-role inputs and generated-review editor
- [x] 3.2 Integrate atomic basic generation and creating-draft establishment when the backend capability is available
- [ ] 3.3 Add serialized revision-aware autosave, clear save state, exit protection, save-and-exit, and resume
- [x] 3.4 Render honest unavailable state instead of creating empty Live Agents when the atomic contract is absent

> Live 说明：3.2 已接入原子 `/agents/generate-basic-profile`，仅在生成成功后建立创建中草稿。3.3 已接入 `/creation-progress` 并支持从资产库恢复步骤和已确认内容；确认操作会立即保存。通用的防抖、串行 revision 自动保存队列尚未实现，因此任务保持未完成。

## 4. Avatar And Character Sheet

- [x] 4.1 Add single-avatar candidate preview, regeneration, upload, asset-selection capability state, and explicit confirmation
- [x] 4.2 Add character-sheet candidate, large preview, regeneration, explicit confirmation, and required-step blocking
- [x] 4.3 Reuse authenticated Motherland/media adapters while excluding transient candidates from saved draft payloads

## 5. Skills And Completion

- [x] 5.1 Add searchable Workspace skill selection with localized product fields only
- [x] 5.2 Persist selected stable skill-version references when supported and keep Skip available
- [x] 5.3 Add unpublished completion summary and Test Agent / Professional Configuration destinations
- [x] 5.4 Update Agent list/header rendering for creating and unpublished records without version/hash fallback

## 6. Verification

- [x] 6.1 Add reducer, validation, candidate, dependency, autosave, resume, and exit-protection unit tests
- [x] 6.2 Add API contract and capability-boundary tests
- [ ] 6.3 Add shell, route, accessibility, and no-technical-skill-field component tests
- [x] 6.4 Compare all six states in the browser at the approved viewport and store QA evidence
- [ ] 6.5 Pass lint, typecheck, tests, build, and strict OpenSpec validation when the CLI is available

> 门禁说明：本轮聚焦的 41 项测试、lint、typecheck 与 production build 已通过。完整测试套件有 131 项通过、48 项因测试环境 `window.localStorage` 未初始化而失败；当前环境未安装 `openspec` CLI，因此 1.3 与严格 OpenSpec 验证保持未完成。
