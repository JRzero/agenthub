## Context

AgentHub uses Tailwind directly in page and module components. Shared classes currently cover only primary buttons, secondary buttons, panels, and status badges. Equivalent controls therefore drift between `h-8`, `h-9`, `h-10`, and `min-h-10`, while labels and horizontal padding vary independently. The application must remain compact, accessible, responsive, and compatible with both light and dark themes without adding a component-library dependency.

## Goals / Non-Goals

**Goals:**

- Establish one explicit control size scale: 36px default and 32px compact.
- Keep default control labels at 14px and compact labels at 12px.
- Make primary, secondary, destructive, field, select, and icon-only controls visually predictable.
- Reduce duplicated Tailwind size combinations in feature modules.
- Preserve focus, disabled, hover, and dark-theme behavior.

**Non-Goals:**

- Rebuild every control as a React abstraction in this change.
- Force switches, textareas, navigation rows, tabs, cards, upload targets, or authentication hero controls into a single fixed height.
- Change feature behavior, backend contracts, routing, or form validation.

## Decisions

### Use shared CSS component classes as the compatibility layer

`globals.css` will own semantic classes for buttons, fields, selects, icon buttons, and compact variants. Existing `button-primary` and `button-secondary` names remain valid but move from 40px to the 36px default.

This is preferred over introducing a required React component wrapper because existing controls include buttons, links, and labels. CSS classes can normalize all three without changing semantics or event handling. React wrappers may be introduced later when behavior, not only presentation, must be shared.

### Define two control sizes and explicit exceptions

- Default: 36px height, 14px label, 16px icon, 16px horizontal padding for action buttons.
- Compact: 32px height, 12px label, 14px icon, 12px horizontal padding.
- Icon-only: 32px square by default, with accessible names required.

Textareas remain content-sized. Switches preserve their existing track dimensions. Navigation rows and tab-like selectors keep layout-specific heights because their click target includes structural content.

### Render single-select menus inside the application

The shared `Select` component owns both the 36px trigger and the open menu. It renders an accessible combobox/listbox interaction with the application typography, 32px option rows, selected and active states, keyboard navigation, outside-click dismissal, and a portaled floating layer that is not clipped by panels. Native multi-select controls remain outside this abstraction.

This replaces reliance on the operating system's native single-select popover, whose macOS typography and row density cannot be styled consistently from CSS.

### Migrate repeated field and action patterns to semantic classes

Common `h-10 ... border ... px-3` inputs will move to `control-field`; common selects will use `control-select`; icon-only actions will use `icon-button`; and destructive confirmation actions will use `button-danger`. Layout, width, margin, and feature-specific color classes remain at the call site.

### Validate representative surfaces instead of snapshotting every route

Automated tests will assert the shared class contract and shell behavior. Browser QA will cover workbench, assets, resources, build/runtime controls, and settings in light/dark themes where available. This set exercises the shared control types without coupling tests to every feature's copy.

## Risks / Trade-offs

- [Risk] Reducing semantic buttons from 40px to 36px can expose vertical alignment assumptions. → Mitigation: migrate overrides and visually inspect representative dense and dialog layouts.
- [Risk] A custom select must preserve expected keyboard and assistive-technology behavior. → Mitigation: use combobox/listbox roles, accessible names, Arrow/Home/End/Enter/Escape handling, visible focus, and contract tests.
- [Risk] Menus can be clipped by panels or viewport edges. → Mitigation: render the listbox in a fixed portal, constrain its height, and open above the trigger when the lower viewport has insufficient space.
- [Risk] Raw one-off buttons remain inconsistent after the first migration. → Mitigation: document exception categories, add reusable icon/compact classes, and track remaining migrations in tasks rather than applying broad selectors to every button.
- [Risk] CSS classes do not enforce correct semantic HTML. → Mitigation: retain native button/link/label elements and require accessible names for icon-only controls in the specification.

## Migration Plan

1. Add shared control classes and the shared app-rendered `Select`.
2. Update semantic button defaults and remove redundant 36/40px overrides.
3. Migrate repeated fields, selects, icon buttons, and destructive actions across workspace modules.
4. Run lint, type checks, unit tests, production build, and strict OpenSpec validation.
5. Validate representative routes in the browser and record QA evidence if visual regressions require follow-up.

Rollback is limited to reverting the shared CSS and call-site class migrations; no persisted data or backend state is involved.

## Open Questions

None. The two-size scale aligns with the compact workspace direction already applied to the workbench and 50px top bar.
