# LYN-005-I3 R10 Hero card-wall completion report

## Scope

Only `PublicLandingPage` Hero figure markup, its scoped CSS geometry, related contracts, OpenSpec notes and R10 QA evidence changed. Hero copy, navigation, CTA, fixed desktop/mobile heights and all downstream sections were frozen.

## Files and assets

- Implementation: `src/modules/landing/public-landing-page.tsx`, `src/modules/landing/public-landing-page.module.css`.
- Contracts: `src/modules/landing/public-landing-page.test.tsx`, `src/modules/landing/public-landing-typography.test.ts`.
- OpenSpec: `openspec/changes/add-agenthub-public-site/design.md`, `tasks.md`, and `specs/agenthub-public-site/spec.md`.
- QA: root `design-qa.md`, aggregate I3 report, and `docs/qa/{design-reference,images,reports}/lyn-005-i3-hero-wall-r10/`.
- No raster asset was generated or modified. The wall reuses the five existing R9 character images across eleven crop/position slots.

## Geometry delivered

- Reference measurement: wall onset 25.15% viewport, 5–7° common clockwise axis, 18–36 px visual gaps, 30–34% focal width, 72–78% focal height, 26–32 px radii.
- Desktop implementation: full-Hero background layer, 11 positions, `rotate(6deg)`, focal 440 × 622 px, radii 28/30 px, brightness `.42/.70/.96`, and a neutral black readability mask.
- Mobile implementation: one 230 × 320 focal card plus four overlapping backgrounds; no document overflow.
- No `rotateY`, CSS perspective, green atmosphere or CSS halo remains in the Hero wall.

## Verification

- Focused landing tests: passed (17/17).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 93 files / 470 tests.
- `npm run build`: passed, 19 static pages generated.
- `openspec validate --all --strict`: passed, 37 changes / 0 failures.
- `git diff --check`: passed.
- In-app browser: 1440/1440 and 390/390 document/client widths, console errors 0, CTA scroll target and role-assets navigation operable.
- Preview: PID 75472, cwd is this Worktree, listening on `*:3002`; loopback and `192.168.0.14` both returned HTTP 200.
- Visual QA: same-canvas source/final and before/after comparisons reviewed; P0/P1/P2 = 0.

## Limits

- Character subjects are intentionally simulated with existing approved example rasters, as requested; repeated crops are not claims about distinct live assets.
- The source screenshot uses a wider aspect ratio than the frozen 1440 × 1000 product viewport. Comparison canvases normalize source width and include a separately cropped wall-focus panel; Hero height was not changed.

final result: passed
