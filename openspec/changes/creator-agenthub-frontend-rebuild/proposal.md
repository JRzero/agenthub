## Why

The current Creator UI organizes Agent creation, skills, knowledge, testing, sharing, and operations around legacy feature pages, including a 4,000+ line Agent editor and a monolithic API client. AgentHub needs a clean frontend foundation that treats an Agent as a versioned asset and makes the workspace-level product surface distinct from the lifecycle of a selected Agent Asset, while continuing to work with the existing backend.

## What Changes

- Add a standalone root-level Next.js application and keep the existing Creator application available as the legacy Creator UI during migration.
- Introduce a workspace-level application shell for workbench, assets, resources, clients, operations, analytics, governance, revenue, and settings.
- Introduce an Agent Asset workspace with overview, build, test and evaluation, versions, and distribution sections.
- Deliver the first functional vertical slice: compatible authentication and workspace state, an Agent Asset list/selection path, and a high-fidelity Agent Asset overview based on the approved design reference.
- Split backend access by domain instead of copying the legacy monolithic `src/lib/api.ts`.
- Add an explicit capability registry and live/demo/unavailable data boundaries so unsupported backend features cannot appear as real production writes.
- Add lint, type-check, unit-test, build, local interaction, and visual design-QA gates for the new application.
- Do not change backend endpoints, the legacy Creator frontend, production deployment, or public API behavior in this change.

## Capabilities

### New Capabilities

- `agenthub-workspace-shell`: Standalone AgentHub application shell, navigation, authentication compatibility, workspace selection, responsive behavior, and design tokens.
- `agent-asset-workspace`: Asset-centric navigation and overview experience for a selected Agent, including live asset composition and client-adapter presentation.
- `agenthub-data-capabilities`: Domain API adapters and explicit live/demo/unavailable capability behavior for existing and future AgentHub modules.

### Modified Capabilities

None.

## Impact

- Adds a new independently installable and buildable frontend at the repository root.
- Reuses the existing `NEXT_PUBLIC_API_URL`, `X-API-Key`, and `X-Workspace-Code` backend contract without backend changes.
- Preserves the existing `linkyun_auth`, `linkyun-api-url-override`, `linkyun-theme`, and `linkyun_current_workspace_code` browser keys for migration compatibility.
- Adds frontend dependencies and test tooling only inside this repository; the repository is not converted into a package-manager workspace.
- Leaves current Creator deployment artifacts and scripts unchanged until a separately approved cutover change.
