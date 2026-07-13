## ADDED Requirements

### Requirement: Provider catalogue

The Build runtime section SHALL load and select current backend LLM Providers.

#### Scenario: Select a Provider

- **WHEN** a Creator selects a Provider
- **THEN** the draft SHALL retain its Provider name and default model for save

### Requirement: Edge credential lifecycle

The Build runtime section SHALL support copy and guarded reset of an Edge Agent token.

#### Scenario: Reset an Edge token

- **WHEN** a Creator confirms reset
- **THEN** the new token SHALL replace the displayed credential

### Requirement: Agent avatar crop

The Build media section SHALL crop an uploaded image to a square before using the current avatar endpoint.

#### Scenario: Save a crop

- **WHEN** a Creator chooses zoom and position and confirms
- **THEN** a square JPEG blob SHALL be uploaded and the Agent avatar SHALL refresh

### Requirement: Stage-specific skills

The Build skills section SHALL preserve pre-, mid-, and post-conversation bindings and both global and Agent config scopes.

#### Scenario: Configure a staged skill

- **WHEN** a Creator saves an Agent override
- **THEN** the stage endpoint SHALL receive the selected skill list with the new config
