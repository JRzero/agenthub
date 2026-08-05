## ADDED Requirements

### Requirement: Compact grouped workspace navigation
The authenticated application shell SHALL render a compact left navigation organized into top workspace/create actions, primary items for Workbench, Agent, and Resources, an Operations group, a Management group, and bottom tools.

#### Scenario: Expanded desktop shell
- **WHEN** a workspace route renders on a desktop viewport
- **THEN** the sidebar presents the approved groups in order with a persistent Create Agent action near the top

#### Scenario: Existing route destination
- **WHEN** a user activates any available navigation item
- **THEN** the shell navigates to an existing AgentHub route without changing the route's business behavior

### Requirement: Single route-aware active state
The shell SHALL expose exactly one active navigation state for the current workspace route, including nested Agent Asset routes.

#### Scenario: Agent asset child route
- **WHEN** the pathname is an Agent Asset overview, build, test, memory, version, or distribution route
- **THEN** the Agent navigation item is the only workspace item marked current

#### Scenario: Workspace route
- **WHEN** the pathname matches a workspace-level destination
- **THEN** only its corresponding navigation item is marked current

### Requirement: Existing workspace utilities remain operable
The shell SHALL preserve the current workspace switcher, help, settings, account, mobile navigation, and authenticated session behavior.

#### Scenario: Workspace switch
- **WHEN** the user selects another available workspace through the shell
- **THEN** the existing workspace provider behavior is invoked and no new persistence contract is introduced

#### Scenario: Bottom utility access
- **WHEN** the user activates Help, Settings, or Account through the shell
- **THEN** the existing destination or action remains reachable

### Requirement: Honest hidden and unavailable capabilities
The shell MUST NOT render Living World navigation, cards, entry points, or suggestive copy, and it MUST NOT render fabricated notification unread dots or counts.

#### Scenario: Shell navigation is rendered
- **WHEN** any authenticated route displays the shared shell
- **THEN** no Living World label, link, or promotional hint is present

#### Scenario: Notification capability lacks live state
- **WHEN** the shell has no real unread-count source
- **THEN** it displays neither an unread dot nor a numeric badge

### Requirement: Responsive shell integrity
The shell SHALL keep navigation and primary actions reachable at 1440px and 1280px widths and SHALL provide a non-overlapping mobile drawer below the desktop breakpoint.

#### Scenario: Required desktop widths
- **WHEN** the viewport width is 1440px or 1280px
- **THEN** the shell has no viewport-level horizontal overflow and the Create Agent action, route content, and bottom tools remain reachable

#### Scenario: Mobile navigation
- **WHEN** the viewport is below the desktop breakpoint and the navigation is opened
- **THEN** a dismissible drawer appears above page content with focusable navigation targets

### Requirement: Shell mode compatibility
Create and Agent build routes SHALL retain their existing fixed-workspace behavior, while other routes SHALL retain scrollable workspace behavior.

#### Scenario: Agent creation route
- **WHEN** the pathname is `/assets/create`
- **THEN** the existing creation page remains in its workspace shell without a new modal or changed creation fields

#### Scenario: Agent build route
- **WHEN** the pathname is an Agent build route
- **THEN** the shell preserves the immersive fixed-height workspace needed by the existing builder
