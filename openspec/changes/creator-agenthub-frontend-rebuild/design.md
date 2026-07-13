## Context

The legacy Creator frontend is a standalone Next.js 15 application. It already supports creator authentication, workspace switching, Agent CRUD, prompt and model configuration, knowledge and skill binding, test conversations, shared-session review, media uploads, and public share links. Its product structure is still feature-oriented, and key implementation files have grown too large to safely evolve into the AgentHub asset platform.

The approved AgentHub direction introduces two product scopes:

1. A workspace scope for global modules such as assets, resources, clients, operations, analytics, governance, revenue, and settings.
2. An Agent Asset scope for overview, build, test and evaluation, versions, and distribution of a selected Agent.

The backend will not be changed in this phase. Some visual modules therefore have no production API yet. The new frontend must distinguish real backend data from derived frontend presentation and demo-only future-platform data.

## Goals / Non-Goals

**Goals:**

- Create a self-contained root application that can run beside the legacy Creator UI.
- Recreate the approved Agent Asset overview at desktop fidelity and make both navigation scopes unambiguous.
- Preserve authentication, workspace, theme, API-base override, request header, and backend response compatibility.
- Split frontend code by product domain and keep route components small.
- Provide a typed capability boundary for live, demo, and unavailable features.
- Establish automated code-quality gates and a browser-based visual QA gate.

**Non-Goals:**

- Changing backend endpoints, schemas, authentication, or database state.
- Replacing or deleting the legacy Creator UI during the migration.
- Switching production traffic or changing root deployment scripts.
- Pretending that client adapters, version history, package export, governance, analytics, or revenue are live backend features.
- Completing every AgentHub module in the first vertical slice.

## Decisions

### 1. Create a new Next.js application instead of refactoring in place

The root application will use Next.js 15, React 19, TypeScript strict mode, App Router, Tailwind CSS, and standalone output. This preserves the current deployment shape and supports nested asset routes while isolating the rebuild from the production Creator UI.

Alternatives considered:

- In-place refactor: rejected because it would mix migration work with production maintenance and retain oversized legacy modules.
- Generic Vite prototype starter: rejected for the production project because it would change routing and deployment conventions. The Product Design workflow remains the visual implementation and QA standard.

### 2. Use workspace routes plus asset-scoped routes

Global routes live under a workspace shell. Asset-specific lifecycle routes live under `/assets/[agentId]/*`. The left sidebar expresses workspace scope; a horizontal tab bar inside the selected asset header expresses Agent Asset scope.

The first implemented route is `/assets/[agentId]/overview`. `/assets` resolves live Agents and links to their overview. Placeholder global and asset routes use explicit capability states rather than dead controls.

### 3. Split the API client by domain

The new app will use a shared HTTP client responsible for:

- `NEXT_PUBLIC_API_URL` resolution and `linkyun-api-url-override`.
- `/api/v1` prefixing.
- `X-API-Key` and optional `X-Workspace-Code` headers.
- JSON parsing, error normalization, and unauthorized events.

Domain modules will own auth, workspace, and Agent contracts. Additional domains can be migrated independently. The legacy `api.ts` will remain unchanged.

### 4. Preserve browser storage compatibility

The new app will read and write the existing keys:

- `linkyun_auth`
- `linkyun-api-url-override`
- `linkyun-theme`
- `linkyun_current_workspace_code`

This enables side-by-side testing without forcing users to sign in again. Browser storage access stays behind client-only hooks to avoid hydration mismatches.

### 5. Map backend Agent data to an Agent Asset view model

The backend `Agent` remains the source of truth. A presentation mapper will create an `AgentAssetOverview` with identity/persona, knowledge, skills, memory, media, runtime, and safety rows. Completion percentages are labelled as frontend asset completeness, not backend evaluation scores.

### 6. Make unsupported platform capabilities explicit

A checked-in capability registry assigns each feature one of `live`, `derived`, `demo`, or `unavailable`. Production mode defaults to live data. Demo fixtures require `NEXT_PUBLIC_AGENTHUB_DATA_MODE=demo` and must never trigger production writes.

### 7. Build a small design system from the approved visual target

CSS variables define white and cool-gray surfaces, slate typography, indigo primary, semantic status colors, border radius, and spacing. Shared primitives cover buttons, badges, progress, rows, empty states, and skeletons. Phosphor-style outline icons are used through an icon library; the existing AgentHub brand image is reused rather than redrawn.

The desktop reference viewport is 1440 × 1024. The shell remains usable at narrower widths by collapsing the sidebar and preserving primary actions without horizontal page overflow.

### 8. Treat the overview as a functional vertical slice

The overview supports loading the selected live Agent, workspace switching, navigating between both scopes, continuing to build, entering test, retrying failed requests, and loading/empty/unauthorized/demo states. Future-route controls may be visual-only only when clearly marked unavailable.

### 9. Verify code and visual fidelity independently

Code gates are lint, TypeScript, unit tests, and production build. Visual completion requires a running local app, browser interaction checks, a captured 1440 × 1024 screenshot, and `design-qa.md` with `final result: passed` after comparison with the approved source image.

## Risks / Trade-offs

- [Backend coverage is smaller than the approved platform design] -> Use capability states and never present demo fixtures as live production facts.
- [Shared localStorage keys can couple old and new clients] -> Preserve the existing schema exactly and isolate reads/writes in one auth module.
- [Frontend completeness can be confused with quality scoring] -> Label it as asset completeness and document the derivation.
- [A second frontend increases temporary maintenance cost] -> Freeze feature expansion in the legacy UI and migrate by vertical slice.
- [Next.js client-side auth can cause hydration drift] -> Render a deterministic loading shell until browser storage is ready.
- [Visual fidelity can encourage static-only implementation] -> Require working primary navigation, workspace selection, retry, and asset actions before QA can pass.

## Migration Plan

1. Build and verify the root application on port 3002 while the legacy Creator stays on port 3000.
2. Connect both clients to the same non-production backend and compare authentication, workspace, and Agent reads.
3. Migrate additional live domains behind the same API and capability boundaries.
4. Run a separate cutover change for deployment configuration, domain traffic, and legacy retirement.
5. Roll back at any time by stopping the new client; no backend or legacy frontend rollback is required in this phase.

## Open Questions

- Future backend ownership for adapters, version history, governance, analytics, and revenue is intentionally deferred.
- Production cutover timing and the final legacy Creator retirement policy require separate approval.
