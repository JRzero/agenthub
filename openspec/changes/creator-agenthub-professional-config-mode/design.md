## Context

The handoff document and the two approved professional-configuration references describe a three-part Build surface: grouped configuration navigation, a focused editor, and a narrow real-time preview. The current implementation already has a shared Agent Asset shell, compact Agent header, one draft lifecycle, live avatar endpoints, Motherland generation endpoints, a single saved character-design model, and authenticated Runtime Chat. It also has a flat Build rail, standalone Moments and Motherland sections, and a preview with transcript and session-management behavior that belongs in Test Evaluation.

The frontend repository cannot add backend storage. In particular, the current Agent contract exposes one avatar and one `character_design_spec` / `character_design_sheet` pair, but no typed media-asset collection, history, comic-draft persistence, or asset-picker endpoint. The design must therefore distinguish real Live operations from isolated Demo presentation and explicit unavailable states.

The approved visual reference uses a full-width branded top bar, an icon-only desktop navigation rail, and a single compact Agent header. This structure is an explicit requirement for the shared Agent Asset lifecycle workspace, not merely page context. It must be applied consistently to Overview, Build, Test, Versions, and Distribution rather than reproduced only inside Build.

## Goals / Non-Goals

**Goals:**

- Make professional Agent configuration easier to scan through grouped, Chinese-language navigation without adding a new route hierarchy.
- Keep one unsaved draft and the current Save Draft / Save and Test lifecycle across editable sections.
- Turn Media Assets into a focused visual-asset workspace and embed Motherland as its generation tool.
- Prevent generated candidates from replacing saved Agent configuration before explicit confirmation.
- Keep the preview real, saved-configuration-based, fixed in width, and deliberately smaller in scope than Test Evaluation.
- Preserve honest Live, Demo, and unavailable capability boundaries.
- Fit the desktop workspace at 1440 pixels without horizontal page scrolling and retain a usable responsive fallback.

- Increase Agent configuration space by using a compact shared desktop shell across every Agent lifecycle route while retaining the full workspace shell outside an Agent Asset.
- Keep the Agent identity, lifecycle tabs, and Build actions in one compact header without a duplicate Build toolbar.
  **Non-Goals:**

- Replacing the full labeled navigation on workspace-level routes or the full mobile navigation drawer.
- Adding a standalone Motherland route or restoring Moments inside professional Build configuration.
- Duplicating Test Evaluation, Versions, Distribution, session management, publishing, or client configuration inside Build.
- Adding media history, comic persistence, review workflows, permissions, version comparison, or a character-sheet reference field to Persona without backend contracts.
- Changing backend services, introducing new dependencies, or fabricating Live media records from fixtures or local storage.

## Decisions

### 1. Add one shared compact Agent Asset shell variant

The workspace shell resolves its desktop presentation from the current route. Every `/assets/{agentId}/...` lifecycle route uses the same Agent Asset variant: the AgentHub lockup and workspace selector live in a full-width top bar, the global navigation is a fixed accessible icon-only rail below it, and the Agent header begins at the same compact content origin. Each compact icon exposes its menu name on hover and keyboard focus. Agent Asset routes do not render a desktop rail expand/collapse control, so Overview, Build, Test, Versions, and Distribution keep the same compact rail boundary and avoid shifting content while creators configure the Agent. The layout is route-derived and is not persisted to localStorage. Workspace-level routes such as `/assets`, `/resources`, and `/operations` retain the full labeled sidebar. The mobile drawer also retains labels and does not expose a desktop collapse control. The Agent header owns identity, status, lifecycle tabs, and route actions. On Build, Reset, Save Draft, and Save and Test render in this header and the separate Build toolbar is removed without changing handlers or save lifecycle.

The desktop Agent Asset variant uses a 60-pixel top bar. Its identity row uses a 52-pixel avatar inside a 64-pixel minimum row, an 18-pixel Agent name, compact status metadata, and 36-pixel Build actions. Lifecycle tabs use a shorter bottom inset. The Build configuration rail is 196 pixels wide, uses 40-pixel item targets, 24-pixel icon wells, and smaller group gaps. These dimensions increase editor space without removing labels, status, or focus treatment.

