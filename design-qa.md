# LYN-005-I3 User Visual Revision Design QA

## Scope

- Task: `LYN-005-I3` — AgentHub public site Living Blueprint refinement.
- Visual baseline: `docs/qa/design-reference/lyn-005-i3/living-blueprint-visual-truth.png`.
- Higher-priority target state: the user-marked revision removing the header `开始创建 →` and the complete angled Hero workbench on desktop and mobile.
- Viewports: 1440 × 1000 desktop and 390 × 844 mobile.
- Comparison canvases:
  - `docs/qa/images/lyn-005-i3/revision-compare-desktop-before-after.png` (2858 × 992 px; previous state left, revised state right).
  - `docs/qa/images/lyn-005-i3/revision-compare-mobile-before-after.png` (758 × 820 px; previous state left, revised state right).
- Final captures:
  - `docs/qa/images/lyn-005-i3/revision-desktop-hero-final.jpg` (1429 × 992 px at a 1440 × 1000 CSS viewport, DPR 1).
  - `docs/qa/images/lyn-005-i3/revision-mobile-hero-final.jpg` (379 × 820 px at a 390 × 844 CSS viewport, DPR 1).
- State: public `/` Hero with no authenticated interaction required. Before/after pairs use identical pixel dimensions, CSS viewport, DPR, scroll position, and content state; no density normalization was required.
- Focused crop: not required because the two requested targets occupy the readable header and lower Hero regions in the full desktop canvas, while the full mobile canvas shows the complete breakpoint-specific removal and following-section transition.

## Findings

- [P1 fixed] Repeated header creation CTA. It duplicated the primary conversion action and was explicitly marked for removal. The header now contains `登录工作台` only at desktop and mobile.
- [P1 fixed] Angled Hero workbench proof. The dark block dominated the paper composition and was explicitly marked for removal. The component, frame, UI content, and responsive styling are all absent; the raster path and four milestones remain continuous.
- Post-fix review: P0 = 0, P1 = 0, P2 = 0. No open question remains.

## Final review

| Surface | Result | Evidence |
| --- | --- | --- |
| Typography and hierarchy | passed | Large Chinese Songti headline, handwritten Idea cue, editorial labels, and restrained body typography reproduce the reference hierarchy. |
| Spacing and composition | passed | Removing the Hero proof exposes the complete growth path and leaves a deliberate paper field rather than a hole. A minimum 820 px desktop Hero prevents short-viewport annotation collisions; mobile closes the Hero at 720 px so the next editorial chapter enters the first screen. |
| Color and image quality | passed | Warm-white paper, graphite, coral red, and the four raster registration marks remain consistent. The removed dark surface leaves no replacement CSS art or placeholder. |
| Content fidelity | passed | The header retains only `登录工作台`; the Hero retains exactly one `开始创建` CTA and all four milestones. The following `#product` section remains the truthful build/test/version/distribution proof with `产品界面示意 · DEMO`. |
| Interaction and state | passed | Public anchors, selectable product proof, five-step flow, creator scenarios, intent preparation, login/register continuation links, and `/assets/create` handoff remain operable. |
| Responsive behavior | passed | At 390 px the visual story is recomposed rather than scaled. Measured page width equals client width; no horizontal overflow. |
| Accessibility | passed | Semantic tabs/steps, visible keyboard focus, preserved landmark structure, and a tested reduced-motion path are present. |

## Iteration record

The initial I3 pass carried a purple legacy mark, crowded the Idea note, positioned the proof too low, and rendered the paper too yellow; those findings were fixed in the earlier R1 loop. The user then marked the repeated header CTA and the entire Hero workbench as unwanted P1 elements. This revision removes both nodes and their responsive CSS, raises the minimum desktop Hero to keep annotations clear on short screens, and shortens the mobile Hero so the paper composition resolves into the next chapter without a dead area.

The final before/after canvases show both requested removals at desktop and mobile. No P0, P1, or P2 issue remains. The visual baseline's angled proof is intentionally superseded by the user's explicit revision; the authentic interactive product proof remains immediately below the Hero.

## Follow-up polish

None in the requested revision scope.

## Verification notes

- Production preview console errors: 0 at both viewports.
- Desktop width: viewport 1440 px; document client/scroll width 1429/1429 px.
- Mobile width: viewport 390 px; document client/scroll width 379/379 px.
- DOM verification at both viewports: header creation CTA count 0; Hero workbench count 0; Hero primary CTA count 1; milestone titles count 4; downstream Demo product proof present.
- Mobile primary CTA reaches the intent section; product-state selection and step 05 selection remain operable.
- Browser media emulation was unavailable; reduced-motion behavior was verified through the existing `matchMedia` Vitest coverage and the CSS `prefers-reduced-motion` branch.
- The browser profile contained an already-visible synthetic creator session, so anonymous redirect reproduction was not forced by mutating storage. Login/register continuation targets were inspected in the production page and protected-route behavior remains covered by the unchanged auth tests.

final result: passed

---

# Historical design QA archive

# LYN-004-R10 Agent Asset Grid Four-Column Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/25-agent-library-four-column-feedback.png` (2254 × 1590 px), cross-checked with `23-agent-library-reference-final.png`.
- Browser implementation: `docs/qa/images/lyn-004-r10/r10-after-assets-2254.png` (2254 × 1590 px).
- Full-view combined input: `docs/qa/images/lyn-004-r10/compare-source-after-2254.png` (4508 × 1590 px; source left, implementation right).
- Focused breakpoint comparison: `docs/qa/images/lyn-004-r10/compare-before-after-grid-1536.png` (2212 × 810 px; R9 left, R10 right).
- State: `/assets` card view in the repository's isolated non-sensitive Demo mode. The fixture contains two real Demo Agents, so the four-column contract is verified from four computed grid tracks and measured card width rather than duplicated or fabricated cards.
- Density normalization: source and 2254 implementation were compared at identical 2254 × 1590 pixel dimensions and CSS viewport width. The focused R9/R10 crops use the same 1536 × 1200 CSS viewport and identical crop coordinates.

## Findings

- Initial P1: the R9 grid remained three columns at 1536 and 1680 CSS px, materially missing the approved four-card desktop density.
- Fix: moved only the card-grid four-column threshold from 1800px to 1536px. No card content, typography, fixed height, artwork crop, page shell, data, list view, or interaction changed.
- Post-fix: 1536, 1680, 1920, and 2254 compute four tracks; 1440 and 1280 compute three tracks; 720 computes one track. P0/P1/P2 = 0.

## Required fidelity surfaces

- Fonts and typography: passed. Existing type sizes, weights, line heights, clamps, and metadata hierarchy are unchanged; the 308px minimum desktop card remains readable.
- Spacing and layout rhythm: passed. Gap remains 16px and card height remains 420px. Measured card widths are 308px at 1536, 344px at 1680, 404px at 1920, and 414px at 2254.
- Colors and visual tokens: passed. No color or token changes were made.
- Image quality and asset fidelity: passed. Existing repository artwork, contain/fallback behavior, gradients, and Phosphor icons are unchanged; no fake asset or replacement art was introduced.
- Copy and content: passed. All current real/demo-derived names, descriptions, statuses, model/version/update fallbacks, and controls remain unchanged.

## Responsive and interaction evidence

| CSS viewport | Columns | Card width | Document/grid/card overflow |
| ---: | ---: | ---: | --- |
| 2254 | 4 | 414px | none |
| 1920 | 4 | 404px | none |
| 1680 | 4 | 344px | none |
| 1536 | 4 | 308px | none |
| 1440 | 3 | 384px | none |
| 1280 | 3 | 330.66px | none |
| 720 | 1 | 672px | none |

- Search reduced the two-card fixture to the matching card.
- Published-status filtering returned the single published Agent after clearing search.
- Name sorting, list/card switching, persisted list preference after reload, menu isolation, and whole-card navigation to `/assets/32/overview` passed.
- Browser Console: zero errors and zero warnings.

## Comparison history

1. R9 initial capture — blocked by one P1: four-column density did not start until 1800px; 1536 and 1680 remained three columns. Evidence: `r9-before-assets-1536.png`, `r9-before-assets-1680.png`, and `docs/qa/reports/lyn-004-r10-current-audit.md`.
2. R10 post-fix capture — passed. The 1536 focused comparison visibly narrows each grid track without shrinking text or metadata, while measured overflow remains false at every required viewport. The 2254 combined input confirms the approved four-column track density while preserving honest fixture content.

## Follow-up polish

- None in R10 scope. The reference contains eight illustrative Agents, while QA intentionally uses the repository's two existing Demo Agents and does not fabricate additional records.

final result: passed

# LYN-004-R12 Agent Grid Live Regression Design QA

- Source truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/25-agent-library-four-column-feedback.png` (2254×1590 px).
- User Live feedback: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-ab3f65b1-028d-4eb7-9d44-f185b23db90f.png` (2048×1024 px).
- Same-state 1440 before/after: `docs/qa/images/lyn-004-r12/compare-before-after-1440.png`.
- Focused grid comparison: `docs/qa/images/lyn-004-r12/compare-grid-focus-1440.png`.
- Design/after combined comparison: `docs/qa/images/lyn-004-r12/compare-design-after.png`.
- Browser implementation: `docs/qa/images/lyn-004-r12/03-after-assets-1440.png` at 1440×1000 CSS px, DPR 1, rendered output 1440×1000 px.
- Detailed report: `docs/qa/reports/lyn-004-r12-design-qa.md`.

## Finding and fix history

1. Initial P1: 1440px rendered three columns because the production rule started at 1536px. Production CSS was present; this was a breakpoint miss, not a stale-build or style-priority failure.
2. Fix: moved only the `/assets` four-column threshold to 1440px and updated its regression test.
3. Post-fix: 1920/1680/1536/1440 render 4 columns at 404/344/308/284px; 1280 renders 3 columns at 330.66px; 720 renders 1 column at 661px. Gap remains 16px, card height remains 420px, and no viewport has page or grid overflow.

## Required fidelity surfaces and interaction gate

- Typography, spacing, semantic colors, image treatment, copy, icons, fixed card structure, list view, and page shell are unchanged and remain readable at the 284px minimum four-column card width.
- Search, clear, status filtering, sorting, card/list switching, menu disclosure, and whole-card navigation passed.
- Browser Console: 0 error, 0 warning.
- Final R12 Live CSS contains the 1440 four-column utility and no obsolete 1536/1800 four-column utility.
- P0: 0; P1: 0; P2: 0.

final result: passed

---

# LYN-004-R11 Workbench Agent Transition Design QA

## Target and evidence

- Route/state: isolated Demo `/workbench`, existing two-Agent fixture, one configured image and one honest missing-image fallback.
- Pre-fix audit: `docs/qa/reports/lyn-004-r11-current-audit.md`.
- Detailed post-fix report: `docs/qa/reports/lyn-004-r11-workbench-transition.md`.
- Source + after: `docs/qa/images/lyn-004-r11/20-source-after-reference-comparison.png`.
- Before + after geometry: `docs/qa/images/lyn-004-r11/21-before-after-geometry-comparison.png`.
- Start + middle + complete: `docs/qa/images/lyn-004-r11/22-transition-start-middle-complete.png`.

## Findings and correction

1. Initial P1: focus card and detail replaced in one frame with no directional transition. Fixed with a two-phase `exit → enter` state machine: 70ms ease-in exit and 210ms ease-out enter, 280ms total.
2. Initial P1: stage row changed from 462px to 520.5px across the two existing Agents. Fixed by deriving the required stable geometry from existing task data; stage and detail now remain 522px throughout switching.
3. Initial P2: rapid input had no explicit convergence model. Fixed with a latest-target ref plus reducer; every commit uses the last valid request.
4. Motion is limited to two primary layers (stage content and detail content) and only transform/opacity. Static Agent ordering, card structure, CTA/routes, summaries, recent items, API/DTO/data, and artwork behavior are unchanged.
5. `prefers-reduced-motion: reduce` compresses animation to 0.01ms and removes displacement while preserving selection and focus semantics.

## Post-fix verification

- Browser: 1487, 1440, 1280, and 720 CSS widths; no horizontal overflow or page console errors/warnings.
- Directional computed evidence: `workbench-enter-next`, 0.21s, ease-out, non-default opacity/transform during entry; previous uses the mirrored class.
- Rapid three-click sequence converged to the last valid Agent; stage and detail titles matched and controls retained focus.
- Existing configured image stayed loaded; existing missing-image fallback remained intact without flash-white content.
- Automated coverage: 1/2/3+ Agent cycling, last-input-wins, cancellation back to displayed Agent, timing, transform/opacity-only CSS, stable geometry, reduced motion, and existing Workbench IA/data honesty.
- Evidence boundary: no third/failing-image Agent was fabricated for Browser QA; those structural paths are covered by existing model/state tests.

## Final findings

- P0: 0.
- P1: 0.
- P2: 0.

final result: passed

---

# LYN-004-R9 Agent Studio Selected Icon Contrast Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/24-agent-studio-selected-icon-contrast-feedback.png` (`386 × 952`, feedback crop).
- Preserved source: `docs/qa/images/lyn-004-r9/00-feedback-selected-icon-386x952.png`; density-normalized source: `00-feedback-normalized-193x476.png` (`@2x` feedback downsampled to `193 × 476` CSS-equivalent pixels).
- Browser-rendered baseline: `docs/qa/images/lyn-004-r9/01-before-studio-1440x952.png` at a `1440 × 952` CSS viewport.
- Browser-rendered implementation: `docs/qa/images/lyn-004-r9/03-after-studio-1440x952.png` at the same viewport and selected Identity state.
- Responsive implementation: `04-after-studio-1280x900.png` and `05-after-studio-720x900-200pct.png`.
- Same-state focused comparisons: `07-compare-feedback-after-focus.png` and `08-compare-before-after-focus.png`.
- State: repository Demo mode, Agent `林月`, `/assets/32/build`, Identity Information selected. No credentials, Cookie, production data, external API mutation, generated asset, or changed fixture was used.

## Findings

- Baseline P1 — selected icon detail was not reliably distinguishable. The measured selected well was `22 × 22px`, but the Identification Card glyph was only `13 × 13px`, regular weight, and white (`#ffffff`) on the primary lime background (`#d7ff2f`). Its computed contrast was `1.15:1`; the thin internal identity marks visibly merged into the bright well.
- Fix — preserve the same Phosphor `IdentificationCard` semantic icon and the same `22px` circular well, but render only the selected glyph at `16px`, library-provided `bold` weight, and the existing `canvas` token (`#08090a`). The primary background remains `#d7ff2f`; computed contrast is now `17.30:1`.
- Post-fix — the card frame, portrait circle, and horizontal identity lines are distinct in both focused comparisons. The visual remains subordinate to the solid primary CTAs because only the small existing icon well uses lime.
- No actionable P0, P1, or P2 findings remain.

