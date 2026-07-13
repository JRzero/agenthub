## Why

The workspace Resource Library is still a placeholder even though the legacy Creator already exposes marketplace skills, Creator skills, Agent skill updates, knowledge bases, and indexed documents. These capabilities need a unified AgentHub asset surface.

## What Changes

- Implement the approved Resource Library navigation and Skills Library design.
- Reuse marketplace, Creator skill, Agent update, knowledge-base, and document endpoints.
- Support skill search/category selection, workspace installation, and Agent attachment.
- Support knowledge-base create/delete, document list, text/URL add, and document delete.
- Keep demo mutations session-local and mark media/templates unavailable without contracts.

## Capabilities

### New Capabilities

- `agenthub-resources`: Defines workspace-scoped reusable skill and knowledge asset management.

## Impact

- Adds `src/modules/resources/` and a Resource route layout.
- Reuses existing backend APIs and current auth/workspace headers.
- Adds no backend, dependency, deployment, or legacy Creator change.
