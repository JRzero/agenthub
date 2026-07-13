## Why

The Agent Asset workspace already covers build, test, and version surfaces, but Distribution remains a placeholder. Creators need one control surface that distinguishes the existing public-share capability from future client adapters, governed exports, and release orchestration.

## What Changes

- Replace the Distribution placeholder with the approved multi-client release console.
- Reuse the existing Agent public share-link GET, POST, and PATCH contracts as the first real distribution channel.
- Add four client rows with explicit version, compatibility, status, recent-release, and action states.
- Add safe Public Agent Card generation that excludes prompts, knowledge bindings, and user-relationship memory.
- Add interactive governance, export, rollback, and pause entry points while keeping unsupported production writes unavailable.
- Keep adapter publishing and governance mutations session-local in demo mode.

## Capabilities

### New Capabilities

- `agent-asset-distribution`: Defines multi-client release state, public sharing, safe card export, governance boundaries, and demo isolation.

### Modified Capabilities

- `agent-asset-workspace`: Changes the Distribution route from a placeholder to a functional Agent Asset lifecycle surface.

## Impact

- Adds frontend-only modules under `src/modules/agent-distribution/` and a Distribution route layout.
- Reuses current auth, workspace headers, Agent data, and `/agents/{id}/share-link` endpoints.
- Adds no backend endpoint, schema, dependency, deployment change, or legacy Creator modification.
- Adds unit, browser, and visual comparison verification.
