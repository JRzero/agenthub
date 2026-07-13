## ADDED Requirements

### Requirement: Truthful data sources

The frontend SHALL distinguish demo metrics and risk or settlement records from live backend facts.

#### Scenario: Live mode without service contracts

- **WHEN** a Creator opens Analytics, Governance, or Revenue in live mode
- **THEN** the page SHALL explain the missing capability instead of displaying demo values

### Requirement: Workspace insights

The frontend SHALL provide interactive Analytics, Governance, and Revenue views in demo mode using approved visual references.

#### Scenario: Inspect a governance risk

- **WHEN** a Creator selects a risk row
- **THEN** the risk inspector SHALL show its impact, suggestion, and status

### Requirement: Creator account settings

The frontend SHALL preserve profile, avatar, and password behavior using the current backend contracts.

#### Scenario: Save a profile

- **WHEN** a live Creator saves valid profile fields
- **THEN** the frontend SHALL update `/profile` and synchronize the visible session username

### Requirement: Honest workspace preferences

The frontend SHALL label workspace language, timezone, and visibility preferences as browser-local until a persistence endpoint exists.

#### Scenario: Save workspace preferences

- **WHEN** a Creator saves workspace preferences
- **THEN** values SHALL persist in browser storage without implying server persistence
