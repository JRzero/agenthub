# LYN-002-H AgentHub C-ready slice evidence

> Recovery note (2026-08-06): the 12 PNG files referenced by this historical ledger are no longer recoverable and are intentionally absent from the LYN-002-RH commit. The browser results below preserve the original structured report only; LYN-002-RQ1 must regenerate fresh visual evidence in a new isolated environment before relying on screenshots.

Status: C–G Creator/Agent Owner source candidate with a real disposable-backend closure; the C-04/C-05/C-07/C-12 acceptance supplement below closes the four previously partial AgentHub rows. P1 platform moderation remains deliberately out of scope.

## Final synthetic Creator closure (2026-08-01)

This section supersedes the older historical/pending sections below. The final backend candidate was verified before use: branch `task/living-world-preparation_2026-08-01`, HEAD `286f5fdfa943061528ca36eeee24bcff78e44eef`, tree `c933b5edf226c8a033a9929764dceadec783f897`, staged `0`, tracked diff `1724a99ca543f4b8dfd3a92b2a6f4155951d8b71bac6bfc9278a1e337f70ac80`, untracked manifest `8b072cbab954df86d45ef740ec4979d9e9a63454055b72b279e0c9a537a35854`, OpenSpec `870bb99ee19b4b05e05dabc97f7dcd9f0c9fa090971f60bd4ee2b7a446fd2cb6`, and OpenAPI `304ae75f4b965df54c5b655cfbd5ece13f4a49d42cfdd5da2c7738483490dacb`. The controller-supplied complete aggregate was `f359443b…`; its constituents were independently reproduced.

The run used disposable MySQL 8.4 and Redis tmpfs containers, a locally built backend, unreachable fake model endpoint, and an isolated synthetic workspace. Direct fixture writes were limited to the user/account/API-key hash and five upstream published Agent assets authorized by the controller. Every World create/edit/publish/invite/decision/preflight/launch/bootstrap/lifecycle/governance operation described below went through the real AgentHub UI and backend API. No SMS, `.env`, reusable token, shared environment, production data, browser profile, mock response, or localStorage World truth was used.

The in-app browser repeatedly stalled on native confirmation dialogs, so the authorized fallback used `env -i`, the bundled Playwright package, and the locally installed Chrome binary with a new isolated context. It did not download a browser or read an existing Chrome profile.

Final World `lyn002-h-barrier-world-2` completed create → six-section edit → publish → exact Agent search → three invitations → two Creator-owned acceptances → one external Agent Owner decision-draft narrowing and acceptance → passing preflight → launch request → bootstrap → runtime timeline → pause (`200`) → resume (`200`) → archive (`200`) → Creator review-material submit/status. The runtime rendered `initial_event · fact`, three public residents, server budget/projection, and an independently recoverable recap `404`. Governance rendered Creator/owner submission surfaces and zero platform-moderation controls. P1 platform moderation is deliberately absent, not advertised as unavailable capability.

The browser run found and fixed one real Agent Owner defect: a successful decision-draft response was not inserted into TanStack Query truth, so the form could revert the narrowed identity/permissions before acceptance. The cache now adopts the returned invitation and revision; the real rerun retained `外部一号协调者`, narrowed permissions, revision 2, then accepted those values. A pure query-truth regression test covers both populated and missing cache states.

### Browser evidence ledger

