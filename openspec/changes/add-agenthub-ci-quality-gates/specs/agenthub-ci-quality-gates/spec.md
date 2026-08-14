## ADDED Requirements

### Requirement: Stable event-specific quality gates
The repository SHALL define an `AgentHub Quality Gates` workflow whose stable `AgentHub fast` job runs `./scripts/verify fast` for ordinary non-`main` branch pushes and whose stable `AgentHub full` job runs `./scripts/verify full` for pull requests targeting `main` and branch updates to `main`; the workflow MUST NOT run for tag pushes.

#### Scenario: Ordinary branch push
- **WHEN** a commit is pushed to a branch other than `main`
- **THEN** the workflow selects `AgentHub fast` and does not select `AgentHub full`

#### Scenario: Pull request to main
- **WHEN** a pull request targets `main`
- **THEN** the workflow selects `AgentHub full` and does not select `AgentHub fast`

#### Scenario: Main branch update
- **WHEN** a commit updates `main`
- **THEN** the workflow selects `AgentHub full` and does not select `AgentHub fast`

#### Scenario: Tag push
- **WHEN** a tag is pushed
- **THEN** the workflow is not triggered

### Requirement: Least-authority workflow
The workflow SHALL grant only top-level read access to repository contents and MUST NOT request write permissions, packages, deployments, OIDC, environments, secrets, artifacts, caches, release or deployment triggers, scheduled or chained workflows, parameterized manual dispatch, continued-on-error behavior, or silent failure paths.

#### Scenario: Static security review
- **WHEN** the workflow syntax tree is inspected locally
- **THEN** it contains only `contents: read` authority and none of the prohibited triggers, permissions, secret references, persistence features, or failure suppression constructs

### Requirement: Immutable official Action inputs
Every Action used by the workflow SHALL come from an official `actions/*` repository and SHALL be pinned to a verified full 40-character commit SHA.

#### Scenario: Action reference inspection
- **WHEN** each workflow `uses` reference is inspected
- **THEN** checkout resolves to `actions/checkout@11d5960a326750d5838078e36cf38b85af677262` and Node setup resolves to `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020`

### Requirement: Reproducible lifecycle-script-free runner
Every quality-gate job SHALL run on `ubuntu-24.04`, set `CI=true`, `NEXT_TELEMETRY_DISABLED=1`, `OPENSPEC_NO_COMPLETIONS=1`, `OPENSPEC_TELEMETRY=0`, and `DO_NOT_TRACK=1`, use Node 24.19.0, impose a finite timeout, and install the locked dependency tree only with `npm ci --ignore-scripts --no-audit --no-fund`.

#### Scenario: Fresh runner bootstrap
- **WHEN** a quality-gate job starts without an existing dependency directory
- **THEN** it installs the lockfile under Node 24.19.0 without executing install or postinstall lifecycle scripts before invoking the selected verification profile

#### Scenario: OpenSpec execution without telemetry
- **WHEN** either quality-gate job reaches repository verification
- **THEN** OpenSpec executes with `OPENSPEC_TELEMETRY=0` and `DO_NOT_TRACK=1`

### Requirement: Repository-local OpenSpec full verification
The package SHALL declare Node `>=24.19.0 <25` and exact development dependency `@fission-ai/openspec` 1.6.0, and `./scripts/verify full` SHALL validate and invoke only `node_modules/.bin/openspec` version 1.6.0 with `OPENSPEC_TELEMETRY=0` and `DO_NOT_TRACK=1` while preserving the existing business-gate order.

#### Scenario: Full verification with matching local CLI
- **WHEN** the locked dependencies provide executable `node_modules/.bin/openspec` version 1.6.0
- **THEN** full verification runs lint, typecheck, tests, build, and strict OpenSpec validation in the established order

#### Scenario: Full verification without matching local CLI
- **WHEN** the local OpenSpec executable is missing, unusable, or not version 1.6.0
- **THEN** full verification fails without consulting or installing a global OpenSpec executable

### Requirement: Candidate status remains distinct from remote enforcement
Repository Harness documentation SHALL register the locally present repository-owned workflow entry point with schema-valid repository status `confirmed` and fresh-runner prerequisites while external CI remains `not_checked`, and MUST NOT claim a GitHub-hosted run, required check, ruleset, deployment, or hard gate is active.

#### Scenario: Harness evidence review
- **WHEN** the updated Harness is reviewed before any remote GitHub observation
- **THEN** schema-valid evidence and risk fields identify a local syntax-and-security candidate while remote execution and enforcement remain unverified
