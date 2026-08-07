## Why

AgentHub currently exposes the legacy password-oriented authentication flow, which does not match the approved LinkYun H5 phone-verification registration and sign-in contract. Aligning the front end now preserves the established AgentHub routes, session storage, and visual identity while enabling the supported SMS endpoints without activating a real SMS provider.

## What Changes

- Make `/login` default to accessible SMS-code sign-in, with a second account/password tab for legacy credentials.
- Make `/register` collect only a +86 phone number, SMS code, and invitation code; consume invitation attribution and safe return query parameters.
- Add frontend adapters for SMS code sending and SMS login, map stable authentication error codes to recoverable UI messages, and preserve the existing session/provider and safe replace navigation.
- Add contract, form-state, accessibility, and route-query tests using only mock SMS responses and synthetic data.

## Capabilities

### New Capabilities

- `mobile-authentication`: AgentHub phone-code registration, dual-method sign-in, invitation attribution, and safe post-auth navigation.

### Modified Capabilities

- None.

## Impact

- Affected code: `src/modules/auth/`, `/login`, `/register`, and their Vitest coverage.
- API contracts: existing `auth/sms/send-code`, `auth/sms/login`, `auth/register`, and `auth/login` endpoints through AgentHub's configured API base.
- No dependencies, backend services, credentials, provider configuration, shared data, or deployments are changed.
