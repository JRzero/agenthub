## ADDED Requirements

### Requirement: Build provides a temporary publish-check state
The Build workspace SHALL switch the existing right-side preview area to a temporary publish-check state when a user selects `发布为新版本`, without changing the global navigation, Build section navigation, editor structure, or header action placement.

#### Scenario: Enter publish check
- **WHEN** a user with a saved current draft selects `发布为新版本`
- **THEN** the right-side panel shows `发布检查` and the header action becomes `继续发布`

#### Scenario: Return to realtime preview
- **WHEN** a user selects `实时预览` from the publish-check panel
- **THEN** the current draft preview is restored without discarding editor state

### Requirement: Publish check uses four fixed categories
The publish check SHALL present exactly four ordered categories: `基础配置`, `能力与资源`, `测试与安全`, and `线上影响`, using a single divided list with concise state and supporting text.

#### Scenario: Render simple readiness summary
- **WHEN** publish check is active
- **THEN** the panel shows the four categories without a readiness percentage, progress bar, nested cards, or configuration controls

### Requirement: Basic configuration failures block continuation
The publish check SHALL derive basic configuration failures from the current saved draft validation and SHALL provide a direct action to the relevant Build section.

#### Scenario: Missing system prompt
- **WHEN** the saved draft has no role system prompt
- **THEN** `基础配置` shows one blocking item and `去完善` opens the persona section

#### Scenario: Valid basic configuration
- **WHEN** the saved draft passes required field validation
- **THEN** `基础配置` is shown as passed

### Requirement: Resource state is derived from real frontend data
The publish check SHALL derive resource status from the saved draft and the currently loaded resource options and MUST NOT represent unavailable or unverified Live resources as successful.

#### Scenario: Selected knowledge base is unavailable
- **WHEN** the draft references a knowledge base that is absent from the loaded options
- **THEN** `能力与资源` reports the unavailable resource and provides a route to the knowledge section

#### Scenario: Resource state cannot be verified
- **WHEN** resource options are still loading or fail to load
- **THEN** the panel shows an honest pending or unavailable state instead of `已通过`

### Requirement: Test evidence is revision-aware
The Test workspace SHALL retain a session-scoped evaluation summary without conversation content, and the publish check SHALL use it only when it belongs to the same Agent and draft revision.

#### Scenario: Current draft passed testing
- **WHEN** the latest session-scoped evaluation belongs to the current draft revision and contains no failed safety result
- **THEN** `测试与安全` shows the actual passed count and provides `查看结果`

#### Scenario: Current draft has not been tested
- **WHEN** no evaluation summary exists for the current draft revision
- **THEN** `测试与安全` shows `尚未测试` and provides `前往测试`

#### Scenario: Current draft fails safety evaluation
- **WHEN** the current draft evaluation indicates a safety failure
- **THEN** `测试与安全` is a blocking item and continuation to publishing is disabled

### Requirement: Client impact remains informational
The publish check SHALL show the number of enabled Agent Clients from the existing Client query and SHALL keep server-side compatibility validation authoritative.

#### Scenario: Enabled Clients exist
- **WHEN** the Agent has enabled Clients
- **THEN** `线上影响` shows how many Clients may use the new version after publication

#### Scenario: Client impact is unavailable
- **WHEN** the Client query cannot provide a count
- **THEN** the category reports that impact could not be confirmed and does not invent a number

### Requirement: Continue to the existing publish flow
The Build workspace SHALL route `继续发布` to the existing Versions workspace only when the local publish check has no blocking item.

#### Scenario: No local blockers
- **WHEN** all blocking checks pass and the user selects `继续发布`
- **THEN** the user is routed to `/assets/{agentId}/versions` for the existing authoritative publish confirmation

#### Scenario: A local blocker remains
- **WHEN** at least one blocking check fails
- **THEN** `继续发布` remains disabled and the panel explains which item must be resolved