## Required fidelity surfaces

- Fonts and typography: passed. Group labels, item labels, family, `13px` item text, line height, selected weight, wrapping, and antialiasing are unchanged.
- Spacing and layout rhythm: passed. The row remains `40px` high and `179px` wide at desktop; icon well remains `22 × 22px`; gaps, padding, radii, grouping, order, rail width, editor, and preview geometry are unchanged.
- Colors and visual tokens: passed. Selected well remains primary lime `#d7ff2f`; foreground changes from white to existing canvas `#08090a`. Selected row remains primary-soft `#202719`, selected text remains primary lime, and no global token changed.
- Image quality and asset fidelity: passed. The existing Phosphor icon library and `IdentificationCard` semantic asset are preserved. Bold uses the library's supplied path; no handwritten SVG, CSS drawing, emoji, new raster, or generated asset was added.
- Copy and content: passed. All headings, menu labels, helper copy, Agent fields, route labels, save state, and preview content are unchanged.
- Icons and controls: passed. Selected icon changes from `13px regular` to `16px bold`; unselected icons remain measured at `13px regular` with the existing muted foreground (`rgb(137, 141, 148)`). Route icons and every other page remain untouched.

## Full-view and focused comparison evidence

- The full `1440 × 952` before/after captures keep the same route, content, selected state, viewport, layout, and Demo record. Visual inspection confirms the change is isolated to the glyph inside the selected circular well.
- `07-compare-feedback-after-focus.png` puts the normalized feedback crop and final selected state in one raster. It confirms the approved lime well/soft row treatment is retained while internal glyph detail gains the requested dark contrast.
- `08-compare-before-after-focus.png` directly shows the former white detail loss versus the final dark, larger, bolder library glyph.

## Responsive, interaction, and accessibility evidence

- `1440 × 952`: selected row `179 × 40px`, well `22 × 22px`, glyph `16 × 16px`; document `scrollWidth = clientWidth = 1440`.
- `1280 × 900`: selected row `179 × 40px`, glyph `16 × 16px`; document `scrollWidth = clientWidth = 1280`.
- `720 × 900` / 200%-equivalent width: selected row `96 × 40px`, glyph `16 × 16px`; the intentional horizontal professional-navigation strip has `clientWidth 720 / scrollWidth 1033`, while the document remains `scrollWidth = clientWidth = 720`. The selected icon is fully inside the visible row without clipping.
- Browser section switching from Identity to Persona and back preserved the active editor and `aria-pressed` state. Keyboard focus reached the Persona button and rendered the existing `2px #d7ff2f` outline with `2px` offset. Source-contract coverage confirms native buttons, `aria-pressed`, editor `onChange`, route pushes, unselected classes, and hover classes are unchanged.
- The final in-app Browser console contained zero errors and zero warnings.

## Comparison history

1. Feedback and same-state baseline — blocked.
   - P1: white `13px` regular glyph on lime measured only `1.15:1`, and the identity card's internal details were visibly swallowed.
   - Evidence: source feedback, `01-before-studio-1440x952.png`, measured computed styles, and the left side of `08-compare-before-after-focus.png`.
2. Token, size, and library-weight correction — passed.
   - Fix: selected-only `text-canvas`, `16px`, Phosphor `bold`; preserve the `22px` well, row, label, selection surface, semantics, and all non-selected behavior.
   - Post-fix evidence: `03`–`08` screenshots/comparisons, `17.30:1` computed contrast, 1440/1280/720 geometry, focus and switching checks, automated source contracts, and clean console.

## Implementation checklist

- [x] Same semantic Phosphor icon and existing primary/canvas tokens
- [x] Selected-only dark foreground, 16px size, and library bold weight
- [x] Unselected 13px regular icons, hover classes, labels, row and well geometry unchanged
- [x] Native button, aria-pressed, editor switching, route behavior, and focus-visible preserved
- [x] 1440, 1280, and 720/200%-equivalent checks with no document overflow or icon clipping
- [x] Feedback/after and before/after focused combined comparisons

## Follow-up polish

- None. A larger well, 20–22px glyph, global icon change, or theme-token adjustment is unnecessary and would exceed this selected-state-only correction.

final result: passed

---

# LYN-004-R7 Avatar Candidate Contain Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/21-avatar-preview-crop-feedback.png`.
- Source pixels and density: `2494 × 1472` at `@2x`, normalized to the source CSS viewport `1247 × 736`.
- Browser-rendered implementation: `docs/qa/images/lyn-004-r7-avatar-preview-contain/after-demo-square-source-css-viewport-1247x736.png` at `1247 × 736`, device scale factor `1`.
- Same-size full comparison: `docs/qa/images/lyn-004-r7-avatar-preview-contain/comparison-source-implementation-matched-1247x736.png`.
- Same-region focused comparison: `docs/qa/images/lyn-004-r7-avatar-preview-contain/comparison-source-implementation-matched-focused.png`.
- Before/after comparison: `docs/qa/images/lyn-004-r7-avatar-preview-contain/comparison-before-after-1440x900.png`.
- State: local Demo-equivalent Agent build workspace, avatar tab, Motherland candidate pending confirmation. No real generation, credential, account storage, Cookie, request body, production data, or external API was read or used.

## Findings

- No actionable P0, P1, or P2 findings remain.
- The candidate image uses a fixed responsive viewport slot and `object-fit: contain`; the source crop that removes the top, chin, shoulders, or background edges is no longer possible in this preview.
- The neutral letterbox surface is `bg-slate-950/40`, derived from the existing slate overlay family. No gradient, pattern, new asset, or competing CTA treatment was introduced.
- The candidate card and footer are non-shrinking. The center row owns vertical scrolling, so the full image, status row, and bottom actions remain reachable at reduced height and equivalent 200% width.
- Confirmed/current Agent avatars remain on the existing square `object-cover` rule. Generation URL/data, prompt, API/DTO, charging path, upload/save/delete/confirm state machine, copy, buttons, and other pages are unchanged.

## Required fidelity surfaces

- Fonts and typography: passed. Existing family, weights, sizes, line heights, wrapping, antialiasing, heading hierarchy, labels, and button copy are unchanged.
- Spacing and layout rhythm: passed. Drawer width, header, prompt, border, radius, gaps, status row, and footer padding are unchanged. The only new geometry is the preview height `clamp(14rem, 52dvh, 40rem)` plus non-shrinking candidate/footer behavior.
- Colors and visual tokens: passed. Letterbox uses the existing neutral slate surface; the lime primary CTA, amber pending label, borders, and dark drawer hierarchy retain their established roles.
- Image quality and asset fidelity: passed. Portrait `1024 × 1536`, square `1254 × 1254`, and landscape `1536 × 1024` local non-sensitive images rendered centered and unstretched with computed `object-fit: contain`. No image asset was generated, added, replaced, or altered.
- Copy and content: passed. Product chrome and dynamic candidate copy are unchanged; no task prompt leaked into permanent UI.
- Icons and controls: passed. Existing Phosphor icons, close control, external-image link, generation, confirmation, cancel, and completion actions are unchanged.

## Full-view and focused comparison evidence

- The normalized `1247 × 736` full comparison places the downsampled `@2x` source and browser implementation in one raster. The source red box shows a fixed landscape crop; the implementation keeps the subject and full square source inside the same drawer without stretching.
- The matched focused comparison uses identical `450 × 330` CSS regions, enlarged equally. It makes the reported difference explicit: the source loses the portrait perimeter, while the implementation shows the complete subject and uses neutral side letterbox where needed.
- `after-demo-portrait-1440x900.png` and `after-demo-landscape-1440x900.png` use existing local non-sensitive images to verify both letterbox orientations. `after-demo-square-1440x900-final-scrolled.png` is the final committed Demo fixture state.

## Responsive, interaction, and accessibility evidence

- `1440 × 900`: preview `523 × 468`, natural source `1254 × 1254`, computed fit `contain`, no horizontal overflow; a `27px` center-row scroll exposes the full preview and status row while the footer remains visible.
- `1280 × 800`: preview `523 × 416`, scroll viewport/content `603/678`, no horizontal overflow; the full preview and footer are simultaneously visible after the bounded `75px` scroll.
- `720 × 900` equivalent 200% width: preview `523 × 468`, scroll viewport/content `703/730`, no horizontal overflow, footer bounds `827–900` remain visible.
- `1280 × 600` narrow height: preview `523 × 312`, scroll viewport/content `403/574`; after `171px` scroll the preview bounds are `145–457`, fully above the fixed footer `527–600`.
- Loading and error geometry retain the same responsive surface. Automated coverage sets portrait, square, and landscape natural dimensions and confirms no width/height distortion contract, `object-cover`, or candidate-card shrink.
- Browser interactions passed for generate, regenerate, confirm, complete, cancel, and close. After confirmation, computed current-avatar fit remained `cover`.
- The fresh in-app Browser console contained zero errors and zero warnings.

## Comparison history

1. Source/baseline — blocked.
   - P1: the red-boxed candidate uses a fixed landscape crop that removes important portrait boundaries and prevents users from reviewing the generated composition before confirmation.
2. First contain implementation — blocked.
   - Fix: added the responsive neutral preview surface and `object-contain`; loading/failure geometry became stable.
   - P2 discovered at `1280 × 800`: the candidate card still inherited flex shrinking, so the status row could be clipped instead of increasing scroll height.
3. Final implementation — passed.
   - Fix: made the candidate card and footer explicitly non-shrinking; the center row now reports real overflow and scrolls to every preview/status/action state.
   - Post-fix evidence: matched full/focused comparisons, portrait/square/landscape captures, 1440/1280/720/600-height geometry, interaction checks, official-avatar `cover`, and clean console show no remaining P0/P1/P2 issue.

## Implementation checklist

- [x] Portrait, square, and landscape candidates use complete centered contain
- [x] Neutral dark letterbox with existing border/radius hierarchy
- [x] Stable loading/error geometry and no candidate overflow
- [x] 1440, 1280, equivalent 200%, and narrow-height scroll coverage
- [x] Fixed footer with cancel/generate/confirm/complete reachability
- [x] Generate/regenerate/confirm/cancel/close behavior and formal avatar crop unchanged
- [x] Same-input full and focused visual comparisons

## Follow-up polish

- None. Further drawer changes would exceed the intentionally narrow candidate-preview correction.

final result: passed

---

# LYN-004-R8 Workbench and Agent Library Reference Alignment Design QA

## Comparison target

- Workbench source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/22-workbench-reference-final.png` (`1487 × 1058`).
- Agent library source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/23-agent-library-reference-final.png` (`2254 × 1590`).
- Browser-rendered Workbench: `docs/qa/images/lyn-004-r8/03-after-workbench-1487x1058.png` (`1487 × 1058`).
- Browser-rendered Agent library: `docs/qa/images/lyn-004-r8/04-after-assets-2254x1590.png` (`2254 × 1590`).
- Full-view comparisons: `docs/qa/images/lyn-004-r8/13-compare-workbench-source-after-1487x1058.png` and `docs/qa/images/lyn-004-r8/14-compare-assets-source-after-2254x1590.png`.
- Focused comparisons: `docs/qa/images/lyn-004-r8/15-compare-workbench-stage-focus.png` and `docs/qa/images/lyn-004-r8/16-compare-assets-card-focus.png`.
- State: local Demo mode using only the repository's existing non-sensitive `DEMO_AGENTS`; Workbench selected Agent is 林月, Agent library uses all-status / most-recent / card view. No credentials, Cookie, request body, production data, paid generation, API mutation, or new sample Agent was used.
- CSS viewports: Workbench `1487 × 1058`; Agent library `2254 × 1590`; responsive checks `1440 × 900`, `1280 × 900`, and `720 × 900` (the 200%-equivalent width for 1440).
- Density normalization: Workbench source and implementation are direct equal-pixel captures. The in-app Browser returned the visible Agent-library raster as `2254 × 1300` for a confirmed `2254 × 1590` CSS viewport whose remaining lower region contained only canvas; QA extended that lower canvas to `1590` without scaling, cropping, or changing rendered content. Source and normalized implementation are therefore equal at `2254 × 1590`.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Workbench now follows the target's information hierarchy: image-led multi-Agent stage, visibly dominant current Agent, adjacent real Agent selection, a separate current-detail panel, lifecycle count summary, and compact recent continuation rows.
- Agent library now follows the target's image-led hierarchy: status at top left, menu at top right, name and description in the image-bottom gradient, and only existing model/version/update metadata in the fixed lower partition.
- Intentional data-bound difference: the sources illustrate three stage Agents and eight library Agents, but the repository fixture contains two. The implementation shows exactly those two, never duplicates a card to fill a slot, and uses the real missing-image fallback for 知识向导. This is an accepted product constraint, not a fidelity defect.
- Intentional contract-bound difference: memory capacity, channel availability, notification counts, revenue, design-only versions, and fabricated timestamps from the sources are omitted. The current-detail panel uses only lifecycle, published version, readiness derived from current configuration fields, code, model, update time, and deterministic next-step data.

## Required fidelity surfaces

- Fonts and typography: passed. Existing AgentHub system font, display/body weights, `30px` page titles, compact `12–14px` metadata, truncation, two-line descriptions, and readable control labels preserve the target hierarchy. Long names/descriptions are clamped or truncated without changing card height.
- Spacing and layout rhythm: passed. Workbench uses a `460px` stage/detail frame followed by a compact count rail and recent rows. Agent cards are a fixed `420px` with a flexible image region and `92px` metadata footer. Wide collection routes alone receive the `1760px` canvas; unrelated workspace routes retain `1510px`.
- Colors and visual tokens: passed. Canvas, surfaces, borders, lime primary, semantic lifecycle colors, gradients, shadows, and focus rings use existing AgentHub tokens. Status meaning remains textual as well as colored.
- Image quality and asset fidelity: passed. The existing 林月 image is sharp and consistently cropped by `AgentArtwork`; the existing missing-artwork state remains explicit. No new image, generated asset, fake screenshot crop, custom SVG, emoji, or CSS illustration was added.
- Copy and content: passed. The title/purpose copy matches the selected direction while dynamic Agent names, descriptions, status, model, version, and time remain repository/API fields. Missing version/model/update/description states use existing neutral language.
- Icons and controls: passed. Existing Phosphor icons are reused. Stage arrows, card/list controls, search, select, menu, create, open-workspace, test, and clear actions remain recognizable and have semantic labels.
- Accessibility and behavior: passed for the tested scope. Stage arrows and side cards are real named buttons with visible focus styles; status uses text; card focus uses `focus-within`; menu stays above the whole-card link; primary controls meet the existing minimum control sizes. Screenshot evidence alone is not a full WCAG claim.

