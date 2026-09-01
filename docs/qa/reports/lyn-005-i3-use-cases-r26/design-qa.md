# LYN-005-I3 R26 Design QA

Date: 2026-08-31
Surface: `PublicLandingPage` — `03 / USE CASES` image layer only

## Source and normalization

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-use-cases-r26/user-reference.png`, `2880 × 586` pixels.
- Desktop browser viewport: `1440 × 1000` CSS; implementation capture: `1429 × 992` pixels because the in-app browser reserves an 11px scrollbar gutter.
- Mobile browser viewport: `390 × 844` CSS; implementation capture: `379 × 820` pixels with the same browser chrome/gutter behavior.
- The source was normalized to `1440 × 293`; the implementation's exact `#scenarios` rectangle (`1429 × 282` at y=148) was cropped and resized proportionally to 1440px width for the same-canvas focus board.
- State: initial scene-card state, no authentication, default motion, first card hover additionally exercised after capture.

## Comparison evidence

- Source vs final desktop focus: `docs/qa/images/lyn-005-i3-use-cases-r26/comparison/reference-vs-after-desktop-focus.png`
- Desktop before vs after focus: `docs/qa/images/lyn-005-i3-use-cases-r26/comparison/before-vs-after-desktop-focus.png`
- Mobile before vs after: `docs/qa/images/lyn-005-i3-use-cases-r26/comparison/before-vs-after-mobile.png`
- Final captures: `docs/qa/images/lyn-005-i3-use-cases-r26/after/desktop-1440x1000.png` and `after/mobile-390x844.png`

## Findings and comparison history

### Pass 0 — source audit

- Existing layout, typography, lime numbering, 10px radius, 82px bottom copy band, and three-card rhythm already matched the approved screenshot and were frozen.
- Legacy source images were visibly softer and semantically less specific. The new independent-creator, team-collaboration, and operations scenes supplied the requested subject clarity without changing the card or copy geometry.
- The three source images are already approximately 1.70:1, close to the 1.712 desktop and 1.637 mobile card ratios, so no image stretching or perspective transform is needed.

### Pass 1 — passed

- Replaced only the three image paths and set focal positions to `50% 50%`, `50% 48%`, and `50% 50%`.
- Browser-rendered `naturalWidth × naturalHeight` is `475 × 279`, `475 × 278`, `475 × 278` on desktop and `390 × 229`, `390 × 228`, `390 × 228` on mobile. Every image retains `object-fit: cover`; card/image boxes remain equal at `342.33 × 200` desktop and `311 × 190` mobile.
- Independent creator keeps the artist and illuminated pen display visible; IP/content team centers all three collaborators plus the relationship map; operations keeps both operators and the monitoring screens above the copy band.
- Existing `brightness(.48) saturate(.55)` and the 82px `rgb(5 6 4 / 86%)` copy surface were intentionally left unchanged, preserving the approved contrast while the new images' built-in dark lower falloff prevents an extra black-mask effect.
- P0/P1/P2 = 0/0/0.

## Required fidelity surfaces

- **Fonts/copy:** unchanged; titles and one-line values remain complete and readable.
- **Spacing/layout:** section, cards, radii, grid, copy-band height, and responsive stacking are unchanged.
- **Colors/tokens:** existing near-black/lime palette and image filter are unchanged.
- **Image quality:** three native-resolution PNG sources were converted with repository-installed Sharp to WebP quality 90 / effort 6. Output dimensions are unchanged; visual inspection shows no focus loss or compression halo.
- **Copy/content:** `独立创作者`, `IP / 内容团队`, `Agent 运营团队` and their approved descriptions are unchanged.
- **Interaction/accessibility:** navigation to `#scenarios`, hover treatment, semantic articles, and decorative empty image alt remain unchanged.
- **Responsiveness:** desktop and mobile document overflow are zero; no face, screen, or key subject is clipped by the card edge or copy surface.

## Verification

- Focused landing tests cover exact WebP source and focal-position mapping and reject all three legacy sources.
- In-app browser: all three images loaded, actual `#scenarios` navigation landed at the section, hover state rendered, 1440/390 horizontal overflow is zero, and no visible runtime error overlay appeared.
- Command gates and local HTTP results are recorded in the completion report.

## Residual limits

- The final imagery intentionally differs from the old screenshot's subjects because R26 explicitly replaces those assets; the same-canvas board validates section composition, crop, contrast, and information hierarchy rather than pixel-identical people.

final result: passed
