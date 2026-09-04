# LYN-005-I3 R8 · PublicLandingPage design QA

## Comparison target

- Source visual truth: `docs/qa/images/lyn-005-i3-cohesion-r8/before/desktop-full-1440x1000.png` and `docs/qa/images/lyn-005-i3-cohesion-r8/before/mobile-full-390x844.png`, supported by the current-run numbered viewport captures.
- Implementation: `docs/qa/images/lyn-005-i3-cohesion-r8/after/desktop-full-1440x1000.png` and `docs/qa/images/lyn-005-i3-cohesion-r8/after/mobile-full-390x844.png`.
- Viewports: 1440×1000 and 390×844 CSS pixels, deviceScaleFactor 1.
- Pixel dimensions: desktop before 1440×6858, desktop after 1440×6879; mobile before 390×4522, mobile after 390×4404. Numbered viewport captures are exactly 1440×1000 and 390×844.
- State: anonymous public homepage, dark theme, creation-intent form visible. The matched mobile role comparison fixes both sides to `知序`.
- Full-view comparison: `comparison/desktop-full-before-after.png`, `comparison/mobile-full-before-after.png`.
- Focused comparisons: `comparison/desktop-assets-to-flow-before-after.png`, `comparison/desktop-flow-to-scenarios-before-after.png`, `comparison/desktop-intent-to-footer-before-after.png`, `comparison/mobile-assets-to-flow-matched-before-after.png`, and `comparison/mobile-intent-before-after.png`.

## Findings and iteration history

1. **Initial audit — blocked**
   - P1: a content-free 72px desktop / 52px mobile gap separated role assets from the formal creation flow.
   - P1: the 460vh desktop flow collapsed directly into a 192px scenario strip with 9–10px supporting text.
   - P2: the flow title rail started around x=79 while the other main sections used the 1320px/x=60 content rail.
   - P2: Hero→assets and intent→Footer used inconsistent boundaries; mobile intent retained an excessive blank tail.
   - P2: main action heights were 44px and 46px instead of one consistent primary-action size.

2. **Fixes applied**
   - Tucked the role surface 20px behind the framed Hero while preserving the Hero's exact 820px/760px height and all retained imagery.
   - Removed both role→flow margins and added one shared subtle boundary token.
   - Added a landing-scoped 1320px content rail; aligned flow, scenario, intent, and Footer gutters to it.
   - Expanded desktop scenarios to about 282px, increased visible copy to 10–11px, and softened the stage shadow.
   - Unified primary actions to 48px and tightened mobile intent to about 531px without changing its content or continuation routes.
   - Preserved role cards at exactly 280×410 desktop and 212×300 mobile; no Hero trail, lower portraits, or role summary returned.

3. **Post-fix comparison — passed**
   - P0 = 0, P1 = 0, P2 = 0.
   - Desktop section geometry: Hero 820px; role assets 625px including the 20px tuck-under; flow 4600px; scenarios about 282px; intent 476px; Footer 70px.
   - Mobile section geometry: Hero 760px; role assets 807px; flow 1319px; scenarios 902px; intent 531px; Footer 86px.
   - Both viewports have zero horizontal document overflow.

## Required fidelity surfaces

- Fonts and typography: the approved landing-scoped SF Pro/PingFang system stacks remain unchanged; heading weights and wrapping remain stable. Scenario microcopy is now readable at the intended density.
- Spacing and layout rhythm: the shared 1320px rail, zero role→flow dead gap, stronger desktop scenario band, and tighter mobile close remove the visible discontinuities.
- Colors and tokens: near-black/off-white/lime palette is unchanged; a shared 9% white boundary and shared cinematic shadow reduce arbitrary surface changes.
- Image quality and asset fidelity: all existing raster portraits and atmosphere assets remain in their established crop. No raster, inline SVG, CSS art, or placeholder asset was added.
- Copy and content: all creator-first copy, example/demo boundaries, five real stages, scenarios, intent disclosure, and real login/invitation routes are unchanged.
- Responsiveness: desktop and mobile were captured independently; card sizes, mobile stacking, and document widths remain stable.
- Accessibility: semantic headings, labels, buttons, live carousel count, focus styles, 44px+ mobile controls, and reduced-motion CSS/contracts remain. Inactive desktop stage text opacity increased from .2 to .34 for better visibility.

## Interaction and browser verification

- Header `角色资产` anchor landed with the section top at 82px.
- Hero `开始创建` reached the real creation-intent section.
- Side-card `聚焦 墨衡` and progress controls changed the accessible current role.
- Focus-within kept `知序` stable for more than 3.4 seconds; 3-second autoplay and all pause conditions remain covered by shared tests.
- Five-stage control switched to `发布运行` and updated the product panel.
- Creation intent submitted to the local summary and exposed `/login?next=%2Fassets%2Fcreate` plus `/register?next=%2Fassets%2Fcreate`.
- Browser console errors: 0. Development console retained one non-blocking Next image LCP warning; the above-the-fold Hero instance already has `priority`, and production build is clean.
- Reduced motion is covered by landing/shared-carousel tests and the scoped CSS media rule; the in-app browser did not expose media-feature emulation.

## Evidence limitation

The in-app Browser's `fullPage` stitch repeats the sticky stage. Full-page canvases are used for section order and total length; all sticky-stage visual decisions use the inspected numbered same-viewport captures.

final result: passed
