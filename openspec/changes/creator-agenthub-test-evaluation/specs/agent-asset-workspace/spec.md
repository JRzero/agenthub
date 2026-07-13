## MODIFIED Requirements

### Requirement: Functional primary actions
The primary Continue Build and Run Test controls SHALL navigate to the selected Agent Asset's corresponding routes; Build SHALL load the construction workspace and Test SHALL load the scenario, simulation, and evaluation workspace.

#### Scenario: Continue build
- **WHEN** the user activates Continue Build
- **THEN** the application navigates to `/assets/{agentId}/build`

#### Scenario: Run test
- **WHEN** the user activates Run Test
- **THEN** the application navigates to `/assets/{agentId}/test` and loads the functional test and evaluation workspace
