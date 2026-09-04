# LYN-005-I3 R21 Hero CTA/proof-rhythm QA addendum

- Only the Hero workbench CTA and the CTA-to-status gap changed.
- Desktop: 116×44 / 13px → 148×52 / 14px; proof gap 24px → 38px; internal proof gap remains 29px.
- Mobile: 112×46 / 12px → 126×48 / 13px; proof gap 16px → 25px; internal proof gap remains 20px.
- Route, states, Hero/frozen geometry, role wall, downstream sections, overflow, and console checks passed.
- Evidence: `docs/qa/images/lyn-005-i3-hero-cta-r21/`; report: `docs/qa/reports/lyn-005-i3-hero-cta-r21/`.

final result: passed

# LYN-005-I3 R20 Role-asset title/rounding QA addendum

- The role-asset heading now reads exactly `让角色管理更清晰、更高效。`, with two explicit semantic spans on desktop and no remnant of the former copy.
- The intro block stays 369px desktop / 322px mobile. Its shorter title is balanced internally with the existing description/control rhythm; the 625px desktop and approximately 807px mobile section envelope, carousel position, and downstream seam remain stable.
- Active and inactive cards compute to 18px desktop / 14px mobile radii with `overflow:hidden`; images inherit the radius, lower copy overlays use matching lower corners, and side-selection layers inherit the card shape.
- A completed next-role transition retained the same clipping on both active and inactive states and updated the polite current-role label. Console errors and horizontal overflow are zero at 1452×604 and 390×844.
- Focused 18/18 and full 93-file / 471-test Vitest suites passed, together with lint, typecheck, production build, OpenSpec strict 37/37, and `git diff --check`.
- Evidence: `docs/qa/images/lyn-005-i3-role-rounding-r20/`; report: `docs/qa/reports/lyn-005-i3-role-rounding-r20/`.

P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-005-I3 R19 Intent-control QA addendum

- The annotated defect was structural: the wrapper had no surface, while the textarea separately carried the capsule and the absolutely positioned button used an imbalanced bottom offset.
- The final `.intentControl` owns its background, 1px border, radius, 64/58px responsive height, hover state, and focus-within ring. The textarea is transparent/borderless; its right padding reserves the complete button hit area.
- Desktop 1510×561 measured containment: control `680×64`, button `50×50`, insets `top 7 / right 11 / bottom 7`; mobile 390×844: control `322×58`, button `46×46`, insets `6 / 9 / 6`. Both runtime assertions report every button edge inside the control.
- Focus evidence: active element `#creation-intent`, border `rgba(199,255,24,.72)`, outer ring `0 0 0 3px rgba(199,255,24,.12)`; no `overflow` clips the ring.
- Suggestion fill and form submission remain functional, with the existing login and invitation registration links present in the summary. Console errors 0 and document overflow 0 at both viewports.
- Focused 18/18 and full 93-file / 471-test Vitest suites passed, together with lint, typecheck, production build, OpenSpec strict 37/37, and `git diff --check`. PID 75472 stays bound to `*:3002`; both preview addresses return HTTP 200.
- Evidence: `docs/qa/images/lyn-005-i3-intent-control-r19/`; report: `docs/qa/reports/lyn-005-i3-intent-control-r19/`.

P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-005-I3 R12 Hero Supplied-composite QA

- The text-free `1449 × 1086` user source supersedes R9–R11 Hero card-angle, 3D, and focal-height assumptions.
- One exact decorative, unoptimized raster now owns the black field, diagonal masonry, near-square focal card, overlap, shadow, outline, and edge crop. Hero contains no reconstructed card slots or 3D transform hierarchy.
- Desktop displays the source at approximately `1094.55 × 820px`; mobile reuses it at `560 × 420px` with a lower-Hero crop. Horizontal overflow is zero.
- Existing R9 files remain but are no longer Hero inputs. Copy, navigation, CTA, Hero heights, downstream page, routes, and interactions remain unchanged.
- Source/final and R11/R12 evidence: `docs/qa/images/lyn-005-i3-hero-composite-r12/comparison/`; full audit/QA: `docs/qa/reports/lyn-005-i3-hero-composite-r12/`.
- Browser console errors 0; navigation/CTA passed. Automated gates: 17/17 targeted, 93 files / 470 full tests, lint, typecheck, build, OpenSpec strict 37/37, and diff check passed.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-005-I3 R17 Hero QA addendum

