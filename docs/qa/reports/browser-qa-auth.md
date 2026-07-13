# AgentHub Authentication Browser QA

## Environment

- Date: 2026-07-11
- Application: `http://localhost:3002`
- Protected target: `/assets/32/build`
- Browser: Codex in-app browser
- Authentication states: signed-out public-flow verification followed by user-completed signed-in verification

## Signed-out and public authentication verification

- Opening `/assets/32/build` while signed out redirects to `/login` and preserves the protected target in `next`.
- The login page exposes username/email, password, API Service configuration, login, and invitation-registration entry points.
- Password visibility toggles between masked and plain-text input states and updates the accessible action label.
- Empty login submission is blocked by required-field validation for username/email and password.
- API Service configuration expands to the compatible `http://localhost:8080` default and explains browser-local persistence.
- The registration entry preserves the safe internal target `/assets/32/build`.
- The registration page exposes username, email, password, invitation code, API Service configuration, and a return-to-login action.
- Empty registration submission is blocked by required-field validation for all required account fields.
- Returning from registration to login preserves the safe internal target.
- An unsafe absolute `next=https://evil.example/steal` value is not propagated to the registration link; the link falls back to `/register`.

## Signed-in follow-up verification

- The user completed authentication in the retained browser session.
- The authenticated Creator session restored successfully and opened the requested protected `/assets/32/build` route instead of returning to `/login`.
- The signed-in workspace, Agent Asset navigation, Build, Test, Distribution, Resources, Operations, Settings, and logout-capable application shell were exercised in the final migration browser QA.
- Login and registration API contracts, session storage, safe redirect handling, 401 cleanup, and logout behavior are covered by the passing authentication unit tests.

Submitting an additional real registration was intentionally not performed because it would create another backend account; the complete registration UI, validation, navigation, redirect safety, and API contract are verified without that external side effect.

final result: public login/registration flow and signed-in session flow passed
