## Why

AgentHub currently exposes AgentClient records only inside an individual Agent's Distribution workspace, leaves the workspace Clients route as a placeholder, and keeps OyiiOyii Moments inside Agent Build despite Moments being runtime operations data. The existing backend already supports Agent-scoped Client access, platform-current version following, shared sessions, and published Moments, so the frontend can provide a complete honest V1 without inventing a Workspace Client model or unsupported content workflow.

## What Changes

- Replace the Clients placeholder with a cross-Agent aggregation of real AgentClient records, plus create, detail, update, disable, re-enable, runtime-version, and export flows.
- Keep Clients and Agent Distribution as two views over the same AgentClient records and platform-current version contract.
- Keep shared conversations and published Moments as the real OyiiOyii capabilities, while retaining visible planning placeholders for feedback, memory issues, and campaigns; hide Client configuration.
- Move Moments generation, preview, publication, deletion, comments, and interaction summaries from Agent Build into Application Operations.
- Move the existing Agent-scoped automatic Moment schedule into Application Operations so creators can inspect, generate, regenerate, and disable schedules from Moments management.
- Remove Moments from the Build section model and safely redirect legacy `section=moments` entry state.
- Preserve Live/Demo isolation and never fabricate Workspace Clients, Moment drafts, review states, downline states, browser counts, or successful writes.

## Capabilities

### New Capabilities

- `agent-client-access-management`: Cross-Agent AgentClient aggregation and record management.
- `oyiioyii-moments-operations`: OyiiOyii published Moment management and confirmed publication flow.

### Modified Capabilities

- `agenthub-operations`: Limits live Operations navigation to real conversation and Moments capabilities.
- `agent-asset-build-workspace`: Removes operational Moments from Agent versioned configuration.
- `agent-client-version-following`: Reuses the same AgentClient records across Clients and Distribution without introducing per-Client versions.

## Impact

- Affects `src/app/(workspace)/clients`, `src/modules/agent-versions`, `src/modules/agent-distribution`, `src/modules/operations`, `src/modules/agent-build`, navigation, capability metadata, tests, and QA evidence.
- Uses only existing Agent, AgentClient, shared-session, Moment, automatic schedule, comment, upload, runtime-version, and export contracts.
- Adds no npm dependency, backend change, Workspace Client model, production fixture, local fake persistence, or deployment change.
