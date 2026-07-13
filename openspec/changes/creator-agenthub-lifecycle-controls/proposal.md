# Change: Restore workspace and Agent lifecycle controls

## Why

The legacy Creator supported backend workspace switching, invite-code management, Agent creation from the library, deletion, and cross-workspace transfer. The AgentHub shell currently exposes only part of that lifecycle.

## What Changes

- Call the existing backend switch endpoint when the global workspace changes.
- Add invite-code read, copy, and refresh from the topbar.
- Enable Agent creation and status filtering in the Asset Library.
- Add guarded Agent transfer and delete actions in the Agent Asset header.

## Impact

- Existing backend endpoints are consumed unchanged.
- Demo mode keeps destructive actions local to the query cache.
- No legacy Creator or backend files are modified.
