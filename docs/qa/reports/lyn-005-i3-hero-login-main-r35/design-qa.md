# LYN-005-I3 R35 Login-role Main Card Design QA

## Findings

- P0: 0
- P1: 0
- P2: 0
- No remaining blocking visual mismatch in the requested main-card scope.

## Source and normalized evidence

- Source visual truth: `public/images/login-agent-portrait.png`, 1024 × 1536 native pixels, no text layer.
- Fresh R34 baseline: `docs/qa/images/lyn-005-i3-hero-login-main-r35/before/desktop-1440x900-r34.png` and `before/mobile-390x844-r34.png`.
- R35 implementation: `after/desktop-1440x900-pass1.png` and `after/mobile-390x844-pass1.png`.
- Desktop CSS viewport: 1440 × 900 at density 1; browser content capture: 1429 × 893 pixels.
- Mobile CSS viewport: 390 × 844 at density 1; browser content capture: 379 × 820 pixels.
- State: public landing Hero at `#top`, no authentication state required.

## Full-view and focused comparisons

- Source / R34 / R35 full Hero: `docs/qa/images/lyn-005-i3-hero-login-main-r35/comparison/source-before-after-desktop.png`.
- Source / R34 / R35 main-card focus: `docs/qa/images/lyn-005-i3-hero-login-main-r35/comparison/source-main-focus-before-after.png`.
- Mobile R34 / R35: `docs/qa/images/lyn-005-i3-hero-login-main-r35/comparison/mobile-before-after.png`.

## Required fidelity surfaces

- Typography and copy: frozen; no font, line-height, wrapping or content changed.
- Spacing and layout: R34 stage offset, card dimensions, three-track slot coordinates, tilt, radius, border and shadow are byte-for-byte unchanged.
- Colors and tokens: the source's native black field merges cleanly with the existing black card surface; no new color or effect was introduced.
- Image quality and fidelity: the main card directly consumes the login source through Next Image. `object-fit: contain`, centered positioning and equal-axis `scale(.92)` preserve the native 2:3 ratio, full head/hair/chin/shoulder composition and natural black margins. Source luminance analysis places the visible head start around 6–10% of its native canvas; the centered .92 scale adds 4% frame inset, yielding approximately 10% visible top breathing room.
- Copy/content: no screenshot text, substitute identity or generated face is used.

## Comparison history

1. Baseline finding: R34 used the silver guardian in the main card and a main-only `cover` rule. This was a P1 identity mismatch against the requested login role and a P1 crop-risk contract.
2. Fix: main source changed to `/images/login-agent-portrait.png`; main framing changed to explicit `contain / 50% 50% / scale(.92) / offset 0,0`. `bottom-fantasy` restored the silver guardian at its prior `1.04 / 0,+1%` framing; `hero-main-r32.webp` was removed from the Hero source set.
3. Post-fix evidence: the desktop and mobile comparisons show the complete head, hair, chin and shoulders with natural black margin; no non-uniform transform, blank seam, overflow or layout shift remains.

## Runtime checks

- Desktop: 12/12 images loaded, 12 unique sources, horizontal overflow 0.
- Mobile: 7/7 visible images loaded, horizontal overflow 0.
- Main computed style: `object-fit: contain`; transform `matrix(.92, 0, 0, .92, 0, 0)`.
- Composed matrix remains equal-axis and orthogonal: maximum desktop axis delta `2.98e-14`, maximum absolute dot `3.19e-7`.
- Browser console errors: 0; Next.js error dialog absent.
- CTA remains `/login?next=%2Fassets%2Fcreate`.

final result: passed