## Full-view and focused comparison evidence

- Workbench full comparison shows the same title → stage/current detail → status rail → recent continuation sequence. The source's third stage card and channel/memory facts are absent only because no corresponding real record/field exists.
- Workbench focus comparison keeps the source and implementation stage in one raster. It confirms a taller dominant center card, subdued neighbor, bottom identity overlay, accessible stage arrows, and the same primary open-workspace emphasis.
- Agent full comparison shows the same title, lifecycle tabs, discovery controls, image-led grid, top status/menu, bottom identity gradient, and compact metadata partition. Empty tracks remain empty when only two records exist.
- Agent focus comparison keeps the card region legible. It confirms fixed equal heights, stable image/meta partitions, real missing-artwork treatment, and no code/description/footer overflow.

## Responsive, state, interaction, and console evidence

- `2254 × 1590`: computed four Agent grid columns; grid width `1704px`; `scrollWidth = clientWidth = 2254`.
- `1440 × 900`: three Agent grid columns; `scrollWidth = clientWidth = 1440`. Evidence: `10-after-assets-1440x900.png` and `07-after-workbench-1440x900.png`.
- `1280 × 900`: three Agent grid columns; `scrollWidth = clientWidth = 1280`. Evidence: `11-after-assets-1280x900.png` and `08-after-workbench-1280x900.png`.
- `720 × 900` / 200%-equivalent width: one Agent grid column; both routes reflow vertically; `scrollWidth = clientWidth = 709` after the Browser scrollbar. Evidence: `12-after-assets-720x900-200pct.png` and `09-after-workbench-720x900-200pct.png`.
- Workbench stage next-arrow changed the selected heading/details from 林月 to 知识向导; no duplicate record was rendered. Evidence: `05-interaction-workbench-switched-1487x1058.png`.
- Agent search reduced the cards to one result; clear restored both. Card/list switching survived a reload through the existing preference key. The 林月 menu opened without card navigation, and clicking the whole-card link navigated to `/assets/32/overview`. Evidence: `06-interaction-assets-menu-1440x900.png`.
- Empty/loading/error branches remain explicit through `LoadingState`, retryable `ErrorState`, initial empty, and filtered empty components. Automated coverage also exercises zero/one/two/three stage selection, long and missing fields, and a 24-record collection without adding product fixtures.
- The final in-app Browser console contained zero errors and zero warnings.

## Comparison history

1. R7 baseline audit — blocked.
   - P1: Workbench lacked adjacent Agent selection, lifecycle summary, and compact recent continuation; its horizontal hero did not match the selected stage hierarchy.
   - P1: Agent library used tall management cards whose names/descriptions sat outside the image and whose wide-screen collection did not express the selected compact four-column grid.
   - P2: both pages had looser vertical rhythm; current-detail and card metadata hierarchy differed materially; menu/link focus and responsive states required re-verification.
   - Evidence: `docs/qa/reports/lyn-004-r8-current-audit.md`, `01-current-workbench-1487x1058.png`, and `02-current-assets-2254x1590-normalized.png`.
2. First image-led implementation — blocked.
   - Fixes: added real-data stage selection/detail/summary/recent continuation; moved asset identity into the image gradient; fixed cards to `420px`; preserved existing discovery and navigation behavior.
   - Remaining P2: the shared `1510px` canvas made both target collection surfaces visibly narrower than the source at the largest viewport.
3. Route-scoped wide canvas and final comparison — passed.
   - Fix: Workbench and `/assets` alone receive a `1760px` maximum canvas; all other workspace routes keep the prior width.
   - Post-fix evidence: equal-viewport full comparisons, focused comparisons, 2254/1440/1280/720 metrics, core interaction regression, automated edge coverage, and a clean console found no remaining actionable P0/P1/P2 issue.

## Implementation checklist

- [x] Real multi-Agent stage with honest fewer-than-three behavior and current detail
- [x] Real lifecycle counts, deterministic next step, and recent continuation
- [x] Image-led fixed-height Agent cards with top status/menu and bottom identity gradient
- [x] Search, lifecycle counts, sorting, card/list preference, menu, and whole-card navigation preserved
- [x] Missing image/description/model/version/update, long content, large collection, empty/loading/error coverage
- [x] Four / three / three / one column policy and no horizontal overflow
- [x] Same-input full and focused comparisons plus zero-error console

## Follow-up polish

- P3 accepted constraint: a denser live workspace will visually occupy all four tracks and both side positions; this QA intentionally leaves unused tracks empty rather than inventing Agent records.
- P3 out of scope: source-only global search, notification/avatar chrome, memory/channel details, and different global navigation art direction remain unchanged because R8 forbids global navigation and unsupported data changes.

final result: passed

---

# LYN-004-R5 Status Label Theme Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/18-status-label-live-feedback.png` and `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/19-status-label-draft-saved-feedback.png`.
- Source pixels: live feedback `222 × 144`; draft/saved feedback `1604 × 246`.
- Browser-rendered implementation: `docs/qa/images/lyn-004-r5-status-label-theme/after-live-resources-1440x900.png` and `docs/qa/images/lyn-004-r5-status-label-theme/after-live-build-1440x900.png`.
- Same-viewport before/after evidence: `docs/qa/images/lyn-004-r5-status-label-theme/comparison-before-after-resources-1440x900.png` and `docs/qa/images/lyn-004-r5-status-label-theme/comparison-before-after-build-1440x900.png`.
- Source/implementation comparisons: `docs/qa/images/lyn-004-r5-status-label-theme/comparison-reference-after-live-focused.png` and `docs/qa/images/lyn-004-r5-status-label-theme/comparison-reference-after-build-header.png`.
- Responsive evidence: `docs/qa/images/lyn-004-r5-status-label-theme/after-live-build-1280x800.png`, `docs/qa/images/lyn-004-r5-status-label-theme/after-live-build-200pct-equivalent-720x900.png`, and `docs/qa/images/lyn-004-r5-status-label-theme/after-live-build-long-name-200pct-equivalent-720x900.png`.
- State: authenticated local Live resource catalogue and Agent build workspace. Baselines were captured from R4 before port takeover; implementation captures use the same Live account, routes, selected Agent, content, and viewport after R5 takeover. No API mutation was triggered.
- CSS viewports and density: `1440 × 900`, `1280 × 800`, and `720 × 900` at device scale factor `1`; `720px` is the 200% equivalent-width check for a 1440px display.
- Browser screenshot pixels: `1440 × 655`, `1280 × 582`, and `720 × 328`. Chrome captures the visible content surface rather than the full overridden CSS height; comparison pairs use identical raster dimensions and no density resampling. Focus comparisons normalize only their matching source/implementation crops.

## Findings

- No actionable P0, P1, or P2 findings remain.
- The three requested labels now use dedicated scoped variants: `status-live`, `status-draft`, and `status-saved`. Global `status-success`, `status-warning`, `status-info`, `status-danger`, Agent lifecycle badges, publishing states, and unrelated warning/error labels remain unchanged.
- Live and saved labels render on `#141a0c` with lime `#9be228` text and a one-pixel inset `#536a23` border. Draft renders on `#1c160b` with restrained amber `#f5b82e` text and a one-pixel inset `#806222` border. None uses the former light solid surface.
- Computed text contrast is `11.25:1` for live/saved and `10.08:1` for draft. Both exceed WCAG AA `4.5:1` for normal text. The main CTA remains a solid `#d7ff2f` surface, so all three labels retain a visibly lower action hierarchy.
- Non-color cues are preserved: all labels keep their wording; saved keeps the existing check-circle icon; draft keeps its version/base wording. No state meaning, trigger, copy, icon semantics, save behavior, or state machine changed.

## Required fidelity surfaces

- Fonts and typography: passed. Existing font family, `12px` size, medium weight, line height, wrapping, antialiasing, and label dimensions are unchanged. Computed label height remains `24px`; no truncation was introduced.
- Spacing and layout rhythm: passed. Padding, radius, header tracks, navigation, and four adjacent actions are unchanged. At 1280px all actions remain on the same row; at the 720px equivalent they wrap to the next row without overlap.
- Colors and visual tokens: passed. The implementation adds only scoped positive/draft surface and border tokens derived from the existing lime and amber semantics. No gradient, white/cream surface, or new primary hue was introduced.
- Image quality and asset fidelity: passed. This change has no image requirement; existing Agent artwork and Phosphor icons are unchanged. No generated asset, placeholder, inline SVG, CSS art, or text glyph substitution was added.
- Copy and content: passed. `实时数据`, `当前草稿 · 基于 v1`, and `所有更改已保存` render unchanged from Live data and product chrome.

## Full-view and focused comparison evidence

- The full-view before/after comparisons place the identical Live route and viewport side by side. They show that only the three highlighted label surfaces changed; surrounding controls, layout, copy, imagery, navigation, and data remain stable.
- The focused live comparison places the feedback crop and the post-fix resource badge in one image at readable scale. The light mint fill is replaced by a matte dark surface, fine lime border, and lime text.
- The build-header source/implementation comparison keeps both draft and saved labels together with their neighboring actions. It confirms the cream/mint fills are removed while the draft/saved distinction and CTA hierarchy remain legible.
- Separate focus crops beyond these two were unnecessary because the affected components are fully readable in the normalized comparisons and verified independently through computed styles.

## Responsive, behavior, and accessibility evidence

- 1440 × 900: both build labels remain `24px` high; `scrollWidth = clientWidth = 1440`.
- 1280 × 800: draft, saved, reset, save, test, and publish controls remain visible and non-overlapping; `scrollWidth = innerWidth = 1280`.
- 720 × 900 / 200% equivalent: labels and all four neighboring actions wrap into two stable rows; rightmost action ends at `614px`; `scrollWidth = innerWidth = 720`.
- Long-content check: `Linkyun Architect` plus lifecycle, current-draft, saved, and all adjacent actions fit at the 720px equivalent without clipping or horizontal overflow.
- Save-state regression: editing the Agent name changed the unchanged status machine to icon + `有未保存更改` and enabled Save; `放弃修改` restored icon + `所有更改已保存` with `status-saved`. The test change was discarded and never sent to the API.
- A fresh Live build tab reported zero console errors and zero warnings.

## Comparison history

1. Baseline comparison — blocked.
   - P2: `实时数据` and `所有更改已保存` used light mint/green solid fills, while `当前草稿` used a cream fill. These surfaces broke the dark/lime theme and competed with action hierarchy.
   - Scope risk: the same global success/warning classes were used by Agent publishing, lifecycle, validation, error/warning, and other unrelated badges.
2. Scoped implementation — passed.
   - Fix: introduced four narrowly scoped background/border tokens and three label variants; mapped only Live source, current draft, and saved presentation to them.
   - Post-fix evidence: source/implementation focus comparisons, exact same-viewport before/after pairs, computed colors, WCAG contrast calculations, 1440/1280/720 checks, long-content coverage, state regression, overflow measurements, and a clean console found no remaining P0/P1/P2 issue.

## Implementation checklist

- [x] Dedicated live, draft, and saved variants without global Badge drift
- [x] Dark matte surfaces, thin semantic borders, semantic text, and preserved non-color cues
- [x] WCAG AA normal-text contrast
- [x] 1440px, 1280px, 200% equivalent, long-content, and adjacent-action coverage
- [x] Save-state behavior and Live source rendering regression coverage
- [x] Same-viewport before/after and source/implementation combined comparisons

## Follow-up polish

- None. Additional Badge changes would exceed the intentionally narrow R5 scope.

final result: passed

---

# LYN-004-R6 Global Label Theme Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/20-all-labels-theme-feedback.png`.
- R5 Live baselines: `docs/qa/images/lyn-004-r6-global-label-theme/before-r5-assets-1429x650.png` and `before-r5-build-1512x744.png`.
- R6 Live implementations: `after-r6-assets-1429x650.png`, `after-r6-build-1440x900.png`, `after-r6-build-matched-1440x655.png`, and `after-r6-assets-label-focused-528x272.png`.
- Combined comparisons: `comparison-r5-r6-assets-1429x650.png`, `comparison-r5-r6-build-1440x655.png`, and `comparison-feedback-r6-label-focused-528x272.png`.
- State: authenticated local Live at `http://127.0.0.1:3002`; no account, storage, Cookie, request-body, or credential inspection was performed.
- Density: comparison pairs were normalized to identical pixel dimensions before judgment. The full assets pair is 2858 × 650, the build pair is 2880 × 655, and the focused feedback pair is 1056 × 272.

## Findings

- No remaining P0, P1, or P2 label-theme mismatch.
- The first inventory pass found P1 light solid fills on shared success/warning labels and P2 ad hoc mint, blue, slate, rose, and semantic translucent pills outside the shared API.
- The final comparisons show opaque dark low-saturation surfaces, one-pixel semantic inset borders, and high-contrast semantic text. Labels remain visually subordinate to the lime primary CTA.
- Buttons, Tabs, filters, selectors, inputs, segmented controls, notifications, Toasts, Tooltips, progress indicators, and removable attachment chips retain their existing styling.
- Current local Live data did not naturally expose a danger label. Danger fidelity is verified through the real revoked/failed/high-risk callsites, shared CSS/token assertions, and a 9.01:1 text contrast test rather than fabricated Live data.

## Required fidelity surfaces

- Fonts and typography: passed. Existing 12px medium label typography is preserved, with `line-height: 16px`, `max-width: 100%`, and `overflow-wrap: anywhere` for long copy. All five label variants exceed the 4.5:1 normal-text requirement.
- Spacing and layout rhythm: passed. Existing padding, gap, radius, icon semantics, DOM placement, and page layout are unchanged. The migration is paint-only except for defensive max-width/wrapping.
- Colors and visual tokens: passed. Success, warning, info, danger, and neutral each use a distinct dark opaque background, semantic border, and text token; no label uses a white, cream, light green, light blue, or light orange solid fill.
- Image quality and asset fidelity: passed. No image, icon, or layout asset was changed. The focused comparison confirms that image-overlay labels remain legible without becoming a lime CTA.
- Copy and content: passed. Status enums, business checks, copy, icon meaning, save/publish/sync/permission flows, API/DTO/data, and backend behavior are unchanged.

## Full-view and focused comparison evidence

- `comparison-r5-r6-assets-1429x650.png`: matching list/card state demonstrates image-overlay and dense list labels before/after.
- `comparison-r5-r6-build-1440x655.png`: matching build state demonstrates the detail title bar and save/draft semantics while surrounding controls remain stable.
- `comparison-feedback-r6-label-focused-528x272.png`: the supplied light-fill feedback crop is paired with the current dark ghost implementation at the same output size.

## Route, responsive, interaction, and console evidence

