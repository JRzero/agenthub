# LYN-005-I3 R11 completion report

## Outcome

The Hero now uses the requested two-level 3D transform language. The dense reused-raster
wall sits on one subtly pitched/yawed parent plane; the enlarged focal card inherits
that plane, rises `72px` on Z, and uses restrained local X/Y/Z rotations so its upper
right corner lifts toward the viewer. R10's short `440 × 622px / 6deg` focal geometry
is replaced by `530 × 730px` inside the unchanged desktop Hero.

## R11 implementation files

- `src/modules/landing/public-landing-page.tsx`
  - adds the semantic shared wall-plane wrapper;
  - keeps all eleven existing card nodes and images;
  - updates only the focal image size hint.
- `src/modules/landing/public-landing-page.module.css`
  - adds the true perspective stage and preserved parent plane;
  - applies focal `translateZ` and local upper-right lift;
  - replaces the flattening mask with a neutral overlay;
  - reduces the same hierarchy for mobile.
- `src/modules/landing/public-landing-page.test.tsx`
  - contracts the shared plane node without changing page behavior assertions.
- `src/modules/landing/public-landing-typography.test.ts`
  - contracts desktop/mobile perspective, plane transforms, focal geometry, and the
    absence of the obsolete flat 6deg transform.
- `openspec/changes/add-agenthub-public-site/`
  - records decision 22, task group 16, and the preserved two-level 3D requirement.
- `docs/qa/design-reference/lyn-005-i3-hero-main-r11/`,
  `docs/qa/images/lyn-005-i3-hero-main-r11/`, and this report directory
  - preserve source, before/after, iteration, measurement, and same-canvas evidence.

## Frozen surfaces

No role image was generated or replaced. The ten background slots and content/count,
left copy, navigation, CTA, Hero `820/760px` heights, role carousel, five-stage flow,
scenarios, creation-intent handoff, Footer, auth, workspace, APIs, dependencies, lockfile,
and project configuration remain unchanged.

## Exact before/after geometry

| Metric | R10 before | R11 final |
| --- | ---: | ---: |
| desktop CSS card | 440 × 622 | 530 × 730 |
| desktop CSS angle/depth | flat 6deg | parent X 3.2 / Y -4.2 / Z 3.6; local Z +72 / X -4 / Y -1.8 / Z 2.4 |
| transformed bounds | 502.61 × 664.59 | 620.82 × 812.03 |
| top within Hero | 52.71px | 3.86px |
| lower gap within Hero | 102.71px | 4.10px |
| mobile local depth | none | translateZ 36px |

The full matrices, projected corners, and measurement method are in
`measurement-before.md`. The reference/final focal comparison is
`comparison/reference-vs-r11-main-focus.png`.

## Verification

- Targeted tests: 17/17 passed.
- Lint and typecheck passed.
- Full Vitest: 93 files / 470 tests passed.
- Production build passed.
- OpenSpec strict: 37/37 passed.
- `git diff --check` passed.
- Browser: 1440×1000 and 390×844 evidence, no horizontal overflow, title correct,
  Hero CTA reached the real `#create` handoff, console errors 0.
- Preview remains local only on port 3002; no commit, push, merge, deployment, API,
  authentication, dependency, or configuration change was made.

P0 = 0, P1 = 0, P2 = 0.

final result: passed
