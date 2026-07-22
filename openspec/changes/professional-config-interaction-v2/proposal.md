## Why

The current professional Build workspace still exposes implementation language, mixes unavailable placeholders with real controls, uses page-level scrolling, and previews the saved Agent rather than the current saved draft. The July 22 interaction handoff defines a fixed-height creator workstation and a consistent resource-selection model.

## What Changes

- Convert Build to a fixed-height workstation with independently scrolling configuration navigation, editor content, and preview messages.
- Keep the existing manual draft-save lifecycle for this delivery; automatic save is explicitly deferred by product direction.
- Rename the primary actions to `测试当前草稿` and `发布为新版本`, distinguish the running version from the current draft, and remove draft-hash presentation.
- Present Runtime advanced fields in a collapsed section, replace editable skill identifiers with resource selection, simplify knowledge, memory, media, Moments, and safety surfaces, and hide unavailable controls and engineering explanations.
- Make the narrow Runtime preview describe and exercise the current saved draft without creating formal session-management UI.

## Impact

- Affected frontend modules: `src/modules/agent-build/`, shared Agent header composition, capability presentation, tests, and QA evidence.
- Existing Agent update, staged-skill, knowledge, avatar, Motherland, Moments, and simulate contracts are reused.
- Preview memory isolation remains backend-gated; the frontend will use the simulation contract and document the remaining side-effect limitation.
- No new dependency, route family, storage key, request header, or backend implementation is introduced.
