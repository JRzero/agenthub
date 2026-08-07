## MODIFIED Requirements

### Requirement: Workspace workbench

The workspace SHALL provide a landing page that uses current Agent data to select a focused Agent, resume work, summarize real lifecycle state, show deterministic pending tasks, and open recent assets.

#### Scenario: Three or more existing Agents

- **WHEN** a creator opens the Workbench with at least three Agent Assets
- **THEN** the Workbench SHALL present a focused Agent with distinct neighboring Agents that can become focused
- **AND** the focused detail SHALL link to the existing Agent workspace route
- **AND** lifecycle totals SHALL be derived from the loaded collection
- **AND** pending tasks SHALL link to the relevant Build or Test route
- **AND** recent assets SHALL link to their Agent Asset overview

#### Scenario: Fewer than three existing Agents

- **WHEN** the loaded collection contains one or two Agent Assets
- **THEN** the stage SHALL render only distinct available Agents without duplicating records or inventing empty Agent identities
- **AND** the available focused Agent SHALL remain resumable

#### Scenario: Missing optional Agent data

- **WHEN** the focused Agent lacks artwork, description, version, or model data
- **THEN** the Workbench SHALL use existing artwork fallback behavior and honest neutral absence treatment
- **AND** it SHALL NOT synthesize design-only values

#### Scenario: Workbench query states

- **WHEN** the Agent query is loading, empty, or failed
- **THEN** the Workbench SHALL present an explicit state appropriate to that condition
