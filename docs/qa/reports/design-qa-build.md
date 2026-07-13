# AgentHub Build Workspace Design QA

## Evidence

- Source: `../design-reference/agent-build-workspace.png`
- Implementation: `../design-reference/build-implementation-final-1440x1024.png`
- Viewport: 1440 x 1024
- Route: `/assets/32/build`
- State: demo workspace, selected section `角色人格`, tab `基础设定`, clean draft
- Browser: Codex in-app browser

The source and implementation were opened together at the same viewport and equivalent editor state for the final comparison.

## Mandatory comparison

### Layout and spacing

- Passed: both views use an ordered construction rail, focused central editor, persistent action bar, and real-time preview column.
- Passed: section density, editor width, divider rhythm, preview controls, and bottom composer preserve the desktop hierarchy.
- Intentional difference: the implementation retains the selected Agent Asset header above Build because the approved product architecture requires workspace scope plus Agent Asset scope. The source image predates that locked two-level shell.

### Typography, color, and surfaces

- Passed: slate hierarchy, compact Chinese labels, indigo active states, white surfaces, cool-gray canvas, fine borders, and minimal elevation match the established AgentHub design tokens.
- Passed: Phosphor icons remain consistent across the global shell, section rail, toolbar, and preview.

### Image quality

- Passed: the real project-local 林月 avatar is rendered without cropping, stretching, broken state, or placeholder art.

### Content and capability integrity

- Passed: the editor combines role positioning, speaking style, behavior rules, and boundaries into the existing system prompt rather than inventing unsupported backend fields.
- Passed: demo provenance, local preview provenance, unavailable media, and unavailable advanced safety operations are explicit.

### States and interactions

- Passed: section switching preserves draft state.
- Passed: dirty, reset, saved, validation-error, and demo-local save states were exercised.
- Passed: name changes update the preview immediately while the saved Agent header remains stable.
- Passed: starter prompts and the preview composer create a clearly labelled local transcript.
- Passed: Save and Test navigates to `/assets/32/test`.
- Passed: the final browser console contains no application warnings or errors.

### Responsiveness and accessibility

- Passed at 390 x 844: no page-level horizontal overflow; toolbar actions wrap, section navigation becomes horizontally scrollable, and primary inputs remain reachable.
- Passed: semantic buttons, labels, pressed states, disabled states, alt text, focus styles, and live save feedback are present.

## Findings history

1. P1 functional placeholder: the Build route originally rendered only a migration notice. Replaced with the functional construction workspace.
2. P2 narrow-width density: the desktop section rail would be unusable when compressed. It now becomes a contained horizontal rail without expanding the page width.
3. P3 fidelity: the source uses four separate persona textareas, while the implementation uses one system-prompt editor because that is the only real backend contract. This is retained as an intentional product-integrity trade-off.

final result: passed
