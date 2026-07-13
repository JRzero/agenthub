## ADDED Requirements

### Requirement: Workspace Skills Library

The Resource Library SHALL read marketplace and Creator skills within the current workspace and SHALL support search, category selection, workspace installation, and Agent attachment.

#### Scenario: Attach a skill

- **WHEN** a creator selects a marketplace skill and an Agent
- **THEN** the frontend SHALL update that Agent without dropping its existing skills
- **AND** demo mode SHALL not issue a production request

### Requirement: Knowledge assets

The Resource Library SHALL support knowledge-base list, create, delete, selection, document list, text/URL creation, and document delete through existing contracts.

#### Scenario: Add knowledge text

- **WHEN** a creator adds a titled text source to a selected knowledge base
- **THEN** the frontend SHALL call the compatible text-document endpoint
- **AND** the resulting document SHALL appear in the selected knowledge asset

### Requirement: Honest resource boundaries

Media and template tabs SHALL remain readable and explicit unavailable states until real workspace resource contracts exist.

#### Scenario: Open an unavailable resource type

- **WHEN** a creator opens Media or Templates
- **THEN** the interface SHALL describe the missing contract
- **AND** it SHALL not persist fixture content as production data
