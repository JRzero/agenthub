## Context

The Distribution workspace already derives a live `shareUrl` for the Web Chat channel. The URL can be copied, paused, and deleted, so QR rendering is a pure presentation capability. External QR services would disclose the URL and add network failure modes.

## Goals / Non-Goals

**Goals:**

- Generate a standards-compliant QR entirely in the browser.
- Keep the active share URL visible and copyable beside the QR.
- Make the QR action available only when an enabled share URL exists.

**Non-Goals:**

- No new share endpoint, tracking code, download format, or QR customization.
- No external QR-generation service.

## Decisions

- Use the approved `qrcode.react` `QRCodeSVG` component with error correction level M and a white quiet-zone container.
- Keep dialog state inside a focused `ShareQrButton`; the Distribution workspace remains responsible only for the URL contract.
- Render the button in the Web Chat channel row next to its existing action.

## Risks / Trade-offs

- [Very long URL reduces QR density] → Use a 224px SVG and level M error correction.
- [Paused or missing link is scanned] → Do not render the QR action without a running share URL.
