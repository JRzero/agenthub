## 1. Contracts and Safety Model

- [x] 1.1 Add credential schema and Creator Skill update request types
- [x] 1.2 Add pure helpers that isolate credential fields and construct set, keep, and clear requests
- [x] 1.3 Update Creator Skill APIs to accept top-level credential fields

## 2. Skill Configuration Experience

- [x] 2.1 Render write-only credential fields only in Skill default configuration
- [x] 2.2 Show configured status, password hints, title, description, and maximum length from the schema
- [x] 2.3 Implement API Key rotation, empty-value preservation, confirmed clearing, and post-save state refresh
- [x] 2.4 Ensure Agent-level configuration never renders or submits credential fields

## 3. Verification

- [x] 3.1 Add unit tests for credential isolation and request construction
- [x] 3.2 Add API contract tests for set, omit, and clear request bodies
- [x] 3.3 Run lint, typecheck, unit tests, production build, and strict OpenSpec validation
- [x] 3.4 Verify the configured and unconfigured credential states in the browser
