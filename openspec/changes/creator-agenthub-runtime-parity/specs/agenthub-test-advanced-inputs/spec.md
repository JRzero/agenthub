## ADDED Requirements

### Requirement: Attachment-aware simulation
Test & Evaluation SHALL accept supported image and document files, upload pending files through the existing file endpoints, and include resolved attachment tokens in the simulation request.

#### Scenario: Send a document in simulation
- **WHEN** a Creator submits a supported pending document
- **THEN** the document SHALL be uploaded first and the resolved token SHALL be sent in `attachments`

### Requirement: Widget-aware simulation
Test & Evaluation SHALL load the Agent widget specification and SHALL submit widget attachments and custom metadata without persisting Agent configuration.

#### Scenario: Submit widget metadata
- **WHEN** a Creator supplies values through non-upload widgets
- **THEN** the simulation request SHALL include those values under `metadata.custom_fields`

### Requirement: Rich simulation outputs
Test & Evaluation SHALL render returned attachments, image URLs, Word URLs, and audio URLs using safe backend-normalized links.

#### Scenario: Render an audio response
- **WHEN** the simulation response includes `audio_url`
- **THEN** the Agent message SHALL expose playable audio and retain its text transcript

### Requirement: Test-user memory clearing
Test & Evaluation SHALL let a Creator clear the current Agent's test-user memory only after confirmation and successful test-user lookup.

#### Scenario: Clear test memory
- **WHEN** a Creator confirms memory clearing and a test-user ID is returned
- **THEN** the frontend SHALL call the existing user-Agent memory DELETE endpoint
