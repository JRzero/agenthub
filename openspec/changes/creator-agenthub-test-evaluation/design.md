## Context

The approved `05-test-evaluation.png` uses three columns: test scenarios, a simulation conversation, and evaluation results. The legacy Creator already supports non-persistent Agent simulation through `POST /agents/{id}/simulate`, including prompt, examples, and skill overrides. It does not expose scenario storage, rubric evaluation, trace aggregation, memory-hit metrics, tool-call metrics, cost analysis, or test-set persistence.

The new frontend must make the existing simulation capability useful without presenting design-only evaluation data as backend truth.

## Goals / Non-Goals

**Goals:**

- Match the approved test-workspace hierarchy inside the selected Agent Asset route.
- Support real simulation conversations using saved Agent fields and current workspace authentication.
- Provide searchable local scenarios and a functional local create flow.
- Produce deterministic, explainable frontend-derived rubric scores after a conversation.
- Separate live, demo, derived, local-only, and unavailable signals visibly.
- Keep the workspace usable on desktop and narrow screens.

**Non-Goals:**

- Adding backend scenario, evaluation, trace, cost, or test-set endpoints.
- Persisting test conversations or local scenarios across reloads.
- Claiming the derived rubric is a model judge or production quality score.
- Migrating attachment widgets, audio, generated files, or long-term-memory deletion in this slice.

## Decisions

### 1. Reuse the existing simulation endpoint as the only live test write

The frontend sends `content`, prior messages, saved system prompt, examples, and skills to `POST /agents/{id}/simulate`. Requests retain the current API-key and workspace headers. No chat session is created.

Alternative: use the normal conversation/session API. Rejected because it would persist test traffic and change current semantics.

### 2. Keep scenarios session-local

Checked-in scenarios cover new-user chat, long-term relationship, emotional support, boundary challenge, and knowledge Q&A. Search and create operate in component state and are explicitly labelled local.

Alternative: save scenarios in localStorage. Deferred until ownership and cross-user sharing rules are defined.

### 3. Derive rubric scores deterministically in the frontend

The evaluator consumes the selected Agent contract, scenario goal, and current transcript. It returns five bounded scores plus concise reasons. The result is labelled `derived`, includes the evaluation timestamp, and never triggers a backend request.

Alternative: invent fixed demo scores matching the design. Rejected because identical scores would look like production facts.

### 4. Model unavailable diagnostics explicitly

Call traces, memory hits, tool invocations, exact cost, and test-set persistence remain unavailable unless returned by a future contract. Token usage returned by simulation may be shown as live response metadata, but it is not converted into currency.

### 5. Isolate demo conversations

Demo mode uses deterministic fixture replies tailored to each default scenario and never calls `/simulate`. The toolbar and conversation state retain a visible demo label.

### 6. Preserve one conversation per selected scenario

Switching scenarios resets the current transcript and evaluation. This avoids mixing goals and keeps derived scores attributable to one scenario.

## Risks / Trade-offs

- [Derived scores may still be over-trusted] -> Label every score block as frontend-derived and include short rubric explanations.
- [Live responses may be slow or fail] -> Show sending, retryable error, and preserved user-input states.
- [Scenario changes discard the transcript] -> Reset intentionally and show the selected scenario prominently.
- [Demo fixtures can drift from real behavior] -> Keep them isolated behind demo mode and never persist them.
- [No exact cost contract] -> Show token usage only when returned and mark cost unavailable.

## Migration Plan

1. Add the test domain module and route layout while retaining the old Creator.
2. Verify simulation payloads with unit tests and demo behavior in the browser.
3. Compare the running page with `05-test-evaluation.png` at 1440 x 1024.
4. A later backend change may replace local scenarios and derived scores with versioned evaluation runs without changing the three-column information architecture.

Rollback removes the Test layout/module and restores the existing placeholder; no stored data requires migration.

## Open Questions

- Ownership, sharing, and version binding for persisted test sets remain deferred.
- A future evaluation service must define rubric versions, judge models, trace schemas, and auditable cost fields.
