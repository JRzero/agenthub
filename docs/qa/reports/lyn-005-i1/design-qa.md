# LYN-005-I1 V4 Design QA — First Acceptance Refinement

- Task: `LYN-005-I1｜AgentHub 官网｜V4 交互前端首版`
- Review date: 2026-08-20
- Fixed visual reference: `docs/qa/design-reference/lyn-005-a-v4/direction-02-v4-1440w.png` (1440 × 3035)
- Motion reference: `docs/qa/design-reference/lyn-005-a-v4/direction-02-v4-motion-storyboard-1440w.png` (1440 × 2160)
- Higher-priority acceptance correction: “操作起来不够丝滑” and “能不能不要规规矩矩的边框模式”
- Desktop viewport: 1440 × 1000; browser content capture: 1429 × 992 at density 1
- Mobile viewport: 390 × 844; browser content capture: 379 × 820 at density 1
- State: production build, dark theme, product test state / active flow chapter / creator collage / empty and ready intent states

## Source and comparison evidence

The acceptance feedback overrides a mechanical reading of card borders in the old static reference. Each focused comparison is ordered left-to-right as fixed V4 direction, pre-feedback implementation, and first-acceptance refinement.

- Product proof comparison: `docs/qa/images/lyn-005-i1/acceptance-r1-compare-product.png` (1440 × 480)
- Creation flow comparison: `docs/qa/images/lyn-005-i1/acceptance-r1-compare-flow.png` (1440 × 480)
- Creator scenarios comparison: `docs/qa/images/lyn-005-i1/acceptance-r1-compare-scenarios.png` (1440 × 480)
- Final desktop product: `docs/qa/images/lyn-005-i1/acceptance-final-product-1440.png`
- Final desktop flow: `docs/qa/images/lyn-005-i1/acceptance-final-flow-1440.png`
- Final desktop scenarios: `docs/qa/images/lyn-005-i1/acceptance-final-scenarios-1440.png`
- Final desktop intent: `docs/qa/images/lyn-005-i1/acceptance-final-intent-1440.png`
- Final mobile product: `docs/qa/images/lyn-005-i1/acceptance-final-product-390.png`
- Final mobile flow: `docs/qa/images/lyn-005-i1/acceptance-final-flow-390.png`
- Final mobile scenarios: `docs/qa/images/lyn-005-i1/acceptance-final-scenarios-390.png`
- Hover evidence: `docs/qa/images/lyn-005-i1/acceptance-r1-scenarios-hover-1440.png`
- Intent-ready evidence: `docs/qa/images/lyn-005-i1/acceptance-r1-intent-ready-1440.png`

Focused regions are required because the full page is taller than one viewport and the Sticky section cannot be truthfully judged from browser-stitched full-page captures. The product, flow, scenario, intent, hover, and mobile states above are compared at their actual rendered viewport.

## Findings and comparison history

### Acceptance baseline — blocked

- [P1] Repeated decorative frames made the public site feel like a card dashboard.
  - Location: product tabs/window wrapper, five-step panels, creator scenarios, and intent panel.
  - Evidence: the pre-feedback product, flow, and scenario captures repeat equal rectangles, borders, and dividers across every narrative section.
  - Impact: brand storytelling was flattened into a backend showcase and the same visual container competed with the actual product UI.
  - Fix: retain one truthful product stage and the textarea affordance, but remove decorative outer frames; convert tabs to a text track, steps to open chapters, scenarios to a one-lead/two-support collage, and the CTA to an integrated field.

- [P1] Active flow panels changed grid tracks and minimum height.
  - Location: `.stepPanel` / `.stepPanelActive`.
  - Evidence: the previous active class moved from two to three columns and from 138 px to 218 px, creating visible reflow as scroll activation changed.
  - Impact: the Sticky story felt abrupt and could move content under the pointer or viewport.
  - Fix: give all desktop chapters one stable three-column footprint and reveal only the active state with opacity and transform; mobile keeps one stable active detail without animated height.

- [P2] Product and scroll state changes lacked interruption-safe continuity.
  - Location: product state panel and flow activation effect.
  - Evidence: product content was replaced in-place and flow activation depended on discrete IntersectionObserver entries; rapid changes could feel abrupt or allow scroll feedback to reclaim a manual step.
  - Impact: fast tab selection and click-then-scroll behavior did not feel reliably controlled.
  - Fix: stack all product states in one grid area with a fixed stage height; use opacity/transform transitions; schedule one geometry calculation per scroll frame against a stable focus line; preserve a 1100 ms manual-selection hold.

