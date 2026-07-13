## ADDED Requirements

### Requirement: Test scenario workspace
The Test route SHALL provide searchable scenarios and SHALL allow creators to add session-local scenarios without representing them as persisted backend assets.

#### Scenario: Select a scenario
- **WHEN** the creator activates a different test scenario
- **THEN** the workspace resets the transcript and evaluation and identifies the newly selected goal

### Requirement: Live Agent simulation
Live mode SHALL send test messages through the existing Agent simulation endpoint with authentication, workspace context, transcript history, system prompt, examples, and skills.

#### Scenario: Send a live test message
- **WHEN** an authenticated creator submits a valid message in live mode
- **THEN** the frontend appends the user message, calls `POST /agents/{id}/simulate`, and renders the returned Agent response without creating a saved chat session

### Requirement: Demo simulation isolation
Demo mode MUST NOT call the Agent simulation endpoint and SHALL identify fixture responses as demo data.

#### Scenario: Send a demo message
- **WHEN** the creator submits a message in demo mode
- **THEN** the workspace renders a deterministic fixture response and performs no HTTP write

### Requirement: Frontend-derived evaluation
The workspace SHALL compute deterministic rubric scores from the selected Agent, scenario, and transcript and MUST label all such scores as frontend-derived rather than backend evaluation results.

#### Scenario: Run evaluation
- **WHEN** the transcript contains at least one Agent response and the creator activates Run Evaluation
- **THEN** the workspace displays an overall score, five rubric scores, concise reasons, and derived provenance

### Requirement: Honest diagnostic availability
The workspace MUST distinguish available simulation metadata from unavailable call traces, memory hits, tool invocations, exact cost, and test-set persistence.

#### Scenario: Backend omits diagnostics
- **WHEN** the simulation response contains no diagnostic contract
- **THEN** the evaluation panel marks those diagnostics unavailable and does not render invented counts or currency values

### Requirement: Test state handling
The workspace SHALL provide empty, sending, success, error, clear, and retry-capable conversation states.

#### Scenario: Simulation request fails
- **WHEN** the live simulation request fails
- **THEN** the user message remains visible, the error is explained, and the creator can submit another message
