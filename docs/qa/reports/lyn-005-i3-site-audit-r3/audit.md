# LYN-005-I3 R3 Full-site truthfulness audit

Date: 2026-08-28
Surface: local uncommitted AgentHub frontend at `http://127.0.0.1:3002`
Mode: combined UX, visual, responsive, interaction, and accessibility-risk audit

## Audit scope and evidence rule

This is a new audit run. The supplied screenshot is retained as the reported regression, while every acceptance claim below comes from screenshots and browser observations captured in this run. Prior I3 reports were not used as replacement evidence.

- Reported incorrect Hero: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-ed7307ae-19f7-4c6c-8e9b-8bb1249db915.png`.
- Fresh before evidence: `docs/qa/images/lyn-005-i3-site-audit-r3/before/`.
- Fresh after evidence: `docs/qa/images/lyn-005-i3-site-audit-r3/after/`.
- Desktop viewport: 1440 × 1000 CSS/output pixels, DPR 1.
- Mobile viewport: 390 × 844 CSS/output pixels, DPR 1.

## Actual route inventory

The route inventory was derived from `src/app/**/page.tsx`, not guessed.

- Public: `/`, `/login`, `/register`.
- Protected workspace: `/workbench`, `/assets`, `/assets/create`, `/resources`, `/clients`, `/clients/new`, `/clients/[clientId]`, `/operations`, `/distribution`, `/analytics`, `/governance`, `/governance/[area]`, `/revenue`, `/settings`.
- Protected Agent Asset: `/assets/[agentId]/overview`, `/assets/[agentId]/build`, `/assets/[agentId]/test`, `/assets/[agentId]/versions`, `/assets/[agentId]/distribution`, `/assets/[agentId]/memory`.

## Numbered audit steps and health

1. **Public homepage `/` — healthy.** Fresh desktop and mobile DOMs show `让一个想法，长成一个 Agent`, one `开始创建` CTA, the real four anchors, and `登录工作台`. The supplied management copy, fake metrics, pricing, docs, and platform-login labels are absent. Evidence: `after/01-home-desktop-full.jpg`, `after/02-home-mobile-full.jpg`, and `after/compare-user-screenshot-corrected-hero.jpg`.
2. **Hero and navigation — healthy.** The transparent navigation, creator-first support copy, cinematic role imagery, one CTA, and four real process labels render without horizontal overflow. Evidence: `after/08-home-hero-desktop.jpg` and `after/13-home-hero-mobile.jpg`.
3. **Role assets — healthy.** One layered focused card, receded adjacent cards, previous/next controls, side-card selection, and progress are visible. Browser interaction changed `林月` to `知序`; content is labeled `Demo Asset` or `示例角色`. Evidence: `after/09-home-assets-desktop.jpg`, `after/14-home-assets-mobile.jpg`, and `after/compare-role-layout-implementation.jpg`.
4. **Five-stage product flow — healthy.** `角色设定 → 知识与技能 → 对话测试 → 发布运行 → 持续迭代` each became the current stage and rendered only capability-accurate Demo UI. Desktop stays sticky; mobile is non-sticky and manually operable. Evidence: `after/10-home-flow-desktop.jpg`, `after/15-home-flow-mobile.jpg`.
5. **Creator scenarios — healthy.** Three image-led cards preserve the reference composition while describing independent creators, IP/content teams, and Agent operations teams. Evidence: `after/11-home-scenarios-desktop.jpg`, `after/16-home-scenarios-mobile.jpg`.
6. **Creation intent and footer — healthy.** The shortcut populated `我想创造一个团队知识问答 Agent`; submission produced the session-only summary and exact login/register continuation routes. Footer contains only real anchors, login, and copyright. Evidence: `after/12-home-intent-desktop.jpg`, `after/17-home-intent-mobile.jpg`.
7. **Login `/login` — healthy.** Desktop and mobile preserve the existing authentication design system, SMS/password tabs, labels, disabled-state logic, API settings disclosure, and registration link. No marketing-page style leak or overflow. Evidence: `after/03-login-desktop.jpg`, `after/06-login-mobile.jpg`.
8. **Invitation registration `/register` — healthy.** Phone, verification code, invitation code, disabled submit state, and return-to-login continuation are present at desktop/mobile. Evidence: `after/04-register-desktop.jpg`, `after/07-register-mobile.jpg`.
9. **Anonymous `/assets/create` boundary — healthy.** It redirects to `/login?next=%2Fassets%2Fcreate`; registration preserves the same `next`. Evidence: `after/05-assets-create-redirect-desktop.jpg`.
10. **Workspace and asset library — healthy in existing Demo mode.** `/workbench` and `/assets` render the established workspace system and real Demo boundary without homepage styling. Evidence: `after/18-workbench-desktop.jpg`, `after/19-assets-desktop.jpg`.
11. **Guided creation `/assets/create` — healthy.** Existing four-step creation structure, fields, controls, and compact workspace shell remain intact. Evidence: `after/20-assets-create-desktop.jpg`.
12. **Workspace centers — healthy for this regression scope.** `/resources`, `/operations`, `/clients`, `/analytics`, `/governance`, `/revenue`, and `/settings` preserve their product UI. Live-mode checks honestly exposed HTTP 404/loading boundaries instead of fake success; Demo-mode after captures rendered their supported static states. Evidence: `after/21-resources-desktop.jpg` through `after/27-settings-desktop.jpg`.
13. **Agent Asset workspace — healthy for this regression scope.** Existing Demo Agent `32` was used for overview, build, test, versions, distribution, and memory. All routes rendered without console errors or document overflow. Evidence: `after/28-agent-overview-desktop.jpg` through `after/35-agent-build-mobile.jpg`.

## Findings by severity

- **P0: 0.** No blocked public or protected route, destructive action, credential access, or impossible core task was found.
- **P1: 0 remaining.** The supplied screenshot demonstrates the earlier reference-copy regression. Fresh current evidence shows the creator-first replacement already present in the uncommitted implementation. Explicit contract assertions now forbid every reported reference-only label and fake metric.
- **P2: 0 remaining.** Desktop/mobile homepage composition, section order, stage interaction, carousel interaction, auth continuation, console, and horizontal overflow checks passed.
- **P3: 2 recorded.** The 390px Agent build workspace is information-dense, although it remains within the document width and core controls are visible. Full keyboard traversal and reduced-motion emulation were not available through the selected in-app browser; semantics, focus CSS, and reduced-motion behavior are covered by focused tests instead.

## Accessibility risks and confirmed strengths

- Confirmed: semantic landmarks, labeled navigation, headings, accessible carousel/stage controls, `aria-current`, live regions, labeled form fields, disabled states, and no document overflow at 1440/390.
- Confirmed: keyboard-operable native links/buttons in markup and focused component tests; the role and flow controls expose accessible names and current state.
- Risk: this audit does not claim WCAG conformance. Color contrast was visually inspected but not exhaustively measured for every state.
- Risk: the in-app browser did not expose media-feature emulation, so reduced motion was verified through the component/helper test contract and CSS media rules rather than a browser screenshot.

## Truthful link mapping

- Hero CTA: `#create`.
- Product capability: `#product`.
- Creation flow: `#flow`.
- Usage scenarios: `#scenarios`.
- Role assets: `#assets`.
- Login continuation: `/login?next=%2Fassets%2Fcreate`.
- Invitation continuation: `/register?next=%2Fassets%2Fcreate`.
- Protected create route: `/assets/create` → anonymous redirect to the login continuation above.

## Final result

All P0/P1/P2 findings are cleared. Remaining P3 items are documented without expanding this homepage regression task into a workspace redesign.
