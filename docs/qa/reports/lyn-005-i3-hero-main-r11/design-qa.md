# LYN-005-I3 R11 Hero focal-card two-level 3D design QA

## Scope and visual truth

- Scope is limited to the Hero card-wall transform hierarchy, focal-card geometry, the
  neutral copy-protection overlay, corresponding contracts, OpenSpec, and R11 evidence.
- Left copy, navigation, CTA, ten background slots and their imagery, Hero `820/760px`
  heights, role assets, product flow, scenarios, intent handoff, and Footer are frozen.
- Sole visual reference:
  `docs/qa/design-reference/lyn-005-i3-hero-main-r11/reference.png`
  (`3022 × 1488`).
- Fresh R10 baseline:
  `docs/qa/images/lyn-005-i3-hero-main-r11/before/desktop-1440x1000.png`
  and `before/mobile-390x844.png`.
- Final implementation:
  `docs/qa/images/lyn-005-i3-hero-main-r11/after/desktop-1440x1000.png`
  and `after/mobile-390x844.png`.
- Captures are exact CSS/output viewports at DPR 1.

## Measured geometry

The original source edges measure about `5.65deg` clockwise at the top, `4.70deg`
at the bottom, and `16–17deg` of perspective lean on the sides. Approximate source
corners are `(1856,84)`, `(2731,170)`, `(2430,1199)`, and `(1533,1125)`. Full method
and browser matrices are recorded in `measurement-before.md`.

R10 used a `440 × 622px` card at a flat `6deg`, with a transformed height of
`664.59px` and a `102.71px` lower gap inside the Hero. R11 uses a `530 × 730px` CSS
card, equal to `89.0%` of the `820px` Hero height. Its final transformed rect is
approximately `620.82 × 812.03px`, with the top at y≈29.86 and the bottom at
y≈841.90 against the Hero's y=26…846 envelope.

## Transform hierarchy and four-corner result

1. Perspective stage: `1800px`, origin `70% 48%`, `preserve-3d`.
2. Shared parent plane: `rotateX(3.2deg) rotateY(-4.2deg) rotateZ(3.6deg)`,
   `preserve-3d`.
3. Focal local transform: `translateZ(72px) rotateX(-4deg) rotateY(-1.8deg)
   rotateZ(2.4deg)`, `preserve-3d`.

The ten background slots remain on the shared parent plane and do not receive
conflicting card-local rotations. The former mask was replaced by a neutral overlay
outside the 3D subtree so the parent/child transform chain does not flatten. The focal
shadow is black and falls below/left (`-22px 38px 94px`); there is no colored halo.

Projected focal corners are:

| Corner | x | y | projected z |
| --- | ---: | ---: | ---: |
| top-left | 754.868 | 29.873 | 51.079 |
| top-right | 1304.420 | 73.635 | 107.732 |
| bottom-right | 1225.379 | 841.914 | 90.970 |
| bottom-left | 683.580 | 773.917 | 34.317 |

The top-right is the nearest point, confirming the requested light upper-right lift.
The visible top/bottom edge angles are approximately `4.55deg / 7.15deg`; the
left/right side lean is approximately `5.47deg / 5.87deg` from vertical. The result
reads as a subtly pitched webpage plane plus a floating focal card, not as an extreme
standalone `rotateY` trapezoid.

## Iteration history

1. R10 baseline — P1: focal card too short and uniformly rotated; bottom void remained.
2. R11 flat pass — superseded: `520 × 730px / 3.8deg` fixed scale but did not implement
   the user-specified parent-plane/local-lift language.
3. First 3D pass — P2: local X counter-pitch was insufficient, making bottom-right
   closer than top-right.
4. Final pass — local X is `-4deg`; top-right now has the greatest projected z, card
   height stays visually above 800px, and copy/navigation safety remains intact.

Iteration files remain in `after/desktop-pass1-1440x1000.png`,
`after/desktop-3d-pass1-1440x1000.png`, and `after/mobile-3d-pass1-390x844.png`.

## Same-canvas comparison

- Reference vs final focal geometry:
  `docs/qa/images/lyn-005-i3-hero-main-r11/comparison/reference-vs-r11-main-focus.png`.
- R10 vs R11 full desktop:
  `docs/qa/images/lyn-005-i3-hero-main-r11/comparison/r10-vs-r11-desktop.png`.
- R10 vs R11 focal crop:
  `docs/qa/images/lyn-005-i3-hero-main-r11/comparison/r10-vs-r11-main-focus.png`.
- R10 vs R11 mobile:
  `docs/qa/images/lyn-005-i3-hero-main-r11/comparison/r10-vs-r11-mobile.png`.

Combined review passes shape, relative scale, axis, occlusion, crop, luminance,
upper-right lift, and copy-field safety. Final findings: P0 = 0, P1 = 0, P2 = 0.

## Responsive, interaction, and accessibility-risk checks

- Desktop: `1440/1440` document/client width; no horizontal overflow.
- Mobile: `390/390` document/client width; one focal plus four retained backgrounds,
  reduced `1100px` perspective and `36px` Z lift, no horizontal overflow.
- Mobile Hero CTA retained focus after activating and reached `#create`; the desktop
  navigation/CTA routes and labels remain contract-covered and unchanged.
- Application-browser title is `AgentHub｜让一个想法，长成一个 Agent`; console
  errors are `0` after the interaction checks.
- No continuous motion was added. Existing `prefers-reduced-motion` behavior and all
  downstream interactions remain unchanged.
- Visible focus, text contrast, copy line breaks, image crop, navigation legibility,
  and CTA hit area remain healthy in both final captures.
- Evidence limit: `getBoxQuads()` is unavailable in the application browser, so the
  four corners were reconstructed from computed `matrix3d`, transform origins, and
  perspective, then checked against the DOM bounding rect.

## Automated gates

- Targeted landing contracts: 2 files / 17 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 93 files / 470 tests passed.
- `npm run build`: passed; 19 static pages generated.
- `openspec validate --all --strict`: 37/37 passed.
- `git diff --check`: passed.

final result: passed
