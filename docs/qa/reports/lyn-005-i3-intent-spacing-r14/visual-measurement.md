# LYN-005-I3 R14 visual measurement

## Inputs

- Rhythm reference: `docs/qa/design-reference/lyn-005-i3-intent-spacing-r14/rhythm-reference.png`.
- User-marked current reference: `docs/qa/design-reference/lyn-005-i3-intent-spacing-r14/current-reference.png`.
- Fresh application baselines: `docs/qa/images/lyn-005-i3-intent-spacing-r14/before/desktop-1440x1000.png` and `mobile-390x844.png`.

The light reference is used only for centered spacing rhythm. Its palette, illustration, ornaments, font, search icon, and orange action are intentionally excluded.

## Before

| Viewport | Heading | Heading box | Section | Gaps: label / subtitle / input / suggestions / metadata |
| --- | --- | --- | --- | --- |
| 1440×1000 | 57.6px / 62.208px | 1320×124.4px | 476.4px | 18 / 14 / 28 / 14 / 12px |
| 390×844 | 38px / 41.04px | 322×123.1px | 531.1px | 18 / 14 / 28 / 14 / 12px |

The hard break and 1.08 leading left the two desktop lines visibly crowded and compressed the entire form stack toward the heading.

## After

| Viewport | Heading | Heading box | Section | Gaps: label / subtitle / input / suggestions / metadata |
| --- | --- | --- | --- | --- |
| 1440×1000 | 57.6px / 67.968px | 960×144px | 640px | 34 / 32 / 48 / 26 / 18px |
| 390×844 | 38px / 45.6px | 322×141.34px | 650px | 28 / 24 / 34 / 20 / 16px |

Desktop keeps both semantic spans on one line. Pixel-row analysis of the final screenshot found bright glyph groups at y=431–483 and y=507–559, producing a 23px visible inter-line gap. Mobile permits the second span to wrap, producing three balanced visible lines without overflow.

The form control itself remains 680px wide on desktop and 322px on mobile. Its textarea/button geometry, border, placeholder, and action behavior are unchanged; only its position in the vertical stack moved.
