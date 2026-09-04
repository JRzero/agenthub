## ADDED Requirements

### Requirement: Public creator landing route
The application SHALL render `/` as a public AgentHub landing page without requiring an authenticated session, while preserving existing authentication protection for workspace and creation routes.

#### Scenario: Anonymous visitor opens the root route
- **WHEN** an unauthenticated visitor navigates to `/`
- **THEN** the application renders the public landing page instead of redirecting to the workspace

#### Scenario: Anonymous visitor opens a protected route
- **WHEN** an unauthenticated visitor navigates to `/workbench`, `/assets`, or `/assets/create`
- **THEN** the existing workspace authentication guard continues to route the visitor through login

### Requirement: V4 creator story and navigation
The public site SHALL provide a Hero, working anchor navigation, continuous product states, a five-step creation narrative, three creator scenarios, and a bottom creation-intent section using truthful AgentHub capability language.

#### Scenario: Visitor explores the public site
- **WHEN** the visitor activates a navigation item, product state, or creation step
- **THEN** the corresponding section or content state becomes visible and the active control is programmatically identifiable

#### Scenario: Visitor switches product states quickly
- **WHEN** the visitor activates multiple product tabs in rapid succession
- **THEN** the latest selected state becomes visible within a stable product-stage height without a blank frame or interrupted layout

#### Scenario: Visitor explores the creation flow
- **WHEN** the visitor scrolls quickly through the five creation chapters or selects a step and continues scrolling
- **THEN** activation follows a stable viewport focus line and a manual selection is not immediately overwritten by scroll feedback

#### Scenario: Visitor reviews the public narrative
- **WHEN** the visitor scans product proof, creation flow, creator scenarios, and the intent handoff
- **THEN** decorative outer borders and repeated equal-card framing do not dominate the layout, while actual product controls and the textarea retain clear affordances

#### Scenario: Visitor reviews capability claims
- **WHEN** the visitor reads the public site
- **THEN** the site describes role definition, knowledge and skills, conversation testing, publishing and runtime state, and iteration without presenting Living World, a marketplace, fabricated metrics, customer endorsements, or unopened API/SDK capabilities

### Requirement: Honest creation-intent handoff
The public site SHALL allow a visitor to enter a creation intent, SHALL keep that intent only in browser session storage, and SHALL require the existing login or invitation registration path before `/assets/create` can be used.

#### Scenario: Visitor continues with an intent
- **WHEN** a visitor submits a non-empty creation intent
- **THEN** the application stores the normalized text in browser session storage and offers login and invitation registration links whose continuation target is `/assets/create`

#### Scenario: Visitor has not authenticated
- **WHEN** an anonymous visitor enters or submits an intent
- **THEN** the site does not call a generation or persistence API and does not claim the Agent was generated or saved on a server

#### Scenario: Visitor reads the intent handoff
- **WHEN** the intent handoff renders at 1440 × 1000 or 390 × 844
- **THEN** its display heading uses explicit semantic line groups with relaxed leading and visible separation, hands directly to the unchanged input control, and retains the suggestion row without rendering the removed explanatory sentence, character counter, lock icon, or initial privacy metadata row
- **AND** the section creates no clipping, Footer overlap, empty metadata grid row, or horizontal document overflow

#### Scenario: Submit action remains inside the intent control
- **WHEN** the intent form renders at 1510 × 561 or 390 × 844
- **THEN** one bordered capsule owns the input surface, the transparent textarea reserves the submit action's text-safe area, and the circular submit button is vertically centered with every edge inside the capsule
- **AND** hover, focus-within, keyboard focus, suggestions, required and maximum-length validation, submission, and authentication continuation remain operable without horizontal overflow

### Requirement: Responsive and accessible public experience
The public site SHALL remain usable at 1440 px and 390 px, provide visible keyboard focus and semantic controls, and honor `prefers-reduced-motion`.

#### Scenario: Mobile visitor views the page
- **WHEN** the viewport width is 390 px
- **THEN** content remains within the viewport, navigation and CTAs remain usable, product proof uses one primary panel, and the five-step story uses a vertical selector with one active detail

#### Scenario: Visitor requests reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** automatic state changes, smooth scrolling, and transform-based displacement are disabled while final content and a stable active step remain visible immediately

#### Scenario: Keyboard visitor operates the page
- **WHEN** the visitor tabs through links, buttons, tabs, and the intent form
- **THEN** each interactive element has a visible focus indicator and an accessible name

### Requirement: Dark AgentHub brand presentation
The public site SHALL use the approved near-black and fluorescent-lime visual direction with cinematic raster character imagery, strong white typography, asymmetric spatial hierarchy, and sparse structural borders while preserving truthful AgentHub capability boundaries.

#### Scenario: Visitor reviews the Hero
- **WHEN** the visitor opens the public site at desktop or mobile width
- **THEN** the Hero presents the approved three-line “管理 / 每一个 AI 角色 / 让能力持续进化” title, one primary workbench CTA, supporting copy about role settings, knowledge, versions, release and status, and cinematic character imagery without fabricated scale metrics, customers, or unsupported destinations

