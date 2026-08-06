## ADDED Requirements

### Requirement: Living World is a Workspace-level capability
AgentHub SHALL expose Living World from the Workspace navigation and SHALL provide refreshable routes for the world list, creation, templates, editing, console, preflight, schedule, event cards, and Agent Owner invitation decisions. It MUST NOT place the capability under a single Agent Asset or depend on navigation state for a deep link.

#### Scenario: Creator reloads a deep link
- **WHEN** an authenticated Creator opens or reloads `/worlds/{world_code}/edit`
- **THEN** AgentHub obtains the World projection from the API using the route code and current Workspace rather than an in-memory object from the previous page

### Requirement: Live World data uses only the frozen API
In live mode AgentHub SHALL use the shared authenticated request layer and the frozen C endpoint contracts for World list/detail, complete draft, reviewed templates, exact published Agent search, invitations, participants, decision drafts, schedules, launch requests, event cards, preflight, publish, withdraw, recall, and compatible start. AgentHub MUST NOT use fixtures, static arrays, random product values, localStorage truth, or static success receipts for any live World operation.

#### Scenario: A frozen backend identity drifts
- **WHEN** a Creator evidence run is awaiting a replacement backend identity after a dispatched candidate changes
- **THEN** AgentHub keeps implemented API code testable locally, pauses dynamic evidence, and sends no mutation to the drifting candidate

#### Scenario: C list is empty
- **WHEN** the live World list API returns an empty `items` array
- **THEN** AgentHub renders the real empty state and creation action without injecting a demo World

### Requirement: World API types preserve public identity and secrecy boundaries
The frontend SHALL model `world_code`, `workspace_code`, `agent_code`, `version_no`, revisions, statuses, and allowlisted public DTO fields. World query keys and UI identity MUST NOT use Agent database ids. The World cache, DOM, diagnostics, and analytics MUST NOT retain or render prompts, credentials, private memory, hidden configuration, internal database ids, or version hashes except the C Creator diagnostic fields explicitly returned for fixed-binding verification.

#### Scenario: Crafted response includes a secret field
- **WHEN** a response object contains a field outside the typed allowlist
- **THEN** World UI and diagnostics ignore it and do not render or copy its value

### Requirement: Six-section drafts are complete and recoverable
AgentHub SHALL support core idea, rules/lore/boundaries, 3–5 locations, 3–4 invitation slots, one initial event, and opening configuration with a positive seed and `Asia/Shanghai`. Blank and reviewed-template creation SHALL produce a new World through the API. Saving SHALL include `expected_revision`; failed saves SHALL retain inputs in memory; dirty navigation SHALL warn that unsaved changes will be lost.

#### Scenario: Revision conflict occurs while saving
- **WHEN** draft save returns 409
- **THEN** AgentHub preserves local fields, blocks automatic overwrite, offers to refresh the latest projection, and offers a copyable representation of the user's edits before they reapply and submit

#### Scenario: Location maximum is exceeded
- **WHEN** the Creator attempts to add a sixth location
- **THEN** AgentHub rejects it in place with the stable P0 limit and does not send a mutation

#### Scenario: Template changes before creation
- **WHEN** template-backed creation returns 409
- **THEN** AgentHub reports that the template changed or was removed, keeps the blank path available, and does not claim a draft exists

### Requirement: Invitation and Agent Owner decisions use exact publications
The Creator SHALL search and invite exact `agent_code@version_no` publications, show invitation/participant status with text and icon, and allow withdrawal only while pending. The Agent Owner page SHALL load its allowlisted invitation detail, permit public identity edits and only permission narrowing, save an expected-revision decision draft, and accept or reject with an idempotency key. Permanent death, personality modification, and runtime upgrade MUST NOT be represented as permissions.

#### Scenario: Agent Owner attempts to broaden permission
- **WHEN** a permission was false in the invitation proposal
- **THEN** its control remains disabled for enabling while still allowing already-granted permissions to be narrowed

#### Scenario: Exact version is unavailable before acceptance
- **WHEN** acceptance reports that the fixed publication is unavailable or the invitation projection is no longer actionable
- **THEN** AgentHub keeps the invitation unaccepted, displays that no fallback version was selected, and offers a route back rather than claiming a participant binding

#### Scenario: Two tabs edit an invitation draft
- **WHEN** the stale tab receives 409
- **THEN** AgentHub preserves and can copy its public identity/permission draft, refreshes the current revision on request, and never silently overwrites the other tab

### Requirement: Preflight, publish, schedules, launch requests, and event cards expose C truth
AgentHub SHALL render every stable preflight missing reason with a precise fix destination, publish only through the real mutation, manage `Asia/Shanghai` schedule read/save/cancel with revision and idempotency semantics, render launch requests as pending bootstrap rather than a created runtime instance, and manage zero to three follow-up event cards. The fourth card MUST be rejected before or by the API with a stable range message.

#### Scenario: Preflight returns multiple missing reasons
- **WHEN** the API returns `ready=false` and multiple `missing` codes
- **THEN** AgentHub renders all codes with Chinese guidance and disables launch while keeping each fix link operable

#### Scenario: Manual launch request is accepted by C
- **WHEN** `POST /worlds/{world_code}/launch-requests` returns 202 with `status=pending`
- **THEN** AgentHub shows the request identity/revision and that runtime bootstrap is pending, without asserting an instance or initial event exists

#### Scenario: Fourth event card is attempted
- **WHEN** three cards already exist and the Creator requests another
- **THEN** AgentHub shows `P0 最多准备 3 张后续事件卡。`, retains the existing three, and creates no local fake card

