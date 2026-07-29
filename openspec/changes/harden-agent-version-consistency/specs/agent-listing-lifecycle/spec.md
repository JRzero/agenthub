## ADDED Requirements

### Requirement: Listing state uses dedicated lifecycle endpoints
AgentHub SHALL publish through `/publish`, unpublish through `/unpublish`, relist through `/relist`, and archive or delete through `DELETE /agents/{id}`. It MUST NOT modify Agent lifecycle status through the general update endpoint.

#### Scenario: Published Agent is unpublished
- **WHEN** the creator confirms unpublish
- **THEN** AgentHub calls the unpublish endpoint, adopts the returned `private` Agent, and does not change its current version

#### Scenario: Unpublished Agent is relisted
- **WHEN** the creator confirms relist
- **THEN** AgentHub calls the relist endpoint and adopts the returned active Agent without creating a new version

#### Scenario: Draft is saved
- **WHEN** the creator saves ordinary draft changes
- **THEN** AgentHub does not call any lifecycle endpoint and does not send a status field

### Requirement: Lifecycle presentation distinguishes unpublished Agents
AgentHub SHALL distinguish a listed published Agent, an unpublished Agent with a retained current version, a never-published draft, an Agent still being created, and an archived Agent.

#### Scenario: Unpublished Agent appears in workspace surfaces
- **WHEN** an Agent has `status: "private"` and a current version
- **THEN** asset library, workbench, and Agent workspace header show “已下架” and do not label it “运行中” or “草稿”

#### Scenario: Never-published Agent appears
- **WHEN** an Agent has no current version and guided creation is complete
- **THEN** the UI shows a draft or unpublished-first-version state rather than “已下架”

#### Scenario: New session availability is explained
- **WHEN** a creator inspects an unpublished Agent
- **THEN** the lifecycle action explains that existing Sessions retain their bound version while new Sessions require relisting
