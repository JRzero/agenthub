# LYN-005-I3 R31 fresh combined audit

## Audit scope

- Surface: `PublicLandingPage` Hero role wall only.
- User goal: keep the R29/R30 wall composition while making every supporting character read as a deliberately framed portrait rather than an enlarged crop.
- Accessibility target: decorative images remain silent to assistive technology, the wall must not obscure Hero text/actions, and responsive clipping must not create document overflow.
- Fresh evidence: R30 captures at CSS 1440×900 and 390×844, saved under `docs/qa/images/lyn-005-i3-hero-supporting-framing-r31/before/` and visually inspected before implementation.

## Strengths

1. The R29 card geometry, same-direction tilt, density, z-order and black left safety field remain coherent.
2. The R30 main card already has balanced subject scale and is explicitly excluded from the supporting-card correction.
3. All twelve rasters are independent assets with normal proportions; the visible tightness came from rendering, not distorted source files.

## R30 supporting-card findings

The percentages below are visual estimates from the fresh same-state screenshots and the accepted source contact sheet. They describe the subject envelope relative to its card, not DOM box dimensions.

| Slot | R30 visible subject height | R30 head/side space and crop finding | Severity |
| --- | ---: | --- | --- |
| `top-strategist` | ≈92–96% | Hair and forehead meet the top crop; shoulders nearly span the card. The viewport crop leaves mostly face rather than a portrait. | P2 |
| `top-anime` | ≈92–96% | Hair/headset sit against the upper edge; almost no side breathing room. Also visible on mobile. | P2 |
| `top-support` | ≈94–100% | Face and headset dominate the clipped top-right card; equipment has little clearance. | P2 |
| `mid-expert` | ≈90–94% | Hair is safe, but face and shoulders are oversized; the narrow card loses most torso context. | P2 |
| `mid-fantasy` | ≈92–96% | Hood and backpack nearly touch the frame; the character reads as a large head crop. | P2 |
| `mid-right-partial` | >95% | The viewport/main-card occlusion exposes only a tight armor/face fragment; the focal subject is too far right. | P2 |
| `bottom-robot` | ≈90–94% | Helmet is close to both side edges; lower hardware is lost before the viewport crop. | P2 |
| `bottom-companion` | ≈94–98% | Ears and muzzle dominate the frame; vest/shoulders have almost no clearance. | P2 |
| `bottom-operator` | ≈90–95% | The lower-row crop exposes mostly forehead and face because the subject is both large and low. | P2 |
| `bottom-fantasy` | ≈92–96% | Face fills the partial lower slice; hair/shoulder silhouette lacks breathing room. | P2 |
| `right-mid-fantasy` | ≈94–98% | Anime head and jacket are tightly cropped inside the already edge-clipped card. | P2 |

## Mobile findings

1. **Top anime — P2:** the 115px card showed a close face/headset crop rather than the source's upper-body silhouette.
2. **Mid expert — P2:** the face occupied most of the 144px card, with only a small shoulder fragment.
3. **Mid fantasy — P2:** the hood and head filled nearly all visible width.
4. **Robot and companion — P2:** their key circular/ear silhouettes remained recognizable but sat too close to the card edges before the Hero/viewport crop.
5. **Bottom fantasy — P2:** the visible lower-edge fragment was mostly face and hair.
6. **Main — healthy/frozen:** R30 headroom and torso framing remain unchanged.

## Accessibility risks and evidence limits

- Confirmed: images stay decorative (`alt=""`, wall `aria-hidden="true"`), Hero text contrast and CTA hit area are unaffected, and document overflow is zero.
- Confirmed: the changed layer is pointer-events disabled, so no keyboard or focus behavior is introduced.
- Screenshot limits: the visual audit can confirm crop, contrast and reflow, but does not prove assistive-technology reading order beyond the inspected DOM attributes. Existing contract tests cover the unchanged semantics.

## Recommendation applied

Separate the fixed counter-skew fill (`scale(1.04)`) from per-card content framing. Render supporting sources with contained, centered imagery on the existing black card surface, then use only equal-axis scale and translation per slot. Keep the main card on R30 `cover` framing.
