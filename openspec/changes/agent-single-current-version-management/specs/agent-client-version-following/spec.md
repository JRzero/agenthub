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

### Requirement: Generic exports contain only the platform current version
The system SHALL allow a creator to export the platform current Agent version without associating a Client. The frontend MUST download the backend-generated ZIP bytes, MUST NOT assemble a configuration JSON or ZIP in the browser, and MUST NOT expose or resolve the internal `storage_path`.

#### Scenario: Export current version
- **WHEN** a creator confirms export for an Agent with a platform current version
- **THEN** the system creates one export record, downloads `/agent-exports/{export_id}/download` as `application/zip`, saves the server-provided filename and displays package size and short Hash

#### Scenario: ZIP download is explicitly disabled
- **WHEN** operations explicitly disables the backend ZIP download capability for rollback
- **THEN** the formal export action is disabled and the UI explains that the ZIP download endpoint is not ready

#### Scenario: No associated Client
- **WHEN** the Agent has no associated Client
- **THEN** the export action remains available and creates a generic ZIP without Client configuration

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
