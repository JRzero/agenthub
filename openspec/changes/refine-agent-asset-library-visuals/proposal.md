## Why

The Agent Asset Library is the primary workspace entry for finding and continuing Agent work, but its current page hierarchy is visually flat and the cards do not support fast comparison well. The page should feel like a professional, compact SaaS asset workspace while remaining consistent with AgentHub's existing shell and control system.

## What Changes

- Refine the Asset Library header into a clearer title, purpose, and primary-action hierarchy.
- Keep search and status filtering visible in a compact toolbar so asset discovery does not require an extra disclosure step.
- Rework asset cards for stronger avatar, identity, lifecycle, model, and update-time scanability without changing navigation or backend contracts.
- Improve empty, filtered-empty, hover, focus, dark-theme, and responsive states.
- Preserve AgentHub tokens, Phosphor icons, current status semantics, and existing create/open/action behaviors.

## Capabilities

### New Capabilities

- `agent-asset-library-visuals`: Defines the visual hierarchy, discovery controls, card information structure, and responsive presentation of the Agent Asset Library.

### Modified Capabilities

- `agent-asset-list`: The list must expose persistent discovery controls and clearer creating/published/draft/archived asset presentation while retaining resume and navigation behavior.

## Impact

- Affects `src/app/(workspace)/assets/page.tsx` and focused asset-library presentation tests.
- Uses existing Agent query data, shared controls, design tokens, and icon dependencies.
- No API, route, persistence, capability-matrix, or backend changes.
