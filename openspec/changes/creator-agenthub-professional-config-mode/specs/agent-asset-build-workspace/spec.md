## MODIFIED Requirements

### Requirement: Sectioned Agent construction

The Build route SHALL provide one grouped professional configuration hierarchy while preserving one editable draft across editor-section changes. The hierarchy MUST order Identity and Persona, Runtime Configuration, Capability Configuration, and Governance and Release as its groups. Persona SHALL own the role system prompt, Motherland prompt optimization, draft application, and example conversations; Runtime SHALL own provider and reasoning/tool-call display controls, and Safety SHALL own policy boundaries. Test Evaluation and Versions and Release SHALL be route shortcuts rather than duplicate Build editors.

#### Scenario: Switch editable build section

- **WHEN** the creator edits identity fields and activates the Runtime Configuration editor
- **THEN** the Runtime editor opens and the unsaved identity changes remain in the draft

#### Scenario: Show grouped professional configuration

- **WHEN** the creator opens the Build workspace
- **THEN** the rail shows `身份与人设`, `运行配置`, `能力配置`, and `治理与发布` in that order
- **AND** Runtime appears below Persona, Knowledge appears below Skills, and Media Assets and Moments appear in Capability Configuration

#### Scenario: Open lifecycle destination

- **WHEN** the creator activates Test Evaluation or Versions and Release in the professional rail
- **THEN** the application navigates to the selected Agent Asset's existing Test or Versions route
- **AND** no duplicate test, version, or distribution editor is mounted inside Build

#### Scenario: Exclude unrelated professional sections

- **WHEN** the professional Build rail is rendered
- **THEN** standalone Motherland entries are absent
- **AND** Moments remains available as an Agent-scoped operation entry while narrative optimization remains inside Persona and Motherland visual generation remains available only through Media Assets when its capability is supported


#### Scenario: Optimize role system prompt

- **WHEN** the creator opens Persona
- **THEN** the role system prompt editor shows an Optimize Narrative button in the prompt header, opens the Motherland optimization dialog on demand, and can apply an optimized prompt to the local Build draft without saving automatically
#### Scenario: Open persona configuration

- **WHEN** the creator activates Persona
- **THEN** the system prompt and example conversations appear in the same focused editor without a global editor-tab row

#### Scenario: Open runtime and safety configuration

- **WHEN** the creator activates Runtime or Safety
- **THEN** Runtime presents provider settings plus reasoning and tool-call display controls while Safety presents visibility and unavailable policy boundaries

### Requirement: Runtime-backed preview

The Build workspace SHALL provide a saved-configuration preview of the selected Agent and SHALL use the authenticated Runtime Chat contract for one lightweight latest exchange after the draft is saved. The preview MUST remain a feedback surface and MUST NOT expose Test Evaluation session or transcript management. The Build editor, section rail, and preview MUST NOT introduce independent vertical scroll containers; long content SHALL use the browser page scrollbar.

#### Scenario: Keep editor introduction concise

- **WHEN** an editable professional section opens
- **THEN** the editor shows the active section title without a redundant mode eyebrow
- **AND** any introductory helper copy is brief, product-facing, and does not expose backend implementation details

#### Scenario: Show saved Agent presentation

- **WHEN** the creator opens Build with or without unsaved changes
- **THEN** the preview shows `实时预览`, `使用已保存配置`, and the saved Agent avatar, name, and short greeting
- **AND** it does not present unsaved draft fields as active Runtime configuration

#### Scenario: Saved configuration sends a real Runtime message

- **WHEN** the live-mode draft has no unsaved changes and the creator sends a preview message
- **THEN** the frontend creates or reuses a workspace-scoped test session and streams the real Runtime response, with the existing non-stream request as fallback
- **AND** the preview retains only the latest user and assistant exchange

#### Scenario: Replace the latest preview exchange

- **WHEN** the creator sends another message after a completed preview exchange
- **THEN** the new exchange replaces the previous user and assistant messages in the preview UI

#### Scenario: Unsaved draft blocks Runtime send

- **WHEN** the creator has unsaved Build changes
- **THEN** the preview prevents message submission and asks the creator to save before previewing the changed configuration

#### Scenario: Demo preview remains isolated

- **WHEN** AgentHub runs in Demo data mode
- **THEN** the preview is visibly labeled as simulated and does not create a backend Runtime session

#### Scenario: Keep preview smaller than the editor

- **WHEN** the Build workspace is shown at a 1440-pixel desktop width
- **THEN** the preview uses a fixed width between 320 and 360 pixels
- **AND** long Build content extends the page vertically without creating an editor, rail, or preview scrollbar
- **AND** horizontal page scrolling is not introduced