| ID | Result | Evidence / honest limit |
| --- | --- | --- |
| C-01 | PASS | Real blank creation and all six sections saved; desktop and mobile routes rendered from backend truth. |
| C-02 | PASS | Real publish/preflight moved from blockers to `检查通过`; initial event used three exact participant codes. |
| C-03 | PASS | Real exact `agent@1` search/invite and three accepted bindings; external owner narrowed identity/permissions. |
| C-04 | PASS | Two real Owner tabs produced decision-draft `200 → stale 409 → truth refresh revision 2 with local draft retained → retry 200 → accept 200`; a synthetic upstream Agent version was then revoked and real Owner acceptance returned 409 with no fallback, followed by Creator UI withdrawal 200. Separate Creator UI paths withdrew another invitation and recalled an accepted participant 200. |
| C-05 | PASS | Real UI/API schedule create/update/recovery converged through revisions 1–3, then Creator UI cancellation returned `cancelled revision 4`, seed 44. The frozen P0 contract exposes create/view/modify/cancel rather than a client-side clock executor. |
| C-06 | PASS | Real launch request and bootstrap converged to one running instance and effective initial event. |
| C-07 | PASS | A real UI-created draft World progressed through backend card counts 0/1/2/3. Cards render source location, trigger semantics, participant source, maximum effect, and server revision; the fourth create control is disabled and emitted zero mutation. |
| C-08 | PASS | Real status, public residents, budget, partial projection, semantic timeline, and recap-panel-only 404 recovery rendered. |
| C-09 | PASS | Real pause/resume/archive returned 200; recall uses a real endpoint and is contract-tested. |
| C-10 | PASS / moderation N/A | Creator review material submitted and status rendered; DOM count for platform controls was 0 as required by the approved P1 deferral. |
| C-11 | PASS (AgentHub scope) | Creator and Agent Owner sessions exercised subject isolation; owner invitation responses contained neither prompt nor hidden-fact canary. |
| C-12 | PASS | Controlled local network injection (not backend rate limiting) covered 429 with `Retry-After: 7`, 503, and offline on desktop invitations and 390px event-card edits. Each showed understandable feedback, retained input, kept retry locked until truth refresh, emitted one mutation per click, and then converged through real API responses; mobile edit revisions advanced 1→2→3→4. |
| CM-01 | PASS | 390px runtime measured `scrollWidth=clientWidth=390`; final single-column screenshot recorded. |
| CM-02 | PASS (automatable scope) | 44px audit: 13/13 visible controls compliant, 0 unlabeled, 2 live regions; keyboard order, 200% scale and reduced-motion matched. Manual screen-reader narration was not claimed. |
| X-01 | PASS | Launch request identity/revision and bootstrap handoff were observed end to end. |
| X-02 | PASS (AgentHub scope) | World/runtime identity remained stable through initial-event timeline and barrier revisions. |
| X-03 | PASS (AgentHub scope) | No prompt canary appeared in any inspected API surface; hidden fact appeared only in the Creator-owned detail needed for editing and never in Agent Owner responses or runtime DOM. |
| X-04 | PASS (AgentHub scope) | No platform disposition/moderation UI was rendered; only approved Creator/owner controls were executable. |

Final visual evidence:

- `docs/qa/images/living-world-final-creator-runtime-desktop.png`
- `docs/qa/images/living-world-final-creator-runtime-mobile.png`
- `docs/qa/images/living-world-final-creator-runtime-200-percent.png`
- `docs/qa/images/living-world-final-creator-governance.png`
- `docs/qa/images/living-world-accept-c04-stale-conflict.png`
- `docs/qa/images/living-world-accept-c04-revoked-version.png`
- `docs/qa/images/living-world-accept-c05-schedule-cancelled.png`
- `docs/qa/images/living-world-accept-c07-three-cards-mobile.png`
- `docs/qa/images/living-world-accept-c12-desktop-429.png`
- `docs/qa/images/living-world-accept-c12-mobile-429.png`

Responsive/a11y measurements: desktop `1440/1440`, mobile `390/390`, 200% page-scale `1280/1280` with `visualViewport.scale=2`, reduced-motion media query `true`, zero visible undersized controls after the 44px fix, zero unlabeled controls, and deterministic keyboard traversal through navigation/actions. The only browser console/network errors were two expected `GET /api/v1/public/worlds/lyn002-h-barrier-world-2/recaps` responses at `404`; that failure stayed inside the recap panel.

Acceptance supplement truth receipt: the schedule row is `cancelled/revision 4/seed 44`; the card draft has exactly three backend-authored cards; invitation states are accepted/accepted/withdrawn/withdrawn; participant states are active/recalled. Controlled browser failures are reported as fault injection, never as real backend rate limiting. The run also found and fixed a strict-adapter RED: event-card edit had echoed read-only `revision` inside `card`, causing real 400 responses; the writable projection now strips view-only fields and the same browser flow converged to 200 revisions 2/3/4.

