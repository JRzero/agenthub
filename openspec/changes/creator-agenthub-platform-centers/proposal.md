# Change: Migrate analytics, governance, revenue, and settings centers

## Why

The approved AgentHub shell includes four workspace-level centers that are still placeholders. The frontend rebuild must represent the approved information architecture without pretending that missing backend analytics, governance, or settlement contracts already exist.

## What Changes

- Add interactive demo implementations for Analytics, Governance, and Revenue.
- Keep live mode honest by showing capability-boundary states until backend contracts exist.
- Migrate the existing Creator profile, password, and avatar contracts into Settings.
- Add workspace preference UI that clearly identifies browser-local persistence.

## Impact

- New frontend modules under `src/modules/{analytics,governance,revenue,settings}`.
- Existing backend endpoints are consumed unchanged.
- No files under `client-web-ui` or the backend repository are modified.
