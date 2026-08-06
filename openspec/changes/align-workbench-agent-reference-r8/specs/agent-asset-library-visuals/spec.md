## MODIFIED Requirements

### Requirement: Asset cards support rapid comparison
Each Agent asset card SHALL use an image-led fixed-height composition that distinguishes identity, lifecycle state, description, model, version, and update context without relying on color alone.

#### Scenario: Scan multiple asset cards
- **WHEN** multiple Agent records are visible in card view
- **THEN** every card displays lifecycle text and menu controls at the top of its artwork area
- **AND** the name and available description appear over a readable bottom artwork gradient
- **AND** only existing model, version, and update context appears in a compact footer with honest absence treatment
- **AND** status is communicated with readable text in addition to semantic color

#### Scenario: Agent has missing or long content
- **WHEN** an Agent lacks artwork, description, model, or version data, or contains long text
- **THEN** the card uses existing artwork fallback behavior and neutral absence treatment without fabricated values
- **AND** text is constrained without changing the fixed card height or causing horizontal page overflow

#### Scenario: Activate an asset card with a keyboard
- **WHEN** keyboard focus reaches an asset card link
- **THEN** the card displays a visible focus indicator
- **AND** activation opens the same creation-resume or overview route used by pointer activation

#### Scenario: Use card menu without navigation
- **WHEN** the user opens or activates an available card menu action
- **THEN** menu interaction SHALL remain separate from whole-card navigation
- **AND** existing lifecycle and permission behavior SHALL remain unchanged

### Requirement: Asset Library preserves collection controls and preference
The Agent Asset Library SHALL retain status tabs and counts, search, filtering, sorting, card/list switching, card menus, whole-card navigation, and the existing persisted view preference while adopting the R8 card composition.

#### Scenario: Change and restore view mode
- **WHEN** a user changes between card and list view and reloads the page
- **THEN** the selected view SHALL use the existing non-sensitive preference mechanism
- **AND** all discovery controls SHALL remain available

#### Scenario: Large collection
- **WHEN** the library contains a large set of Agent records
- **THEN** filtering and sorting SHALL operate on the loaded records
- **AND** the responsive grid SHALL retain consistent fixed-height cards

#### Scenario: Library query states
- **WHEN** the Agent collection is loading, empty, filtered-empty, or failed
- **THEN** the library SHALL present an explicit state appropriate to that condition
