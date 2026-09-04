# LYN-005-I3 R26 completion report

## Asset mapping

| Scenario | Runtime asset | Native size | PNG → WebP |
| --- | --- | ---: | ---: |
| 独立创作者 | `/images/agenthub-site/use-case-independent-creator-r26.webp` | 1635×962 | 1,521,581 → 84,034 bytes (94.48% smaller) |
| IP / 内容团队 | `/images/agenthub-site/use-case-ip-content-team-r26.webp` | 1638×960 | 1,654,360 → 120,198 bytes (92.73% smaller) |
| Agent 运营团队 | `/images/agenthub-site/use-case-agent-operations-r26.webp` | 1638×960 | 1,415,576 → 79,172 bytes (94.41% smaller) |

All assets use Sharp WebP quality 90, effort 6, and smart chroma subsampling; no source file was modified.

## Minimal implementation

- Changed only the three `creatorScenarios` image mappings and their focal points (`50% 50%`, `50% 48%`, `50% 50%`).
- Preserved the section copy, structure, card/copy geometry, links, responsive layout, `object-fit: cover`, filter, overlay, radius, and hover behavior.
- Added a focused contract that requires all three new assets/positions and rejects the three legacy scene sources.

## Visual result

- Desktop cards remain approximately 1.71:1 and mobile cards 1.64:1, with proportional cover crop only.
- The artist/display, three-person collaboration scene, and two-person operations console remain legible above the fixed copy surface.
- Same-canvas comparisons and final screenshots live under `docs/qa/images/lyn-005-i3-use-cases-r26/`.

## Result

- P0/P1/P2 = 0/0/0.
- Focused Vitest: 2 files / 20 tests passed.
- `npm run lint`, `npm run typecheck`, production `npm run build` (19 generated routes), and `git diff --check` passed.
- The in-app browser deliverable is open at `http://127.0.0.1:3002/#scenarios`; all three runtime images loaded and desktop/mobile document overflow is zero.
- PID 13832 remains bound to `*:3002`; both `http://127.0.0.1:3002/` and `http://192.168.0.14:3002/` returned HTTP 200.
- No Hero, role asset, copy, route, authentication, API, dependency, or configuration change.
- No commit, push, merge, or deployment.
