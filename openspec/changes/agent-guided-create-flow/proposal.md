## Why

The current Agent creation entry immediately creates an Agent from a small modal and redirects to professional Build. Creators must then assemble identity, persona, avatar, character design, and skills across separate tools. This conflicts with the approved first-creation journey and can leave incomplete records before any generated role content is usable.

## What Changes

- Replace the creation modal with a four-step full-page wizard for basic role setup, avatar confirmation, character-sheet confirmation, and optional skill selection.
- Keep generated text and images as candidates until explicit confirmation; regeneration never replaces confirmed content.
- Establish the creating draft only after the first successful basic-role generation and preserve revision-aware autosave, save-and-exit, and resume behavior after that point.
- Select skills only from the current Workspace resource catalog and hide technical identifiers, schemas, stages, and configuration controls.
- Finish with an unpublished draft and route creators to draft testing or professional configuration without showing a version number or Version Hash.
- Preserve honest Live capability boundaries. Missing atomic creation, workflow-resume, media candidate, asset-library, and skill-version contracts remain explicit backend dependencies rather than frontend simulation.

## Capabilities

### New Capabilities

- `agent-guided-create-flow`: Covers the full-page creation workspace, four-step progression, candidate confirmation, creating-draft lifecycle, autosave and resume, optional skills, and unpublished completion state.

### Modified Capabilities

- `agent-asset-list`: Routes new-Agent actions into the guided flow and represents creating Agents without fabricating version metadata.
- `agent-media-assets`: Reuses confirmed avatar and character-sheet writes while keeping transient creation candidates out of the saved draft.

## Impact

- Affected frontend areas: Agent list and Workbench create actions, workspace shell route handling, a new `agent-create` module, Agent draft/query contracts, Motherland adapters, skill resource adapters, and related Vitest/browser QA coverage.
- Backend dependencies: atomic base generation plus draft establishment, persisted creation progress, revision-aware specialized writes, avatar candidate generation, Live asset selection, and stable skill-version references.
- No new npm dependency, localStorage key, request header, automatic publish action, version creation, Client operation, or Demo-backed Live write is introduced.
