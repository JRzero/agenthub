## Context

AgentHub is a Next.js 15 / React 19 frontend whose workspace routes share `WorkspaceShell`, `WorkspaceSidebar`, and `Topbar`. The current semantic color variables are light-first with a purple primary, while individual screens consume a mix of semantic aliases and raw Tailwind palette classes. LYN-004-A is the fixed upstream UI-foundation slice: it changes the reusable visual system and shell only, preserving all existing routes, workspace/auth state, business content, API calls, and creation behavior.

The authoritative visual direction is the LYN-004 design specification and its desktop mockups, with the confirmed product constraints taking precedence where a mock shows illustrative data (notably notification badges). The primary verification widths are 1440px and 1280px.

## Goals / Non-Goals

**Goals:**

- Make the dark cinematic palette the single semantic visual foundation for the application.
- Provide reusable, accessible base states for common controls and feedback.
- Make the workspace sidebar a compact, grouped, creation-first navigation while preserving route semantics and existing actions.
- Keep shell behavior testable as pure navigation and layout contracts.
- Produce browser and automated evidence sufficient for downstream LYN-004 B–E work to build on this branch.

**Non-Goals:**

- Redesigning concrete business page content, Agent cards/lists, Studio, resources, operations, clients, or settings.
- Changing APIs, DTOs, models, authorization, storage keys, or Agent creation fields and flow.
- Adding a notification center, fabricated unread state, Living World, or V2 AI co-creation.
- Adding dependencies or changing core framework configuration.

## Decisions

1. **Dark semantic variables are the source of truth.** `globals.css` will define canvas, surface, elevated surface, border, three text levels, primary lime, success, warning, danger, and info. Tailwind names remain semantic aliases so downstream modules can migrate without binding to raw colors. A light class will not reintroduce purple; this V1 shell is intentionally dark-first. This is preferred over page-local palette replacement because it prevents drift and gives later page slices a stable contract.

2. **Existing utility class names remain compatible where practical.** Existing `canvas`, `surface`, `subtle`, `border`, `primary`, `text-strong`, and `text-muted` consumers will inherit the V1 palette, while new aliases expose elevated surface, secondary text, and info. This avoids a broad business-page rewrite outside the task boundary.

3. **Reusable component states live in the shared UI layer.** Global component utilities cover buttons, controls, cards/panels, table framing, statuses, skeleton/loading, empty state, and persistent error feedback. Small React wrappers are added only where semantics or structured content benefit from a reusable API. This is preferred over a new component-library dependency because dependencies are out of scope and the project already uses Tailwind and Phosphor icons.

4. **Navigation structure is modeled as explicit groups.** `navigation.ts` will export stable group metadata and a pure active-route resolver. The sidebar renders a top workspace switcher and Create Agent action, then Workbench/Agent/Resources, Operations, Management, and bottom tools. Existing routes remain the destinations; where two management labels share `/governance`, only the route-relevant match is highlighted according to an explicit resolver rather than allowing duplicate active states.

5. **Bottom tools expose only honest state.** Help, Settings, and Account preserve their existing actions. Notification chrome may be present only as a non-counted, non-badged unavailable action if that matches current behavior; no red dot, number, or fabricated unread state is rendered. Living World is absent from navigation metadata and shell content, and tests assert its absence.

6. **Shell modes remain pure and responsive.** Existing create/build fixed-height modes and asset sidebar collapse behavior remain governed by `shell-mode.ts`. Desktop shell dimensions use a 200px expanded sidebar and preserve a mobile drawer. The 1280px layout compresses secondary chrome without hiding the persistent create action or bottom tools.

7. **Visual QA uses the approved workbench mock as the shell reference.** Comparison will normalize to matching desktop viewports and explicitly record the intentional removal of the mock's illustrative notification count. Browser evidence will cover 1440px and 1280px, route highlighting, workspace switching, help/settings/account access, focus visibility, and console errors.

## Risks / Trade-offs

- [Risk] Raw purple/indigo utilities remain in business modules outside this task and could visually surface after the global shell changes. → Mitigation: remove legacy primary usage from shared shell/base primitives, scan the repository, and document remaining page-owned occurrences for B–E rather than editing business content.
- [Risk] Two management concepts currently share the `/governance` route. → Mitigation: represent one route destination without duplicate active styling; keep labels/routes honest until a later approved page slice provides distinct anchors or routes.
- [Risk] Forcing a dark foundation can expose low-contrast legacy page styles. → Mitigation: keep compatibility aliases, run the full build/test suite, and browser-check representative shell routes at both required widths.
- [Risk] Reference images contain illustrative product data forbidden by the contract. → Mitigation: treat information architecture, proportions, spacing, and visual language as the target while retaining live application content and explicitly omitting fake notification state.
- [Trade-off] This slice establishes reusable states but does not convert every page-specific raw Tailwind class. Downstream B–E page work owns those migrations.

## Migration Plan

1. Introduce and test semantic variables and shared component states.
2. Replace shell navigation metadata and layout rendering while retaining existing route targets and actions.
3. Add pure contract tests for groups, active routes, shell modes, and prohibited entries.
4. Run lint, typecheck, tests, build, and strict OpenSpec validation.
5. Verify locally at 1440px and 1280px and save QA evidence under `docs/qa/`.

Rollback is a normal source revert of this isolated branch; no data or backend migration is involved.

## Open Questions

None. The task contract and LYN-004 V1 decisions resolve the implementation scope.
