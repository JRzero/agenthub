## ADDED Requirements

### Requirement: Motherland co-creation

Build SHALL support Motherland history, manual talk, topic generation, automatic rounds, and reset.

#### Scenario: Apply an optimized narrative

- **WHEN** a Creator accepts an optimized narrative
- **THEN** it SHALL update the unsaved Build prompt draft

### Requirement: Character design pipeline

Build SHALL preserve generation and save of character specs, sheets, and avatar previews.

#### Scenario: Save character design

- **WHEN** spec text and a sheet image exist
- **THEN** both SHALL be written through the existing Agent character-design endpoint

### Requirement: Moments operation

Build SHALL support Moment draft, image upload, publish, list, delete, Creator comments, and auto schedules.

#### Scenario: Send a Creator comment

- **WHEN** a Creator posts a comment without the required prefix
- **THEN** the frontend SHALL prepend `[创作者评论]`

### Requirement: Share-link deletion

Distribution SHALL support guarded deletion of an existing public share link.

#### Scenario: Delete a share link

- **WHEN** a Creator confirms deletion
- **THEN** the existing DELETE endpoint SHALL be called and the share state refreshed
