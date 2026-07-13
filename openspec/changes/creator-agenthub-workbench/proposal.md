## Why

The new AgentHub has functional Agent Asset routes, but the workspace landing page and Agent creation entry are still placeholders. Creators need a real starting point for resuming work, reviewing actionable gaps, and creating the next Agent Asset.

## What Changes

- Replace the Workbench placeholder with the approved workspace dashboard.
- Reuse the workspace-scoped Agent list as the source for continue-building, pending tasks, and recent assets.
- Add the existing `POST /agents` contract for real Agent creation and route the result into Build.
- Keep performance metrics demo-only until an analytics endpoint exists.
- Support session-local Agent creation in demo mode without production writes.

## Capabilities

### New Capabilities

- `agenthub-workbench`: Defines workspace landing, derived task, recent asset, metric provenance, and Agent creation behavior.

## Impact

- Adds `src/modules/workbench/` and the Workbench route layout.
- Reuses current auth, workspace, Agent query cache, and existing backend Agent create contract.
- Adds no dependency, backend, deployment, or legacy Creator change.
