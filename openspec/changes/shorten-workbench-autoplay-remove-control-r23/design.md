## Context

R22 introduced a six-second one-shot autoplay scheduler and a visible Pause/Play control. The user now explicitly wants a three-second cadence with no visible control, while retaining every silent interruption safeguard and the existing geometry/motion implementation.

## Goals / Non-Goals

**Goals:**

- Advance exactly once after 3000ms of uninterrupted eligibility.
- Remove the pause/resume button, user-pause state, icons, styling, labels, and control-only tests with no placeholder gap.
- Preserve hover, focus-within, hidden-document, active-transition, reduced-motion, and single-Agent suppression.
- Preserve a fresh three-second interval after manual navigation or transient pause recovery.

**Non-Goals:**

- Change R22 width/slot geometry, R21 720ms transition, Agent selection/order, data, API, backend, navigation, CTA, or other pages.
- Add a replacement control, progress indicator, new dependency, or global timer behavior.

## Decisions

### Keep the existing one-shot scheduler

Only `WORKBENCH_AUTOPLAY_MS` changes from 6000 to 3000. The one-shot timeout and `phase === idle` eligibility already prevent overlapping the 720ms transition and naturally restart after landing.

Alternative considered: convert to `setInterval`. Rejected because interval ticks can overlap a running transition and weaken reset semantics.

### Remove user-pause from the policy surface

Delete `pausedByUser` from the eligibility type, predicate, hook dependencies, Workbench state, icons, and markup. The stage's hover/focus handlers remain because they serve silent pause rather than the removed control.

Alternative considered: keep hidden state for a future control. Rejected because the contract requires removal of button-exclusive state and tests.

### Preserve all geometry and motion CSS verbatim

No transition stylesheet changes are needed. Automated source tests continue asserting the 326px center and ±210/±324px slot geometry plus 720ms transform/z-index motion.

## Risks / Trade-offs

- [Risk] A shorter cadence could overlap a transition → The scheduler remains disabled while `phase` is `sliding` and schedules a fresh 3000ms timeout only after landing.
- [Risk] Removing the control could remove keyboard pause behavior → Focus capture on the stage remains unchanged, so keyboard interaction silently suspends autoplay.
- [Risk] Hidden user-pause references could survive → Source/test searches explicitly assert the toggle test id, labels, icons, state, and `pausedByUser` policy field are absent.

## Migration Plan

Apply the local timer and Workbench wiring changes, then update tests and evidence. Rollback restores the R22 constant and control/state. No data migration is required.

## Open Questions

None.