- 20 real routes were audited: `/workbench`, `/assets`, `/assets/905/overview`, `/assets/904/build`, `/assets/905/test`, `/assets/905/versions`, `/assets/905/distribution`, `/assets/905/memory`, `/assets/create`, `/resources`, `/clients`, `/clients/new`, `/operations`, `/distribution`, `/analytics`, `/governance`, `/governance/roles`, `/governance/safety`, `/revenue`, and `/settings`.
- Every audited route rendered main content without an error boundary. Empty/loading/error feedback blocks were confirmed as non-label exclusions.
- The current 1440-class R6 captures cover cards, image overlays, dense lists, and the detail header. The inherited R5 responsive evidence `docs/qa/images/lyn-004-r5-status-label-theme/after-live-build-1280x800.png`, `after-live-build-200pct-equivalent-720x900.png`, and `after-live-build-long-name-200pct-equivalent-720x900.png` remains geometrically applicable because R6 does not alter label padding, font size, radius, icon, or surrounding layout; R6 adds defensive wrapping. The controlled Chrome viewport API did not produce trustworthy new 1280/720 pixel dimensions, so no mislabeled R6 responsive screenshots were retained.
- Fresh console sessions for the route sweep, assets comparison, and build comparison reported 0 errors and 0 warnings.

## Comparison history

1. Baseline comparison — blocked: P1 shared success/warning labels still rendered as light solid fills; P2 inline/ad hoc tags bypassed semantic tokens.
2. Inventory migration — fixed: added five dark ghost variants, compatibility aliases, semantic remaps, and source-level non-label protections; migrated all 49 production label callsites.
3. Final combined comparisons — passed: the supplied feedback mismatch and R5 light fills are removed, semantics remain distinguishable by text/icon meaning as well as color, and no actionable P0/P1/P2 issue remains.

## Follow-up polish

- P3 evidence limitation only: if exact post-R6 1280/720 screenshot artifacts are required beyond the inherited paint-only responsive proof, recapture them in a browser session whose viewport emulation capability reports the requested CSS dimensions.

final result: passed

---

# Design QA: 工作空间侧栏方案 1

## 2026-07-28 静默全量导航

### 对照范围

- Source visual truth：`/Users/king/.codex/generated_images/019fa2f9-bd5a-7ad1-b5cd-8b60a9c65cec/call_hAhCqFCusMeaBLNLrEWRXBOm.png`
- Source pixels：`1487 × 1058`
- Implementation route：`http://localhost:3003/workbench`（Demo 数据，仅用于视觉验证）
- Implementation evidence：`docs/qa/images/workbench-sidebar-option-1-1440x1024.png`
- Implementation screenshot pixels：`1440 × 1024`
- CSS viewport：`1440 × 1024`，device scale factor `1`
- Full-view comparison：`docs/qa/images/workbench-sidebar-option-1-comparison.png`
- Focus comparison：`docs/qa/images/workbench-sidebar-option-1-focus-comparison.png`
- State：浅色主题、工作台已加载、工作台导航选中

### Full-view comparison evidence

- 实现保留设计稿的完整文字导航、单一紫色激活态、底部设置入口和白色侧栏结构。
- 工作空间侧栏固定为 `196px`，顶部栏与内容区同步避让；页面 `scrollWidth=1440`，与视口宽度一致，没有横向溢出。
- 设计稿使用示意数据，实现使用仓库隔离的 Demo 数据；数据内容差异不影响本次导航结构与密度判断。
- Agent Asset 和应用运营现有的 `88px` 紧凑轨道行为继续保留，避免扩大本次改动范围。

### Focused region comparison evidence

- 聚焦图将设计稿与实现的左侧导航置于同一张对照图中。
- 实现的 9 个导航行（含设置）均为 `48px` 高，图标沿用项目现有 Phosphor 图标，文字保持产品统一的 `14px`。
- 设计稿中文字视觉偏大；实现按用户此前“字体、组件过大”的反馈保持现有 14px token，同时把桌面侧栏从 `224px` 收窄至 `196px`。
- 模糊的未来能力圆点已全部移除，实测数量为 `0`；没有新增分组标题、徽标或持续显示的提示层。

### Required fidelity surfaces

- Fonts and typography：沿用系统字体栈、14px/500 导航文字与 21px 图标；层级清晰，无换行或截断。
- Spacing and layout rhythm：196px 侧栏、48px 导航行、12px 图文间距与紧凑 Logo 组合形成稳定节奏；主内容获得额外 28px 横向空间。
- Colors and visual tokens：仅使用现有 `primary`、`primary-soft`、`surface`、`border` 和文字 token；未引入渐变或额外阴影。
- Image quality and assets：继续使用现有 AgentHub Logo 与 Phosphor 图标，没有占位图、手绘 SVG 或低清替代资产。
- Copy and content：导航名称完整保留，并延续已确认的“接入管理”中文命名。

### Findings

- 未发现 P0、P1 或 P2 视觉与可用性问题。
- 浏览器实测“接入管理”可从 `/workbench` 正常跳转至 `/clients`。
- 浏览器控制台无错误。

### Comparison history

1. Earlier finding：原工作空间侧栏为 `224px`，同时存在无明确含义的未来能力圆点，视觉占用偏大。
2. Fix：桌面文字侧栏收窄至 `196px`，顶部栏与主内容偏移同步调整，移除未来能力圆点，Logo 组合同步缩小。
3. Post-fix evidence：同视口全页对照、侧栏聚焦对照、计算尺寸、导航跳转和控制台检查全部通过。

### Follow-up polish

- P3：设计稿的设置图标未被外部浮层遮挡；验证截图底部出现的圆形 `N` 浮层不属于 AgentHub DOM，不纳入产品代码修复范围。

### Final result

final result: passed

---

# LYN-004-R4 Agent Card Fixed Height Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/17-agent-card-height-feedback.png`
- Supporting visual baseline: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/02-agents-card.png`
- Browser-rendered implementation: `docs/qa/images/lyn-004-r4-agent-card-height/after-live-1440x900.png`
- Same-viewport before/after comparison: `docs/qa/images/lyn-004-r4-agent-card-height/comparison-before-after-1440x900.png`
- Source/implementation comparison: `docs/qa/images/lyn-004-r4-agent-card-height/comparison-reference-after-1440x900.png`
- Focused card-region comparison: `docs/qa/images/lyn-004-r4-agent-card-height/comparison-focused-cards-1440x900.png`
- Responsive implementation evidence: `docs/qa/images/lyn-004-r4-agent-card-height/after-live-1280x800.png` and `docs/qa/images/lyn-004-r4-agent-card-height/after-live-200pct-equivalent-720x900.png`
- State: authenticated local Live Agent library, card view, all-status filter, most-recent sort. No API mutation was triggered.
- Viewport and density: 1440 × 900, 1280 × 800, and 720 × 900 CSS px at device scale factor 1; 720px is the required 200% equivalent-width check.
- Source pixels: feedback 3022 × 1496; supporting baseline 1487 × 1058. The feedback source was proportionally scaled to fill 1440 × 900 and center-cropped for the combined comparison.
- Implementation pixels: 1440 × 900, 1280 × 800, and 720 × 900. The exact same 1440 × 900 crop and Live state were used for before/after evidence.
- Focused comparison pixels: two 1212 × 560 card-region crops joined into a 2424 × 560 image.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fixed card heights are explicit and browser-computed: 608px below `md`, 536px from `md`, 496px from `xl`, 536px from 1440px, and 512px from `2xl`. The existing column breakpoints remain one / two / three / four columns.
- At each verified breakpoint, every measured card has the same height, metadata bottom position, and footer start position. Cross-row offsets equal the fixed height plus the unchanged 16px grid gap.
- Live coverage included 13 long-description cards, 4 short-description cards, 4 missing-artwork cards, 3 missing-description fallbacks, and 5 missing-model or missing-version states. No measured card overflowed.
- Long descriptions are visibly limited to two lines; long titles and all metadata remain contained by existing truncation and accessible `title` text or the existing detail entry.
- Accepted source constraint: the feedback capture contains failed artwork requests while the current Live implementation has restored artwork. Artwork, data, and API behavior are outside R4 and were intentionally not changed.

## Required fidelity surfaces

- Fonts and typography: passed. Existing family, sizes, weights, line heights, title truncation, and two-line description clamp are unchanged. Short and long text retain the same hierarchy.
- Spacing and layout rhythm: passed. Image, identity, description, metadata, and footer form stable flex partitions; model and update metadata use `margin-top: auto`, and the footer is non-shrinking. Grid gaps, padding, borders, radii, and column policy are unchanged.
- Colors and visual tokens: passed. Existing canvas, surface, border, text, lime primary, and lifecycle colors are unchanged.
- Image quality and asset fidelity: passed for R4 scope. Existing Agent artwork and fallback rendering are preserved; no asset, placeholder, CSS art, inline SVG, or fake data was added.
- Copy and content: passed. No product copy, API field, DTO, data, search/filter/sort label, list-view content, or fallback wording changed.

## Full-view and focused comparison evidence

- `comparison-before-after-1440x900.png` proves the fixed-height implementation preserves the prior same-viewport visual proportions while replacing content-derived minimum height with an explicit height contract.
- `comparison-reference-after-1440x900.png` confirms the approved dark/lime card hierarchy, image-led composition, title/description structure, and bottom metadata alignment. Differences in artwork availability are an existing Live-data condition outside this task.
- `comparison-focused-cards-1440x900.png` keeps title, description, metadata, footer, and image crop legible. It confirms that short and long cards share the same bottom alignment without clipping.

## Responsive, state, and interaction evidence

- 1440 × 900: three columns; every measured card computed to 536px; document horizontal overflow 0.
- 1280 × 800: three columns; every measured card computed to 496px; document horizontal overflow 0.
- 720 × 900: one column; every measured card computed to 608px; document horizontal overflow 0.
- 1536 × 900 supplemental check: four columns; every measured card computed to 512px; document horizontal overflow 0.
- Card/list switching and persisted view memory passed in both directions.
- Search, lifecycle filtering, A–Z sorting, clear/reset, whole-card navigation, and the non-mutating asset menu-open state passed.
- A fresh browser tab loaded the R4 fixed-height class and recorded zero console errors and zero warnings.

## Comparison history

1. The first attempted post-change capture was rejected before QA because port 3002 still served the R3 Worktree and exposed the old `min-h-[430px]` class. Those images and measurements were not treated as R4 implementation evidence.
2. The persistent R3 preview was stopped by the coordinating task, R4 took over the authenticated `127.0.0.1:3002` origin, and the DOM was rechecked for `h-[608px] ... 2xl:h-[512px]` with no `min-h-[430px]`.
3. Final full-view, focused, responsive, state, interaction, overflow, and fresh-console comparisons found no actionable P0/P1/P2 issues. No visual fix was needed after the valid R4 capture.

## Implementation checklist

- [x] Explicit, testable card heights at every existing grid breakpoint
- [x] Stable non-shrinking image, flexible content, bottom-pinned metadata, and non-shrinking footer partitions
- [x] Long title/description and missing artwork/optional-field containment
- [x] 1440px, 1280px, 200% equivalent-width, and supplemental 2xl checks
- [x] Card/list memory, search, filter, sort, whole-card navigation, and menu regression checks
- [x] Same-viewport before/after and source/implementation comparison evidence

## Follow-up polish

- None required for R4. The card-height correction is intentionally limited to the Agent card view.

final result: passed

---

# LYN-004-R3 Workbench Divider Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/16-workbench-divider-feedback.png`.
- Accepted workbench baseline: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/01-workbench.png`.
- Browser-rendered implementation: `docs/qa/images/lyn-004-r3-workbench-after-1440.png`.
- Same-state before evidence: `docs/qa/images/lyn-004-r3-workbench-before-1440.png`.
- Responsive evidence: `docs/qa/images/lyn-004-r3-workbench-after-1280.png`, `docs/qa/images/lyn-004-r3-workbench-after-200pct-equivalent.png`, and `docs/qa/images/lyn-004-r3-workbench-after-200pct-equivalent-full.png`.
- State: current authenticated Live workbench, dark theme, `弦野` draft selected as the continue-creation Agent, current backend-provided completion and metadata visible.
- Source pixels: feedback capture `3024 × 1730`; accepted baseline `1536 × 1094`.
- Implementation pixels and CSS viewports: `1440 × 655` raster at `1440 × 960` CSS px, `1280 × 582` raster at `1280 × 800` CSS px, and `720 × 328` viewport raster plus `720 × 1915` full-page raster at the `720 × 480` CSS-pixel equivalent of a 1440px display at 200% zoom. Device pixel ratio was `1`; no density resampling was used.

## Findings

- No actionable P0, P1, or P2 issue remains.
- The feedback source and same-state before capture show a one-pixel border running through the hero at the image/information transition. The final 1440 capture removes that line and replaces the abrupt edge with a 64px transparent-to-canvas fade.
- Text remains readable on a 90% canvas-color information surface. The subject, crop, card bounds, right-side progress panel, copy, data, navigation, and CTA placement are unchanged.

## Required fidelity surfaces

- Fonts and typography: unchanged. Existing family, weight, size, line height, wrapping, truncation, and hierarchy remain intact; the final Live screenshot keeps the title and two-line description legible.
- Spacing and layout rhythm: unchanged. The hero remains `460px` high at 1440px and 1280px; the information padding, card radius, grid tracks, surrounding spacing, and right-panel layout are untouched.
- Colors and visual tokens: passed. The removed `border-border` is replaced by a 64px gradient that resolves to the existing `--color-canvas`; the information surface uses a 90% mix of the same token. No new color token, shadow, or band was introduced.
- Image quality and asset fidelity: passed. The existing `AgentArtwork` asset, object position, sharpness, and crop are unchanged. No image was generated, added, replaced, stretched, or rasterized into the UI.
- Copy and content: unchanged. All product chrome and backend-provided Agent content remain as rendered by the current Live state.

## Full-view and focused comparison evidence

- The source feedback capture, same-state before screenshot, and final 1440 screenshot were opened together in one comparison input. The red-boxed solid cut corresponds exactly to the removed overlay `border-top`; the final image is continuous through the subject with no new edge or mask discontinuity.
- A separate focused crop was unnecessary because the affected boundary spans the full hero width and is clearly legible at native 1440 raster density. Computed-style evidence confirms `borderTopWidth: 0px`, a `64px` fade positioned at `top: -64px`, and a 90% canvas-color overlay.
- At 1280px, `scrollWidth = innerWidth = 1280`; the hero remains `1024 × 460` and both CTAs remain present.
- At the 720px CSS equivalent of 200% zoom, `scrollWidth = innerWidth = 720`; the hero stacks to `672 × 1004`, both CTA links retain `40px` height, and the full-page evidence shows no overlap, clipping, or horizontal overflow.

## Interactions and accessibility

- Keyboard activation of `打开工作区` navigated to `/assets/904/build`; keyboard activation of `测试` navigated to `/assets/904/test`. Both controls remain native links with unchanged destinations.
- The final workbench console contained no errors or warnings.
- The fade is pointer-transparent and does not introduce an interactive layer or alter focus order.

## Comparison history

1. Initial comparison — blocked.
   - P2: the information overlay used `border-t border-border`, producing the user-reported full-width solid cut through the portrait.
   - Fix: removed the border and blur boundary; added a 64px pointer-transparent fade above the existing information surface.
2. First post-fix render — blocked.
   - P2: Tailwind opacity modifiers on the hex-backed CSS variable resolved to transparent in computed styles, so the intended text-protection surface and fade endpoint were not guaranteed.
   - Fix: expressed the overlay as a standards-based 90% `color-mix` of `--color-canvas` and applied opacity to a gradient ending at the unmodified canvas token.
3. Final full-view and focused comparison — passed.
   - Post-fix evidence: final 1440, 1280, and 200%-equivalent captures plus computed styles, keyboard navigation, overflow measurements, and a clean console.

## Follow-up polish

- None. Additional changes would exceed the intentionally narrow correction.

final result: passed
---

# Design QA: LYN-004-C Resources

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/05-resources-skills.png` and `06-resources-knowledge.png`.
- Source pixels: both `1536 × 1094`; normalized to `1440 × 1026` and `1280 × 912` for same-viewport comparison.
- Implementation route: `http://127.0.0.1:3012/resources`, isolated Demo mode.
- CSS viewports: `1440 × 1026` and `1280 × 912`, device scale factor `1`.
- Browser screenshot pixels: `1429 × 1018` and `1269 × 904`; the in-app browser excludes its scrollbar gutter from raster capture.
- Implementation evidence: `docs/qa/images/lyn-004-c-skills-1440.png`, `lyn-004-c-knowledge-1440.png`, `lyn-004-c-skills-1280.png`, and `lyn-004-c-knowledge-1280.png`.
- Full-view comparisons: `docs/qa/images/lyn-004-c-skills-compare-1440.png`, `lyn-004-c-knowledge-compare-1440.png`, `lyn-004-c-skills-compare-1280.png`, and `lyn-004-c-knowledge-compare-1280.png`; source is left and implementation is right.
- State: Skills default selection and Knowledge default base, with isolated Demo fixtures only.

