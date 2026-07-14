## ADDED Requirements

### Requirement: Multi-client release overview

The Distribution route SHALL show each target application endpoint with its compatible asset version, compatibility state, publication state, recent release metadata, and available action.

#### Scenario: Demo distribution overview

- **WHEN** a creator opens Distribution in demo mode
- **THEN** the console SHALL show OYIIOYII App, Web Chat, Brand Private, and API Runtime channels
- **AND** every demo mutation SHALL remain in the current page session

#### Scenario: Live channel boundaries

- **WHEN** a creator opens Distribution in live mode
- **THEN** only the existing public Web Chat share link SHALL be presented as a connected live channel
- **AND** other client publication actions SHALL state that their backend contracts are unavailable

#### Scenario: Responsive release overview

- **WHEN** the available Distribution workspace width supports the desktop table
- **THEN** recent release metadata and channel actions SHALL appear in separate labeled columns
- **AND** when that width is unavailable, each channel SHALL use a labeled card layout without horizontal overflow
- **AND** the desktop action column SHALL use centered, equal-width, explicitly labeled actions

### Requirement: Public Web Chat distribution

The console SHALL reuse the existing public share-link API to read, create, enable, and pause Web Chat distribution with the current API key and workspace scope.

#### Scenario: No existing share link

- **WHEN** the share-link endpoint returns not found
- **THEN** Web Chat SHALL appear unpublished
- **AND** the creator SHALL be able to generate a link

#### Scenario: Existing enabled share link

- **WHEN** the API returns an enabled share link
- **THEN** Web Chat SHALL appear running
- **AND** the creator SHALL be able to copy or pause it

### Requirement: Safe Public Agent Card

The console SHALL generate an allowlisted Public Agent Card and MUST NOT include system prompts, examples, knowledge bindings, credentials, tools, or user-relationship memory.

#### Scenario: Download public card

- **WHEN** a creator previews and downloads the Public Agent Card
- **THEN** the JSON SHALL include public identity, asset version, optional share URL, and generation time
- **AND** sensitive runtime and memory fields SHALL be absent

### Requirement: Explicit governance boundaries

The console SHALL provide interactive explanations for license, export, memory, safety, audit, version, and pause operations without claiming unavailable writes succeeded.

#### Scenario: Open an unsupported governance operation

- **WHEN** a creator opens a governance entry without a backend mutation contract
- **THEN** the console SHALL explain the intended boundary and current availability
- **AND** it SHALL NOT issue a production write
