## Context

The approved `06-distribution.png` presents a release console with a multi-client table and a governance rail. The legacy Creator already manages one real distribution channel through the public share-link API. It does not expose client-adapter publication, package export, license manifests, audit history, global pause, or version rollback APIs.

The new frontend must make public sharing production-useful while preserving the broader AgentHub information architecture without representing design fixtures as backend truth.

## Goals / Non-Goals

**Goals:**

- Match the approved release-console hierarchy in the selected Agent Asset route.
- Read, create, enable, pause, and copy the existing public Web Chat share link.
- Show version, compatibility, publication, and recency for four application endpoints.
- Generate a safe Public Agent Card from existing public Agent fields.
- Make governance and export boundaries understandable and interactive.
- Separate live, demo, derived, and unavailable behavior visibly.

**Non-Goals:**

- Adding adapter, package-export, license, audit, or rollback backend endpoints.
- Exporting system prompts, knowledge bindings, runtime secrets, or user-relationship memory.
- Claiming demo client publication as production state.
- Implementing private deployment or credential provisioning.

## Decisions

### 1. Treat public sharing as the only live channel

The Web Chat row maps to the existing share-link GET, POST, and PATCH contract with current API-key and workspace headers. All other live rows remain unpublished until a backend contract exists.

### 2. Keep demo adapter writes in component state

Demo publication, configuration, pause, and version release update only the current browser session. They never call production endpoints or localStorage.

### 3. Export a deliberately narrow Public Agent Card

The generated JSON contains schema version, public identity, description, asset version, avatar reference, share URL, and generation time. It excludes prompt, examples, model credentials, knowledge binding, tools, and memory.

### 4. Model governance as actionable boundaries, not fake forms

License, export, memory, safety, and audit entries open detailed boundary panels. Unsupported writes are explicitly described rather than saved locally in live mode.

### 5. Route rollback through the existing version workspace

The rollback entry navigates to the version timeline. The actual rollback control stays unavailable because no backend restore endpoint exists.

### 6. Keep release metadata and row actions in separate columns

Recent release is historical metadata, while link generation and adapter configuration are commands. The table keeps them in separate, labeled columns and switches to a labeled two-column card layout when the available workspace width cannot support the desktop grid. The desktop action column is narrow and centered, and every row uses an equal-width text action instead of mixing unlabeled icon menus with text buttons. The surrounding workspace uses min-width containment so the governance rail cannot force the release overview outside its column.

## Risks / Trade-offs

- [The full table may imply all channels are live] -> Source badge, status rows, and unsupported dialogs distinguish real public sharing from demo or unavailable channels.
- [Public exports may leak sensitive fields] -> Build the card from an allowlist and unit-test that prompt and knowledge fields are absent.
- [Share GET may return 404] -> Treat 404 as an unpublished Web Chat channel instead of a page error.
- [Global pause is unavailable] -> In live mode scope pause to the existing public share link and label it accordingly.

## Migration Plan

1. Preserve the approved distribution reference inside the new project.
2. Add typed distribution state, share-link API mapping, safe export, and interface components.
3. Verify demo interactions and live capability boundaries in the browser.
4. Compare the implementation and reference at the same viewport and record design QA.

Rollback removes the Distribution layout/module and restores the placeholder. No stored data requires migration.
