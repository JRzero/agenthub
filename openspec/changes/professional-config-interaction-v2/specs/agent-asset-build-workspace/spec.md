## MODIFIED Requirements

### Requirement: Fixed-height professional workspace

The Build route SHALL preserve the shared global bar, compact Agent context, lifecycle tabs, and grouped professional navigation. The Build document SHALL not vertically scroll at supported desktop sizes. Long navigation, editor, and preview content SHALL scroll only inside their owning regions and SHALL not cause horizontal page overflow at 1440x900 or 1280x720.

#### Scenario: Edit long configuration
- **WHEN** a creator opens a long Persona, Runtime, or Media configuration
- **THEN** the middle editor body scrolls within the remaining viewport height
- **AND** the page and Agent header remain stationary

### Requirement: Explicit manual-save exception

Until automatic save is implemented, editable Agent fields SHALL continue to use the existing Save Draft action and optimistic revision contract. The UI SHALL distinguish unsaved local changes, saved draft configuration, and the immutable running version.

#### Scenario: Change a local field
- **WHEN** a creator edits an Agent field without saving
- **THEN** the preview prevents sending with the changed configuration
- **AND** the UI does not describe the local change as saved

### Requirement: Product-facing configuration controls

The workspace SHALL hide unavailable actions and engineering explanations. Runtime advanced options SHALL be collapsed by default. Skills SHALL be selected from installed Workspace resources without an editable identifier field. Knowledge SHALL remain a single-library binding. Memory and safety SHALL expose only their supported switches. Media SHALL use peer tabs and omit unsupported tabs. Moments SHALL remain in Build and SHALL state that operational content is excluded from Agent versions.

### Requirement: Current saved draft preview

The preview SHALL be labeled `预览当前草稿`, use the current saved Agent draft, retain only the latest exchange, and avoid formal session-management controls. The frontend SHALL use the simulation contract where available and SHALL not represent the running published version as the preview source.

#### Scenario: Preview after saving
- **WHEN** Save Draft succeeds and the creator sends a preview message
- **THEN** the simulation request uses the refreshed saved Agent draft
- **AND** the preview shows only the latest user and assistant exchange

### Requirement: Clear lifecycle actions

The Build header SHALL use `测试当前草稿` and `发布为新版本` for its primary next steps. Draft Version Hash SHALL not be shown. The running version and draft base version SHALL remain visibly distinct.
