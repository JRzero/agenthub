# LYN-005-I3 R19 Intent Submit-button Containment Design QA

## Scope

Only the public landing creation-intent control and its contract/QA artifacts changed. Hero R18, section title, suggestions, Footer, routes, validation, submission behavior, authentication, APIs, dependencies, and every other page/section are frozen.

## Visual audit

1. **P1 fixed — split capsule ownership.** The user annotation shows the submit circle reading as detached from the textarea border. Runtime inspection confirmed the wrapper was transparent and borderless while the textarea alone owned the surface.
2. **P1 fixed — vertical imbalance.** Desktop button top/bottom insets were 12.5/7px; mobile was 11.5/6px. The final button is centered at 7/7px desktop and 6/6px mobile.
3. **P2 fixed — weak unified focus state.** The final wrapper owns hover and focus-within states; the textarea's individual outline is removed without clipping the button's keyboard focus ring.
4. **Healthy — interaction and responsive behavior.** Suggestion fill, required/maxLength form behavior, submit summary, and existing login/invitation continuation still work. Document/client widths match at 1510 and 390; console errors are zero.

## Gates

- Focused landing suites: 2 files / 18 tests passed.
- Full Vitest: 93 files / 471 tests passed.
- ESLint, TypeScript, production build (19 pages), OpenSpec strict 37/37, and `git diff --check` passed.
- Preview PID 75472 listens on `*:3002`; `127.0.0.1` and `192.168.0.14` both return HTTP 200.

## Evidence

- Reference: `docs/qa/design-reference/lyn-005-i3-intent-control-r19/user-annotation.png`.
- Fresh before: `docs/qa/images/lyn-005-i3-intent-control-r19/before/`.
- Final and focused captures: `docs/qa/images/lyn-005-i3-intent-control-r19/after/`.
- Same-canvas boards: `docs/qa/images/lyn-005-i3-intent-control-r19/comparison/desktop-before-after.png`, `desktop-control-focus.png`, and `mobile-before-after.png`.
- Exact geometry: `measurement.md`.

## Result

P0 = 0, P1 = 0, P2 = 0.

final result: passed
