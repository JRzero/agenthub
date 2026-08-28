# R19 intent-control measurements

Visual truth: `docs/qa/design-reference/lyn-005-i3-intent-control-r19/user-annotation.png` (3020×1122 Retina, normalized to 1510×561 CSS pixels).

## Before

| Viewport | Wrapper | Textarea | Button | Insets top / right / bottom | Structural finding |
| --- | --- | --- | --- | --- | --- |
| 1510×561 | 680×69.5, transparent, no border | 680×64, owns border/background | 50×50 | 12.5 / 7 / 7px | button is positioned against a taller invisible wrapper, so it does not read as part of one capsule |
| 390×844 | 322×63.5, transparent, no border | 322×58, owns border/background | 46×46 | 11.5 / 6 / 6px | same imbalance at mobile |

## After

| Viewport | Control | Textarea | Button | Insets top / right / bottom | Containment |
| --- | --- | --- | --- | --- | --- |
| 1510×561 | 680×64, 1px border, 34px radius | 678×62, transparent, borderless, right padding 84px | 50×50 | 7 / 11 / 7px | left/top/right/bottom all inside: yes |
| 390×844 | 322×58, 1px border, 34px radius | 320×56, transparent, borderless, right padding 72px | 46×46 | 6 / 9 / 6px | left/top/right/bottom all inside: yes |

Computed desktop CSS: button `top: 50%`, `right: 10px`, `transform: matrix(1,0,0,1,0,-25)`. Computed mobile CSS: button `right: 8px`, `transform: matrix(1,0,0,1,0,-23)`. Border-box measurement includes the 1px control border, hence 11px/9px visual right insets.

Focused textarea evidence: active id `creation-intent`; control border `rgba(199, 255, 24, 0.72)`; shadow `rgba(199, 255, 24, 0.12) 0px 0px 0px 3px`. No overflow property clips the ring.