Alternative: change only the Build page. Rejected because it would make one lifecycle route structurally different from Overview, Test, Versions, and Distribution. Alternative: collapse every workspace route. Rejected because workspace navigation needs labels and the reference only calls for extra density inside an Agent Asset. Alternative: make the Agent Asset rail expandable. Rejected because the current design goal is a stable compact workspace with maximum configuration space and no shifting content boundary inside Agent Asset routes.

### 2. Model the professional menu as typed groups with editor and route destinations

The Build rail will render four ordered groups:

1. `身份与人设`: `身份信息`, `角色人格`
2. `运行配置`: `运行配置`
3. `能力配置`: `技能`, `知识`, `记忆策略`, `媒体资产`
4. `治理与发布`: `安全边界`, `测试评估`, `版本与发布`

Editable items select an in-route `BuildSectionId` and preserve the current draft. `测试评估` navigates to `/assets/{agentId}/test`. `版本与发布` lands on `/assets/{agentId}/versions`; the existing lifecycle tabs remain the route to Distribution. Route shortcuts are visually distinguished from editor sections and never create duplicate Build panels.

`moments` and standalone `motherland` are removed from the professional section model. Existing components or API adapters are deleted only after import and compatibility checks confirm that no other route depends on them.

Alternative: make every menu item a nested Build route. Rejected because cross-route draft persistence is unnecessary and would weaken the current single-draft lifecycle.

### 3. Use a stable desktop layout with page-level scrolling

At desktop widths, the internal rail uses a stable 196-pixel compact width, the editor receives all remaining space, and the expanded preview uses a fixed width between 320 and 360 pixels. The Build editor, rail, and preview do not introduce their own vertical scroll containers; long configuration content grows the document and uses the browser page scrollbar. A header control collapses the preview to a 64-pixel labeled rail and restores the fixed-width panel without clearing the latest exchange or recreating Runtime state. The content grid and preview rail transition together without horizontal overflow.

Below the desktop breakpoint, the preview moves below the editor and continues to participate in page-level scrolling. Mobile navigation may use the existing responsive section selector, but the group labels and ordering remain identical.

Alternative: keep editor and preview bodies as separate internal scroll containers. Rejected because it creates competing scrollbars in the Build workspace and makes long configuration forms harder to operate. A deterministic 340-pixel expanded width and 64-pixel collapsed width preserve predictable configuration space while page-level vertical scrolling keeps the interaction simple.

### 4. Make Media Assets a typed capability surface

The editor uses a frontend `MediaAsset` view model with `kind` (`avatar`, `character-sheet`, `comic-draft`), identifier when provided by the backend, display URL, name, version/date metadata when available, and status (`saved`, `generating`, `pending-confirmation`, `failed`, `unavailable`). Adapters map real Agent and character-design responses into this view model; they do not synthesize missing history.

The Media Assets editor contains:

- Current avatar: saved thumbnail and status, upload, asset selection, and Motherland generation actions.
- Character sheets: up to three recent cards when the backend supplies a typed collection; otherwise the current saved sheet is shown as a single real card and history is marked unavailable.
- Comic drafts: up to three recent cards when supported; otherwise the Live surface is explicitly unavailable.

In Demo mode, isolated fixtures may demonstrate full card collections, but those records are never inserted into Live queries or write paths.

### 5. Embed Motherland in one contextual generation drawer

One `MotherlandAssetDrawer` is opened from the relevant avatar, character-sheet, or comic-draft action. It keeps the creator in Media Assets and follows a small state machine:

`idle -> generating -> pending-confirmation -> confirming -> saved`, with `failed` reachable from generation or confirmation.

The drawer contains only the prompt/options needed for the selected asset kind, progress feedback, candidate preview, retry, cancel, and confirm. Closing or cancelling a candidate does not update the Agent draft or saved configuration.

For avatar generation, confirmation reuses the supported avatar upload/update flow. For the current character sheet, the existing generate-spec, generate-sheet, and save contracts may be adapted. Comic-draft generation and typed media persistence remain disabled in Live until a backend capability is declared.

Alternative: a modal, standalone page, or persistent Motherland menu item. A drawer was selected because it preserves the media context and candidate comparison without adding navigation or obscuring the full editor.

### 6. Use explicit capability provenance for each media action

Media behavior is not represented by one broad boolean. The capability layer distinguishes at least:

