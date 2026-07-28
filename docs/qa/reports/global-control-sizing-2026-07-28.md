# Global control sizing QA — 2026-07-28

## Scope

- Unified default buttons, single-line fields, and single-selects at 36px / 14px.
- Added a compact 32px / 12px variant for dense toolbars.
- Added shared destructive and icon-only action styles.
- Preserved large authentication fields, switches, tabs, textareas, upload controls, and other structural controls.
- Reduced the workspace top bar to 50px and kept the shell content offset aligned.

## Automated verification

- Targeted control and shell tests: 29 passed.
- Lint: passed.
- TypeScript: passed.
- Full Vitest suite: 205 passed.
- Production build: passed.
- `openspec validate --all --strict`: 21 changes passed.

## Browser verification

The resource-library dropdown was verified in an authenticated local browser at
1512 × 688 and 780 × 800 viewports. The app-rendered menu measured 14px text,
32px option rows, an 8px radius, and remained inside the narrow viewport.
Keyboard selection, Escape dismissal, accessibility roles, and the browser console
were also checked. Evidence:
`docs/qa/images/custom-select-open-2026-07-28.png` and `design-qa.md`.

## Contract impact

This change only adjusts frontend control styling and shell spacing. It does not
change backend capabilities, API payloads, authentication headers, storage keys,
routes, or live/demo data behavior.
