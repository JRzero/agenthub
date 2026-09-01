# LYN-005-I3 R29 completion report

## Visible result

- Main card reduced from `31% × 75%` to `28% × 67%`, moved from `left:55%` to `59%`, and lowered from `top:7%` to `10%`.
- Desktop frame/image pair reduced from `-12deg/+12deg` to `-9deg/+9deg`; mobile reduced from `-8deg/+8deg` to `-6deg/+6deg`.
- Rigid position rotation reduced from 4/3.5/4.5° to 2/1.5/2.5°.
- Uniform image compensation multiplier reduced from `1.08` to `1.04`; desktop overscan reduced from 14% to 11%, mobile from 10% to 8%.
- Background slots now form consistent upper, middle and lower tracks while preserving all twelve existing assets and seven-card mobile selection.

## Boundaries

- No copy, navigation, CTA, proof, image source, radius, border, shadow, downstream section, route, authentication, API, dependency or configuration changed.
- R22–R28 and the pre-existing unrelated R17 screenshot remain preserved.
- No commit, push, merge or deployment was performed.

## Verification

- Focused Vitest: 2 files / 20 tests passed.
- ESLint: passed.
- TypeScript `--noEmit`: passed.
- Next production build: passed; 19 static pages generated and all routes collected.
- `git diff --check`: passed.
- Browser: 1440×1000 and 390×844 horizontal overflow `0`; all twelve desktop assets loaded; CTA remains `/login?next=%2Fassets%2Fcreate`; console errors `0`.
- Preview: PID `34007` listens on IPv4 `*:3002`; local and LAN URLs return HTTP 200. The in-app browser deliverable is open at `#top`.
- Git: branch `task/agenthub-public-site-i3_2026-08-24`; HEAD/upstream `ca7740683a15cec4a129b406999a792b6506a1a1`; worktree remains intentionally dirty with preserved R22–R29 changes.
