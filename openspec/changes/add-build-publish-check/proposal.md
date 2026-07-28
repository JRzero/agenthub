## Why

The Build workspace currently sends users directly from editing to publishing without a concise readiness summary. A lightweight publish check should surface blocking configuration, test status, resource availability, and Client impact while preserving the existing preview-first workspace.

## What Changes

- Add a temporary `发布检查` state to the existing right-side draft preview panel.
- Run a small frontend-derived readiness check when the user chooses `发布为新版本`.
- Summarize exactly four areas: basic configuration, capabilities and resources, tests and safety, and online Client impact.
- Block the final publish action only for clearly actionable failures; keep non-blocking information concise.
- Provide direct `去完善` and `查看结果` navigation without editing configuration inside the check panel.
- Preserve the current two-level navigation, Build form structure, and top action placement.

## Capabilities

### New Capabilities

- `agent-build-publish-check`: Defines the Build workspace publish-check state, check categories, blocking behavior, and handoff to the existing publish flow.

### Modified Capabilities

None.

## Impact

- Affects the Agent Build workspace header and right-side preview panel.
- Reuses existing draft, resource, test, version, and Client data already available to the frontend; no new backend endpoint is required for the initial simple version.
- Adds focused component and interaction tests for entering, leaving, and resolving the publish-check state.
- Does not change public API contracts, storage keys, navigation structure, or npm dependencies.
