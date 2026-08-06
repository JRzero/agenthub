## Context

AgentHub is a Next.js App Router frontend with a shared authenticated Workspace shell, TanStack Query, and a single request layer that supplies `X-API-Key` and `X-Workspace-Code`. The accepted C slice remains stable. The frozen D–G Creator/Agent Owner contracts are implemented as live API code. Platform moderation remains deliberately absent from the P0 product surface.

## Goals / Non-Goals

**Goals:**

- Provide a Workspace-level Living World Creator and Agent Owner experience backed by the frozen C API.
- Preserve backend error codes, revision and idempotency semantics, and unknown-result recovery across all mutations.
- Make runtime, timeline/recap, lifecycle, review/report and Agent Owner surfaces operable through frozen D–G APIs with no live-mode mock path.
- Meet desktop/mobile, keyboard, focus, live-region, loading, stale, empty, partial, permission, conflict, rate-limit, offline, and reduced-motion requirements.
- Produce tests and browser evidence that distinguish implemented C–G behavior from the single pending platform capability.

**Non-Goals:**

- Implement or modify backend APIs, workers, database state, Viewer UI, or shared/production environments.
- Claim that a C launch request has created a runtime instance or initial event; bootstrap belongs to D.
- Synthesize runtime summaries, budgets, timelines, reviews, moderation outcomes, or successful mutations.
- Add npm dependencies, migrate existing storage keys, or place Living World under an Agent Asset route.

## Decisions

1. **Use a dedicated `living-worlds` module and thin App Router entries.** Domain DTOs, endpoint functions, query keys, readiness, error presentation, and interactive workspaces live together. Route files only pass public route params. This avoids leaking reusable contract logic into pages.

2. **Model C DTOs exactly and derive UI-only draft state in memory.** World identity is `world_code`; participant identity is `agent_code@version_no`. Internal ids are absent. Form state may remain in component memory across a failed request, but localStorage is not a World truth source. Refresh always reloads the API projection.

3. **Isolate queries by authenticated Workspace and public revision.** Keys begin with `living-worlds`, then `workspaceCode`, resource kind/code, and revision where the server exposes it. Account sign-out already clears the global QueryClient. Mutations invalidate projections instead of writing assumed server outcomes.

4. **Centralize stable error classification.** The adapter preserves `ApiError.status`, public `code`, allowlisted details such as `missing`, and `Retry-After`. UI maps status/code to Chinese impact-first guidance. 401 remains handled by the shared auth event; 403/404 share a non-enumerating state; 409 never overwrites local edits; 422 renders every missing reason; timeout/offline becomes an unknown outcome for mutations and requires a truth refresh before retry.

5. **Generate idempotency keys per user intent with Web Crypto.** Create/template, invitation decision, schedule, and launch operations retain one key while an intent is pending or being reconciled. A repeated click is disabled. After timeout the UI refreshes truth first; it does not silently generate a new key and resend.

6. **Separate readiness by callable backend surface.** Preparation, bootstrap, projection, barriers, owner review/report, visibility, and Agent Owner binding commands are `live`. Platform moderation is not advertised or rendered. Internal proposal/commit ports and missing enumerable queues are not surfaced as Creator controls and no guessed endpoint is called.

7. **Bootstrap only a verified launch request.** The C `POST /launch-requests` result is followed by the frozen D bootstrap command only after explicit confirmation. The returned instance identity, epoch, fence and state revision become the source for runtime barriers; timeout reconciliation refreshes World projection before any retry.

9. **Use allowlisted audience projections.** `/worlds/{code}/projection` is decoded only into Creator/operator/Agent-owner DTO unions. Timeline and health render from those allowlists; runtime-contract budgets are policy ceilings, not invented usage. Recap availability is represented only when returned by a frozen read path.

10. **Keep governance scope explicit.** Creator can set listed/unlisted/hidden, submit review material, and read owner-scoped reports. Backend-only platform status is normalized to the Creator-owned submission state; no moderation capability or disposition control is rendered.

8. **Use semantic responsive components.** The six-section editor uses a labeled `nav` with `aria-current=step`, error summary links, 44px mobile targets, and a sticky mobile action bar. Lists use semantic lists/cards rather than visually squeezed tables. Dialogs use the existing accessible dialog patterns and restore focus.

## Risks / Trade-offs

- **Frozen backend is an uncommitted candidate** → Pin each dispatched identity in QA documentation, stop dynamic evidence on drift, and do not broaden adapters beyond observed routes/DTOs.
- **C and the older UX endpoint description differ for schedule/start semantics** → Follow the newer frozen C OpenSpec and DTOs; label launch as pending bootstrap and record D as a blocker.
- **Large P0 route surface can imply completeness** → Every D–G panel includes a typed dependency status, and its QA script stays pending rather than PASS.
- **Network errors cannot prove whether a mutation committed** → Use unknown-result UI, keep user input, refresh the resource, and only enable retry after reconciliation.
- **No browser DOM test library is installed** → Cover domain/adapters/state helpers with Vitest and perform required browser/a11y verification against the running app without adding a dependency.

## Migration Plan

Additive routes, module files, navigation, and capability entries can ship without data migration. Rollback removes those additions; no backend or local persisted World data is changed. The task keeps all changes uncommitted and does not archive the OpenSpec change.

## Open Questions

- Final browser evidence is eligible only against the exact frozen backend identity. Neither AUTH-LYN-002-09 nor moderation controls are part of this frontend change.
- Full browser evidence requires an isolated local API and synthetic credentials supplied by the disposable test environment; none are read or embedded by this change.
