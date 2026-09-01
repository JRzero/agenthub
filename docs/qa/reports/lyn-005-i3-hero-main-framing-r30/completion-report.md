# LYN-005-I3 R30 completion report

## Delivered

- Added the supplied expanded portrait as a new, separately versioned high-quality WebP without replacing the R18 source.
- Updated only the Hero main-card source and its main-only subject framing rule.
- Kept all twelve role-card nodes, R29 slot geometry, background cards, frame/counter-skew tokens, Hero copy/navigation/CTA/proof and downstream sections unchanged.

## Final framing

- Framework compensation remains `1.04` on the counter-skew image layer.
- Subject framing is isolated on the main raster: `translateY(-8%) scale(.92)`.
- Approximate visible subject height is 76–78%; headroom is 10–12%; the face sits slightly above the card's vertical center.
- Uniform scale and `object-fit: cover` preserve natural proportions. The existing overscan plus matched black canvas prevent empty edges.

## Verification summary

- Focused tests 20/20, lint, typecheck, build, OpenSpec 37/37, and `git diff --check` passed.
- Browser 1440×900 and 390×844: console errors 0, horizontal overflow 0, CTA href unchanged.
- No commit, push, merge or deployment was performed.
- The pre-existing unrelated R17 screenshot remains byte-identical at SHA-256 `1fdc85399aca809ede8fb8f2d3db6d7c0010c263f4dece58a8a61367ec6a6512`.
