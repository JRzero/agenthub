# Design

Motherland is treated as an Agent Asset co-creation tool, not a general workspace chatbot. Moments are operated within the Agent Asset because all endpoints are Agent-scoped. Creator comments keep the existing prefix. Character design remains a two-step spec-then-sheet workflow with explicit save to Agent Profile.

The Motherland workspace separates free conversation from guided topic rounds instead of presenting both workflows in one undifferentiated composer. The conversation surface owns history, loading, empty, error, reset, and operation-progress states. Narrative optimization is the explicit next step: generate an editable prompt, apply it to the local Build draft, then save through the existing Build action. No new backend contract is introduced.
