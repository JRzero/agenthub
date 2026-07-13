## Context

`01-workbench.png` shows the workspace landing hierarchy: continue building, pending work, recent assets, and performance. The backend can list and create Agents, but it has no unified workbench task or analytics endpoint.

## Decisions

1. Derive pending work only from current Agent fields such as description, prompt, knowledge binding, and status.
2. Use `POST /agents` with API-key and workspace headers for live creation.
3. Insert demo-created Agents into the React Query cache and let detail queries resolve that cache before fixtures.
4. Label metrics as demo and show an unavailable state in live mode.
5. Navigate every successfully created Agent directly to its Build workspace.

## Risks / Trade-offs

- Derived tasks are not server-assigned work -> keep them deterministic and field-based.
- Demo creation is not durable -> keep it session-local and visibly demo-sourced.
- Real analytics are absent -> never render design numbers in live mode.

## Migration Plan

Add the new Workbench layout above the existing placeholder, verify creation and navigation in demo mode, then validate the live request contract with unit tests.
