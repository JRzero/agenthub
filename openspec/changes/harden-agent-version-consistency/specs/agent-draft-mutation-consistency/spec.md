## ADDED Requirements

### Requirement: Generic draft updates cannot change lifecycle status
AgentHub SHALL save ordinary draft fields through the general Agent update endpoint and MUST NOT include `status` in that request.

#### Scenario: Creator saves a draft
- **WHEN** the creator selects “保存草稿”
- **THEN** the request includes the current `expected_draft_revision` and excludes `status`

### Requirement: Final media mutations use optimistic concurrency
AgentHub MUST include the current draft revision when uploading or deleting an avatar and when saving or deleting a character design, while preview generation MUST NOT consume or send a revision.

#### Scenario: Final avatar upload succeeds
- **WHEN** a creator accepts an uploaded or generated avatar with the latest revision
- **THEN** the multipart request includes `expected_draft_revision` and the returned Agent replaces local Agent state

#### Scenario: Character preview is generated
- **WHEN** a creator generates a character specification or image preview
- **THEN** the preview request excludes `expected_draft_revision`

#### Scenario: Saved character design is removed
- **WHEN** a creator confirms removal of a saved character design
- **THEN** the delete request includes the current revision and historical media references are not assumed to be physically deleted

### Requirement: Staged Skill mutations use one revision sequence
Every pre, mid, and post Skill full replacement and built-in upload Skill insertion MUST send the current expected draft revision and adopt the returned revision.

#### Scenario: Build workspace changes one Skill stage
- **WHEN** the creator adds, removes, reorders, or configures a staged Skill
- **THEN** the replacement request includes `expected_draft_revision` and its returned revision becomes the next local revision

#### Scenario: Guided creation saves all Skill stages
- **WHEN** guided creation confirms selected Skills
- **THEN** pre, mid, and post replacement requests execute sequentially and each uses the revision returned by the previous request

### Requirement: Draft conflicts refresh instead of retrying
AgentHub MUST NOT automatically retry a mutation that returns `DRAFT_CONFLICT`; it SHALL reload the current Agent, refresh the affected editor state, and require creator reconfirmation.

#### Scenario: Media mutation conflicts
- **WHEN** a final avatar or character-design mutation returns `DRAFT_CONFLICT`
- **THEN** AgentHub reloads the Agent and tells the creator to review the latest state before retrying

#### Scenario: Skill mutation conflicts after external resource changes
- **WHEN** a staged-Skill mutation conflicts because a CreatorSkill or knowledge resource advanced the draft revision
- **THEN** AgentHub refreshes Agent and Skill state without replaying the failed replacement

#### Scenario: Historical restore conflicts
- **WHEN** create-draft-from-version returns `DRAFT_CONFLICT`
- **THEN** AgentHub reloads the Agent and version-dependent state and requires the creator to confirm restoration again

### Requirement: Historical restoration refreshes restored resources
Creating a draft from history SHALL refresh every frontend view that represents content restored by the backend.

#### Scenario: Historical restoration succeeds
- **WHEN** the backend restores Agent fields, media, staged Skills, knowledge binding, and resource manifest
- **THEN** AgentHub updates the Agent and invalidates staged Skills, versions, publish checks, and test-summary state before further editing
