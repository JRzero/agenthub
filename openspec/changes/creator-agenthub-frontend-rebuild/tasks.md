## 1. Project Foundation

- [x] 1.1 Create the standalone root-level Next.js 15 application and project-local package configuration
- [x] 1.2 Add strict TypeScript, Tailwind design tokens, lint, unit-test, and production-build scripts
- [x] 1.3 Preserve the approved source design and reusable brand assets inside the new project
- [x] 1.4 Add route groups and domain directories for workspace shell, Agent assets, auth, workspace, and shared infrastructure

## 2. Data And Compatibility Layer

- [x] 2.1 Implement the shared HTTP client with API-base override, `/api/v1`, authentication, workspace headers, and normalized errors
- [x] 2.2 Implement compatible `linkyun_auth` authentication state with login, invitation-code registration, safe redirect, API Service override, session restoration, unauthorized handling, and logout
- [x] 2.3 Implement workspace list, selection, persistence, and workspace-scoped query invalidation
- [x] 2.4 Implement Agent list/detail domain APIs and Agent-to-Asset overview mapping
- [x] 2.5 Implement the typed live/derived/demo/unavailable capability registry and isolated demo fixtures

## 3. AgentHub Workspace Shell

- [x] 3.1 Implement the desktop workspace sidebar, top bar, active navigation, and user controls from the approved visual target
- [x] 3.2 Implement responsive sidebar behavior, focus states, and accessible labels
- [x] 3.3 Implement the Agent asset library route with live, loading, empty, error, retry, and demo states
- [x] 3.4 Implement explanatory placeholder routes for unsupported workspace modules without fake production writes

## 4. Agent Asset Vertical Slice

- [x] 4.1 Implement the selected Agent Asset header, breadcrumb, status, version, derived completeness, and actions
- [x] 4.2 Implement the asset-scoped overview/build/test/versions/distribution navigation
- [x] 4.3 Implement the asset composition rows from live and derived Agent data
- [x] 4.4 Implement the client-adapter panel with explicit demo/unavailable source labels
- [x] 4.5 Implement recent activity presentation and working Continue Build and Run Test navigation
- [x] 4.6 Implement loading, not-found, unauthorized, error, and retry states for the selected asset

## 5. Verification

- [x] 5.1 Add unit tests for storage compatibility, capability state, API headers, and Agent Asset mapping
- [x] 5.2 Pass lint, TypeScript, unit tests, and the production build
- [x] 5.3 Run the app locally and verify primary navigation, login behavior, workspace selection, retry, and asset actions in the browser
- [x] 5.4 Capture the 1440 x 1024 implementation and compare it with the approved source visual
- [x] 5.5 Fix all P0/P1/P2 design-QA findings and save `design-qa.md` with `final result: passed`
