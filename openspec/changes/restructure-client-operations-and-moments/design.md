## Context

The current frontend already has live Agent listing, per-Agent AgentClient listing, runtime-version, export, shared-session review, and Agent-scoped Moment APIs. Product V1 now explicitly treats AgentClient as the only Client management object and treats unpublished Moment content as page-local editing state. The visual references remain useful for dense three-column operations layouts, but unsupported states and metrics must be removed.

## Goals / Non-Goals

**Goals**

- Make workspace Clients useful without merging AgentClient records or guessing identities.
- Keep AgentClient edits consistent between Clients and Agent Distribution.
- Make OyiiOyii context explicit in Application Operations.
- Provide a responsive two-step Moment publication flow with honest failure and navigation guards.
- Keep Agent-scoped automatic publication schedules available after Moments move out of Agent Build.
- Match the established AgentHub visual system at 1440×900 and 1280×720.

**Non-Goals**

- Workspace Client, Client-global settings, multi-Client Moments, Client-level roles, persistent Moment drafts, review/approval states, downline, manual schedule editing, or per-Client Agent versions.

## Decisions

### 1. AgentClient remains the stable record

Clients loads workspace Agents and queries each Agent's Client records. Every row retains `agent_client.id` and its owning Agent metadata. Failed Agent queries produce per-Agent retry rows while successful records remain visible. Client name, type, and key are never used to merge identities.

### 2. Client mutations live with the version contracts

Typed create, patch, disable, runtime-version, and export functions remain under `agent-versions` because AgentClient following is already implemented there. Patch requests include `expected_capability_hash`; a conflict invalidates and reloads records rather than overwriting.

### 3. Clients uses routable view state

`/clients` renders the aggregate list, `/clients/new` creates a record after selecting an Agent, and `/clients/[clientId]` renders a record detail using the selected record's owning Agent query context supplied by `agentId` in the URL. Unknown or inaccessible records render an honest error with a return action.

### 4. Operations distinguishes real modules from planning placeholders

Operations exposes `sessions` and `moments` as real modules. It also keeps `feedback`, `memory`, and `campaign` as routable planning placeholders that do not request unsupported data or claim success. `binding` remains hidden. The selected module and Agent filter use URL search parameters so refresh/back/forward preserve context. OyiiOyii is a fixed visible context label, not a selectable generic Client.

### 5. Moments move as a module, not a copied panel

Moment contracts and UI move from `agent-build` to `operations/moments`. The management workspace uses an Agent/content list, selected Moment detail, and interaction/comment panel. The create route uses page-local draft state across Generate/Edit and Preview/Publish steps. Navigation away with meaningful unpublished content requires confirmation.

### 6. Moment semantics follow existing APIs

Generation creates a temporary text candidate only. `POST /agents/{id}/moments` is the sole publication action. Successful create inserts/refetches the published record; failure preserves inputs. DELETE is labeled irreversible deletion. Missing metrics and endpoints are hidden.

### 7. Responsive visual strategy

At wide desktop widths, Moments uses three columns matching the reference density. At 1280×720 it retains the list/detail/panel relationship with narrower tracks and internal scrolling; below that it stacks without page-level horizontal overflow. Existing Phosphor icons, CSS tokens, typography, borders, and buttons are reused.

### 8. Automatic schedules are Agent-scoped Operations settings

Moments management exposes an `自动发布设置` action. The setting always targets one explicit Agent and reuses `GET`, `POST`, and `DELETE /agents/{id}/moments/auto-schedule`. `POST` asks the backend to generate or regenerate the coming schedule; the frontend does not invent editable weekdays or times that the backend contract cannot persist. Unpublished Agents remain visible but cannot be selected for automatic publication. Failures preserve the currently loaded schedule and remain retryable.

## Risks / Trade-offs

- Cross-Agent Client aggregation creates N+1 requests; bounded parallel loading and partial failures are accepted for V1.
- The global Moment feed and detail/comment response shapes may differ across environments; adapters remain defensive and fields are optional.
- Existing Build links can contain `section=moments`; they redirect to media and show a migration notice rather than breaking.
- The visual references contain unsupported states and metrics; fidelity applies to composition and control language while real-data boundaries intentionally differ.

## Migration Plan

1. Add AgentClient mutations and aggregate Clients UI with tests.
2. Add Operations module routing and move Moment contracts/components.
3. Remove Moment Build types/navigation/rendering and add legacy-entry handling.
4. Add Distribution-to-Operations links after the target route exists.
5. Restore the existing Agent-scoped automatic schedule from Moments management.
6. Run automated checks and browser/design QA, recording screenshots and limitations.

## Open Questions

- OpenSpec CLI is unavailable in this environment; artifacts follow the repository's existing structure and must be strictly validated once the CLI is restored.
