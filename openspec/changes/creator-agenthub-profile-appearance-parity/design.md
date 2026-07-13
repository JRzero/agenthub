## Context

The Settings profile already reads, updates, uploads, and deletes Creator data, but uploads the selected image without crop control. Root layout already applies a stored dark class before hydration, while no provider or UI lets the Creator change that state. The legacy theme catalogue contains only the default pack, so parity requires mode selection rather than invented visual packs.

## Goals / Non-Goals

**Goals:**

- Crop avatar images to a square JPEG with zoom and horizontal/vertical positioning.
- Keep upload, delete, demo preview, and profile refresh behavior intact.
- Provide light, dark, and system modes with live system preference updates.
- Preserve the existing localStorage key and pre-hydration behavior.

**Non-Goals:**

- No image-crop dependency or backend image processing change.
- No additional theme packs, custom colors, or server-synced appearance preference.
- No localStorage key migration.

## Decisions

- Reuse the canvas cover-crop algorithm already proven for Agent avatars. A 512×512 JPEG is uploaded through the current Creator avatar endpoint.
- Keep the crop editor inside the profile panel and revoke object URLs on replacement, cancel, and unmount.
- Store `{ themePackId: "default", mode }` under `linkyun-theme` for compatibility with the legacy shape and existing root script.
- Apply `.dark` from a provider and subscribe to `prefers-color-scheme` only in system mode.
- Add Appearance as a real Settings tab rather than a global dropdown so the preference is discoverable and documented.

## Risks / Trade-offs

- [Large source image consumes browser memory] → Enforce the existing 20MB limit and revoke object URLs.
- [Hydration theme flash] → Retain the synchronous root ThemeScript and initialize provider state after mount.
- [System preference changes] → Listen to the media query and update the root class without rewriting the stored mode.
