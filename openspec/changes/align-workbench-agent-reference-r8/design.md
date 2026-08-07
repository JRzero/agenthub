## Context

LYN-004-R8 supplies approved Workbench and Agent library reference images. The existing pages already own the required Agent queries, navigation, lifecycle filters, search/sort controls, menus, and view preference, but their visual hierarchy no longer matches those references. The older Agent library visual change also explicitly favored a text-led card, so R8 must record the user-approved reversal rather than silently drifting from that decision.

The frontend must preserve the Live/Demo capability boundary, existing DTOs, global shell navigation, R7 avatar behavior, and all Agent Studio routes. Optional Agent fields are common, collection sizes vary, and the reference contains visual concepts that have no backend provenance.

## Goals / Non-Goals

**Goals:**

- Align the two pages with the approved information hierarchy and density.
- Derive every displayed fact from existing Agent records or deterministic frontend interpretation of those records.
- Preserve all existing discovery, navigation, menu, and view-preference interactions.
- Keep the layouts usable with 0–2 Agents, missing optional fields, long copy, large collections, and narrow viewports.

**Non-Goals:**

- Adding endpoints, DTO fields, analytics, notification counts, channel presence, revenue, memory capacity, or timestamps.
- Changing lifecycle state meaning, authentication, global navigation, or Agent Studio behavior.
- Generating or importing reference-only Agent imagery.

## Decisions

### Use the existing Agent query as the single stage and library source

The Workbench orders current query results and derives previous/focused/next positions without creating duplicate records. With one Agent it renders only the focus; with two it renders one neighbor and the focus. The detail and summary surfaces read existing lifecycle, version, model, code, update time, and readiness-derived values.

Alternative considered: add reference-specific fixture records or independent Workbench data. Rejected because it would break Live/Demo provenance and could show facts unavailable from the backend.

### Make the library card image-led without changing its interaction model

The card uses a fixed visual height, places status and menu controls above the artwork, and places name/description over a bottom gradient. A compact footer contains only available model, time, and version context. The existing whole-card link, menu event isolation, list mode, filters, and persisted view choice remain authoritative.

Alternative considered: preserve the earlier text-led card. Rejected because R8 explicitly establishes the approved image-led reference as the newer visual truth.

### Apply wide canvas only to collection routes

`/workbench` and `/assets` use a wider content maximum to reproduce the reference density. All other routes retain the existing workspace canvas, so the global navigation and Agent Studio layouts do not change.

Alternative considered: widen the entire workspace shell. Rejected due to unnecessary regression risk outside R8 scope.

### Degrade optional data honestly

Existing artwork fallback behavior remains in use. Missing description, model, and version data use neutral absence wording or omit the unavailable detail; no reference metrics are synthesized. Loading, error, and empty states remain explicit.

## Risks / Trade-offs

- [Four-column reference density can reduce text space] → Clamp descriptive text, retain complete accessible labels where available, and reflow to three, two, or one column at narrower widths.
- [Artwork quality varies across real Agents] → Reuse the existing contain/fallback artwork behavior and avoid generated assets.
- [Workbench stage can imply more Agents than exist] → Render only distinct records and remove empty neighbor slots.
- [Route-scoped canvas logic can drift] → Cover `/workbench`, `/assets`, and a default route with a source-contract test.

## Migration Plan

Ship as a frontend-only replacement on the existing routes. Rollback consists of reverting the Workbench, library card, and route-scoped width changes; no persisted data or backend migration is required. Existing local view-preference values remain compatible.

## Open Questions

None for R8. Analytics and operational metrics remain unavailable until a separately specified backend contract exists.