- Source: normalized 1503×734 copy of the supplied 3006×1468 reference.
- Implementation: twelve independent role cards, twelve unique sources, one shared two-dimensional projection, and no composite or 3D wall.
- Final focal bbox: x764.2/y47.4/590.7×558.5; CTA y519; proof rail y644.
- Pass 3 remained P1 because its focal portrait differed in hairstyle, gaze, tailoring, and body ratio. Pass 4 uses `hero-main-reference-r18.png`, a 1200×1420 homography-corrected extraction of only the source focal-card interior, with no outer frame or neighboring-card content and no image-level transform beyond the unchanged shared card matrix.
- Final same-canvas evidence: `comparison/pass4-full.png`, `pass4-right-focus.png`, and `pass4-main-focus.png` under `docs/qa/images/lyn-005-i3-hero-perfect-r17/`.
- Responsive evidence covers 1503×734, 1440×900, 1920×1080 and 390×844.
- Console errors/warnings 0; P0/P1/P2 0.
- Detailed report: `docs/qa/reports/lyn-005-i3-hero-perfect-r17/design-qa.md`.

final result: passed

---

# LYN-005-I3 R11 Hero Focal-card Two-level 3D QA

- The R10 flat-axis assumption is superseded by one preserved perspective stage, one shared pitched/yawed/clockwise background plane, and one locally translated/lifted focal card.
- Desktop focal geometry changed from `440 × 622px / flat 6deg` to `530 × 730px`; final visual bounds are approximately `620.82 × 812.03px` and the lower gap is about `4.10px` inside the unchanged `820px` Hero.
- Transform chain: stage `1800px` perspective → plane `rotateX(3.2deg) rotateY(-4.2deg) rotateZ(3.6deg)` → focal `translateZ(72px) rotateX(-4deg) rotateY(-1.8deg) rotateZ(2.4deg)`.
- Projected-corner evidence confirms the top-right is closest to the viewer. Mobile keeps the same hierarchy with reduced `1100px` perspective and `36px` Z lift; no viewport overflow occurs.
- Ten background slots, content/images, copy, navigation, CTA, Hero height, and all downstream behavior are unchanged.
- Source/final and R10/R11 same-canvas evidence: `docs/qa/images/lyn-005-i3-hero-main-r11/comparison/`; full report: `docs/qa/reports/lyn-005-i3-hero-main-r11/design-qa.md`.
- Gates: lint, typecheck, 93 files / 470 tests, build, OpenSpec strict 37/37, and diff check passed; browser console errors 0.
- Final findings: P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# LYN-005-I3 R10 Hero Cinematic Card-wall QA

- Sole R10 visual truth: `docs/qa/design-reference/lyn-005-i3-hero-wall-r10/reference.png` (3022 × 1488).
- The Hero now uses eleven reused-raster slots in a dense three-column/multirow wall, one flat 6° clockwise axis, edge crops, and `.42/.70/.96` luminance depth; no `rotateY`, perspective, green fog or CSS halo remains.
- Focal geometry is 440 × 622 px at desktop and 230 × 320 px at mobile; desktop/mobile Hero heights, copy, CTA, navigation and downstream page remain frozen.
- Combined evidence: `docs/qa/images/lyn-005-i3-hero-wall-r10/comparison/`; complete findings: `docs/qa/reports/lyn-005-i3-hero-wall-r10/design-qa.md`.
- Final review: P0 = 0, P1 = 0, P2 = 0; console errors 0; document/client widths 1440/1440 and 390/390.

final result: passed

---

# LYN-005-I3 Full-page Reference Layout Design QA

The canonical result is recorded at the top of the repository root `design-qa.md`. This report keeps the second-round URL-to-code evidence and decision beside the LYN-005-I3 artifacts.

The later R5 live recapture supersedes the earlier proportional evidence for Hero, scenarios, intent, and footer. Its complete source/implementation comparison and final pass result are recorded in `docs/qa/reports/lyn-005-i3-fullpage-r5/design-qa.md`; the approved 图 1 role-carousel exception remains unchanged.

## Source evidence

- Live reference URL: `https://agenthub-management-lime.xiao260603.chatgpt.site/`.
- Direct 1440 × 1000 live captures, the user-supplied desktop/mobile captures, exact DOM/style/interaction snapshot, and provenance notes: `docs/qa/design-reference/lyn-005-i3-layout-r2/`.
- Sole role-asset composition truth: `role-carousel-layout-truth.png` in that directory.
- The reference's fake counts, customer claims, management statistics, pricing/docs navigation, and implied live operations were excluded.

