## ADDED Requirements

### Requirement: Five semantic label variants
AgentHub SHALL render every non-interactive Badge, Tag, or Pill with exactly one of `success`, `warning`, `info`, `danger`, or `neutral` semantic variants while preserving the existing business state, copy, and icon meaning.

#### Scenario: Positive state label
- **WHEN** a label communicates published, live, saved, online, or successful state
- **THEN** the interface renders it with the `success` semantic variant and keeps a lower visual hierarchy than the primary CTA

#### Scenario: Non-positive semantic labels
- **WHEN** a label communicates attention, progress, failure, risk, disabled, archived, type, category, permission, or ordinary metadata
- **THEN** the interface maps it to `warning`, `info`, `danger`, or `neutral` according to its meaning rather than using one brand color for every label

### Requirement: Dark ghost label appearance
AgentHub SHALL render all five label variants with a dark low-saturation background, a thin semantic border, and high-contrast text, and MUST NOT render white, cream, or light pastel solid label backgrounds.

#### Scenario: Label on application surfaces
- **WHEN** a semantic label appears on a dark surface, card, table, title bar, or image overlay
- **THEN** its fill remains dark, its boundary remains visible, and its normal-size text contrast against its own background is at least 4.5:1

### Requirement: Labels provide non-color meaning
AgentHub SHALL preserve readable text and existing semantic icons so that label meaning is not communicated by color alone.

#### Scenario: Color is unavailable
- **WHEN** a user cannot distinguish the semantic colors
- **THEN** the label text and any existing icon still identify the state, type, phase, or metadata meaning

### Requirement: Interactive and feedback components remain isolated
AgentHub MUST NOT apply the label theme to buttons, Tabs, filters, selectors, inputs, segmented controls, notifications, Toasts, Tooltips, or progress indicators.

#### Scenario: Visually similar interactive control
- **WHEN** an interactive or feedback component uses a rounded shape or semantic color similar to a label
- **THEN** it retains its existing component styling and behavior and does not receive the shared label class

### Requirement: Global label inventory and route verification
AgentHub SHALL maintain a verifiable inventory of shared components, CSS/tokens, inline label styles, routes, current semantics, exclusions, and migration results, and SHALL verify labels across all real workspace and Agent Asset routes including empty, loading, and error states.

#### Scenario: Label theme completion review
- **WHEN** the global label change is handed off
- **THEN** the inventory identifies every migrated label candidate and justified exclusion, and browser evidence covers image overlays, dense lists or tables, detail title bars, required responsive viewports, and fresh-session console results

### Requirement: Automated label theme regression protection
AgentHub SHALL automatically verify semantic mappings, all five contrast ratios, prohibition of light solid label fills, and representative non-label component isolation.

#### Scenario: Theme regression is introduced
- **WHEN** a label variant or call site reintroduces a forbidden light fill, insufficient contrast, an unmapped semantic style, or a label class on a protected non-label component
- **THEN** the automated test suite fails with an actionable assertion
