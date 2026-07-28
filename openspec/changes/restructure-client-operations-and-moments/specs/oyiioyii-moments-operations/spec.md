## ADDED Requirements

### Requirement: Operations exposes honest OyiiOyii modules

Application Operations SHALL identify OyiiOyii as the current context, SHALL expose shared conversations and published Moments as real modules, and MAY retain clearly unavailable planning placeholders for feedback, memory issues, and campaigns.

#### Scenario: Open Operations

- **WHEN** a creator opens Application Operations
- **THEN** the page SHALL show conversation and Moments navigation
- **AND** it SHALL show feedback, memory, and campaign as unavailable planning placeholders
- **AND** it SHALL NOT show binding, settings, or generic Client switching controls
- **AND** planning placeholders SHALL NOT request unsupported data or display fabricated success states

### Requirement: Published Moments use a three-region workspace

The Moments workspace SHALL support Agent filtering, loaded-content search, time filtering, paged published content, selected content details, real interaction metrics, comments, and irreversible deletion.

#### Scenario: A metric is absent

- **WHEN** a Moment response does not contain a metric such as browser count or favorite count
- **THEN** the interface SHALL hide that metric
- **AND** it SHALL NOT derive or fabricate a value

#### Scenario: Delete a Moment

- **WHEN** a creator confirms deletion and the API succeeds
- **THEN** the Moment SHALL be removed from the published list
- **AND** the action SHALL be described as deletion rather than reversible downline

### Requirement: Moment publication is explicitly confirmed

Creating a Moment SHALL use Generate/Edit and Preview/Publish steps, with unpublished content held only in page-local state.

#### Scenario: Publish succeeds

- **WHEN** the creator confirms publication and the create API succeeds
- **THEN** the new Moment SHALL appear in the published list
- **AND** no draft, pending, or review state SHALL be shown

#### Scenario: Publish fails

- **WHEN** publication fails
- **THEN** entered text and selected media SHALL remain available
- **AND** the interface SHALL provide a retry action without showing success

#### Scenario: Leave with unpublished content

- **WHEN** the creator navigates away after entering meaningful unpublished content
- **THEN** the interface SHALL warn that the content is not saved

### Requirement: Moments are not Agent Build configuration

Agent Build SHALL NOT include a Moments section or load Moment operational data.

#### Scenario: Open a legacy Moments build link

- **WHEN** a creator opens Build with `section=moments`
- **THEN** Build SHALL select a valid configuration section
- **AND** it SHALL explain that Moments moved to Application Operations

### Requirement: Automatic Moment schedules are managed in Operations

The Moments workspace SHALL provide an Agent-scoped automatic publication setting using the existing schedule endpoints.

#### Scenario: Open automatic publication settings

- **WHEN** a creator opens automatic publication settings
- **THEN** the interface SHALL require one Agent with a platform-current version
- **AND** it SHALL show the real current schedule or a clear disabled state
- **AND** it SHALL NOT fabricate editable schedule fields unsupported by the backend

#### Scenario: Generate or regenerate a schedule

- **WHEN** the creator requests AI scheduling and the backend succeeds
- **THEN** the returned schedule configuration and scheduled items SHALL replace the displayed schedule
- **AND** the interface SHALL identify that Agent as enabled for automatic publication

#### Scenario: Disable automatic publication

- **WHEN** the creator confirms disabling and the backend succeeds
- **THEN** the schedule SHALL be shown as disabled
- **AND** the published Moment history SHALL remain unchanged

#### Scenario: Schedule mutation fails

- **WHEN** schedule generation or deletion fails
- **THEN** the last loaded schedule SHALL remain visible
- **AND** the interface SHALL show a retryable failure rather than success
