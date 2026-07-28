## MODIFIED Requirements

### Requirement: Create and resume Agent assets
The Agent Asset Library and Workbench SHALL route new creation into the guided wizard, SHALL keep discovery controls visible, and SHALL present server-reported creating Agents as resumable creation records without fabricating version metadata.

#### Scenario: Open a creating Agent
- **WHEN** the creator activates an Agent whose server state is creating
- **THEN** AgentHub opens `/assets/create` for that Agent and resumes its first incomplete step

#### Scenario: Render an unpublished creating Agent
- **WHEN** a creating Agent has no published current version
- **THEN** the list displays `创建中 · 第 N/4 步`
- **AND** it does not display `v1`, a Version Hash, or an online runtime state

#### Scenario: Find an Agent asset
- **WHEN** the creator searches by Agent name, code, or description or selects a lifecycle status
- **THEN** the Asset Library immediately displays matching records
- **AND** the discovery controls remain visible above the results
