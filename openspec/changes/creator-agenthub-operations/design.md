## Context

`07-client-operations-conversations.png` shows a dense conversation list, detail stream, and handling panel. The legacy Creator has equivalent session review mechanics but presents them as an isolated dashboard page.

## Decisions

1. Use `/sessions/shared` as the canonical creator list and mask users through display labels supplied by the API.
2. Load messages and user Prompt only after selecting a session.
3. Verification, session Prompt, user Prompt, and creator comments use existing write contracts.
4. The handling panel shows only derivable status, counts, labels, and explicit authorization copy.
5. Other operations tabs remain capability-boundary views until real endpoints exist.

## Risks / Trade-offs

- The design includes memory traces and audit events not returned by current APIs -> do not fabricate them.
- Creator comments are irreversible user-facing pushes -> preserve the old `[创作者评论]` prefix and selected-session targeting.
- Session list may be large -> local filtering is retained now; server pagination remains a later contract need.

## Migration Plan

Add the Operations layout over the placeholder, verify demo review/write flows, validate request contracts, and retain the old Creator unchanged for rollback.
