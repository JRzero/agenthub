# Change: Restore Motherland and Moments workflows

## Why

Legacy Creator users can co-create an Agent with Motherland and operate its Moments feed. Those production workflows are still absent from the AgentHub Build workspace.

## What Changes

- Add Motherland status, history, manual talk, auto topic/round, and reset.
- Add Motherland narrative optimization and character design generation/save.
- Add generated avatar preview and acceptance through the existing avatar endpoint.
- Add Moment draft, image upload, publish, list, delete, Creator comments, and automatic schedules.
- Add deletion of public share links.

## Impact

- Existing backend contracts are reused unchanged.
- Demo mode never fabricates generated raster images; image-model actions explain the boundary.
- Build receives dedicated Moments and Motherland sections.