Final acceptance gates: lint PASS; typecheck PASS (generated untracked `tsconfig.tsbuildinfo` SHA-256 `a67e05424293111dcd3adf04f2605ea934a1e4645db7925796b4c0f8d780eb40` was verified at the exact path and removed); Vitest 61/61 files and 304/304 tests PASS; production build PASS; strict OpenSpec 29/29 PASS; `git diff --check` PASS. OpenSpec implementation state is 22/22. Final candidate identity appears in the handoff after resource cleanup. All source/evidence changes remain unstaged and uncommitted.

## G4 exact-delta verification

The G4 candidate was verified before contract reading: branch `task/living-world-preparation_2026-08-01`, HEAD `286f5fdfa943061528ca36eeee24bcff78e44eef`, tree `c933b5edf226c8a033a9929764dceadec783f897`, staged `0`, tracked diff `6b260cf9589bb800437df08e69f5cd0b01ffa02af50e97236725052d73e3a616`, 45-file untracked manifest `54b698282d08a9ca4ac38f0ad182354e3307ea7b761b55c3a210e5aea5e2c19a`, OpenSpec `1b0df00c22dfe249a3a0c82da6e256e67786a083251b85a2af9f521a63fac2ec`, and OpenAPI `04f3f04e66f3fe55443de516b2c344fb790203bd0bc7c8c1acdae7a72258d5cc`. The controller aggregate was `ba8826d92cae2edae0ffd46d4116493ca0b6d96e455d515e201cb5820b48d522`; its framing is external, while every independently reproducible constituent matched.

Frontend G4 delta:

- `WorldTimelineItem.semantic_kind` was already the closed `fact | rumor | statement` union and remains server-authored rather than inferred.
- `WorldCreatorProjection.public_residents` remains a required array and the adapter test now exercises the valid empty `[]` case.
- `WorldRecap.revision` now accepts `0 | 1 | 2`, adds required `is_current`, and the recap page exposes optional `latest_revision`.
- `publicRecaps` accepts an optional `business_date` and encodes the frozen dated revision-history route without changing the existing current-only call.
- G4 adapter/state targeted receipt: 26/26 PASS.
- Disposable backend receipt: the frozen backend built and migrated an isolated MySQL 8.4 + Redis instance. Its own G4 OpenAPI, closed semantic-kind, daily recap, projection/memory and Viewer public-projection fixture tests all passed. Fixtures self-cleaned; containers used `--rm`/tmpfs and were removed.

Dynamic browser limit: a fresh empty backend cannot create its first account through product APIs because registration requires an SMS verification service. `/worlds` correctly redirected to `/login`. In accordance with the no-DB-seeding rule, no account, Agent publication, invitation, runtime, timeline or recap state was inserted manually. Creator runtime/timeline/recap browser closure, CM-01/CM-02, task 4.3 and task 6.6 remain pending rather than being marked PASS. AUTH-08/09 and moderation remain untouched.

## G3 historical browser run and G4 refreeze

The G3 candidate was independently verified before it was read or run. A disposable MySQL + Redis environment and a locally built backend were started with synthetic identities only; no shared environment or production credential was used. After the controller announced the G4 `semantic_kind` / recap revision-history increment, all backend identity/source/log reads stopped immediately. The already-running G3 browser run is retained only as historical evidence and cannot freeze D–G or complete task 6.6. The containers used `--rm`/tmpfs and were stopped after the run.

Historical G3 Creator evidence:

- C-01/C-02: created `monster-apartment` / `妖怪公寓` through `/worlds/new`, entered all six sections, and received server-confirmed revisions 1 → 2 → 3. The second save added a structured rule and selected the server-returned `location-2` option.
- C-02/C-12: real preflight reported accepted-participant and publish blockers; publish returned the full server preflight error set. The UI kept user input and offered a truth refresh.
- C-03/C-12: public Agent search returned three exact `@1` candidates. The disposable seed could not resolve the selected exact version at invitation time, so the UI correctly showed the 409 conflict and explicitly did not substitute another version. The invitation/acceptance/launch closed loop is therefore not PASS.
- Browser defect fixed: nullable `items` from recap/review/report endpoints caused a Creator-console crash. The adapter now normalizes nullable collections to `[]`, with a contract regression test.
- Browser defect fixed: repeated server preflight categories produced duplicate React keys. The detail adapter now preserves order while deduplicating categories, with a regression test.
- Desktop DOM exposed the expected headings, labels, disabled mutation state, `aria-current` step, and live status. Reduced-motion remains covered by the global `prefers-reduced-motion` rule. Keyboard interaction reached the step control, but full focus restoration and screen-reader verification remain pending.
- Responsive screenshots were recorded as historical artifacts. The in-app viewport was device-scaled, and the 390/200% capture exposed unresolved reflow ambiguity; CM-01/CM-02 and task 4.3 remain pending rather than being promoted.

