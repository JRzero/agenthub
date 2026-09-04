## Why

AgentHub has a unified local verification wrapper but no repository-owned GitHub Actions entry point, so pull requests and branch updates do not have a reproducible CI candidate tied to the accepted Harness baseline. The repository also relies on an undeclared global OpenSpec executable, which prevents fresh runners from reproducing the full gate safely.

## What Changes

- Add a repository-local GitHub Actions quality-gates candidate with stable fast and full jobs.
- Run fast verification only on ordinary branch pushes, and full verification for pull requests to `main` and branch updates to `main`; tag pushes do not select a job.
- Pin the official checkout and Node setup Actions to immutable commits, use read-only repository permissions, and keep all jobs free of secrets, caches, artifacts, deployments, and silent failure paths.
- Standardize CI and fresh-runner execution on the fixed `ubuntu-24.04` image, Node 24.19.0, lifecycle-script-free `npm ci`, and repository-local OpenSpec 1.6.0.
- Disable OpenSpec telemetry explicitly for both repository verification and GitHub Actions execution.
- Update Repository Harness documentation to register the local workflow as a syntax-and-security candidate without claiming remote activation or required-check enforcement.

## Capabilities

### New Capabilities

- `agenthub-ci-quality-gates`: Defines reproducible repository-local fast and full CI quality-gate behavior and the boundary between a committed workflow candidate and remotely active enforcement.

### Modified Capabilities

None.

## Impact

The change affects the repository workflow definition, package metadata and lockfile, the unified verification script, Repository Harness metadata, and contributor instructions. It adds `@fission-ai/openspec` 1.6.0 as an exact development dependency but does not change product behavior, API contracts, deployment configuration, secrets, or remote GitHub settings.
