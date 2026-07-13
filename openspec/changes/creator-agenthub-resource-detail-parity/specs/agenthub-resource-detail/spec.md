## ADDED Requirements

### Requirement: Creator Skill lifecycle
The Resource Library SHALL let a Creator inspect a marketplace skill, install it with schema defaults, edit the owned skill name/config/status, and delete it with confirmation.

#### Scenario: Install with defaults
- **WHEN** a Creator installs a marketplace skill whose config schema defines default values
- **THEN** the Creator Skill SHALL be created with those defaults

#### Scenario: Update owned skill
- **WHEN** a Creator submits a valid name, status, and JSON configuration
- **THEN** the existing Creator Skill update endpoint SHALL receive those values

#### Scenario: Delete owned skill
- **WHEN** a Creator confirms deletion
- **THEN** the existing Creator Skill delete endpoint SHALL be called and the owned list SHALL refresh

### Requirement: Knowledge-base administration
The Resource Library SHALL let a Creator edit a knowledge base and add text, URL, or supported file documents.

#### Scenario: Upload a file
- **WHEN** a Creator selects a document file
- **THEN** the file SHALL be uploaded as multipart data with authentication and workspace scope

### Requirement: Knowledge-document inspection
The Resource Library SHALL expose document metadata, bounded chunk inspection, reindexing, and guarded deletion.

#### Scenario: Inspect chunks
- **WHEN** a Creator opens a document detail
- **THEN** the document and its first chunk page SHALL be loaded from the existing endpoints

#### Scenario: Reindex a document
- **WHEN** a Creator requests reindexing
- **THEN** the existing reindex endpoint SHALL be called and the document status SHALL be refreshed
