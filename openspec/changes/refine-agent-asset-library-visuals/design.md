## Context

The Asset Library currently renders a title block, an optionally disclosed filter panel, and uniform cards. The data and interactions are correct, but the page gives equal visual weight to secondary text, card descriptions, status, version, and model, which slows scanning. AgentHub already provides stable canvas, surface, border, primary, semantic status, typography, button, field, and panel tokens that must remain the visual source of truth.

The UI/UX Pro Max recommendation for this product type is a compact professional SaaS dashboard with soft surface depth, clear focus states, restrained motion, persistent discovery controls, and responsive card density. The implementation maps that guidance to existing AgentHub tokens rather than introducing a second theme.

## Goals / Non-Goals

**Goals:**

- Make the page hierarchy and primary create action immediately clear.
- Make asset status, identity, description, model, version, and recent update easy to compare.
- Keep search and status filtering visible without increasing page height excessively.
- Preserve keyboard focus, touch targets, dark theme, responsive layout, and reduced-motion behavior.

**Non-Goals:**

- Changing Agent lifecycle semantics, API contracts, routes, or persistence.
- Adding sorting, bulk selection, pagination, analytics, or fabricated metrics.
- Replacing the AgentHub font, icon library, shell, or global color tokens.
- Changing transfer and deletion workflows.

## Decisions

### Use a compact page header without a collection overview

The header will combine a small semantic icon, title, description, and primary action, then transition directly into discovery controls. Collection totals remain available in the result-count label without adding a separate metric strip.

Alternatives considered: a large gradient hero or a three-cell collection summary. Both were rejected because they add vertical weight without improving the primary discovery task.

### Keep discovery controls persistent

Search and status filtering will live in one compact toolbar above the grid. A clear-filter action appears only when needed, and the result count remains visible.

Alternative considered: retain the filter disclosure button. Rejected because a single search field and one status control do not justify hiding the primary discovery path.

### Use structured asset cards

Each card will use a compact identity row, readable three-line description, metadata rows for model and update time, and a separated footer for lifecycle/version and open affordance. The card remains one primary navigation target while the existing overflow action remains separately interactive.

Alternative considered: image-dominant tiles. Rejected because Agent avatars vary in quality and the page's core task is configuration management rather than visual browsing.

### Derive presentation only from existing fields

Result counts, creation progress labels, model labels, and updated timestamps will be derived client-side from the current `Agent` response. Missing values use explicit neutral fallbacks.

Alternative considered: add dashboard endpoints. Rejected because no new backend data is needed for this visual refinement.

## Risks / Trade-offs

- [Cards expose more structured metadata and may feel dense on narrow widths] → Collapse to one column and retain truncation/line clamping at mobile breakpoints.
- [Persistent controls consume more vertical space when no filtering is needed] → Use a single 36px toolbar row on desktop and compact wrapping on mobile.
- [Whole-card links can conflict with the action menu] → Preserve explicit stacking and pointer-event boundaries, with a visible card-level focus ring.
- [Derived creation progress can drift if backend step names change] → Map known steps and use a neutral fallback without inventing version data.
- [Relative timestamps can become stale during a long session] → Present stable, coarse date labels based on the server timestamp rather than a live ticking counter.
