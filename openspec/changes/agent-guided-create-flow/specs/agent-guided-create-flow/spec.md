## ADDED Requirements

### Requirement: Four-step full-page creation workspace

AgentHub SHALL create Agents through a full-page four-step wizard ordered as Basic Setup, Create Avatar, Character Sheet, and Configure Skills. The desktop workspace SHALL retain workspace navigation as a compact icon rail and SHALL fit the main creation interaction without a browser-page vertical scrollbar. The creation preview SHALL remain hidden until the product flow explicitly enables it.

#### Scenario: Start creating an Agent
- **WHEN** the creator activates a new-Agent action from the Asset Library or Workbench
- **THEN** AgentHub navigates to `/assets/create`
- **AND** no creation modal is mounted
- **AND** Basic Setup is selected with status `尚未创建`

#### Scenario: Keep the main interaction in one viewport
- **WHEN** the wizard is shown at the approved desktop viewport
- **THEN** progress, the active task, and bottom actions remain visible without browser-page vertical scrolling
- **AND** the creation preview is not displayed
- **AND** only bounded editors or lists may scroll internally

### Requirement: Generate basic setup before establishing a draft

Before generation, the wizard SHALL collect only Agent name, role identity, user relationship, optional primary interaction, and up to four personality/expression tags. It MUST NOT display or accept an Agent Code, model, runtime, deployment, knowledge, memory, safety, Moments, or Client setting.

#### Scenario: Basic generation succeeds
- **WHEN** valid role input produces Agent description, role system prompt, opening content, and three example conversations successfully
- **THEN** the backend establishes one creating Agent draft atomically
- **AND** the wizard enters creating state without displaying Agent Code, version number, or Version Hash

#### Scenario: Basic generation fails
- **WHEN** generation fails
- **THEN** the current role input remains available for retry
- **AND** no visible Agent record is created

### Requirement: Confirm candidates before replacing draft content

Generated basic content, the single avatar preview, and character sheets SHALL remain candidates until explicit confirmation. Regeneration MUST NOT overwrite confirmed content.

#### Scenario: Regenerate confirmed content
- **WHEN** the creator requests a new result after a previous result was confirmed
- **THEN** the confirmed value remains active
- **AND** the new result is shown separately as a candidate

#### Scenario: Confirm a candidate
- **WHEN** the creator confirms a candidate and its backing draft write succeeds
- **THEN** the confirmed draft reference changes to the candidate
- **AND** the next step becomes available

### Requirement: Require visual confirmation and allow skill skip

The wizard SHALL require a confirmed avatar and a confirmed character sheet. Configure Skills SHALL allow zero or more Workspace resource skills and SHALL be skippable.

#### Scenario: Attempt to continue without a required visual
- **WHEN** no avatar or character sheet has been confirmed for its required step
- **THEN** the continue action remains unavailable

#### Scenario: Skip skills
- **WHEN** the creator activates Skip in Configure Skills
- **THEN** AgentHub preserves an empty skill selection and completes creation

#### Scenario: Review a generated character sheet
- **WHEN** character-sheet generation succeeds
- **THEN** AgentHub displays the image sheet and its generated textual specification together
- **AND** the image sheet is displayed proportionally without cropping
- **AND** activating View Large Image opens an in-product modal preview without navigating to or downloading the source asset
- **AND** the textual specification remains readable in a bounded scrollable area
- **AND** confirming the candidate saves both outputs without changing the creation flow

### Requirement: Select skills from the Workspace resource catalog

Configure Skills SHALL display only current Workspace skills that are installed and available. Each item SHALL expose product-facing name, description, and installation state and SHALL NOT expose English identifiers, parameter schemas, call names, runtime stages, JSON configuration, or skill publishing controls.

#### Scenario: Complete with selected skills
- **WHEN** the creator selects skills and completes creation
- **THEN** the draft stores stable references to the selected skill versions supplied by the backend contract

### Requirement: Autosave, exit, and resume creating drafts

After draft establishment, confirmed changes SHALL autosave through revision-aware writes. The creator SHALL be able to save and exit and later resume at the first incomplete step.

#### Scenario: Resume a creating Agent
- **WHEN** the creator opens a creating Agent from the Asset Library
- **THEN** the wizard loads server-persisted creation progress and confirmed draft content
- **AND** it selects the first incomplete step

#### Scenario: Save fails
- **WHEN** an autosave or confirmation write fails
- **THEN** the current local input is retained with a clear unsaved state and retry action
- **AND** unsafe exit from the current step is prevented

### Requirement: Track downstream visual freshness

The wizard SHALL apply the approved dependency rules without deleting confirmed downstream values. Identity or personality changes require base reconfirmation and mark avatar and character sheet pending update; relationship or primary-interaction changes require base reconfirmation while preserving visual freshness; avatar changes mark character sheet pending update.

#### Scenario: Confirm a replacement downstream asset
- **WHEN** a required downstream asset is pending update
- **THEN** its previous confirmed value remains visible
- **AND** completion remains blocked until the replacement candidate is confirmed

### Requirement: Complete as an unpublished draft

Creation completion SHALL summarize the confirmed base setup, avatar, character sheet, and selected skills. It SHALL state that the Agent is an unpublished draft and SHALL offer Test Agent and Enter Professional Configuration.

#### Scenario: Finish creation
- **WHEN** all required confirmations are saved and skills are selected or skipped
- **THEN** AgentHub marks the creation workflow complete without publishing
- **AND** it does not create a version, Version Hash, Client, deployment, or formal Runtime session
- **AND** no version number or Hash is displayed
