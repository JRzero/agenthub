# R38 Hero main-role centering measurements

## Scope and state

- Route/state: `/#top`, initial Hero state, CSS viewports 1440×900 and 390×844.
- R37 baseline: `docs/qa/images/lyn-005-i3-hero-main-centering-r38/before/`.
- R38 implementation: `docs/qa/images/lyn-005-i3-hero-main-centering-r38/after/`.
- Only the `main` subject data offset changes. No CSS or card/stage coordinate changes belong to R38.

## Before → after

| Measurement | Desktop 1440×900 | Mobile 390×844 |
| --- | --- | --- |
| `subjectScale` | `.990 → .990` | `.990 → .990` |
| `subjectOffsetX` | `0% → -8%` | `0% → -8%` |
| `subjectOffsetY` | `0% → 0%` | `0% → 0%` |
| Stage rect | `1152 × 863.40 @ 205,18.30` → identical | `540 × 404.72 @ -117,430` → identical |
| Main card rect | `363.47 × 530.14 @ 864.22,141.94` → identical | `193.09 × 281.63 @ 191.45,483.54` → identical |
| Maximum card rect delta | `0px` | `0px` |
| Subject matrix | `matrix(.99,0,0,.99,0,0)` → `matrix(.99,0,0,.99,-32.985,0)` | `matrix(.99,0,0,.99,0,0)` → `matrix(.99,0,0,.99,-16.5613,0)` |
| Horizontal overflow | `0 → 0` | `0 → 0` |

## Proportion and loading proof

- The image transform remains a uniform `.99` scale plus X translation; it introduces no shear or non-uniform scale.
- Mobile composed axes are `1.0197001764 / 1.0197001764`; their dot product is `-6.16e-8`, effectively orthogonal at browser precision.
- Desktop loaded Hero images: 12/12. Mobile visible loaded Hero images: 7/7.
- No mobile-only override is required: the shared `-8%` correction centers both viewports while preserving hair, chin and both shoulders.

final result: passed
