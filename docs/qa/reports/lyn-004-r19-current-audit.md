# LYN-004-R19 R18 Motion Baseline Audit

## Scope

- Route: isolated Demo `http://127.0.0.1:3013/workbench`.
- Viewport: 1440 × 900 CSS px; content client width 1429px.
- Fixed source: R18 commit `3840c26bd673289021c9af4b6bb70b2ceb5670ff`.
- Browser: Codex in-app Browser; no Live fixture fallback was introduced.

## Numbered baseline steps

1. **Start — healthy.** The stage was 877 × 522px, viewport 827px wide, stage opacity 1, and document overflow 0.
   - Evidence: `docs/qa/images/lyn-004-r19/01-r18-start.png`.
2. **Early movement — P2.** At an actual sampled elapsed time of about 70ms, R18 had already traversed 51.64% of the viewport. The animation was responsive but visually front-loaded.
   - Evidence: `docs/qa/images/lyn-004-r19/02-r18-early.png`; `r18-240ms-frame-metrics.json`.
3. **Midpoint — P2.** At about 100ms it had traversed 80.05%; by 130ms it was at 90.55%. Most visible travel therefore happened before the user could comfortably read the direction and card handoff.
   - Evidence: `docs/qa/images/lyn-004-r19/03-r18-mid.png`.
4. **Deceleration and completion — healthy but compressed.** R18 reached 97.55% around 171ms and 99.59% around 210ms, completing at its intended 240ms without overshoot, opacity loss, or geometry drift.
   - Evidence: `docs/qa/images/lyn-004-r19/04-r18-late.png`, `05-r18-complete.png`.

## Finding

- P0: 0
- P1: 0
- P2: 1 — the correct R18 ease-out trajectory is too compressed into the first 100–130ms, producing an abrupt perceived cadence.