**Findings**

- No actionable P0, P1, or P2 resource-page mismatch remains.
- Accepted constraint: LYN-004-A owns the shell, so Logo, topbar utilities, and workspace navigation differences from the concept image were not changed by LYN-004-C.
- Accepted constraint: implementation renders only the repository's existing Demo fixtures. It does not copy the mock's invented Skill counts, document counts, notification badge, Agent attachment totals, or extra knowledge bases.
- Accepted constraint: the knowledge document table uses a contained horizontal scroll region at 1280px so file, text, URL, status, timestamp, reindex, and delete controls remain reachable without page overflow.

**Required Fidelity Surfaces**

- Fonts and typography: passed. The upstream system sans stack, 28px page title, 14–15px catalogue rows, restrained weights, and readable truncation match the V1 density without adding a font dependency.
- Spacing and layout rhythm: passed. Skills uses category / catalogue / detail tracks at both target widths; Knowledge uses a 290px library rail and flexible document workspace. Borders, 8–12px radii, and control spacing follow the upstream tokens.
- Colors and visual tokens: passed. Only the fixed canvas, surface, elevated, border, lime, semantic status, and text tokens are used. Selected and status states also include text/icons.
- Image quality and asset fidelity: passed. The resource views require no raster assets; all functional icons use the existing Phosphor family. No CSS art, inline SVG, emoji, or placeholder image was introduced.
- Copy and content: passed. The chrome says `资源`, `技能库`, and `知识库`; media, templates, and duplicate Agent assets are absent. Dynamic Skill and document content remains fixture/API-owned.

**Full-view Comparison Evidence**

- The four combined files place the normalized design and implementation in the same image at each required width.
- They confirm the dark/lime hierarchy, tabs, Skills three-column composition, Knowledge two-column composition, compact catalogue rows, primary actions, and thin-divider document table.
- Native-resolution screenshots remained legible enough to inspect all resource labels, icons, dividers, selected states, and table controls; a separate focused crop was unnecessary. DOM checks independently confirmed the exact status and accessible-name content.

**Interactions and Accessibility**

- Skills: search narrowed the directory to `联网搜索`, selected its details, opened the existing Agent attachment flow, selected `林月`, and produced the visible success result.
- Knowledge: text and URL documents were created in Demo state; an obvious local QA file was uploaded; detail chunks opened; reindex changed status to icon + `索引中`; delete invoked the existing browser confirmation and was intentionally not forced past the automation safety boundary.
- Keyboard: the Skills category combobox opened with ArrowDown and selected `知识与搜索` with Enter; upstream focus rings remained intact.
- Responsive: at both widths document scroll width did not exceed body width; Skills category and detail rails remained visible at 1280px; knowledge creation actions stayed visible.
- Browser console: final clean tab reported zero errors and zero warnings.

**Comparison History**

1. Initial implementation review found hidden Skills side regions at 1280px, table-style Skills rows, invalid resource tabs, English/color-only knowledge status, and no retry surface.
2. Fixes introduced the two-tab resource header, responsive three-column Skills layout, visual catalogue/detail, two-column Knowledge workspace, icon + Chinese status mapping, and persistent retry feedback.
3. Post-fix 1440px/1280px screenshots, same-viewport combined comparisons, interaction checks, overflow measurements, keyboard checks, and clean Console showed no remaining P0/P1/P2 issue.

**Follow-up Polish**

- P3: live environments may contain enough knowledge documents to justify pagination controls; no pagination behavior was invented because the current frontend contract returns the existing document list as-is.

final result: passed
# Design QA: 工作台标题密度优化

## 2026-07-28 工作台标题密度优化

### 对照范围

- Source visual truth：`/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-0ad3dbbe-ac75-46da-928d-7f8b6e7bbd20.png`
- Source pixels：`1748 × 846`
- Implementation route：`http://localhost:3002/workbench`
- Implementation evidence：`docs/qa/images/workbench-compact-title-1440x900.png`
- Implementation screenshot pixels：`1429 × 650`
- CSS viewport override：`1440 × 900`
- Focus comparison：`docs/qa/images/workbench-title-density-comparison.png`
- State：工作台已加载，存在继续构建 Agent、待处理事项和最近资产

### Full-view comparison evidence

- 优化前主标题在桌面断点使用 `30px`，与 `50px` 顶部栏和紧凑卡片内容相比视觉权重过高。
- 优化后主标题为 `24px / 32px`，日期与欢迎语保持 `12px`，首屏仍保留清晰的页面、区块和内容三级层级。
- 工作台纵向区块间距由 `28px` 收紧为 `24px`；没有调整左侧菜单、顶部栏、卡片结构或业务内容。
- 页面 `scrollWidth=1429`，小于 `innerWidth=1440`，未出现横向溢出。

### Focused region comparison evidence

- 对照图将源图标题及首个内容区与实现中的同一区域分别裁切，并统一到 `800 × 360` 后并排比较。
- 实现中的标题不再形成独立的大面积视觉块，日期仍与标题基线对齐，欢迎语与下方“继续构建”保持可辨识间隔。
- “继续构建”等二级标题继续使用现有 `18px / 28px` 层级，避免与同页“待处理事项”“今日表现”产生不一致。

### Required fidelity surfaces

- Fonts and typography：沿用现有字体、字重和抗锯齿，仅把工作台 H1 从桌面 `30px` 调整为 `24px`；没有出现换行或截断。
- Spacing and layout rhythm：缩小标题横向间距、欢迎语上间距和页面区块间距；卡片内边距、圆角和阴影保持不变。
- Colors and visual tokens：颜色与语义 token 未修改。
- Image quality and assets：Agent 头像、品牌 Logo 和图标资产未修改。
- Copy and content：标题、日期、欢迎语和所有业务文案保持不变。

### Findings

- 未发现与本次标题密度目标相关的 P0、P1 或 P2 问题。
- 浏览器控制台没有错误。

### Comparison history

1. Earlier finding：桌面工作台 H1 使用 `30px`，在用户当前显示密度下占用过多首屏空间。
2. Fix：H1 调整为 `24px / 32px`，标题间距和工作台区块间距同步收紧；二级标题保持全页一致。
3. Post-fix evidence：真实工作台渲染、聚焦并排对照、计算样式与控制台检查均通过。

### Final result

final result: passed

# Design QA: Agent Asset 紧凑外壳

## Source of truth

- 设计稿：`docs/qa/design-reference/professional-config-shell-target.png`
- 调整前：`docs/qa/images/professional-config-shell-before.png`
- 调整后：`docs/qa/images/professional-config-shell-after-1648x928.png`
- 页面：`http://localhost:3002/assets/32/build`
- 视口：1648 × 928，Demo 数据，角色人格区

## Comparison

### Full-page

- 设计稿和实现均使用全宽品牌顶部栏、顶部栏下方的图标导航栏、紧凑 Agent 信息与生命周期页签、三栏构建工作区。
- 实现保留现有 AgentHub 导航项和真实 Demo Agent 数据，不复制设计稿中的示例角色或未实现功能。

### Focused shell

- 顶部栏：实测 `x=0, y=0, width=1648, height=68`。
- 左侧栏：实测 `x=0, y=68, width=88, height=860`。
- Agent 头部：实测 `x=88, y=68, width=1560, height=123`。
- 页面横向宽度：`scrollWidth=clientWidth=1648`，无横向溢出。
- 构建操作：重置、保存草稿、保存并测试各 1 个可见实例。

## QA history

1. 初始差异：共享工作空间侧栏仍为 224px 完整菜单，顶部栏从侧栏右侧开始，构建页另有一行操作工具栏。
2. 修复：为所有 `/assets/{agentId}/...` 生命周期路由增加共享紧凑外壳；工作空间级页面保持原样。
3. 修复：品牌标识和工作空间选择器进入全宽 68px 顶部栏；桌面全局导航缩为 88px 图标栏。
4. 修复：构建操作通过共享 Agent 头部插槽呈现，移除可见的重复工具栏。
5. 回归：`/assets` 仍为 224px 完整菜单和 60px 顶部栏；390px 移动端抽屉仍为 224px 且显示全部标签。

## Result

结构和密度与设计稿一致；内容差异来自现有产品导航、Demo Agent 和后端能力边界。

## Collapsible navigation follow-up

- Evidence, compact hover: `docs/qa/images/professional-config-navigation-collapsed-hover-1648x928.png`
- Evidence, expanded labels: `docs/qa/images/professional-config-navigation-expanded-1648x928.png`
- Compact state: rail 88px; main desktop padding 88px; hovered Agent Asset tooltip visible with opacity 1.
- Expanded state: rail 224px; main desktop padding 224px; persistent labels and the Collapse navigation control visible.
- Collapse restoration: rail and main desktop padding both return to 88px.
- Workspace route regression: `/assets` remains a 224px labeled sidebar and does not render the Agent-only toggle.
- Mobile regression at 390 x 844: the drawer remains 224px, Agent Asset and Settings labels remain visible, and the desktop toggle is hidden.
- Horizontal overflow: none in compact, expanded, workspace, or mobile checks.

## 2026-07-15 compact density follow-up

- Design source: `docs/qa/design-reference/professional-config-shell-target.png`.
- Pre-change implementation: `docs/qa/design-reference/current-density-review.png`.
- Requested viewport and state: desktop Agent Build workspace with the Persona section active.
- Full-view comparison found excess vertical space in the shared top bar and Agent identity header, plus excess horizontal and vertical space in the Build configuration rail.
- Focused implementation changes: 60px compact top bar, 64px Agent identity row, 52px avatar, tighter lifecycle tabs, 196px Build rail, and 40px minimum rail-item targets.
- Typography intent, product copy, colors, imagery, Runtime behavior, and save semantics were intentionally left unchanged.
- Automated verification passed: lint, typecheck, 129 tests, production build, strict OpenSpec validation, and `git diff --check`.

### Browser capture status

- Post-change implementation screenshot: unavailable.
- The in-app browser runtime failed during initialization with `Cannot redefine property: process`.
- Because the final implementation was not captured at the same viewport, spacing, alignment, overflow, and compact/expanded preview coexistence remain visually unverified.
- This is a QA tooling blocker, not a recorded visual pass.

## 2026-07-20 export dialog short-viewport follow-up

- Source visual truth: `docs/qa/images/export-dialog-overflow-reference.png`.
- Implementation route: `http://localhost:3002/assets/29/distribution`.
- Viewport: 1024 ? 650, short desktop viewport.
- State: export dialog expected to be open with generic configuration selected.
- Full-view comparison: the source shows the dialog extending below the viewport and hiding part of the footer; the implementation now constrains the dialog to `100dvh - 2rem`.
- Focused comparison: the dialog header and footer are non-shrinking regions, while the middle form is the only vertical scroll container.
- Typography, color tokens, icons, copy and image assets were intentionally unchanged.

### QA history

1. P1: the source state clips the export action footer and provides no usable vertical scroll area.
2. Fix: added a viewport-relative maximum height, flex column layout, middle-region `overflow-y-auto`, and persistent header/footer.
3. Post-fix browser evidence: unavailable because the local page returned `Failed to fetch` before Agent data and the export dialog could render.
4. Automated verification passed for lint, typecheck, focused export tests, strict OpenSpec validation and diff checking.

### Current verification status

- Implementation screenshot: unavailable due the local backend request failure.
- Primary interaction: not testable because the distribution workspace did not finish loading.
- Console errors: the visible application error was `Failed to fetch`.
- The CSS implementation is complete, but visual comparison remains blocked until the local backend is reachable.

## Final result

final result: blocked

---

# Build 简单发布检查设计 QA

## Comparison target

- Source visual truth: `/Users/king/.codex/generated_images/019fa2f9-bd5a-7ad1-b5cd-8b60a9c65cec/call_GQidrKZZGoei3BhkTVl5EbTb.png`
- Original product reference: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-56d81da0-47c4-4bc1-83c2-6e0ec102b2e3.png`
- Implementation route: `http://localhost:3002/assets/904/build`
- Verified viewports: `1440 × 900` and `1280 × 720` CSS px
- Verified state: saved draft, publish check active
- Source pixels: generated source `1792 × 896`; original reference `3024 × 1516`
- Implementation evidence:
  - `docs/qa/images/add-build-publish-check-1440x900.png`
  - `docs/qa/images/add-build-publish-check-1280x720.png`

## Full-view comparison evidence

