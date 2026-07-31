## ADDED Requirements

### Requirement: Agent Asset navigation and context
The system SHALL expose the memory service status as an Agent-level read-only capability at `/assets/[agentId]/memory`, SHALL include it in the Agent Asset navigation, and SHALL preserve the current Agent identity and lifecycle context.

#### Scenario: Creator opens memory service from an Agent
- **WHEN** a creator selects “记忆服务” inside an Agent Asset workspace
- **THEN** the system opens that Agent's memory service status page without changing to a workspace-level analytics context

### Requirement: Anonymous aggregate data source
The system MUST obtain Live data only from `GET /api/v1/agents/{agent_id}/memory-analytics` through the shared API base and authentication layer, and MUST NOT request or retain user-level, binding-level, Memory-level, message, fact, query/write, trend, attribution, or individual score data.

#### Scenario: Live aggregate request
- **WHEN** the page loads in Live mode for Agent `9`
- **THEN** the system requests `/agents/9/memory-analytics` with the existing authentication and workspace context

#### Scenario: Demo data isolation
- **WHEN** the page loads in Demo mode
- **THEN** the system uses an explicitly isolated anonymous Demo fixture and does not present it as a successful Live response

### Requirement: Summary and complete operational view
The system SHALL present the Agent context, four summary metrics, relationship and emotion data completeness, relationship stages, emotion record formation, current situation and advice, recent states, overall moods, aggregate experience signals, and metric explanations using creator-readable Chinese terminology.

#### Scenario: Partial aggregate renders available information
- **WHEN** a successful response has `partial=true` and contains available relationship or emotion aggregates
- **THEN** the system displays all available aggregates and identifies the missing signal counts as “暂未获取”

#### Scenario: Primary terminology
- **WHEN** the operational page renders
- **THEN** its primary labels use “记忆关系”“关系数据完整度”“情绪数据完整度”“情绪记录”“已获取”“暂未获取”“已有记录”“尚未积累” instead of raw English contract terms

### Requirement: Correct denominator and null semantics
The system MUST calculate coverage against `total_active_memories`, relationship stage shares against `relationship_available`, emotion formation and state shares against `emotion_available`, and MUST preserve `null` as unavailable rather than converting it to zero.

#### Scenario: Relationship and emotion denominators
- **WHEN** 11 relationship signals and 10 emotion signals are available from 12 active memories, with stage counts `1/6/4` and emotion statuses `9/1`
- **THEN** the stage shares are calculated from 11 and the formation shares are calculated from 10

#### Scenario: No denominator
- **WHEN** a relevant denominator is zero
- **THEN** the system displays “暂无样本” and does not display `0%`

#### Scenario: Null aggregate value
- **WHEN** an aggregate score is `null`
- **THEN** the system displays `—` with a no-calculable-sample explanation and does not display zero

#### Scenario: Coexisting states
- **WHEN** one Memory contributes multiple current states
- **THEN** the system treats every state count as an independent coverage value and does not require the shares to sum to 100%

### Requirement: Empty, omitted, and partial states
The system SHALL distinguish a service signal that was not obtained from an accessible service that has not accumulated samples, and SHALL not manufacture zero-valued modules when an aggregate segment is omitted.

#### Scenario: No active memories
- **WHEN** `total_active_memories=0`
- **THEN** the system displays an interaction-accumulation empty state and omits meaningless percentage charts

#### Scenario: Relationship segment omitted
- **WHEN** active memories exist but the `relationship` segment is omitted
- **THEN** the relationship module displays “暂未获取” and does not render zero scores

#### Scenario: Emotion segment omitted
- **WHEN** active memories exist but the `emotion` segment is omitted
- **THEN** the emotion module displays “暂未获取” and the emotion record summary displays `—`

#### Scenario: Accessible emotion has no records
- **WHEN** `emotion.status_distribution.empty` is greater than zero
- **THEN** the system labels those anonymous memories “尚未积累” and does not classify them as a service failure

### Requirement: Error-specific and stale-snapshot handling
The system SHALL provide distinct states for HTTP 400, 401, 404, 503, and 500 responses and SHALL retain a previous successful anonymous snapshot when a later refresh fails.

#### Scenario: Invalid Agent parameter
- **WHEN** the API returns HTTP 400
- **THEN** the system explains that the Agent parameter is invalid and does not automatically retry

#### Scenario: Authentication expired
- **WHEN** the API returns HTTP 401
- **THEN** the shared request layer initiates reauthentication and the page explains that the login state is invalid

#### Scenario: Not found or unauthorized
- **WHEN** the API returns HTTP 404 with `AGENTMEM_ANALYTICS_NOT_FOUND`
- **THEN** the system displays “Agent 不存在或无查看权限” without exposing which condition occurred

#### Scenario: Service unavailable
- **WHEN** the API returns HTTP 503 with `AGENTMEM_ANALYTICS_UNAVAILABLE`
- **THEN** the system hides operational aggregates and displays “记忆分析服务暂未配置”

#### Scenario: Initial internal error
- **WHEN** the API returns HTTP 500 before any successful snapshot
- **THEN** the system displays a retryable temporary error state

#### Scenario: Refresh internal error
- **WHEN** a refresh returns HTTP 500 after a successful snapshot
- **THEN** the system keeps the previous snapshot visible and labels it with its last successful frontend retrieval time

### Requirement: Manual refresh behavior and timestamp truthfulness
The system SHALL provide manual refresh, MUST NOT poll or automatically refetch because of timers, window focus, or network reconnection, and SHALL identify timestamps only as frontend retrieval times.

#### Scenario: Manual refresh
- **WHEN** the creator activates the refresh control
- **THEN** the system refetches the current Agent aggregate, shows progress, and updates the retrieval time after success

#### Scenario: No automatic refresh
- **WHEN** the creator leaves the page open, switches window focus, or reconnects to the network
- **THEN** the system does not automatically refetch the aggregate

#### Scenario: Timestamp label
- **WHEN** a successful aggregate is displayed
- **THEN** the system labels the client timestamp “本次获取时间” and does not call it an upstream data update time

### Requirement: Privacy-preserving read-only experience
The system MUST remain an anonymous Agent-level read-only view and MUST NOT expose controls or outputs for user drill-down, Memory drill-down, fact management, message content, identity, trend analysis, query/write metrics, effectiveness attribution, or high-risk decision making.

#### Scenario: Creator reviews the full page
- **WHEN** all operational sections and controls are visible
- **THEN** no binding UUID, Memory ID, user identity, message, fact content, individual Memory score, user selector, detail drill-down, trend, management action, or effect claim is present

### Requirement: Verification evidence
The implementation SHALL include automated API, model, state, and interaction tests and SHALL include browser QA evidence for partial, no-sample or error, and refresh behavior in the repository QA directories.

#### Scenario: Delivery verification
- **WHEN** implementation is complete
- **THEN** lint, typecheck, all Vitest tests, production build, strict OpenSpec validation, and browser QA complete successfully or an unavailable real-backend integration is explicitly documented
