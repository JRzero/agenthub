## ADDED Requirements

### Requirement: Agent image responses are preserved
The frontend SHALL preserve an Agent simulation response `image_url` when converting the response into a displayed assistant message.

#### Scenario: Simulation returns an image
- **WHEN** the Agent simulation response includes a non-empty `image_url`
- **THEN** the assistant message retains that image URL together with its text content

#### Scenario: Simulation returns text only
- **WHEN** the Agent simulation response does not include `image_url`
- **THEN** the assistant message continues to display its text without an empty image placeholder

### Requirement: Agent image responses are displayed
The frontend SHALL display a retained Agent response image inside the corresponding assistant message.

#### Scenario: Relative file download URL
- **WHEN** an assistant message contains an `image_url` beginning with `/`
- **THEN** the frontend resolves it against the configured API base and renders a visible image linked to the resolved file

#### Scenario: Absolute image URL
- **WHEN** an assistant message contains an absolute HTTP or HTTPS `image_url`
- **THEN** the frontend renders that URL without prefixing the API base
