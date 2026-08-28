# LYN-005-I3 R9 · Hero Perspective Matrix Design QA

## Comparison target

- Source visual truth: `docs/qa/design-reference/lyn-005-i3-hero-array-r9/source-annotated.png` (2942 × 1454 px).
- Implementation: `docs/qa/images/lyn-005-i3-hero-array-r9/after/desktop-1440x1000.png` and `after/mobile-390x844.png`.
- Viewports: 1440 × 1000 and 390 × 844 CSS px, deviceScaleFactor 1; implementation screenshots have matching pixel dimensions.
- State: anonymous public homepage at scroll position 0, default Hero state.
- Full comparison: `comparison/source-vs-final-full.png`.
- Focused comparison: `comparison/source-vs-final-focus.png`.
- Before/after evidence: `comparison/before-after-desktop-1440x1000.png` and `comparison/before-after-mobile-390x844.png`.

## Findings and iteration history

1. **Initial comparison — blocked**
   - P1: the three retained Hero portraits used conflicting `-5deg` and `+5deg` rotations, so the cards did not share one vanishing direction.
   - P1: all three subjects were similar realistic fashion portraits; anime, game-concept, non-human, and painterly treatments were absent.
   - P1: the central portrait retained green environmental lighting instead of a true black field with controlled purple/blue rim light.
   - P2: the full-width green atmosphere visibly entered the left copy safety field and made the mobile top half noisy.
   - P2: the primary card sat low/right inside the desktop array, while mobile mechanically reused the same three-person composition.

2. **Fixes applied**
   - Generated and visually reviewed five independent 1086 × 1448 raster studies: black-background cinematic strategist, cel-anime curator, AAA game-concept architect, non-human industrial robot, and painterly fantasy memory keeper.
   - Removed the Hero atmosphere image and kept the left copy field on the existing solid near-black Hero surface.
   - Rebuilt the right-side DOM matrix with one shared `rotateY(-10deg) rotateZ(4deg)` desktop system; the primary card remains centered while four supporting studies recede around it.
   - Re-composed 390 px as one 190 × 264 primary card plus three supporting cards under a 900 px perspective, rather than scaling the desktop matrix.
   - Added a semantic brand-example label without visible copy or fabricated online-asset claims.

3. **Post-fix comparison — passed**
   - P0 = 0, P1 = 0, P2 = 0.
   - Desktop Hero remains 1380 × 820 at x=30/y=26; visual cards begin at x≈787 while the headline ends at x≈820, with no imagery behind the title, body copy, or CTA.
   - Desktop primary transformed bounds are approximately 354 × 491 at x≈934/y≈237, centered within the right-side array and clear of the navigation.
   - Mobile Hero remains 390 × 760; the primary card begins at y≈452, 9 px below the CTA, and four cards remain visible without document overflow.

## Required fidelity surfaces

- Fonts and typography: unchanged. Hero display/body stacks, line breaks, weights, navigation, CTA baseline, and supporting-copy measures match R8.
- Spacing and layout: passed. Right-side cards share one axis; the primary card is central and no card enters the left copy field. Hero and downstream section geometry are unchanged.
- Colors and tokens: passed. The left field is clean near-black; the primary raster contains real purple/cobalt edge lighting on black. No CSS gradient, filter-built character light, or decorative CSS art was added.
- Image quality and asset fidelity: passed. All five studies are project-local raster assets with intentional vertical crops and distinct media. No hotlink, placeholder, inline SVG, handcrafted SVG, or code-drawn character asset is present.
- Copy and content: passed. Creator-first Hero copy, CTA, navigation, example boundary, five-stage flow, and all downstream content remain truthful and unchanged.
- Responsiveness: passed. 1440 and 390 document/client widths are equal; mobile uses one primary plus three supporting studies and no horizontal overflow.
- Accessibility and motion: passed. The decorative matrix has one meaningful example-only accessible label; it adds no focus targets or continuous motion. Existing global reduced-motion behavior remains intact.

## Interaction and browser verification

- Hero `开始创建` scrolled to the real `#create` intent section.
- The downstream formal five-stage control still exposes five buttons; selecting `发布运行` updated the product panel to `让版本走进真实场景`.
- Browser title: `AgentHub｜让一个想法，长成一个 Agent`.
- Browser console errors: 0.
- Horizontal overflow: 0 at 1440 × 1000 and 390 × 844.
- Local listener: PID 75472 on `*:3002`; both `127.0.0.1` and `192.168.0.14` returned HTTP 200.

## Evidence limitation

- Generated character studies remain local, uncommitted brand examples pending any separate public-use/licensing approval. No deployment was performed.
- The selected in-app browser does not expose media-feature emulation; reduced-motion is covered by the unchanged scoped media rule and automated contracts.

final result: passed
