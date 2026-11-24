# Phase 00 repository audit and migration decisions

Audit date: 2026-11-21 (Asia/Colombo). Source baseline: `84b2396`. The supplied `docs/ui-redesign/` prompt pack was already untracked before this task. No application code, dependency, route, fixture or business behavior was changed in Phase 00.

## Scope and authority

Traceability: C-01 discovery; C-02 cart/checkout; C-03 orders/payment display; C-04 feedback; S-01 profile/application; S-02 catalog/inventory; S-03 orders/sales; A-01 oversight; F-01 filtering; D-01 fulfilment; P-01 payments/refunds; M-01 media. Foundation work supports all these requirements; it does not complete their live integrations.

The user's new Botanical Editorial brief and `DESIGN_SYSTEM.md` supersede conflicting visual instructions in `../DESIGN.md`: no obligatory Florial cloning, subscriptions, invented testimonials, urgency, discount rules or shipping guarantees. Retain the five specified brand colors, replace the visual composition. The newer requirements specify one store per supplier and categories on shops only. Do not infer backend contracts from those decisions or from DBML.

Read: root contract, README, project context, requirements, open decisions, architecture, legacy design, task ledger, testing strategy, five requested redesign documents, Phase 01 prompt, API/deployment documentation and actual source/configuration/tests. The supplied client PDF has eight pages; text was extracted and page 6's Botanical Green palette visually inspected. Separate reference screenshots mentioned by legacy design were not found. No local photo collection, font files or associated asset licenses were found. The PDF moodboard is a reference, not an asset license.

## Actual architecture and tooling

| Area | Observed implementation |
| --- | --- |
| Package manager | npm workspace, root + `frontend`; `package-lock.json`; declared npm 11.21.2, execution npm 11.19.1 / Node 24.22.3 (within engine ranges) |
| Locked stack | React/React DOM 19.3.1, Vite 7.3.8, TypeScript 5.9.3, React Router 7.18.5 |
| Data/UI | Query 5.107.1, Redux Toolkit 2.14.0, Zod 4.6.7, Lucide 1.76.0, Motion 14.14.0 |
| Tests | Vitest 4.1.12, RTL/jsdom/MSW; Playwright 1.65.1 and axe |
| Styling | Plain CSS; no Tailwind, shadcn, Radix, React Hook Form or TanStack Table installed. Do not install the preferred-stack list just to match the brief. |
| Compiler/lint | Strict TS, noUncheckedIndexedAccess, noUnusedLocals/Parameters; ESLint flat recommended JS/TS config. No configured path aliases. |
| Composition | `src/main.tsx` → `app/providers.tsx` → `app/App.tsx`; ErrorBoundary, Redux CartProvider, QueryClientProvider, BrowserRouter. Eager route imports. |
| Routes | Declarative Routes in `app/App.tsx`; audience chosen by pathname prefix. See the complete screen ledger. |
| Auth | No auth/session provider, login, refresh, CSRF implementation or server permission enforcement. All role URLs are reachable demos; fixture capability checks are not authentication. |
| Persistence | Query owns mock snapshots; Redux cart is in memory. Wishlist uses localStorage and useSyncExternalStore; cart drawer has a module-level external store. No credential persistence found in inspected source. |
| Hosting | No confirmed deployed environment; OD-13 open. Local Vite preview on 127.0.0.1:4173, CSP and reserved-asset 404 middleware. CI artifact workflow does not prove a deployed service. |
| Configuration | `frontend/config/preview.ts` rejects every VITE setting except mock mode. Keep this gate. |
| Build | `tsc --noEmit`, Vite, then release manifest generation; manifest verifier constrains flat assets. Preserve bootstrap/recovery and security controls. |

Root scripts forward typecheck/lint/test/build/test:e2e/preview/test:release/verify:release to the frontend workspace. Playwright builds and starts production preview automatically. Never run builds concurrently against `frontend/dist`.

## Contract and invariant inventory

All four `features/*/api/mock.ts` adapters are local typed protocols, **not HTTP APIs**. `docs/API_CONTRACT.md` confirms no approved backend specification. No production fetch/axios endpoint layer is present.

