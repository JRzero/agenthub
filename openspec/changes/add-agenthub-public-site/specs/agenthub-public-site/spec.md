## ADDED Requirements

### Requirement: Public creator landing route
The application SHALL render `/` as a public AgentHub landing page without requiring an authenticated session, while preserving existing authentication protection for workspace and creation routes.

#### Scenario: Anonymous visitor opens the root route
- **WHEN** an unauthenticated visitor navigates to `/`
- **THEN** the application renders the public landing page instead of redirecting to the workspace

#### Scenario: Anonymous visitor opens a protected route
- **WHEN** an unauthenticated visitor navigates to `/workbench`, `/assets`, or `/assets/create`
- **THEN** the existing workspace authentication guard continues to route the visitor through login

### Requirement: V4 creator story and navigation
The public site SHALL provide a Hero, working anchor navigation, continuous product states, a five-step creation narrative, three creator scenarios, and a bottom creation-intent section using truthful AgentHub capability language.

#### Scenario: Visitor explores the public site
- **WHEN** the visitor activates a navigation item, product state, or creation step
- **THEN** the corresponding section or content state becomes visible and the active control is programmatically identifiable

#### Scenario: Visitor switches product states quickly
- **WHEN** the visitor activates multiple product tabs in rapid succession
- **THEN** the latest selected state becomes visible within a stable product-stage height without a blank frame or interrupted layout

#### Scenario: Visitor explores the creation flow
- **WHEN** the visitor scrolls quickly through the five creation chapters or selects a step and continues scrolling
- **THEN** activation follows a stable viewport focus line and a manual selection is not immediately overwritten by scroll feedback

#### Scenario: Visitor reviews the public narrative
- **WHEN** the visitor scans product proof, creation flow, creator scenarios, and the intent handoff
- **THEN** decorative outer borders and repeated equal-card framing do not dominate the layout, while actual product controls and the textarea retain clear affordances

#### Scenario: Visitor reviews capability claims
- **WHEN** the visitor reads the public site
- **THEN** the site describes role definition, knowledge and skills, conversation testing, publishing and runtime state, and iteration without presenting Living World, a marketplace, fabricated metrics, customer endorsements, or unopened API/SDK capabilities

### Requirement: Honest creation-intent handoff
The public site SHALL allow a visitor to enter a creation intent, SHALL keep that intent only in browser session storage, and SHALL require the existing login or invitation registration path before `/assets/create` can be used.

#### Scenario: Visitor continues with an intent
- **WHEN** a visitor submits a non-empty creation intent
- **THEN** the application stores the normalized text in browser session storage and offers login and invitation registration links whose continuation target is `/assets/create`

#### Scenario: Visitor has not authenticated
- **WHEN** an anonymous visitor enters or submits an intent
- **THEN** the site does not call a generation or persistence API and does not claim the Agent was generated or saved on a server

### Requirement: Responsive and accessible public experience
The public site SHALL remain usable at 1440 px and 390 px, provide visible keyboard focus and semantic controls, and honor `prefers-reduced-motion`.

#### Scenario: Mobile visitor views the page
- **WHEN** the viewport width is 390 px
- **THEN** content remains within the viewport, navigation and CTAs remain usable, product proof uses one primary panel, and the five-step story uses a vertical selector with one active detail

#### Scenario: Visitor requests reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** automatic state changes, smooth scrolling, and transform-based displacement are disabled while final content and a stable active step remain visible immediately

#### Scenario: Keyboard visitor operates the page
- **WHEN** the visitor tabs through links, buttons, tabs, and the intent form
- **THEN** each interactive element has a visible focus indicator and an accessible name
