# LYN-005-I3 R40 Design QA

## Comparison target

- Source visual truth: fresh pre-fix captures at `docs/qa/images/lyn-005-i3-accessibility-r40/before/desktop-1440x1000-full.png` and `before/mobile-390x844-full.png`.
- Implementation: `http://127.0.0.1:3002/` after the scoped accessibility fixes.
- Viewports: 1440 × 1000 desktop and 390 × 844 mobile, device scale factor 1.
- Captured content pixels: 1429 × 7057 desktop full page and 379 × 4513 mobile full page; the width difference is the browser scrollbar gutter.
- States: default page, inactive creation steps, compact control hit layers, and keyboard focus on the mobile login link.

## Comparison evidence

- Full desktop: `docs/qa/images/lyn-005-i3-accessibility-r40/comparison/desktop-full-before-after.png`.
- Focused desktop flow, before left / after right: `docs/qa/images/lyn-005-i3-accessibility-r40/comparison/desktop-flow-before-after.png`.
- Focused mobile flow, before left / after right: `docs/qa/images/lyn-005-i3-accessibility-r40/comparison/mobile-flow-before-after.png`.
- Final desktop flow viewport: `docs/qa/images/lyn-005-i3-accessibility-r40/after/desktop-1440x1000-flow.png`.
- Final mobile focus state: `docs/qa/images/lyn-005-i3-accessibility-r40/after/mobile-390x844-login-focus.png`.

## Findings and comparison history

1. **P1 / colors and accessibility — resolved.** Baseline inactive stage opacity `.34/.38` suppressed otherwise readable text. It is now `.8` at both breakpoints; active remains `1`. Post-fix screenshots show every stage title and description legible without flattening the selected stage.
2. **P2 / interaction sizing — resolved.** Baseline carousel progress, intent chips, footer links, and login action fell below the preferred 44px hit height. Transparent pseudo-element hit layers now measure 44–45px high while visible geometry is unchanged. Mobile progress uses a 10px visual gap and non-overlapping 44 × 44px effective targets.
3. **P2 / console cleanliness — resolved.** Fresh mobile baseline exposed a Next.js LCP priority warning for the initial role image. The first stable role asset is now priority-loaded. Fresh final tabs at both viewports report zero errors and zero warnings.
4. **Release drift — documented, not a local mismatch.** The test site still serves `.loginLink:hover, .nav a:hover { color: var(--lime) }` and inactive opacity `.34/.38`. R39 is present in local HEAD; deployment is deliberately outside this task.

## Required fidelity surfaces

- Typography: unchanged family, size, weight, wrapping, and hierarchy; only inactive-stage composited visibility increased.
- Spacing and layout: approved page geometry is unchanged. Transparent hit layers do not participate in layout; the mobile progress gap changed by 3px solely to prevent overlapping 44px targets.
- Colors and tokens: R39 dark-on-lime CTA states remain intact. No palette changes were introduced.
- Images: no image source, crop, or visual styling changed. The initial showcase image only gained an evidence-backed priority hint.
- Copy: unchanged.
- Responsiveness: no overflow at 1440 or 390; all controls remain within their sections.
- Motion: existing `prefers-reduced-motion` rule remains present; transitions and autoplay semantics were not changed.

## Browser verification

- Desktop inactive opacity: `1, .8, .8, .8, .8`.
- Mobile inactive opacity: `1, .8, .8, .8, .8`.
- Effective targets: login 94 × 44px; desktop progress 44 × 44px; mobile progress 44 × 44px; intent chips 102.5–112.5 × 45px; footer navigation 44–55 × 44.5px; mobile footer brand 105.5 × 44px.
- Console: 0 errors, 0 warnings in fresh final desktop and mobile tabs.
- Horizontal overflow: 0 at both requested widths.
- Primary interactions retained: login link, Hero CTA, carousel controls, five-stage buttons, intent suggestions, and footer links.

## Gates

- Focused Vitest: 23/23 passed.
- ESLint: passed.
- TypeScript: passed.
- Production build: passed (19 pages).
- OpenSpec strict: 37/37 passed.
- `git diff --check`: passed.

P0/P1/P2 remaining: 0 / 0 / 0.

final result: passed
