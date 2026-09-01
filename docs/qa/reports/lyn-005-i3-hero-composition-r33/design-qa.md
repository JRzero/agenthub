# LYN-005-I3 R33 Design QA

## Scope and truth

R33 changes only the public landing Hero role wall. The R32 image batch is retained without regeneration or replacement. The accepted 1449 × 1086 composite reference supplies geometry only; production continues to render twelve independent image/card nodes.

The original temporary reference path was unavailable at R33 start. `source-reference.png` is the repository-stable byte-identical accepted copy (SHA-256 `741993a63d94f1a42778041bbae58d413890aa8b501d7863f88164853048f4b7`).

## Two-pass review

### Pass 0 — R32 baseline

- P1: main wrapper 420.92 × 616.60 px (0.683 width/height) read as an isolated tall poster.
- P1: supporting cards were undersized within a full-width 1429 × 900 stage, leaving discontinuous black holes.
- P2: 1.5°/2°/2.5° tone rotations weakened the common directional language.
- P2: safe-area-rich R32 portraits appeared small inside their frames.

### Pass 1

- Reintroduced the source 1449:1086 design plane, sized to 80vw and vertically centered.
- Expanded supporting slots into three overlapping tracks and raised per-card uniform subject scale.
- Unified all position layers to 2° and reduced the counter-shear pair to ±8° desktop / ±5° mobile.
- Remaining P2: the first-pass main wrapper was 431.94 × 514.93 at top 15% / left 54%, still slightly taller and higher than the source hierarchy.

### Pass 2 — final

- Main moved to top 18% / left 53% and changed to 38% × 56%, yielding 454.36 × 498.48 at 1440 × 900.
- Mobile main changed to top 18% / left 56% / 40% × 58%, yielding 224.06 × 242.13 while remaining safely clipped by the Hero.
- Source/R32/final, fresh-baseline/pass1/pass2, wall-focus and mobile boards were opened and inspected together. P0/P1/P2 are 0/0/0.

## Final slot and framing table

| Slot | Desktop top/left/width/height | Subject scale / X / Y | Mobile |
| --- | --- | --- | --- |
| top-strategist | -5 / 33 / 24 / 32% | 1.16 / 0 / +4% | hidden |
| top-anime | -5 / 55 / 24 / 32% | 1.14 / 0 / +3% | -3 / 55 / 27 / 32% |
| top-support | -5 / 77 / 23 / 32% | 1.16 / 0 / +3% | hidden |
| mid-expert | 25 / 27 / 18 / 31% | 1.14 / 0 / +2% | 28 / 29 / 22 / 36% |
| mid-fantasy | 25 / 43 / 18 / 31% | 1.10 / 0 / +1% | 29 / 48 / 22 / 36% |
| mid-right-partial | 26 / 89 / 19 / 31% | 1.14 / -1 / +2% | hidden |
| bottom-robot | 67 / 23 / 19 / 34% | 1.06 / 0 / +2% | 68 / 27 / 24 / 40% |
| bottom-companion | 67 / 40 / 17 / 34% | 1.02 / 0 / +2% | 68 / 47 / 22 / 40% |
| bottom-operator | 74 / 54 / 23 / 33% | 1.14 / 0 / +1% | hidden |
| bottom-fantasy | 76 / 74 / 25 / 34% | 1.04 / 0 / +1% | 70 / 80 / 26 / 42% |
| right-mid-fantasy | 59 / 88 / 19 / 30% | 1.14 / -1 / +2% | hidden |
| main | 18 / 53 / 38 / 56% | 1.00 / 0 / -1% | 18 / 56 / 40 / 58% |

## Matrix, runtime and interaction proof

- Every composed card → frame → image → subject matrix is orthogonal and equal-axis. Desktop maximum absolute dot product is approximately `3.19e-7`; mobile is approximately `8.17e-8`.
- Desktop image load: 12/12. Mobile visible image load: 7/7. Failures: 0.
- Browser document scroll width is 1429 within a 1440 viewport and 379 within a 390 viewport; page overflow is zero.
- Browser console errors: 0. Development-only Fast Refresh information/warning entries occurred while editing and are not runtime application errors.
- Navigation hrefs and the CTA `/login?next=%2Fassets%2Fcreate` are unchanged.

## Evidence

- Full source / R32 / R33 board: `docs/qa/images/lyn-005-i3-hero-composition-r33/comparison/source-r32-r33-full-wall.png`
- Fresh baseline / pass 1 / pass 2: `comparison/before-pass1-pass2.png`
- Main adjacency focus: `comparison/main-adjacency-focus.png`
- Supporting-track density focus: `comparison/supporting-density-focus.png`
- Mobile two-pass board: `comparison/mobile-before-pass1-pass2.png`
- Browser geometry and matrix JSON: `docs/qa/reports/lyn-005-i3-hero-composition-r33/final-desktop-metrics.json` and `final-mobile-metrics.json`

## Gates

- Focused Vitest: 20/20 passed.
- Full Vitest: 93 files / 473 tests passed.
- ESLint: passed.
- TypeScript: passed.
- Production build: passed, 19 static/dynamic routes generated.
- OpenSpec strict: 37/37 passed.
- `git diff --check`: passed.
- Preview: PID 34007 listening on `*:3002`; localhost and `192.168.0.14` both return HTTP 200.

final result: passed
