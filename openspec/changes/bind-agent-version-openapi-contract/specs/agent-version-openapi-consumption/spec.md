## ADDED Requirements

### Requirement: Consumer projection identifies its authority and state
The repository SHALL store an offline Agent version consumer projection that identifies `linkyun-agent:docs/openapi/openapi.yaml` as its authority, records a deterministic consumer SHA-256, and MUST distinguish an unverified consumer candidate from a producer-confirmed binding.

#### Scenario: Producer digest is unavailable
- **WHEN** the complete authoritative OpenAPI and exact `HAR-06C-LA` digest are not available in the repository
- **THEN** the projection records a candidate status, a null producer digest and the blocking handoff ID without claiming that the producer contract is bound

#### Scenario: Exact producer candidate digest is available but uncommitted
- **WHEN** the producer handoff provides an exact OpenAPI SHA-256 and baseline for an uncommitted candidate
- **THEN** the projection records that evidence with `candidate_uncommitted` and partial binding status and MUST NOT describe it as committed, active or confirmed

#### Scenario: Consumer projection is reproduced offline
- **WHEN** verification reads the checked-in projection bytes without network access
- **THEN** their SHA-256 matches the checked-in deterministic consumer digest

### Requirement: Version endpoints and methods are guarded offline
The contract suite SHALL invoke every public API wrapper owned by `src/modules/agent-versions/api.ts` and MUST fail when an observed endpoint path or HTTP method differs from the consumer projection.

#### Scenario: Version lifecycle operation drifts
- **WHEN** list, detail, publish, listing lifecycle or historical draft restoration changes path or method
- **THEN** the offline contract test fails and identifies the affected operation

#### Scenario: Client or export operation drifts
- **WHEN** Client CRUD, runtime version, generic export, Client-compatible export or ZIP download changes path or method
- **THEN** the offline contract test fails and identifies the affected operation

### Requirement: Concurrency and stable errors are guarded offline
The consumer contract SHALL preserve all required optimistic concurrency and idempotency fields and SHALL enumerate the stable version business error codes handled by AgentHub.

#### Scenario: Publish concurrency field is removed
- **WHEN** a publish request omits or renames `expected_draft_revision`, `expected_current_version_id`, `release_note` or `request_key`
- **THEN** the offline contract test fails before integration with a live backend

#### Scenario: Restore or Client concurrency field is removed
- **WHEN** historical restore omits `expected_draft_revision` or `confirm_replace`, or Client update omits `expected_capability_hash`
- **THEN** the offline contract test fails before integration with a live backend

#### Scenario: Stable error handling is removed
- **WHEN** AgentHub no longer recognizes a stable projected version business error code
- **THEN** the offline contract test fails instead of silently falling back to an unknown raw error

### Requirement: Client runtime and export semantics are guarded offline
The consumer contract SHALL define Client runtime as following the platform current Agent version, SHALL keep generic exports independent of a Client, and MUST treat the backend ZIP download as the public export payload rather than `storage_path`.

#### Scenario: Runtime response is mapped
- **WHEN** the backend returns a runtime `version` and optional `client_config`
- **THEN** AgentHub preserves them and derives its current version id, number and hash aliases from that returned version

#### Scenario: Generic export is created
- **WHEN** AgentHub creates an Agent-level export
- **THEN** it calls the generic Agent export endpoint without a Client id or browser-generated package body

#### Scenario: Compatible Client export is created
- **WHEN** an existing flow creates a Client-specific export
- **THEN** it uses the explicitly projected compatibility endpoint without changing the generic export semantic

#### Scenario: Export is downloaded
- **WHEN** AgentHub downloads an export record
- **THEN** it requests the projected authenticated download endpoint, accepts ZIP bytes and does not expose or resolve the record's internal `storage_path`
