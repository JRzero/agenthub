# LYN-005-I3 R40 Public Landing Combined Audit

## Audit scope

- Surface: `PublicLandingPage` at `http://127.0.0.1:3002/`.
- User goal: read the five creation stages and reliably activate compact landing-page controls without changing the approved visual composition.
- Accessibility target: readable inactive content, visible keyboard focus, practical pointer/touch targets, reduced-motion preservation, and no responsive overflow.
- Fresh evidence: 1440 × 1000 desktop and 390 × 844 mobile captures in `docs/qa/images/lyn-005-i3-accessibility-r40/`.

## Numbered audit

1. **Header and Hero — healthy locally; test release is stale.** The current branch contains R39 and renders the lime login label as `rgb(7, 8, 6)` in its default and focus states. The test site still serves the old combined hover selector, so its lime-on-lime hover defect requires a later test deployment rather than another code rewrite. CTA routes and approved Hero geometry remain unchanged.
2. **Role assets — healthy after target-size fix.** Carousel cards, arrows, autoplay, and visual progress lines remain unchanged. The five progress buttons retain a 44 × 20px visible box on desktop and 34 × 20px on mobile, while transparent hit layers provide 44 × 44px effective targets. The initial visible role image is marked priority to remove the captured Next.js LCP warning without altering imagery or layout.
3. **Creation flow — P1 resolved.** Fresh baseline inspection measured inactive steps at opacity `.34` desktop and `.38` mobile. Their 10px descriptions were visibly too dim on black. Inactive steps now use `.8`; calculated composited contrast is approximately 11.83:1 for titles and 4.69:1 for descriptions, while the active stage remains opacity `1`, lime numbered, and spatially distinct.
4. **Intent examples — P2 resolved.** The visible chips remain 31px high with unchanged borders, radius, spacing, and copy. A transparent 7px vertical extension provides a 45px effective hit height; hover, focus-visible, fill behavior, and submission behavior are unchanged.
5. **Footer links — P2 resolved.** Desktop navigation links retain their original typography and 16.5px visual line box but receive 44.5px effective vertical targets. The footer brand reaches 48.5px desktop and 44px mobile. Link destinations and footer layout are unchanged.
6. **Responsive, focus, and motion — healthy.** Desktop reports `scrollWidth 1429 ≤ 1440`; mobile reports `379 ≤ 390`. Keyboard focus is visibly clear on the login control. A fresh final browser tab reports zero console errors and zero warnings at both requested sizes. The existing reduced-motion media contract remains present and unchanged.
7. **External timing — diagnostic only.** A read-only request to `https://agenthub-test.oyiioyii.com/` returned HTTP 200 with TLS 5.668s, TTFB 6.362s, and total 6.836s. The dominant delay occurred before response transfer, so this audit does not attribute it to landing-page rendering and makes no speculative frontend timing change.

## Strengths

- Approved black/lime composition, typography, routes, carousel behavior, stage switching, intent flow, and responsive reflow remain intact.
- Focus styling is centralized and highly visible.
- Hit-area changes use transparent component-owned layers, so visual geometry is preserved.

## Evidence limits

- This is a browser and source-contract audit, not a full assistive-technology certification.
- Screen-reader announcements, switch-control scanning, and physical-device touch accuracy were not directly exercised.
- The test environment was inspected read-only and was not deployed in this task.

## Final health

- P0/P1/P2 remaining: 0 / 0 / 0.
- Local implementation: passed.
- Independent follow-up: deploy the current task branch to the test environment so the already-committed R39 selector reaches the public test URL.
