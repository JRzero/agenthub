# LYN-002-H-R1 Creator mobile correction QA

Status: PASS for the AgentHub-local R1 scope. This is isolated synthetic frontend evidence, not the final G/H/O real-API closure; LYN-002-Q1-R1 remains responsible for that joint verdict.

## Candidate and isolation

- Required base: `d4ce7a2e0a4a569acaf3c1c05f70b60ceee7d1f2` / tree `eb3fbdfcedbfb32742c71b5e467b8f971acdb533` / clean before work.
- Task branch: `task/lyn-002-h-r1-creator-mobile_2026-08-09`.
- Frontend: Next.js dev server bound only to `127.0.0.1:31042` in live data mode.
- API base: deliberately unreachable `http://127.0.0.1:9`; a new Playwright/Chrome context intercepted every `/api/v1/**` request before network dispatch.
- Identity/data: obvious synthetic values only (`et_test_lyn002_h_r1`, `studio-r1`, `xline-p0-world`). No credential, existing backend, database, shared/test/production environment, browser profile, or persistent World fixture was read or contacted.
- Browser: locally installed Chrome in a fresh headless profile; no browser download and no existing profile reuse.

## Corrected contract

- World detail loading, error, populated, runtime, card, and header roots now have explicit full-width/min-width boundaries rather than relying on shrink-to-fit behavior.
- 360–430px primary detail actions are single-column, full-width controls; public Agent codes wrap inside cards and form actions stay reachable.
- Back, edit, preflight, event-card, recall, Agent Owner, governance, search, invite, error-retry, and confirmation paths remain keyboard/touch operable.
- The current V1 Workspace navigation contains no `/worlds` item. Authorized deep links remain routable for local verification.
- AUTH-08 A is unchanged: Creator submission/report status remains, while platform moderation/disposition/approve/reject/takedown/restore controls remain absent.

## Responsive browser matrix

| Viewport | Main root | Document width | Critical targets | Result |
| --- | ---: | ---: | --- | --- |
| 360×800 | 328px | 360 / 360 | all checked targets ≥44px | PASS |
| 390×844 | 358px | 390 / 390 | all checked targets ≥44px | PASS |
| 412×915 | 380px | 412 / 412 | all checked targets ≥44px | PASS |
| 430×932 | 398px | 430 / 430 | all checked targets ≥44px | PASS |
| 1440×900 | 1188px after shell/sidebar | 1440 / 1440 | desktop layout preserved | PASS |
| 1280×720 at 200% page scale | 1028px after shell/sidebar; visual viewport 640px | 1280 / 1280 | `visualViewport.scale=2` | PASS |

No happy-path viewport produced a console error, page error, horizontal document overflow, single-character content column, or Next.js error overlay.

## Interaction, state, and accessibility checks

- Keyboard order at 390px reached the page in DOM/visual order: back → edit draft → preflight → event cards → first recall action. The preceding shell controls also followed their DOM order.
- Search returned an isolated long Agent name/code; the result, permission form, and invite action remained inside the 390px card with no horizontal overflow.
- Dismissing the recall confirmation emitted zero mutation. Accepting it in a controlled conflict run emitted one intercepted `POST`, received synthetic 409, retained the page, and rendered the full-width recoverable alert.
- Synthetic 503 detail failure rendered a 358px notice and a 298×44px “刷新真源” action. The only error-state console entry was the expected intercepted 503 resource response; there was no page error.
- `prefers-reduced-motion: reduce` evaluated true in the reduced-motion run, with the same 390/390 document width and 358px content root.
- Every checked mobile critical target was at least 44 CSS pixels high. Long public codes used in the participant/invitation/search path wrapped within their owning card.
- The Workspace navigation DOM had zero exact “生活世界” entries at every viewport. The Creator detail DOM had zero platform moderation control terms.
- Manual screen-reader output was not automated and is not claimed as PASS; semantic roles/live regions and keyboard order were inspected through the browser DOM.

## Screenshots

- `docs/qa/images/living-world-r1-detail-360.png` — `ea4366e38ca49e5aa6d8a5969632ca2007501c4ad19674ccb7195cfa06242167`
- `docs/qa/images/living-world-r1-detail-390.png` — `0e92b66ef90429b27fb2a19f3354339a8aaca3fb8fb62ea937ed320cfa6c2e0d`
- `docs/qa/images/living-world-r1-detail-412.png` — `3b5c0a6633cafb839395b624cf2a084a29650e1d1a861ef70b15bbe0582fadf1`
- `docs/qa/images/living-world-r1-detail-430.png` — `4d4b5446005ea6e0f5bc8d6a291918c3eb69b367b4ff87d6266660e2f8bf2622`
- `docs/qa/images/living-world-r1-desktop-1440.png` — `d37944b24f82eec7dada25f539bc52d58c11a9b93893caa0d283b73bdf190fca`
- `docs/qa/images/living-world-r1-zoom-200.png` — `9b6da48811c811697684cddef4631a5734b699db2ca8eee33abf5f59f1908c24`
- `docs/qa/images/living-world-r1-error-390.png` — `4007ec1a8f6e8bb19a8e659368766f69fcbc155ba59930ebe8b1108993712c49`
- `docs/qa/images/living-world-r1-conflict-390.png` — `17d7a27e3e8574ce58d473f67cf92363e74ca1162b84a08b3851288cb37c914b`

## Known limits and handoff

- This run proves responsive DOM/layout behavior and isolated UI state recovery only. It intentionally does not claim a real API, database, multi-subject permission, or cross-end G/H/O PASS.
- LYN-002-Q1-R1 should reuse the fixed clean AgentHub commit, start its separately authorized disposable joint environment, and repeat the same 360/390/412/430, desktop, 200%, keyboard, reduced-motion, 503/409, and confirmation checks against real candidate truth.
- Rollback is a normal revert of the final R1 commit; the change creates no backend or localStorage World data migration.

## Final gate receipt

- `npm run lint`: PASS.
- `npm run typecheck`: PASS; the generated root `tsconfig.tsbuildinfo` was verified as a build artifact and removed.
- `npm test`: PASS, 62/62 files and 307/307 tests; no test SKIP. Node printed its existing experimental localStorage warning, with no failed assertion.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: PASS; all World routes were included. Next printed the existing ESLint-plugin detection warning after the independent ESLint gate had passed.
- `openspec validate --all --strict`: PASS, 29/29 changes.
- Sensitive-pattern scan over the changed textual scope: PASS.
- `git diff --check`: PASS.
- Isolated live-mode browser matrix: PASS with no happy-path console/page error and only the explicitly injected 503/409 recovery responses.
