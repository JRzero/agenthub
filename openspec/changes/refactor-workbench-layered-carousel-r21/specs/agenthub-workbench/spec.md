## MODIFIED Requirements

### Requirement: Workspace workbench

The workspace SHALL provide a landing page that uses current Agent data to select a focused Agent, resume work, summarize real lifecycle state, show deterministic pending tasks, open recent assets, and present Agent selection as a persistent layered carousel.

#### Scenario: Three or more existing Agents

- **WHEN** a creator opens the Workbench with at least three Agent Assets
- **THEN** the Workbench SHALL present a focused Agent with distinct neighboring Agents that can become focused
- **AND** the focused detail SHALL link to the existing Agent workspace route
- **AND** lifecycle totals SHALL be derived from the loaded collection
- **AND** pending tasks SHALL link to the relevant Build or Test route
- **AND** recent assets SHALL link to their Agent Asset overview

#### Scenario: Persistent layered transition

- **WHEN** the creator selects the previous Agent, next Agent, or a visible neighboring Agent
- **THEN** persistent Agent card nodes SHALL move continuously through horizontal position, scale, and stacking roles toward the new five-slot arrangement
- **AND** the stage shell and card artwork SHALL remain continuously visible without group opacity, a black overlay, an empty frame, or a keyed whole-group replacement
- **AND** the committed detail SHALL match the landed center Agent when the transition completes

#### Scenario: Rapid carousel input

- **WHEN** the creator requests multiple valid carousel targets before the current transition completes
- **THEN** the Workbench SHALL retain only the last valid pending target
- **AND** it SHALL complete at that target without an accumulating catch-up queue, duplicated cards, or an empty stage

#### Scenario: Circular carousel boundaries

- **WHEN** the creator moves previous from the first Agent or next from the last Agent
- **THEN** the carousel SHALL wrap deterministically while preserving direction, distinct card identities, and continuous layered geometry

#### Scenario: Reduced motion

- **WHEN** the creator prefers reduced motion
- **THEN** the carousel SHALL commit the requested Agent immediately or effectively immediately without positional travel, opacity flashing, or changed focus semantics

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
