## ADDED Requirements

### Requirement: Shared control size scale
AgentHub SHALL provide a default control size of 36px with 14px labels and a compact control size of 32px with 12px labels for workspace actions and single-line fields.

#### Scenario: Render a default workspace action
- **WHEN** a primary or secondary action uses the shared default control style
- **THEN** it renders at 36px minimum height with a 14px label and consistent horizontal padding

#### Scenario: Render a compact workspace action
- **WHEN** a dense toolbar or inline action uses the shared compact control style
- **THEN** it renders at 32px minimum height with a 12px label and compact horizontal padding

### Requirement: Consistent semantic variants
AgentHub SHALL provide shared primary, secondary, destructive, field, select, and icon-only control styles with consistent radius, typography, focus, hover, and disabled states.

#### Scenario: Render equivalent actions in different modules
- **WHEN** equivalent actions appear in two workspace modules
- **THEN** their semantic variant has the same height, label size, radius, and state treatment

#### Scenario: Render a destructive confirmation
- **WHEN** a dialog presents a destructive confirmation action
- **THEN** it uses the shared destructive control style instead of a locally assembled size and color combination

### Requirement: Single-select consistency
AgentHub SHALL render single-select controls using a shared app-rendered combobox with a 36px trigger, 14px label, and platform-independent menu unless an explicitly documented size variant is applied.

#### Scenario: Render filters from different workspace centers
- **WHEN** single-select filters appear in analytics, assets, resources, clients, or operations
- **THEN** they share the same default height, typography, caret placement, menu row density, selected state, elevation, and disabled treatment

#### Scenario: Open a select on macOS
- **WHEN** a user opens a single-select control on macOS
- **THEN** the menu uses AgentHub typography and tokens instead of the operating system's native oversized popover

#### Scenario: Operate a select with the keyboard
- **WHEN** a keyboard user opens the combobox and presses Arrow, Home, End, Enter, Space, Escape, or Tab
- **THEN** focus, active option, selection, and dismissal follow the expected listbox interaction without trapping focus

#### Scenario: Preserve multi-select behavior
- **WHEN** a select uses `multiple` or an explicit `size`
- **THEN** it remains a native content-sized control outside the shared single-select abstraction

### Requirement: Accessible icon controls
AgentHub MUST keep icon-only actions keyboard focusable and provide an accessible name while using the shared square icon-control size.

#### Scenario: Operate an icon-only action
- **WHEN** a keyboard or assistive-technology user focuses an icon-only action
- **THEN** the control exposes its purpose and displays a visible focus state without layout movement

### Requirement: Explicit layout exceptions
AgentHub SHALL preserve layout-specific dimensions for switches, textareas, navigation rows, tab selectors, cards, upload targets, and other content-sized interactions rather than forcing them into the single-line control height.

#### Scenario: Render a multiline editor
- **WHEN** a textarea or content editor is displayed
- **THEN** its height remains determined by rows or content while its typography, border, and focus treatment remain compatible with the shared control system

#### Scenario: Render a navigation or tab control
- **WHEN** an interaction represents navigation or a structural tab rather than a form action
- **THEN** it may retain a layout-specific click target height documented at its call site
