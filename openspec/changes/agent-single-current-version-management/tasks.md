## 1. Contracts and request infrastructure

- [x] 1.1 Extend Agent and build update types with version-state fields and expected draft revision
- [x] 1.2 Normalize both backend error-envelope shapes and preserve structured version error details
- [x] 1.3 Add typed version lifecycle APIs, Client APIs and query hooks with contract tests

## 2. Draft and publish lifecycle

- [x] 2.1 Update the build editor to save with optimistic concurrency and refresh on draft conflicts
- [x] 2.2 Add current draft/runtime status to the build workspace header and editor state
- [x] 2.3 Implement the publish confirmation flow, idempotency behavior, loading state and blocked error states

## 3. Version workspace

- [x] 3.1 Replace inferred version snapshots with the live platform-current and history data model
- [x] 3.2 Build the version overview/history/detail layout including first-publish empty state and copyable Hash
- [x] 3.3 Implement create-draft-from-history with unpublished-change confirmation and revoked-version handling
- [x] 3.4 Resolve version publisher metadata to a readable creator name instead of rendering the numeric creator id
- [x] 3.5 Resolve the build header draft-base label from `draft_base_version_id` instead of the platform current version number

## 4. Client following and export

- [x] 4.1 Replace per-Client release semantics with platform-current following and acknowledgement status
- [x] 4.2 Implement local Client current-version export and explicit no-download state for internal storage paths
- [x] 4.3 Update capability sources and remove independent Client version selection/update/rollback UI
- [x] 4.4 Support generic current-version configuration export without a Client while retaining optional local Client package export

## 5. Verification and evidence

- [x] 5.1 Add unit and interaction tests for save conflicts, publish payloads/errors, history restore and Client export contracts
- [x] 5.2 Verify responsive visual states against all eight references and save QA evidence/report
- [x] 5.3 Run lint, typecheck, tests, build and strict OpenSpec validation
- [x] 5.4 Add secret-sanitization coverage and verify the no-Client export flow
- [x] 5.5 Keep the export dialog within short viewports with a scrollable content region and persistent actions
