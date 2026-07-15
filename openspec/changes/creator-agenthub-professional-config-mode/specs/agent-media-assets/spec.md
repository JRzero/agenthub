## ADDED Requirements

### Requirement: Focused Media Assets workspace
The Build Media Assets section SHALL organize the current avatar, character sheets, and comic drafts as visual Agent assets. It MUST show only backend-provided Live records and MUST NOT synthesize missing history.

#### Scenario: Open current avatar
- **WHEN** the creator opens Media Assets
- **THEN** the current avatar area shows the saved thumbnail, saved status, usage context, and supported actions for selecting, uploading, or generating an avatar

#### Scenario: Show recent character sheets
- **WHEN** the backend provides a typed character-sheet collection
- **THEN** the workspace shows up to three recent cards with available name, version, date, status, and actions

#### Scenario: Show only the current character sheet
- **WHEN** Live mode provides only the existing single saved character-design sheet
- **THEN** the workspace shows that sheet as one real current card and identifies history as unavailable

#### Scenario: Show comic-draft boundary
- **WHEN** no comic-draft collection or persistence capability is available in Live mode
- **THEN** the comic-draft area is visibly unavailable and no generation or save control performs a production write

### Requirement: Per-action media capability provenance
Every Media Assets action SHALL resolve through an explicit `live`, `demo`, or `unavailable` capability state. Avatar upload, Motherland avatar generation, current character-design generation, media library selection/history, and comic-draft generation/persistence MUST be evaluated independently.

#### Scenario: Execute a Live media action
- **WHEN** an action resolves to `live` and the creator confirms it
- **THEN** the frontend calls only its declared authenticated backend contract and refreshes the affected Agent or media query after success

#### Scenario: Execute a Demo media action
- **WHEN** an action resolves to `demo`
- **THEN** the result is stored only in isolated Demo state and no Live cache or backend endpoint is mutated

#### Scenario: Activate an unavailable action
- **WHEN** an action resolves to `unavailable`
- **THEN** the UI explains the missing backend capability and performs no request or local success simulation

### Requirement: Embedded Motherland generation
Motherland visual generation SHALL be launched from Media Assets in a contextual drawer parameterized for avatar, character-sheet, or comic-draft output. It MUST NOT appear as a standalone professional-menu item or route.

#### Scenario: Start avatar generation
- **WHEN** the creator activates `使用 Motherland 生成` in the current avatar area
- **THEN** the drawer opens in avatar mode with only avatar-relevant prompt, generation, progress, candidate, retry, cancel, and confirmation controls

#### Scenario: Start character-sheet generation
- **WHEN** the creator activates Generate Character Sheet and the capability is supported
- **THEN** the same drawer opens in character-sheet mode without navigating away from Media Assets

#### Scenario: Close the generation drawer
- **WHEN** the creator closes or cancels the drawer before confirmation
- **THEN** the saved Agent configuration and Build draft remain unchanged

### Requirement: Candidate confirmation lifecycle
Generated visual content SHALL progress through generating, pending-confirmation, confirming, saved, or failed states. A candidate MUST NOT replace saved configuration until the creator explicitly confirms it and the backing write succeeds.

#### Scenario: Generate an avatar candidate
- **WHEN** Motherland returns an avatar preview
- **THEN** the drawer marks it pending confirmation and the saved Agent avatar remains unchanged

#### Scenario: Confirm an avatar candidate
- **WHEN** the creator confirms an avatar candidate and the existing avatar write succeeds
- **THEN** the saved Agent query refreshes to the confirmed avatar and the candidate state becomes saved

#### Scenario: Confirmation fails
- **WHEN** a candidate write fails
- **THEN** the drawer preserves the candidate, shows a retryable failure, and does not indicate that the saved Agent changed

#### Scenario: Confirm a generated typed asset
- **WHEN** a character sheet or comic draft is confirmed and a typed persistence capability is available
- **THEN** the frontend saves the returned stable asset reference and refreshes the corresponding media collection

### Requirement: Stable media references in Build saves
Build saves SHALL serialize only confirmed references supported by the Agent update contract. Transient candidate URLs, generation state, unavailable fields, and Demo-only identifiers MUST NOT enter Live Agent update payloads.

#### Scenario: Save with an unconfirmed candidate
- **WHEN** the creator saves the Build draft while a media candidate is pending confirmation
- **THEN** the pending candidate is omitted from the Agent update payload

#### Scenario: Save and Test after media confirmation
- **WHEN** the creator confirms a supported media asset and activates Save and Test
- **THEN** the supported stable reference is saved first and navigation to Test occurs only after the save succeeds

### Requirement: Media state and responsive presentation
Media cards and generation controls SHALL present saved, generating, pending-confirmation, failed, and unavailable states in Chinese with distinct accessible status treatment. The workspace MUST remain usable without horizontal page scrolling at a 1440-pixel desktop width.

#### Scenario: Display generation progress
- **WHEN** a media generation request is active
- **THEN** the relevant drawer and trigger communicate the generating state and prevent duplicate submissions

#### Scenario: Display a failed generation
- **WHEN** generation fails
- **THEN** the UI shows a Chinese error message, preserves the creator's input, and offers retry when safe

#### Scenario: Render the desktop card layout
- **WHEN** Media Assets is opened at a 1440-pixel desktop width
- **THEN** the current avatar controls and recent asset cards fit the focused editor without overlapping the fixed preview or causing horizontal page scrolling
