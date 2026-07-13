## ADDED Requirements

### Requirement: Independent AgentHub application
The repository SHALL provide the root application as an independently installable, runnable, testable, and buildable frontend application without modifying the behavior of the legacy Creator UI.

#### Scenario: Run beside the legacy Creator UI
- **WHEN** a developer starts AgentHub on its configured development port
- **THEN** the legacy Creator UI can remain available on its existing port and both applications can target the same backend

### Requirement: Complete compatible creator authentication
The application SHALL use the existing `linkyun_auth` browser storage schema and provide functional login, invitation-code registration, session restoration, unauthorized handling, and logout flows.

#### Scenario: Reuse an existing creator session
- **WHEN** `linkyun_auth` contains a valid API key and username
- **THEN** AgentHub loads the workspace shell without requiring another login

#### Scenario: Handle a missing session
- **WHEN** no valid `linkyun_auth` value exists
- **THEN** AgentHub presents the login route and prevents authenticated workspace requests

#### Scenario: Register a creator account
- **WHEN** a visitor submits a valid username, email, password, and invitation code
- **THEN** AgentHub calls the existing `/api/v1/auth/register` endpoint, stores the returned session using `linkyun_auth`, and opens the requested internal route

#### Scenario: Configure the API service before authentication
- **WHEN** a visitor enters a valid HTTP or HTTPS API Service URL on the login or registration screen
- **THEN** AgentHub preserves it using `linkyun-api-url-override` and sends the authentication request to that service

#### Scenario: Reject an unsafe post-authentication redirect
- **WHEN** the `next` query value is absolute, protocol-relative, or otherwise outside AgentHub
- **THEN** AgentHub ignores it and opens `/assets`

#### Scenario: Sign out of AgentHub
- **WHEN** an authenticated creator activates logout
- **THEN** AgentHub clears `linkyun_auth`, prevents further authenticated workspace requests, and returns to `/login`

### Requirement: Workspace-level navigation
The application SHALL present workspace-level navigation for workbench, Agent assets, resources, clients, application operations, analytics, governance, revenue, and settings.

#### Scenario: Navigate between workspace modules
- **WHEN** the user activates an available workspace navigation item
- **THEN** the matching route becomes active and the current workspace context is preserved

### Requirement: Workspace selection compatibility
The application SHALL list the creator's workspaces, preserve `linkyun_current_workspace_code`, and send the selected workspace code with scoped backend requests.

#### Scenario: Switch workspace
- **WHEN** the user selects another available workspace
- **THEN** the persisted workspace changes and live Agent queries reload using `X-Workspace-Code`

### Requirement: Responsive and accessible shell
The workspace shell MUST remain operable on desktop and narrower screens with visible focus states, labelled controls, and no horizontal page overflow that hides primary actions.

#### Scenario: Collapse navigation on a narrow screen
- **WHEN** the viewport cannot accommodate the expanded sidebar
- **THEN** the sidebar can be opened and closed without obscuring the current page's primary action
