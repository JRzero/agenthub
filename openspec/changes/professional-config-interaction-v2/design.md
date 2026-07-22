## Context

The approved July 22 handoff supersedes the prior page-level-scroll and saved-configuration-preview decisions. This slice implements every non-autosave requirement while preserving the current explicit Save Draft action and revision conflict handling.

## Decisions

### Fixed-height Build workstation

The Agent header and lifecycle tabs remain in the shared shell. The Build body consumes the remaining viewport height. The professional navigation, editor body, and preview message body own overflow; the document does not scroll while Build is active. At narrower desktop widths the preview collapses to its existing rail instead of forcing horizontal overflow.

### Manual draft save remains an explicit exception

Editable Agent fields continue to use the existing local draft and `PUT /agents/{id}` revision contract. This delivery does not debounce or queue saves. Staged skill APIs retain their current immediate persistence behavior. The UI must not claim that unsaved local form changes are already saved.

### Resource-first configuration

Skills are selected from installed Workspace skills and shown by product name, description, phase, and availability. Knowledge keeps one selected library. Memory and safety expose only real switches. Unavailable media segments and actions are omitted rather than rendered as disabled engineering placeholders.

### Saved-draft preview

Live preview uses the existing simulation endpoint instead of formal Runtime sessions. It shows current saved draft identity and only the latest exchange. Local unsaved changes block sending until Save Draft succeeds. The backend currently may read or write test-user memory during simulation; this limitation is recorded rather than hidden.

## Risks

- Manual save is intentionally inconsistent with the locked autosave handoff and must be revisited in a later change.
- Simulation is not fully side-effect-free until the backend can disable memory read/write in preview mode.
- Skill phase writes use existing endpoints and do not share the Agent revision lock.
