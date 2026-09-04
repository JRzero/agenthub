# LYN-005-I3 R9 Hero Perspective Matrix completion report

## Outcome

The Hero now has one coherent right-side perspective matrix instead of three independently rotated portraits. The primary strategist is centered on a real black raster background with purple/cobalt rim light; the supporting cards provide cel-anime, game-concept, robotic, and painterly-fantasy contrast. The left copy field is clean near-black, and the mobile composition is independently arranged.

## Assets

- `public/images/agenthub-site/hero-main-strategist-r9.png` — cinematic strategist, black backdrop, purple/blue rim light.
- `public/images/agenthub-site/hero-anime-curator-r9.png` — cel-anime knowledge curator.
- `public/images/agenthub-site/hero-game-architect-r9.png` — AAA game-concept world architect.
- `public/images/agenthub-site/hero-robot-tester-r9.png` — non-human industrial dialogue tester.
- `public/images/agenthub-site/hero-fantasy-keeper-r9.png` — painterly fantasy memory keeper.

All five assets were generated with the built-in ImageGen path as independent 1086 × 1448 PNG rasters, copied into the workspace, and visually reviewed before use.

## Geometry and scope

- Desktop matrix: `left: 55%`, `perspective: 1400px`; shared `rotateY(-10deg) rotateZ(4deg)`; central CSS card 340 × 468.
- Mobile matrix: top 450px, 900px perspective; central CSS card 190 × 264 plus three supporting cards.
- Hero remains 820px at 1440 × 1000 and 760px at 390 × 844.
- Navigation, left copy, CTA, role carousel, sticky flow, scenarios, intent, footer, authentication, workbench, and Agent pages were not redesigned.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 93 files / 470 tests.
- `npm run build`: passed, 19 static pages generated.
- `openspec validate --all --strict`: passed, 37/37.
- `git diff --check`: passed.
- In-app browser: 1440 × 1000 and 390 × 844, console errors 0, horizontal overflow 0.
- Hero CTA and downstream five-stage control passed targeted interaction checks.
- Preview: PID 75472, `*:3002`; loopback and `192.168.0.14` returned HTTP 200.

## Boundaries

- No dependency, lockfile, engineering-config, API, authentication, login, registration, workbench, Agent-page, commit, push, merge, deployment, tunnel, test-environment, or production-environment change.
- Generated imagery is kept as local, uncommitted brand-example material pending any separate public-use approval.
