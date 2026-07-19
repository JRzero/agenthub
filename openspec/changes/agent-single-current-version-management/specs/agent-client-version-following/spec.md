## ADDED Requirements

### Requirement: Clients follow the platform current version
The Client runtime view SHALL represent every enabled Client as following the single platform current Agent version and MUST NOT provide per-Client version selection, update or rollback controls.

#### Scenario: Managed Client is current
- **WHEN** a managed Client acknowledges the platform current version
- **THEN** the UI shows the current version, short Hash and “已跟随/已同步” status

#### Scenario: Remote Client has not acknowledged current version
- **WHEN** a remote Client's last acknowledged version differs from the platform current version
- **THEN** the UI shows “等待下次同步” and does not treat offline status alone as an incompatibility

#### Scenario: Existing Session after publish
- **WHEN** the platform current version changes
- **THEN** the UI explains that new Session requests use the new version while existing Sessions continue with their bound historical version

### Requirement: Local exports contain only the platform current version
The system SHALL allow a local Client export to package only the platform current Agent version and SHALL display the resulting export record without treating internal storage paths as public downloads.

#### Scenario: Export current version
- **WHEN** a creator selects an enabled local Client and confirms export
- **THEN** the system calls the Client export endpoint and displays returned version, Hash, target Client and creation metadata

#### Scenario: No platform current version
- **WHEN** the Agent has not published its first platform version
- **THEN** the export action is unavailable and the UI directs the creator to publish first

### Requirement: Client compatibility participates in publication
The publication experience SHALL use registered Client capability state and SHALL block only explicit incompatibility or changed capability declarations.

#### Scenario: Client is offline but compatible
- **WHEN** a registered Client is offline and its stored capability declaration remains compatible
- **THEN** publication is not blocked solely because the Client is offline

#### Scenario: Client is explicitly incompatible
- **WHEN** the backend reports missing required capabilities
- **THEN** publication remains unexecuted and the UI identifies the Client problem and offers a path back to configuration
