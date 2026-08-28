# LYN-005-I3 completion report

# LYN-005-I3 R21 Hero CTA/proof-rhythm addendum

- Enlarged only `进入工作台` to 148×52 / 14px desktop and 126×48 / 13px mobile.
- Lowered only the continuous proof group by increasing CTA→status to 38px desktop / 25px mobile; retained status→stats at 29px / 20px.
- Preserved the real login continuation, interaction states, header/title/lead/wall/Hero geometry, R20 role section, R19 intent, and every downstream section.
- Evidence: `docs/qa/images/lyn-005-i3-hero-cta-r21/` and `docs/qa/reports/lyn-005-i3-hero-cta-r21/`.

final result: passed

# LYN-005-I3 R20 role-asset title and rounded-card addendum

- Replaced only the role-asset intro heading with `让角色管理更清晰、更高效。`; desktop uses explicit `让角色管理` / `更清晰、更高效。` spans.
- Preserved the intro and section envelopes while recalibrating only the title size/leading and internal flex distribution. Controls, carousel stage, card sizes/slots/scales/transforms/z-index, progress, and downstream layout did not move.
- Applied 18px desktop / 14px mobile clipping to every carousel article. Images and hit layers inherit the parent radius; copy overlays share the exact lower-corner radius and clip their contents.
- Active/inactive computed styles and a completed role transition passed at 1452×604 and 390×844. Both viewports have zero horizontal overflow and console errors.
- Evidence: `docs/qa/images/lyn-005-i3-role-rounding-r20/` and `docs/qa/reports/lyn-005-i3-role-rounding-r20/`.
- Gates passed: focused 18/18, full 93 files / 471 tests, lint, typecheck, production build with 19 pages, OpenSpec strict 37/37, and diff check.

final result: passed

---

# LYN-005-I3 R19 intent-control containment addendum

- Changed only `src/modules/landing/public-landing-page.module.css` and its focused typography/visual contract test.
- Moved the capsule background, border, radius, hover, and focus-within treatment from the textarea to `.intentControl`; the textarea is now transparent and borderless with reserved submit-button padding.
- Positioned the unchanged submit button with `top: 50%`, `translateY(-50%)`, and responsive right insets. Desktop runtime insets are 7/11/7px (top/right/bottom); mobile insets are 6/9/6px. Every button edge is inside the control at 1510×561 and 390×844.
- Suggestion selection, required/240-character input behavior, submit summary, and existing `/login`/`/register` continuation passed. No Hero, title, recommendation, Footer, route, authentication, API, dependency, or configuration change was made.
- Evidence: `docs/qa/design-reference/lyn-005-i3-intent-control-r19/`, `docs/qa/images/lyn-005-i3-intent-control-r19/`, and `docs/qa/reports/lyn-005-i3-intent-control-r19/`.
- Gates passed: focused 18/18, full 93 files / 471 tests, lint, typecheck, build, OpenSpec strict 37/37, and diff check. PID 75472 continues listening on all IPv4 interfaces; local and LAN HTTP checks are 200.

final result: passed

---

## R16 creation-intent chrome cleanup addendum

- Removed the initial explanatory sentence and complete counter/lock/privacy metadata row from DOM; the submitted-result session disclosure remains truthful and unchanged.
- Recalibrated only the intent section to 500px desktop / 480px mobile. Final gaps are 54/26/42px at 1440×1000 and 48/26/48.664px at 390×844 for heading→input→suggestions→section close.
- Preserved input/control dimensions, required/240-character validation, suggestions, submit result, session-only storage, and login/invitation continuation.
- Fresh before/after and comparison evidence: `docs/qa/images/lyn-005-i3-intent-cleanup-r16/`; detailed reports: `docs/qa/reports/lyn-005-i3-intent-cleanup-r16/`.
- Gates passed: focused 17/17, full Vitest 93 files / 470 tests, lint, typecheck, build, OpenSpec strict 37/37, and `git diff --check`; both preview addresses returned HTTP 200.
- R16 QA result: P0/P1/P2 = 0/0/0; `final result: passed`.

## Outcome

The AgentHub public site now follows the approved reference's complete page composition, not only its black/lime palette. The final order is full-screen Hero → 图 1 layered role assets → one long-scroll sticky five-stage product flow → three cinematic creator scenarios → horizontal creation-intent handoff → flat footer. The former standalone product proof and separate lime flow were merged so the page no longer repeats capability sections.

### R5 live recapture update

The source URL was reopened and fully captured again in the in-app browser at 1440 × 1000 and 390 × 844 before the latest edit. The final revision adopts the measured inset Hero frame, compact 192 px desktop scene strip, centered 440 px intent handoff, and 70 px footer while preserving the user-approved taller 图 1 role exhibition. Fresh sources, implementation captures, and eight same-canvas comparisons are in `docs/qa/{design-reference,images}/lyn-005-i3-fullpage-r5/`; the detailed result is `docs/qa/reports/lyn-005-i3-fullpage-r5/design-qa.md`.

Final gates: lint passed; typecheck passed; 93 test files / 468 tests passed; production build passed; strict OpenSpec passed 37/37; `git diff --check` passed.

## Changed implementation

- `src/modules/landing/public-landing-page.tsx`
- `src/modules/landing/public-landing-page.module.css`
- `src/modules/landing/public-landing-page.test.tsx`
- `openspec/changes/add-agenthub-public-site/{proposal.md,design.md,tasks.md}`
- `openspec/changes/add-agenthub-public-site/specs/agenthub-public-site/spec.md`
- `design-qa.md`
- `docs/qa/design-reference/lyn-005-i3-layout-r2/`
- `docs/qa/images/lyn-005-i3-layout-r2/`
- `docs/qa/reports/lyn-005-i3/{design-qa.md,completion-report.md}`
- `docs/qa/design-reference/lyn-005-i3-fullpage-r5/`
- `docs/qa/images/lyn-005-i3-fullpage-r5/`
- `docs/qa/reports/lyn-005-i3-fullpage-r5/`

## Existing raster assets retained

- `public/images/agenthub-site/dark-lime-atmosphere.png`
- `public/images/agenthub-site/role-strategist-demo.png`
- `public/images/agenthub-site/role-gamehost-demo.png`
- `public/images/agenthub-site/role-creative-director-demo.png`

These prior-round ImageGen assets remain standalone raster files and were visually inspected. They contain no text, logos, fake UI, or product metrics. Public-use licensing remains a later approval decision; this task did not deploy them.

## Layout and truthful content mapping

- Header: AgentHub, product, flow, scenarios, role assets, and login only; no repeated top creation CTA.
- Hero: exact creator title, one primary CTA, truthful process copy, and cinematic role imagery; no fake counts or customers.
- Role assets: current `林月` Demo Asset plus explicitly labeled example roles; no claimed live activity.
- Sticky product flow: role setting → knowledge and skills → conversation testing → release/runtime handoff → iteration. The product window uses build/test/version/distribution vocabulary and is labeled `产品界面示意 · DEMO`.
- Scenarios: independent creators, IP/content teams, and Agent operations teams in one desktop image row.
- Intent: session-only normalized text, no generation/persistence API, working shortcut prompts, and existing authentication continuation.
- Login handoff: `/login?next=%2Fassets%2Fcreate`.
- Invitation handoff: `/register?next=%2Fassets%2Fcreate`.

## Carousel and stage behavior

- Carousel reuses `useWorkbenchAgentTransition`, `circularAgentSlot`, `boundedCarouselSlot`, `useWorkbenchAutoplay`, `usePrefersReducedMotion`, and `useDocumentHidden`.
- Previous/next, side-card selection, progress, three-second autoplay, manual reset, and all required pause conditions remain intact.
- Desktop flow maps the scroll container's travel to five deterministic stages and lets stage controls scroll to the matching interval.
- At 390px the stage is explicitly non-sticky; one stable product window sits above the complete touch/keyboard selector.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed after correcting the focused test helper's button type.
- `npm test`: passed, 92 files / 465 tests.
- `npm run build`: passed, 19 static pages generated.
- `openspec validate --all --strict`: passed, 37/37.
- `git diff --check`: passed.
- Application browser at 1440 × 1000 and 390 × 844: passed; widths 1440/1440 and 390/390; console errors 0.
- Desktop sticky stages, mobile stage selection, role-carousel controls, intent shortcuts/submission, auth links, visible focus, and no horizontal overflow were checked.
- Reduced motion is covered by landing and shared carousel tests plus scoped CSS. The in-app browser did not expose media-feature emulation.
- Same-canvas comparison QA passed with P0 = 0, P1 = 0, P2 = 0; root `design-qa.md` says `final result: passed`.

## Repository state and exclusions

- Worktree: `/Users/king/.codex/worktrees/beb4/agenthub`.
- Branch: `task/agenthub-public-site-i3_2026-08-24`.
- HEAD: `ae3dc2e7ca74cfb9562a86cda913e60dab213baa`.
- State: intentionally dirty and uncommitted.
- Preview: local port 3002 remains available for visual acceptance.
- No dependency, lockfile, Next/TypeScript/Tailwind config, backend/API/auth protocol, credential, commit, push, merge, deployment, test environment, or production environment change.
- The reference site's mobile reload later returned a closed connection; the user-provided 390×844 source capture and exact DOM/style/interaction snapshot were used for the mobile source comparison. The complete implementation itself was verified live at 390×844.

## R3 full-site truthfulness audit addendum

- New audit report: `docs/qa/reports/lyn-005-i3-site-audit-r3/audit.md`.
- New before/after evidence: `docs/qa/images/lyn-005-i3-site-audit-r3/`.
- The supplied incorrect Hero was treated as P1 regression evidence. A fresh browser run confirmed the current uncommitted implementation already contains the approved creator-first Hero, navigation, truthful stages, scenarios, intent, and footer.
- Added exact negative contract assertions for `800+`, `27K+`, management navigation, pricing, documentation, platform login, and the copied management headline/capability language; existing `40K` and `15K` protections remain.
- Re-audited `/`, `/login`, `/register`, anonymous `/assets/create`, all top-level workspace centers, guided creation, and Demo Agent `32` overview/build/test/versions/distribution/memory at the relevant desktop/mobile viewports.
- No homepage marketing style leaked into authentication or workspace pages. Live-mode backend-unavailable pages showed honest error/loading boundaries; Demo-mode after captures used only repository fixtures.
- Same-canvas QA and current-run screenshots clear all P0/P1/P2 findings. Two P3 limits remain documented: browser media emulation/full keyboard traversal and the dense but contained 390px Agent build workspace.

## R4 scoped typography revision

- Changed only `PublicLandingPage` typography styles plus focused contract/spec/QA artifacts; authentication, invitation registration, workspace, and Agent Asset fonts remain untouched.
- Added landing-scoped `--font-body` and `--font-display` local system stacks. No dependency, lockfile, remote font, global font, or engineering configuration changed.
- Hero and section headings moved from weight 900 and highly compressed tracking to weight 800 with desktop/mobile optical tracking. Navigation and buttons use 600–700, role/product titles use 720, and supporting copy uses 400–450 with relaxed leading.
- Added `src/modules/landing/public-landing-typography.test.ts` to protect the exact local stacks, scoped root, display hierarchy, restrained tracking, and absence of weight 900/legacy Arial-first root treatment.
- Before/after, focused-section, and source/implementation comparison evidence is stored in `docs/qa/images/lyn-005-i3-typography-r4/`; the complete report is `docs/qa/reports/lyn-005-i3-typography-r4/design-qa.md`.
- At 1440 × 1000 and 390 × 844 the Hero remains two lines, card/stage/intent/footer copy remains contained, document widths equal client widths, and console errors remain zero. P0/P1/P2 = 0 and root `design-qa.md` remains `final result: passed`.
- R4 gates passed: lint, typecheck, 93 test files / 467 tests, production build, OpenSpec strict 37/37, and `git diff --check`.

## R6 role-asset scale revision

- Removed the visible current-role summary paragraph below the role carousel controls from the DOM; the existing count span now announces the current role through `aria-live="polite"`, `aria-atomic="true"`, and an updated `aria-label`.
- Desktop focus card changed from 330 × 500 to 280 × 410; mobile changed from 248 × 365 to 212 × 300. Carousel/layer heights, card copy, shadows, and near/far offsets were reduced proportionally while the established depth scales and all carousel behavior stayed intact.
- Browser evidence at 1440 × 1000 and 390 × 844 shows no clipping, overlap, or horizontal overflow; console errors remain 0. Side selection, shared three-second autoplay, hover pause, and focus-within pause passed live; hidden/reduced-motion/transition pause conditions remain covered by shared tests.
- Visual truth, exact before/after captures, and same-canvas comparisons: `docs/qa/design-reference/lyn-005-i3-role-scale-r6/` and `docs/qa/images/lyn-005-i3-role-scale-r6/`.
- Complete QA and geometry report: `docs/qa/reports/lyn-005-i3-role-scale-r6/`.
- R6 changed only the landing role-asset component/style and its contracts/QA/OpenSpec artifacts; all other page sections and product surfaces remained untouched.
- R6 gates passed: lint, typecheck, 93 test files / 469 tests, production build with 19 static pages, OpenSpec strict 37/37, and `git diff --check`.

## R7 Hero bottom cleanup revision

- Removed the Hero-only four-stage trail and its four links, plus the two lower portrait cards identified by the user annotation. All related desktop/mobile CSS was deleted rather than hidden.
- Desktop Hero now measures 820 px instead of 948 px at 1440 × 1000; mobile measures 760 px instead of 844 px at 390 × 844. Text and retained right-side portraits were lifted/rebalanced, and the next role-assets section begins within the natural viewport transition.
- The downstream formal five-stage flow remains complete and interactive. Header anchors and the real `#create` CTA scroll target are unchanged.
- Evidence and detailed QA: `docs/qa/design-reference/lyn-005-i3-hero-cleanup-r7/`, `docs/qa/images/lyn-005-i3-hero-cleanup-r7/`, and `docs/qa/reports/lyn-005-i3-hero-cleanup-r7/`.
- R7 gates passed: lint, typecheck, 93 test files / 469 tests, production build with 19 static pages, OpenSpec strict 37/37, and `git diff --check`.

## R8 whole-page cohesion revision

- Fresh audit evidence identified and fixed the Hero/role hard seam, role/flow 72px desktop and 52px mobile dead gap, inconsistent flow alignment, abrupt 460vh-to-192px desktop scenario compression, inconsistent primary-action height, and mobile intent/footer tail.
- Added one landing-scoped 1320px content rail, shared 9% boundary, shared cinematic shadow, 48px primary action height, a 20px desktop Hero/role tuck-under, a readable about-282px desktop scenario band, and a shorter 531px mobile intent close.
- Preserved the exact 280×410 desktop and 212×300 mobile role cards, all carousel pause semantics, the five stages, real anchors, intent behavior, and login/invitation `/assets/create` continuation. Deleted Hero and role-summary nodes remain absent.
- Evidence and reports: `docs/qa/design-reference/lyn-005-i3-cohesion-r8/`, `docs/qa/images/lyn-005-i3-cohesion-r8/`, and `docs/qa/reports/lyn-005-i3-cohesion-r8/`.
- R8 gates passed: lint, typecheck, 93 test files / 470 tests, production build with 19 static pages, OpenSpec strict 37/37; final `git diff --check` recorded after documentation completion.
# LYN-005-I3 R9 Hero Perspective Matrix update

- Replaced the Hero's conflicting three-portrait composition with one unified five-card perspective matrix.
- Added five independent 1086 × 1448 project-local raster studies covering cinematic strategist, cel anime, game concept art, non-human robot, and painterly fantasy.
- Removed the green atmosphere from the left copy field; navigation, copy, CTA, Hero height, and every downstream section remain unchanged.
- Desktop central CSS card: 340 × 468 in a 1400px perspective; mobile central card: 190 × 264 plus three supporting cards in a 900px perspective.
- Full gates passed: lint, typecheck, 93 files / 470 tests, build, OpenSpec strict 37/37, and diff check.
- Browser: 1440 × 1000 and 390 × 844, console errors 0, no horizontal overflow. Local/LAN preview remains on PID 75472 at `*:3002`.
- Detailed report: `docs/qa/reports/lyn-005-i3-hero-array-r9/completion-report.md`.

---
# LYN-005-I3 R12 Hero supplied-composite addendum

- Added the exact user-supplied `1449 × 1086` composite at `public/images/agenthub-site/hero-role-collage-r12.png` and serve it unoptimized as the sole Hero role visual.
- Removed the eleven Hero card nodes and all R10/R11 wall-plane, perspective, X/Y/Z rotation, Z-lift, focal geometry, mask, crop, and luminance reconstruction rules.
- Desktop bounds: approximately `1094.55 × 820px`; mobile bounds before clipping: `560 × 420px`. Hero `820/760px`, copy, navigation, CTA, and the complete downstream page remain unchanged.
- Evidence and reports: `docs/qa/images/lyn-005-i3-hero-composite-r12/` and `docs/qa/reports/lyn-005-i3-hero-composite-r12/`.

# LYN-005-I3 R13 independent Hero-card addendum

