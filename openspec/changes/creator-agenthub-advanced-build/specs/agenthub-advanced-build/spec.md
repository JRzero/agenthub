## ADDED Requirements

### Requirement: Provider catalogue

The Build runtime section SHALL load current backend LLM Provider configurations, group them by supplier, and expose the supplier separately from its models while retaining custom compatibility protocols in the Provider control.

#### Scenario: Select a Provider

- **WHEN** a Creator selects a Provider
- **THEN** the draft SHALL retain its Provider name
- **AND** any custom compatibility protocol SHALL be cleared
- **AND** the model override SHALL remain empty until the Creator explicitly selects an available model
#### Scenario: Select a supplier model

- **WHEN** a Creator selects a model under a catalogue supplier
- **THEN** the draft SHALL retain the selected model override
- **AND** the frontend SHALL map the supplier and model to the matching concrete backend Provider configuration

#### Scenario: Select a custom compatibility protocol

- **WHEN** a Creator selects a custom compatibility protocol
- **THEN** the draft SHALL retain the protocol
- **AND** any backend Provider name SHALL be cleared
- **AND** the runtime section SHALL NOT display a second Provider selector

### Requirement: Runtime default inheritance

The Build runtime section SHALL expose model and Temperature overrides without replacing system defaults with frontend fallback values.

#### Scenario: Use system runtime defaults

- **WHEN** model selection is empty and Temperature is set to use the system default
- **THEN** the frontend SHALL serialize an empty model name and a `null` Temperature
- **AND** the model control SHALL list models declared by the Provider catalogue

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
