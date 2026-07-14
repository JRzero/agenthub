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

### Requirement: Consistent core section order

The Overview composition SHALL follow the Build workspace priority after combining identity and persona into one summary row.

#### Scenario: Open prioritized asset composition

- **WHEN** the user opens the selected Agent Asset Overview
- **THEN** Runtime SHALL appear directly below Identity and Persona
- **AND** Knowledge SHALL appear directly below Skills
