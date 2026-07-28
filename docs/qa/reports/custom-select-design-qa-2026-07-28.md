# Design QA — AgentHub custom select

- Source visual truth: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-82eb0345-4cdb-435d-8cd8-81398512ae64.png`
- Implementation screenshot: `/Users/king/Projects/linkyun/agenthub/docs/qa/images/custom-select-open-2026-07-28.png`
- Viewport: 1512 × 688 CSS px, device pixel ratio 2
- Focused source pixels: 466 × 470
- Focused implementation pixels: 466 × 454
- State: light theme, resource skill category dropdown open, “全部技能” selected
- Density normalization: browser capture was returned at the same 466px focused width as the source; comparison used the visible control region rather than browser chrome

## Full-view comparison evidence

The source is the reported defect state, not a target to reproduce: macOS renders an
oversized native popover with approximately 28px option text and tall system rows.
The implementation keeps the surrounding resource-library hierarchy intact while
replacing only the select trigger and open menu.

## Focused-region comparison evidence

The focused comparison confirms:

- The trigger is 36px high with a 14px label and 6px radius.
- The menu uses a 14px label, 20px line height, 32px option rows, 8px radius,
  application border/elevation tokens, and a 256px maximum height.
- The selected row uses the AgentHub primary-soft background and primary text
  instead of the macOS blue system selection.
- All eight labels and their order match the source content.
- At a 780 × 800 viewport, the menu stayed within the viewport at
  left 420px / right 568px / top 209px / bottom 465px.

## Findings

No actionable P0, P1, or P2 differences remain against the corrective design goal.

- P3: The verification screenshot contains the browser pointer over the trigger.
  This is capture-only and does not affect the rendered component.

## Required fidelity surfaces

- Fonts and typography: passed; 14px / 20px application UI typography replaces
  the oversized operating-system menu text.
- Spacing and layout rhythm: passed; 36px trigger, 32px rows, 4px trigger-to-menu
  gap, compact check gutter, and consistent menu padding.
- Colors and visual tokens: passed; surface, border, muted, primary-soft, primary,
  and shadow tokens are used in both light and dark-compatible styles.
- Image quality and asset fidelity: not applicable; this component has no raster
  imagery, logos, or custom decorative assets. Icons use the existing Phosphor
  icon library.
- Copy and content: passed; option labels and order are unchanged.

## Interaction verification

- Combobox, listbox, and option semantics are exposed in the accessibility tree.
- End + Enter selected “图像” and closed the menu.
- Escape closed the menu without changing the selection.
- The open menu remained inside the narrow viewport.
- Browser console errors: none.

## Comparison history

### Pass 1

- Earlier P0/P1/P2 findings: none.
- Fixes made after capture: none required.
- Post-fix evidence: the initial implementation capture and measured interaction
  state satisfied the corrective goal.

final result: passed
