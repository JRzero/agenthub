# LYN-005-I3 R32 Hero Role Refresh — Design QA

## Comparison target

- Source visual truth: the twelve user-approved generated PNGs listed in the R32 task; normalized contact sheet: `docs/qa/design-reference/lyn-005-i3-hero-role-refresh-r32/r32-source-contact-sheet.png` (`996 × 1104`).
- Runtime assets: `public/images/agenthub-site/hero-roles-r32/*.webp`, twelve independent 1024 × 1536 rasters.
- Implementation captures:
  - `docs/qa/images/lyn-005-i3-hero-role-refresh-r32/after/desktop-1440x900.png`
  - `docs/qa/images/lyn-005-i3-hero-role-refresh-r32/after/mobile-390x844.png`
- CSS viewports: 1440 × 900 and 390 × 844, device scale factor 1. In-app Browser screenshots contain 1429 × 893 and 379 × 820 content pixels because of the browser surface inset; before/after comparisons use the same surface and crop.
- State: anonymous landing page at `#top`, static Hero, default motion preference.

## Full-view and focused evidence

- Desktop full wall: `docs/qa/images/lyn-005-i3-hero-role-refresh-r32/comparison/desktop-full-wall-before-after.png` (R31 left, R32 right).
- Main card: `docs/qa/images/lyn-005-i3-hero-role-refresh-r32/comparison/main-card-before-after.png`.
- Supporting cards: `docs/qa/images/lyn-005-i3-hero-role-refresh-r32/comparison/supporting-cards-before-after.png`.
- Mobile: `docs/qa/images/lyn-005-i3-hero-role-refresh-r32/comparison/mobile-before-after.png`.
- Source batch against final wall: `docs/qa/images/lyn-005-i3-hero-role-refresh-r32/comparison/source-assets-final-wall.png`.

## Comparison history

### Pass 0 — R31 baseline

- [P1][Image fidelity] The wall mixed legacy realism, anime and prior generated identities; its subjects were not the newly approved R32 cast.
- [P2][Visual system] Lighting, black-background treatment and subject-safe margins varied noticeably between cards.
- Fix: replaced all twelve Hero sources and the four proof avatars with the approved batch; preserved every card slot, size, radius, z-order and transform; recalibrated framing from the new native canvases instead of inheriting R31 values.

### Pass 1 — R32

- Main retains headroom, side space and a readable upper-body silhouette without looking undersized.
- Strategist, host, service partner, researcher, storyteller, architect, analyst, guardian and curator retain hair, shoulders and devices.
- Robot antennae and body outline, companion ears and harness remain complete.
- No actionable P0/P1/P2 findings remain.

## Final framing contract

| Slot | Asset | Scale | X | Y |
| --- | --- | ---: | ---: | ---: |
| main | `hero-main-r32.webp` | 1.00 | 0% | -1% |
| top-strategist | `hero-system-strategist-r32.webp` | 1.00 | 0% | +1% |
| top-anime | `hero-game-content-host-r32.webp` | 1.00 | 0% | +1% |
| top-support | `hero-service-experience-partner-r32.webp` | 1.00 | 0% | +1% |
| mid-expert | `hero-senior-research-advisor-r32.webp` | 1.00 | 0% | 0% |
| mid-fantasy | `hero-fantasy-storyteller-r32.webp` | 1.00 | 0% | 0% |
| mid-right-partial | `hero-game-system-architect-r32.webp` | 1.00 | -1% | 0% |
| bottom-robot | `hero-robot-tester-r32.webp` | .96 | 0% | 0% |
| bottom-companion | `hero-exploration-companion-r32.webp` | .96 | 0% | 0% |
| bottom-operator | `hero-operations-analyst-r32.webp` | 1.00 | 0% | -1% |
| bottom-fantasy | `hero-silver-world-guardian-r32.webp` | 1.00 | 0% | -1% |
| right-mid-fantasy | `hero-digital-content-curator-r32.webp` | 1.00 | -1% | 0% |

The frame/image counter-skew remains desktop -9°/+9° and mobile -6°/+6°. Framework overscan stays at 1.04. Subject transforms use only equal-axis scale plus translation.

## Required fidelity surfaces

- Fonts and typography: unchanged from R31; Hero wrapping, hierarchy and navigation baselines remain stable.
- Spacing and layout rhythm: all card boxes, wall coordinates, overlap, radius and Hero dimensions are unchanged.
- Colors and tokens: the approved batch shares true black backgrounds, purple-blue/warm rim light and restrained lime details; existing border/opacity tokens remain unchanged.
- Image quality: WebP quality 90, full 1024 × 1536 resolution, no resampling or non-uniform stretching. Output sizes are 75,186–214,260 bytes.
- Copy/content: unchanged. The Hero wall remains decorative (`alt=""`), and the proof text keeps the example/live boundary.
- Accessibility/behavior: CTA path and keyboard behavior are unchanged; no new motion or interactive layer was introduced.
- Responsive: desktop loads all twelve cards; mobile displays the existing seven-card subset, with six visible in the 844px capture. Horizontal overflow is zero.

## Runtime evidence

- Desktop: 12/12 images loaded; max composed axis delta `1.97e-13`, max absolute axis dot `6.66e-7`.
- Mobile: 7/7 displayed images loaded; max composed axis delta `1.23e-14`, max absolute axis dot `1.67e-7`.
- Browser console errors: 0.
- CTA: `/login?next=%2Fassets%2Fcreate`.
- Metrics: `final-desktop-metrics.json` and `final-mobile-metrics.json` in this report directory.

## Findings

- P0: 0
- P1: 0
- P2: 0

## Implementation checklist

- [x] Twelve stable WebP assets added without deleting legacy assets.
- [x] All Hero slots and four proof avatars remapped.
- [x] Per-card scale/offset contract updated and tested.
- [x] Desktop/mobile comparison boards reviewed.
- [x] Focused tests, lint, typecheck, build, OpenSpec strict and diff check passed.

final result: passed
