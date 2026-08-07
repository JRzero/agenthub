## Context

AgentHub retains `/login`, `/register`, its `linkyun_auth` persistence contract, API Service editor, and safe `next` redirect helper, but its current fields and request bodies are legacy username/email/password registration. The approved H5 implementation establishes the supported phone/SMS endpoint shapes and interaction state. This change stays entirely in AgentHub and uses mocked API responses for verification.

## Goals / Non-Goals

**Goals:**

- Provide SMS-code login by default and account/password login as a second, accessible tab.
- Register with a default +86 phone number, SMS code, and invitation code, preserving invitation source and landing path.
- Keep the existing session provider, local storage key, API base setting, and safe replace redirect behaviour.
- Make cooldown, errors, tab changes, and repeated submission deterministic and testable.

**Non-Goals:**

- Sending a real SMS, configuring a provider, contacting any environment, or changing the backend contract.
- Changing auth roles, account migration, password recovery, browser session architecture, or the AgentHub visual system/routes.
- Copying the concept application's `/auth` route, visual identity, tracking, guest handoff, or post-auth destination.

## Decisions

- The auth module owns typed endpoint adapters, normalized stable error messages, and form state; components only select the mode and render controls. This keeps all four request bodies directly unit-testable and keeps the provider as the single session persistence boundary.
- A phone value starting with `+` omits `country_code`; otherwise requests include `+86`. Account/password login classifies a digits-only account as `phone` and otherwise uses `username_or_email`. Password values are passed unchanged, while account/phone/code/invitation values are normalized only for validation and request fields.
- A successful SMS request begins a local 60-second cooldown. Any SMS send error leaves cooldown at zero. Mode/tab changes clear SMS code, password, SMS error, and cooldown while retaining phone and password-account values as applicable.
- Query parsing is read-only: `invitation_code` preselects registration and fills the invitation field; `invitation_source` and the full local landing path travel only with registration. `next` passes through the existing same-origin internal-path guard, then successful flows use `router.replace`.
- Existing responsive layout and API Service controls remain intact. New tabs and SMS actions use native buttons with tab roles, labelled fields, `tel`, `one-time-code`, `current-password`, and numeric input semantics.

## Risks / Trade-offs

- [Backend response envelope drift] → retain the existing API client and normalize stable codes plus network errors into recoverable alerts.
- [Client cooldown cannot prevent abuse] → cooldown is UI-only and no claim is made about replay, throttling, enumeration, or provider security.
- [Legacy sessions lack a phone field] → retain the smallest compatible `apiKey`/`username` session shape, deriving a display username safely from the returned creator.
- [Responsive regressions] → preserve CSS layout breakpoints and perform local browser checks at desktop and narrow widths without real API requests.
