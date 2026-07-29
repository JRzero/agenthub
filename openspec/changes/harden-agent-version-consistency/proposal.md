## Why

The backend now enforces a single optimistic-concurrency revision across Agent draft content, media, staged Skills, and historical restoration, while listing state is managed only through lifecycle endpoints. AgentHub still uses several pre-hardening request shapes, causing valid creator actions to be rejected or displayed with incorrect lifecycle state.

## What Changes

- **BREAKING** Remove `status` from generic Agent draft updates and route publish, unpublish, relist, archive, and delete through their dedicated lifecycle endpoints.
- Include `expected_draft_revision` in final avatar, character-design, staged-Skill, and built-in Skill mutations, then adopt the returned revision immediately.
- Serialize guided-creation Skill replacements so each mutation uses the revision returned by the previous mutation.
- Handle `DRAFT_CONFLICT` consistently by refreshing the Agent, never retrying silently, and requiring creator reconfirmation.
- Represent unpublished Agents as `private`/“已下架” instead of treating them as drafts or running Agents.
- Refresh restored media, Skill, knowledge, test, and publish-check state after creating a draft from history.
- Add API contract and model tests for lifecycle, revision, conflict, and cache-refresh behavior.

## Capabilities

### New Capabilities

- `agent-draft-mutation-consistency`: Defines revision-safe mutations for ordinary draft fields, media, staged Skills, built-in Skills, guided creation, and historical restoration.
- `agent-listing-lifecycle`: Defines dedicated publish/unpublish/relist behavior and consistent draft, published, unpublished, and archived presentation.

### Modified Capabilities

None. The relevant version-management specifications have not yet been synchronized into the main specification set, so this change records the hardened contracts as new capabilities.

## Impact

- Affected modules: `agent-build`, `agent-create`, `agent-versions`, `agent-assets`, `agents`, and `workbench`.
- Affected APIs: Agent update, avatar upload/delete, character-design save/delete, pre/mid/post Skill replacement, built-in upload Skill insertion, publish, unpublish, relist, and create-draft-from-version.
- No new npm dependencies or backend changes are required.
- Demo mode remains isolated and must model revision advancement without presenting local state as a live backend result.
