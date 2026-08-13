## Why

AgentHub currently has no workspace-level Living World Creator or Agent Owner experience, so the frozen LYN-002-C preparation APIs cannot be operated or recovered through the frontend. The P0 UX contract also requires the later D–G surfaces to remain visible as explicit backend dependencies instead of being hidden or simulated in live mode.

## What Changes

- Add workspace-level Living World deep-link routes for world listing, blank/template creation, six-section draft editing, preflight, schedules, launch requests, event cards, the world console, and Agent Owner invitation decisions. Keep the current V1 navigation entry hidden until a separate release decision.
- Add a strict typed World API adapter, query-key isolation, stable error mapping, optimistic-revision conflict recovery, idempotency/unknown-result recovery, and no-mock capability readiness for the frozen C endpoints.
- Implement responsive and accessible request states for loading, background stale data, empty, partial, validation, authorization, conflict, rate-limit, server, offline, and unknown outcomes.
- Add real C-slice contract/component tests and QA evidence mapping for C-01..C-12, CM-01..CM-02, and the AgentHub responsibilities in X-01..X-04.
- Add typed D–G runtime bootstrap, projection/timeline/recap health, runtime barriers, public visibility, owner review/report, and Agent Owner binding/permission/recall/limited-change structures from the frozen G2 contract without exposing internal runtime material; dynamic evidence is paused while the backend receives the separate G3 public-discovery filter increment.
- Keep platform moderation outside the P0 Creator product surface: do not advertise or render a capability, disposition endpoint, or platform action control. AUTH-LYN-002-09 is also outside this frontend change.

## Capabilities

### New Capabilities

- `living-world-creator-workspace`: Workspace-level Creator and Agent Owner routes, real C API behavior, recoverable state handling, responsive/a11y requirements, and typed pending D–G boundaries.

### Modified Capabilities

None.

## Impact

- Adds `src/modules/living-worlds/` domain types, API/query adapters, route workspaces, and tests.
- Adds `/worlds`, `/worlds/new`, `/worlds/templates`, `/worlds/[worldCode]/*`, and `/world-invitations/[invitationCode]` routes without exposing a current V1 Workspace navigation entry.
- Extends the centralized capability matrix without adding dependencies or changing backend contracts.
- Keeps the accepted C slice intact and records the G2 D–G adapters as live contract code. Browser evidence is frozen only against the dispatched backend identity; platform moderation remains deferred to P1 and absent from this UI.
