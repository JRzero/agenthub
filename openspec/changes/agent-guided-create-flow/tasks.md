## 1. Specification And Contracts

- [x] 1.1 Capture the approved four-step flow, candidate rules, autosave, resume, and unpublished completion requirements
- [x] 1.2 Record backend dependencies without inventing endpoint names or persisted fields
- [ ] 1.3 Validate the OpenSpec change with the repository CLI when available

## 2. Wizard Shell And State

- [x] 2.1 Add `/assets/create` and route Asset Library and Workbench creation actions to it
- [x] 2.2 Keep full workspace navigation while enforcing a fixed-height, no-page-scroll desktop wizard
- [x] 2.3 Add typed wizard state, validation, progression, candidate isolation, and dependency invalidation
- [x] 2.4 Add progress rail, task surface, preview, fixed bottom actions, and completion surface matching the six references

## 3. Basic Setup, Draft And Autosave

- [x] 3.1 Add the exact five basic-role inputs and generated-review editor
- [ ] 3.2 Integrate atomic basic generation and creating-draft establishment when the backend capability is available
- [ ] 3.3 Add serialized revision-aware autosave, clear save state, exit protection, save-and-exit, and resume
- [x] 3.4 Render honest unavailable state instead of creating empty Live Agents when the atomic contract is absent

> Live 说明：3.2 与 3.3 的服务端原子创建、Revision 自动保存和跨设备恢复仍依赖后端契约；Demo 隔离态已实现自动保存和刷新恢复。

## 4. Avatar And Character Sheet

- [x] 4.1 Add four-avatar candidate selection, regeneration, upload, asset-selection capability state, and explicit confirmation
- [x] 4.2 Add character-sheet candidate, large preview, regeneration, explicit confirmation, and required-step blocking
- [ ] 4.3 Reuse authenticated Motherland/media adapters while excluding transient candidates from saved draft payloads

## 5. Skills And Completion

- [x] 5.1 Add searchable Workspace skill selection with localized product fields only
- [ ] 5.2 Persist selected stable skill-version references when supported and keep Skip available
- [x] 5.3 Add unpublished completion summary and Test Agent / Professional Configuration destinations
- [ ] 5.4 Update Agent list/header rendering for creating and unpublished records without version/hash fallback

## 6. Verification

- [x] 6.1 Add reducer, validation, candidate, dependency, autosave, resume, and exit-protection unit tests
- [ ] 6.2 Add API contract and capability-boundary tests
- [ ] 6.3 Add shell, route, accessibility, and no-technical-skill-field component tests
- [x] 6.4 Compare all six states in the browser at the approved viewport and store QA evidence
- [ ] 6.5 Pass lint, typecheck, tests, build, and strict OpenSpec validation when the CLI is available

> 门禁说明：lint、typecheck、170 项测试和 production build 已通过；当前环境未安装 `openspec` CLI，因此 1.3 与 6.5 保持未完成。