- The rendered implementation preserves the existing global icon rail, grouped Build rail, Agent header actions, lifecycle tabs, center editor structure, and right-panel width.
- The default state remains the existing realtime preview. Clicking `发布为新版本` activates the two-state switch and replaces only the right-panel content with the publish summary.
- At both viewports, `scrollWidth` equals `innerWidth` and `scrollHeight` equals `innerHeight`; no page-level horizontal or vertical overflow was observed.

## Focused region comparison evidence

- The right panel renders `实时预览 / 发布检查`, four ordered categories, no percentage, no progress bar, no nested cards, and one concise blocking summary.
- `基础配置` and `能力与资源` show passed states; `测试与安全` honestly shows `尚未测试` with the direct `前往测试` action; `线上影响` shows the queried Client count.
- At `1280 × 720`, all four rows and the final readiness summary remain visible in one screen without crowding or truncation.

## Required fidelity surfaces

- Fonts and typography: existing AgentHub font stack and text tokens are reused; labels, supporting copy, and status hierarchy remain legible at both viewports.
- Spacing and layout rhythm: existing panel and grid tracks are preserved; the publish rows use consistent dividers and compact vertical rhythm.
- Colors and visual tokens: existing `primary`, `success`, `warning`, `border`, and text tokens are reused.
- Image quality and assets: the existing Agent avatar and Phosphor icon library remain unchanged; no new raster assets or custom SVG substitutes were added.
- Copy and content: the implementation uses the approved four categories and shows `尚未测试` when no current-revision evidence exists instead of inventing a successful result.

## Interaction verification

- Browser interaction verified the transition from `发布为新版本` to the selected `发布检查` state and the header action change to `继续发布`.
- Unit tests cover entering the check, blocked continuation, successful continuation intent, configuration routing metadata, test routing metadata, resource failure, and Client counts.
- No console errors were recorded during either viewport check.

## Findings

- No blocking or high-priority visual defects were found in the selected simple publish-check state.
- The generated source used a wider conceptual layout, while the implementation intentionally retains the product's established fixed right panel so the editor does not jump when entering the check.

## Comparison history

1. Source was simplified from a percentage-based readiness dashboard to four fixed rows with one actionable blocker.
2. Implementation matched that information hierarchy and preserved the existing page shell.
3. Initial browser QA was blocked by a corrupted local development build cache.
4. The development service was restarted cleanly; browser interaction, screenshots, overflow checks, and console checks then passed at both requested PC viewports.

## Final result

final result: passed

---

# Agent 分步创建流程设计 QA

## 对照范围

- 设计源：`/Users/king/Projects/linkyun/product-design/design-output/agenthub/agent-create-flow/guided-wizard/`
- 实现路由：`/assets/create`
- 对照视口：`1600 × 1200`
- 实现证据：`docs/qa/images/agent-create-step-01-basic.jpg` 至 `agent-create-step-06-complete.jpg`

## 逐屏结论

| 状态 | 结果 | 说明 |
| --- | --- | --- |
| 基础输入 | 通过 | 五项输入、四步进度、预览和固定底部操作均在单屏内。 |
| 生成结果确认 | 通过 | 生成内容可编辑，确认前不会进入下一步。 |
| 头像选择 | 通过 | 四个等宽方形候选、单选状态、重新生成、上传和确认操作完整。 |
| 角色设定稿 | 通过 | 候选大图、重新生成、查看大图和显式确认完整。 |
| 技能选择 | 通过 | 从 Workspace 技能资源读取，只显示中文产品名称和说明，支持搜索、选择及跳过。 |
| 创建完成 | 通过 | 明确显示未发布草稿，不展示版本号或 Hash。 |

## 布局与交互检查

- 页面 `documentElement` 与 `body` 高度均为 `1200px`，主页面无纵向滚动。
- 头像候选初次实现曾因弹性高度形成纵向拉伸，已改为固定方形比例并复测。
- 刷新头像步骤后候选、选择和当前步骤可恢复，验证了 Demo 隔离态续建。
- 头像、角色设定稿必须确认；技能可跳过。
- 重新生成只更新候选，不覆盖已确认内容。

## 已知差异与阻塞

- Demo 模式复用仓库现有静态图片，无法按输入语义生成设计稿中的恐龙头像与角色设定稿；真实视觉内容依赖 Motherland 候选接口。
- Live 模式尚缺原子“基础生成并建立创建中草稿”、Revision 自动保存/恢复、稳定技能版本引用等后端契约，因此仅展示明确的待接入状态。
- Workspace 外层导航沿用现有 AgentHub 设计系统，未复制设计稿中的旧版导航结构。

## 最终结果

前端流程、布局和 Demo 验证通过；生产 Live 闭环因后端契约尚未提供而处于阻塞状态。

---

# Agent 概览状态样式 QA

## 对照范围

- Source visual truth：`/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-c246dbdd-bdab-4f37-af1e-0c3900e0fd30.png`
- Source pixels：`1872 × 1282`
- Implementation route：`http://localhost:3002/assets/28/overview`
- Intended state：Agent 概览页“资产组成”列表，桌面端
- Density normalization：未执行；缺少同状态的浏览器实现截图

## Full-view comparison evidence

- 源图显示状态列使用大面积浅色矩形背景，和同表格中“已配置”的轻量图标文字样式不一致。
- 实现已统一为语义图标加短文本：已配置、部分配置、未配置、待接入均不再使用整块背景。

## Focused region comparison evidence

- 聚焦区域为资产组成列表最右侧状态列。
- 静态代码检查确认四种状态均使用相同的行内布局、`17px` 图标和 `text-xs` 文本；部分配置保留琥珀色，其余状态使用成功色或弱化文本色。

## Findings

- [P2] 缺少修改后的浏览器截图，无法确认真实渲染下的列对齐、字色和状态间视觉一致性。
  - Fix：恢复 Chrome 连接后，在同一桌面视口重新加载 Agent 概览并截图复核。

## Comparison history

1. Earlier finding：状态标签整块底色过重，和“已配置”样式不统一。
2. Fix：移除“部分配置 / 未配置 / 待接入”的块状背景，改为语义图标 + 状态文字。
3. Post-fix evidence：lint、typecheck 与 diff check 通过；浏览器连接中断，未取得渲染截图。

## Final result

final result: blocked

---

# Client 与应用运营 V1 设计 QA

## 结论

**PASS**

验收范围覆盖 Clients 列表、详情、新建接入，Agent 发行联动，OyiiOyii 会话管理、朋友圈三栏管理、生成与编辑、预览发布、发布失败保留输入、评论和删除确认。

## 对照基线

- 视觉参考：`/Users/king/Projects/linkyun/product-design/design-output/agenthub/moments-operations/01-oyiioyii-moments-management.png`
- 实现截图：`docs/qa/images/client-operations-v1-moments-reference-viewport.png`
- 同尺寸并排对照：`docs/qa/images/client-operations-v1-design-comparison.png`
- 参考稿仅用于三栏布局、生成编辑和发布预览结构；按最终方案移除了状态流转、审核、浏览量、运营日志、设置和多 Client 切换。

## 验收结果

| 维度 | 结果 | 说明 |
| --- | --- | --- |
| 信息架构 | 通过 | 会话与朋友圈为真实模块；用户反馈、记忆问题、活动与渠道明确标记规划中；应用端配置隐藏 |
| 布局 | 通过 | 朋友圈采用列表、详情、互动评论三栏；大屏区域独立滚动 |
| 响应式 | 通过 | 1440×900 与 1280×720 均无页面横向溢出 |
| 字体与层级 | 通过 | 沿用 AgentHub 现有字号、字重、行高和信息层级 |
| 色彩与表面 | 通过 | 沿用现有 token；状态、危险操作、选中态和焦点态清晰 |
| 图片质量 | 通过 | 使用项目内真实位图资产，裁切比例稳定，无 CSS/SVG 占位绘图 |
| 图标 | 通过 | 统一使用现有 Phosphor 图标集，尺寸和描边一致 |
| 状态与交互 | 通过 | 加载、空态、失败重试、成功、冲突、评论、发布、删除确认均有明确反馈 |
| 可访问性 | 通过 | 表单具备可访问名称；原生控件可键盘操作；删除弹层使用 `dialog` 与 `aria-modal` |

## 浏览器验证

- Clients：列表筛选、稳定详情路由、配置保存、停用、重新启用、新建接入闭环通过。
- 会话管理：按 Agent、共享用户、会话列表和详情保持可用。
- 朋友圈：生成候选、编辑、预览、发布成功回列表、评论、删除确认与删除通过。
- Live 失败态：发布接口返回 503 后仍停留在预览页，正文与素材选择保留，错误可见并可重试。
- 旧入口：`section=moments` 安全迁移到媒体资产，并提示前往应用运营；构建导航不再显示朋友圈。
- 发行联动：Agent 发行页存在带 Agent 筛选的“管理朋友圈”入口。
- 规划占位：三个占位模块可路由且不触发不支持的接口；应用端配置不出现在导航中。

## 最终复核

未发现阻断或高优先级视觉问题。实现与最终产品边界一致；与早期概念稿的差异均来自已锁定的信息架构调整，不属于视觉缺失。

---

# Moment Agent Selector Design QA

## Comparison target

- Source visual truth: `/Users/king/.codex/generated_images/019fa2d7-5040-7163-ba02-3a73b1703f8b/call_ga3sOaYRq0Rp22gXpxLGbnat.png`
- Implementation screenshot: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-open-final-2026-07-27.png`
- Combined comparison evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-comparison-final-2026-07-27.png`
- Closed-state evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-closed-2026-07-27.png`
- Responsive evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-agent-selector-responsive-1024-2026-07-27.png`
- Route: `http://localhost:3002/operations?module=moments`
- State: live data, Moment creation step 1, Agent selector open, `可发布` filter selected

## Viewport and normalization

- Source pixels: 1797 × 875
- Implementation browser viewport: 1464 × 714 CSS px
- Implementation screenshot pixels: 1453 × 709
- Browser density: 1 CSS px to 1 screenshot px
- Comparison normalization: source downsampled with aspect-preserving contain to 1453 × 709; implementation retained at 1453 × 709; both stacked in one 1453 × 1426 comparison image
- Responsive check: 1024 × 768 CSS px, no horizontal overflow (`scrollWidth` 1013, `clientWidth` 1013)

## Full-view comparison

The implementation matches the selected direction's core composition: a compact selected-Agent control, a constrained searchable list, availability tabs, a parallel writing area, and a persistent right-side OyiiOyii preview. The editor remains visible while the Agent selector is open.

## Focused region comparison

The Agent selector region was checked separately in closed, open, search-result, `可发布`, and `全部` states. Focused evidence was necessary because the full-page comparison cannot show disabled-row semantics, keyboard closure, or search behavior.

## Required fidelity surfaces

- Fonts and typography: existing AgentHub font stack, weights, sizes, line heights, truncation, and hierarchy were preserved.
- Spacing and layout rhythm: selector/editor proportions now follow the reference; the open list is height-constrained and independently scrollable.
- Colors and visual tokens: existing canvas, surface, border, muted text, primary-soft, and primary tokens are used throughout.
- Image quality and assets: existing Agent avatars and the existing Phosphor icon library are used; no replacement placeholders, custom SVGs, or generated raster assets were introduced.
- Copy and content: Chinese labels reflect the live product contract. Unlike the concept image, unpublished Agents are not presented as valid selected values.

## Interaction verification

- Default selection skips unpublished Agents and chooses the first Agent with a platform current version.
- Selector opens and closes from the selected-Agent field.
- Search by Agent name returns the expected single result.
- Selecting a result updates the field and preview, clears the search, and closes the selector.
- `可发布` and `全部` filters work.
- Unpublished Agents remain visible in `全部` but are disabled and explain that a platform version must be published first.
- Escape closes the selector.
- No browser console warnings or errors were present.
- No publish action or backend Moment creation was triggered during QA.

## Comparison history

1. Initial implementation finding — P2: the selector overlay was full-width and obscured the upper writing area.
2. Fix: changed the desktop composition to a parallel Agent-selector and writing layout, while retaining stacked responsive behavior below the desktop breakpoint.
3. Post-fix evidence: `moment-agent-selector-open-final-2026-07-27.png`; the writing controls remain visible while the list is open, with no horizontal overflow at 1024 px.

## Findings

- No remaining P0, P1, or P2 findings.
- P3: the concept image depicts a richer formatting toolbar, but the current Moment contract uses plain text. This was intentionally not added because it is outside the Agent-selection change and would imply unsupported formatting behavior.

## Implementation checklist

- [x] Compact selected-Agent field
- [x] Searchable, scrollable single-select list
- [x] Availability filter and disabled unpublished state
- [x] Published-Agent default selection
- [x] Keyboard and click-away dismissal
- [x] Parallel desktop layout and stacked responsive fallback
- [x] Automated logic, type, lint, browser interaction, responsive, and visual checks

final result: passed

---

# Client 空状态排版 QA

- 验证日期：2026-07-28
- 详细报告：`docs/qa/reports/client-empty-state-layout-2026-07-28.md`
- 当前状态：代码修复与自动检查通过；浏览器渲染复验受 `ERR_BLOCKED_BY_CLIENT` 阻塞。

final result: blocked

---

# AgentHub 自定义下拉组件设计 QA

- 验证日期：2026-07-28
- 验证范围：全局原生下拉替换、macOS 展示一致性、键盘操作与窄视口定位
- 详细报告：`docs/qa/reports/custom-select-design-qa-2026-07-28.md`
- 实现截图：`docs/qa/images/custom-select-open-2026-07-28.png`

final result: passed

---

# Moment Automatic Publication Settings Design QA

## Target and evidence

- Route: `http://localhost:3002/operations?module=moments`
- State: Live data, automatic publication disabled for the selected published Agent
- Default-size evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-auto-publish-settings-live-default-2026-07-28.png`
- Responsive evidence: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/moment-auto-publish-settings-live-2026-07-28.png`

## Product and visual verification

- The entry sits in the Moments management toolbar next to the create action, keeping schedule management at the platform operations layer.
- The modal uses the existing AgentHub surface, border, text, primary, status and elevation tokens.
- The hierarchy is intentionally compact: title and purpose, published-Agent selector, current status, primary scheduling action, then the non-destructive close note.
- The selector exposes 16 published Agents in the verified Live workspace and excludes unpublished Agents.
- At the 1280 × 720 content viewport the 768 px dialog remains fully visible with no horizontal overflow; its body owns vertical scrolling for denser enabled schedules.
- Escape dismissal and reopening work, and no console errors or warnings were recorded.
- Live QA was read-only. No schedule generation, deletion or Moment publication was triggered.

## Findings

