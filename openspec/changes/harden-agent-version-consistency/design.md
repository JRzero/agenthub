## Context

AgentHub already models an immutable platform-current Agent version and a mutable draft, but several auxiliary draft mutations predate the backend's unified `draft_revision` enforcement. Those mutations currently omit the expected revision, some guided-creation mutations run concurrently, and listing state is inferred from `current_version_id` instead of the backend lifecycle status.

The backend contract is authoritative:

- every final draft mutation consumes one revision;
- preview generation consumes no revision;
- general Agent updates cannot modify status;
- unpublish preserves the current version while changing status to `private`;
- conflicts require a fresh Agent read and creator reconfirmation.

## Goals / Non-Goals

**Goals:**

- Make every AgentHub draft mutation revision-safe.
- Keep the React Query Agent cache as the current revision source after successful mutations.
- Present published, unpublished, draft, creating, and archived lifecycle states accurately.
- Ensure conflict handling never silently retries or overwrites remote changes.
- Keep publish idempotency behavior intact.

**Non-Goals:**

- Changing backend endpoints or persistence behavior.
- Adding Agent version selection to Clients or chat requests.
- Requiring a Client for publish or export.
- Adding revision arguments to preview-generation requests.

## Decisions

### Use the full returned Agent as the canonical revision update

Media and character-design mutations return an updated Agent. Their callers will replace the cached Agent and editor state with that response rather than incrementing revision locally. This avoids assuming that only one backend field changed.

For staged-Skill endpoints, which return only `draft_revision`, the shared mutation result will update the cached Agent revision while preserving other cached fields.

Alternative considered: incrementing every revision locally. Rejected because CreatorSkill and knowledge-resource changes may advance a revision outside the active component.

### Require a revision at every mutation boundary

Mutation helpers will accept an explicit `expectedDraftRevision` argument. UI code must obtain it from the current Agent query and block the mutation when it is absent rather than sending zero.

Alternative considered: allowing optional revisions with `?? 0`. Rejected because the backend treats zero as an invalid request and the resulting error is not actionable.

### Serialize guided-creation stage replacement

Guided creation will replace pre, mid, and post Skills sequentially. Each request will use the revision returned by the previous request and return the final revision to the reducer.

Alternative considered: a parallel request batch. Rejected because all three requests would race against the same revision.

### Centralize conflict refresh behavior around query invalidation

Each editing surface will recognize `ApiError` code `DRAFT_CONFLICT`, fetch or invalidate the current Agent, discard stale optimistic state, and display a reconfirmation message. The system will not automatically replay the failed mutation.

### Derive lifecycle presentation from status plus current-version presence

`active` means published/listed. `private` with a current version means unpublished. An Agent without a current version remains a draft, unless it is still in guided creation. `archived` remains archived. Components will use one shared presentation helper to avoid contradictory labels.

### Keep publish and listing mutations separate

Publish retains revision, current-version, release-note, and idempotency inputs. Unpublish and relist use dedicated no-body endpoints and adopt the returned Agent without consuming draft revision.

## Risks / Trade-offs

- **[Risk] A cached revision may already be stale because of an external resource mutation.** → The next mutation returns `DRAFT_CONFLICT`; the UI refreshes and requires explicit reconfirmation.
- **[Risk] Sequential guided-creation requests take longer than parallel requests.** → Three small ordered requests are required for correctness and expose deterministic progress.
- **[Risk] A mutation response may omit a full Agent.** → Contract-specific adapters update only the returned revision and immediately invalidate the Agent query where necessary.
- **[Risk] Unpublished status was previously shown as a draft.** → Introduce a shared lifecycle presenter and cover all workspace surfaces with unit tests.

## Migration Plan

1. Update request/response types and pure lifecycle/revision helpers.
2. Update draft, media, character-design, and Skill API contracts.
3. Update guided creation and build surfaces to use returned revisions.
4. Add listing endpoints and lifecycle actions.
5. Add unified conflict refresh behavior and restore invalidation.
6. Run contract tests, full build gates, OpenSpec validation, and live browser verification.

Rollback is a frontend commit revert. No local data migration or backend rollback is required.

## Open Questions

None. Backend status `private`, lifecycle endpoints, and mutation response shapes are defined by the cross-repository handoff and backend implementation.