| Capability | Source and implemented behavior | Gap / migration constraint |
| --- | --- | --- |
| Shops/categories/products (C-01/F-01) | `discovery/model.ts`, `api/mock.ts`, `query.ts`: Zod Catalog/Store/Product; `useDiscovery`; URL q/category/location/sort; name sorting | Stores have category arrays, but products also have a category field/filter. This conflicts with the finalized shop-only association. Plan an explicit mock-model/URL/wishlist migration in Phase 04; do not silently change business models in Phase 00/01. |
| One supplier/store (S-01) | Supplier workspace has one profile; DBML stores.owner_user_id is unique | Demo has no authenticated supplier/store ownership relationship. DBML supports the invariant but is not server enforcement. |
| Variants/stock (S-02) | Supplier product has variants with id/name/stock; stock commands use revision checks | No location dimension, price or structured size/color/wrapping/add-on combination. DBML inventory references variant + store location; not implemented as DTOs. |
| Cart (C-02) | `commerce/cart.tsx` Redux references, quantity, revision; grouping by store | Preserve revisions and selected-store consumption. Card/PDP decorative selections are not encoded in cart lines. |
| Checkout (C-02/D-01) | `CheckoutScreen.tsx`, `checkoutSchema`, `usePlaceOrder`: `/checkout?store=<slug>`; single-store validation and receipt matching | Preference only for pickup / pickme / uber-connect. No address, quote, availability or server-verified totals. Preserve other store groups, duplicate protection and non-retry writes. |
| PayHere (P-01/C-03) | Order nullable payment example labels; new sample orders request no payment | No SDK/initiation/webhook/status adapter. Never interpret redirect query parameters as paid. |
| Accounts/orders (C-03) | `useOrders`, `OrdersScreen.tsx` list/detail, local adapter | No account identity/settings/login/customer API; order history is fictional. |
| Reviews (C-04) | `useFeedback`, delivered/canReview gate, receipt checks, local text feedback | No published ratings or real moderation contract. Storefront stars/testimonials are hardcoded separately. |
| Supplier approval / user access (A-01) | Current admin model/mock/receipt support approve/reject supplier and user status commands | Older FE-0601 docs say notes only: current code has expanded simulated operations. These are not authoritative approval rules or permissions. Preserve as explicitly labeled simulations until approved live contracts exist. |
| Refunds/moderation/orders (A-01/P-01) | Admin mock supports processRefund, moderateReview, flagOrder plus label/category/note edits and reset | No actual refund execution, cancellation or publication. Optional monetary fields/status defaults are fixture vocabulary, not gateway mappings. |
| Images (M-01) | Remote URLs in discovery/assets.ts; `Illustration.tsx` actually renders decorative SVG and ignores slug/secondary/alt | No upload, presign, S3 or n8n lifecycle. Provide honest unavailable states when designing future media UI. |

## Presentation/component inventory and replacement boundaries

