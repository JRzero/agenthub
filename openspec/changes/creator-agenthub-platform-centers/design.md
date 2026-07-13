# Design

## Source of truth

- `design-reference/08-analytics.png`
- `design-reference/09-governance.png`
- `design-reference/10-revenue.png`
- `design-reference/11-settings.png`
- Legacy Creator profile API contracts

## Capability policy

Analytics, Governance, and Revenue use realistic demo fixtures only when `NEXT_PUBLIC_AGENTHUB_DATA_MODE=demo`. Live mode renders an explicit unavailable state because no matching service contract exists. Settings consumes `/profile`, `/profile/password`, and `/profile/avatar` and labels browser-local workspace preferences.

## Interaction model

- Analytics supports filters, metric switching, canvas-rendered trends, and CSV demo export.
- Governance supports risk selection, tabs, and local demo resolution.
- Revenue supports month/granularity/source filters and trend/detail views.
- Settings supports workspace preferences, profile save, avatar upload/delete, and password change.
