## ADDED Requirements

### Requirement: Agent Asset scoped navigation
The application SHALL show overview, build, test and evaluation, versions, and distribution navigation for the currently selected Agent Asset, visually distinct from workspace-level navigation.

#### Scenario: Open an Agent Asset
- **WHEN** the user selects an Agent from the asset library
- **THEN** the application opens `/assets/{agentId}/overview` and identifies both the active workspace module and active asset section

### Requirement: Live Agent header
The Agent Asset header SHALL display the selected live Agent's avatar or accessible fallback, name, backend status, version, derived completeness, and primary build and test actions.

#### Scenario: Load a live Agent
- **WHEN** the backend returns an Agent for the selected identifier
- **THEN** the header renders backend-backed identity and version values without replacing them with demo values

### Requirement: Derived asset composition
The overview SHALL map existing Agent fields into identity/persona, knowledge, skills, memory, media, runtime, and safety composition rows and MUST label derived completion values as frontend asset completeness.

#### Scenario: Explain incomplete asset composition
- **WHEN** a required source field such as knowledge binding or media metadata is absent
- **THEN** the matching composition row shows an incomplete state without claiming a backend evaluation failure

### Requirement: Client adapter presentation
The overview SHALL present client adapter information according to the capability registry and MUST distinguish demo adapter data from live backend data.

#### Scenario: Backend has no adapter API
- **WHEN** client adapters are configured as demo or unavailable
- **THEN** the adapter panel shows an explicit data-source label and prevents production write actions

### Requirement: Functional primary actions
The primary Continue Build and Run Test controls SHALL navigate to the selected Agent Asset's corresponding routes.

#### Scenario: Continue build
- **WHEN** the user activates Continue Build
- **THEN** the application navigates to `/assets/{agentId}/build`

#### Scenario: Run test
- **WHEN** the user activates Run Test
- **THEN** the application navigates to `/assets/{agentId}/test`

### Requirement: Asset loading and error states
The Agent Asset workspace SHALL provide loading, not-found, unauthorized, network-error, and retry states.

#### Scenario: Retry a failed Agent query
- **WHEN** a live Agent request fails and the user activates Retry
- **THEN** the application repeats the request without losing the selected workspace
