# LYN-005-I3 R27 completion report

## Minimal change

- `.heroRoleCard`: `rotateZ(1deg)` → `rotateZ(4deg)` for the focal/main plane.
- Near cards: `rotateZ(3.5deg)`; outer cards: `rotateZ(4.5deg)`.
- Hero images now state their already-rendered fill contract explicitly as `width:100%; height:100%; object-fit:cover`.
- Updated only the focused CSS contract and R27 QA evidence; no TSX/DOM/data/asset/route change.

## Proportion proof

- Main: `matrix(0.997564, 0.0697565, -0.0697565, 0.997564, 0, 0)`.
- Near: `matrix(0.998135, 0.0610485, -0.0610485, 0.998135, 0, 0)`.
- Outer: `matrix(0.996917, 0.0784591, -0.0784591, 0.996917, 0, 0)`.
- Each is the canonical `cosθ, sinθ, -sinθ, cosθ` rotation matrix: unit axes, perpendicular axes, determinant 1. Existing image transforms remain uniform `scale(n)` only.

## Result

- Desktop/mobile comparison: P0/P1/P2 = 0/0/0.
- Focused Vitest 20/20, lint, typecheck, production build (19 generated routes), and `git diff --check` passed.
- Browser proof: all 12 images loaded with `cover` and uniform image matrices; CTA remains `/login?next=%2Fassets%2Fcreate`; real navigation anchors remain unchanged; 1440/390 overflow is zero and the dev portal contains no error text.
- PID 13832 remains bound to `*:3002`; both `http://127.0.0.1:3002/` and `http://192.168.0.14:3002/` returned HTTP 200. The final in-app browser deliverable is open at `#top`.
- No commit, push, merge or deployment.
