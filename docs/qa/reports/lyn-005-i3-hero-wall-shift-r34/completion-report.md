# LYN-005-I3 R34 completion report

## Result

The complete Hero role wall now moves left as one stage while retaining the R33 three-track geometry. The silver world guardian is the central card, and the previous main role is preserved in `bottom-fantasy`; all twelve independent R32 assets remain unique.

## Files

- `src/modules/landing/public-landing-page.tsx`: main / bottom-fantasy source exchange and equal-axis framing parameters.
- `src/modules/landing/public-landing-page.module.css`: desktop and mobile stage offsets only.
- `src/modules/landing/public-landing-page.test.tsx`: asset/framing contract.
- `src/modules/landing/public-landing-typography.test.ts`: responsive stage-offset contract.
- `docs/qa/design-reference/lyn-005-i3-hero-wall-shift-r34/`: user annotation.
- `docs/qa/images/lyn-005-i3-hero-wall-shift-r34/`: before, after and same-canvas evidence.
- `docs/qa/reports/lyn-005-i3-hero-wall-shift-r34/`: audit, metrics and completion report.
- `design-qa.md`: root R34 verdict.

## Geometry and framing

- Desktop: right `0 → 5vw` (`72px` at 1440), stage x `277 → 205`, main x `879.25 → 807.25`.
- Mobile: right `-70px → -44px`, stage x `-91 → -117`, main x `207.37 → 181.37`.
- Main: silver guardian, scale `0.92`, offset `0 / +2%`.
- Bottom fantasy: prior main role, scale `1.12`, offset `0 / +3%`.

## Verification

- Focused Vitest: 20/20 passed; full Vitest: 93 files / 473 tests passed.
- Browser: 12/12 desktop and 7/7 mobile images loaded, overflow 0, console errors 0, CTA mapping unchanged.
- Lint, typecheck, production build (19 generated pages), OpenSpec strict 37/37 and `git diff --check` passed.
- Preview PID 58584 listens on `*:3002`; localhost and `192.168.0.14` both return HTTP 200 with the expected title.

## Boundaries

- Hero copy, navigation, CTA, proof, twelve slot geometries, transforms, RoleAssetShowcase and every downstream section remain unchanged.
- No image generation, dependency/config/API/auth change, commit, push, merge or deployment.

final result: passed
