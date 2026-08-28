## Why

AgentHub currently sends the public root route directly into the authenticated workspace, so prospective creators cannot understand the product or express a creation intent before signing in. The approved V4 direction provides a concrete, creator-first public experience that can now be implemented without changing backend, authentication, or invitation contracts.

## What Changes

- Replace the root redirect with a public, responsive AgentHub landing page faithful to the latest approved dark brand direction.
- Add working anchor navigation, a continuous product-state presentation, a sticky five-step creation story, three creator scenarios, and a bottom creation-intent flow.
- Store anonymous creation intent only in browser-local session storage and carry the visitor into the existing login, invitation registration, and `/assets/create` flow without claiming server generation or persistence.
- Preserve all existing workspace routes and authentication protection.
- Add route, interaction, accessibility, reduced-motion, and responsive QA coverage plus local visual evidence.
- Add a layered role-asset showcase that reuses the workbench carousel timing and pause semantics while keeping all displayed content explicitly within the existing demo/static boundary.
- Recompose the whole public page to follow the approved live reference's section order and proportions: full-screen Hero, immediate role-asset exhibition, long-scroll sticky five-stage product stage, one-row cinematic scenarios, horizontal intent handoff, and flat footer.
- Unify the final page's section seams, content rail, readable desktop scene density, action height, and mobile close so the approved narrative reads as one continuous experience.
- Rebuild the R17 Hero against the normalized 1503×734 supplied reference: preserve its exact three-line management headline, proof density, header rhythm, and dense independent-card wall while replacing unverifiable scale metrics with truthful stage/demo/live boundary labels and keeping every destination on existing routes or anchors. Treat source fidelity as part of visual acceptance: all twelve slots use distinct independent rasters, the surrounding role types occupy the same semantic positions as the reference, and the focal slot uses a perspective-corrected extraction of only the supplied card interior rather than a merely similar generated/demo portrait or a complete-wall raster.
- Keep the creation-intent input and submit action inside one semantic visual capsule: the wrapper owns the surface and focus state, the textarea remains transparent with safe text padding, and the circular submit button is centered inside the border at desktop and mobile widths.
- Clarify the role-asset exhibition with the exact `让角色管理更清晰、更高效。` heading and one consistent rounded clipping contract for active, inactive, image, content, and selectable card layers without changing carousel geometry or behavior.
- Enlarge only the Hero `进入工作台` handoff and lower its continuous status/data proof group, preserving the supplied annotation's CTA emphasis without adding an icon, changing its real login continuation, or moving any frozen Hero or downstream composition.

## Capabilities

### New Capabilities

- `agenthub-public-site`: Public landing-page content, navigation, responsive interaction, creation-intent handoff, and honest capability boundaries.

### Modified Capabilities

None.

## Impact

- Affects `src/app/page.tsx`, `src/modules/landing/`, scoped public-site raster assets, homepage tests, and local QA evidence.
- Adds no API endpoints, dependencies, configuration changes, or package-lock changes.
- Keeps `/workbench`, `/assets`, `/assets/create`, `/login`, `/register`, existing authentication storage, headers, and invitation behavior unchanged.
- Consolidates the previous standalone product and creation-flow sections into one truthful scroll-driven stage without changing product routes or capability contracts.
