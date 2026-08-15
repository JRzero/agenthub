## 1. Consumer contract candidate

- [x] 1.1 Add the Agent version OpenAPI consumer projection with authoritative source metadata, explicit `HAR-06C-LA` dependency and deterministic SHA-256 sidecar
- [x] 1.2 Cover all version, listing lifecycle, Client runtime and export operations plus concurrency fields, stable error codes and semantic invariants in the projection

## 2. Offline contract gates

- [x] 2.1 Add Vitest assertions that discover endpoint paths and HTTP methods by invoking the existing version API wrappers
- [x] 2.2 Add Vitest assertions for concurrency/idempotency payloads, stable error handling and compile-time runtime/export response semantics
- [x] 2.3 Add Vitest assertions for generic versus Client-compatible export behavior and authenticated ZIP download behavior

## 3. Harness and contract index

- [x] 3.1 Register the consumer projection, digest, validation scope and candidate state in `docs/contracts.md`
- [x] 3.2 Register the partial version-contract consumer and `HAR-06C-LA` uncommitted-producer gap in `harness.yaml`

## 4. Verification

- [x] 4.1 Run the focused Agent version Vitest contract suite
- [x] 4.2 Run repository typecheck, OpenSpec strict validation and `./scripts/verify fast` or document any local dependency blocker without installing packages
- [x] 4.3 Confirm the final worktree remains un-staged and uncommitted and the original worktree's pre-existing `next-env.d.ts` and untracked artifacts are unchanged
