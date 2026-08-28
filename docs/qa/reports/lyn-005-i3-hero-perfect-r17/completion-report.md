# LYN-005-I3 R17 completion report

## Implemented

- Rebuilt only `PublicLandingPage` Hero against the normalized 1503×734 reference.
- Matched the 130px header/content rail, transparent header rhythm, exact three-line title, two-line support copy, single CTA, avatar/status rail, and three-column proof density.
- Recalibrated the role wall to twelve data-driven independent cards with twelve unique raster sources, a shared two-dimensional transform, reference-aligned edge crops, and a 590.7×558.5 focal visual envelope at x764.2/y47.4.
- Replaced the still-mismatched pass-3 focal portrait with `hero-main-reference-r18.png`, a 1200×1420 homography-corrected extraction of only the supplied reference card interior. Runtime uses `50% 50% / scale(1)` and therefore does not double-transform the already rectified content.
- Added four independently generated missing role studies: headset operator, senior scientist, young operator, and silver-haired fantasy woman. Existing rounded-fantasy and alpaca studies remain independent role inputs.
- Preserved all downstream R16 content and interactions.

## Real link mapping

- Logo → `#top`.
- 管理能力 / 产品边界 → existing `#product` product stage.
- 运营流程 → existing `#flow` anchor.
- 使用场景 → existing `#scenarios`.
- 角色资产 → existing `#assets`.
- 创建 → existing `#create` intent section.
- 登录平台 / 进入工作台 → `/login?next=%2Fassets%2Fcreate`; browser click reached that exact route.

## Verification

- 1503×734: reference truth viewport plus pass-4 full, wall, and main-focus same-canvas comparisons passed.
- 1440×900 and 1920×1080: full-height wall, copy safety and edge cropping passed.
- 390×844: independent seven-card visible composition, readable copy/CTA, and no document overflow passed.
- DOM: twelve role cards, twelve unique sources, one explicit main card, no R12 composite runtime reference.
- Console: 0 error / 0 warning.
- Automated gates: lint passed; typecheck passed; 93 test files / 470 tests passed; production build passed with 19 static pages; OpenSpec strict passed 37/37; `git diff --check` passed.
- Browser: fresh final tab reports 0 errors / 0 warnings. CTA click reached `/login?next=%2Fassets%2Fcreate`.
- Preview: PID 75472 listens on `*:3002`; both `http://127.0.0.1:3002/` and `http://192.168.0.14:3002/` returned HTTP 200.

## Files

- `src/modules/landing/public-landing-page.tsx`
- `src/modules/landing/public-landing-page.module.css`
- `src/modules/landing/public-landing-page.test.tsx`
- `src/modules/landing/public-landing-typography.test.ts`
- `public/images/agenthub-site/hero-rounded-fantasy-r17.png`
- `public/images/agenthub-site/hero-alpaca-companion-r17.png`
- `public/images/agenthub-site/hero-headset-operator-r17.png`
- `public/images/agenthub-site/hero-senior-scientist-r17.png`
- `public/images/agenthub-site/hero-young-operator-r17.png`
- `public/images/agenthub-site/hero-silver-fantasy-r17.png`
- `public/images/agenthub-site/hero-main-reference-r18.png`
- R17 OpenSpec and QA artifacts under `openspec/changes/add-agenthub-public-site/` and `docs/qa/**/lyn-005-i3-hero-perfect-r17/`.

The extracted focal asset is for this local acceptance task only. Public release requires explicit rights/asset authorization confirmation. No commit, push, merge, deployment, dependency, lockfile, project-config, API, or authentication change was made.
