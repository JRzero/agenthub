## Why

AgentHub currently sends the public root route directly into the authenticated workspace, so prospective creators cannot understand the product or express a creation intent before signing in. The approved V4 direction provides a concrete, creator-first public experience that can now be implemented without changing backend, authentication, or invitation contracts.

## What Changes

- Replace the root redirect with a public, responsive AgentHub landing page faithful to the approved V4 visual direction.
- Add working anchor navigation, a continuous product-state presentation, a sticky five-step creation story, three creator scenarios, and a bottom creation-intent flow.
- Store anonymous creation intent only in browser-local session storage and carry the visitor into the existing login, invitation registration, and `/assets/create` flow without claiming server generation or persistence.
- Preserve all existing workspace routes and authentication protection.
- Add route, interaction, accessibility, reduced-motion, and responsive QA coverage plus local visual evidence.

## Capabilities

### New Capabilities

- `agenthub-public-site`: Public landing-page content, navigation, responsive interaction, creation-intent handoff, and honest capability boundaries.

### Modified Capabilities

None.

## Impact

- Affects `src/app/page.tsx`, a new `src/modules/landing/` module, scoped public-site assets, homepage tests, and local QA evidence.
- Adds no API endpoints, dependencies, configuration changes, or package-lock changes.
- Keeps `/workbench`, `/assets`, `/assets/create`, `/login`, `/register`, existing authentication storage, headers, and invitation behavior unchanged.
