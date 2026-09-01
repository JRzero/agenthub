# LYN-005-I3 R31 completion report

- Replaced the combined `imageScale × 1.04` behavior with fixed frame compensation plus explicit per-card subject scale/X/Y tokens.
- Supporting rasters now use contained source framing; the R30 main remains `cover` at `0.92 / 0 / -8%`.
- No card geometry, source image, asset file, Hero copy, CTA, route or downstream section changed.
- Focused Vitest 20/20, lint, typecheck, build, OpenSpec strict and `git diff --check` passed.
- Browser desktop/mobile: 12/12 images loaded, console errors 0, overflow 0, composed matrices equal-axis and orthogonal.
- No commit, push, merge or deployment was performed.
