# AgentHub Migration Browser QA

## Environment

- Date: 2026-07-11
- Live application: `http://localhost:3002`
- Authenticated workspace: `Default Workspace`
- Live Agent: `Motherland Test` (`/assets/32/*`)
- Isolated interaction environment: the same origin temporarily restarted with `NEXT_PUBLIC_AGENTHUB_DATA_MODE=demo`
- Browsers: Codex in-app browser and Chrome extension

## Live verification

- The authenticated Creator session restores and opens the requested protected Agent Asset route.
- Advanced Build renders Provider selection, runtime fields, safety controls, staged skills, built-in image/document Widgets, media/avatar actions, and local draft preview.
- Build section switching preserves the selected Agent and does not create backend writes.
- Motherland, Moments, character-design, narrative-optimization, scheduling, and public-share controls load for the live Agent.
- The resource catalogue loads live marketplace details and owned Creator Skill management.
- Sensitive Creator Skill configuration is masked in the DOM. Untouched protected placeholders restore the original value only when a save payload is constructed.
- A live `null` knowledge-base response now normalizes to an empty list and renders the first-knowledge-base empty state instead of crashing.
- Advanced Test and Runtime Chat mode switching loads the live Agent, schema Widget inputs, attachment controls, session restore input, and create-session action without sending a backend message.
- Light, dark, and system themes all apply immediately; the original system mode was restored.

## Isolated Demo interaction verification

- Knowledge-base selection, document table, document detail, chunk preview, reindex action, and guarded deletion controls render correctly.
- Advanced Test sends a local scenario message, renders the Agent answer, enables evaluation, and produces the frontend-derived score breakdown.
- Runtime Chat creates a local-only session, sends a message, renders a local response, clears the prior transcript on a new session, and remains isolated from live data.
- Motherland sends a local co-creation message, generates an automatic topic, enables an automatic round, generates a narrative optimization, applies it to the draft, and allows reset.
- Character design renders the existing design sheet and generates a local character specification.
- Moments generates an AI draft, publishes it into the local-only feed, and exposes the current auto-schedule.
- The active Web Chat channel exposes a locally generated SVG QR code for the exact visible URL. Copy changes to the success state, the clipboard matches the URL, and close removes the dialog.
- The repository test avatar opens the crop editor. Zoom changes from `1` to `1.05`, horizontal position from `0` to `0.05`, and vertical position from `0` to `-0.05`; accepting the crop renders a Creator avatar and the authoritative `已生成 512 × 512 裁剪头像` result while remaining local to Demo mode.
- Light mode removes the root `dark` class, dark mode applies it, system mode restores the effective system class, and reloading retains system as the current selection.

## Defects found and fixed during QA

1. Creator Skill Provider credentials were rendered as plaintext JSON. Fixed with recursive sensitive-key masking, protected placeholders, and save-time restoration.
2. A `null` knowledge-base response caused `bases.find` to throw. Fixed by normalizing nullable knowledge and document list responses to empty arrays and nullable chunk pages to an empty page.

final result: passed
