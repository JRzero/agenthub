## Why

R21 keeps Agent cards continuous during motion, but the center card still dominates the stage and masks too much of the surrounding collection. Users also need a calm, controllable way to discover additional Agents without repeatedly clicking navigation controls.

## What Changes

- Reduce the desktop focus-card width by approximately 8–12% and expand layered slot spacing so near and far neighbors have measurable, useful exposure without horizontal overflow.
- Add six-second automatic carousel advance when more than one Agent is available.
- Add a visible pause/resume control and pause autoplay for hover, focus-within, hidden documents, user pause, active transitions, single-Agent collections, and reduced-motion preferences.
- Reset a full autoplay interval after manual navigation or a transient pause ends while preserving R21 node continuity, 720ms transform motion, circular selection, and the last-valid-target queue.
- Add deterministic geometry, controllable-clock, responsive, interaction, and visual QA evidence.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `agenthub-workbench`: The persistent layered Agent carousel gains more balanced card exposure and accessible, pause-aware automatic advance.

## Impact

- Affects only the Workbench carousel presentation/controller, its local tests, and QA/OpenSpec evidence.
- Does not change APIs, DTOs, authentication, Agent data, lifecycle semantics, CTA destinations, global navigation, dependencies, backend services, or other pages.
