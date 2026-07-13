## Why

Application Operations remains a placeholder while the legacy Creator already supports shared H2A review, verification, messages, creator comments, and session/user Prompt patches. These workflows must move into the AgentHub client-operations context.

## What Changes

- Implement the approved conversation-management layout.
- Reuse shared-session, message, verification, push-message, and Prompt APIs.
- Add search, Agent/status filters, message review, creator comment, verification, and Prompt editing.
- Keep unsupported feedback, memory, campaign, and binding tabs explicit and non-writing.
- Keep demo mutations session-local.

## Capabilities

### New Capabilities

- `agenthub-operations`: Defines workspace-level shared-session review and creator handling.

## Impact

- Adds `src/modules/operations/` and the Operations route layout.
- Reuses existing backend contracts and current auth/workspace headers.
- Adds no backend, dependency, deployment, or legacy Creator change.
