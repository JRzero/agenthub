## ADDED Requirements

### Requirement: Default SMS sign-in
The system SHALL render `/login` with SMS-code sign-in selected by default and SHALL offer an accessible account/password sign-in tab in that order.

#### Scenario: SMS login submits the phone contract
- **WHEN** a user submits a phone number and SMS code from the default login tab
- **THEN** the client SHALL POST `phone`, conditional `country_code`, and `sms_code` to `/auth/sms/login`

#### Scenario: Password login preserves password input
- **WHEN** a user selects the account/password tab and submits credentials
- **THEN** the client SHALL POST a digits-only account as `phone` with conditional `country_code`, otherwise as `username_or_email`, and SHALL send the password without trimming it

### Requirement: SMS-code registration and invitation attribution
The system SHALL render `/register` with only a default +86 phone number, SMS code, and required invitation code; it SHALL not collect a password, username, or email.

#### Scenario: Registration sends the H5-compatible request
- **WHEN** a user submits valid registration fields
- **THEN** the client SHALL POST `phone`, conditional `country_code`, `sms_code`, `invitation_code`, optional `invitation_source`, and `landing_path` to `/auth/register` without a password field

#### Scenario: Invitation query prefills registration
- **WHEN** `/register` is opened with `invitation_code` and optional `invitation_source`
- **THEN** the invitation code SHALL prefill and the source plus local landing path SHALL be retained for the registration request

### Requirement: Recoverable SMS send state
The system SHALL send code requests with `purpose=login` for SMS sign-in and `purpose=register` for registration, and SHALL only start a 60-second cooldown after success.

#### Scenario: Send success starts cooldown
- **WHEN** a mock SMS send request succeeds
- **THEN** the send action SHALL be disabled and present a 60-second remaining cooldown

#### Scenario: Send failure remains retryable
- **WHEN** a mock SMS send request fails with a stable error, network error, or unavailable provider error
- **THEN** the client SHALL show a recoverable alert and SHALL not start cooldown

#### Scenario: Mode changes discard transient SMS state
- **WHEN** the user changes login method or switches between login and registration
- **THEN** stale SMS code, password, send error, and cooldown SHALL be cleared while the relevant phone or account input remains available

### Requirement: Session and safe return compatibility
The system SHALL persist successful responses through the existing AgentHub auth provider and `linkyun_auth` storage key, preserve API Service configuration, and use a safe internal replace navigation target.

#### Scenario: Successful authentication keeps session compatibility
- **WHEN** any supported authentication request succeeds
- **THEN** the provider SHALL persist the returned API key and creator display identity through the existing session path and replace-navigate to the validated `next` path or `/assets`

#### Scenario: Unsafe next is rejected
- **WHEN** an authentication route receives an external or protocol-relative `next` value
- **THEN** the client SHALL discard it and replace-navigate to `/assets`
