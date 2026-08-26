## 1. Contract and state model

- [x] 1.1 Add strict live-event request/response/status types, API methods, scoped query keys, and exact frozen payload mapping.
- [x] 1.2 Add pure validation, eligibility, status-label, snapshot reconciliation, and live-event error mapping helpers.

## 2. Creator interactions

- [x] 2.1 Make event-card CRUD draft-only and render a clear read-only pre-opening contract for non-draft Worlds.
- [x] 2.2 Add the owner/operator live-event composer with location and active-resident selectors, impact preview, explicit confirmation, exact fence binding, and no-Tick behavior.
- [x] 2.3 Add GET-backed unknown-result reconciliation and pending/selected/committed/rejected/expired event status display.

## 3. Verification and evidence

- [x] 3.1 Add API/model/component contract tests for payloads, validation, selection, confirmation, idempotency reconciliation, status gates, errors, and status labels.
- [x] 3.2 Add a QA report mapping Creator interactions to the frozen backend API and recording the refresh-without-fence limitation.
- [x] 3.3 Run targeted Vitest, lint, typecheck, build, strict OpenSpec validation, and git diff checks; fix all in-scope failures.
