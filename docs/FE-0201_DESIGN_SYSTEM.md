# FE-0201 — Design system foundation

Date: 2026-11-15. Requirement trace: C-01–C-04, S-01–S-03 and A-01 through reusable UI infrastructure; DESIGN accessibility/token requirements. Depends on validated FE-0102.

## Scope and decisions

The existing app, async region and test harness are extended in place. `shared/styles/tokens.css` supplies a provisional neutral theme; none of the client's three palettes is selected. Color, spacing, typography, focus, radius, shadow and content width are centralized. Semantic color names align with future shadcn/ui token mapping. System fonts avoid third-party requests.

This is a minimal design-system slice. Native HTML buttons, fields, select and dialog provide semantics and browser behavior without adding dependencies. Complex searchable controls, galleries, data tables, pagination and toast workflows remain inventory for real consumers and approved contracts; they are not implemented by this task. Native groundwork can be composed with shadcn/ui primitives later where needed. Dependency manifests and lockfile are unchanged.

## Shells

| Frontend route | Shell | Current content |
|---|---|---|
| `/` | Customer; horizontal desktop navigation | Existing unavailable marketplace, shared cards |
| `/supplier` | Supplier; desktop sidebar | Labeled layout preview and unavailable overview |
| `/admin` | Super admin; desktop sidebar | Labeled layout preview and unavailable overview |
| Unknown routes | Appropriate shell from pathname | Existing not-found recovery |

Supplier/admin paths are UI layout previews from the proposed frontend route structure. They contain no account data or live operations. Authentication/server authorization remains dependent on OD-10/OD-11. There are no links to unimplemented business pages or a role-switcher.

Each shell has a skip link, header, named navigation, one main landmark, current-page link and footer. Below 768px a normal disclosure button controls navigation with `aria-expanded`/`aria-controls`; it is not an ARIA menu or modal drawer. Escape closes it from either the toggle or navigation. Link selection closes it and focuses main, including selecting the current route. State is local and resets when the audience changes.

## Components

| Component | API and accessible behavior |
|---|---|
| Button | Native props/ref, three variants, default non-submit type, disabled/busy behavior |
| TextField | Required label; hint/error; generated/explicit IDs; composed descriptions; invalid/required semantics |
| SelectField | Same wiring with native keyboard behavior; caller supplies approved options |
| Card | Named section with h2, under page h1 |
| Badge | Visual emphasis; caller supplies text, no domain states invented |
| Breadcrumbs | Named navigation, ordered trail, current-page semantics, router links |
| Skeleton | Stable non-animated visual placeholder; one loading announcement, decorative bars hidden |
| Dialog | Controlled native modal, title/description, focus containment/inert background, Escape/Close and trigger restoration |
| AsyncRegion | Existing five states retained; shared Button/Skeleton used for retry/loading |

Fields present validation results; consumers must validate actual submissions with Zod and backend contracts. Editable test fixtures do not submit or persist data. No shared module imports app/pages/features.

## Review and verification

Component tests cover labels/descriptions/errors, independent select fields, busy actions, default non-submit buttons and shell composition. Browser tests cover all three shells at 375/768/1440px, mobile disclosure keyboard behavior, real native dialog containment/recovery, and form/content contrast and overflow at 320/1440px. Existing async-state, enlarged-text, reduced-motion and route-history regressions remain enabled.

Static fixtures reuse the compiled production stylesheet; dialog/menu interactions run against the real app. Screenshots are generated in ignored `frontend/test-results/`. Manually inspected customer desktop, supplier mobile and primitive mobile screenshots for spacing, wrapping and clipping.

Actual NVDA/VoiceOver output, forced-colors and cross-browser testing remain release follow-ups; this is not WCAG certification. Branding and authoritative auth remain open. No credentials, sensitive fixtures, browser token persistence or live service calls were added. Existing development-only audit findings remain tracked; no new audit is claimed for unchanged dependencies.

## Validation evidence

- PASS: `npm run typecheck && npm run lint && npm run test -- --run && npm run build` on final source. Six files / 19 unit/component tests passed. Production JS: 292.63 kB (91.98 kB gzip); CSS: 6.54 kB (1.94 kB gzip).
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: 25 browser tests. Local preview/browser execution required sandbox escalation. Final run was serial with the quality build; an earlier concurrent build caused an initial preview HTTP failure, resolved by sequencing the checks.
- PASS: axe WCAG-tagged checks and overflow assertions at the documented widths, mobile disclosure keyboard handling, native modal Escape/Close/focus restoration, and existing async-state/navigation regressions.
- PASS: manual screenshot inspection of desktop customer, mobile supplier and mobile primitive fixtures.
- PASS: `git diff --check`.

FE-0201 is complete within this foundation slice. FE-0202 has not started; no hosted CI or deployment is claimed.