- No remaining P0, P1, P2 or P3 findings.
- The design intentionally does not expose manual weekday or time editing because the current backend contract generates the schedule from Agent identity.

final result: passed

---

# LYN-004-A Design QA

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/01-workbench.png`
- Implementation screenshot: `/Users/king/.codex/worktrees/14f2/agenthub/docs/qa/images/lyn-004-a-shell-1440.jpg`
- Responsive screenshot: `/Users/king/.codex/worktrees/14f2/agenthub/docs/qa/images/lyn-004-a-shell-1280.jpg`
- Combined comparison: `/Users/king/.codex/worktrees/14f2/agenthub/docs/qa/images/lyn-004-a-shell-comparison-1440.png`
- State: isolated Demo workspace, `/workbench`, expanded workspace shell; business-page content intentionally preserved
- CSS viewport and density: 1440 × 900 at device scale factor 1; 1280 × 800 responsive check at device scale factor 1
- Source pixels: 1487 × 1058; normalized to 1440px wide and center-cropped to 1440 × 900 for comparison
- Implementation pixels: 1440 × 900 (JPEG); responsive browser capture 1269 × 793 (JPEG) from a 1280 × 800 CSS viewport, excluding the browser scrollbar gutter
- Combined comparison pixels: 2880 × 900 (PNG), normalized source on the left and implementation on the right

**Findings**

- No remaining P0, P1, or P2 shell mismatch.
- Accepted constraint: the approved source mock uses a wider illustrative sidebar, while the written authoritative specification sets the expanded sidebar to 200px. The implementation uses exactly 200px and retains an 80px compact Agent workspace rail.
- Accepted constraint: the source mock shows a fabricated notification dot/count and page-specific hero content. The implementation intentionally removes the notification badge/count and preserves current workbench business content, as required by the task contract.
- Accepted constraint: the existing route map has one `/governance` destination and no global publish-center route. The shell keeps honest existing destinations rather than inventing duplicate management routes or a nonfunctional global publish action.

**Required Fidelity Surfaces**

- Fonts and typography: passed. System sans-serif/PingFang/Microsoft YaHei fallbacks, compact 14px navigation, high-contrast headings, and restrained weight hierarchy match the approved direction without loading a new font dependency.
- Spacing and layout rhythm: passed. The 200px rail, 40–44px controls, 8/12/16px rhythm, thin dividers, 8–12px radii, and fixed 56px topbar remain consistent at both target widths. Browser measurements found zero horizontal overflow.
- Colors and visual tokens: passed. Canvas `#08090A`, surface `#0F1113`, elevated `#16181B`, border `#292C31`, text tiers, lime `#D7FF2F`, and semantic status colors are centrally defined. Shared shell/base files contain no legacy purple/indigo primary utilities.
- Image quality and asset fidelity: passed. The existing raster AgentHub mark remains the source asset and is rendered monochrome in the V1 shell so the old purple mark does not compete with lime. No CSS art, inline SVG, emoji, or placeholder icon was introduced; Phosphor supplies the line icon set.
- Copy and content: passed for the shell. Navigation is grouped as primary / 运营 / 管理 / 底部工具; Create Agent is persistent; notification is explicitly unavailable without unread state; Living World copy is absent.

**Full-view Comparison Evidence**

- `lyn-004-a-shell-comparison-1440.png` puts the normalized source and browser implementation in one image. It confirms the same dark/lime hierarchy, compact grouped rail, persistent creation action, thin top divider, quiet borders, and bottom utility placement.
- Page-body differences are not shell drift: LYN-004-A explicitly forbids changing concrete workbench content, APIs, models, or workflows.

**Focused Region Comparison Evidence**

- A separate crop was not needed: the 2880 × 900 original-resolution combined image keeps the full sidebar and topbar legible, and the shell is the only comparison surface in scope.

**Interaction and Responsive Evidence**

- Workspace switch: changed from `星海内容工作室` to `品牌共创空间`; both sidebar and topbar updated.
- Route highlighting: `/settings` produced exactly one workspace-shell current item (`设置`); `/assets/32/overview` produced exactly one workspace-shell current item (`Agent`).
- Shell modes: nested Agent route measured an 80px rail; Workbench measured a 200px rail.
- Utilities: Help remained focusable; Account opened the existing sign-out menu; Settings navigated; notification was disabled with no dot/count; invitation remained reachable from the topbar.
- Keyboard focus: Help showed a 2px solid `rgb(215, 255, 47)` focus outline.
- 1440 × 900: sidebar 200px, Create Agent visible, bottom tools visible, horizontal overflow 0.
- 1280 × 800: sidebar 200px, Create Agent visible, bottom tools visible, document scroll width equaled client width.
- Browser console: zero page errors in the final 1440px and 1280px captures.

**Comparison History**

1. First browser pass found a P2 shell-color mismatch: the existing raster logo mark retained its purple treatment next to the new lime system.
2. Fix: retained the real logo asset and rendered it monochrome in shell surfaces; regenerated both screenshots and the combined comparison.
3. Post-fix evidence: final 1440px capture shows a white mark with lime wordmark accent; no actionable P0/P1/P2 shell findings remain.

**Implementation Checklist**

- [x] Semantic dark tokens and shared base states
- [x] Grouped compact navigation and single route-aware shell highlight
- [x] Workspace, Help, Settings, Account, invite, and shell-mode compatibility
- [x] Honest notification state and Living World absence
- [x] 1440px and 1280px browser checks, screenshots, interactions, focus, overflow, and console checks

**Follow-up Polish**

- P3: downstream LYN-004 B–E page slices should replace page-owned indigo/violet data colors where they represent emphasis rather than legitimate chart series.

final result: passed

---

# LYN-004-R2 Login Design QA

## Comparison target

- Source visual truth: `/Users/king/Projects/linkyun/linkyun-control/deliverables/LYN-004-agenthub-v1-ui-designs/15-login-selected.png`
- Browser-rendered implementation: `docs/qa/images/lyn-004-r2-login/implementation-1440x720-final.png`
- Full-view comparison: `docs/qa/images/lyn-004-r2-login/comparison-1440x720-final.png`
- Focused brand/portrait comparison: `docs/qa/images/lyn-004-r2-login/comparison-focus-brand-portrait-final.png`
- Focused form comparison: `docs/qa/images/lyn-004-r2-login/comparison-focus-form-final.png`
- Viewport and state: 1440 × 720 CSS px, login route, dark theme, API Service collapsed, empty fields.
- Density normalization: source 1774 × 887 px was proportionally normalized to 1440 × 720 px; implementation was captured at 1440 × 720 CSS px with browser viewport density 1. Both comparison inputs are 1440 × 720 px.

## Findings

- No actionable P0, P1, or P2 differences remain.
- P3: the portrait is an original ImageGen asset rather than the reference identity. It preserves the required black-haired subject, low-key cinematic lighting, right-biased face, dark clothing, and text-safe lower-left crop.
- P3: the source's display lettering appears to use a bespoke ultra-thin face. The implementation uses the closest locally available `Helvetica Neue` thin stack, with equivalent hierarchy and wrapping.
- P3: the source CTA has a faint tonal variation. The implementation intentionally uses the approved solid `#D7FF2F` V1 primary token instead of recreating that effect with CSS gradient art.

## Required fidelity surfaces

- Fonts and typography: system Chinese sans stack and Helvetica Neue display stack reproduce the source hierarchy, weight contrast, line length, and wrapping. Login title, labels, helper copy, CTA, and editorial overlay remain legible at all tested sizes.
- Spacing and layout rhythm: final desktop tracks are 22.5% / 33% / 44.5%; column boundaries, form width, top alignment, input height, CTA height, and lower-form spacing match the normalized reference. 1280 px and 720 px effective-width checks have no horizontal overflow.
- Colors and visual tokens: matte `#08090A` canvas, restrained borders, white/gray text, and solid lime primary match the selected direction and the approved V1 tokens.
- Image quality and asset fidelity: `public/images/login-agent-portrait.png` is a standalone 1024 × 1536 PNG. The selected design screenshot is not used by the page. The project brand PNG and Phosphor icons are reused; no CSS/div/SVG substitute is used for the portrait, logo, or interface icons.
- Copy and content: selected-login copy is preserved. Existing username/email, password, API Service, login, registration, demo, error, and loading semantics remain intact.

## Responsive and interaction evidence

- 1440 × 720: `implementation-1440x720-final.png`; `scrollWidth = innerWidth = 1440`, `scrollHeight = innerHeight = 720`.
- 1280 × 720: `implementation-1280x720.png`; `scrollWidth = innerWidth = 1280`, `scrollHeight = innerHeight = 720`.
- 200% equivalent width: `implementation-200-percent-equivalent-720x720.png`; single-column form remains fully usable with `scrollWidth = innerWidth = 720`.
- Password visibility: browser verification changed the password input from `type=password` to `type=text`, set `aria-pressed=true`, and restored the hidden state.
- API Service: browser verification changed `aria-expanded` from `false` to `true` and exposed the labeled service URL input and help text.
- Loading: `interaction-loading-1440x720.png`; a controlled local delayed 401 response produced `aria-busy=true`, a disabled submit control, spinner, and `正在处理…` text. The temporary QA service was stopped and the API URL override was restored to its original local value.
- Error: `interaction-error-api-open-720x720.png`; the caught request failure appears as a persistent `role=alert` without disclosing real credentials.
- Keyboard and focus: all interactive controls resolve uniquely in DOM order; links and buttons use the global solid lime focus outline, while inputs use a lime border plus three-pixel focus halo. Labels are explicitly connected with `htmlFor`/`id`.
- Registration: `/register` retains username, email, password, invitation code, API Service, registration submit, and back-to-login link. At 720 px it scrolls vertically without horizontal overflow.
- Reduced motion: the page inherits the global reduced-motion rule and provides a local reduced-motion override for auth transitions and the spinner.
- Console: no browser console errors were present after the final 1440 capture.

## Comparison history

1. Initial comparison — blocked.
   - P1: center column was 35.8% instead of the source's approximately 33%, shifting the form right.
   - P1: a short-height media rule pinned the form to the top instead of centering it at the source position.
   - P2: left headline wrapped to three lines; portrait overlay sat too low.
   - Fixes: changed tracks to 22.5% / 33% / remaining, restored vertical centering, tightened the headline, scaled/cropped the portrait, and repositioned the overlay.
2. Second comparison — blocked.
   - P2: editorial `WORK / FOR YOU` scale and available font weight differed materially; lower form rhythm was too compressed.
   - Fixes: selected the local Helvetica Neue thin stack, tuned line-specific type sizes, adjusted the API group and alternate-link spacing, and preserved desktop title alignment.
3. Final full-view and focused comparisons — passed.
   - Post-fix evidence: `comparison-1440x720-final.png`, `comparison-focus-brand-portrait-final.png`, and `comparison-focus-form-final.png`.
   - No actionable P0/P1/P2 findings remain.

## Follow-up polish

- Optional P3 only: if an approved licensed display font becomes available later, compare its uppercase proportions against the current Helvetica Neue overlay before changing the stack.

final result: passed

---

# LYN-004-R13 Preview and Version Contrast Design QA

- Scope: draft preview lime message/send states and Versions “当前草稿” row only.
- Initial findings: P0 = 0, P1 = 4, P2 = 1. Root cause was incorrect foreground/background pairing, not type size or layout.
- Preview fix: `primary #D7FF2F` + `canvas #08090A` reaches 17.30:1; disabled icon and boundary use `text-muted #898D94` on `surface-elevated #16181B`, both 5.34:1. Hover, pressed, and focus-visible remain distinct.
- Versions fix: dark `surface-elevated` row with `warning #F5B82E` boundary/status/divider; main text reaches 16.55:1, secondary text 7.46:1, warning boundary 9.98:1.
- Interaction regression: preview send, 查看草稿, publish-dialog open/cancel, keyboard focus, and existing navigation passed. Fresh Browser console: 0 error / 0 warning.
- Full and focused comparisons: `docs/qa/images/lyn-004-r13/05-build-before-after-full.png`, `06-versions-before-after-full.png`, `07-build-feedback-after-focus.png`, `08-versions-feedback-after-focus.png`.
- Detailed report: `docs/qa/reports/lyn-004-r13-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R15 Publish Dialog Dark Semantic Color Design QA

- Scope: `PublishDialog` current-version info card, new-version success card, and non-blocking Session behavior notice only.
- Initial findings: P0 = 0, P1 = 2, P2 = 0. The issue was high-luminance light-theme surface area inside the dark modal, not insufficient type contrast or incorrect layout.
- Fix: reused existing dark status info/success backgrounds and semantic foregrounds; info text reaches 9.59:1, success text 13.09:1, info boundary 7.68:1, success boundary 11.99:1, and bullets 7.33:1.
- Layout fidelity: version cards remain 128 × 39px; Session notice remains 542 × 90px; modal remains 590 × 748px at the 1228 × 1454 source viewport.
- Responsive/interaction: 720 × 900 has no horizontal overflow; version-note input, close, cancel, and active CTA passed. Publishing-disabled binding remains covered automatically because Browser QA intentionally did not click the final publish action.
- Fresh Browser console: 0 error / 0 warning. No publish request or business-data write occurred.
- Comparisons: `docs/qa/images/lyn-004-r15/05-feedback-after-comparison.png`, `docs/qa/images/lyn-004-r15/06-before-after-focus-comparison.png`.
- Detailed reports: `docs/qa/reports/lyn-004-r15-current-audit.md`, `docs/qa/reports/lyn-004-r15-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R16 Version Detail Session Info Dark Semantic Color Design QA