| Location | Current responsibility | Safe migration approach |
| --- | --- | --- |
| `shared/styles/tokens.css` | Five brand colors, aliases, radii, type/spacing; Google Fonts @import for Marcellus/Poppins | Replace token values/semantic pairings in Phase 01 with compatibility aliases. Prefer local licensed font assets or system fallback; no remote dependency required for foundation. |
| `shared/styles.css` | 2,956 lines of global styles, shared controls, shell, home/about/contact, responsive overrides | Inventory selectors before removing blocks. Separate shared primitives/layout rules from page-specific CSS; remove obsolete rules only after consumers migrate. |
| Feature CSS | discovery 1,099 lines; admin 858; commerce 16; supplier 11 | Scope to features; avoid global portal typography inheritance and repeated overrides. |
| `shared/components/ui` | Button, TextField, SelectField, Card, Badge, Skeleton, Breadcrumbs, native Dialog | Preserve props, labeled/error relationships, busy/disabled and native dialog behavior; replace presentation. Extend primitives only where the phase needs them. |
| `AsyncRegion` | Loading/empty/error/forbidden/ready with retry | Preserve state semantics and live feedback. |
| `Shell.tsx` | Shared customer/portal navigation, search, wishlist, cart drawer, footer, admin query counts | Split presentation into PublicShell/DashboardShell with app-level data wiring. Current shared→feature imports and deep admin-model import violate intended boundaries. Do not move business state into the new generic shell. |
| Discovery | DiscoveryList/Detail, Filters, RefreshNotice, Cards/ProductCard, QuickViewModal, Illustration | Rebuild cards/gallery/filter layout around existing Query/URL states. Unify duplicate PDP/quick-view/card selection UI only after honest variant behavior is defined. |
| Commerce | CartScreen, CheckoutScreen, OrdersScreen/OrderScreen, Common, AddSampleProduct | Restyle markup without changing cart reducer, schema, mutation lifecycle, store-switch keys or receipt validation. |
| Supplier | SupplierScreen, SampleForm, inline product editor/remove dialog | Extract presentation sections incrementally; preserve revision/draft/focus safeguards and command hooks. |
| Admin | AdminScreen (~1,400+ lines), AdminTable/Form/Dialogs | Extract overview/table/detail presentation by section; retain model/query/receipt/mock boundaries. Never replace working commands with cosmetic success states. |
| Public pages | HomePage, AboutPage, ContactPage, WishlistPage; old WorkspacePage not routed | Preserve real URLs and wishlist behavior. Audit unsupported copy/actions; no homepage redesign in Phase 00. Do not delete unrouted code without reference search. |
| App/release | RouteAccessibility, ErrorBoundary, query-client, startup recovery, preview/release scripts | Preserve route focus, failure recovery, retry/cancellation policy and mock-only security boundary. |

## Prioritized issue register

“P0” below means a blocker for live release, not permission to change business behavior during this audit.

| ID / priority | Evidence and impact | Owner phase / acceptance |
| --- | --- | --- |
| R00-01 / P0 | No approved API/auth/tenant enforcement, payments/delivery/media/hosting contracts | Backend/owner + affected feature phases: approved versioned operation contracts, negative tenant/auth tests before live enablement. Foundation can proceed. |
| R00-02 / P1 | Product category in discovery schema/selectProducts, wishlist snapshots and consumers contradict shop-only classification | 04: migrate fixtures/selectors/consumers together; preserve old URLs via documented shop-category semantics; test links/back navigation and stored wishlist compatibility. No invented product-category API. |
| R00-03 / P1 | ProductCard/QuickView use fixed $38/$48, sale/stock/rating and cosmetic sizes/colors; Shell calculates $38/item and free shipping at $60 | 02/05/06: remove unsupported claims or clearly label fixture-only data; selections must affect a supported sellable item or be unavailable. No guessed pricing model. |
| R00-04 / P1 | Home/assets/about contain subscriptions, testimonials, counts, team claims; Contact marks submitted without delivery adapter and embeds a map | 03 and public ancillary follow-up: verified configurable copy, truthful contact state, no dead subscription/story actions or unapproved location. Preserve URLs. |
| R00-05 / P1 | Remote Unsplash/Google Fonts and contact iframe conflict with preview img/style/frame CSP | 01 assets plan; 03–05 photos: local licensed assets with provenance, dimensions, fallback, responsive sources. Keep CSP restrictive; do not widen it to conceal broken content. |
| R00-06 / P1 | Shared Shell imports feature state/deep admin model; duplicated cart/card/dialog markup | 01–02: dependency-free layout primitives, app composition through public APIs. Preserve cart/search/wishlist/count behavior. |
| R00-07 / P1 | Secondary white-on-sage, gold/green pairings, legacy terracotta #e07a5f and !important overrides; global serif on portal UI | 01: measured contrast, semantic foreground pairs and sans portal typography; replace legacy selectors incrementally. |
| R00-08 / P1 | Historical tests refer to previous headings; newer custom drawer/quick-view coexist with native Dialog | 01/02/05/13: distinguish obsolete copy assertions from real accessibility/function regressions; keyboard trap/return/Escape, reduced motion, 320–1440px checks. Actual baseline: three shell fixtures fail from missing getServerSnapshot, three admin flows time out on exact navigation names, and two admin axe checks fail status contrast (4.33:1). Never blanket-update failing tests. |
| R00-09 / P2 | Eager route imports; baseline JS 629.98 kB (183.87 kB gzip) | 13: lazy route/feature boundaries without resetting providers/state; measure bundle and lab performance. No field CWV claims. |
| R00-10 / P1 | Admin code supports simulated decisions beyond historical notes-only docs | 11–12: document exact demo semantics and test capabilities/receipts; keep approval/refund behavior blocked for live use. |
| R00-11 / P2 | Contact hand validation, separate module drawer state and wishlist storage, missing reusable controls | Relevant phases: Zod for inputs; preserve stored wishlist shape until explicit migration; consolidate UI state only with regression evidence. No architecture-wide rewrite. |

