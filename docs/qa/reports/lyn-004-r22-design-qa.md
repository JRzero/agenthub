# LYN-004-R22 Design and Interaction QA

Date: 2026-08-07
Scope: Workbench layered carousel geometry and autoplay controls only.
Visual source: user feedback plus R21 same-state Browser baseline.

## Initial findings

- P0: 0
- P1: 2 — 360px center card exceeded the 320–332px target; near exposure was 52.6%, below the 58–68% target.
- P2: 1 — no visible autoplay pause/resume control or automatic discovery cadence.

## Implemented correction

- Desktop center width: 360px → 326px (9.4% reduction).
- Near slots: ±188px / scale 0.84 → ±210px / scale 0.86.
- Far slots: ±318px / scale 0.68 → ±324px / scale 0.68.
- Motion remains the R21 720ms `cubic-bezier(0.42, 0, 0.58, 1)` transform plus synchronized z-index interpolation; no opacity, overlay, width, height, top, or left animation was added.
- Autoplay uses a cancellable one-shot 6000ms timeout. Eligibility requires more than one Agent, idle transition, user play state, no hover, no carousel focus, visible document, and no reduced-motion preference.
- A visible Phosphor Pause/Play control exposes the persistent state. Manual previous/next/neighbor input cancels the old timeout; a new full interval starts only after landing and clearing transient pause conditions.

## Geometry evidence

| CSS viewport | Local carousel viewport | Center | Near | Near exposure | Page overflow |
| --- | --- | --- | --- | --- | --- |
| 1536 | 900px | 326px | 280.36px | 187.18 / 280.36 = 66.76% | none; 1536/1536 |
| 1440 | 838px | 326px | 280.36px | 66.76% | none; 1440/1440 |
| 1280 | 667px | 326px | 280.36px, locally clipped | safe | none; 1269/1280 |
| 720 | 611px | 280px | 212.8px | mobile safe geometry | none; 709/720 |

Five-slot deterministic geometry gives far exposure `(434.84 - 350.18) / 221.68 = 38.19%`, inside the 28–40% target. The existing Demo contains only two honest fixture Agents, so this far-slot value is covered by deterministic tests rather than adding three fake visible cards.

## Autoplay and interaction evidence

- Default automatic advance: center Agent changed after one eligible six-second interval and the 720ms transition settled without overlapping motion.
- User pause: `aria-pressed=true` / “继续自动轮播” held the same center Agent beyond 6500ms.
- Resume and hover: keeping the pointer inside the stage held the center Agent for 6300ms; moving outside started a fresh full interval, then advanced once.
- Focus-within: arrows and Agent card controls retain the existing keyboard/focus behavior and suspend scheduling while focused. The autoplay toggle itself remains operable so “继续轮播” can restart once hover is clear.
- Manual reset and no overlap are covered by the same one-shot cleanup contract and the unchanged R21 `idle/sliding` state plus one-last-target queue.
- Reduced motion and hidden-document eligibility are covered by pure policy and controlled-clock tests because the in-app Browser does not expose media/visibility emulation. Runtime detection uses `matchMedia` and `visibilitychange`; reduced motion never schedules autoplay.
- All sampled card opacities remained `1`; the stage shell and height stayed stable.
- Fresh isolated Demo Browser console: 0 errors / 0 warnings.

## Responsive visual review

- 1536: center, neighbor, arrows, and autoplay control are separated; detail panel and stage remain unchanged.
- 1440: target desktop geometry remains readable with no page overflow.
- 1280: local clipping safely reduces peripheral exposure without shrinking text or creating page overflow.
- 720: 280px center card, arrows, and visible pause control fit without horizontal overflow or CTA clipping.

## Evidence paths

- User feedback: `docs/qa/images/lyn-004-r22/01-user-feedback.png`
- R21 before: `docs/qa/images/lyn-004-r22/02-r21-before-1536x1000.png`
- R22 after desktop: `docs/qa/images/lyn-004-r22/03-r22-after-1536x1000.png`
- R22 after narrow: `docs/qa/images/lyn-004-r22/04-r22-after-720x900.png`
- Same-viewport R21/R22 comparison: `docs/qa/images/lyn-004-r22/05-r21-r22-same-viewport-comparison.png`
- User-feedback/R22 comparison: `docs/qa/images/lyn-004-r22/06-user-feedback-r22-comparison.png`
- Baseline audit: `docs/qa/reports/lyn-004-r22-current-audit.md`

## Final review

- P0: 0
- P1: 0
- P2: 0
- Live handoff: `com.linkyun.agenthub.r22-live`, PID 47864, serves `/login`, `/workbench`, and `/assets` as HTTP 200 at `127.0.0.1:3002`. Browser shows no Demo marker and 0/0 Console; the unchanged local Agent endpoint still returns HTTP 404, so Live honestly shows the existing request error and never falls back to fixtures.

final result: passed
