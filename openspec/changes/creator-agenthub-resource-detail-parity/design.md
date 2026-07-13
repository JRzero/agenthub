## Context

The Resource Library already has marketplace and knowledge-base list views, but only exposes create, attach, and delete basics. The legacy Creator proves the backend supports full Creator Skill lifecycle operations and richer knowledge-document operations. AgentHub keeps the same workspace header model and demo/live capability boundary.

## Goals / Non-Goals

**Goals:**

- Complete Creator Skill configuration, status, and deletion in the existing Skills view.
- Complete knowledge-base editing, file ingestion, document detail, chunk inspection, and reindexing.
- Preserve workspace scoping and provide deterministic demo behavior.
- Keep components small enough to maintain independently.

**Non-Goals:**

- No backend endpoint or schema change.
- No markdown-renderer or upload dependency.
- No cross-import from the legacy Creator project.
- No Agent-level staged-skill behavior change.

## Decisions

- Use side panels and focused dialogs inside the existing Resource Library rather than add nested routes. This preserves the approved AgentHub information architecture and keeps resource context visible.
- Treat Creator Skill config as validated JSON because the backend contract accepts arbitrary objects and no schema-form dependency is available. Marketplace schema defaults are materialized during install so the initial record remains useful.
- Implement multipart upload with a dedicated fetch helper because the shared JSON client always sets `Content-Type: application/json`; the helper shall forward authentication and workspace headers without setting a multipart boundary manually.
- Load document chunks only when a document detail panel opens. This avoids fetching potentially large chunk sets for every list row.
- Keep destructive actions behind native confirmation and refresh local state after the backend succeeds.

## Risks / Trade-offs

- [Large documents can take time to index] → Keep processing status visible and expose an explicit reindex action.
- [Arbitrary skill config can be malformed] → Parse and validate JSON before sending and retain the last valid server value on failure.
- [Chunk pages can be large] → Request a bounded first page and expose total count in the detail panel.
