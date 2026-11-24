# Phase 08 — Supplier workspace foundation verification

Updated 2026-11-23. Phase 08 advances requirement **S-01**, while exposing only bounded fixture-derived context from **S-02** and **S-03**. Open decisions **OD-01**, **OD-10**, **OD-11** and **OD-12** remain unresolved.

## Delivered scope

- The supplier audience now uses a dedicated merchant-productivity shell with a full-height desktop sidebar, grouped Store setup/Operations navigation, compact header/footer, active states and an Escape-safe mobile drawer.
- The navigation retains only registered routes. There is no settings link, account action or multi-store switcher because those contracts do not exist.
- `/supplier` identifies the single fixture store and clearly distinguishes fixture access from supplier approval or authenticated authorization.
- Overview counts come directly from the validated workspace snapshot: product records, order records and variants whose sample count is three or fewer. They are labelled as fixture counts rather than sales KPIs.
- The practical queue derives low-count variants and orders with `canRecordNote`; its actions link to the existing inventory and order screens without implying status transitions, provider bookings or backend notifications.
- `/supplier/register` is explicitly an application preview. Saving stores a separate session-only draft and does not create credentials, submit an approval request or establish a status.
- `/supplier/profile` edits only the supported store name and description through the existing Zod schema, revision check, TanStack Query mutation and acknowledgement validation.
- Both editors disclose unsupported logo/cover, location, contact, category, delivery and pickup fields rather than rendering nonfunctional controls.
- Existing loading, refresh error, forbidden, validation, pending, sanitized failure and saved states remain intact.

## Contract limits and blockers

- The workspace schema exposes only `allowed | forbidden`; it has no pending, approved, rejected or disabled supplier state. “Allowed by fixture” is not presented as approval.
- There is no auth/session, role mapping, server-side authorization, application workflow or public publishing contract. Frontend navigation is UX only and cannot enforce supplier access.
- Supplier identity supports only name and description. Media, address/location, contact data, categories, fulfilment settings, notifications and unsaved-navigation persistence are unavailable.
- The mock adapter is isolated in memory and resets on refresh. It is not a backend DTO or evidence that mutations are durable.
- Product/inventory internals remain assigned to Phase 09; orders/sales internals remain assigned to Phase 10.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test -- --run`: passed, 24 files / 223 tests. Focused supplier component/review coverage passed 30/30.
- `npm run build`: passed at 768.76 kB JavaScript / 232.96 kB gzip. Third-party Zod annotation notices remain; this run emitted no chunk-size warning.
- The combined supplier browser run verified 39 inherited workflow/accessibility scenarios and initially found six overview matrix failures caused by two new issues: a 4.47:1 accent contrast and invalid descriptive children inside a `dl`.
- After correcting the color and definition-list structure, all 18 overview/registration/profile cases passed at 320, 360, 390, 768, 1024 and 1440 px with no reported axe A/AA violations or horizontal overflow. Together, all 45 intended supplier scenarios are verified.
- Mobile navigation opening/Escape focus restoration, one-store boundaries, fixture-derived queue values, application/profile separation, validation, duplicate-write protection, forbidden access, forced colors and enlarged text are covered across component and browser suites.
- Full-page mobile registration and desktop overview/profile captures were visually inspected. A visually hidden store title and misaligned queue heading discovered during review were corrected before final verification.

## Readiness

Phase 09 can redesign supplier products, product editor and inventory around the existing session fixture and revision-checked commands. Live supplier onboarding and profile operations remain blocked on approved auth, authorization, approval/publishing and full store-profile contracts.