#### Scenario: Collapse and restore preview

- **WHEN** the creator activates the preview collapse control at a desktop width
- **THEN** the preview becomes a 64-pixel labeled rail and the editor receives the released width
- **AND** the latest Runtime exchange, input, loading state, and errors remain mounted
- **WHEN** the creator activates the preview expand control
- **THEN** the fixed-width preview returns with its previous state intact

#### Scenario: Keep responsive preview available

- **WHEN** the viewport is below the three-column desktop breakpoint
- **THEN** the full preview remains available below the editor and scrolls with the page
- **AND** the desktop collapse control does not hide preview content

#### Scenario: Omit testing controls

- **WHEN** the preview is rendered
- **THEN** it contains no draft/published tabs, clear action, session selector, starter-question grid, transcript-management action, or testing metric; only the layout collapse/expand control is permitted

### Requirement: Unsupported build capabilities

The Build workspace MUST identify unsupported or partially supported media and advanced safety operations through the shared capability registry and MUST prevent unsupported production writes.

#### Scenario: Open a partially supported Media Assets section

- **WHEN** the creator opens Media Assets in Live mode
- **THEN** real avatar and current character-design operations are available only when their backend capabilities are supported
- **AND** media history, asset selection, or comic-draft actions without backend contracts are labeled unavailable and perform no write

#### Scenario: Demonstrate unavailable media in Demo

- **WHEN** the application runs in Demo mode and displays media fixture records
- **THEN** those records and actions remain isolated from Live caches and backend write paths

## ADDED Requirements

### Requirement: Shared shell and stable professional layout

The Agent Asset lifecycle workspace SHALL use one shared desktop shell across Overview, Build, Test, Versions, and Distribution. The shell SHALL provide a full-width branded top bar, a global navigation rail below it, and a compact Agent header with lifecycle tabs. The rail SHALL be an accessible fixed compact icon-only rail and SHALL expose menu names on hover and keyboard focus. Agent Asset lifecycle routes SHALL NOT render a desktop rail expand/collapse control. The content offset SHALL stay aligned to the compact rail width. Workspace-level routes SHALL retain the full labeled navigation. Build actions SHALL render in the compact Agent header without a duplicate Build toolbar. The Build interior SHALL allocate the remaining width to a grouped rail, focused editor, and supporting preview.

#### Scenario: Move between Agent lifecycle routes

- **WHEN** the creator navigates from Build to Overview, Test, Versions, or Distribution
- **THEN** the compact Agent header and top lifecycle navigation retain the same dimensions and content origin

#### Scenario: Open an Agent lifecycle route on desktop

- **WHEN** the creator opens Overview, Build, Test, Versions, or Distribution at a desktop width
- **THEN** the AgentHub lockup and workspace selector appear in the full-width top bar
- **AND** the global navigation is an icon-only rail below the top bar with accessible labels

#### Scenario: Discover a compact navigation item

- **WHEN** the creator hovers a compact navigation icon or moves keyboard focus to it
- **THEN** the navigation rail displays that item's menu name without changing routes

#### Scenario: Keep Agent navigation compact

- **WHEN** the creator opens Overview, Build, Test, Versions, or Distribution at a desktop width
- **THEN** the global navigation rail is compact and icon-only
- **AND** no expand navigation control is rendered
- **AND** the Agent workspace content starts at the compact rail boundary

#### Scenario: Keep workspace navigation explicit

- **WHEN** the creator opens a workspace-level route such as the Agent Asset list or Resource Library
- **THEN** the full labeled workspace navigation remains visible

#### Scenario: Show Build actions once

- **WHEN** the creator opens Build
- **THEN** Reset, Save Draft, and Save and Test appear in the compact Agent header
- **AND** no duplicate Build action toolbar is rendered below the lifecycle tabs

#### Scenario: Use compact desktop workspace density

- **WHEN** an Agent lifecycle route is shown at a desktop width
- **THEN** the shared top bar uses a 60-pixel height and the Agent avatar, name, status, readiness, source, and route actions remain on one compact identity row when space permits
- **AND** lifecycle tabs sit directly below the identity row without a second toolbar band
- **AND** the Build configuration rail uses a width no greater than 200 pixels with reduced group spacing and control targets at least 40 pixels high

#### Scenario: Use a smaller viewport

- **WHEN** the available width cannot fit the desktop rail, editor, and fixed preview
- **THEN** the preview moves below the editor and the professional group order remains available through the responsive section control

- **AND** the mobile workspace drawer retains navigation labels
- **AND** the desktop rail collapse control is not shown inside the mobile drawer
