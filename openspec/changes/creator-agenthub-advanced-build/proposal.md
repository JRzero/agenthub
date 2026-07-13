# Change: Restore advanced Build controls

## Why

The AgentHub Build workspace still lacks several production capabilities from the legacy Creator: backend LLM Provider selection, Edge token reset, crop-safe Agent avatar management, and stage-specific skills.

## What Changes

- Load `/llm-providers` and expose Provider/model choices without persisting a model override unless the Creator selects one.
- Present system Providers and custom compatibility protocols in one Provider control instead of duplicate runtime selectors.
- Group concrete backend Provider configurations by supplier so Provider and model remain separate choices.
- Preserve empty model and `null` Temperature values as explicit inheritance from system defaults.
- Show, copy, and reset Edge tokens for Edge Agents.
- Add square crop, upload, and delete for Agent avatars.
- Add pre-, mid-, and post-conversation skill bindings, built-in upload Widgets, and global/Agent configuration editing.

## Impact

- Existing backend endpoints are consumed unchanged.
- Demo behavior remains local and clearly labelled.
- The generic skill list is retained for backward compatibility while staged bindings are restored.
