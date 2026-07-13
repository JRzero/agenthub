# Creator to AgentHub Frontend Migration Audit

Audit basis: the legacy Creator UI executable routes, components, and API calls, compared with `src`. Design-only AgentHub concepts are not counted as migrated backend features.

## Status legend

- Complete: production contract and primary frontend workflow are present in AgentHub.
- Partial: some real contract behavior exists, but the old Creator workflow still has missing actions or states.
- Missing: the old Creator production capability is not yet available in AgentHub.
- Reframed: the same production contract is available through a different AgentHub information architecture.

## Capability matrix

| Legacy Creator capability | AgentHub destination | Status | Remaining work |
| --- | --- | --- | --- |
| Login, registration, session restore, 401 cleanup, logout | Auth routes and providers | Complete | None |
| Workspace list, backend switch, invite-code view/refresh | Global topbar | Complete | None |
| Workspace-scoped Agent list, status filter, and create | Workbench and Agent Asset Library | Complete | None |
| Agent delete and cross-workspace transfer | Agent Asset actions | Complete | None |
| Agent basic identity, prompt, examples, memory, hidden, reasoning/tool visibility | Build workspace | Complete | None |
| LLM provider discovery and model selection | Build / Runtime | Complete | None |
| Agent avatar upload, crop, delete | Build / Media | Complete | None |
| Edge token copy and reset | Build / Runtime | Complete | None |
| Knowledge-base binding | Build / Knowledge | Complete | None |
| Pre-, mid-, and post-conversation skills | Build / Skills | Complete | None |
| Marketplace browse, detail, install/attach, Creator Skill edit/delete | Resource Library | Complete | None |
| Knowledge-base and document lifecycle, upload, reindex, chunks/detail | Resource Library | Complete | None |
| Agent simulate/test with attachments, widgets, audio, and memory reset | Test & Evaluation | Complete | None |
| Creator real chat session with streaming, SSE status, and attachments | Test / Runtime Chat | Complete | None |
| Shared H2A session review, verification, Prompt patches, Creator comments | Application Operations | Reframed | Complete for the all-shared-session contract |
| Moments publish/list/delete/comment | Build / Operations | Complete | None |
| Moment automatic schedule | Build / Operations | Complete | None |
| Motherland chat and topic generation | Build / Co-creation | Complete | None |
| Motherland avatar and narrative optimization | Build / Media and Co-creation | Complete | None |
| Character design spec and design sheet | Build / Media | Complete | None |
| Guest share link create/toggle/delete and local QR | Distribution | Complete | None |
| Creator profile, password, avatar upload/delete/crop | Settings / Personal profile | Complete | None |
| Theme selection and persistence | Settings / Appearance | Complete | None |

## Current conclusion

All executable legacy Creator capabilities, including authentication, Agent Build, resources, operations, advanced simulation, persisted Runtime Chat, profile, theme mode, and local share QR are implemented in AgentHub without backend changes.

Automated gates pass with 33 test files and 90 tests, strict OpenSpec validation, and a production Next.js build. Signed-in and isolated Demo browser QA now covers every migrated workflow, including local avatar selection, crop controls, 512 × 512 output, and persistent light, dark, and system appearance modes.

Every active OpenSpec task is complete, and no legacy Creator capability remains partial or missing from the AgentHub frontend migration.
