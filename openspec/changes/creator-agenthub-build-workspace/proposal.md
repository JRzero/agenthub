## Why

The first AgentHub vertical slice establishes the two-level workspace and an Agent Asset overview, but the Build route still stops at a migration placeholder. Creators need a usable replacement for the legacy all-in-one Agent edit page before the new frontend can become a credible daily workspace.

## What Changes

- Replace the Build placeholder with the approved three-column Agent construction workspace.
- Add section navigation for identity, persona, knowledge, skills, memory policy, runtime, safety, and media.
- Load editable values from the existing Agent contract and save supported fields through the existing `PUT /api/v1/agents/{id}` endpoint.
- Add unsaved-change detection, reset, save feedback, validation, and explicit demo-mode write isolation.
- Add a local real-time preview with starter questions and a draft message interaction without inventing a new backend endpoint.
- Give every Agent Asset route a shared compact Agent header, while keeping the Build preview width-bounded and collapsible so focused content remains primary.
- Keep unsupported media and advanced safety operations visibly unavailable instead of simulating production writes.

## Capabilities

### New Capabilities

- `agent-asset-build-workspace`: Defines the sectioned construction experience, compatible Agent editing, preview behavior, and save-state contract.

### Modified Capabilities

- `agent-asset-workspace`: Changes the Build route from an explanatory placeholder into a functional Agent Asset lifecycle surface while preserving the existing scoped navigation.

## Impact

- Adds frontend-only modules under `src/modules/agent-build/` and a Build route layout.
- Reuses existing authentication, workspace headers, Agent query cache, and `PUT /agents/{id}` schema.
- Adds no backend endpoint, schema, dependency, deployment, or legacy Creator change.
- Extends unit and browser verification for editable fields, demo isolation, navigation, and responsive behavior.
