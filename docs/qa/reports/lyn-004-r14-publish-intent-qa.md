# LYN-004-R14 Continue Publish Intent QA

Date: 2026-08-06  
Environment: isolated Demo frontend at `http://127.0.0.1:3013`  
Agent used: existing Demo Agent `19` (`知识向导`)  
Safety boundary: the publish confirmation was opened and cancelled only; no publish submission or business-data write was performed.

## Browser checks

| # | Flow | Result |
| --- | --- | --- |
| 1 | Direct `/assets/32/versions` visit | Passed: dialog count `0`. |
| 2 | Build `发布为新版本` → unblocked `继续发布` | Passed: navigated to `/assets/19/versions`, the existing publish dialog opened, and `publishIntent` was already absent from the visible URL. |
| 3 | Cancel automatically opened dialog | Passed: dialog count returned to `0` and did not reopen. |
| 4 | Refresh after cancellation | Passed: dialog count remained `0`. |
| 5 | Back to Build then Forward to Versions | Passed: Forward returned to clean `/assets/19/versions`; dialog count remained `0`; no route loop. |
| 6 | Direct Versions publish button | Passed: existing `发布第一个版本` button opened the same dialog; Close returned dialog count to `0`. |
| 7 | Dirty state after entering publish check | Passed: `继续发布` became disabled and navigation remained on Build. No save was submitted; local edit was discarded. |
| 8 | Mismatched `/assets/19/versions?publishIntent=32` | Passed: dialog count `0`; intent was not consumed for the wrong Agent. |
| 9 | Console | Passed: fresh Browser warning/error log count `0/0`. |

## Evidence

- `docs/qa/images/lyn-004-r14/01-build-continue-auto-open.png` — automatically opened existing publish confirmation after Build continuation.
- `docs/qa/images/lyn-004-r14/02-cancelled-clean-versions.png` — clean Versions page after cancellation, with no reopened dialog.

## Result

Passed. The one-time handoff is Agent-scoped, removed through history replacement before opening, and does not alter the existing publish submission path.
