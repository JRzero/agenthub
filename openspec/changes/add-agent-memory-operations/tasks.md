## 1. Contract and data model

- [x] 1.1 Add the memory analytics capability source and an isolated Demo anonymous aggregate fixture
- [x] 1.2 Implement strict API response types and the authenticated Agent memory analytics endpoint wrapper
- [x] 1.3 Implement pure view-model conversion, denominator rules, label mapping, diagnostics, and error-state mapping
- [x] 1.4 Implement the TanStack Query hook with mode-separated caching, manual refresh support, no background automatic refresh, retry rules, and stale snapshot behavior

## 2. Agent Asset experience

- [x] 2.1 Add the `/assets/[agentId]/memory` route and Agent Asset “记忆服务” navigation entry
- [x] 2.2 Build the page header, Agent-context summary metrics, refresh controls, source state, and retrieval-time messaging
- [x] 2.3 Build relationship/emotion completeness, relationship stage, emotion formation, current diagnosis, and advice sections
- [x] 2.4 Build recent state, overall mood, aggregate signal, missing-module, no-sample, stale-data, error, and metric explanation states

## 3. Automated verification

- [x] 3.1 Add API contract and privacy-boundary tests
- [x] 3.2 Add model tests for partial, zero denominator, omitted segments, null values, dynamic distributions, diagnoses, and HTTP mappings
- [x] 3.3 Add state and interaction tests for terminology, manual-only refresh configuration, and stale snapshot behavior
- [x] 3.4 Run lint, typecheck, Vitest, production build, and fix all failures

## 4. Browser QA and specification validation

- [x] 4.1 Verify the default partial state in the real AgentHub shell (`3002` target; documented alternate port when occupied) and save final screenshots
- [x] 4.2 Verify no-sample or error state plus manual refresh interaction and browser console
- [x] 4.3 Write the final QA report, record real-backend integration status, complete this checklist, and run `openspec validate --all --strict`

## 5. Manual-only refresh follow-up

- [x] 5.1 Remove interval, focus, and reconnect refresh behavior plus automatic-refresh controls; update tests and QA documentation
- [x] 5.2 Re-run targeted tests, lint, typecheck, production build, strict OpenSpec validation, and browser QA
