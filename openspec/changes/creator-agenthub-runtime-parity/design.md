## Context

The new Test & Evaluation route currently exercises only `/agents/{id}/simulate`. The legacy Creator additionally supports upload tokens, widget-driven inputs, rich outputs, test-user memory deletion, and a persisted chat console backed by sessions, streaming messages, and Edge-status events. These contracts already exist and must be reused without leaking credentials or fabricating live state in demo mode.

## Goals / Non-Goals

**Goals:**

- Share one typed attachment/widget/output model between simulation and runtime chat.
- Extend simulation payloads with resolved attachments and widget metadata.
- Add guarded test-user memory clearing.
- Add a persisted runtime-chat surface with session create/resume, history, streaming fallback, and SSE status.
- Keep all runtime requests workspace-scoped and all demo behavior write-free.

**Non-Goals:**

- No backend endpoint, schema, or authentication change.
- No microphone recording or speech generation endpoint.
- No new package for upload, streaming, audio, or widgets.
- No persistence of local demo sessions.

## Decisions

- Put reusable contracts and multipart upload helpers under `agent-runtime`; both Test and Runtime Chat consume them. This avoids copying legacy components across two new surfaces.
- Use `fetch + ReadableStream + AbortController` for message streaming and Edge event SSE because custom `X-API-Key` and workspace headers are required. Standard `EventSource` is not used.
- Fall back to the existing non-stream message POST only when the streaming request fails before a successful completion. Preserve the user message and expose retry-safe errors.
- Represent widgets with a small schema-driven renderer supporting file/image/document upload plus text, textarea, select, number, checkbox, and switch metadata inputs. Unknown widget types render an explicit unsupported state.
- Use the native HTML audio element with normalized backend URLs; no audio dependency is needed.
- Confirm memory deletion and resolve the backend test-user ID immediately before DELETE so the frontend never guesses user identity.
- Expose Runtime Chat as a mode inside the Agent Asset Test route, preserving the approved asset-level navigation while separating persistent chat from non-persistent evaluation.

## Risks / Trade-offs

- [Stream ends without a done event] → Treat it as incomplete and allow non-stream fallback only when no final response was accepted.
- [Attachment upload succeeds but send fails] → Keep the user-facing attachment metadata and allow retry; tokens remain backend-managed.
- [Widget schemas vary] → Support the legacy protocol fields and show unsupported types honestly.
- [SSE connection drops] → Keep chat usable and surface Edge status as optional transient telemetry.
- [Memory deletion is destructive] → Require confirmation and fetch the test-user ID at action time.
