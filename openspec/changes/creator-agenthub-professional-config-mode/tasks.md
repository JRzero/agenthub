## 1. Contracts And Capability Boundaries

- [x] 1.1 Add typed professional-menu groups with separate editor-section and lifecycle-route destination models
- [x] 1.2 Add typed media asset kinds, statuses, candidates, and stable-reference view models without widening the Agent update payload
- [x] 1.3 Add independent Live, Demo, and unavailable capability declarations for avatar upload, Motherland avatar generation, current character design, media library/history, and comic drafts
- [x] 1.4 Add adapters that map existing Agent avatar and character-design responses into media view models without synthesizing history
- [x] 1.5 Add contract tests proving transient candidates, unavailable fields, and Demo-only IDs never enter Live Agent update requests or caches

## 2. Professional Configuration Navigation And Layout

- [x] 2.1 Replace the flat Build rail with the four approved Chinese groups and ordered editor items
- [x] 2.2 Add Test Evaluation and Versions and Release route shortcuts while keeping all editable sections on the existing single draft
- [x] 2.3 Remove Moments and standalone Motherland from professional navigation after verifying that no other route depends on their section IDs
- [x] 2.4 Preserve the shared workspace shell, compact Agent header, lifecycle tabs, and existing Save Draft / Save and Test toolbar behavior
- [x] 2.5 Implement the desktop editor-first grid with a 320-360 pixel preview, page-level vertical scrolling, and no horizontal overflow
- [x] 2.6 Implement responsive navigation and move the preview below the editor when the three-column desktop layout no longer fits

## 3. Saved-Configuration Preview

- [x] 3.1 Replace draft presentation projection with saved Agent name, avatar, greeting, and the `使用已保存配置` source label
- [x] 3.2 Retain authenticated Runtime streaming/fallback internally while rendering only the latest user and assistant exchange
- [x] 3.3 Remove draft/published tabs, clear action, starter-question grid, transcript/session management, testing metrics, and preview collapse behavior
- [x] 3.4 Keep unsaved-change submission guards and visibly isolate Demo simulation from Live Runtime sessions
- [x] 3.5 Add preview tests for saved projection, dirty guard, latest-exchange replacement, Live Runtime use, Demo isolation, and layout states

## 4. Media Assets And Motherland

- [x] 4.1 Build the Media Assets editor with current avatar controls and character-sheet and comic-draft sections using Chinese saved, generating, pending-confirmation, failed, and unavailable states
- [x] 4.2 Reuse the current avatar crop/upload/delete flow and refresh saved Agent data only after a successful confirmed write
- [x] 4.3 Implement the parameterized Motherland generation drawer and its idle, generating, pending-confirmation, confirming, saved, and failed state transitions
- [x] 4.4 Adapt existing avatar preview and current character-design generation/save endpoints to the drawer without exposing a standalone Motherland route
- [x] 4.5 Render only the real current character sheet in Live when no collection exists, and disable library selection, history, and comic-draft writes with explicit unavailable guidance
- [x] 4.6 Add isolated Demo media fixtures for multi-card presentation without sharing persistence, query keys, or success paths with Live mode
- [x] 4.7 Add tests for cancel-without-save, explicit confirmation, retryable failure, confirmed avatar refresh, current-sheet mapping, and unavailable production actions

## 5. Verification And Evidence

- [x] 5.1 Preserve the approved handoff references under `docs/qa/design-reference/` and record the implemented scope and backend-gated differences
- [x] 5.2 Verify professional-menu order, section draft retention, route shortcuts, Save Draft, and Save and Test in the browser at `http://localhost:3002`

## 6. Shared Agent Asset Shell Alignment

- [x] 6.1 Add a path-aware compact shared shell for all `/assets/{agentId}` lifecycle routes while leaving workspace-level routes unchanged
- [x] 6.2 Move the AgentHub lockup into the full-width top bar in Agent Asset mode and collapse desktop workspace navigation to an accessible icon-only rail
- [x] 6.3 Compact the Agent header and merge Build reset, Save Draft, and Save and Test actions into it without changing save semantics
- [x] 6.4 Preserve the full mobile navigation drawer and responsive lifecycle/header behavior
- [x] 6.5 Add coverage, same-viewport browser evidence, `design-qa.md`, and rerun the full validation gates
- [x] 5.3 Verify avatar candidate confirmation, character-sheet current-state rendering, unavailable media actions, and Demo isolation in the browser
- [x] 5.4 Verify the fixed-width preview, page-level vertical scrolling, responsive fallback, and absence of horizontal page scrolling at 1440 pixels
- [x] 5.5 Store final screenshots under `docs/qa/images/` and write a QA report under `docs/qa/reports/`
- [x] 5.6 Pass `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `openspec validate --all --strict`

## 7. Collapsible Agent Asset Navigation

- [x] 7.1 Add route-derived compact desktop rail behavior for every Agent lifecycle route without user-persisted rail state
- [x] 7.2 Show each compact navigation label on mouse hover and keyboard focus while preserving accessible names and the fully labeled mobile drawer

## 9. Compact Header And Build Rail Density

- [x] 9.1 Reduce the shared Agent Asset top bar and identity row height while keeping status metadata and route actions on one desktop row
- [x] 9.2 Tighten lifecycle-tab spacing and update the Build viewport-height budget for the shorter shared header
- [x] 9.3 Narrow the Build configuration rail to 196 pixels and reduce group, item, and icon spacing without shrinking item targets below 40 pixels
- [ ] 9.4 Update layout tests, capture same-viewport browser evidence, refresh QA records, and rerun the full validation gates
- [x] 7.3 Keep the desktop sidebar width and main-content offset fixed to the compact Agent rail boundary without overlap or horizontal overflow
- [x] 7.4 Add layout-state tests and browser evidence for compact hover labels, unchanged workspace navigation, and unchanged mobile navigation
- [x] 7.5 Update `design-qa.md`, QA evidence, and rerun the full validation gates
- [x] 7.6 Force every Agent lifecycle route to use the compact Agent navigation rail and hide the desktop expand control while preserving hover labels

## 8. Focused Editor And Collapsible Preview

- [x] 8.1 Remove the redundant editor mode eyebrow and replace technical persona guidance with concise product-facing copy
- [x] 8.2 Add desktop preview collapse and restore controls while preserving the mounted Runtime exchange and input state
- [x] 8.3 Switch the Build grid between deterministic 340px expanded and 64px collapsed preview columns without horizontal overflow
- [x] 8.4 Keep the full preview available below the desktop breakpoint and add layout-state tests
- [ ] 8.5 Capture expanded and collapsed browser evidence, update QA records, and rerun the full validation gates
