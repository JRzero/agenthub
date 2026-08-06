## Why

The current Workbench and Agent library drift from the approved LYN-004 V1 visual references: the Workbench lacks a multi-Agent selection stage and the library cards under-emphasize available Agent imagery. R8 aligns both surfaces while preserving the existing navigation, API contracts, lifecycle semantics, and honest Live/Demo data boundary.

## What Changes

- Restore a multi-Agent Workbench stage with neighbor selection, a focused Agent detail panel, real lifecycle totals, and recent continuation links.
- Make the Agent library grid image-led, compact, and fixed-height while retaining status tabs/counts, search, filtering, sorting, list/card views, menus, whole-card navigation, and persisted view preference.
- Define honest degradation for fewer than three Agents and missing artwork, description, version, or model fields.
- Verify loading, empty, error, long-copy, large-list, interaction, and responsive states against the approved reference viewports.
- Record that the approved R8 reference supersedes the earlier non-image-dominant card-layout decision; this is not an API or DTO change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `agenthub-workbench`: The Workbench landing experience gains a selectable multi-Agent stage, focused real-data detail, lifecycle summary, and recent continuation structure.
- `agent-asset-library-visuals`: The card view changes to an image-led, fixed-height composition with honest optional-field degradation while preserving all existing library controls and interactions.

## Impact

- Affects the Workbench UI/model, Agent library UI, route-scoped collection canvas width, visual contract tests, and QA/OpenSpec evidence.
- Does not change backend endpoints, request/response DTOs, authentication, lifecycle meanings, global navigation structure, dependencies, or Agent Studio functionality.
- Uses only current endpoint fields and the repository's isolated non-sensitive Demo fixtures; no reference-only Agents or fabricated operational metrics are introduced.
