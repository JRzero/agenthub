## Why

The first AgentHub vertical slice establishes the two-level workspace and an Agent Asset overview, but the Build route still stops at a migration placeholder. Creators need a usable replacement for the legacy all-in-one Agent edit page before the new frontend can become a credible daily workspace.

## What Changes

- Replace the Build placeholder with the approved three-column Agent construction workspace.
- Add one section navigation hierarchy for identity, persona, runtime, skills, knowledge, memory policy, safety, and media; persona owns examples, runtime owns output/debug display, and safety owns policy boundaries.
- Load editable values from the existing Agent contract and save supported fields through the existing `PUT /api/v1/agents/{id}` endpoint.
- Add unsaved-change detection, reset, save feedback, validation, and explicit demo-mode write isolation.
- Add a runtime-backed real-time preview that reuses the authenticated session and message APIs, while keeping demo traffic isolated.
- Give every Agent Asset route a shared compact Agent header, while keeping the Build preview width-bounded and collapsible so focused content remains primary.
- Keep unsupported media and advanced safety operations visibly unavailable instead of simulating production writes.

## Capabilities

### New Capabilities

- `agent-asset-build-workspace`: Defines the sectioned construction experience, compatible Agent editing, preview behavior, and save-state contract.

### Modified Capabilities

- `agent-asset-workspace`: Changes the Build route from an explanatory placeholder into a functional Agent Asset lifecycle surface while preserving the existing scoped navigation.

## Impact

- Adds frontend-only modules under `src/modules/agent-build/` and a Build route layout.
- Reuses existing authentication, workspace headers, Agent query cache, `PUT /agents/{id}`, and Runtime Chat session/message contracts.
- Adds no backend endpoint, schema, dependency, deployment, or legacy Creator change.
- Extends unit and browser verification for editable fields, demo isolation, navigation, and responsive behavior.
