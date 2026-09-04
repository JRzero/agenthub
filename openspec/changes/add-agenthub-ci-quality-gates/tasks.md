## 1. Reproducible Toolchain

- [x] 1.1 Declare Node `>=24.19.0 <25` and exact `@fission-ai/openspec` 1.6.0 in `package.json`.
- [x] 1.2 Regenerate lockfile v3 with npm package-lock-only, exact-version, and lifecycle-script-free flags under Node 24.19.0.
- [x] 1.3 Make `scripts/verify full` require, version-check, and invoke only the repository-local OpenSpec 1.6.0 executable without changing business-gate order.

## 2. Repository CI Candidate

- [x] 2.1 Add `AgentHub Quality Gates` with stable event-specific `AgentHub fast` and `AgentHub full` jobs.
- [x] 2.2 Apply read-only permissions, immutable official Action pins, fixed Node and environment values, finite timeouts, and lifecycle-script-free fresh installation without prohibited triggers or failure suppression.

## 3. Harness Documentation

- [x] 3.1 Update `harness.yaml` with the HAR-05B task/baseline, fixed Node/OpenSpec facts, fresh-runner prerequisites, and the repository workflow entry while keeping external CI `not_checked`.
- [x] 3.2 Update `AGENTS.md` only with stable Node, lifecycle-script-free `npm ci`, and repository-local OpenSpec requirements.

## 4. Static Verification

- [x] 4.1 Validate shell syntax, Harness v1 structure, sensitive/absolute-path scans, and verify usage failures.
- [x] 4.2 Parse and inspect the workflow with Ruby standard-library YAML for triggers, permissions, secrets, immutable pins, stable job names, and prohibited constructs.
- [x] 4.3 Run strict OpenSpec validation and confirm this change is apply-ready.

## 5. Fresh Runner Verification

- [x] 5.1 Run lifecycle-script-free `npm ci` under Node 24.19.0, then execute `./scripts/verify fast` and `./scripts/verify full`.
- [x] 5.2 Remove only task-generated build/install artifacts, run `git diff --check`, and confirm exactly the approved eleven paths remain unstaged with the accepted HEAD unchanged.

## 6. Independent Review Corrections

- [x] 6.1 Align proposal, design, and specification with branch-only push triggering, fixed runner selection, schema-valid Harness evidence, and explicit OpenSpec telemetry suppression.
- [x] 6.2 Remove the unsupported Harness endpoint property and pass the control repository's Repository Harness Schema v1 validator.
- [x] 6.3 Restrict workflow push triggering to branches, pin the runner to `ubuntu-24.04`, and extend static event assertions to exclude tags.
- [x] 6.4 Export `OPENSPEC_TELEMETRY=0` and `DO_NOT_TRACK=1` for repository-local and workflow OpenSpec execution.
- [x] 6.5 Repeat strict, fresh-runner, workflow security, scope, cleanup, and final Git validation without executing lifecycle scripts.
