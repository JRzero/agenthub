# LYN-005-I3 R12 Hero supplied-composite design QA

## Comparison target

- Source visual truth:
  `docs/qa/design-reference/lyn-005-i3-hero-composite-r12/reference.png`
  (`1449 × 1086px`).
- Fresh pre-edit R11 baseline:
  `docs/qa/images/lyn-005-i3-hero-composite-r12/before/desktop-1440x1000.png`
  and `before/mobile-390x844.png`.
- Final browser implementation:
  `docs/qa/images/lyn-005-i3-hero-composite-r12/after/desktop-1440x1000.png`
  and `after/mobile-390x844.png`.
- State: anonymous public homepage at top, dark theme, no dialog or menu open.
- Captures use exact CSS/output viewports `1440 × 1000` and `390 × 844`, DPR 1.

## Findings and iteration history

- [P1 fixed] R11 interpreted the source as a reconstructed 3D wall. It rendered eleven
  DOM cards under perspective, parent X/Y/Z rotation, and a locally translated focal
  card. R12 removes every old slot/plane/focal node and all perspective, rotateX,
  rotateY, and translateZ rules.
- [P1 fixed] R11 used a tall `530 × 730px` focal poster. The source focal card is near
  square and already baked into the supplied raster. R12 no longer owns a separate
  focal-card geometry.
- [P2 fixed] R11 mobile composed five independently cropped cards. R12 mobile uses a
  dedicated crop of the same supplied composite, preserving its exact masonry and
  overlap.
- [P2 fixed] The first R12 browser pass used Next image optimization. The final pass
  uses the supplied file unoptimized so the visible raster is not recompressed or
  softened by the framework image pipeline.

Post-fix findings: P0 = 0, P1 = 0, P2 = 0.

## Geometry and same-canvas evidence

At `1440 × 1000`, the frozen Hero is x=30, y=26, `1380 × 820px`. The single raster is
right-aligned at x≈315.45, y=26 and renders at approximately `1094.55 × 820px`—the
expected contain-normalization of the 1449×1086 source. The source's black negative
field naturally extends the page background and the first readable cards begin around
page x≈620–650. The baked focal-card envelope lands approximately x≈882–1343 and
y≈181–634, close to the source-derived target without an independent DOM card.

At `390 × 844`, the frozen Hero remains `390 × 760px`. The same raster is `560 × 420px`
at x=-70, y=398, right=-100 relative to the viewport; Hero overflow crops it to the
main card and surrounding masonry while document/client widths remain `390/390`.

Comparison boards:

- Normalized source vs final rendered Hero right crop:
  `docs/qa/images/lyn-005-i3-hero-composite-r12/comparison/reference-vs-r12-right-crop.png`.
- R11 vs R12 desktop:
  `docs/qa/images/lyn-005-i3-hero-composite-r12/comparison/r11-vs-r12-desktop.png`.
- R11 vs R12 mobile:
  `docs/qa/images/lyn-005-i3-hero-composite-r12/comparison/r11-vs-r12-mobile.png`.

The focused source/final board confirms the same black-field proportion, focal-card
shape, three-row masonry, top/right/bottom crops, card spacing, radii, outline, shadow,
and two-dimensional oblique projection. The implementation side additionally contains
the intentionally frozen live navigation and left Hero copy over the raster's black
field.

## Required fidelity surfaces

- Fonts/typography: frozen Hero/system typography and exact line wrapping remain
  unchanged at desktop and mobile.
- Spacing/layout rhythm: Hero `820/760px`, copy position, navigation, CTA, following
  role section, and section seam remain unchanged. Only the right visual layer changed.
- Colors/tokens: the exact supplied black/charcoal/lime-adjacent raster palette is used;
  no CSS halo, gradient, extra shadow, or color filter was added.
- Image quality: the user-supplied PNG is copied byte-for-byte into the project and
  served unoptimized as one raster. No asset was regenerated and no existing R9 image
  file was deleted.
- Copy/content: Hero creator-first copy, navigation labels, CTA, routes, and all
  downstream content remain unchanged. The raster is decorative (`alt=""` and
  `aria-hidden="true"`) so it does not repeat the Hero message.

## Browser and interaction verification

- Desktop: navigation `创作流程` focused and scrolled to the live flow anchor;
  `开始创建` focused and reached `#create` with the section inside the viewport.
- Mobile: one Hero image, zero legacy wall slots, `390/390` document/client width.
- Title: `AgentHub｜让一个想法，长成一个 Agent`.
- Browser console errors: 0 at desktop and mobile.
- No motion was added; reduced-motion behavior and downstream interactions are frozen.

## Automated gates

- Targeted landing contracts: 2 files / 17 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 93 files / 470 tests passed.
- `npm run build`: passed; 19 static pages generated.
- `openspec validate --all --strict`: 37/37 passed.
- `git diff --check`: passed.

final result: passed
