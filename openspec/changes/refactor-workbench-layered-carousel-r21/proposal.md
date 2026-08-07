## Why

The R20 Workbench carousel is stable but still moves one keyed two-group strip, so users perceive a mechanical scene replacement rather than continuously tracking individual Agent cards. R21 adopts the user-approved layered multi-slot motion pattern while preserving AgentHub content, navigation, and data contracts.

## What Changes

- Replace the keyed two-group strip with persistent per-Agent card nodes positioned in five visual slots: far previous, previous, focus, next, and far next.
- Animate each visible card continuously through horizontal position, scale, and stacking order during previous/next transitions.
- Preserve a single last-valid-target queue for rapid input, deterministic looping, and effectively instant reduced-motion behavior.
- Add node-continuity, slot-geometry, motion, responsive, interaction, and visual evidence for the layered carousel.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `agenthub-workbench`: The existing selectable Agent stage gains persistent layered carousel slots with continuous per-card movement and stable rapid-input/reduced-motion behavior.

## Impact

- Affects only the Workbench carousel presentation/state layer, its local tests, and QA/OpenSpec evidence.
- Does not change APIs, DTOs, authentication, Agent data, lifecycle semantics, CTA destinations, global navigation, dependencies, backend services, or other pages.
