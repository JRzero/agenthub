## ADDED Requirements

### Requirement: Credential schema is isolated from ordinary configuration
The frontend MUST treat `credential_schema` as a Creator Skill credential contract separate from `config_schema`, ordinary `config`, Agent configuration, and Agent version data.

#### Scenario: Default configuration is opened
- **WHEN** a Creator Skill contains `credential_schema.properties`
- **THEN** the frontend displays those credential fields only on the Skill default configuration page

#### Scenario: Agent configuration is opened
- **WHEN** the user views the current Agent configuration page
- **THEN** credential fields are not displayed and are not included in the Agent configuration payload

#### Scenario: Legacy credential value exists in config
- **WHEN** a credential field name also exists in ordinary Skill or Agent config data
- **THEN** the frontend does not display or submit that value as ordinary configuration

### Requirement: Write-only credentials never reveal plaintext
The frontend MUST handle `writeOnly` credentials without reading, pre-filling, caching, persisting, logging, or displaying their plaintext value.

#### Scenario: Configured credential is loaded
- **WHEN** `api_key_configured` is true
- **THEN** the frontend displays an “已配置” status and an empty password field with the hint “留空将保持现有 Key”

#### Scenario: Unconfigured credential is loaded
- **WHEN** `api_key_configured` is false
- **THEN** the frontend displays an “未配置” status and an empty password field with the hint “请输入 API Key”

#### Scenario: Password credential is described
- **WHEN** a credential property uses `format: "password"`
- **THEN** the frontend renders a password input whose label prefers the property `title` and whose help text uses `description`

### Requirement: Credential updates use top-level request fields
The frontend MUST send Creator Skill credentials as top-level update request fields and MUST NOT merge credentials into `config`.

#### Scenario: New API Key is entered
- **WHEN** the user saves a non-empty API Key
- **THEN** the request contains top-level `api_key: "<new value>"` and ordinary parameters remain under `config`

#### Scenario: API Key input is left empty
- **WHEN** the user saves ordinary parameters without entering an API Key
- **THEN** the request omits `api_key` and preserves the existing backend credential

#### Scenario: API Key is explicitly cleared
- **WHEN** the user clicks “清除 Key” and confirms the destructive action
- **THEN** the frontend sends top-level `api_key: null`

### Requirement: Credential state refreshes after mutation
The frontend SHALL clear transient credential input after a successful update and SHALL render the latest `api_key_configured` value returned by the backend.

#### Scenario: API Key is added or rotated
- **WHEN** the Creator Skill update succeeds
- **THEN** the password input is emptied and the response configuration status is displayed

#### Scenario: API Key is cleared
- **WHEN** the clear request succeeds with `api_key_configured` false
- **THEN** the password input remains empty and the status changes to “未配置”
