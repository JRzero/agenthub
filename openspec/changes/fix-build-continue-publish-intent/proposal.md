## Why

The Build publish check currently routes `继续发布` to the Versions workspace without opening the existing publish confirmation, leaving users stranded one step short of the intended flow. The cross-route publish intent must be explicit, scoped, and consumed exactly once.

## What Changes

- Carry a one-time publish intent when an unblocked Build publish check continues to the matching Agent Versions workspace.
- Consume and immediately remove that intent before opening the existing publish confirmation.
- Keep direct Versions visits, refresh/history navigation, modal cancellation, and the Versions page's own publish buttons unchanged.
- Preserve all existing publish checks, API contracts, server-side validation, and publishing behavior.

## Capabilities

### New Capabilities

- `agent-publish-handoff-intent`: Defines the scoped, one-time handoff from Build publish check to the existing Versions publish confirmation.

### Modified Capabilities

None.

## Impact

- Affects only the Build continuation URL and Versions workspace intent consumption.
- Adds focused route and interaction contract tests plus browser regression evidence.
- Does not change APIs, DTOs, storage contracts, publishing semantics, backend state, or dependencies.
