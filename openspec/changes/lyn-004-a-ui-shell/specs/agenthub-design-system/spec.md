## ADDED Requirements

### Requirement: Semantic dark theme tokens
The frontend SHALL define dark semantic tokens for canvas, surface, elevated surface, border, primary/secondary/muted text, lime primary, success, warning, danger, and info, and shared shell primitives MUST consume semantic tokens rather than a legacy purple primary.

#### Scenario: Default application theme
- **WHEN** an authenticated workspace route renders
- **THEN** the canvas, surfaces, borders, text, primary action, and semantic statuses resolve from the dark V1 token set

#### Scenario: Legacy theme class is present
- **WHEN** existing theme state applies the `dark` class
- **THEN** the semantic token values remain within the same V1 dark palette and do not switch to a purple primary system

### Requirement: Reusable base interaction primitives
The frontend SHALL provide reusable styles or components for primary, secondary, and danger buttons; inputs and selects; cards; tables; textual statuses; empty states; loading states; and persistent error feedback.

#### Scenario: Downstream page consumes base primitives
- **WHEN** a downstream page uses a shared base primitive
- **THEN** it receives consistent sizing, radius, border, typography, hover, disabled, and semantic-color behavior without page-local theme definitions

#### Scenario: Status is communicated
- **WHEN** success, warning, danger, info, or neutral status is shown
- **THEN** visible text or an accessible label accompanies color so meaning is not color-only

### Requirement: Accessible focus and motion
All reusable interactive primitives SHALL expose a clearly visible keyboard focus indicator, and global motion MUST respect `prefers-reduced-motion`.

#### Scenario: Keyboard navigation
- **WHEN** a keyboard user focuses a link, button, input, select, or textarea
- **THEN** a high-contrast focus ring is visible without obscuring the control

#### Scenario: Reduced motion is requested
- **WHEN** the operating system requests reduced motion
- **THEN** non-essential animations and transitions complete without sustained motion

### Requirement: Desktop-safe base sizing
Common controls SHALL use a 40–44px standard height and tables SHALL support rows of at least 48px without clipping text or actions.

#### Scenario: Dense desktop shell at 1280px
- **WHEN** the shell is viewed at 1280px width
- **THEN** common controls remain operable and primary actions are not hidden or overlapped