- Avatar upload and replacement.
- Motherland avatar candidate generation.
- Current character-design generation and save.
- Media asset library selection and history.
- Comic-draft generation and persistence.

Each action resolves to `live`, `demo`, or `unavailable`. Live controls invoke only existing authenticated endpoints. Demo controls use isolated fixtures. Unavailable controls explain the missing contract and perform no write.

For full Live parity with the reference design, the backend will need a typed media collection contract equivalent to listing assets by Agent and kind, returning stable IDs, URLs, kind, status, version, created time, and current-use state, plus typed generation/confirmation operations. Exact endpoint names remain a cross-repository decision and are not hard-coded before backend agreement.

### 7. Reduce preview to saved-configuration feedback

The focused editor uses only the active section title and a short product-facing helper sentence when explanation is needed. Redundant mode labels and backend-implementation commentary are omitted from the primary editing flow.

The preview reads saved Agent query data, not the unsaved Build draft. It shows the title `实时预览`, the source label `使用已保存配置`, the saved avatar and name, one short greeting, and one bottom input. When the draft is dirty, the preview remains on the saved state and explains that saving is required to preview the changes.

Live sends through the existing authenticated Runtime Chat contract, but the UI retains only the latest user/assistant exchange. A new send replaces the previous exchange. Session creation, streaming, and fallback remain internal implementation details; the UI exposes no draft/published tabs, clear button, starter-question grid, transcript management, session selector, or testing metrics. Demo remains clearly simulated and isolated.

Alternative: render unsaved presentation fields and a full transcript. Rejected because it makes the preview look like both a draft simulator and Test Evaluation, while Runtime cannot execute unsaved configuration.

### 8. Preserve save semantics and confirm only stable references

The global Build draft continues to serialize fields accepted by `PUT /agents/{id}`. A confirmed avatar update refreshes the saved Agent query. A confirmed character-design reference is included only when supported by the current Agent metadata contract. Save Draft never serializes transient candidate URLs, generation state, Demo asset IDs, or unavailable media fields. Save and Test saves first and navigates only after success.

## Risks / Trade-offs

- [The reference shows two or three recent asset cards, but the backend exposes no collection] -> Show only real current data in Live, mark history unavailable, and reserve full collections for isolated Demo mode until a typed backend contract exists.
- [Removing standalone Moments and Motherland can strand imported components] -> Remove only navigation exposure first, then use import and route checks before deleting code.
- [A Runtime session still exists behind the simplified preview] -> Keep it implementation-only, retain only the latest exchange, and place all session/test controls in Test Evaluation.
- [Fixed columns can overflow smaller desktops] -> Use a 320-360 pixel preview, compact internal rail, min-width-safe editor fields, page-level vertical scrolling, and a responsive stacked preview below the desktop breakpoint.
- [Candidate generation can succeed while confirmation fails] -> Preserve the candidate in the drawer, show a retryable confirmation error, and never imply that the saved Agent changed.
- [Capabilities may differ by deployment] -> Resolve every media action through the shared capability registry and test Live, Demo, and unavailable branches independently.

## Migration Plan

1. Add the shared path-aware Agent Asset shell variant and compact Agent header without changing workspace-level or mobile navigation.
2. Add typed grouped navigation and route destinations while preserving the existing draft hook.
3. Replace the preview presentation with the saved-configuration, latest-exchange model and add page-level layout behavior.
4. Add the media view model, capability declarations, and adapters for existing avatar and current character-design contracts.
5. Move Motherland visual generation behind the contextual drawer and remove standalone professional-menu exposure for Motherland and Moments.
6. Add unavailable Live treatment for library history, asset selection, and comic drafts; add isolated Demo fixtures only where the design needs demonstrable states.
7. Verify at 1440 pixels and responsive breakpoints, then record browser evidence under `docs/qa/`.

Rollback restores the previous flat rail, preview composition, and standalone menu entries. No persisted data migration is required because transient candidates are never serialized and existing Agent fields remain unchanged.

## Open Questions

- The backend team must confirm the typed media-asset collection and generation/confirmation contracts before library history, asset selection, and comic drafts can be enabled in Live.
- Review/approval permissions, media version comparison, and a read-only Persona reference to character sheets remain separate follow-up changes.