## Final implementation evidence

- Full pages: `docs/qa/images/lyn-005-i3-layout-r2/desktop-full.png` and `mobile-full.png`.
- Desktop sequence: `desktop-00-hero.png`, `desktop-01-assets.png`, `desktop-02-flow-start.png`, `desktop-03-flow-middle.png`, `desktop-04-flow-late.png`, `desktop-05-flow-final.png`, and `desktop-06-scenarios.png`.
- Mobile sequence: `mobile-00-hero.png`, `mobile-01-assets.png`, `mobile-02-flow.png`, `mobile-03-flow-step5.png`, and `mobile-04-intent.png`.
- Same-canvas review: `compare-desktop-segments.jpg`, `compare-desktop-hero.jpg`, `compare-desktop-assets.jpg`, and `compare-mobile-hero.jpg`.

## Layout mapping result

1. Transparent wide navigation overlays the full-screen Hero; AgentHub anchors and `登录工作台` replace the source's unrelated navigation.
2. Hero keeps the source's strong left title, one lime CTA, large asymmetric role imagery, and bottom transition rail without false metrics.
3. The approved 图 1 layered role carousel follows immediately: left narrative/control rail, one focused card, complete near cards, receded far cards, progress, previous/next, and selectable sides.
4. One `460vh` desktop flow contains a viewport-height sticky stage. Its left title and five-step axis stay fixed while the right product window changes state. Mobile removes sticky and presents one product window above a complete vertical selector.
5. Three creator scenarios use one horizontal row of large raster cards at desktop and stack at mobile.
6. The intent section uses the reference's horizontal title-plus-wide-input composition, working shortcut prompts, session-only storage, and the existing login/invitation continuation.
7. A flat horizontal footer closes the page. No duplicate standalone product or flow section remains.

## Findings and fixes

- P1 fixed: separate product-proof and lime-flow sections were merged into the single reference-mapped sticky stage.
- P1 fixed: desktop scroll travel now deterministically selects five honest states while mobile keeps a non-sticky manual path.
- P2 fixed: the role title initially broke into short fragments inside the 310px rail; desktop typography was recalibrated to a readable three-line hierarchy.
- Final counts: P0 = 0, P1 = 0, P2 = 0.

## Interaction and responsive checks

- Desktop sticky scrolling visibly activated role, knowledge, release, and iteration states; stage clicks map to the same scroll intervals.
- Role carousel keeps the shared three-second cadence and hover, focus-within, document-hidden, reduced-motion, and transition pause semantics.
- Mobile stage 5 changed the product window to `iterate`; the selected control retained a visible lime focus outline.
- The intent shortcut filled the actual textarea. Submission showed the normalized summary and exact `/login?next=%2Fassets%2Fcreate` and `/register?next=%2Fassets%2Fcreate` links.
- Document/client widths: 1440/1440 and 390/390. Application-browser console errors: 0.
- Reduced-motion behavior is covered by the component/helper tests and CSS media query; the in-app browser did not expose media-feature emulation.
- The live mobile reload later closed the connection. The already supplied exact 390×844 source screenshot and the full DOM/style/interaction snapshot completed the source evidence without relying on memory or prose.

final result: passed

---

# R3 Full-site truthfulness QA addendum

Fresh evidence for the user-reported reference-copy regression is stored in `docs/qa/images/lyn-005-i3-site-audit-r3/`. The current uncommitted homepage renders the approved creator-first content at 1440 × 1000 and 390 × 844, and the new contract test explicitly rejects every reference-only management label, fake metric, pricing/docs link, and platform-login label named in the supplied screenshot.

Same-canvas evidence:

- `after/compare-desktop-reference-implementation.jpg`
- `after/compare-mobile-reference-implementation.jpg`
- `after/compare-role-layout-implementation.jpg`
- `after/compare-user-screenshot-corrected-hero.jpg`

The audit covered the public homepage by section, login, invitation registration, anonymous `/assets/create`, all top-level workspace centers, guided creation, and Demo Agent `32` overview/build/test/versions/distribution/memory. All captured routes had console errors 0 and document/client widths matched at 1440 and 390.

P0 = 0, P1 = 0, P2 = 0. Remaining P3 limits are reduced-motion media emulation, exhaustive keyboard traversal, and the dense but contained mobile Agent build workspace.

final result: passed

---

