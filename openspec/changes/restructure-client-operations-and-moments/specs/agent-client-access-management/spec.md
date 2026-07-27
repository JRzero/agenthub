## ADDED Requirements

### Requirement: Clients aggregates real AgentClient records

The Clients workspace SHALL list AgentClient records across the creator's workspace Agents while preserving every record's stable AgentClient ID and owning Agent.

#### Scenario: One AgentClient query fails

- **WHEN** one Agent's Client query fails while other queries succeed
- **THEN** successful records SHALL remain visible
- **AND** the failed Agent SHALL have a scoped retry action

#### Scenario: Repeated Client labels exist

- **WHEN** multiple AgentClient records share a name, type, or Client Key
- **THEN** the records SHALL remain separate
- **AND** all actions SHALL target the explicit AgentClient ID

### Requirement: AgentClient records use existing mutation contracts

Creators SHALL be able to create, edit, disable, and re-enable AgentClient records using existing backend fields and ownership rules.

#### Scenario: Capability hash conflicts

- **WHEN** an update returns a capability-hash conflict
- **THEN** the frontend SHALL reload the current record
- **AND** it SHALL NOT silently overwrite the newer state

#### Scenario: Disable a Client access record

- **WHEN** the disable endpoint succeeds
- **THEN** the record SHALL be shown as disabled rather than permanently erased

### Requirement: Clients and Distribution remain consistent

Clients and Agent Distribution SHALL read and mutate the same AgentClient records and SHALL preserve platform-current version following.

#### Scenario: Record changes in Clients

- **WHEN** a creator updates an AgentClient in Clients and then opens its Agent Distribution workspace
- **THEN** Distribution SHALL show the updated record after reloading
- **AND** it SHALL NOT provide an independent Client version selector
