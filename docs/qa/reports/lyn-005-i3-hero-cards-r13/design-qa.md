# LYN-005-I3 R13 independent Hero-card design QA

## Evidence

- Reference: `docs/qa/design-reference/lyn-005-i3-hero-cards-r13/reference.png`.
- Before/after: `docs/qa/images/lyn-005-i3-hero-cards-r13/before/` and `after/`.
- Same-canvas boards: `docs/qa/images/lyn-005-i3-hero-cards-r13/comparison/reference-vs-r13-stage.png`, `r12-before-vs-r13-after-desktop.png`, and `r12-before-vs-r13-after-mobile.png`.
- Slot and computed bounding-box evidence: `visual-measurement.md` in this directory.

## Findings

1. **P1 fixed — runtime was one composite image.** The Hero now renders twelve `data-hero-role-card` containers, each with its own Next Image node and one of the five existing R9 raster sources. Runtime contains no `hero-role-collage-r12` reference or sprite/canvas/mask substitute.
2. **P1 fixed — raw percentage widths expanded after projection.** Slot widths were calibrated against the browser bounding boxes. The main visible card is now `450.4 × 446.9px`, while the surrounding visible envelopes match the reference's 17–26% bands.
3. **P1 fixed — independent cards could drift into conflicting transforms.** Every card inherits the exact same two-dimensional `skewX(-10deg) rotateZ(2deg)` token. There is no 3D parent plane or card-specific angle.
4. **P2 fixed — mobile could regress to a single crop.** All twelve nodes remain in the mobile DOM and six representative independent cards are displayed in the lower Hero composition; no composite fallback exists.
5. **P2 fixed — asset repetition could flatten depth.** Per-slot crop/scale, three restrained brightness tiers, explicit z-index values, shared outline/radius, and neutral shadow preserve overlap and hierarchy while keeping the temporary R9 asset reuse obvious as brand examples.

## Browser results

- Desktop: 1440/1440 document/client width; Hero 820px; 12 cards; one main; zero composite references.
- Mobile: 390/390 document/client width; Hero 760px; 12 cards in DOM, six visible; no horizontal overflow.
- Page title: `AgentHub｜让一个想法，长成一个 Agent`.
- A fresh final 1440×1000 in-app-browser tab reported console errors 0 and warnings 0. Navigation and the Hero CTA performed their real smooth-scroll behavior; role-assets landed at the header offset and create intent reached the page's maximum scroll boundary.
- The latest homepage remains the marked deliverable in the in-app browser.

## Automated gates

- Targeted landing contracts: 17/17 passed.
- Full Vitest: 93 files / 470 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed (Next.js 15.5.20, 19 static pages generated).
- `openspec validate --all --strict`: 37/37 passed.
- `git diff --check`: passed.

## Final severity

- P0: 0
- P1: 0
- P2: 0
- P3: 0 for this frozen Hero-card scope

final result: passed
