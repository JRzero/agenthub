## Why

AgentHub already supports Creator profile updates and raw avatar upload, but it lacks the legacy crop-safe avatar flow and a user-facing theme selector. Completing both removes the final Settings parity gaps while retaining the existing storage key and backend contracts.

## What Changes

- Add square canvas crop, zoom, and position controls before Creator avatar upload.
- Preserve avatar deletion and demo-only local preview behavior.
- Add a light, dark, and system theme provider with live system preference updates.
- Persist theme mode in the existing `linkyun-theme` JSON shape and expose an Appearance settings panel.
- Keep the existing pre-hydration theme script to prevent initial color flash.

## Capabilities

### New Capabilities

- `agenthub-profile-appearance`: Crop-safe Creator avatar management and persistent theme mode selection.

### Modified Capabilities

None.

## Impact

- Affects `src/modules/settings`, root providers, and theme tests.
- Reuses `/profile/avatar` and `linkyun-theme`; adds no dependency or backend change.
