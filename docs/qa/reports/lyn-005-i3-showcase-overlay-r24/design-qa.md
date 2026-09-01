# LYN-005-I3 R24 Design QA

Date: 2026-08-31
Surface: `PublicLandingPage` role-card information layer only

## Source and normalization

- Problem evidence: `docs/qa/design-reference/lyn-005-i3-showcase-overlay-r24/user-issue-reference.png`, 2038×1070 pixels.
- Browser viewport overrides: 1440×1000 desktop and 390×844 mobile.
- Browser screenshot pixels: 1429×992 desktop and 379×820 mobile. Before and after use identical viewport override, browser density and `#assets` state; no cross-density measurement is used.
- Same-canvas evidence:
  - `comparison/reference-before-after-focus.png`
  - `comparison/desktop-before-after.png`
  - `comparison/mobile-before-after.png`
  - `comparison/five-role-desktop-focus.png`
  - `comparison/five-role-mobile-focus.png`

## Findings and comparison history

### Pass 0 — blocked by P1 shoulder obstruction

- **P1 / imagery and layout:** `.assetCardCopy` occupied 156px (38.05%) of the 410px desktop card and painted a uniform 88%-opaque black surface from 253px down. On mobile it occupied 94px (31.33%) from 205px down. The sharp horizontal boundary cut through the shoulder and garment silhouette on every shared card.
- **Fix:** keep the existing absolute copy node and geometry contract, lower the start by reducing its content box, and reuse the established workbench tonal-fade language. Replace the uniform fill with a transparent top stop that reaches 72% at 30px desktop / 20px mobile and a maximum 90% at the lower edge. Add the existing dark text-shadow treatment for legibility.

### Pass 1 — passed

- Desktop copy layer: 150px, 36.59% of card height, top at 259px, padding `16px 20px 14px`.
- Mobile copy layer: 91px, 30.33%, top at 208px, padding `10px 14px 11px`.
- Five desktop and five mobile focused states show the portrait and clothing continuing behind the label without a hard bar. Labels, names, role positioning and all desktop descriptions remain readable.
- P0/P1/P2: 0/0/0.

## Required fidelity surfaces

- **Fonts and typography:** unchanged system display/body stacks and exact R23 copy; text-shadow only protects contrast against portrait variation.
- **Spacing and layout:** only overlay min-height/padding changed. Card frames, 18px/14px radii, positions, overlap, scale, border, progress and section rhythm are unchanged.
- **Colors and tokens:** lime and text tokens are unchanged. The former uniform `rgb(5 6 4 / 88%)` board is replaced by a transparent-to-90% dark tonal transition.
- **Image quality:** the five independent lossless WebP images and their object positions are untouched. Shoulder, clothing and rim-light detail remain visible with no new clipping or halo.
- **Copy and content:** exact approved name/type/focus/description remains present; no content or DOM was removed.
- **Interaction and accessibility:** all five progress targets focus successfully and update the polite live label. Arrow/autoplay contracts, focus outline, reduced motion and hidden-page pause semantics are unchanged.
- **Responsiveness:** document overflow is zero at both viewports. Mobile uses a shorter transition while keeping the existing 212×300 card and hidden description contract.

## Verification

- Focused Vitest: 2 files / 20 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 19 application pages generated.
- `git diff --check`: passed.
- Browser: five desktop and five mobile focus states, next-arrow transition and unfocused three-second autoplay passed; console errors 0 and horizontal overflow 0.
- Preview: PID 13832 listens on `*:3002`; `http://127.0.0.1:3002/` returned HTTP 200.

## Residual limits

- Browser media emulation for reduced motion and document visibility is unavailable in the selected in-app surface; unchanged unit contracts cover those pause conditions.
- Two existing Next.js development-only LCP warnings may appear on initial Hero load; browser console errors for R24 are zero and neither warning references the role-card overlay.

final result: passed
