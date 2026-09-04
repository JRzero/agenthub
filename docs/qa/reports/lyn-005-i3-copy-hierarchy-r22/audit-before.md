# LYN-005-I3 R22 fresh combined UX / design / accessibility-risk audit

Date: 2026-08-31
Surface: `PublicLandingPage` only
Viewports: 1465×802 and 390×844
Evidence: current-run screenshots under `docs/qa/images/lyn-005-i3-copy-hierarchy-r22/before/`

## Audit scope

Review the three DOCX-annotated sections without changing the frozen Hero, role-assets carousel, product-stage interaction, authentication boundaries, imagery, footer, or downstream routes. The source document was rendered to three pages and all seven embedded screenshots were inspected.

## User goal and accessibility target

Visitors should understand the complete Agent lifecycle, scan three audience-specific use cases without truncated copy, and start a real creation-intent flow from clear language and keyboard-visible suggestion controls. Visible content must reflow at 390px without horizontal document overflow.

## Numbered audit

1. **Creation flow — healthy interaction, P1 information hierarchy risk.**
   - Strength: the five-stage selector and right-hand Demo product panel are clear, linked, and keyboard-operable.
   - Risk: `从一个想法 / 到持续生长` is evocative but underspecifies that the section covers creation through operation. The subtitle asks the visitor to scroll rather than naming the managed lifecycle.
   - Accessibility risk: no visible focus or semantics defect was confirmed from the screenshot; keyboard behavior still requires direct testing after the copy change.
2. **Use cases — P1 copy legibility risk.**
   - Strength: the three large cinematic images create a strong one-row desktop rhythm and a readable stacked mobile rhythm.
   - Risk: every card carries a green tag plus a long sentence clipped with `text-overflow: ellipsis` on desktop. The value proposition is incomplete at the moment it needs to be scannable.
   - Accessibility risk: essential meaning must not depend on clipped text. The replacement sentences should remain fully visible under zoom/reflow.
3. **Creation intent — healthy control behavior, P1 expectation-setting risk and P2 affordance inconsistency.**
   - Strength: the submit button is correctly contained inside the input capsule; the form has a real label, required/maxLength validation, session-only state, and existing login/invitation continuation.
   - Risk: `从一句话开始，让它走进真实世界。` is poetic but does not explain the concrete create/test/manage outcome. The square suggestion buttons read as small utility boxes rather than one consistent set of selectable examples.
   - Accessibility risk: hover is defined, but the chips need an explicit `:focus-visible` treatment. Mobile horizontal chip scrolling must remain reachable without creating document overflow.

## Opportunity areas

- Replace the three headings/subtitles with the approved direct lifecycle language.
- Reduce scenario cards to number + title + one complete value sentence; remove the tag and the ellipsis contract.
- Give all intent examples one 11px rounded shape with matched hover/focus-visible feedback.

## Evidence limits and verification gaps

- Screenshots can confirm hierarchy, wrapping, clipping and visible focus styling, but not screen-reader announcements or complete WCAG compliance.
- Reduced-motion, keyboard order, chip fill, form submit/return, stage switching, console output and document overflow require browser interaction checks after implementation.

## Before baseline

- Desktop: document width 1454px, scroll width 1454px, scroll height 5948px.
- Mobile: document width 379px, scroll width 379px, scroll height 4438px.
- Desktop scenario value copy computes to `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`.
- Desktop intent suggestions compute to `border-radius: 0px`; their first button is 112.5×31px.