## Migration decisions and sequence

1. Keep the current feature folders: `app` composition, `pages` route adapters, `features/discovery`, `commerce`, `supplier`, `admin`, `shared/components/ui`, `shared/components/layout`, `shared/styles`. Do not add competing catalog/checkout/lib/components trees. Add a storefront feature only if extracting public content meaningfully reduces page complexity.
2. Phase 01: semantic tokens, accessible primitives, generic public/dashboard layout frames and development-only preview. Keep compatibility class/prop aliases until consumers migrate. No business-model changes or dependency installation required.
3. Phase 02: wire public navigation/search/cart/wishlist through app composition; preserve existing path/query contracts. Phase 03: editorial home and verified public content; schedule about/contact cleanup explicitly because those routes already exist.
4. Phase 04: shop discovery plus explicit shop-category migration. Phase 05: product gallery/selection with honest unavailable price/variant states. Phase 06: cart/checkout preserving per-store invariants. Phase 07: existing order history/detail and wishlist; account settings only with real contract support.
5. Phase 08: supplier shell/profile/application; 09 catalog/variant/stock; 10 orders/sales. Phase 11 admin overview/suppliers/users/shop categories; 12 orders/payment/refunds/reviews/media only to supported scope.
6. Phases 13–14: keyboard/responsive/error-state polish, bundle measurement, regression, artifact/security checks; live release remains contract-gated.
7. Every phase updates `IMPLEMENTATION_STATUS.md`, links evidence, and checks its full consumer impact. Keep behavior assertions while changing visual expectations intentionally. Roll back a failed slice as a unit; do not remove working old components until replacements pass their relevant gates.

## Ready-to-execute Phase 01 plan

Inputs: this audit, ledger, design-system document, Phase 01 prompt and baseline verification. Requirement basis: FE-0201/0202 foundation plus all role requirements above. Assumption: native primitives and plain CSS remain the approved stack; legally usable local Cormorant/DM Sans assets are not yet supplied. Use serif/system-sans fallbacks until assets with license provenance are available rather than blocking token work.

Impacted files: `shared/styles/tokens.css`, `shared/styles.css`, `shared/components/ui/*`, `shared/components/layout/*`, app-level layout composition, `app/App.tsx` for a strictly `import.meta.env.DEV`-gated preview, associated unit/browser tests. Keep existing public component APIs compatible; preserve production route fallback and verify the preview cannot render in production. Do not add Storybook or a UI framework for this route.

Implementation order: token aliases and contrast → fields/buttons/status/async primitives → native modal/drawer and keyboard controls → public versus compact portal frames → development preview → remove only confirmed obsolete foundation CSS. Native inputs support existing Zod forms without requiring React Hook Form. Price primitive accepts explicit valid amount/currency only; absent data renders unavailable, never invented zero. Image primitive reserves dimensions and has a neutral failure state.

Acceptance: five fixed brand colors; accessible foreground/state pairs; visible focus; reduced motion; labeled input errors; busy/disabled behavior; modal focus containment/return/Escape; portal sans type; no horizontal overflow at 320/360/390/768/1024/1440px; no API/model/cart/permission behavior changes. New layout primitives do not import features. All necessary foundation components are exercised in the internal preview, including empty/error/loading states.

Tests: existing typecheck/lint/unit/build/release gates; focused primitive/shell component tests and browser keyboard/contrast/overflow checks; customer cart store-isolation and supplier/admin form smoke checks after shared changes. Fix or explicitly log baseline browser failures before declaring Phase 01 gates passed. Screenshot public/portal shells at desktop/mobile and preview states. Full browser results and current verification limits are in `PHASE_00_VERIFICATION.md`.
