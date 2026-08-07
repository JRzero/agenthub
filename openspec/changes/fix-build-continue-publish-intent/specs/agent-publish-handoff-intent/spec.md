## ADDED Requirements

### Requirement: Build continuation carries a scoped publish intent
The Build workspace SHALL navigate an unblocked `继续发布` action to the current Agent Versions workspace with an explicit intent scoped to that Agent.

#### Scenario: Continue without blockers
- **WHEN** the current saved draft has no blocking publish-check item and the user selects `继续发布`
- **THEN** navigation targets the current Agent Versions route with a publish intent matching that Agent

#### Scenario: Continue remains blocked
- **WHEN** the draft is dirty, saving, or has a blocking publish-check item
- **THEN** the existing continuation guard remains in force and no publish intent is sent

### Requirement: Versions consumes a valid publish intent exactly once
The Versions workspace SHALL open the existing publish confirmation only when the publish intent matches the current route Agent, and MUST remove that intent from the current history entry when it is consumed.

#### Scenario: Matching intent opens existing confirmation
- **WHEN** the Versions workspace loads with a publish intent matching the current Agent ID
- **THEN** it removes the intent and invokes the same publish confirmation used by the page's publish buttons

#### Scenario: Closing does not reopen
- **WHEN** an automatically opened publish confirmation is cancelled or closed
- **THEN** it remains closed because the consumed intent is no longer present

#### Scenario: Refresh and history do not replay intent
- **WHEN** the user refreshes or navigates Back or Forward after the intent was consumed
- **THEN** the publish confirmation does not reopen from that consumed intent

### Requirement: Ordinary Versions access remains closed
The Versions workspace SHALL preserve its closed default state when no valid matching publish intent is present.

#### Scenario: Direct visit
- **WHEN** a user opens `/assets/{agentId}/versions` without a publish intent
- **THEN** the existing publish confirmation remains closed

#### Scenario: Mismatched intent
- **WHEN** a publish intent does not match the current route Agent ID
- **THEN** the existing publish confirmation remains closed

#### Scenario: Existing page button
- **WHEN** a user selects an existing Versions publish button
- **THEN** the same existing publish confirmation opens normally
