## ADDED Requirements

### Requirement: Backend workspace switch

The global selector SHALL call the current workspace switch endpoint outside demo mode.

#### Scenario: Switch fails

- **WHEN** the backend rejects a workspace switch
- **THEN** the selector SHALL revert to the previous workspace and expose the error

### Requirement: Workspace invitations

The topbar SHALL support viewing, copying, and refreshing the current workspace invite code.

#### Scenario: Refresh invite code

- **WHEN** an authorized Creator confirms refresh
- **THEN** the new invite code SHALL replace the old value

### Requirement: Agent lifecycle actions

The Asset Library SHALL support create and status filters, and the Asset header SHALL support transfer and guarded deletion.

#### Scenario: Delete an Agent

- **WHEN** the Creator enters the exact Agent name and confirms deletion
- **THEN** the frontend SHALL call the existing delete endpoint and remove the Agent from the current workspace view
