## MODIFIED Requirements

### Requirement: Workspace workbench

The workspace SHALL provide a landing page that uses current Agent data to select a focused Agent, resume work, summarize real lifecycle state, show deterministic pending tasks, open recent assets, and present Agent selection as a persistent layered carousel with controllable automatic advance.

#### Scenario: Three or more existing Agents

- **WHEN** a creator opens the Workbench with at least three Agent Assets
- **THEN** the Workbench SHALL present a focused Agent with distinct neighboring Agents that can become focused
- **AND** desktop near neighbors SHALL expose approximately 58–68% of their card width and far neighbors SHALL expose approximately 28–40% without page-level horizontal overflow
- **AND** the focused detail SHALL link to the existing Agent workspace route
- **AND** lifecycle totals SHALL be derived from the loaded collection
- **AND** pending tasks SHALL link to the relevant Build or Test route
- **AND** recent assets SHALL link to their Agent Asset overview

#### Scenario: Persistent layered transition

- **WHEN** the creator selects the previous Agent, next Agent, or a visible neighboring Agent
- **THEN** persistent Agent card nodes SHALL move continuously through horizontal position, scale, and stacking roles toward the new five-slot arrangement
- **AND** the stage shell and card artwork SHALL remain continuously visible without group opacity, a black overlay, an empty frame, or a keyed whole-group replacement
- **AND** the committed detail SHALL match the landed center Agent when the transition completes

#### Scenario: Automatic advance

- **WHEN** more than one Agent is available and the carousel remains eligible for six seconds
- **THEN** the Workbench SHALL request the next Agent exactly once
- **AND** SHALL wait for the current 720ms transition to complete before scheduling another full six-second interval

#### Scenario: Automatic advance pause conditions

- **WHEN** the carousel is hovered, contains keyboard focus, the document is hidden, the user has paused autoplay, a transition is active, reduced motion is preferred, or only one Agent exists
- **THEN** automatic advance SHALL NOT run
- **AND** a full six-second interval SHALL begin after an eligible transient pause ends

#### Scenario: Visible autoplay control

- **WHEN** more than one Agent is available
- **THEN** the Workbench SHALL show an accessible pause/resume control whose visible label and pressed state reflect the user's explicit autoplay preference
- **AND** using the control SHALL NOT change the focused Agent, Agent ordering, or route

#### Scenario: Manual navigation resets autoplay

- **WHEN** the creator uses previous, next, or a visible neighboring Agent selection
- **THEN** any pending autoplay request SHALL be cancelled
- **AND** a new full six-second interval SHALL begin only after the manual transition is idle and all pause conditions are clear

#### Scenario: Rapid carousel input

- **WHEN** the creator requests multiple valid carousel targets before the current transition completes
- **THEN** the Workbench SHALL retain only the last valid pending target
- **AND** it SHALL complete at that target without an accumulating catch-up queue, duplicated cards, an empty stage, or overlapping autoplay transitions

#### Scenario: Circular carousel boundaries

- **WHEN** the creator moves previous from the first Agent or next from the last Agent
- **THEN** the carousel SHALL wrap deterministically while preserving direction, distinct card identities, and continuous layered geometry

#### Scenario: Reduced motion

- **WHEN** the creator prefers reduced motion
- **THEN** the carousel SHALL commit requested manual navigation immediately or effectively immediately without positional travel, opacity flashing, or changed focus semantics
- **AND** automatic advance SHALL remain disabled

#### Scenario: Fewer than three existing Agents

- **WHEN** the loaded collection contains one or two Agent Assets
- **THEN** the stage SHALL render only distinct available Agents without duplicating records or inventing empty Agent identities
- **AND** the available focused Agent SHALL remain resumable
- **AND** a single Agent SHALL NOT start autoplay or show an unnecessary autoplay control

#### Scenario: Missing optional Agent data

- **WHEN** the focused Agent lacks artwork, description, version, or model data
- **THEN** the Workbench SHALL use existing artwork fallback behavior and honest neutral absence treatment
- **AND** it SHALL NOT synthesize design-only values

#### Scenario: Workbench query states

- **WHEN** the Agent query is loading, empty, or failed
- **THEN** the Workbench SHALL present an explicit state appropriate to that condition
