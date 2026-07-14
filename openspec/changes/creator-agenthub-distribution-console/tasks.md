## 1. Contracts And State

- [x] 1.1 Add typed distribution channels, compatibility, status, share link, and Public Agent Card contracts
- [x] 1.2 Reuse the existing workspace-scoped share-link GET, POST, and PATCH endpoints
- [x] 1.3 Treat 404 as unpublished and preserve retryable request errors
- [x] 1.4 Keep non-Web adapter publication isolated to demo component state

## 2. Distribution Interface

- [x] 2.1 Preserve the approved Distribution design reference inside the project
- [x] 2.2 Implement release actions and the four-client status table
- [x] 2.3 Implement public share creation, enable/pause, and copy behavior
- [x] 2.4 Implement safe Public Agent Card preview and download
- [x] 2.5 Implement governance, export, memory-boundary, rollback, and pause entry points
- [x] 2.6 Implement responsive desktop and narrow-screen layouts
- [x] 2.7 Separate recent release metadata from channel actions and contain the table layout
- [x] 2.8 Standardize the action column width, alignment, and explicit labels

## 3. Verification

- [x] 3.1 Add unit tests for live channel mapping, safe export, 404 handling, and API methods
- [x] 3.2 Pass lint, TypeScript, unit tests, production build, and strict OpenSpec validation
- [x] 3.3 Verify share, publish, configure, export, governance, pause, rollback, and modal states in the browser
- [x] 3.4 Compare the implementation with `06-distribution.png` and record design QA as passed
- [x] 3.5 Verify the corrected table alignment and width containment at desktop and narrow browser widths
- [x] 3.6 Verify the standardized action column in the browser
