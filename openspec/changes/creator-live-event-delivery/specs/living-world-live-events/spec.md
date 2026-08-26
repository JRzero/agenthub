## ADDED Requirements

### Requirement: Preparation event cards remain an opening contract
AgentHub SHALL provide event-card create, edit, and delete controls only while the World status is `draft`. For every non-draft World it SHALL keep the server event-card list readable, MUST describe it as a pre-opening contract, and MUST NOT render a submittable create, edit, or delete control.

#### Scenario: Creator opens event cards for a running World
- **WHEN** the World detail status is not `draft`
- **THEN** AgentHub shows the event-card snapshot and explains that the opening contract cannot be modified during runtime without rendering mutation controls

### Requirement: Eligible Creator roles can compose a bounded live event
AgentHub SHALL expose live-event composition in the World runtime console only to owner or operator roles for a running World whose runtime health is `running` or `content_idle`. Location SHALL be selected from the World contract, zero to four unique participants SHALL be selected from currently active projected residents, maximum effect SHALL be one of `ambient_only`, `temporary_local`, or `reversible_local`, and TTL SHALL be between 60 and 86400 seconds.

#### Scenario: Operator selects current residents
- **WHEN** an operator composes a live event with active projected residents
- **THEN** AgentHub submits their `participant_code` values from checkboxes or an equivalent selector and never asks the operator to type codes

#### Scenario: Runtime is paused or actor lacks permission
- **WHEN** the World is paused, blocked, archived, takedown, has another ineligible runtime health, or the actor is not owner/operator
- **THEN** AgentHub disables or hides submission and states the exact known eligibility reason

### Requirement: Live-event submission uses exact runtime identity and confirmation
Before POST AgentHub SHALL show title, location, observable start, selected residents, maximum effect, TTL, and the statement that the event only enters the candidate chain and does not guarantee a response. One explicit confirmation SHALL be required. The request MUST bind the current server-derived `run_epoch`, `fencing_token`, instance `state_revision` as `expected_revision`, and one stable idempotency key. AgentHub MUST NOT submit when this command identity is unavailable and MUST NOT invoke Tick.

#### Scenario: Current fence is unavailable after refresh
- **WHEN** runtime projection is readable but no server-derived runtime fence is cached
- **THEN** AgentHub disables POST, explains that it will not guess epoch/fence/revision, and sends no request

#### Scenario: Creator confirms an eligible event
- **WHEN** all fields and runtime identity are valid and the Creator confirms once
- **THEN** AgentHub sends exactly one POST to `/worlds/{world_code}/runtime/live-events` with the frozen request fields and performs no Tick request

### Requirement: Unknown mutation results reconcile without blind replay
AgentHub SHALL retain the stable operation key and submitted snapshot when POST outcome is unknown. It SHALL perform GET reconciliation before permitting any new submission and MUST NOT automatically repeat POST. Known event identities SHALL reconcile through the single-event GET; unknown identities SHALL reconcile through the live-event list and exact submitted snapshot.

#### Scenario: Connection drops after POST
- **WHEN** the create request may have reached the server but no response is available
- **THEN** AgentHub announces reconciliation, performs GET, and either converges on the matching event or remains in an unknown state with POST disabled

### Requirement: Candidate statuses and limitations remain explicit
AgentHub SHALL list server live events and render `pending`, `selected`, `committed`, `rejected`, and `expired` with distinct stable Chinese labels. Every list and success state SHALL explain that submission only creates a candidate, does not guarantee participant response, and is separate from the committed timeline.

#### Scenario: Pending event is later committed
- **WHEN** single-event GET changes the server status from `pending` to `committed`
- **THEN** AgentHub updates the event status from server truth without fabricating a timeline entry

### Requirement: Live-event failures use precise recoverable Chinese guidance
AgentHub SHALL distinguish known permission/lifecycle/no-fence blockers, invalid fields or secret text, stale fence/revision or changed idempotency payload, invalid participant/location/runtime state, budget/breaker refusal, and unknown connection outcomes. It MUST NOT reduce these cases to a generic 500 or mislabel a running event-card conflict as field validation.

#### Scenario: Server rejects a stale fence
- **WHEN** POST returns `409 WORLD_CONFLICT`
- **THEN** AgentHub states that runtime fence/revision may be stale or the idempotency payload changed, refreshes truth, and does not automatically resubmit

#### Scenario: Public text contains secret material
- **WHEN** title or observable start matches a known secret/internal marker or the server returns invalid request for public text
- **THEN** AgentHub tells the Creator to remove secret/private/internal material while retaining the draft locally