Historical screenshots: `docs/qa/images/living-world-g3-historical-creator-desktop.png` and `docs/qa/images/living-world-g3-historical-creator-mobile.png`.

Required G4 continuation: verify the new branch/HEAD/tree/staged/tracked/untracked/complete/OpenSpec/OpenAPI identity before any backend read or run, review `semantic_kind` and revision-history deltas, then rerun the affected minimum adapter tests plus disposable runtime/timeline/recap browser scripts. Platform moderation and AUTH-LYN-002-09 remain out of scope.

## G3 identity hold

The dispatched G2 identity was verified before contract reading: branch `task/living-world-preparation_2026-08-01`, HEAD `286f5fdfa943061528ca36eeee24bcff78e44eef`, tree `c933b5edf226c8a033a9929764dceadec783f897`, staged `0`, tracked diff `c716f1113ed49fc2d6f9e4405a73940426a4ffcae1d648ab6c416754768eca7c`, untracked manifest `af408cb2f5ab7ec022ac06db9c681d9f221aa153087ee6dd50a39b85c849053f`, OpenSpec `d8c0264d0f67c51f289e8485bf89b57008257f84abecb34d965f16bd5ce19d88`, and OpenAPI `957d2d2d0d32a64ff7dc4e0a73f196f00c6ab9fcaaf8a0c3cdcec6be1a8cedfc`. The controller aggregate `complete manifest` was `d18e844a07fc81154dde216589e7de65e2cb28db545fbece56261218121321fa`; its framing was not supplied, while all independently reproducible constituent fields matched.

G2 contract review completed the frontend D–G adapters and revealed the safe limited-change deep-link chain: read the change, read its `subject_participant_code` binding, require the returned `participant_code` to match, then use that binding's server-returned `world_code` for the finite decision. No query parameter is trusted. Public timeline and recap status fields were aligned with G2. Lifecycle barriers remain disabled after refresh when no server-returned epoch/fence/revision identity exists; the frontend never guesses it.

Before backend migration or fixture setup began, the controller announced a G3 increment for public discovery status filtering. Dynamic integration and evidence freezing stopped. The just-created isolated MySQL container used `--rm` plus tmpfs, had received no migrations or test data, and was stopped and removed immediately. No backend server, Redis, browser, or shared environment was started. No backend, QA, or UX file was modified.

AgentHub source work may continue because G3 is discovery-only, but the following remains pending until the replacement G3 identity arrives:

| Pending point | Current frontend state | Required G3 action |
| --- | --- | --- |
| Backend identity | G2 DTOs/endpoints aligned and unit-tested | Recompute branch/HEAD/tree/staged/tracked/untracked/complete/OpenSpec/OpenAPI before any backend read/run |
| Disposable closed loop | Startup was stopped before migration | Recreate isolated MySQL/Redis, synthetic auth/fixtures and fake clock/model after G3 verification |
| Browser/a11y evidence | Routes and live adapters implemented | Execute C-01..C-12, CM-01..02, AgentHub X-01..04, desktop/mobile/200%/keyboard/reduced-motion/a11y |
| Platform authority | `pending_platform_capability` is read-only | Keep moderation and AUTH-LYN-002-09 absent; each requires separate authorization/capability |

Frontend-only evidence during this hold: Living World targeted tests `23/23` PASS after G2 alignment, typecheck PASS, with the earlier `25/25` targeted receipt retained. These results do not promote any browser script or cross-end assertion.

