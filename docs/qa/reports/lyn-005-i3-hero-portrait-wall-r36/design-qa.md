# LYN-005-I3 R36 Portrait-ratio Hero Wall QA

## Scope and visual diagnosis

- Scope is limited to the `PublicLandingPage` Hero role wall and its focused contracts. Hero copy, navigation, CTA, proof, all twelve unique sources, Role Assets and every downstream section remain unchanged.
- R35 used independently authored width and height percentages. The main frame was about 438 × 484 CSS px before rotation (ratio 0.91), so the 2:3 login portrait occupied only about 74% of the frame width under `contain`, leaving roughly 26% as geometric side letterbox. Several supporting cards were even closer to square.
- R36 fixes the cause: every `.heroRoleCard` owns `aspect-ratio: 2 / 3`; individual slots provide only position and width. Images remain `contain` with equal-axis scale and translation.

## Final geometry

- Desktop stage is unchanged at `right: 5vw`, `width: clamp(1024px, 80vw, 1600px)`, `aspect-ratio: 1449 / 1086`. At 1440 × 900 the measured stage is 1152 × 863.4 at x205/y18.3.
- Main card is `left: 58%`, `top: 15%`, `width: 30%`, yielding a 345.6 × 518.4 frame (exact 2:3). Its post-rotation bounding box is 363.5 × 530.1 at x864.2/y141.9. The login portrait remains centered at `scale(.99)` and keeps the full hair, chin and shoulder line with approximately 9% top breathing room.
- Supporting cards use 17.5–18% stage widths. Three staggered upper cards, three middle neighbors and five lower cards form continuous diagonal bands; the lower envelope begins near x465 and reaches the viewport edge, about 67.7% of the 1440px viewport before the existing black safety mask.
- Mobile keeps seven independent nodes. The stage is 540 × 405 at `top: 430px/right: -44px`; the main frame is 183.6 × 275.4 (`47.1vw`) at `left: 58%/top: 14%`, with six supporting cards independently composed around it.

## Image and transform proof

- All twelve source images load on desktop; all seven displayed mobile images load. Main remains `/images/login-agent-portrait.png`; `bottom-fantasy` remains the silver guardian; `hero-main-r32.webp` is absent.
- Frame/image compensation remains paired at desktop −8°/+8° and mobile −5°/+5°. Composed supporting axes are 1.03/1.03 and main axes are 1.0197/1.0197; axis dot product is 0. There is no residual shear or non-uniform scale.
- The first visual pass removed the R35 square-frame letterbox and produced a compact adjacent wall without clipped heads, exposed raster edges or text-area intrusion. No follow-up correction was required.

## Browser and accessibility review

- Desktop/mobile horizontal overflow: 0/0. Console errors: 0/0.
- CTA href remains `/login?next=%2Fassets%2Fcreate`; navigation and focus behavior are unchanged.
- Copy contrast remains protected by the existing black mask. Role imagery is decorative and retains empty alt text. Reduced-motion behavior is unaffected because R36 adds no movement.

## Evidence

- Before: `docs/qa/images/lyn-005-i3-hero-portrait-wall-r36/before/`
- Final: `docs/qa/images/lyn-005-i3-hero-portrait-wall-r36/after/`
- Same-canvas desktop/mobile comparisons: `docs/qa/images/lyn-005-i3-hero-portrait-wall-r36/comparison/`
- Browser metrics: `docs/qa/reports/lyn-005-i3-hero-portrait-wall-r36/metrics.json`

## Findings

- P0: 0
- P1: 0
- P2: 0
- Gates: focused Vitest 20/20, full Vitest 93 files / 473 tests, lint, typecheck, production build (19 pages), OpenSpec strict 37/37 and `git diff --check` passed.
- Preview: PID 36889 listens on `*:3002`; both `127.0.0.1:3002` and `192.168.0.14:3002` return HTTP 200.

final result: passed
