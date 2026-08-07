## Why

R22 added an explicit autoplay control and a six-second cadence, but the user now prefers a cleaner stage with faster passive discovery. R23 removes only the control-specific UI/state and shortens eligible autoplay to three seconds while preserving silent interruption safeguards.

## What Changes

- Change the Workbench autoplay delay from 6000ms to 3000ms.
- Remove the visible pause/resume button and its user-pause state, icon imports, styling, labels, and dedicated assertions.
- Preserve silent pause for hover, focus-within, hidden documents, active transitions, reduced motion, and single-Agent collections.
- Preserve a fresh full three-second delay after manual navigation or recovery from a transient pause.
- Preserve R22 geometry and R21 720ms transform-only layered motion.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `agenthub-workbench`: Automatic layered-carousel discovery becomes a silent three-second behavior without a visible pause/resume control.

## Impact

- Affects only the Workbench autoplay policy, its local component wiring/tests, and QA/OpenSpec evidence.
- Does not change carousel geometry, card content, Agent order, CTA/navigation, APIs, DTOs, backend services, dependencies, data, or other pages.