## Frozen identities

- AgentHub base: branch `task/living-world-p0-creator_2026-08-01`; HEAD `ab5a248c7e8a39357b19cd00f9b38bf3cef2dbaa`; HEAD tree `8f188b1d686e351b5bc9f862d59cfa2d1abdda7d`.
- UX: branch `task/living-world-p0-ux_2026-08-01`; HEAD `fb9ac90a4d0f6de391cd1ae7e5c9e3701a22cd3d`; tree `1927008d73e33f30e0e304904f3a301e60e30d75`; file SHA-256 `7224b0887f3b7774a403ba3f4bb468bf19d013a0993b233dc937746c7024c937`.
- Backend C candidate: branch `task/living-world-preparation_2026-08-01`; HEAD `286f5fdfa943061528ca36eeee24bcff78e44eef`; tree `c933b5edf226c8a033a9929764dceadec783f897`; tracked binary diff SHA-256 `34f97373466ded7afff90e8657ac79378e5cf19749442786a3545b782793a0a9`; dispatched Q1 result 33/33 PASS.
- AgentHub working identity after frontend gates: tracked binary diff SHA-256 `463b84a8ab1c7caab008806d7ae1860895c4fea2f8715a58ebe6cf08fc379a24`; 28-file sorted untracked manifest is recomputed at handoff because this report is itself part of that manifest. All changes remain unstaged and uncommitted.

## Automated contract evidence

- `src/modules/living-worlds/api.test.ts` covers frozen C paths/payloads, G2 D–G paths/CAS payloads, Workspace query isolation, permission narrowing/no-op blocking, limited-change subject/binding identity, stable 400/401/403/404/409/410/413/422/429/5xx/offline recovery, and moderation fail-closed readiness.
- Production World adapter has no fixture import and does not use localStorage as World truth.
- Live launch-request success is labeled pending bootstrap; it is not presented as a runtime instance or effective initial event.

## Q1 H-F01..H-F07 correction evidence

The first Q1 candidate reported 0 PASS / 11 FAIL / 7 pending. The following source defects are corrected and are ready for independent Q1 retest; this frontend report does not promote them to browser PASS.

| Finding | Correction | Automated evidence | Former FAIL scripts ready for retest |
| --- | --- | --- | --- |
| H-F01 | Six-section editor now exposes long-term tensions, full lore/tone, structured rules, location entry/conditions/events/connections, 3–4 invite slots, complete initial event, and opening window/policy. Dirty protection covers unload, in-app links, and history navigation. Referenced locations cannot be deleted. | `model.test.ts`: reference-safe deletion; typecheck/build cover editor fields | C-01, C-02, CM-01 |
| H-F02 | Exact-version invite has five explicit permission controls and retains the selected subset; conflict/not-found guidance states that no fallback version was selected. | `api.test.ts`: selected invitation permission payload | C-03, CM-01 |
| H-F03 | Schedule query hydrates all fields; first save uses World revision, subsequent modify/cancel uses schedule revision; operation key is retained until confirmed success. | `model.test.ts`: revision selection; `api.test.ts`: schedule payload | C-05, C-12, CM-01 |
| H-F04 | Event-card form requires title/location/observable start/max effect and implements create/edit/delete with appropriate World/card revision. | `model.test.ts`: invalid-card rejection; `api.test.ts`: CRUD payload/path | C-07, CM-01 |
| H-F05 | Invitation query error is evaluated before missing-data loading, so 404/5xx renders recoverable non-enumerating error UI. | `model.test.ts`: error-before-loading precedence | C-04, C-11, C-12 |
| H-F06 | Create/template/schedule/launch/decision operations retain one idempotency key across timeout/unknown-result reconciliation and reset it only after confirmed success. | `model.test.ts`: operation-key retention/reset; API payload tests | C-06, C-12 |
| H-F07 | Active participant cards expose a confirmed recall control using the existing real recall adapter; repeated truth is recovered by detail invalidation. | `api.test.ts`: recall command path/body; production route build | C-09, CM-01 |

OpenSpec implementation state is 20/22. Tasks 4.3 and 6.6 remain pending because they require the replacement G3 backend identity and an isolated browser session for keyboard/focus/live-region/mobile/zoom/reduced-motion and closed-loop evidence.

