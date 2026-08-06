# LYN-004-R17 Current-State Audit

## Surface and evidence

- Surface: `/assets/[agentId]/memory` inside the Agent Asset workspace.
- Capture mode: isolated Demo on `127.0.0.1:3013`; the unchanged Live backend currently blocks `/assets` with HTTP 404.
- Partial-data state: `docs/qa/images/lyn-004-r17/03-before-partial-visible-default.png`.
- No-sample state: `docs/qa/images/lyn-004-r17/02-before-empty-visible-default.png`.
- Initial full capture: `docs/qa/images/lyn-004-r17/01-before-full-default.png`.

## Numbered audit steps

1. Opened Agent 32 memory status and captured the default partial-data state.
2. Measured every visible `main` descendant with a high-luminance computed background and excluded the lime Refresh CTA because it is the unchanged primary action.
3. Opened Agent 19 memory status and confirmed the same channel icon surfaces in the no-sample state.
4. Located each rendered residue in the page-owned `memory-operations-workspace.tsx`; no shared component or global token change is required.

## Confirmed findings and call sites

### P1 — partial/stale feedback notice

- Rendered state: partial-data notice, 1133 × 51px at the default Browser viewport.
- Computed pairing: background `rgb(255, 251, 235)`, border `rgb(253, 230, 138)`, foreground `rgb(146, 64, 14)`.
- Call sites: the `stale` and `query.data.partial` status branches in `MemoryOperationsWorkspace`.
- Finding: text is readable, but the large near-white semantic surface visually interrupts the dark page and outweighs surrounding operational panels.

### P2 — channel icon and availability surfaces

- Relationship: `rgb(238, 242, 255)` background with `rgb(67, 56, 202)` foreground.
- Emotion: `rgb(236, 254, 255)` background with `rgb(14, 116, 144)` foreground.
- Activity: `rgb(255, 251, 235)` background with `rgb(180, 83, 9)` foreground.
- Unavailable badges: `rgb(241, 245, 249)` background with `rgb(71, 85, 105)` foreground.
- Call sites: `summaryToneClass`, `CoverageLane` icon/availability pills, and `ScorePanel` icon surfaces.
- Finding: each 24–36px surface retains acceptable isolated text/icon contrast, but repeated light-theme fills create a scattered flash-card effect in the dark hierarchy.

## Explicitly excluded

- Refresh CTA and primary lime branding.
- Ordinary panels, distributions, progress geometry, page layout, and copy.
- `MemoryAnalyticsErrorPanel` icon treatment because the current safe Browser states did not reproduce it; R17 does not change unobserved states by source inspection alone.
- Shared status classes and global theme tokens.

Initial findings: P0 = 0, P1 = 1, P2 = 1.
