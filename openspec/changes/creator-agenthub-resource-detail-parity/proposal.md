## Why

AgentHub can browse marketplace skills and create basic knowledge sources, but Creators still need the legacy UI for skill lifecycle management and knowledge-document inspection. Completing these workflows keeps resource ownership inside the new two-level Agent Asset platform without changing backend behavior.

## What Changes

- Add marketplace detail retrieval and preserve schema defaults when installing a skill.
- Add Creator Skill rename, JSON configuration, status update, and guarded deletion.
- Add knowledge-base editing and document file upload.
- Add document detail, chunk inspection, reindexing, and guarded deletion.
- Keep workspace scoping and existing API contracts unchanged.

## Capabilities

### New Capabilities

- `agenthub-resource-detail`: Creator Skill lifecycle and knowledge-document detail operations in the AgentHub Resource Library.

### Modified Capabilities

None.

## Impact

- Affects `src/modules/resources` and its contract tests.
- Reuses `/skills/marketplace`, `/creator-skills`, `/knowledge-bases`, and `/documents` endpoints.
- Adds no dependency and makes no backend or legacy Creator changes.
