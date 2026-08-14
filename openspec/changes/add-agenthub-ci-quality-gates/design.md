## Context

The accepted Repository Harness baseline exposes `./scripts/verify fast` and `./scripts/verify full`, but the full profile locates OpenSpec globally and the repository has no GitHub Actions workflow. HAR-05B is limited to a repository-local, uncommitted CI candidate: it must be reproducible on a fresh runner, use no credentials or lifecycle scripts, and make no claim about remote GitHub activation or enforcement.

## Goals / Non-Goals

**Goals:**

- Add stable `AgentHub fast` and `AgentHub full` jobs with precisely separated push and pull-request coverage.
- Exclude tag pushes and pin the runner image to `ubuntu-24.04`.
- Minimize workflow authority and supply-chain mutability through top-level read-only contents permission and immutable official Action pins.
- Reproduce validation with Node 24.19.0, `npm ci --ignore-scripts --no-audit --no-fund`, and repository-local OpenSpec 1.6.0.
- Prevent OpenSpec telemetry during local wrapper and CI execution.
- Record the workflow accurately in Repository Harness as a local syntax-and-security candidate.

**Non-Goals:**

- Running or configuring remote GitHub Actions, required checks, rulesets, environments, deployments, releases, caches, artifacts, or secrets.
- Changing product behavior, API contracts, release boundaries, or the order of existing fast/full business gates.
- Supporting global OpenSpec installations or dependency lifecycle scripts.

## Decisions

### Separate event selection from stable job identity

The workflow configures `push.branches: ["**"]` and pull requests targeting `main`. `AgentHub fast` is conditioned to ordinary non-`main` branch pushes; `AgentHub full` is conditioned to `main` branch pushes and qualifying pull requests. The explicit branch filter prevents tag-push workflow runs, preserves stable job names, and avoids duplicate fast/full execution on the same event. Separate workflow files were rejected because they would duplicate bootstrap policy and make security review less reliable.

### Use minimum workflow authority and immutable bootstrap inputs

The workflow declares only top-level `contents: read`. It pins `actions/checkout` and `actions/setup-node` to official 40-character commit SHAs, pins the runner label to `ubuntu-24.04`, and does not use other Actions, caches, artifacts, environments, secrets, OIDC, package publishing, deployment permissions, or failure suppression. Floating Action tags and `ubuntu-latest` were rejected because they can move after review.

### Make the lockfile the only dependency installation authority

Both jobs use Node 24.19.0 and run exactly `npm ci --ignore-scripts --no-audit --no-fund` before invoking the unified wrapper. The package declares `>=24.19.0 <25`, and `@fission-ai/openspec` is pinned exactly to 1.6.0. Install or postinstall execution is intentionally disabled; any future dependency that requires lifecycle scripts must be treated as a blocker rather than silently enabled.

### Require repository-local OpenSpec in the full profile

`scripts/verify full` checks and invokes only `node_modules/.bin/openspec`, verifies version 1.6.0, and keeps the existing lint, typecheck, test, build, and strict OpenSpec validation order. The wrapper exports `OPENSPEC_TELEMETRY=0` and `DO_NOT_TRACK=1` for every repository-local OpenSpec invocation, and the workflow declares the same environment values. Falling back to a global CLI or relying on implicit CI telemetry behavior was rejected because either would make execution depend on unstated machine or tool behavior.

### Treat repository CI presence and remote enforcement as different facts

`harness.yaml` records `.github/workflows/quality-gates.yml` as a schema-valid `confirmed` repository-owned entry point because the local file exists. Candidate-only and remote-unverified facts remain in allowed evidence and risk fields and in this change; external CI remains `not_checked`, so no statement marks a GitHub run, branch protection, or required check as active.

## Risks / Trade-offs

- [Risk] Disabling lifecycle scripts could expose a future dependency that cannot operate after a fresh install. → Mitigation: fail the verification and require explicit review instead of enabling scripts.
- [Risk] Immutable Action pins require deliberate maintenance to receive upstream fixes. → Mitigation: update pins only through a separately reviewed change with official-repository provenance.
- [Risk] Local YAML parsing cannot prove GitHub-hosted execution. → Mitigation: report only a local syntax-and-security candidate until remote execution and enforcement are separately observed.
- [Risk] Event/job conditions can drift from the intended coverage. → Mitigation: statically parse the YAML syntax tree and assert triggers, permissions, job names, pins, and prohibited constructs.
- [Risk] OpenSpec includes optional telemetry code. → Mitigation: export both `OPENSPEC_TELEMETRY=0` and the ecosystem-standard `DO_NOT_TRACK=1` at every wrapper and workflow invocation boundary.