#### Scenario: Hero character studies form one coherent cinematic wall
- **WHEN** the visitor reviews the Hero at the 1503 × 734 source viewport or the supported desktop/mobile verification widths
- **THEN** the Hero renders twelve data-driven independent role-card image/container nodes from twelve distinct raster sources, uses a perspective-corrected 1200×1420 extraction of only the user-supplied focal-card interior as the main portrait at `50% 50% / scale(1)`, maps the surrounding slots to the reference's distinct strategist, game-host, headset, scholar, fantasy, robot, alpaca, young-operator, and silver-fantasy roles, uses one shared `skewX(-12deg) rotateZ(1deg)` token plus calibrated slot geometry to preserve the supplied R17 reference's black negative field, diagonal masonry, approximately 591×559 focal-card visual envelope, overlap, shadow, and edge crops without a sprite, canvas, background slice, complete-wall raster, perspective or 3D transform, keeps an independent mobile subset visible, and creates no horizontal document overflow

#### Scenario: Wide desktop preserves the role-wall proportion
- **WHEN** the public Hero renders from 1440 through 2048 CSS pixels wide
- **THEN** its desktop 1449:1086 coordinate stage remains approximately 76% of the viewport width, is vertically centered and cropped by the fixed Hero instead of shrinking to contain, keeps the visible role-wall onset near 38–43% of the viewport, preserves all twelve card slots and the copy field, and does not alter the frozen six-card 390px composition

#### Scenario: Hero avoids duplicate creation stages
- **WHEN** the visitor reviews the complete Hero at desktop or mobile width
- **THEN** the Hero contains no separate stage ledger, stage links, lower supporting portrait cards, or empty placeholders for them, while the downstream formal five-stage product flow remains complete and operable

#### Scenario: Hero workbench handoff has annotated emphasis
- **WHEN** the Hero renders at 1465 × 802 or 390 × 844
- **THEN** the existing lime `进入工作台` link is enlarged without adding an icon, retains `/login?next=%2Fassets%2Fcreate`, hover, focus-visible, and keyboard behavior, and the continuous status/data proof group sits farther below the CTA without changing its internal rhythm
- **AND** the Hero title, lead, navigation, independent character wall, Hero height, and all downstream sections retain their previous geometry without horizontal overflow

#### Scenario: Visitor navigates the page
- **WHEN** the visitor uses the public navigation
- **THEN** the navigation provides product capabilities, creation flow, usage scenarios, role assets, and the existing login-workbench handoff without adding a repeated header creation CTA

### Requirement: Layered role-asset showcase
The public site SHALL provide a layered role-asset carousel with one focused card, receded adjacent cards, explicit previous/next controls, progress indication, and example-only content grounded in existing demo/static boundaries.

#### Scenario: Visitor changes the focused role
- **WHEN** the visitor activates previous, next, or a visible side card
- **THEN** the selected example role becomes the focused card and the active progress state is programmatically identifiable

#### Scenario: Carousel advances automatically
- **WHEN** more than one role exists and the carousel is idle, visible, not hovered, not focus-within, and reduced motion is not requested
- **THEN** the carousel advances after approximately three seconds using the same timing and transition semantics as the AgentHub workbench

#### Scenario: Carousel must pause
- **WHEN** the carousel is hovered, contains keyboard focus, the page is hidden, reduced motion is requested, or a transition is active
- **THEN** automatic advancement pauses while manual touch and keyboard controls remain usable

#### Scenario: Focused role remains concise and accessible
- **WHEN** the visitor reviews or changes the focused role at desktop or mobile width
- **THEN** the controls expose the current role through the existing accessible counter without rendering a duplicate role-summary block, and the compact focused/adjacent cards remain fully contained with no overlap or horizontal document overflow

#### Scenario: Role exhibition uses concise copy and one card shape
- **WHEN** the role-asset exhibition renders at desktop or mobile width
- **THEN** its heading reads exactly `让角色管理更清晰、更高效。`, with the desktop phrases grouped as `让角色管理` and `更清晰、更高效。`, and the former heading is absent
- **AND** every active, inactive, visible, or transitioning role card clips its frame and image to an 18px desktop or 14px mobile radius, gives the content overlay the same lower corners, and introduces no square image edge, overflow artifact, or active-state halo
- **AND** section height, carousel geometry, controls, progress, autoplay, keyboard operation, and reduced-motion behavior remain unchanged

#### Scenario: Role exhibition presents five consistent brand examples
- **WHEN** the layered role-asset carousel renders or changes focus
- **THEN** it contains exactly 墨衡 / 叙事策略顾问, 知序 / 知识研究顾问, 沐橙 / 互动内容主持, 澄音 / 用户服务伙伴, and 拓野 / 世界观探索向导 with their approved complete descriptions and capability-focus labels
- **AND** each card uses its independent supplied close-portrait raster, identifies itself as `品牌示例`, avoids live-status or operating-data claims, preserves readable head-and-shoulder crops at desktop and mobile widths, and keeps the existing carousel interaction and pause semantics

