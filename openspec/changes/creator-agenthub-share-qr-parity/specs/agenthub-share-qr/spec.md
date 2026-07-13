## ADDED Requirements

### Requirement: Local share QR
Distribution SHALL render a scannable QR code locally for an active Web Chat share URL and MUST NOT send that URL to an external QR service.

#### Scenario: Open share QR
- **WHEN** an active Web Chat channel has a share URL and the Creator opens its QR action
- **THEN** a QR dialog SHALL encode exactly that URL and show the Agent/channel context

#### Scenario: Missing share URL
- **WHEN** the channel has no active share URL
- **THEN** no QR action SHALL be shown

### Requirement: QR dialog actions
The QR dialog SHALL keep the source URL visible and SHALL provide a copy action.

#### Scenario: Copy from QR dialog
- **WHEN** the Creator activates Copy Link
- **THEN** the same encoded share URL SHALL be copied without changing share state
