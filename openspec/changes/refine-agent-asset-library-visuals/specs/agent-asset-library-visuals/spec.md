## ADDED Requirements

### Requirement: Asset Library presents a clear workspace hierarchy
The Agent Asset Library SHALL present its page identity, discovery controls, primary create action, and asset results in a compact hierarchy using the existing AgentHub design system.

#### Scenario: Open a populated Asset Library
- **WHEN** the Agent collection loads successfully
- **THEN** the page displays the Asset Library title and purpose before the collection
- **AND** the create action is visually identifiable as the primary page action
- **AND** discovery controls follow the page header without a separate collection-metric strip

### Requirement: Asset discovery controls remain immediately available
The Agent Asset Library SHALL keep search and lifecycle status filtering visible and SHALL communicate the resulting asset count.

#### Scenario: Filter the collection
- **WHEN** the user enters a search term or selects a lifecycle status
- **THEN** the visible cards update to the matching Agent records
- **AND** the page communicates the filtered result count
- **AND** the user can clear all active discovery criteria in one action

#### Scenario: No records match active filters
- **WHEN** loaded Agent records exist but no record matches the active discovery criteria
- **THEN** the page displays a filtered-empty message
- **AND** the page offers an action to clear the discovery criteria

### Requirement: Asset cards support rapid comparison
Each Agent asset card SHALL distinguish identity, lifecycle state, description, model, version, and update context without relying on color alone.

#### Scenario: Scan multiple asset cards
- **WHEN** multiple Agent records are visible
- **THEN** every card displays the Agent avatar, name, lifecycle text, description fallback, model fallback, version label, and update-time fallback in consistent positions
- **AND** status is communicated with readable text in addition to semantic color

#### Scenario: Activate an asset card with a keyboard
- **WHEN** keyboard focus reaches an asset card link
- **THEN** the card displays a visible focus indicator
- **AND** activation opens the same creation-resume or overview route used by pointer activation

### Requirement: Asset Library remains responsive and theme compatible
The refined Asset Library SHALL remain usable across workspace mobile and desktop widths and in both AgentHub themes.

#### Scenario: View the page on a narrow viewport
- **WHEN** the available workspace width cannot support the desktop grid or toolbar
- **THEN** discovery controls and cards reflow without horizontal page overflow
- **AND** primary controls remain reachable and readable

#### Scenario: Use dark theme
- **WHEN** AgentHub dark theme is active
- **THEN** the page uses shared semantic tokens for surfaces, borders, text, focus, and statuses
- **AND** it does not introduce light-only raw component colors
