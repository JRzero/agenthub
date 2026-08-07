# LYN-004-R18 Current Motion Audit

## Scope and setup

- Route: isolated Demo `http://127.0.0.1:3013/workbench`.
- Viewport: 1440 × 900 CSS px; captured client width 1429px after the scrollbar gutter.
- Source feedback: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-c3e0073e-fee3-4da5-9ffd-30361de9062f.png`.
- Browser: Codex in-app Browser. Demo was used only for motion evidence; Live keeps its existing API-only data boundary.

## Numbered audit steps

1. **Stable starting state — P0 0 / P1 0 / P2 0.** The stage measured 877 × 522px at x=228, y=158 with document `scrollWidth = clientWidth = 1429`.
   - Evidence: `docs/qa/images/lyn-004-r18/01-before-next-start.png`.
2. **Next transition trigger — P1 1.** The old implementation faded the complete three-card container to zero, committed the selected Agent, and then faded the replacement container in. At the captured enter boundary the card layer had `opacity: 0` and `transform: matrix(..., 18, 0)` while the panel underneath remained dark. This is the reported whole-stage black flash.
   - Evidence: `docs/qa/images/lyn-004-r18/11-before-next-concurrent-0.png`.
3. **Transition midpoint — P2 1.** Direction was represented by only 14–18px of displacement while opacity carried most of the perceived motion. The result read as a blink instead of a horizontal carousel.
   - Evidence: `docs/qa/images/lyn-004-r18/13-before-next-concurrent-55.png`.
4. **Previous and rapid input — P1 1 inherited.** Previous used the same full-layer fade in the opposite 14–18px direction. The reducer retained the latest requested target, but the visual layer still passed through the same zero-opacity boundary for every queued request.
   - Evidence: `docs/qa/images/lyn-004-r18/06-before-prev-start.png` through `10-before-prev-complete.png`; reducer/source audit in `src/modules/workbench/workbench-transition.ts` at the R17 fixed start.

## Root cause

- `workbench-transition.module.css` animated `opacity: 1 → 0` on both the entire stage group and the synchronized detail group during a 70ms exit.
- The state machine then changed `displayedId` before a 210ms `opacity: 0 → 1` enter. The frame where both old and replacement content were absent was deterministic, not an image-decoding race.
- Images were recreated only after the zero-opacity commit boundary, making cold image decoding more noticeable even though it was not the primary cause.

## Initial finding count

- P0: 0
- P1: 1 — deterministic whole-stage zero-opacity/black frame.
- P2: 1 — direction too weak to read as a carousel.
