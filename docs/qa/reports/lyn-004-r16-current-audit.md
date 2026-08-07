# LYN-004-R16 Current-State Audit

## Scope and evidence

- Scope: the session-version notice inside the selected Version detail card only.
- User feedback: `/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-08b8d79b-ce30-4c28-a21a-ff4eb0d61bdc.png`.
- Before full page: `docs/qa/images/lyn-004-r16/01-before-full-1440x900.png`.
- Before visible state: `docs/qa/images/lyn-004-r16/04-before-visible-default.png`.
- Before/after focused comparison: `docs/qa/images/lyn-004-r16/08-before-after-focus-comparison.png`.

## Numbered audit steps

1. Opened the supplied feedback image and identified the single high-luminance blue notice inside the dark Version detail card.
2. Located the real rendering branch in `VersionDetail`; both current and historical-version copy share the same notice container.
3. Captured the current R15 Demo state before editing and sampled computed styles from the rendered element.
4. Confirmed that the defect was the light-theme surface pairing, not font size, padding, text content, or application state.

## Measured before state

- Foreground: `rgb(29, 78, 216)`.
- Background: `rgb(239, 246, 255)`.
- Border: `rgb(191, 219, 254)`, 1px.
- Geometry at the default desktop Browser viewport: 647.63 × 42px.
- Typography: 14px / 20px.
- Document overflow: `scrollWidth = clientWidth = 1269`.

## Findings

- P0: 0.
- P1: 1 — a large light-theme info fill interrupted the dark hierarchy and visually outweighed the Version detail content.
- P2: 0.

The original blue text on the light fill was readable in isolation, but the semantic surface was inconsistent with the existing R15 dark info treatment. The required correction is a foreground/background pairing change only.