## Browser script ledger

No authorized synthetic API session or isolated C server was supplied inside this Worktree. No credential was read. Therefore no browser row is PASS yet; missing screenshot/network/console/a11y evidence remains explicitly pending.

| ID | AgentHub route / responsibility | Current evidence status | Blocker |
| --- | --- | --- | --- |
| C-01 | `/worlds/new`, `/worlds/templates`, `/worlds/{code}/edit` | pending_browser | Requires authorized real C API data and screenshot/network evidence |
| C-02 | `/worlds/{code}/edit`, `/preflight` | pending_browser | Requires synthetic draft and real 422/preflight mutation evidence |
| C-03 | world console invite + `/world-invitations/{code}` | pending_browser | Requires two authorized Creator identities and real binding evidence |
| C-04 | invitation decision conflict recovery | pending_browser | Requires controlled concurrent tabs and exact-version revoke fault |
| C-05 | `/worlds/{code}/schedule` | pending_g3_identity | C persistence and G2 runtime adapters exist; due dispatch/race needs isolated dynamic evidence |
| C-06 | `/worlds/{code}/preflight` launch request | pending_g3_identity | Launch/bootstrap adapters exist; replacement identity and idempotency evidence pending |
| C-07 | `/worlds/{code}/event-cards` + pending changes | pending_g3_identity | Event-card and finite-decision adapters exist; dynamic queue/decision evidence pending |
| C-08 | console runtime panels | pending_g3_identity | G2 projection/contract/recap UI exists; fake clock/model and fault evidence pending |
| C-09 | recall plus pause/resume/archive | pending_g3_identity | Binding recall and lifecycle barriers exist; isolated stop-gate evidence pending |
| C-10 | governance panels | pending_g3_identity | Visibility/review/report are live; moderation remains the independent permission blocker |
| C-11 | all World deep links and crafted requests | pending_browser | Requires authorized multi-subject local API and zero-side-effect backend proof |
| C-12 | adapter/state recovery | pending_browser | Unit coverage exists; controlled real 400/409/422/429/5xx/offline/unknown browser evidence missing |
| CM-01 | all Creator mobile routes at 390×844 | pending_browser | Screenshot, overflow, keyboard and network evidence missing |
| CM-02 | editor/decision/preflight mobile a11y | pending_browser | Screen reader, focus, 200%, reduced-motion and 44px evidence missing |
| X-01 | AgentHub launch request identity/revision | pending_g3_identity | D/F adapters exist; effective event and cross-end evidence require replacement identity |
| X-02 | AgentHub World identity/revision | pending_g3_identity | AgentHub projection/recap side exists; cross-end proof awaits G3 |
| X-03 | typed allowlist and no-secret frontend scan | pending_cross_end | Frontend types omit internal ids/secrets; backend DB/log/Outbox and Viewer scans pending |
| X-04 | no out-of-scope controls in AgentHub DOM | pending_cross_end | AgentHub static review can contribute; backend rejection and Viewer enumeration pending |

## Required per-browser-record fields

When the isolated environment becomes available, each row must add: exact candidate branch/HEAD/tree/diff identity, viewport, synthetic 《妖怪公寓》 values, steps, expected and actual results, redacted requests/responses, screenshot or recording under `docs/qa/images/`, console output, accessibility result, and PASS/FAIL/SKIP/pending. An incomplete row cannot become PASS.

## Frontend gate receipt after G3 historical run

- `npm run lint`: PASS.
- `npm run typecheck`: PASS; the single generated untracked `tsconfig.tsbuildinfo` was verified at its exact path and removed.
- `npm test`: PASS, 61/61 files and 299/299 tests, including the G4 adapter case.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: PASS, including the World governance, Agent Owner participant, and limited-change deep-link routes.
- `openspec validate --all --strict`: PASS, 29/29.
- `git diff --check`: PASS.
- Historical G3 browser: partial C/CM evidence only; invitation seed conflict prevented a closed loop. D–G freeze, task 4.3 and task 6.6 are `pending_g4_identity`; no historical row is promoted to final PASS.
