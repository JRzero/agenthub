## 1. Contract and API foundation

- [x] 1.1 Add allowlisted C DTOs, P0 content types, capability readiness, error classification, idempotency helpers, and Workspace/revision-scoped query keys.
- [x] 1.2 Implement the frozen C endpoint adapter for list/detail, create/update/publish, templates, Agent search, invitations/participants/decision drafts, preflight/start, recall, schedules, launch requests, and event cards.
- [x] 1.3 Add adapter and state-helper tests for exact paths/payloads, public-code identity, stable errors, preflight reasons, permission narrowing, unknown-result recovery, and no-mock readiness.

## 2. Workspace routes and preparation flow

- [x] 2.1 Add the Workspace “生活世界” navigation/capability and `/worlds` list with loading, stale, empty, filtered, error, and non-enumerating permission states.
- [x] 2.2 Add `/worlds/new` and `/worlds/templates` with blank/template creation, idempotency, reviewed preview, real empty/error states, and template conflict recovery.
- [x] 2.3 Add the refreshable six-section `/worlds/[worldCode]/edit` editor with limits, dirty guard, revision saves, error summary, conflict copy/reload recovery, responsive step navigation, and no localStorage truth.

## 3. Invitations and opening

- [x] 3.1 Add exact published Agent search/invite and invitation/participant status controls, including pending withdrawal and fixed-version unavailability guidance.
- [x] 3.2 Add `/world-invitations/[invitationCode]` for Agent Owner public identity, permission narrowing, decision-draft save, idempotent accept/reject, conflict recovery, and final binding summary.
- [x] 3.3 Add `/worlds/[worldCode]/preflight` with all stable reason mappings, publish, precise fix links, launch confirmation, and explicit pending-bootstrap launch-request results.
- [x] 3.4 Add `/worlds/[worldCode]/schedule` and `/worlds/[worldCode]/event-cards` with real C CRUD, revision/idempotency behavior, fixed timezone, and the three-card maximum.

## 4. Console boundaries and UX states

- [x] 4.1 Add `/worlds/[worldCode]` preparation console with real detail/participant/invitation data and typed pending D–G panels for runtime/actions/budget/timeline/review/stop/governance.
- [x] 4.2 Ensure all World mutations cover pending, disabled, success, failure, unknown-result truth refresh, idempotent convergence, 400/401/403/404/409/422/429/5xx/offline guidance, and retained input.
- [x] 4.3 Verify keyboard order, semantic live regions, 44px mobile targets, no horizontal overflow, 200% zoom, and reduced-motion behavior across the executable Creator and Agent Owner routes; record manual screen-reader coverage separately rather than implying it was automated.

## 5. Evidence and gates

- [x] 5.1 Add Vitest coverage for routes/components/state and record exact C-01..C-12, CM-01..CM-02, and AgentHub X-01..X-04 evidence status without marking missing D–G cases PASS.
- [x] 5.2 Run lint, typecheck, tests, build, strict OpenSpec, and diff checks; perform local real-C desktop/mobile browser verification when an authorized isolated backend is available.
- [x] 5.3 Record branch/HEAD/tree and uncommitted diff identity, implemented/verified C scope, console/network/a11y results, and pending D–G scripts without declaring complete H or Goal completion.

## 6. Frozen D–G integration

- [x] 6.1 Add allowlisted D–G DTOs, query keys and exact adapters for bootstrap, runtime contract/projection, lifecycle barriers, visibility, review/report, and Agent Owner binding/permission/recall/limited-change deep links.
- [x] 6.2 Replace pending console panels with real independent runtime health, policy budget, residents, timeline, review/report and lifecycle controls while retaining partial/error/stale truth.
- [x] 6.3 Add Creator governance visibility/review/report routes without advertising or rendering a platform moderation capability or disposition control.
- [x] 6.4 Add Agent Owner participant and limited-candidate deep-link routes with narrowing, recall, finite decision, revision/idempotency and non-enumerating recovery.
- [x] 6.5 Add D–G contract/state/component tests, no-secret/no-mock assertions and exact 400/401/403/404/409/410/413/422/429/5xx/offline/unknown-result recovery coverage.
- [x] 6.6 Run a disposable isolated backend and complete C-01..C-12, CM-01..CM-02 and AgentHub X-01..X-04 browser evidence; identify controlled browser fault injection explicitly, and treat unimplemented P1 platform moderation as N/A rather than a capability blocker.

## 7. R1 Creator mobile correction

- [x] 7.1 Reconcile the newer V1 hidden-entry decision with the Workspace-level deep-link contract and specify explicit full-width/min-width behavior for Creator detail loading, error, and populated states.
- [x] 7.2 Prevent Creator World detail roots, request notices, cards, long public codes, and key actions from min-content collapse; preserve 44px mobile targets and operable confirmation triggers.
- [x] 7.3 Add regression coverage and isolated synthetic browser evidence for 360/390/412/430px, desktop, 200% zoom, keyboard order, reduced motion, hidden entry, and absent platform moderation UI.
- [x] 7.4 Run lint, typecheck, full tests, build, strict OpenSpec, sensitive-pattern scan, diff check, and record the final clean candidate identity.
