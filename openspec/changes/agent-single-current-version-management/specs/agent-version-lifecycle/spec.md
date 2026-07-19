## ADDED Requirements

### Requirement: Draft saves use optimistic concurrency

The Agent build workspace SHALL load the backend draft revision and MUST include it as `expected_draft_revision` in every draft save.

#### Scenario: Successful draft save

- **WHEN** a creator saves an edited Agent draft with the latest revision
- **THEN** the workspace replaces its local Agent and editor baseline with the full response, including the new revision

#### Scenario: Conflicting draft save

- **WHEN** the backend returns `DRAFT_CONFLICT`
- **THEN** the workspace refreshes the Agent, does not retry or overwrite silently, and tells the creator that another edit changed the draft

### Requirement: Publishing replaces the single platform current version

The system SHALL publish only the current draft and SHALL atomically treat the returned version as the sole platform current version.

#### Scenario: Publish a new version

- **WHEN** a creator confirms a release note and all publish checks pass
- **THEN** the system sends the current draft revision, expected current version id and an idempotency key, then refreshes Agent and version history state

#### Scenario: First publish

- **WHEN** an Agent has no platform current version and the creator publishes its initial draft
- **THEN** the confirmation uses a null expected current version and the result becomes v1 with a generated Version Hash

#### Scenario: Repeated publish retry

- **WHEN** the same publish action is retried after a network or server failure
- **THEN** the system reuses the same request key until the draft changes or the action completes

#### Scenario: Publish blocked by conflict or compatibility

- **WHEN** the backend reports no changes, a changed current version, changed Client capabilities, or an incompatible Client
- **THEN** the platform current version remains unchanged and the UI presents an actionable blocked state

### Requirement: Published version history is immutable and traceable

The versions route SHALL list backend published versions in descending order and SHALL show version number, current status, availability, release note, creator, publication time and a copyable Version Hash.

#### Scenario: Inspect version details

- **WHEN** a creator selects a version
- **THEN** the detail area shows configuration summary, knowledge and skill references, runtime media summary, release note and publication metadata without exposing secrets

#### Scenario: Publisher name is readable

- **WHEN** a creator inspects publication metadata for a version
- **THEN** the route displays the publisher display name or username and does not expose the numeric creator id as the publisher label

#### Scenario: No platform current version

- **WHEN** the Agent has a draft but no `current_version_id`
- **THEN** the route shows a first-publish state and does not fabricate historical versions or a Version Hash

### Requirement: Historical content restores through a new draft

The system SHALL restore historical content only by creating or replacing the single current draft and MUST NOT directly change the platform current version.

#### Scenario: Create draft from history

- **WHEN** a creator confirms creating a draft from an available historical version
- **THEN** the system uses the latest draft revision, replaces local Agent/editor state with the returned Agent and states that the online version is unchanged

#### Scenario: Existing unpublished changes

- **WHEN** the backend reports `DRAFT_HAS_UNPUBLISHED_CHANGES`
- **THEN** the UI asks for explicit replacement confirmation before resubmitting with `confirm_replace: true`

#### Scenario: Revoked historical version

- **WHEN** a historical version is revoked
- **THEN** the create-draft action is disabled and the system does not attempt restoration

### Requirement: Build workspace distinguishes draft and runtime state

The build workspace SHALL identify the current draft base version and SHALL state which published version continues serving new runtime requests until publication.

#### Scenario: Editing a published Agent

- **WHEN** the creator edits a draft based on platform current v4
- **THEN** the UI shows “当前草稿 · 基于 v4”, “平台仍运行 v4” and “Version Hash：发布后生成”

#### Scenario: Save or test draft

- **WHEN** the creator saves or tests the draft
- **THEN** the platform current version and existing Session bindings remain unchanged

#### Scenario: Draft restored from an older version

- **WHEN** the creator creates the current draft from historical v1 while the platform current version remains v3
- **THEN** the build header shows “当前草稿 · 基于 v1” and continues to show the runtime state as v3
