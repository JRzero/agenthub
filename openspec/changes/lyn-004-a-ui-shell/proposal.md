## Why

AgentHub currently mixes a light-first purple visual system with page-specific styling and a broad administrative navigation, which does not provide the compact, creation-focused foundation approved for V1. This change establishes a reusable dark design system and application shell without changing routes, APIs, data contracts, permissions, or business flows.

## What Changes

- Replace the global visual foundation with semantic dark-theme tokens for canvas, surfaces, borders, text, lime primary actions, and semantic status colors.
- Provide reusable primitives for buttons, controls, cards, tables, statuses, empty states, loading states, and persistent errors, including visible keyboard focus and reduced-motion behavior.
- Reorganize the workspace sidebar into compact Workbench, Agent, Resources, Operations, Management, and bottom-tool groups with a persistent Create Agent action.
- Preserve existing workspace switching, route highlighting, help, settings, account, responsive shell modes, and Agent creation behavior.
- Remove all application-shell exposure of Living World and avoid fabricated notification badges or counts.
- Add shell and navigation contract tests plus desktop browser evidence at 1440px and 1280px.

## Capabilities

### New Capabilities

- `agenthub-design-system`: Semantic V1 theme tokens and reusable base UI states for the AgentHub frontend.
- `agenthub-application-shell`: Compact grouped workspace navigation, route-aware shell modes, persistent creation entry, responsive behavior, and honest bottom tools.

### Modified Capabilities


## Impact

- Affected code: global styles, Tailwind semantic aliases, `src/shared/ui`, `src/shared/layout`, and shell-related tests.
- Affected behavior: visual presentation and navigation grouping only; existing route targets and authenticated workspace behaviors remain unchanged.
- APIs, DTOs, storage keys, permissions, backend systems, and npm dependencies are unchanged.
- Living World, V2 AI co-creation, business-page redesigns, and fabricated notification state remain out of scope.
