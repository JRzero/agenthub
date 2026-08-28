# LYN-005-I3 R13 independent Hero-card completion

- Replaced R12's single decorative composite with a data-driven twelve-slot role-card array and twelve independent image/container nodes.
- Reused only the five existing R9 raster assets; no new character image was generated.
- Removed `public/images/agenthub-site/hero-role-collage-r12.png`. The supplied whole collage remains only under `docs/qa/design-reference/` for visual comparison.
- Desktop uses a 1449×1086 proportional stage scaled to `1094.09 × 820px`; every slot shares `skewX(-10deg) rotateZ(2deg)`. Mobile keeps the same independent-card language with six visible slots.
- Frozen surfaces were unchanged: Hero copy, navigation, CTA, 820/760 heights, role carousel, five-stage flow, scenarios, intent handoff, Footer, authentication, workspace, API, and dependencies.
- Contract tests assert 12 nodes, one main card, independent R9 sources, no runtime composite, and no perspective/rotateX/rotateY/translateZ.
- Visual evidence and detailed measurements live in the sibling reports and `docs/qa/images/lyn-005-i3-hero-cards-r13/`.
- Gates passed: targeted 17/17, full Vitest 93 files / 470 tests, lint, typecheck, production build, OpenSpec strict 37/37, and `git diff --check`.

final result: passed
