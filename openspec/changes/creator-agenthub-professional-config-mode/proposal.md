## Why

The current Build workspace exposes a flat section list, a standalone Motherland entry, inconsistent Agent-scoped Moments exposure, and a preview that behaves too much like the Test workspace. This makes high-frequency Agent configuration harder to scan and leaves the media experience inconsistent with the approved professional configuration design.

This change establishes one focused professional configuration mode: grouped Build navigation, a narrower saved-configuration preview, and a media workspace where Motherland is a contextual visual-generation tool rather than a standalone product area.

## What Changes

- Replace the flat Build section rail with four professional configuration groups: Identity and Persona, Runtime Configuration, Capability Configuration, and Governance and Release.
- Keep editable Build sections in one draft while exposing Test Evaluation and Versions and Release as shortcuts to their existing Agent Asset routes instead of duplicate editors.
- Keep Agent-scoped Moments as a professional Build capability entry, keep narrative optimization inside Persona as a system-prompt helper, and remove only the standalone Motherland entry from the professional Build navigation.
- Add a Media Assets workspace for the saved avatar, avatar candidates, character sheets, and comic drafts.
- Embed Motherland generation in Media Assets through a contextual candidate-and-confirm flow; generated content MUST NOT replace saved configuration before explicit confirmation.
- Simplify the right preview to a saved-configuration feedback surface with one lightweight Runtime exchange. The desktop preview can collapse to a narrow labeled rail and expand back to its fixed-width panel without changing Runtime state; draft/published tabs, transcript management, session controls, and clear actions remain absent. Build content grows with the page so the browser window remains the only vertical scrollbar.
- Adapt the shared Agent Asset shell consistently across all Agent lifecycle routes: a full-width branded top bar, a fixed compact icon-only desktop workspace rail, and one compact Agent header. The rail exposes menu names on hover or keyboard focus and intentionally does not render a desktop expand control inside Agent Asset routes. Workspace-level routes keep the full labeled navigation, so the treatment is not Build-only.
- Merge Build reset, Save Draft, and Save and Test actions into the compact Agent header while preserving their existing save semantics.
- Tighten desktop Agent Asset density with a 60-pixel top bar, a shorter single-line Agent identity row, closer lifecycle tabs, and a narrower Build configuration rail while preserving usable control targets.
- Make Live, Demo, and unavailable media capabilities explicit. Existing avatar and current character-design contracts may be reused, while media history, asset selection, and comic-draft persistence remain unavailable in Live until backend contracts exist.

## Capabilities

### New Capabilities

- `agent-media-assets`: Covers saved visual assets, Motherland candidate generation and confirmation, capability provenance, and Live/Demo/unavailable behavior for avatar, character-sheet, and comic-draft assets.

### Modified Capabilities

- `agent-asset-build-workspace`: Changes the Build information architecture from a flat rail to grouped professional configuration, converts lifecycle destinations into route shortcuts, simplifies editor headings and helper copy, and narrows the collapsible Runtime-backed preview to saved-configuration feedback.

## Impact

- Affected frontend areas: `src/modules/agent-build/`, `src/modules/agent-assets/`, `src/shared/layout/`, Agent Build route composition, shared capability declarations, media API adapters, and related Vitest/browser QA coverage.
- Existing authenticated Agent update, avatar upload/delete, Motherland generation, character-design, and Runtime Chat APIs remain the only supported Live writes unless the backend adds new media asset contracts.
- Full asset history and typed comic-draft persistence require a cross-repository backend contract; this repository will expose those states as unavailable rather than simulate successful Live writes.
- No new npm dependency, route family, localStorage key, request header, or backend implementation is introduced by this change. The compact Agent Asset rail is route-derived rather than user-persisted.
