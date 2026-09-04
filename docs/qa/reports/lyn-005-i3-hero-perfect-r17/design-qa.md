# LYN-005-I3 R17 Hero design QA

## Scope

Only the public landing Hero was changed. R16 intent cleanup and every section below the Hero are frozen. Authentication, API, workspace, Agent pages, dependencies, lockfile, and configuration are untouched.

## Fresh audit and iteration record

1. **Reference capture — healthy.** Opened the original 3006×1468 file, normalized it to 1503×734, and produced a measured grid. Evidence limitation: raster inspection cannot prove the source site's DOM, but R17 explicitly makes the supplied image the only visual truth.
2. **R16/R13 before — P1.** Fresh `before/desktop-1503x734.png` showed the prior creator headline, sparse proof region, and a role wall whose focal card did not match the new reference's placement or density.
3. **R17 pass 1 — P1/P2.** The three-line headline and twelve-card wall were in place, but the body/CTA/status/proof group was 15–30px too high; the focal card was roughly 50px too far right and about 20px too short. The mid and lower role rows also began too far right.
4. **R17 pass 2 — P1.** Geometry was aligned, but the focal portrait remained a purple/blue-rim-lit black-turtleneck character rather than the reference's warm-lit tactical creative director. Supporting slots also repeated sources and did not preserve the reference's role semantics. This blocked completion even though the wall envelope was close.
5. **R17 pass 3 — P1.** The supporting role semantics were corrected, but the focal `role-creative-director-demo.png` still had a tied-back hairstyle, upward gaze, formal blazer silhouette, and different face/shoulder ratio. The pass-3 main-focus board made this source-level mismatch obvious, so the earlier passed result was withdrawn.
6. **R18 pass 4 — passed.** The focal card interior was extracted only from the user-supplied 3006×1468 source. A single source-to-rectangle homography used measured outer-corner intersections near `(1840,90)`, `(2745,155)`, `(1560,1110)`, and `(2505,1210)`; a post-warp inset removed the original frame and neighboring-card fragments. The resulting 1200×1420 independent raster preserves the exact long hair, forward gaze, black zippered technical jacket, warm rim light, lime details, face scale, shoulder line, and chest-to-head ratio. Runtime CSS applies no image-level tilt or zoom (`50% 50% / scale(1)`); only the unchanged shared card transform is used.
7. **Responsive/interaction — passed.** 1503×734 and 390×844 retain a clean black copy field, cropped independent-card wall, readable title, real login continuation, and no horizontal overflow. The mobile wall keeps seven visible independent nodes and does not fall back to a composite image.

## Product-truth substitution

The reference's 800+, 40K+, 15K+, and 27K+ values have no verifiable AgentHub source. They are not rendered. Equal-density truthful labels — `05 / 创作阶段`, `DEMO / 示例资产`, and `LIVE / 登录后读取` — preserve the layout without presenting invented online facts. Header labels match the reference rhythm but resolve only to existing anchors or `/login?next=%2Fassets%2Fcreate`; no price, documentation, customer, or fabricated destination was added.

## Assets

- Reused existing independent rasters for the glasses strategist, orange-haired game host, game architect, robot, anime curator, rounded fantasy character, and alpaca companion.
- Added `public/images/agenthub-site/hero-main-reference-r18.png`, a 1200×1420 perspective-corrected extraction of only the focal-card interior from the user-provided reference. It contains no Hero copy, navigation, metrics, neighboring role card, outer frame, sprite, or composite wall content.
- Generated four missing independent 1024×1536 black-scene rasters: `hero-headset-operator-r17.png`, `hero-senior-scientist-r17.png`, `hero-young-operator-r17.png`, and `hero-silver-fantasy-r17.png`. Each uses cinematic black technical/fantasy styling, warm facial light, restrained yellow-green accents, and no text, logo, watermark, or colored halo. Every file was opened and visually reviewed before use.
- The Hero runtime has twelve independent `data-hero-role-card` image/container nodes, twelve unique sources, one focal marker, and no composite, sprite, canvas, background slice, perspective, rotateX/Y, or translateZ.
- The extracted focal asset and generated role assets are limited to current local acceptance. Their rights/public-use status must be confirmed before any public release or deployment. This task remains local and uncommitted.

## Evidence

- Before: `docs/qa/images/lyn-005-i3-hero-perfect-r17/before/desktop-1503x734.png`.
- Final truth viewport: `docs/qa/images/lyn-005-i3-hero-perfect-r17/after/desktop-1503x734-pass4.png`.
- Responsive: `after/mobile-390x844-pass4.png`; unchanged wide-screen wall geometry remains covered by the prior 1440×900 and 1920×1080 captures.
- Same-canvas comparison: `comparison/pass4-full.png`, `comparison/pass4-right-focus.png`, and `comparison/pass4-main-focus.png`.
- Pass history: `after/desktop-1503x734-pass1.png`, `pass2.png`, `pass3.png`, and final `pass4.png`.

## Findings

- P0: 0.
- P1: 0.
- P2: 0.
- Image fidelity: the focal subject now derives pixel-for-pixel from the supplied reference card interior; remaining differences are limited to normal resampling through the 1200×1420 rectification and browser image pipeline, not subject identity, clothing, pose, gaze, or card composition.
- Console: 0 errors, 0 warnings; React DevTools emits one development-only info message.
- Accessibility: semantic H1/section, decorative empty-alt card images, named links, skip link, visible focus styles, and reduced-motion override remain present. Screenshot QA cannot prove every assistive-technology announcement; contracts cover the DOM and names.

final result: passed
