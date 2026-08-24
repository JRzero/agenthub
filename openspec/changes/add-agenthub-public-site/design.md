## Context

The root route currently performs a server redirect to `/workbench`, while authenticated workspace pages live under the `(workspace)` route group and are protected by `WorkspaceShell`. The approved V4 reference defines a public editorial landing page with a dark product-proof surface, continuous product states, a sticky creation narrative, creator scenarios, and an intent-to-auth handoff. The implementation must use existing dependencies and must not alter backend, authentication, invitation, or workspace behavior.

## Goals / Non-Goals

**Goals:**

- Make `/` publicly browsable and closely match the V4 desktop composition while adapting cleanly to 390 px.
- Deliver working anchor navigation, product-state selection, scroll-driven five-step storytelling, and creation-intent interaction.
- Preserve anonymous intent only in browser session storage and route continuation through existing authenticated entry points.
- Meet keyboard, focus, semantic HTML, and reduced-motion expectations.
- Keep public-site styles and behavior isolated from workspace modules.

**Non-Goals:**

- No anonymous Agent generation, server persistence, publishing, API/SDK promises, marketplace, metrics, endorsements, or Living World content.
- No backend, auth protocol, invitation, request-header, dependency, lockfile, or project-configuration changes.
- No deployment or production asset-licensing decision.

## Decisions

1. **Isolate the landing experience in `src/modules/landing/`.** The root page imports a dedicated public-site component and CSS module. This avoids changing global workspace layout semantics and prevents V4 styling from leaking into authenticated surfaces. Keeping the implementation directly in `src/app/page.tsx` was rejected because the interactions and responsive states are substantial.
2. **Use supplied and existing raster assets.** The approved V4 design reference supplies the visual target, while the existing AgentHub logo and approved generated concept source supply visible imagery. UI detail is implemented as semantic native interface panels using the product's actual capability vocabulary; no hand-drawn SVG, CSS illustration, or placeholder imagery is introduced.
3. **Keep intent ephemeral and local.** A client component writes the trimmed intent to a namespaced `sessionStorage` key only when the visitor explicitly continues. It then navigates to `/login?next=/assets/create` or `/register?next=/assets/create`. Session storage was chosen over local storage to minimize persistence; direct API submission was rejected because no generation endpoint is defined.
4. **Use explicit state controls plus progressive scroll enhancement.** Product states are buttons/tabs and the five-step narrative uses native buttons with a requestAnimationFrame-scheduled geometry check on desktop. The closest chapter to a stable viewport focus line becomes active, while a short manual-selection hold prevents scroll feedback from immediately overriding a click. This keeps all content operable without animation and supports keyboard selection. Reduced-motion disables automatic state changes and smooth scrolling and reveals the stable default state.
5. **Preserve route protection structurally.** Only the root route changes. Existing workspace pages remain within `(workspace)` and continue to be guarded by `WorkspaceShell`; login and registration routes remain under `(auth)`.
6. **Scope visual evidence to local QA.** The V4 target and storyboard are copied into `docs/qa/design-reference/`; browser captures and comparison reports live under the existing QA directories.
7. **Treat the first acceptance feedback as a higher-priority V4 refinement.** Decorative outer frames, repeated equal cards, and continuous section dividers are removed from the public narrative. Necessary borders remain inside the truthful product UI and input control, while product tabs become a text track, the five steps become an open chapter flow, and creator scenarios become an asymmetric editorial collage.
8. **Keep state transitions composited and height-stable.** Product states share a fixed grid stack and transition only opacity and transform, so rapid selection cannot flash or change container height. Desktop creation chapters keep a stable footprint and reveal the active preview with opacity and transform; mobile shows one stable active detail. All motion uses a shared restrained rhythm and becomes immediate with no displacement under reduced motion.
9. **Adopt the selected Living Blueprint as the new visual truth.** The public site uses a warm paper field, editorial Songti hierarchy, coral action language, a raster hand-drawn growth path, raster print registration marks, and one angled dark AgentHub product proof. The product proof continues to use native, capability-accurate UI and is explicitly identified as a demo interface rather than rasterizing or copying the concept image's fictional product state.
10. **Recompose mobile instead of scaling the desktop hero.** At 390 px the headline, two-column milestone ledger, raster growth path, and simplified build proof form separate vertical beats. The product navigation is reduced to real Agent Asset scopes and the chat proof is omitted from the hero crop, while the full interactive product state remains available in the following section.
11. **Treat the user-marked visual revision as the highest-priority Hero rule.** The repeated header creation CTA and the entire angled Hero workbench proof are removed at every breakpoint. The Hero keeps one primary creation CTA, the raster growth path, all four stage annotations, and an editorial paper field; the following `#product` section remains the single truthful interactive product proof.

## Risks / Trade-offs

- **[Generated concept imagery requires final public-use confirmation]** → Record its provenance and licensing caveat in QA and completion reports; do not deploy.
- **[The long V4 target contains generated microcopy that is not product truth]** → Recreate the composition with reviewed, capability-accurate native UI text rather than rasterizing the whole page.
- **[Scroll geometry varies by viewport]** → Use one focus line, one animation-frame update per scroll burst, a deterministic initial state, a manual-selection hold, direct step controls, and a reduced-motion path.
- **[Theme initialization can add `.dark` globally]** → Use a self-contained landing root with explicit variables and color scheme so the public site remains stable without changing theme storage behavior.
- **[Anonymous intent could be misunderstood as saved]** → State next to the input that it remains in this browser session and requires login/invitation verification before generation or saving.
- **[Generated paper and blueprint raster assets require final public-use confirmation]** → Keep their ImageGen provenance in the I3 QA report, use them only in this local uncommitted task, and do not deploy.
