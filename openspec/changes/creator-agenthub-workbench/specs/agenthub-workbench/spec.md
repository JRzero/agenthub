## ADDED Requirements

### Requirement: Workspace workbench

The workspace SHALL provide a landing page that uses current Agent data to resume work, show deterministic pending tasks, and open recent assets.

#### Scenario: Existing Agents

- **WHEN** a creator opens the Workbench with Agent Assets
- **THEN** one Agent SHALL be available to continue building
- **AND** pending tasks SHALL link to the relevant Build or Test route
- **AND** recent assets SHALL link to their Agent Asset overview

### Requirement: Agent creation

The Workbench SHALL create a live Agent through the existing workspace-scoped API and route the created Agent to Build.

#### Scenario: Valid creation

- **WHEN** the creator supplies a name and code
- **THEN** the frontend SHALL submit the compatible Agent defaults
- **AND** the created Agent SHALL become available in workspace queries
- **AND** the creator SHALL enter its Build workspace

### Requirement: Metric provenance

Performance metrics SHALL be labelled demo when sourced from fixtures and SHALL be unavailable in live mode without an analytics contract.

#### Scenario: Live mode without analytics

- **WHEN** no analytics endpoint is configured
- **THEN** the Workbench SHALL not show design-only numbers as production facts
