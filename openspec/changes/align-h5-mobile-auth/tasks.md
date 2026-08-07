## 1. Authentication contracts

- [x] 1.1 Replace legacy registration and sign-in adapter types with H5-aligned SMS, password, and invitation request contracts.
- [x] 1.2 Extend the auth provider to persist successful results from every supported authentication method without changing `linkyun_auth`.
- [x] 1.3 Add stable error-code normalization and unit coverage for request bodies, password preservation, and session persistence.

## 2. AgentHub authentication flow

- [x] 2.1 Implement default SMS login and accessible SMS/password tabs while preserving API Service controls and safe replace navigation.
- [x] 2.2 Implement SMS-only registration, invitation query prefilling, invitation source/landing-path forwarding, and no-password registration submission.
- [x] 2.3 Implement SMS send cooldown, transient-state clearing, recoverable errors, duplicate-submit prevention, and responsive accessible field behaviour.

## 3. Verification and QA

- [x] 3.1 Add deterministic UI and API tests for the supported authentication paths, errors, cooldown, query handling, and redirect safety.
- [x] 3.2 Run lint, typecheck, full tests, build, OpenSpec strict validation, scope diff, and sensitive-data scan.
- [x] 3.3 Perform local mock-only browser and design QA at required viewport, zoom, keyboard, and reduced-motion conditions; record sanitized evidence.
