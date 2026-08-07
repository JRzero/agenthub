# LYN-004-R12 Current-State Audit

Date: 2026-08-06

Route: `/assets` card view

Runtime: R11 production Live on `127.0.0.1:3002`, followed by an isolated same-origin Demo capture because the Live Agent request currently returns HTTP 404. No credentials or browser storage were inspected.

## Numbered evidence

1. **User Live feedback** — the supplied 2048×1024 raster shows three cards across despite a wide desktop window. This raster is visual evidence only; its physical pixel width is not treated as `window.innerWidth`.
   - Source: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-ab3f65b1-028d-4eb7-9d44-f185b23db90f.png`
2. **R11 Live runtime inspection** — current in-app Browser default viewport was `1280×720` CSS px at DPR 2. The production CSS contains both `@media (min-width: 1180px)` three-column and `@media (min-width: 1536px)` four-column rules, proving R10 was included in the production build. `/assets` itself was blocked by the existing real API HTTP 404 boundary.
3. **R11 isolated Demo, 1440 CSS px** — `window.innerWidth=1440`, content/grid width `1184px`, media 1180 matched, media 1536 did not match, computed grid `384px 384px 384px`, card `384×420px`, gap `16px`, document/grid overflow false.
   - Screenshot: `docs/qa/images/lyn-004-r12/01-before-assets-1440.png`
4. **R11 isolated Demo, 1536 CSS px** — content/grid width `1280px`, media 1536 matched, computed grid four columns of `308px`, card height `420px`, gap `16px`, overflow false.
   - Screenshot: `docs/qa/images/lyn-004-r12/02-before-assets-1536.png`
5. **Responsive baseline** — 1920/1680/1536 produced 4 columns at 404/344/308px; 1440/1280 produced 3 columns at 384/330.66px; 720 produced 1 column at 660.24px. No horizontal overflow was observed.

## Findings

- **P0: 0**
- **P1-01 — 1440 desktop misses the required four-column layout.** The R10 rule starts at viewport width 1536px even though the page shell removes 200px sidebar plus 56px horizontal padding. At 1440px the usable grid is still 1184px, which can support four readable 284px cards with the existing 16px gaps, but the current media query cannot activate. This directly explains the user-visible three-column regression at the newly accepted desktop width.
- **P2: 0**

## Scoped correction

Move only the `/assets` card-grid four-column threshold from 1536px to 1440px. Preserve the 1180px three-column threshold, 768px two-column threshold, one-column narrow layout, 16px gap, 420px fixed card height, content structure, typography, image crop, data, and all interactions.

## Evidence limits

The authenticated Live shell and production CSS were inspected, but the current Live Agent request returned HTTP 404, so real-data grid geometry could not be re-measured in that state. The supplied user Live screenshot remains the real-data visual evidence; deterministic grid geometry and responsive behavior are measured in the isolated Demo using the same compiled components and CSS.
