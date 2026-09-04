# LYN-005-I3 R20 Role-asset Title and Rounded-card Design QA

## Source and normalization

- Source visual truth: fresh current-run captures `docs/qa/images/lyn-005-i3-role-rounding-r20/before/desktop-1452x604.png` and `before/mobile-390x844.png`, combined with the exact R20 annotation in `docs/qa/design-reference/lyn-005-i3-role-rounding-r20/annotation.md`.
- Implementation: `docs/qa/images/lyn-005-i3-role-rounding-r20/after/desktop-1452x604.png` and `after/mobile-390x844.png`.
- CSS viewports/output pixels: 1452×604 and 390×844, DPR/output density 1:1. State is the same `林月` focus card for full before/after comparison.
- Full comparison: `comparison/desktop-before-after.png` and `comparison/mobile-before-after.png`.
- Focused comparison: `comparison/desktop-title-focus.png` and `comparison/desktop-card-radius-focus.png`.

## Findings and comparison history

1. **P1 fixed — requested title/content mismatch.** Before used `每一个角色，都在这里继续生长。` across three visible lines. After uses the exact new sentence and two semantic spans without splitting punctuation or phrases.
2. **P1 fixed — square card family.** Before active/inactive article, image, and copy layers all computed to `0px`. After the article is 18px desktop / 14px mobile with `overflow:hidden`; image inherits the same radius and copy uses the matching lower corners.
3. **P2 fixed — shorter-title vertical hole risk.** The desktop/mobile intro envelopes remain 369/322px and distribute the shorter heading internally. Controls and section boundaries remain within subpixel tolerance of the baseline.
4. **Post-fix interaction pass.** A completed next-role transition retained the same active/inactive card/image/copy radius contract and updated the current accessible role. No transition, scale, offset, z-index, control, progress, autoplay, or reduced-motion token changed.

## Required fidelity surfaces

- **Fonts/typography:** existing landing display stack, weight 800, tracking, and antialiasing remain; only the allowed title size/leading changed to 39.204/45.085px desktop and 38/44.84px mobile.
- **Spacing/layout rhythm:** 625px desktop section is exact; mobile changes only 0.422px from subpixel rounding. Carousel bounds, role-card sizes, overlap, and downstream seam are unchanged.
- **Colors/tokens:** near-black surface, white type, lime kicker/active border, shadows, opacity tiers, and all state colors are unchanged.
- **Image quality:** existing raster sources, object positions, scales, and sharpness are unchanged. Parent clipping plus inherited image radius removes square corners without halos or edge bleed.
- **Copy/content:** exact new heading is present; old heading is absent. Description, role names, boundaries, controls, and counts are unchanged.
- **Interaction/accessibility:** previous/next, progress, side-card selection, polite current-role announcement, keyboard semantics, three-second autoplay, pause rules, and reduced motion remain covered by live checks and existing tests.

## Result

- Focused landing tests: 2 files / 18 tests passed.
- Full Vitest: 93 files / 471 tests passed.
- ESLint, TypeScript, production build (19 pages), OpenSpec strict 37/37, and `git diff --check` passed.
- Preview remains on PID 75472 at `*:3002`; local/LAN HTTP checks return 200.

P0 = 0, P1 = 0, P2 = 0.

final result: passed
