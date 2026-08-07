## Context

R20 renders two complete three-card groups inside a keyed 200%-wide strip. Although the strip stays opaque, changing the segment key replaces the visible group as a unit, so the motion reads as scene replacement rather than individual Agent cards moving through a persistent carousel.

The R21 visual truth is the user-provided Talkie screenshot: five simultaneously visible, overlapping card positions with one dominant center card, two near neighbors, and two smaller far neighbors. The public page could not be captured reliably in the in-app Browser because it repeatedly timed out, so its private easing and internal implementation cannot be verified. R21 therefore reproduces only the visible layered relationship and validates motion against the local AgentHub implementation.

## Goals / Non-Goals

**Goals:**

- Keep each participating Agent card rooted in a stable React node keyed only by Agent id.
- Move cards between far-previous, previous, focus, next, and far-next positions with continuous `transform` interpolation and deterministic stacking.
- Keep the stage shell, background, heading, artwork brightness, detail layout, Agent ordering, navigation, and data contracts stable.
- Preserve the existing last-valid-target queue, circular previous/next behavior, direct neighbor selection, keyboard controls, and reduced-motion behavior.
- Use a 650–800ms main transition that makes individual card travel visually trackable.

**Non-Goals:**

- Reproduce Talkie artwork, reflections, decoration, private easing, or proprietary code.
- Add autoplay, drag gestures, new routes, data, dependencies, API changes, or backend behavior.
- Change the Workbench information architecture, card copy, CTA destinations, state summary, or recent-work list.

## Decisions

### Persistent per-Agent nodes

The carousel renders one card root per participating Agent with `key={agent.id}`. A transition changes slot metadata and CSS custom properties on those roots; it never keys a whole transition segment or swaps two complete groups. Up to the target neighborhood is kept mounted so incoming far cards can enter without an empty stage.

Alternative considered: keep the R20 two-group strip and tune duration/easing. Rejected because it preserves the unit-of-motion problem identified by the user.

### Five-slot layered geometry

Each visible Agent receives a signed circular slot offset relative to the visual target: `-2`, `-1`, `0`, `1`, or `2`. The slot maps to horizontal translation, scale, and stacking level. The center remains full size; near and far neighbors are progressively smaller and lower in the stack. Small collections render only distinct real Agents and never duplicate records.

Alternative considered: five anonymous slot containers whose contents change. Rejected because slot containers would persist while Agent content nodes remount, weakening node continuity.

### Transform-only travel with discrete stack handoff

Cards animate `translate3d` and `scale` for 720ms with a balanced ease-in-out curve. `z-index` interpolates linearly across the same 720ms so the outgoing and incoming focus layers cross at the midpoint instead of handing overlap ownership to the destination immediately; no stage/group opacity, brightness animation, overlay, width, height, top, or left animation is used. The stage clips only its local carousel layer and keeps a fixed height.

Alternative considered: opacity cross-fades and spring motion. Rejected because opacity caused the reported black-frame perception and springs can overshoot or alter final geometry.

### Existing reducer, new presentation model

The R20 reducer remains the source of selection, direction, completion, and last-target queue semantics. During a segment, slot geometry is calculated against `targetId`; `displayedId` remains the committed selection for the detail panel until landing. Completion does not change card geometry, so it cannot create a second visual jump.

Alternative considered: a new animation state machine. Rejected because the existing reducer already satisfies queue, loop, and reduced-motion requirements and the contract prohibits an unnecessary rewrite.

### Honest data and evidence boundary

No Demo or Live Agent is added. With fewer than five Agents, only available unique cards render; the five-slot behavior is covered with synthetic test data and DOM continuity checks. The user screenshot anchors visual hierarchy, while local frame sampling establishes R21 timing and continuity. The exact Talkie easing remains explicitly unconfirmed.

## Risks / Trade-offs

- [Risk] Large Agent collections could mount too many artwork-heavy cards → Limit participation to the current/target neighborhoods while keeping all cards involved in a segment stable.
- [Risk] A discrete `z-index` handoff can briefly choose the destination overlap order before transform completes → Use a consistent destination stack and verify forward/backward midpoint frames for incorrect overlap.
- [Risk] Direct selection of a farther visible card travels more than one slot → Keep the requested direction explicit and interpolate every card once toward the final target, without catch-up segments.
- [Risk] Talkie private motion details are unknowable from the screenshot → Record the limitation and judge R21 against visible hierarchy, user constraints, measured local frames, and reduced-motion behavior.

## Migration Plan

Replace only the Workbench carousel presentation and related tests. Rollback is the R20 Workbench component, transition duration, and transition stylesheet; no data or API migration is required.

## Open Questions

None. The user explicitly approved the screenshot as visual truth when the public page cannot be captured.
