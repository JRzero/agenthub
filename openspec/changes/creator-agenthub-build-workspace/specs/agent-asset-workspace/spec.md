## MODIFIED Requirements

### Requirement: Functional primary actions
The primary Continue Build and Run Test controls SHALL navigate to the selected Agent Asset's corresponding routes, and the Build route SHALL open the functional sectioned construction workspace rather than an explanatory placeholder.

#### Scenario: Continue build
- **WHEN** the user activates Continue Build
- **THEN** the application navigates to `/assets/{agentId}/build` and loads the editable Agent construction workspace

#### Scenario: Use the shared compact Agent Asset header

- **WHEN** the user moves between Overview, Build, Test, Versions, and Distribution for a selected Agent Asset
- **THEN** every route SHALL retain the same compact identity header dimensions and navigation position while presenting the relevant lifecycle action

#### Scenario: Run test
- **WHEN** the user activates Run Test
- **THEN** the application navigates to `/assets/{agentId}/test`
