# LYN-005-I3 R31 Hero supporting-card framing QA

## Source and normalization

- Source visual truth: fresh R30 current-state screenshots at `docs/qa/images/lyn-005-i3-hero-supporting-framing-r31/before/desktop-1440x900.png` and `before/mobile-390x844.png`.
- Rendered implementation: corresponding final screenshots under `after/`.
- CSS viewports: 1440×900 and 390×844, device scale 1.
- In-app Browser bitmap output was 1429×893 and 379×820 because of browser content insets. Full-view comparison boards normalize both sides to the requested CSS sizes before comparison; no finding is based on the inset difference.
- State: `#top`, initial Hero state, no hover/focus overlay.

## Implementation result

- Frame compensation is now fixed and independent: desktop `skewX(9deg) scale(1.04)`, mobile `skewX(6deg) scale(1.04)`.
- Supporting images use `object-fit: contain` on the existing black image plane, then a per-card `translate(x,y) scale(s)` token. The main alone retains `object-fit: cover` and the exact R30 `0.92 / 0 / -8%` framing.
- No derived assets were required. All existing sources already included adequate black/dark safety canvas once the framework fill stopped controlling subject scale.

## Final per-card framing

| Slot | Scale | Offset X | Offset Y | Final visual result |
| --- | ---: | ---: | ---: | --- |
| `top-strategist` | 0.88 | 0% | +6% | ≈78–81% subject height; more face and collar remain visible below the intentional top crop. |
| `top-anime` | 0.86 | 0% | +5% | ≈76–80%; hair, headset and shoulder outline retain space on desktop/mobile. |
| `top-support` | 0.87 | 0% | +5% | ≈77–81%; headset and cheek no longer meet the frame. |
| `mid-expert` | 0.86 | 0% | +1% | ≈76–79%; full hair, face and upper torso read as one portrait. |
| `mid-fantasy` | 0.92 | 0% | +1% | ≈79–82%; hood, backpack and hands remain legible without becoming too small. |
| `mid-right-partial` | 0.86 | -4% | 0% | ≈76–80%; subject moves into the real visible sliver while card position stays frozen. |
| `bottom-robot` | 0.84 | 0% | 0% | ≈78–81%; helmet remains circular with side clearance and more neck hardware. |
| `bottom-companion` | 0.82 | 0% | 0% | ≈80–82%; both ears, muzzle, neck and vest stay continuous. |
| `bottom-operator` | 0.86 | 0% | -3% | ≈76–80%; face moves into the lower-row viewport exposure with more shoulder context. |
| `bottom-fantasy` | 0.86 | 0% | -2% | ≈76–80%; hair and shoulder silhouette are visible in the bottom crop. |
| `right-mid-fantasy` | 0.84 | -3% | 0% | ≈78–81%; face and jacket move inward from the right clipping boundary. |
| `main` | 0.92 | 0% | -8% | R30 unchanged. |

## Required fidelity surfaces

- **Typography/copy:** frozen; comparison shows no wrap, weight or baseline change.
- **Spacing/layout:** every card slot, frame bbox, overlap, radius, shadow, z-index and left text safe area are unchanged. Only raster framing changes.
- **Colors/tokens:** existing black/lime palette, supporting-card brightness tiers and card borders are unchanged. The contained-image safety surface is exact black and does not create a visible seam against the supplied dark sources.
- **Image quality:** all twelve images load; supporting subjects are shown with more of their native canvas. No resampling asset, stretched axis, generated identity or replacement image was introduced.
- **Copy/content:** unchanged.
- **Responsiveness:** desktop keeps all twelve cards; mobile keeps the same seven cards (`top-anime`, `mid-expert`, `mid-fantasy`, `bottom-robot`, `bottom-companion`, `bottom-fantasy`, `main`). Both have 0px horizontal overflow.
- **Accessibility/behavior:** decorative semantics, pointer behavior, navigation and CTA are unchanged. Console errors are zero.

## Matrix proof

- Desktop maximum composed axis-length delta: `1.82e-13`; maximum absolute axis dot product: `5.64e-7`.
- Mobile visible-card maximum axis-length delta: `1.14e-14`; maximum absolute axis dot product: `1.41e-7`.
- The composed position → frame skew → counter-skew → subject transform is therefore equal-axis and orthogonal to browser precision. Subjects contain no residual shear or non-uniform scaling.

## Comparison history

1. **R30 baseline:** eleven supporting cards had P2 oversized-subject/crop findings; main card was healthy.
2. **R31 pass 1:** separated framework and subject transforms, restored full silhouettes and eliminated the common tight crop. Top-row and viewport-edge focal points still needed small P2 translations.
3. **R31 final:** top row moved down 5–6%; right-edge subjects moved left 3–4%; lower-row people moved up 2–3%. Full wall and focused comparison show consistent 70–82% portrait density with intentional wall-edge clipping only.

## Evidence

- Full desktop wall: `docs/qa/images/lyn-005-i3-hero-supporting-framing-r31/comparison/desktop-full-wall-before-after.png`
- Supporting-card focus: `docs/qa/images/lyn-005-i3-hero-supporting-framing-r31/comparison/supporting-cards-before-after.png`
- Mobile: `docs/qa/images/lyn-005-i3-hero-supporting-framing-r31/comparison/mobile-before-after.png`
- Source contact sheet: `docs/qa/design-reference/lyn-005-i3-hero-supporting-framing-r31/supporting-source-contact-sheet.png`
- Browser metrics: `docs/qa/reports/lyn-005-i3-hero-supporting-framing-r31/final-metrics.json`

## Findings

- P0: 0
- P1: 0
- P2: 0
- Residual P3: none required for this scoped pass.

final result: passed