# R4 Scoped typography QA addendum

`PublicLandingPage` now owns local-only system body and display stacks without changing authentication, workspace, or Agent Asset typography. Hero/section titles use 800 rather than 900, desktop/mobile tracking is less compressed, body copy has relaxed leading, navigation/buttons use 600–700, and role/product titles use 720.

- Exact before evidence: `docs/qa/images/lyn-005-i3-typography-r4/before/`.
- Final and focused evidence: `docs/qa/images/lyn-005-i3-typography-r4/after/`.
- Same-canvas Hero evidence: `compare-reference-after-hero-desktop.jpg`, `compare-reference-after-hero-mobile.jpg`, `compare-before-after-hero-desktop.jpg`, and `compare-before-after-hero-mobile.jpg`.
- Complete report: `docs/qa/reports/lyn-005-i3-typography-r4/design-qa.md`.
- Browser results: 1440/1440 and 390/390 document/client widths, console errors 0, stable Hero wrapping, and no heading, card, button, input, or footer clipping.

P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# R6 Role asset scale QA addendum

- User annotation: `docs/qa/design-reference/lyn-005-i3-role-scale-r6/user-annotation-desktop.png`.
- The duplicated current-role summary paragraph is absent from the DOM and CSS. The existing count span retains the accessible live role label without adding a visual placeholder.
- Desktop focus card is 280 × 410 and mobile focus card is 212 × 300. The carousel remains layered, centered, side-selectable, and fully operable; the title rail now carries equal visual weight and cards clear the section edge.
- Same-canvas evidence: `docs/qa/images/lyn-005-i3-role-scale-r6/comparison/`.
- Browser: 1440 × 1000 and 390 × 844, overflow 0, console errors 0; manual focus, autoplay, hover pause, and focus-within pause passed.
- Detailed report: `docs/qa/reports/lyn-005-i3-role-scale-r6/design-qa.md`.

P0 = 0, P1 = 0, P2 = 0.

final result: passed

---

# R7 Hero bottom cleanup QA addendum

- The annotated Hero-only four-stage ledger, its links, and the two lower portrait cards are absent from DOM/CSS at desktop and mobile widths.
- Desktop Hero changed from 948 to 820 px; mobile from 844 to 760 px. The retained title, supporting copy, CTA, and primary right portrait remain balanced without a lower-screen void.
- The downstream five-stage flow still has five semantic buttons and working current-state/product-panel behavior.
- Same-canvas evidence: `docs/qa/images/lyn-005-i3-hero-cleanup-r7/comparison/`.
- Browser: 1440 × 1000 and 390 × 844, horizontal overflow 0, console errors 0.
- Complete report: `docs/qa/reports/lyn-005-i3-hero-cleanup-r7/design-qa.md`.

P0 = 0, P1 = 0, P2 = 0.

final result: passed

## R8 whole-page cohesion QA addendum

- A fresh combined audit captured the complete current page at 1440×1000 and 390×844 before any R8 edit; old R5/R6/R7 screenshots were not used as audit evidence.
- The role-to-flow dead gap was removed, the flow title aligned to the common 1320px rail, the desktop scenario band expanded to about 282px, mobile intent closure shortened, and primary actions aligned to 48px.
- The Hero remains 820/760px; role cards remain 280×410 / 212×300; removed Hero trail/lower portraits and role summary remain absent.
- Fresh Browser verification: horizontal overflow 0, console errors 0, navigation/CTA/carousel/stage/intent/auth continuation passed.
- Same-canvas evidence: `docs/qa/images/lyn-005-i3-cohesion-r8/comparison/`.
- Complete report: `docs/qa/reports/lyn-005-i3-cohesion-r8/design-qa.md`.

P0 = 0, P1 = 0, P2 = 0.

final result: passed
# LYN-005-I3 R9 Hero Perspective Matrix QA

- Five independent project-local raster character studies replace the three conflicting Hero portraits and full-width green atmosphere.
- Shared desktop perspective: `rotateY(-10deg) rotateZ(4deg)`; primary card centered on black with purple/cobalt rim light.
- Mobile independently uses one primary plus three supporting cards; CTA gap is 9px and document width is 390/390.
- Same-canvas source/final, focused, and before/after evidence lives in `docs/qa/images/lyn-005-i3-hero-array-r9/comparison/`.
- Browser console errors 0; full report: `docs/qa/reports/lyn-005-i3-hero-array-r9/design-qa.md`.

final result: passed

---
