## ADDED Requirements

### Requirement: Sectioned Agent construction
The Build route SHALL provide one ordered section hierarchy for identity, persona, runtime, skills, knowledge, memory policy, safety, and media while preserving one editable draft across section changes. Persona SHALL own example conversations, Runtime SHALL own reasoning and tool-call display controls, and Safety SHALL own policy boundaries.

#### Scenario: Switch build section
- **WHEN** the creator edits identity fields and activates the runtime section
- **THEN** the runtime editor opens and the unsaved identity changes remain in the draft
#### Scenario: Show the prioritized section order
- **WHEN** the creator opens the Build workspace
- **THEN** Runtime appears directly below Persona and Knowledge appears directly below Skills
#### Scenario: Open persona configuration
- **WHEN** the creator activates the persona section
- **THEN** the system prompt and example conversations appear in the same focused editor without a global editor-tab row

#### Scenario: Open runtime and safety configuration
- **WHEN** the creator activates runtime or safety
- **THEN** runtime presents reasoning and tool-call display controls while safety presents visibility and unavailable policy boundaries

### Requirement: Compatible Agent editing
The Build workspace SHALL load supported values from the selected Agent and MUST serialize only fields accepted by the existing Agent update contract.

#### Scenario: Save supported fields
- **WHEN** the creator saves valid identity, persona, knowledge, skill, memory, runtime, or display changes
- **THEN** the frontend sends one authenticated workspace-scoped `PUT /agents/{id}` request containing the supported fields

### Requirement: Draft lifecycle
The Build workspace SHALL expose clean, dirty, saving, saved, validation-error, request-error, and reset states.

#### Scenario: Reset unsaved edits
- **WHEN** the creator changes fields and activates Reset
- **THEN** all editable values return to the most recently loaded or saved snapshot without a backend write

#### Scenario: Reject invalid identity
- **WHEN** the Agent name is empty or the code violates the current lowercase identifier rule
- **THEN** the workspace blocks saving and identifies the invalid field

### Requirement: Demo write isolation
Demo mode MUST NOT call the Agent update endpoint and SHALL visibly identify saved demo changes as local-only.

#### Scenario: Save demo draft
- **WHEN** the creator saves in demo mode
- **THEN** the editor updates its saved snapshot locally and no HTTP write occurs

### Requirement: Runtime-backed preview
The Build workspace SHALL render current draft presentation fields and starter questions while using the authenticated Runtime Chat contract for model responses after the draft is saved.

#### Scenario: Preview an unsaved name
- **WHEN** the creator changes the Agent name without saving
- **THEN** the preview panel immediately shows the draft name while the asset header continues to represent the saved Agent

#### Scenario: Saved draft sends a real Runtime message
- **WHEN** the live-mode draft has no unsaved changes and the creator sends a preview message
- **THEN** the frontend creates or reuses a workspace-scoped test session and streams the real Runtime response, with the existing non-stream request as fallback

#### Scenario: Unsaved draft blocks Runtime send
- **WHEN** the creator has unsaved build changes
- **THEN** the preview prevents message submission and asks the creator to save before testing the latest configuration

#### Scenario: Demo preview remains isolated
- **WHEN** AgentHub runs in demo data mode
- **THEN** the preview is visibly labeled as simulated and does not create a backend Runtime session

#### Scenario: Collapse the draft preview

- **WHEN** the creator collapses the preview on a desktop Build workspace
- **THEN** the preview SHALL reduce to a narrow restore control and the focused editor SHALL receive the released width without losing draft state

### Requirement: Unsupported build capabilities
The Build workspace MUST identify unavailable media and advanced safety operations and MUST prevent their production write controls.

#### Scenario: Open media section
- **WHEN** the creator activates Media before media migration is available
- **THEN** the editor explains the boundary and offers no fake upload or generation action
