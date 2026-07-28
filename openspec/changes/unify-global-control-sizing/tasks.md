## 1. Shared control foundation

- [x] 1.1 Add default, compact, destructive, field, select, and icon-only control classes to the global component layer.
- [x] 1.2 Normalize native single-select height, typography, padding, caret, focus, and disabled behavior while preserving multi-select layouts.
- [x] 1.3 Add a source-level contract test that verifies the shared control size and semantic class definitions.

## 2. Workspace control migration

- [x] 2.1 Migrate workspace shell, workbench, asset list, analytics, governance, revenue, and settings controls to the shared size classes.
- [x] 2.2 Migrate Agent build, test, runtime, versions, and distribution controls while preserving structural tabs, switches, and textareas.
- [x] 2.3 Migrate resources, clients, operations, dialogs, and destructive confirmation actions to the shared semantic classes.
- [x] 2.4 Remove redundant `h-10`, `min-h-10`, font, radius, and padding overrides from migrated controls.
- [x] 2.5 Add a shared app-rendered combobox/listbox and migrate all native single-select call sites to avoid the macOS system popover.
- [x] 2.6 Add keyboard, accessibility, portal, and native-select migration contract tests for the shared dropdown.

## 3. Validation and QA

- [x] 3.1 Run targeted control tests, lint, type checking, full Vitest, production build, and strict OpenSpec validation.
- [x] 3.2 Verify representative workbench, assets, resources, build/runtime, and settings surfaces at desktop and narrow widths.
- [x] 3.3 Record any known test-environment limitation and confirm that no backend capability or data contract changed.