### Requirement: Reference-mapped public page composition
The public site SHALL follow the approved live reference's full-page order and large-scale spatial model while replacing every claim, status, role, and destination with truthful AgentHub content.

#### Scenario: Visitor scans the complete page
- **WHEN** the visitor moves from the Hero to the footer
- **THEN** the page presents the Hero, layered role assets, one sticky five-stage product flow, three cinematic scenario cards, the horizontal creation-intent handoff, and a flat footer in that order without duplicate product or flow sections

#### Scenario: Desktop visitor scrolls the product flow
- **WHEN** a desktop visitor scrolls through the long product-flow container
- **THEN** the left title and stage navigation and the right product window remain in one viewport-height sticky stage while the active state advances deterministically across five truthful creation stages

#### Scenario: Mobile visitor explores the product flow
- **WHEN** the viewport is 390 px wide
- **THEN** the flow uses a non-sticky single product window with a complete touch-safe and keyboard-operable five-stage selector and no horizontal document overflow

#### Scenario: Visitor reads product-stage data
- **WHEN** any of the five product stages is active
- **THEN** the product window identifies itself as a product-interface illustration and does not display fabricated asset counts, runtime instances, conversation totals, satisfaction scores, growth claims, or unverified live success

#### Scenario: Reference-aligned Hero chrome stays truthful
- **WHEN** the public page renders any navigation, Hero, product stage, scenario, intent, or footer content
- **THEN** the R17 Hero may use the approved reference-aligned management labels and density, but every navigation item resolves to an existing AgentHub anchor or authentication route, unverified reference metrics are replaced by one truthful five-stage proof rail, public-facing copy contains no `demo` label, and pricing, documentation, fabricated customers, and unsupported operating claims remain absent

#### Scenario: Whole-page rhythm follows the live recapture
- **WHEN** the public page renders at 1440 × 1000 or 390 × 844
- **THEN** the framed full-height Hero, approved layered role exhibition, long-scroll desktop flow or button-driven mobile flow, three-image scenario strip, centered horizontal intent handoff, and flat footer retain the reference order and comparable large-scale proportions while keeping the role carousel's approved 图 1 composition

#### Scenario: Adjacent sections read as one continuous narrative
- **WHEN** the visitor crosses Hero → role assets → product flow → scenarios → creation intent → Footer at desktop or mobile width
- **THEN** the sections share a stable content rail and heading rhythm, contain no unowned spacer between role assets and flow, keep the desktop scenario copy readable after the long sticky stage, and close the mobile intent without an excessive blank tail while preserving the approved role-card geometry

### Requirement: Scoped public-site typography
The public site SHALL use local system sans-serif body and display stacks scoped to `PublicLandingPage` while authentication, workspace, and Agent Asset typography remains unchanged.

#### Scenario: Visitor reads the public marketing page
- **WHEN** the public page renders headings, body copy, navigation, controls, role titles, product stages, the intent form, or the footer
- **THEN** headings and compact display labels use the local SF Pro Display/PingFang-compatible display stack, supporting text and form copy use the local SF Pro Text/PingFang-compatible body stack, and no remote font request or new dependency is required

#### Scenario: Public typography responds across viewports
- **WHEN** the page renders at 1440 × 1000 or 390 × 844
- **THEN** Chinese display text uses a natural 800-or-lighter visual weight with restrained negative tracking, body text remains readable with relaxed leading, and headings, cards, buttons, and footer copy remain unclipped without horizontal document overflow

### Requirement: Lifecycle copy remains direct, complete, and truthful
The public site SHALL use concise lifecycle language from the reviewed R22 document while keeping the creation-intent surface aligned with its implemented behavior.

#### Scenario: Visitor understands the full creation flow
- **WHEN** the visitor reaches the five-stage product flow
- **THEN** the heading reads exactly `一个 Agent，从创建到运营` with desktop semantic lines `一个 Agent，` and `从创建到运营`, the subtitle reads `角色、知识、测试、发布、迭代，完整流程统一管理。`, and all five existing stage controls and illustrative product states remain operable

#### Scenario: Visitor scans complete audience values
- **WHEN** the three use-case cards render at desktop or mobile width
- **THEN** the section heading reads exactly `覆盖 Agent 全生命周期` and its subtitle reads `从角色创建、内容协作到测试与运营，为不同团队提供统一的 Agent 管理与协作能力。`
- **AND** the cards expose `01 独立创作者 / 从灵感到 Agent，一站完成`, `02 IP / 内容团队 / 多人协作，共同完善 Agent`, and `03 Agent 运营团队 / 持续测试、发布与运营` without the former green tags, ellipsis, or hidden overflow

#### Scenario: Visitor starts from a truthful intent surface
- **WHEN** the initial creation-intent form renders
- **THEN** its heading reads exactly `快速创建、测试与管理 Agent，让每一个角色的运营更简单。` with two semantic desktop lines, avoids claiming search behavior, and keeps the existing label, placeholder, validation, submission, session-only state, login continuation, and invitation continuation
- **AND** each of the three intent shortcuts uses the same 11px rounded shape with visible hover and focus-visible feedback while preserving click-to-fill behavior and mobile horizontal reachability
