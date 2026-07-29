## 1. Draft mutation contracts

- [x] 1.1 Remove lifecycle status from generic Agent draft update types, serialization, callers, and tests
- [x] 1.2 Add revision-aware avatar upload/delete and character-design save/delete API contracts
- [x] 1.3 Add revision-aware staged-Skill and built-in Skill API contracts with returned revision types
- [x] 1.4 Serialize guided-creation Skill replacement and propagate every returned draft revision

## 2. Editor state and conflict handling

- [x] 2.1 Update build media surfaces to use the current revision and adopt returned Agent state
- [x] 2.2 Update staged-Skill surfaces to use and refresh the canonical Agent revision
- [x] 2.3 Add consistent `DRAFT_CONFLICT` refresh and reconfirmation behavior across media, Skills, guided creation, and historical restore
- [x] 2.4 Invalidate restored Skill, version, publish-check, and test-summary state after historical restoration

## 3. Listing lifecycle

- [x] 3.1 Add unpublish and relist API contracts and response adapters
- [x] 3.2 Add guarded unpublish/relist actions to the Agent version workspace
- [x] 3.3 Add a shared lifecycle presentation helper for active, private, draft, creating, and archived Agents
- [x] 3.4 Apply lifecycle presentation to asset library, workbench, and Agent workspace header
- [x] 3.5 Derive first and subsequent publish labels and preview numbers from immutable version history
- [x] 3.6 Distinguish continuing an unpublished draft from resetting it to the platform-current snapshot

## 4. Verification

- [x] 4.1 Add or update API contract tests for draft, media, Skill, lifecycle, and restore requests
- [x] 4.2 Add unit tests for lifecycle presentation and sequential revision propagation
- [x] 4.3 Run lint, typecheck, tests, production build, and strict OpenSpec validation
- [x] 4.4 Verify save, Skill, media, and unpublish-confirmation states in the browser
- [ ] 4.5 Verify the actual unpublish/relist transition and forced conflict recovery against a disposable staging Agent
