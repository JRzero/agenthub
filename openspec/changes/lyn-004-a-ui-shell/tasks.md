## 1. Design Foundation

- [x] 1.1 Replace the global light/purple variables with the approved dark semantic token set and add Tailwind aliases for elevated, secondary, muted, and info colors
- [x] 1.2 Update reusable button, control, panel/card, table, status, empty, loading, and persistent-error states with accessible sizing, focus, and reduced-motion behavior
- [x] 1.3 Add or update shared UI contract tests for semantic tokens and reusable control/feedback states

## 2. Application Shell

- [x] 2.1 Model grouped workspace navigation and pure route-active resolution for Workbench, Agent, Resources, Operations, Management, and bottom tools
- [x] 2.2 Implement the compact expanded/collapsed/mobile sidebar with workspace switching and a persistent Create Agent action
- [x] 2.3 Align the topbar and workspace content offsets with the V1 shell while preserving help, settings, account, authentication, and workspace behaviors
- [x] 2.4 Add navigation and shell tests covering route highlighting, shell modes, workspace utilities, notification honesty, and Living World absence

## 3. Responsive and Visual QA

- [x] 3.1 Verify the shell at 1440px and 1280px, keyboard focus, primary interactions, horizontal overflow, and browser console state
- [x] 3.2 Save normalized screenshots and a passing design QA comparison report under the approved QA locations

## 4. Validation and Handoff

- [x] 4.1 Run lint, typecheck, full tests, production build, and `openspec validate --all --strict`, fixing in-scope failures
- [x] 4.2 Record final scope, evidence, deviations, remaining page-owned legacy colors, and downstream B–E readiness in the QA report