- Scope: only the session-version notice inside the selected Version detail card.
- Initial findings: P0 = 0, P1 = 1, P2 = 0. The issue was a light-theme info surface embedded in a dark card, not text size, spacing, or business semantics.
- Fix: reused R15's `border-info`, `--color-status-info-bg`, and `--color-status-info-text` treatment without changing copy, geometry, logic, or controls.
- Contrast: info text reaches 9.59:1; the semantic border reaches 7.68:1 against the surrounding surface.
- Geometry: desktop remains 647.63 × 42px; narrow remains 619 × 42px. The 720px check has no horizontal overflow or clipping.
- Interaction: 查看/收起版本内容 and Version Hash copy remain operational; export and publish were not executed.
- Fresh Browser console: 0 error / 0 warning.
- Comparisons: `docs/qa/images/lyn-004-r16/07-feedback-after-comparison.png`, `docs/qa/images/lyn-004-r16/08-before-after-focus-comparison.png`.
- Detailed reports: `docs/qa/reports/lyn-004-r16-current-audit.md`, `docs/qa/reports/lyn-004-r16-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R17 Memory Page Dark Semantic Color Design QA

- Scope: confirmed partial/stale notice, relationship/emotion/activity channel icon surfaces, availability pills, and summary emphasis on the Agent memory page only.
- Initial findings: P0 = 0, P1 = 1, P2 = 1. The large partial-data notice and repeated light channel fills were readable in isolation but visually broke the dark operational hierarchy.
- Fix: warning feedback reuses the R15/R16 dark warning surface; channel treatments preserve indigo/cyan/amber/slate meaning with 10% dark tints, high-contrast foregrounds, and explicit semantic rings.
- Contrast: foregrounds range from 8.41:1 to 11.64:1; boundaries range from 3.98:1 to 11.33:1.
- Geometry: desktop notice remains 1133 × 51px and narrow notice remains 661 × 51px. The 720px viewport has no horizontal overflow.
- Interaction: details disclosure and Agent Overview/Memory navigation passed. No business-write control was activated. Fresh Browser console: 0 error / 0 warning.
- Comparisons: `docs/qa/images/lyn-004-r17/07-before-after-partial-comparison.png`, `docs/qa/images/lyn-004-r17/08-before-after-focus-comparison.png`.
- Reports: `docs/qa/reports/lyn-004-r17-current-audit.md`, `docs/qa/reports/lyn-004-r17-design-qa.md`.
- Evidence boundary: isolated Demo was used because unchanged Live `/assets` returns HTTP 404; Live has no fixture fallback. Unreproduced error-state icon styling remains unchanged.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R18 Workbench Horizontal Carousel Motion Design QA

- Scope: Workbench Agent stage transition only; static card composition, data, order, details, CTA, navigation, summary, and recent continuation remain unchanged.
- Initial findings: P0 = 0, P1 = 1, P2 = 1. The R17 state machine faded the whole stage/detail layer to zero between a 70ms exit and 210ms enter, deterministically exposing the dark panel and making the 14–18px direction cue read as a blink.
- Fix: one persistent overflow viewport with outgoing and incoming card groups on a 200%-wide track. Next slides left; previous slides right. Duration is 240ms with `cubic-bezier(0.22, 1, 0.36, 1)` and only `transform` is animated.
- Stability: stage/track opacity stays 1, stage geometry stays 877 × 522px at 1440, background stays `rgb(15, 17, 19)`, and document horizontal overflow stays 0 throughout captured frames.
- Fast input: the in-flight target is immutable; the latest valid target is queued and replayed with a keyed fresh animation. Incoming content is mounted but inert, so images can decode without clearing the outgoing stage or adding focus targets.
- Reduced motion: 0ms state completion plus a 0.01ms transform-only CSS duration; no opacity, overlay, or empty-frame path.
- Responsive: 1536/1440/1280/720 checks have no document overflow; focus card remains inside the stage at 720.
- Browser: fresh Demo console 0 error / 0 warning. Live data remains API-only with no Demo fallback.
- Comparisons: `docs/qa/images/lyn-004-r18/53-feedback-after-comparison.png`, `docs/qa/images/lyn-004-r18/54-before-after-midframe-comparison.png`, `docs/qa/images/lyn-004-r18/51-before-next-sequence.png`, `docs/qa/images/lyn-004-r18/52-after-next-sequence.png`.
- Reports: `docs/qa/reports/lyn-004-r18-current-audit.md`, `docs/qa/reports/lyn-004-r18-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R19 Workbench Buffered Carousel Motion Design QA

- Scope: timing/easing only on the R18 Workbench transform track; layout, cards, images, content, data, order, CTA, navigation, state semantics, and API remain unchanged.
- Initial finding: P0 = 0, P1 = 0, P2 = 1. R18 traversed 51.64% by ~70ms, 80.05% by ~100ms, and 90.55% by ~130ms, so its correct 240ms slide felt too front-loaded.
- Fix: duration 420ms with `cubic-bezier(0.16, 1, 0.3, 1)`. R19 starts immediately, reaches 66.43% around 100ms and 77.87% around 130ms, then settles monotonically through 95.99% around 221ms and 100% around 433ms.
- Stability: stage and track opacity remain 1 throughout; only transform is animated; progress never overshoots 1; no scale, spring, rebound, overlay, or black frame was introduced.
- Queue/reduced motion: the active segment plus one last-target queue and per-segment key are preserved; additional requests replace the queued target. Reduced motion remains 0ms runtime / 0.01ms CSS.
- Responsive: 1536/1440/1280/720 checks have zero document overflow and unchanged final geometry. Fresh Demo console: 0 error / 0 warning.
- Live handoff: 127.0.0.1:3002 `/login`, `/workbench`, and `/assets` return HTTP 200 under `com.linkyun.agenthub.r19-live` (PID 39151); fresh Live Browser console is 0 error / 0 warning with no Demo marker.
- Comparisons: `docs/qa/images/lyn-004-r19/31-r18-r19-sequence-comparison.png`, `docs/qa/images/lyn-004-r19/32-r18-r19-early-mid-comparison.png`.
- Reports: `docs/qa/reports/lyn-004-r19-current-audit.md`, `docs/qa/reports/lyn-004-r19-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R20 Workbench Slower Ease-In-Out Carousel Design QA

- Scope: timing/easing only on the R18/R19 two-group transform track; state machine, geometry, cards, imagery, order, CTA, navigation, API, and data remain unchanged.
- Initial finding: P0 = 0, P1 = 0, P2 = 1. R19 reached 66.43% around 101ms and 77.87% around 130ms, so its strong ease-out still felt front-loaded.
- Candidate decision: 520ms `cubic-bezier(0.4, 0, 0.2, 1)` was rejected because exact midpoint progress was 77.556%, outside the requested 50–75% range.
- Fix: 520ms `cubic-bezier(0.42, 0, 0.58, 1)`; exact progress is 7.533% at 100ms, 50% at 260ms, and 100% at 520ms.
- Stability: transform only; stage/track opacity stays 1; no scale, overlay, spring, overshoot, rebound, or second movement. Stage height stays 522px.
- Queue/reduced motion: one last-target queue and independent key remain intact; reduced motion remains 0ms runtime / 0.01ms CSS.
- Responsive: 1536/1440/1280/720 have zero overflow and unchanged final geometry. Fresh Demo console: 0 error / 0 warning.
- Live handoff: 127.0.0.1:3002 `/login`, `/workbench`, and `/assets` return HTTP 200 under `com.linkyun.agenthub.r20-live` (PID 40956); fresh Live console is 0/0 with no Demo marker. The unchanged Agent request still returns HTTP 404, so Live remains fixture-free and motion QA uses isolated Demo evidence.
- Comparisons: `docs/qa/images/lyn-004-r20/31-r19-r20-sequence-comparison.png`, `docs/qa/images/lyn-004-r20/32-r19-r20-mid-focus-comparison.png`.
- Reports: `docs/qa/reports/lyn-004-r20-current-audit.md`, `docs/qa/reports/lyn-004-r20-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R21 Talkie-style Layered Carousel Design QA

- Scope: Workbench Agent stage presentation only; Agent data, card copy, artwork, order, CTA, detail panel, navigation, summary, recent continuation, API, and backend remain unchanged.
- Initial findings: P0 = 0, P1 = 1, P2 = 1. R20 moved one keyed complete two-group strip and lacked the user-approved persistent far/near/focus five-slot hierarchy.
- Fix: stable per-Agent nodes keyed only by Agent id, with signed circular slots and continuous translateX/scale plus a synchronized 720ms linear z-index handoff (`50/40 → 45/45 → 40/50`). Desktop slots are focus `0px/1`, near `±188px/0.84`, far `±318px/0.68`; mobile slots safely contract without changing the 420px card height.
- Motion: 720ms `cubic-bezier(0.42, 0, 0.58, 1)`; Browser observed 23.39% at 293ms, 57.37% at 435ms, 92.60% at 622ms, and completion by 761ms. All card opacities remain 1.
- Queue/reduced motion: the existing one-last-target queue is preserved; rapid double input ends on the last valid target with no empty stage. Reduced motion remains 0ms runtime / 0.01ms CSS.
- Responsive: 1536/1440/1280/720 checks have zero page overflow; the center card is 360px desktop and 280px at 720. Fresh Demo console: 0 error / 0 warning.
- Live handoff: 127.0.0.1:3002 `/login`, `/workbench`, and `/assets` return HTTP 200 under `com.linkyun.agenthub.r21-live` (final PID 45795); no Demo marker and fresh console 0/0. The unchanged Agent request still returns HTTP 404, so Live remains fixture-free and visual motion QA uses isolated Demo evidence.
- Honest evidence: the existing Demo has two Agents, so Browser captures do not invent three more. Five-plus slot behavior is covered with synthetic id-only tests. Talkie public capture timed out and was not retried per user instruction; the supplied screenshot is visual truth and its private easing is explicitly unconfirmed.
- Comparisons: `docs/qa/images/lyn-004-r21/20-talkie-reference-r21-comparison.png`, `21-r20-r21-1440-comparison.png`, `22-r21-start-mid-end-sequence.png`; Live boundary: `31-r21-live-3002-settled.png`.
- Reports: `docs/qa/reports/lyn-004-r21-current-audit.md`, `docs/qa/reports/lyn-004-r21-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R22 Carousel Exposure and Autoplay Design QA

- Scope: Workbench layered carousel geometry and autoplay control only; Agent data, order, card content, CTA, details, navigation, API, backend, and R21 motion state remain unchanged.
- Initial findings: P0 = 0, P1 = 2, P2 = 1. The 360px center card exceeded the 320–332px target, near exposure was only 52.6%, and no controlled autoplay existed.
- Geometry fix: center 326px (9.4% reduction), near ±210px / 0.86, far ±324px / 0.68. Measured near exposure is 66.76%; deterministic five-slot far exposure is 38.19%.
- Motion continuity: R21's stable per-Agent nodes, 720ms balanced transform/z-index transition, circular navigation, and one-last-target queue are preserved. Stage/card opacity remains 1.
- Autoplay: one cancellable 6000ms timeout with visible Pause/Play control. User pause, hover, focus-within, hidden document, active transition, reduced motion, and one Agent suppress scheduling; manual input and pause recovery require a fresh full interval.
- Controlled-clock coverage: exact six-second single advance, cancellation/restart, every pause condition, no repeated interval tick, reduced motion, and single-Agent behavior passed.
- Responsive: 1536/1440/1280/720 checks have no page-level horizontal overflow; center width safely becomes 280px at 720. Fresh isolated Demo console: 0 error / 0 warning.
- Live handoff: `com.linkyun.agenthub.r22-live` (PID 47864) serves `/login`, `/workbench`, and `/assets` as HTTP 200 at 127.0.0.1:3002. Browser has no Demo marker and Console 0/0; the unchanged Agent endpoint remains HTTP 404, so Live shows the honest request boundary without fixture fallback.
- Honest evidence: the existing Demo has two Agents, so Browser does not invent three more. Far-slot exposure is verified with deterministic geometry tests; Live remains fixture-free.
- Comparisons: `docs/qa/images/lyn-004-r22/05-r21-r22-same-viewport-comparison.png`, `docs/qa/images/lyn-004-r22/06-user-feedback-r22-comparison.png`.
- Reports: `docs/qa/reports/lyn-004-r22-current-audit.md`, `docs/qa/reports/lyn-004-r22-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R23 Three-second Silent Autoplay Design QA

- Scope: Workbench autoplay cadence and removal of the R22 pause/resume control only; geometry, motion, Agent content/order, CTA, navigation, API, backend, and other pages remain unchanged.
- Source visual truth: `docs/qa/images/lyn-004-r23/01-r22-before-1536x1000.png` plus the R23 contract requiring the top-right control to be absent.
- Implementation: `docs/qa/images/lyn-004-r23/02-r23-after-1536x1000.png`, 1536 × 1000 CSS/output pixels, DPR 1, matching Demo state.
- Initial findings: P0 = 0, P1 = 2, P2 = 0. R22 still showed the Pause/Play pill and used a 6000ms cadence.
- Fix: autoplay is a silent 3000ms one-shot timeout; the button, Pause/Play imports, labels, user-pause state, policy field, control styles, and dedicated tests are removed with no placeholder.
- Safeguards: hover, focus-within, hidden document, active transition, reduced motion, and one Agent still suppress scheduling. Manual or recovered input starts a fresh full 3000ms interval.
- Stability: R22 326px center, ±210/±324px slots and responsive geometry are unchanged; R21 720ms transform/z-index motion and one-last-target queue remain unchanged; card opacity stays 1.
- Controlled-clock coverage: 2999ms no advance, 3000ms exactly one advance, cancellation/restart, all silent pause conditions, reduced motion, and no repeated interval tick passed.
- Responsive/Browser: 1536 and 720 have no page overflow; the visible control count is zero. Fresh isolated Demo Console: 0 error / 0 warning.
- Live handoff: `com.linkyun.agenthub.r23-live` (PID 49087) serves `/login`, `/workbench`, and `/assets` as HTTP 200 at 127.0.0.1:3002 in Live mode with the unchanged public local API base. Fresh Live Browser console is 0/0 with no Demo marker; the unchanged Agent request remains HTTP 404 and no fixture fallback is introduced.
- Comparisons: `docs/qa/images/lyn-004-r23/04-r22-r23-same-viewport-comparison.png`, `05-r22-r23-stage-focus-comparison.png`, `06-r22-r23-control-focus-comparison.png`.
- Reports: `docs/qa/reports/lyn-004-r23-current-audit.md`, `docs/qa/reports/lyn-004-r23-design-qa.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-004-R13 Follow-up Test Chat Contrast QA

- Source visual truth: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-6970cfad-39db-4b67-a179-a78bda6ee52c.png` (1688 × 912 px).
- Browser implementation: `docs/qa/images/lyn-004-r13-followup/02-after-test-chat.png` (1269 × 714 px output from a 1280 × 720 CSS viewport; scrollbar gutter excluded).
- State: Agent 测试评估 → 非持久模拟 → 边界挑战 → 已发送场景起始语。
- Initial finding: P1. Lime `#D7FF2F` with white text measured 1.15:1.
- Fix: advanced test chat, basic test chat, and Runtime Chat user-message bubbles now use the existing `text-canvas #08090A` foreground. No layout, avatar, content, API, session, or sending behavior changed.
- Post-fix: computed contrast is 17.30:1; viewport has no horizontal overflow; fresh Browser console is 0 error / 0 warning.
- Full comparison: `docs/qa/images/lyn-004-r13-followup/03-before-after-full.png`.
- Focused source/after comparison: `docs/qa/images/lyn-004-r13-followup/04-feedback-after-focus.png`.
- Required surfaces: typography, spacing, image/avatar treatment, and copy are unchanged; only the incorrect semantic foreground token changed.
- Detailed report: `docs/qa/reports/lyn-004-r13-followup-test-chat.md`.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed
