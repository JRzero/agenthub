# LYN-005-I3 R5 full-page URL-to-code design QA

## Result

The live source was successfully opened and completely captured in the Codex in-app browser before implementation. The final AgentHub page follows the captured whole-page hierarchy and rhythm while replacing every business claim, state, and destination with existing AgentHub creator-first content and routes.

## Viewports and states

- Desktop: 1440 × 1000, Hero, approved role carousel, sticky flow stages 01–05, scenario strip, intent handoff, and footer.
- Mobile: 390 × 844, Hero, layered touch-safe role carousel, non-sticky product window, five stage buttons, stacked scenarios, intent handoff, and footer.
- Interaction states: carousel previous/next and side-card focus; three-second autoplay and pause conditions inherited from workbench helpers; desktop scroll-driven stages; mobile stage 05 selection; intent fill/submit; login and invitation continuation.
- Layout measurements: final mobile `clientWidth=390`, `scrollWidth=390`; final desktop `clientWidth=1440`, `scrollWidth=1440`.

## Same-canvas comparisons

- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/01-desktop-hero-side-by-side.png`
- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/02-desktop-assets-side-by-side.png`
- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/03-desktop-flow-side-by-side.png`
- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/04-desktop-bottom-side-by-side.png`
- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/11-mobile-hero-side-by-side.png`
- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/12-mobile-assets-side-by-side.png`
- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/13-mobile-flow-side-by-side.png`
- `docs/qa/images/lyn-005-i3-fullpage-r5/comparison/14-mobile-bottom-side-by-side.png`

## QA findings and fixes

- P1 fixed: the prior Hero was full-bleed and used a broad bottom ledger. It now uses the captured inset 25 px frame, compact transparent navigation, denser cinematic raster mosaic, three-line creator title, one CTA, and compact truthful stage hints.
- P1 fixed: the prior scenario section occupied roughly a full viewport. It now follows the captured compact desktop row with a left narrative column and three image-led scenes; mobile stacks the same three scenes.
- P1 fixed: the prior creation handoff was a left-title/right-panel SaaS layout. It now uses the captured centered heading, wide rounded intent control, quick prompts, and flat footer while retaining real session-only intent behavior.
- P2 fixed: the desktop footer was 112 px and the mobile footer carried a second navigation row. It now resolves to the captured 70 px desktop bar and compact mobile brand/copyright closure.
- P2 fixed: desktop/mobile Hero type now uses the live source's measured 820 weight, restrained `-.055em` tracking, and the local scoped system stacks.

## Fidelity review

- Typography: passed. Chinese weights, tracking, line breaks, button baselines, and body leading were reviewed at both target viewports; no clipping was found.
- Spacing/layout: passed. Order is Hero → role assets → five-stage flow → scenarios → intent → footer. Desktop uses the captured compact scenario/CTA/footer rhythm; mobile is independently recomposed.
- Visual hierarchy: passed. White creator headline, lime action/accent, dark cinematic images, sparse borders, and one dominant product stage match the reference hierarchy.
- Colors/effects: passed. Near-black, off-white, muted gray, and fluorescent lime remain locally scoped; no warm/coral legacy direction returned.
- Image treatment: passed. All visible character, atmosphere, and scenario content uses reviewed raster assets. No placeholder, inline SVG illustration, CSS figure drawing, or fake product raster was added.
- Copy accuracy: passed. No `800+`, `40K+`, `15K+`, `27K+`, price, docs, customer, satisfaction, runtime-volume, or management-only claim appears. Demo/static UI is explicitly labeled.
- Approved deviation: the role exhibition intentionally follows the user's 图 1 layered carousel rather than the reference's flat horizontal strip. Its extra height and depth are a product requirement, not a defect.

## Accessibility and behavior

- Semantic headings, named navigation, accessible carousel controls, `aria-current`, live regions, textarea label, skip link, and visible focus treatment remain present.
- Mobile stage 05 was activated with the visible button and the product panel updated correctly.
- Intent submission produced `意图已整理`; continuation links resolved to `/login?next=%2Fassets%2Fcreate` and `/register?next=%2Fassets%2Fcreate`.
- `prefers-reduced-motion` continues to disable smooth scroll, autoplay, transform displacement, and long transitions; focused Vitest coverage remains green.
- Browser console errors: 0. Document horizontal overflow: 0 at both target widths.

## Final findings

P0 = 0, P1 = 0, P2 = 0.

final result: passed
