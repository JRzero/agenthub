## Context

The Build workspace currently routes `发布为新版本` directly to the Versions workspace. The selected design keeps the existing editor and preview layout, but temporarily replaces the preview contents with a small publish check before that navigation occurs.

The frontend can derive draft validation locally, resolve selected knowledge bases from the existing options query, read Agent Client impact through the existing Agent Client query, and retain a frontend-derived test summary for the current draft revision. The actual immutable version creation and server-side Client compatibility validation remain in the Versions workspace.

## Goals / Non-Goals

**Goals:**

- Add an explicit, reversible publish-check state without changing either navigation rail.
- Summarize four fixed categories in a low-density right panel.
- Block continuation for local draft validation failures and failed safety evaluation.
- Keep checks traceable to real frontend or backend-derived state in both Live and Demo modes.
- Send users to the relevant editor section or Test workspace to resolve an issue.

**Non-Goals:**

- Publishing directly from the Build workspace.
- Replacing server-side version and Client compatibility checks.
- Adding new backend endpoints or persisting a new publish-readiness record.
- Treating absent test history as a successful test.
- Editing configuration inside the publish-check panel.

## Decisions

### Use a temporary mode in the existing preview panel

`BuildWorkspace` owns a `preview | publish-check` state. The initial publish action switches to `publish-check`; the panel retains its current width and collapse behavior. Users can switch back to realtime preview without losing editor state.

This keeps the existing workstation structure intact and avoids introducing another route or modal before the existing Versions publish flow.

### Derive a small typed check model

A pure model function produces four ordered check groups:

1. Basic configuration from `validateBuildDraft`.
2. Capabilities and resources from the saved draft plus currently loaded resource options.
3. Tests and safety from the latest frontend-derived evaluation for the same Agent and draft revision.
4. Online impact from enabled Agent Clients.

Each group exposes a label, state, supporting text, optional action, and whether it blocks continuation. The component renders a single divided list instead of nested cards.

### Keep test evidence session-scoped and revision-aware

When Test generates an evaluation, the frontend stores only the summary needed for publishing in `sessionStorage`, keyed by Agent ID and draft revision. The summary contains no conversation content. Build ignores summaries for a different revision and shows `尚未测试` rather than claiming success.

This provides honest same-session continuity without adding a persistence contract or mixing Demo and Live data.

### Preserve the existing publish authority

If no local blocker remains, `继续发布` routes to `/assets/{agentId}/versions`, where the existing publish confirmation and server compatibility checks remain authoritative. Local Client counts are informational and can never override the server result.

## Risks / Trade-offs

- [Test evidence disappears when the browser session ends] → Show `尚未测试` and a direct `前往测试` action; do not fabricate a passed state.
- [Resource availability can change after the check renders] → Treat the local check as guidance and preserve server-side publish validation.
- [Client queries may be loading or unavailable] → Show an honest loading/unavailable state and keep the category informational.
- [The extra mode could hide preview unexpectedly] → Enter it only from the publish action and provide an explicit `实时预览` switch.
