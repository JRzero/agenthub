# R37 Hero proof measurement

## Source and viewport

- User annotation: `docs/qa/design-reference/lyn-005-i3-hero-proof-cleanup-r37/user-annotation.png`.
- Browser evidence: CSS viewports 1440×900 and 390×844 at `scrollY = 0`.
- R36 freeze target: `[data-hero-role-stage]` and all twelve `[data-hero-role-card]` bounding boxes.

## Before → after

| Measurement | Desktop 1440×900 | Mobile 390×844 |
| --- | --- | --- |
| CTA rect | 148×52 at x142.55/y508.97 → unchanged | 126×48 at x34/y324.81 → unchanged |
| CTA → status gap | 38px → 32px | 25px → 24px |
| Status rect | 540×28 at x142.55/y598.97 → y592.97 | 311×28 at x34/y397.81 → y396.81 |
| Statistics list | 310×39.80 at x142.55/y655.97 → absent | 300×35.80 at x34/y445.81 → absent |
| Role stage | 1152×863.40 at x205/y18.30 → identical | 540×404.72 at x−117/y430 → identical |
| Role cards | 12 slot rects → byte-for-value-identical geometry | 7 visible + 5 responsive-hidden rects → identical |
| Document horizontal overflow | 0 → 0 | 0 → 0 |

## Public wording states

- Initial public page visible text: no `/demo/i` match.
- Knowledge state: `产品界面示意`, two `示例资源` labels, no `/demo/i` match.
- Release state: `v1.0 · 示例`, no `/demo/i` match.
- Role Assets retains the honest boundary: `品牌示例角色，不代表线上真实运行数据`.

## Result

The annotated duplicate dashboard row is absent from DOM and CSS. The remaining proof rail is compact, the copy column now closes cleanly above the lower role-wall texture, and the R36 wall geometry is unchanged.

P0/P1/P2: 0/0/0.

final result: passed
