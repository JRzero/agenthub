## ADDED Requirements

### Requirement: Existing API contract compatibility
The AgentHub HTTP client SHALL resolve the existing API base, prefix requests with `/api/v1`, send `X-API-Key`, send optional `X-Workspace-Code`, and normalize backend success and error responses.

#### Scenario: Send a workspace-scoped Agent request
- **WHEN** an authenticated user loads Agents for a non-default workspace
- **THEN** the request uses the configured API base and includes both authentication and workspace headers

### Requirement: Domain-separated API modules
Authentication, workspace, and Agent access SHALL be implemented in separate domain modules that share a common HTTP client.

#### Scenario: Update one backend domain
- **WHEN** a domain contract changes in a future change
- **THEN** the modification can be contained in that domain module without editing unrelated API domains

### Requirement: Capability source states
Each platform capability without complete backend support SHALL be declared as `live`, `derived`, `demo`, or `unavailable` in a typed registry.

#### Scenario: Render a demo capability
- **WHEN** the application runs in demo data mode and a capability is declared demo
- **THEN** fixture data is visibly labelled as demo and cannot perform a production write

#### Scenario: Render an unavailable capability
- **WHEN** a capability is unavailable in live mode
- **THEN** the user sees a disabled explanatory state rather than a successful-looking fake workflow

### Requirement: Demo mode isolation
Demo fixtures SHALL require `NEXT_PUBLIC_AGENTHUB_DATA_MODE=demo` and MUST NOT replace live authentication or silently write to the production API.

#### Scenario: Run in default production mode
- **WHEN** the demo environment variable is absent
- **THEN** the application uses live-supported data only and exposes unsupported modules as unavailable

### Requirement: Query state consistency
Live queries SHALL expose deterministic loading, success, empty, error, and retry behavior and SHALL invalidate workspace-scoped data after a workspace change.

#### Scenario: Change workspace while viewing an asset list
- **WHEN** the selected workspace changes
- **THEN** the old workspace's Agent results are not presented as the new workspace's data
