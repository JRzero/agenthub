## Why

AgentHub has a safe non-persistent simulation workspace, but Creators still need the legacy Creator for attachment-aware tests and real persisted chat sessions. Migrating the existing runtime contracts removes that dependency and completes the Agent Asset runtime workflow without backend changes.

## What Changes

- Add image/document attachment upload and resolution for tests and real chat.
- Load Agent widget specifications and submit widget attachments plus custom metadata.
- Render returned image, file, Word, and audio outputs.
- Add test-user lookup and guarded long-term-memory clearing in Test & Evaluation.
- Add a real runtime console for session create/resume, history loading, streaming send with non-stream fallback, and Edge status SSE.
- Preserve workspace headers, API-key security, demo isolation, and the existing backend endpoint shapes.

## Capabilities

### New Capabilities

- `agenthub-test-advanced-inputs`: Attachment, widget, generated-output, audio, and test-user memory operations in Test & Evaluation.
- `agenthub-runtime-chat`: Persisted Creator runtime sessions with history, streaming fallback, SSE status, attachments, widgets, and rich outputs.

### Modified Capabilities

None.

## Impact

- Extends `src/modules/agent-test` and adds a focused runtime-chat module surfaced inside the Agent Asset Test route.
- Reuses `/files/upload`, `/files/upload-document`, `/agents/{id}/skills/widgets`, `/agents/{id}/test-user`, `/users/{userId}/agents/{agentId}/memories`, `/sessions`, `/sessions/{id}/messages`, and `/user/events`.
- Adds no dependency, backend change, or legacy Creator edit.