- Superseded the R12 runtime composite with twelve data-driven independent card containers and image nodes, while retaining the supplied whole composition only as QA reference.
- Reused the five existing R9 role rasters with per-slot crop/scale. Shared two-dimensional `skewX(-10deg) rotateZ(2deg)`, calibrated visible envelopes, z-index, brightness tiers, outline, and neutral shadow reproduce the reference geometry without perspective or 3D transforms.
- Removed `public/images/agenthub-site/hero-role-collage-r12.png`; the public runtime has zero references to it.
- Desktop shows twelve cards on a `1094.09 × 820px` stage; mobile retains twelve DOM nodes and shows six, with no horizontal overflow.
- Evidence and reports: `docs/qa/images/lyn-005-i3-hero-cards-r13/` and `docs/qa/reports/lyn-005-i3-hero-cards-r13/`.
- Browser console errors 0; overflow 0; navigation/CTA passed. Lint, typecheck, 93 files / 470 tests, build, OpenSpec strict 37/37, and diff check passed.

final result: passed

---

# LYN-005-I3 R17 reference-perfect Hero addendum

- Normalized the supplied 3006×1468 Retina reference to the exact 1503×734 CSS truth viewport and rebuilt only the Hero; R16 and every downstream section remain unchanged.
- The final layout aligns the 130px content rail, header, exact three-line management title, support copy, CTA, status rail, and proof rail to the reference.
- The Hero renders twelve independent role-card nodes with twelve unique role raster sources. Shared projection is `skewX(-12deg) rotateZ(1deg)`; final focal visual bbox is x764.2/y47.4/590.7×558.5.
- Pass 3's creative-director demo remained a P1 identity/costume mismatch. Pass 4 uses `hero-main-reference-r18.png`, a 1200×1420 source-density homography extraction of only the reference focal-card interior; it preserves the exact long hair, forward gaze, zippered technical jacket, warm light, lime details, shoulder line, and chest-to-head ratio without importing the Hero or role-wall composite.
- Four independently generated black-scene studies remain for the missing headset woman, senior scientist, young operator, and silver-haired fantasy woman. Rounded fantasy and alpaca companion remain distinct supporting sources; generated and extracted assets require a public-use decision before deployment.
- Fake scale metrics remain absent. Truthful `05 / DEMO / LIVE` labels preserve density, and all reference-like labels point only to real AgentHub anchors or `/login?next=%2Fassets%2Fcreate`.
- Evidence: `docs/qa/design-reference/lyn-005-i3-hero-perfect-r17/`, `docs/qa/images/lyn-005-i3-hero-perfect-r17/`, and `docs/qa/reports/lyn-005-i3-hero-perfect-r17/`.
- Pass 4 evidence: `docs/qa/images/lyn-005-i3-hero-perfect-r17/comparison/pass4-full.png`, `pass4-right-focus.png`, and `pass4-main-focus.png`.
- Gates: lint, typecheck, 93 files / 470 tests, production build, OpenSpec strict 37/37, and `git diff --check` passed. Fresh final Browser console is 0 error / 0 warning. PID 75472 remains on `*:3002`; local and LAN URLs return HTTP 200.

final result: passed

---

# LYN-005-I3 R15 responsive Hero-wall width addendum

- Replaced the desktop Hero stage's fixed 1094px height-derived width with `clamp(1094px, 76vw, 1600px)` and vertical centering. The frozen 820px Hero now crops the wider stage above and below at large viewports.
- Stage width remains 76.00% at 1440, 1680, 1920, and 2048; visible role-wall width remains 57.89%, with the left edge between 40.03% and 40.65% of the viewport.
- Preserved the twelve R13 card nodes, every slot/crop/matrix/z-index/image, Hero copy/navigation/CTA, downstream page, and R14 intent layout. Mobile explicitly resets the desktop translation and remains 560×420 with six visible cards.
- Evidence and reports: `docs/qa/images/lyn-005-i3-hero-width-r15/` and `docs/qa/reports/lyn-005-i3-hero-width-r15/`.

final result: passed

---

# LYN-005-I3 R14 creation-intent spacing addendum

- Limited the revision to the `04 / START WITH INTENT` title DOM and intent-section spacing; Hero/R13, other sections, Footer styling/content, form logic, routes, colors, and imagery remain frozen.
- Replaced the hard `<br>` with two explicit title spans. Desktop holds each phrase on one line at `57.6px / 67.968px` with a measured 23px visible glyph gap; mobile uses `38px / 45.6px` and a natural three-line result.
- Desktop rhythm is `34 / 32 / 48 / 26 / 18px`; mobile rhythm is `28 / 24 / 34 / 20 / 16px`, read as kicker→heading→subtitle→input→suggestions→metadata.
- Evidence and reports: `docs/qa/images/lyn-005-i3-intent-spacing-r14/` and `docs/qa/reports/lyn-005-i3-intent-spacing-r14/`.

final result: passed

---
