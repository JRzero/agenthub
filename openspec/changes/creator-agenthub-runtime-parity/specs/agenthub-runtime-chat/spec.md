## ADDED Requirements

### Requirement: Runtime session lifecycle
Runtime Chat SHALL create a persisted session for the selected Agent, resume a provided session, and load its message history.

#### Scenario: Start a runtime session
- **WHEN** a Creator starts Runtime Chat without a session
- **THEN** the existing session-create endpoint SHALL be called with the selected Agent and test user

### Requirement: Streaming runtime conversation
Runtime Chat SHALL stream Agent responses through the existing message endpoint and SHALL fall back to the non-stream request when streaming cannot complete.

#### Scenario: Stream a response
- **WHEN** the backend emits delta and done events
- **THEN** the assistant message SHALL update incrementally and retain the final message ID and usage

#### Scenario: Fall back from stream HTTP failure
- **WHEN** the streaming request fails before completion
- **THEN** Runtime Chat SHALL retry through the compatible non-stream message endpoint without duplicating the visible user message

### Requirement: Runtime attachments and widgets
Runtime Chat SHALL load Agent widgets, resolve pending file inputs, submit custom fields, and render rich message outputs.

#### Scenario: Send widget input
- **WHEN** a Creator submits widget attachments or metadata
- **THEN** the message request SHALL preserve widget and skill identifiers

### Requirement: Edge runtime status
Runtime Chat SHALL subscribe to the session's user-event stream with API-key and workspace headers and SHALL expose transient Edge status updates.

#### Scenario: Receive Edge status
- **WHEN** the SSE stream emits an `edge_status` event
- **THEN** the current status text SHALL be displayed without being inserted as a chat message

### Requirement: Demo runtime isolation
Demo Runtime Chat MUST NOT create sessions, upload files, send messages, or open SSE connections.

#### Scenario: Use demo runtime
- **WHEN** the application is in demo mode
- **THEN** Runtime Chat SHALL use deterministic local messages and label the session as demo
