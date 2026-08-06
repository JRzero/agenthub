## Context

The Build workspace already derives whether `继续发布` is allowed, and the Versions workspace already owns the authoritative publish dialog through `openPublish`. The missing link is a scoped cross-route signal: the current navigation loses the user's intent and the Versions workspace always initializes the dialog as closed.

The fix must not create a second publish implementation, persist state, or cause history navigation and refresh to reopen the dialog.

## Goals / Non-Goals

**Goals:**

- Carry an explicit publish intent from the unblocked Build check to the matching Agent Versions route.
- Open the existing publish dialog once and remove the intent immediately.
- Preserve direct Versions visits, cancellation, refresh, browser history, and existing page buttons.

**Non-Goals:**

- Changing publish APIs, DTOs, validation, version generation, Agent state, or server behavior.
- Submitting a publication during browser verification.
- Persisting publish intent in storage or global application state.

## Decisions

### Use an Agent-scoped query parameter

Build navigates to `/assets/{agentId}/versions?publishIntent={agentId}`. Versions accepts the intent only when its value exactly matches the current route Agent ID. A query parameter is explicit, reload-safe after cleanup, and does not require a global store or storage contract.

An unscoped boolean parameter was rejected because a copied or rewritten URL could otherwise activate the wrong Agent page.

### Consume with replace before opening the existing dialog

Versions uses a guarded effect to copy the current search parameters, remove only `publishIntent`, and call `router.replace` with the clean URL before invoking the existing `openPublish`. A component-local consumed guard prevents repeated effects during the replacement render.

Using `push` for cleanup was rejected because it would leave the intent URL in browser history and could reopen the dialog on Back/Forward navigation.

### Keep publish authority unchanged

The intent calls the same `openPublish` path as the Versions page buttons. It does not bypass compatibility checks, choose defaults, or submit the dialog.

## Risks / Trade-offs

- [React effect reruns while the URL replacement is settling] → Use a local consumed guard in addition to removing the query parameter.
- [Other query parameters are present] → Copy the current search parameters and remove only `publishIntent`.
- [A stale intent URL targets a different Agent] → Require exact equality with the current route Agent ID; otherwise leave the page closed.