### Post-fix review — passed

- Product proof keeps one authentic bounded UI surface, while its navigation is now an unboxed text track with a restrained coral indicator and open surrounding glow.
- Five equal cards are gone. The left rail and large numbers form an open timeline; the right side shows one high-contrast chapter while adjacent chapters recede naturally.
- Creator scenarios now use a large lead image and two staggered support scenes, with copy directly over the imagery rather than three equal cards.
- The intent handoff is no longer wrapped in a large panel. Only the semi-transparent textarea retains an input boundary.
- No open P0, P1, or P2 findings remain.

## Required fidelity surfaces

| Surface | Result | Evidence and conclusion |
| --- | --- | --- |
| Fonts and typography | passed | Songti display headings and existing sans-serif interface copy preserve V4 hierarchy. Large editorial headings lead each open section; smaller inactive chapter copy recedes without losing the active text. |
| Spacing and layout rhythm | passed | Hard section dividers and repeated equal-card gutters were removed. Space, crop, background value, and asymmetric grid placement now separate the narrative. Product and desktop flow state footprints remain stable. |
| Colors and visual tokens | passed | The V4 ink-black, coral, violet, off-white, and muted steel palette is unchanged. Glows remain restrained and do not replace real imagery or controls. |
| Image quality and asset fidelity | passed | Existing task raster assets remain sharp and correctly cropped. No new placeholder, handcrafted SVG, CSS illustration, or div artwork was introduced. |
| Copy and content | passed | Original capability copy and honest session-only/auth handoff language are preserved. No unsupported capability or metric was added. |
| Interaction and motion | passed | Anchor/CTA scrolling, product tabs, step selection/scroll handoff, scenario hover, and intent state share a restrained 190–460 ms rhythm. Content transitions use opacity/transform; product height does not change during rapid tabs. |
| Responsive behavior | passed | At 390 px the document width is 379 px and scroll width is also 379 px. Product proof remains one stage, the five-step detail is operable, and the collage becomes three 347 px single-column scenes. |
| Accessibility and reduced motion | passed | Semantic tabs/buttons, textarea label, skip link, visible focus, and active state remain. Reduced motion disables automatic flow activation, smooth scrolling, animation, and transform displacement; targeted tests verify the immediate path. |

## Interaction verification

- Rapid product tabs on 390 px: panel height stayed `508.2890625 px → 508.2890625 px`; latest selection was “知识与技能”; no horizontal overflow.
- Rapid product tabs on the production desktop build: panel height stayed `493.09375 px → 493.09375 px`; latest selection was “对话测试”.
- Step click then scroll: “04 发布运行” remained active during the manual hold; after the hold expired, continued scrolling naturally activated “05 持续迭代”.
- Scenario hover: lead image reached a transform matrix equivalent to scale `1.035` and the copy translated `-6 px`; no height or layout property changed.
- Intent handoff: the live “意图已整理” state appeared and links remained exactly `/login?next=%2Fassets%2Fcreate` and `/register?next=%2Fassets%2Fcreate`.
- Production preview console: 0 errors.
- Automated coverage: rapid tabs, manual step hold, reduced-motion scroll behavior, and 390 px step operation all pass.

## Intentional trade-offs and P3 follow-up

- The real product UI still has one bounded window and internal separators. This is intentional because the user explicitly preserved necessary product and control boundaries; removing them would reduce product truth and affordance.
- The mobile flow evidence shows the required white focus outline around the selected step because the automated interaction leaves keyboard-visible focus active. This is accessibility evidence, not a restored decorative card.
- The in-app browser does not expose media emulation in this environment. Reduced motion is verified through the CSS media query and the component test's reduced-motion `matchMedia` path rather than a browser screenshot.

## Final implementation checklist

- [x] Remove decorative section/card framing without flattening real controls.
- [x] Stabilize product and flow state geometry.
- [x] Use composited opacity/transform transitions and restrained durations.
- [x] Preserve manual step selection before scroll takes control.
- [x] Make scenarios editorial on desktop and single-column on mobile.
- [x] Integrate the intent field into the page light field.
- [x] Recheck V4 palette, typography, imagery, copy, accessibility, and product truth.
- [x] Clear all P0/P1/P2 findings.

- final result: passed