### Requirement: Request and mutation states are explicitly recoverable
World list/detail blocks SHALL distinguish first loading, background stale refresh, empty, partial, error, 401, non-enumerating 403/404, 400, 409, 422, 429, 5xx, offline, and unknown mutation outcomes. Every mutation SHALL expose disabled/pending, success, failure, and idempotent convergence. A timeout or offline response MUST NOT be assumed to be a failed commit and MUST trigger a truth refresh before retry.

#### Scenario: Background refresh fails
- **WHEN** a query with previous API data fails during background refresh
- **THEN** AgentHub retains the previous content, marks it as the last known result, and offers a local retry without replacing the whole page with a skeleton

#### Scenario: Unauthorized request occurs with dirty input
- **WHEN** a request returns 401 during editing
- **THEN** the shared auth flow preserves the requested deep-link destination and the editor does not erase the current in-memory fields before navigation

#### Scenario: Rate limit includes retry timing
- **WHEN** a request returns 429 with retry timing
- **THEN** AgentHub retains user content, presents the retry time, and does not automatically resubmit

#### Scenario: Mutation result is unknown
- **WHEN** a mutation is aborted, times out, or loses connectivity after submission
- **THEN** AgentHub announces that it is confirming the outcome, refreshes the affected truth, and does not issue a new mutation until reconciliation finishes

### Requirement: Query cache is scoped and mutation results converge
World queries SHALL be scoped by current `workspaceCode`, public resource code, and revision where relevant. Switching Workspace or account SHALL not expose cached World data from the previous scope. Mutations SHALL invalidate or replace only verified server projections and SHALL not optimistically synthesize success for invitations, participants, schedules, launch requests, or runtime state.

#### Scenario: User switches Workspace
- **WHEN** the current Workspace changes
- **THEN** the World list and detail use distinct query keys and no prior Workspace data is shown as the new Workspace's truth

### Requirement: Creator layouts and interactions are accessible and responsive
Creator routes SHALL provide a drawer/single-column/sticky-action layout below 768px, a step-and-content layout at medium widths, and an optional summary column at 1280px and above. Primary mobile actions MUST remain visible without horizontal scrolling, touch targets MUST be at least 44 CSS pixels, and 200% text zoom/reduced motion MUST preserve all information and operations.

#### Scenario: Keyboard user completes a World step
- **WHEN** the user navigates the editor without a pointer
- **THEN** DOM order matches visual order, the step nav exposes `aria-current=step`, field errors are described, the error summary can focus the first invalid field, and dialogs restore focus to their trigger

#### Scenario: Request state is announced
- **WHEN** save succeeds or a permission/data-loss error occurs
- **THEN** success uses a polite status live region while the critical error uses an alert without rereading the whole page

### Requirement: QA evidence separates verified C from pending D–G
The change SHALL map C-01..C-12, CM-01..CM-02, and AgentHub responsibilities for X-01..X-04 to exact routes, API calls, and tests. Each browser record SHALL contain candidate branch/HEAD/tree/diff identity, viewport, synthetic inputs, steps, expected/actual results, redacted network evidence, screenshot or recording, console, accessibility result, and PASS/FAIL/SKIP/pending. A script with a missing backend slice or evidence field MUST NOT be marked PASS, and this C-ready candidate MUST NOT be called the complete H or Goal.

#### Scenario: D–G APIs have not been dispatched
- **WHEN** the C-ready frontend slice finishes validation
- **THEN** affected C/X scripts remain `pending_backend`, the report lists the blockers, and only real C evidence is eligible for PASS

### Requirement: Frozen D–G projections and lifecycle commands are real
AgentHub SHALL load the allowlisted actor projection, runtime contract, public visibility, review submissions, owner reports, and Agent Owner binding/limited-change deep links from the Q1-frozen API. Bootstrap and pause/resume/archive/takedown barriers SHALL use the server-provided request, epoch, fence and revision. The UI MUST NOT expose internal action proposal/commit controls, raw model material, private memory, prompts, skills, knowledge bases, hidden facts, version hashes, or database identifiers.

#### Scenario: Runtime projection is partially unavailable
- **WHEN** the World detail remains available but projection or owner reports fail
- **THEN** AgentHub preserves the available preparation console, renders an independent recoverable error for the failed block, and does not clear the whole page

#### Scenario: Lifecycle mutation outcome is unknown
- **WHEN** bootstrap or a runtime barrier loses connectivity after submission
- **THEN** AgentHub disables direct replay, refreshes detail and projection truth, and only permits a new user intent after reconciliation

### Requirement: Creator governance remains within the approved surface
AgentHub SHALL allow an explicit World owner to manage `listed`, `unlisted`, and `hidden` visibility, submit review material, and read owner-scoped reports with expected revision and idempotency where required. AgentHub MUST NOT advertise or render platform moderation capability, disposition, approve, reject, takedown, or restore controls in P0.

#### Scenario: Backend status is outside the P0 Creator surface
- **WHEN** review or report data contains a backend-only platform disposition or capability status
- **THEN** AgentHub renders the Creator-owned submission/report state without exposing a platform moderation capability or control in the DOM

### Requirement: Agent Owner runtime controls remain binding-scoped
AgentHub SHALL provide deep-link routes for an owned participant binding and owned limited change. The owner may only narrow current permissions, recall the owned binding with revision/idempotency, and choose/reject an allowlisted finite candidate through an existing authorized decision endpoint. Foreign or stale resources SHALL fail with non-enumerating recovery.

#### Scenario: Owner attempts permission widening
- **WHEN** the submitted permission set enables a value that is currently false
- **THEN** the frontend prevents submission and the backend remains the final authority
