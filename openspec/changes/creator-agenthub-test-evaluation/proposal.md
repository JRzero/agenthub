## Why

The new AgentHub can now build Agent Assets, but its Test route is still a placeholder. Creators need a safe place to exercise the existing simulation endpoint and inspect clearly sourced evaluation signals before publishing or distributing an asset.

## What Changes

- Replace the Test placeholder with the approved three-column test and evaluation workspace.
- Add searchable, selectable, and locally creatable test scenarios for common conversation goals.
- Reuse the existing `POST /api/v1/agents/{id}/simulate` endpoint for live test conversations.
- Keep demo conversations isolated from production writes and label them as demo data.
- Add explicit frontend-derived evaluation scores for character consistency, emotional response, safety boundaries, knowledge grounding, and conversation fluency.
- Show unavailable runtime traces, memory hits, tool calls, cost, and test-set persistence honestly when the backend does not return them.

## Capabilities

### New Capabilities

- `agent-asset-test-evaluation`: Defines scenario management, simulation conversation, derived evaluation, and test provenance behavior.

### Modified Capabilities

- `agent-asset-workspace`: Changes the Test route from a placeholder into a functional Agent Asset lifecycle surface.

## Impact

- Adds frontend-only modules under `src/modules/agent-test/` and a Test route layout.
- Reuses current auth, workspace headers, Agent queries, system prompt, examples, skills, and simulation endpoint.
- Adds no backend endpoint, schema, dependency, deployment, or legacy Creator change.
- Adds unit and browser verification for simulation payloads, demo isolation, scenario state, evaluation provenance, and responsive layout.
