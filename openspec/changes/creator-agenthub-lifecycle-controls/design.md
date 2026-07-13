# Design

Workspace switching is optimistic but reverts if `/user/workspace/switch` fails. Invite codes remain scoped through `X-Workspace-Code`. Agent transfer updates `workspace_id`; delete requires the exact Agent name. Successful transfer/delete evicts the Agent from the current workspace cache and returns to the library.
