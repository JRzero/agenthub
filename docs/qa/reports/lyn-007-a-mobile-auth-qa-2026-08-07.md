# LYN-007-A Mobile Auth QA

- Date: 2026-08-07
- Scope: AgentHub `/login` and `/register` only
- Data: local synthetic phone/code values and mocked API results only; no credential, real phone, SMS, cookie, token, or shared-environment data was used.

## Automated evidence

- `npm run lint`: pass, no errors or warnings.
- `npm run typecheck`: pass.
- `npm test`: pass — 89 files, 448 tests. Added deterministic coverage for SMS request fields, no-password registration, password byte preservation, stable errors, provider persistence, invitation query prefill, SMS cooldown, retryability, and tab reset.
- `npm run build`: pass.

## Browser and design checks

- Local Next development page only, at `1440×900`, `1280×900`, and `720×900`: login presents the AgentHub three-panel desktop composition and single-column mobile composition without horizontal overflow (`scrollWidth === viewport width`). The browser automation surface did not apply keyboard zoom, so the 720px narrow-layout check is the recorded high-magnification resilience evidence.
- Login defaults to the selected `验证码登录` tab before `密码登录`; the rendered phone, SMS, password, and tab semantics expose `tel`, `one-time-code`, `current-password`, and numeric-code input attributes.
- Password-tab interaction removes the SMS control and displays the current-password input. Registration with synthetic `invitation_code` and `invitation_source` prefills the invitation code and has no password input.
- A synthetic offline send attempt shows a recoverable alert and leaves the send action enabled. Browser runtime network isolation prevented the temporary localhost mock server from completing a browser request; the successful fake-send, 60-second cooldown, and all request bodies are therefore evidenced by deterministic unit tests rather than a networked browser action.
- Reduced-motion rules remain in `auth-screen.module.css`; keyboard-operable native buttons, labelled inputs, and no-horizontal-overflow layout were inspected.

## Scope and residual risk

- No backend, provider, credential, migration, shared/test/production data, deployment, push, PR, or merge activity occurred.
- Client cooldown is UX-only. Replay, abuse throttling, account enumeration, provider configuration, and long-lived API-key exposure remain backend/security follow-ups and are not represented as resolved.
