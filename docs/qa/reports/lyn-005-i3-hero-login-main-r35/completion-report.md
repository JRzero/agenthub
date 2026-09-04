# LYN-005-I3 R35 completion report

## Result

The public landing Hero now uses the actual login-page role portrait as its central card, with a complete contained composition rather than a cropped cover treatment. R34 wall geometry and every downstream section remain unchanged.

## Code changes

- `src/modules/landing/public-landing-page.tsx`
  - `main` → `/images/login-agent-portrait.png`, scale `.92`, offsets `0 / 0`.
  - `bottom-fantasy` → `hero-silver-world-guardian-r32.webp`, scale `1.04`, offsets `0 / +1%`.
  - `hero-main-r32.webp` is no longer consumed by the Hero wall.
- `src/modules/landing/public-landing-page.module.css`
  - main-card image contract changed from `cover` to explicit `contain`.
- Landing tests now cover the mixed stable source roots, twelve unique images, exact slot mapping and contained main framing.

## Visual result

- Desktop and mobile retain the R34 card size, position, tilt and wall shift.
- The login role keeps its original face, hairstyle, black clothing and black background.
- Equal-axis `.92` framing yields approximately 10% top breathing room without cutting hair, chin or shoulders.

## Verification

- Focused Vitest: 20/20 passed.
- Browser: desktop 12/12 and mobile 7/7 visible assets loaded; unique source count 12; console errors 0; overflow 0.
- Full Vitest: 93 files / 473 tests passed.
- Lint, typecheck, production build (19 generated pages), OpenSpec strict 37/37 and `git diff --check` passed.
- Preview PID 58584 listens on `*:3002`; localhost and `192.168.0.14` both return HTTP 200 with the expected title.

## Boundaries

- No new or generated asset, dependency, configuration, route, API, authentication, commit, push, merge or deployment.

final result: passed
