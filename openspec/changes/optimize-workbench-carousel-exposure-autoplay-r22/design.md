## Context

R21 established persistent per-Agent nodes and a 720ms transform-only five-slot carousel. At 1536 px, the 360 px center card leaves only 52.6% of the near neighbor visible, below the R22 target. The carousel also has no automatic discovery path or user-facing pause control.

The visual source is the user feedback screenshot plus the measured R21 local page. The isolated Demo has two existing Agents, so far-slot geometry is validated deterministically rather than by adding fake visible data.

## Goals / Non-Goals

**Goals:**

- Set the desktop center width to 320–332 px and expose about 58–68% of near neighbors and 28–40% of far neighbors.
- Advance every six seconds only when the carousel is eligible.
- Pause for user pause, hover, focus-within, hidden documents, active transitions, reduced motion, and single-Agent collections.
- Restart a full six-second interval after manual input or a transient pause ends.
- Preserve R21 node identity, 720ms transform/z-index interpolation, circular navigation, and the last-valid-target queue.

**Non-Goals:**

- Change Agent records, ordering, content, cards, CTA destinations, stage height, API/DTO/backend behavior, or other pages.
- Add duplicate fixtures, drag, autoplay progress animation, opacity effects, new dependencies, or page-level layout changes.

## Decisions

### Measured desktop slot geometry

The focus card becomes 326 px wide, a 9.4% reduction from R21. Near slots use ±210 px at scale 0.86; far slots use ±324 px at scale 0.68. At a 900 px local viewport this yields 66.7% near exposure and 38.3% far exposure. At the narrower 838 px local viewport used around the 1440 page state, clipping keeps the far edge visible without causing page overflow. Mobile keeps its existing safe-width geometry.

Alternative considered: lower only the center width. Rejected because near/far positions would remain visually compressed and would not meet both exposure bands.

### One-shot six-second scheduler

Autoplay is a one-shot timeout, not an interval. Each eligible idle state schedules exactly one six-second advance. Any dependency change cancels that timeout; landing or resuming schedules a fresh one. This naturally prevents overlapping transitions and guarantees a full interval after manual interaction or pause recovery.

Alternative considered: `setInterval`. Rejected because interval ticks can arrive during 720ms motion and make pause/resume timing ambiguous.

### Explicit eligibility and accessible control

A pure eligibility function gates scheduling by Agent count, transition phase, user pause, hover, focus-within, document visibility, and reduced-motion preference. A visible icon-and-text button controls persistent user pause; it is hidden for one Agent. Transient pauses do not overwrite the user's explicit preference.

Alternative considered: pause only on hover. Rejected because keyboard users, background tabs, and reduced-motion users require equivalent protection.

### Manual actions invalidate the pending timeout

Previous, next, and neighboring-card selections increment a reset generation before forwarding to the unchanged R21 transition controller. The scheduler cleanup cancels the old timeout, and a new full delay begins only when the transition is idle again. Automatic requests do not increment this generation.

Alternative considered: rewrite the transition reducer to own autoplay. Rejected because autoplay is an independent timer policy and R21 queue semantics must remain unchanged.

## Risks / Trade-offs

- [Risk] Focus on the pause/resume control itself pauses autoplay via focus-within → This is deliberate; after focus leaves, a fresh six-second interval starts.
- [Risk] CSS geometry and runtime clipping can differ by responsive shell width → Verify computed card rectangles at 1536, 1440, 1280, and 720, plus deterministic five-slot math.
- [Risk] `matchMedia` availability differs in tests → Keep reduced-motion detection guarded and test the pure eligibility/scheduler contract with fake timers.

## Migration Plan

Replace only local Workbench geometry and timer policy. Rollback restores the R21 width/slot variables and removes the autoplay hook/control. No data migration is required.

## Open Questions

None.
