# LYN-004-R10 current-state audit

## Scope and evidence boundary

- Code identity: R9 fixed start `cf9ac97474152ed147857d24053e6a2e77b84e4d` / tree `425b49a09cd2ecc9c5b8dffca74066afa49d22ac`.
- Route and state: `/assets`, card view, isolated repository Demo fixture because the Live browser had no authenticated session.
- Browser: Codex in-app Browser; measurements are CSS pixels at the stated viewport widths.
- Source truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/25-agent-library-four-column-feedback.png` and `23-agent-library-reference-final.png`.

## Numbered audit steps

1. Opened the R9 `/assets` card view with the existing non-sensitive Demo fixture.
2. Set the viewport to 1536, 1680, 1920, and 2254 CSS pixels without changing page content or browser storage.
3. Measured `main`, `[data-testid="asset-library"]`, the card grid, the first card, computed grid tracks/gap, and document/grid overflow.
4. Captured a full-page screenshot at each viewport before editing the grid breakpoint.

## Measurements

| Viewport | Shell | Content/grid | Columns | Card width | Gap | Document overflow | Grid overflow | Evidence |
| ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1536 | 1536 | 1280 | 3 | 416 | 16 | no | no | `docs/qa/images/lyn-004-r10/r9-before-assets-1536.png` |
| 1680 | 1680 | 1424 | 3 | 464 | 16 | no | no | `docs/qa/images/lyn-004-r10/r9-before-assets-1680.png` |
| 1920 | 1920 | 1664 | 4 | 404 | 16 | no | no | `docs/qa/images/lyn-004-r10/r9-before-assets-1920.png` |
| 2254 | 2254 | 1704 | 4 | 414 | 16 | no | no | `docs/qa/images/lyn-004-r10/r9-before-assets-2254.png` |

## Findings

- **P1 — Four-column desktop density starts too late.** At 1536 and 1680 the current grid remains three columns, while the approved feedback requires four cards per row on common wide desktops. The existing 1280 three-column layout yields about 331px per card; using four columns at 1536 yields about 308px per card, which remains within the existing readable range and does not require typography or content changes.
- **P0:** none.
- **P2:** none beyond the P1 breakpoint mismatch.

## Intended minimal correction

Move only the `/assets` card-grid four-column breakpoint from 1800px to 1536px. Keep 1440 at three columns, retain the existing 1180px three-column threshold, 768px two-column threshold, single-column narrow layout, 16px gap, fixed card height, content structure, image treatment, data, and interactions.
