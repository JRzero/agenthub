## Context

The approved `04-build.png` design describes a three-column construction surface: ordered asset sections, a focused editor, and a real-time preview. The legacy Creator already persists the relevant fields, but its 4,000-line edit page mixes identity, prompt, knowledge, skills, model credentials, moments, Motherland, sharing, media, and testing in one component.

The new frontend already has compatible auth, workspace, Agent queries, capability provenance, and an Agent Asset header. This change must add useful editing without copying the legacy page or altering backend behavior.

## Goals / Non-Goals

**Goals:**

- Match the approved Build workspace hierarchy inside the selected Agent Asset route.
- Support real edits for identity, persona, knowledge binding, skills, memory policy, runtime, and safe presentation flags through the current Agent update contract.
- Make dirty, saving, saved, validation, reset, error, demo, and unavailable states explicit.
- Keep the preview responsive and interactive using local form state.
- Keep components and contracts small enough for later domain-specific migration.

**Non-Goals:**

- Migrating skill marketplace configuration, media upload/generation, Motherland, moments, share links, or secret LLM credentials.
- Adding a new test endpoint or claiming the local preview is a backend conversation.
- Changing the legacy Creator, backend schemas, or production routing.

## Decisions

### 1. Use a typed editable draft separate from the backend Agent

`AgentBuildDraft` normalizes current Agent fields into controlled form values. A mapper creates the draft and a serializer emits only fields accepted by the existing update endpoint. This prevents view-only fields and future UI state from leaking into requests.

Alternative: mutate the query Agent directly. Rejected because cancellation, dirty comparison, and partial response handling become unreliable.

### 2. Save supported sections through one existing Agent update call

Identity, prompt, examples, skills, knowledge, memory, runtime, and display flags are serialized into `PUT /agents/{id}`. After success the Agent query cache is updated and the saved snapshot resets.

Alternative: autosave each control as in parts of the legacy page. Rejected for this slice because it produces many writes, makes error ownership unclear, and prevents a reliable draft workflow.

### 3. Isolate demo writes in the editor hook

Demo mode resolves saves locally after a short async boundary, updates the local saved snapshot, and never calls the HTTP client. A visible demo source badge remains in the toolbar.

### 4. Keep all Build sections in one route

The ordered section rail changes the active editor panel without changing the URL. This matches the approved design and keeps one unsaved draft across identity, persona, and runtime edits.

Alternative: one route per section. Rejected because navigation would require cross-route draft persistence before the product needs it.

### 5. Treat the right preview as a draft renderer

The preview uses the selected Agent's real avatar plus local name, description, prompt, and example questions. Sending a preview message adds a local transcript item marked as preview-only; backend evaluation remains the responsibility of the Test route.

### 6. Defer unsupported writes explicitly

Media upload and advanced safety policies remain visible sections with explanatory unavailable states. Secret provider keys are not read or edited in this slice.

### 7. Prioritize content space across Agent Asset routes

Every Agent Asset route uses the same compact identity header so page transitions preserve a stable content origin and do not repeat overview-scale identity content. The header keeps one contextual lifecycle action: Build routes expose Run Test, while the remaining routes expose Continue Build. The Build preview remains visible by default but uses a fixed desktop width rather than growing proportionally, and creators can collapse it to a narrow restore rail. On tablet widths, the preview spans the full row below the section rail and editor.

## Risks / Trade-offs

- [The backend may omit optional fields in an update response] -> Merge the response with the submitted draft mapping before refreshing the query cache.
- [One save payload spans several conceptual sections] -> Serialize only known fields and show the active dirty state globally.
- [Local preview can be mistaken for model output] -> Label it as draft preview and route real evaluation to Test.
- [Existing demo fixtures are static] -> Keep saved changes editor-local and reset them on reload.
- [The current active overview change is not archived] -> Keep this change separate and validate both changes without archiving either.

## Migration Plan

1. Add the Build domain module and route layout while retaining the old Creator.
2. Verify live request serialization through unit tests and demo-mode behavior in the browser.
3. Compare the running page with `04-build.png` at 1440 x 1024.
4. Later changes can extract skills, media, and test evaluation into their own capabilities.

Rollback requires removing the new Build layout/module; the previous placeholder page remains available and no data migration is required.

## Open Questions

- Whether skill stage configuration should live inside Build or the global resource library remains deferred.
- Provider credentials need a separate security-focused migration before they can move from the legacy Creator.
