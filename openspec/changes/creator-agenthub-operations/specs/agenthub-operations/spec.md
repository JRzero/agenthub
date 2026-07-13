## ADDED Requirements

### Requirement: Shared conversation review

Application Operations SHALL list workspace shared H2A sessions and SHALL support search, Agent/status filters, selection, and message review.

#### Scenario: Select a shared session

- **WHEN** a creator selects a shared session
- **THEN** its messages and safe participant labels SHALL be loaded
- **AND** system/tool messages SHALL not be presented as human conversation turns

### Requirement: Creator handling actions

The selected session SHALL support verification, creator comment push, session Prompt patch, and user Prompt patch through existing backend contracts.

#### Scenario: Send creator comment

- **WHEN** a creator sends a non-empty comment
- **THEN** it SHALL target the selected user, Agent, and session
- **AND** the content SHALL retain the `[创作者评论]` prefix

### Requirement: Honest operations provenance

The interface SHALL not fabricate feedback, memory traces, audit history, or channel configuration that the backend does not return.

#### Scenario: Open unsupported operation tab

- **WHEN** a creator opens an unsupported operations tab
- **THEN** the interface SHALL explain the missing workspace contract
- **AND** it SHALL not issue a production write
