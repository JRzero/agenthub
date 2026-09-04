# LYN-005-I3 R29 fresh combined audit

## Audit scope

- Surface: `PublicLandingPage` Hero role wall only.
- User goal: keep the original dense cut-card language while restoring a balanced main-card scale, continuous three-column rhythm and natural character proportions.
- Evidence: the supplied fresh 1440×1000 current capture and the supplied `2990 × 1468` source visual, both opened and inspected before implementation.

## Numbered audit

1. **R28 current Hero — needs correction**
   - Strength: the three-layer counter-skew architecture already prevents character stretching.
   - P1 visual risk: the `31% × 75%` main card at `left:55%` makes the face and torso dominate the composition and pull the visual center toward the copy.
   - P2 visual risk: desktop `±12deg` counter-skew combined with 3.5–4.5° rigid rotation produces a stronger edge angle than the source.
   - P2 layout risk: middle and lower cards begin at 26.5–31.7% while upper cards begin at 39%, causing inconsistent exposure and isolated gaps rather than three readable staggered columns.
   - Accessibility risk visible from the screenshot: no new focus or contrast defect is introduced, but excessive visual competition near the heading makes scanning less stable.

2. **Source composition — healthy target**
   - The main card remains dominant but leaves more shoulder/chest context and sits farther right.
   - Upper, middle and lower rows share one diagonal direction, with recognizable 45–75% exposures and deliberate top/right/bottom clipping.
   - The left black field remains strong enough that the title, lead and CTA are not visually contaminated by the wall.

3. **R29 final Hero — healthy**
   - Main card: `28% × 67%`, `left:59%`, `top:10%`; reference-ratio browser bbox `417.04 × 505.44` at `x834.65/y66.57`, versus R28 `480.31 × 580.06` at `x767.28/y36.59`.
   - Desktop transform language: frame/image `-9deg/+9deg`; default/main `rotateZ(2deg)`, near `1.5deg`, outer `2.5deg`.
   - The background starts at 31–41% across rows, then continues through 44–60% middle positions and natural right-edge bleed. The result reads as three staggered columns rather than random overlap.
   - Left-field contrast, CTA hierarchy, navigation and proof geometry remain unchanged. Desktop and mobile horizontal overflow are zero.

## Evidence limits

- Screenshots prove composition, crop, contrast and visible responsive behavior; they do not establish full WCAG compliance.
- Keyboard/focus and reduced-motion behavior are unchanged from the prior verified implementation and remain covered by the existing focused contracts.
