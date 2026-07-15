# Professional Config Shared Shell QA

## Scope

- Shared compact Agent Asset shell across Overview, Build, Test, Versions, and Distribution routes.
- Full-width AgentHub top bar and icon-only desktop workspace rail.
- Compact Agent identity/lifecycle header with Build actions mounted once.
- No workspace-level or mobile navigation regression.

## Browser evidence

- Reference: `docs/qa/design-reference/professional-config-shell-target.png`
- Before: `docs/qa/images/professional-config-shell-before.png`
- After: `docs/qa/images/professional-config-shell-after-1648x928.png`

At 1648 × 928:

- top bar: 1648 × 68 at x=0
- compact rail: 88 × 860 at x=0, y=68
- Agent header: 1560 × 123 at x=88, y=68
- horizontal overflow: none
- visible Build action count: one Reset, one Save Draft, one Save and Test

Regression checks:

- `/assets`: 224px labeled sidebar and top bar beginning at x=224

## Collapsible navigation interaction

Evidence:

- Compact hover: `docs/qa/images/professional-config-navigation-collapsed-hover-1648x928.png`
- Expanded labels: `docs/qa/images/professional-config-navigation-expanded-1648x928.png`

Verified at 1648 x 928:

- Compact rail is 88px and the main content uses 88px left padding.
- Hovering the Agent Asset icon reveals the `Agent 资产库` tooltip at full opacity.
- The Expand navigation control changes the rail to 224px and the main content to 224px left padding.
- Expanded navigation keeps labels visible and exposes the Collapse navigation control.
- Collapsing restores the 88px rail and matching content offset.
- Compact and expanded states have no horizontal page overflow.

Regression checks:

- Workspace-level `/assets` remains a 224px labeled sidebar with no Agent-only toggle.
- At 390 x 844 the mobile drawer keeps labels visible and hides the desktop toggle.
