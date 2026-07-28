## Why

AgentHub currently defines only two shared button classes while most selects, inputs, icon buttons, tabs, and destructive actions assemble independent Tailwind size rules. The result is an inconsistent control hierarchy across workspace modules, including mixed 32/36/40px heights, 12/14px labels, and different horizontal padding for equivalent actions.

## What Changes

- Introduce a shared control sizing system with default, compact, and icon-only control variants.
- Standardize default buttons, selects, and single-line fields at 36px with 14px labels; standardize compact controls at 32px with 12px labels.
- Add reusable classes for fields, selects, icon buttons, compact buttons, and destructive buttons while preserving primary and secondary semantic variants.
- Replace native single-select popovers with a shared app-rendered combobox so macOS and other platforms use the same menu typography, spacing, selected state, and elevation.
- Migrate workspace-level filters, forms, dialogs, runtime controls, and asset lifecycle actions away from duplicated height/font/padding combinations.
- Preserve deliberate exceptions such as switches, textareas, navigation rows, large upload targets, authentication hero controls, and content cards.
- Add contract tests and visual QA coverage for representative light/dark and responsive workspace surfaces.

## Capabilities

### New Capabilities

- `agenthub-control-system`: Shared sizing, typography, semantic variants, accessibility states, and migration rules for interactive controls.

### Modified Capabilities

None.

## Impact

- Affects `src/app/globals.css`, new shared UI control helpers, and control call sites across `src/app/`, `src/modules/`, and `src/shared/`.
- Does not change backend APIs, data models, routes, storage keys, request headers, or npm dependencies.
- Existing semantic class names remain compatible, but their default visual height and padding become more compact.
