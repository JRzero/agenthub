## Why

AgentHub can create, copy, pause, and delete a guest share link, but it cannot present the scannable QR flow available in the legacy Creator. Adding local QR rendering completes the final functional migration gap without changing the share contract.

## What Changes

- Render a scannable SVG QR code for an active Web Chat share URL.
- Add a focused QR dialog with the Agent name, URL, copy action, and disabled-state explanation.
- Generate QR data entirely in the browser; no URL is sent to an external service.

## Capabilities

### New Capabilities

- `agenthub-share-qr`: Local QR rendering and sharing workflow for an existing guest share URL.

### Modified Capabilities

None.

## Impact

- Affects `src/modules/agent-distribution`.
- Adds approved dependency `qrcode.react`; no backend or legacy Creator change.
