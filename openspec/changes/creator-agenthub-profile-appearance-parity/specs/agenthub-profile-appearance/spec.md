## ADDED Requirements

### Requirement: Crop-safe Creator avatar
Settings SHALL let a Creator select a supported image, preview a square crop, adjust zoom and position, and upload only the resulting crop.

#### Scenario: Save a cropped avatar
- **WHEN** a Creator accepts the crop
- **THEN** a 512×512 JPEG SHALL be uploaded through the existing profile avatar endpoint

#### Scenario: Remove a Creator avatar
- **WHEN** a Creator confirms avatar removal
- **THEN** the existing profile avatar DELETE endpoint SHALL be called and the current preview SHALL refresh

### Requirement: Persistent appearance mode
Settings SHALL offer light, dark, and system modes and SHALL persist the selection in the existing `linkyun-theme` JSON value.

#### Scenario: Select dark mode
- **WHEN** a Creator selects dark mode
- **THEN** the root element SHALL receive the `dark` class and the stored mode SHALL be `dark`

#### Scenario: Follow system mode
- **WHEN** system mode is selected and the operating-system preference changes
- **THEN** the effective root class SHALL update while the stored mode remains `system`

### Requirement: Pre-hydration theme consistency
The application MUST apply the stored effective mode before React hydration.

#### Scenario: Reload in dark mode
- **WHEN** the stored mode is dark
- **THEN** the root theme script SHALL apply dark styling before the application providers mount
