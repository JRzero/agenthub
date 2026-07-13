# Change: Restore advanced Build controls

## Why

The AgentHub Build workspace still lacks several production capabilities from the legacy Creator: backend LLM Provider selection, Edge token reset, crop-safe Agent avatar management, and stage-specific skills.

## What Changes

- Load `/llm-providers` and map a selected Provider into the draft.
- Show, copy, and reset Edge tokens for Edge Agents.
- Add square crop, upload, and delete for Agent avatars.
- Add pre-, mid-, and post-conversation skill bindings, built-in upload Widgets, and global/Agent configuration editing.

## Impact

- Existing backend endpoints are consumed unchanged.
- Demo behavior remains local and clearly labelled.
- The generic skill list is retained for backward compatibility while staged bindings are restored.
