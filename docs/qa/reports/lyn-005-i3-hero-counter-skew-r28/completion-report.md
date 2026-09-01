# LYN-005-I3 R28 completion report

## Result

The Hero role wall now uses three explicit transform layers: rigid position/rotation, sheared frame, and equal opposite image compensation. The frame matches the reference's cut-card language without projecting the shear into the character raster.

## Exact geometry

- Desktop frame/image: `skewX(-12deg)` / `skewX(12deg)`.
- Mobile frame/image: `skewX(-8deg)` / `skewX(8deg)`.
- Position rotation: main/default `4deg`, near `3.5deg`, outer `4.5deg`.
- Image compensation: existing uniform crop scales multiplied by `1.08`; main resolves to `1.080`, other slots to `1.123–1.210`.
- All twelve composed matrices have equal axis lengths (delta `< 4e-13`) and perpendicular axes (absolute dot `< 1.2e-6`).

## Evidence

- Reference: `docs/qa/design-reference/lyn-005-i3-hero-counter-skew-r28/user-reference.png`.
- Desktop/mobile after: `docs/qa/images/lyn-005-i3-hero-counter-skew-r28/after/`.
- Same-canvas comparisons: `docs/qa/images/lyn-005-i3-hero-counter-skew-r28/comparison/`.
- Computed matrices: `docs/qa/reports/lyn-005-i3-hero-counter-skew-r28/transform-metrics.json`.
- QA: `docs/qa/reports/lyn-005-i3-hero-counter-skew-r28/design-qa.md`.

## Boundaries

- No image, copy, route, dependency, API, authentication, Hero left column or downstream section was changed.
- No commit, push, merge or deployment was performed.

## Verification

- Focused Vitest: 2 files / 20 tests passed.
- ESLint: passed.
- TypeScript `--noEmit`: passed.
- Next production build: passed; 19 static pages generated and all routes collected successfully.
- `git diff --check`: passed.
- Browser: 1440×1000 and 390×844 horizontal overflow `0`; twelve desktop images loaded; CTA remains `/login?next=%2Fassets%2Fcreate`; runtime console errors `0`.
- Preview: PID `13832` listens on `*:3002`; `http://127.0.0.1:3002/` and `http://192.168.0.14:3002/` both return HTTP 200. The in-app browser deliverable is open at `#top`.
- Git: branch `task/agenthub-public-site-i3_2026-08-24`; HEAD/upstream `ca7740683a15cec4a129b406999a792b6506a1a1`; worktree remains intentionally dirty with preserved R22–R28 changes.
- Pre-existing unrelated R17 screenshot remains byte-identical at SHA-256 `1fdc85399aca809ede8fb8f2d3db6d7c0010c263f4dece58a8a61367ec6a6512`.
