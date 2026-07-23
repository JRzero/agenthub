## Context

The approved product plan and six guided-wizard references define one desktop creation workspace inside the normal AgentHub workspace shell. The backend now provides atomic basic-profile generation, persisted creation progress, completion validation, single-candidate Motherland media generation, avatar upload, character-design confirmation, and Workspace skill APIs.

## Goals / Non-Goals

**Goals:**

- Deliver the approved four-step full-page journey with no main-page vertical scrolling at the target desktop viewport.
- Separate every generated candidate from confirmed draft content.
- Create and autosave only after successful base generation.
- Require confirmed avatar and character sheet, while allowing skills to be skipped.
- Resume at the first incomplete step and preserve confirmed downstream content until a replacement is confirmed.
- End in an unpublished draft with no version number or Hash.

**Non-Goals:**

- Adding fields, steps, template creation, import, model/runtime setup, knowledge, memory, safety, Moments, Client configuration, or publishing.
- Using local-only persistence as the source of truth for a Live creating Agent.
- Fabricating media-library records, skill versions, generation success, or backend workflow state.

## Decisions

### 1. Use one dedicated creation route and module

`/assets/create` hosts the wizard. It keeps workspace navigation available as the compact icon rail, matching the space-saving behavior of Agent lifecycle routes, while using a fixed viewport budget so the browser page does not scroll. The progress rail, task surface, and bottom actions remain mounted while the active step changes. The creation preview is temporarily hidden so the task surface can use the available width.

The active task surface uses a bounded desktop content width instead of stretching forms and media across the full remaining viewport. Character-sheet review uses a balanced image/text split; the image is contained without cropping, while long textual specifications scroll only inside their bounded panel.

### 2. Model the flow as a reducer with confirmed and candidate values

The frontend state machine contains the exact four product steps and three lifecycle phases: before draft, creating, and complete. Generated base content, avatar choices, and character-sheet output have separate candidate and confirmed values. Confirm actions are the only transitions allowed to mutate saved draft references.

### 3. Treat server workflow state as the resume source of truth

Before the first successful generation, form input is page state and navigation is guarded. After success, the response must identify the creating Agent and draft revision. Persisted completion and stale-dependency state come from the backend contract; local storage is not used to impersonate server persistence.

### 4. Autosave through a serialized revision-aware queue

After draft establishment, editable confirmed content and selected skills enter a debounced, single-flight save queue. Every write must advance or return the current draft revision. Conflicts and failed saves retain local input, block unsafe exit, and offer retry. Specialized media and skill writes are enabled only when their contracts participate in the same draft revision lifecycle.

### 5. Reuse Motherland adapters but not professional-config drawers

The wizard uses page-native candidate grids and previews. Existing generation, upload, and confirmation adapters may be reused or extended, but the professional-config drawer and stage-based skill configuration UI are not mounted as the primary flow.

### 6. Keep skill selection product-facing

The wizard queries Workspace-installed, available skills and renders localized display name, description, and install state. It never displays English identifiers, stage, schema, call name, configuration JSON, or editing/publishing controls. Completion persists stable skill-version references when supplied by the backend contract.

### 7. Represent unavailable contracts honestly

The UI may ship structural states behind shared capability declarations while a required backend contract is unavailable. It must not call unrelated endpoints repeatedly, create an empty Agent, or synthesize successful candidates. Required unavailable operations explain why the step cannot continue.

## Risks / Trade-offs

- [Basic generation request is not declared idempotent] -> Disable duplicate submission while a request is active and retain the entered form on failure; do not automatically replay an ambiguous timed-out request.
- [Specialized media writes may not advance draft revision] -> Refresh `/creation-progress` before completion and use its latest revision.
- [Current avatar endpoint returns one candidate] -> Render exactly one transient preview and call the endpoint again for regeneration; never batch calls to imitate multiple candidates.
- [Media library is unavailable in Live] -> Keep the asset-selection action explicitly unavailable while upload and supported generation remain real.
- [Existing Agent list assumes a version] -> Add explicit creating/unpublished rendering and remove v1 fallback for creation records.

## Validation

- Reducer and dependency-invalidation unit tests.
- API contract tests for generation, creation, autosave, media confirmation, skills, resume, and conflicts.
- Component tests for validation, required/optional steps, candidate isolation, exit protection, and completion state.
- Shell tests for `/assets/create` full navigation and fixed viewport behavior.
- Browser comparison against all six approved references, including failure, retry, save-exit, and resume paths.
