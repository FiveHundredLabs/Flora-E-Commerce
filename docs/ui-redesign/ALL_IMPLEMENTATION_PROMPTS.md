# Flower & Flora — All Implementation Prompts

This is a combined, printable/readable copy. For use with Codex medium reasoning, submit **one phase at a time**; do not paste the entire document into one generation request.



---

<!-- Source: README.md -->

# Flower & Flora — Complete UI/UX Redesign Prompt Pack

**Target:** Existing React 19 + TypeScript + Vite floral marketplace, with customer storefront, supplier portal, and super-admin portal. Designed for iterative use in Codex with medium reasoning effort.

**Goal:** Replace the entire current presentation with an original, responsive, accessible, minimal-luxury Botanical Editorial design, preserving existing business functionality and backend contracts. This is a front-end redesign, not permission to destroy or rewrite business logic.

## How to use

1. Work in a fresh Git branch. Save a clean baseline and identify all existing functional flows.
2. Put this folder in the repository as `docs/ui-redesign/`, or upload the markdown files into Codex context. Make the actual Client Feature Document PDF and reference image accessible to Codex in the repo or as attachments (they are **not** embedded here).
3. Start a new Codex task with `CODEX_MASTER_PROMPT.md`; request it to load `DESIGN_SYSTEM.md` and `REQUIREMENTS_MAPPING.md` before any implementation.
4. Submit the phases **one at a time** and verify completion and preview screenshots before continuing. Do not ask medium reasoning effort to generate every screen in one turn.
5. Each phase must modify real code, run available checks, summarize changed files and verification, and disclose blockers. If the repo lacks the required APIs, implement typed boundaries and honest empty/error/unsupported states, not fabricated live flows.
6. Run `QUALITY_GATES.md` throughout and in the final phase. Review the customer storefront, supplier workspace, and admin workspace on desktop/mobile.

## Execution order

| Phase | Prompt | Result |
|---|---|---|
| 00 | `00_REPOSITORY_AUDIT.md` | Inventory actual project, routes, dependencies, contracts, coverage and safe migration strategy |
| 01 | `01_FOUNDATION_DESIGN_SYSTEM.md` | Tokens, typography, accessible components, shared layouts, responsive foundations |
| 02 | `02_PUBLIC_NAVIGATION.md` | Main site navigation, search, footer, shell, localization/currency configuration |
| 03 | `03_EDITORIAL_HOMEPAGE.md` | Luxury floral marketplace homepage |
| 04 | `04_SHOP_DISCOVERY.md` | Browse/search/filter shops and products; shop detail |
| 05 | `05_PRODUCT_EXPERIENCE.md` | Product detail, gallery, variants, stock, add-to-cart |
| 06 | `06_CART_CHECKOUT.md` | Multi-store cart, store-specific checkout, fulfilment, payment states |
| 07 | `07_CUSTOMER_ACCOUNT.md` | Auth/account, order history/detail, feedback, refunds where supported |
| 08 | `08_SUPPLIER_WORKSPACE.md` | Supplier application shell, overview, onboarding/profile |
| 09 | `09_SUPPLIER_CATALOG.md` | Product editing, variant/stock matrix, image-processing states |
| 10 | `10_SUPPLIER_ORDERS.md` | Merchant order detail, fulfilment and sales overview |
| 11 | `11_ADMIN_CORE.md` | Admin app shell, overview, store approvals, users, shop categories |
| 12 | `12_ADMIN_OPERATIONS.md` | Platform orders, payments, refunds, feedback moderation, image oversight |
| 13 | `13_POLISH_ACCESSIBILITY.md` | UX states, focus, responsiveness, accessibility, content, SEO/performance |
| 14 | `14_VERIFICATION_RELEASE.md` | Tests, visual regressions, end-to-end workflows, handoff |

## Source precedence / conflict control

1. Current verified code and backend API contracts are authoritative for *how* existing behaviour works.
2. Finalized business decisions from the project take precedence over earlier alternatives in the attached **Client Feature Document.pdf**.
3. The supplied client feature PDF defines high-level approved feature scope; anything marked "to confirm" is not a licence to invent requirements.
4. The supplied reference screenshot is for art direction, not pixel cloning and not a source of business rules.
5. If the actual repo or signed-off specification contradicts this pack, document it and preserve working features; do not silently make destructive changes.

### Finalized project assumptions — confirm against real project

- This is a marketplace: many suppliers, each supplier manages exactly one store.
- Shop/store categories: a shop can be in multiple categories. Products **do not have product categories** (this supersedes the older PDF's generic product-category language).
- One cart may contain products from multiple shops; each checkout/order must belong to **exactly one store**. Never silently merge orders across stores.
- Product variants can include size, color, wrapping, and add-ons; stock is managed by store location and sellable variant, per the actual schema.
- Selected payment gateway: **PayHere**, if confirmed in repo/contracts.
- Delivery provider options: **Uber Connect** and **PickMe Flash**, subject to approved backend integration and availability; **store pickup**.
- Post-delivery store feedback, approved supplier onboarding, S3 originals and processed images via back-end/n8n workflow.
- Live driver maps, loyalty, coupons, subscription, commissions and automated payouts, advanced analytics, broad multi-currency, and other unapproved features are **out of scope**.
- Official brand name/logo, exact shop category taxonomy, refund rules, fulfilment pricing, and other pending settings are configurable/awaiting sign-off. No fake customer reviews or fabricated marketplace figures.

## Research used for UX direction

- Baymard Product Listing UX: https://baymard.com/research-articles/current-state-product-list-and-filtering
- Baymard Checkout UX: https://baymard.com/research-articles/current-state-of-checkout-ux
- Baymard product page UX: https://baymard.com/research-articles/current-state-ecommerce-product-page-ux
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- shadcn/ui theming: https://ui.shadcn.com/docs/theming
- React Router modes: https://reactrouter.com/start/modes
- Google Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals

Original design inspiration can be researched from editorial florist websites and curated examples; do not copy their images, text, logos or proprietary composition exactly.



---

<!-- Source: CODEX_MASTER_PROMPT.md -->

# CODEX MASTER PROMPT — FLOWER & FLORA COMPLETE FRONTEND REDESIGN

You are the acting Staff Frontend Engineer, Principal Product Designer, UX Architect, Accessibility Lead and Design-System Maintainer for an existing **multi-vendor Flower & Flora marketplace**.

## Mission

**Replace the entire current UI/UX from zero with a cohesive, high-end, minimal-luxury Botanical Editorial experience**, including the public marketing website, customer e-commerce, supplier/store portal, and super-admin portal. This is a **visual and interaction redesign of an existing real application**, not a greenfield rewrite. Keep legitimate business operations, API integrations, auth logic, state and permissions intact unless a narrowly justified refactor is essential. Avoid prototype-quality shortcuts.

## First actions, always

1. Read `docs/ui-redesign/DESIGN_SYSTEM.md`, `docs/ui-redesign/REQUIREMENTS_MAPPING.md`, `docs/ui-redesign/QUALITY_GATES.md`, and the **specific phase file** for this task.
2. Inspect actual repo configuration, routes, existing components, authentication and authorization, API contracts, existing data models and test scripts. Examine the client feature PDF and reference image if accessible; report if missing.
3. Compare the phase scope with actual implementation. Produce a short impact plan (files/screens affected, reuse, dependencies, edge cases). Then implement the phase in the same task. Do not stop after planning.
4. Prefer incremental, compiling changes. Keep existing URLs where possible, avoid data loss and breaking changes, and do not touch backend endpoints or schema without explicit real contract support.
5. After implementation, run available lint/typecheck/tests/build (and browser verification if available) and report actual results. Do not claim a check ran if it did not.

## Design brief

Brand: Botanical Editorial Luxury — quiet, natural, premium, timeless, human, clean. **No generic SaaS template, giant gradient blobs, harsh blue hero, stereotypical rounded cards, ornamental overload, fake KPI values, or busy animations.**

Five fixed foundation colors: Deep Green `#244C3A`; Sage `#6F967B`; Light Sage `#B7CDB5`; Cream `#F5F3E9`; Muted Gold `#D9A85F`. Extra semantic/neutral UI tokens are allowed if necessary for contrast and states, never arbitrary unrelated brand hues. Use deep-green text on cream, gold mainly as an accent. Serif display headings + legible sans body. Large authentic floral product photos, warm backgrounds, restrained dividers, clean grids, superior product detail UX, distinct page compositions.

The public site should be visually expressive; portals should be operationally efficient with the same brand tokens. **Never copy-paste the homepage card/typography style into admin data tables**.

## Stack and non-negotiable standards

Respect versions already installed and use stable compatible APIs. Preferred: React 19 + Vite + strict TypeScript, React Router v7, Tailwind CSS, shadcn/ui and Radix primitives, Lucide React, TanStack Query for remote data, Redux Toolkit only for appropriate client/global state, React Hook Form + Zod for complex forms, typed fetch/axios wrapper, TanStack Table for large data tables, Vitest/RTL and Playwright. No unnecessary packages. Follow project conventions. Use semantic HTML, mobile-first responsive layouts, robust loading/error/empty/success states, WCAG 2.2 AA, secure frontend practices, image optimization, CLS prevention, SEO hygiene.

## Critical marketplace invariants

- Each supplier has **one** store.
- Store/shop categories are many-to-many; **products have no category** in the finalized data model. Do not introduce a product-category association simply because the earlier PDF says "product categories".
- A customer's cart can contain items from different stores but checkout is **per store**; one order is for one store only.
- Variants: size, color, wrapping, add-ons as supported by backend. Inventory per sellable variant + store location.
- Delivery: Uber Connect, PickMe Flash or store pickup only when actual store/provider location supports it.
- PayHere payment flow/status must be driven by verified backend/webhook results, not assumed from redirect query params.
- Reviews/ratings only for eligible delivered orders; prevent unauthorized supplier/admin operations with real server-side permissions.
- Uploaded original images go to S3 through authorized backend mechanisms, then background-removal workflow via n8n and processed assets are stored back in S3. Do not put S3 secrets/n8n credentials in frontend.
- Do not fabricate maps, driver positions, delivery pricing, refund eligibility, approval rules, sales charts, success reviews, promotion codes or production API endpoints.

## Implementation discipline

Do not implement one monolithic app component; organize feature-based modules with app layouts, shared UI components, feature hooks/schema/types and typed APIs. Do not duplicate TanStack Query server state in Redux. Keep public content and app business settings configurable. Use real product/store images from authorized project assets or explicitly labelled local development fixtures; never ship broken hotlinks or unrelated stock placeholders. Favor `prefers-reduced-motion` and subtle 120–240ms transitions. Preserve motion semantics and keyboard access.

## Completion response format

For every phase, return: (1) completed experience and key visual decisions, (2) files changed, (3) contracts/features preserved, (4) tested checks with actual pass/fail results, (5) screenshots/preview links if tools support, (6) blockers/unknown API contracts, (7) next-phase readiness. No unsupported claims of production readiness.

Proceed with the specific requested phase now, implementing code rather than generating abstract advice.



---

<!-- Source: DESIGN_SYSTEM.md -->

# Design System v1 — Botanical Editorial Luxury

All screens share these values, but **marketing / commerce** and **back-office** use different density and typography rules.

## Identity
- Voice: calm, descriptive, editorial, accurate, warm, premium without pretence. Never invent customer testimonials or unsupported delivery guarantees.
- Atmosphere: bespoke florist studio meets reliable marketplace.
- Composition: contrast in section scale; strong asymmetry balanced with disciplined grids. Photography has intentional focus and breathing room. Avoid cloning the supplied reference screenshot.
- Avoid: cobalt/terracotta from old design, neon greens, rainbow graph palettes, excessive gradients, overly rounded cards, blur/glassmorphism, decorative gimmicks, intrusive popups and autoplay video.

## Brand tokens

| Token | Value | Suggested use |
|---|---|---|
| `brand.deep` | `#244C3A` | Primary actions, dark surfaces, text, nav |
| `brand.sage` | `#6F967B` | Selected backgrounds, strokes, accents (NOT small text on cream) |
| `brand.mist` | `#B7CDB5` | Section background, subtle shapes, borders |
| `brand.cream` | `#F5F3E9` | Main warm background |
| `brand.gold` | `#D9A85F` | Tiny accents, labels, decorative rules, icons |
| `surface.paper` | `#FFFFFF` | Portal panels, forms, commerce cards |
| `surface.soft` | `#FCFBF7` | Soft alternate background |
| `border.soft` | `#DFE4D9` | Fine separators and boundaries |
| `text.strong` | `#244C3A` | Headings and normal copy |
| `text.muted` | `#435648` | Secondary copy |
| `danger` | choose accessible muted brick red | Form errors, destructive actions |
| `warning` | choose accessible dark amber | Non-destructive warning |
| `success` | choose accessible deeper green | Positive state |
| `info` | choose accessible neutral/slate | Informational state |

Before mapping CSS variables into shadcn tokens, confirm Tailwind/shadcn versions. Define actual variables in the project's existing styling entry point and adapt semantic `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, `destructive`, `chart`, etc. Ensure every variant has readable foreground pairings. Restrict dark theme to an explicit requirement; prioritize excellent light theme.

**Contrast guard:** `#244C3A` on `#F5F3E9` ~= 8.70:1; `#6F967B` on cream ~= 2.99:1; `#D9A85F` on cream ~= 1.94:1. Deep-green small text on gold ~= 4.48:1, just below strict 4.5:1 AA normal text. Gold-on-green also may not pass. Validate **actual rendered combinations** in components; do not assume ornamental colors are readable text colors. Default AA normal text 4.5:1, large text 3:1, UI non-text contrast 3:1 when applicable.

## Typography
- Display: `Cormorant Garamond` (or another legally usable high-quality editorial serif already licensed in repo); headings typically 38–76px desktop and fluid/clamped, 32–46px mobile; avoid ultra-thin weights.
- Body/UI: `DM Sans` (or existing similarly readable sans); body 15–17px; 1.5–1.65 line height. Admin data sizes 13–15px only where accessible and appropriate.
- Use font-display swap and font subset/self-hosting or established project loading strategy. Prevent layout shifts.
- Public titles: serif, sentence case, balanced lines. Portal table labels, KPI labels, navigation: sans. Avoid all-caps paragraph text.

## Layout
- Public content max-width ~1280–1360px, viewport gutters mobile 20px; tablet 32px; desktop 48–64px.
- 12-column desktop grid; 8-column tablet; 4-column mobile conceptually. On mobile use 2-column products when 320px screens and prices fit; otherwise 1-column at narrow widths.
- Spacing scale based on 4/8px steps; public section spacing roughly 80–120px desktop, 48–72px mobile; portals more compact 20–32px content spacing.
- Cards: image-first, modest 8–16px radius when useful, borders preferred to heavy shadows. Buttons 44–48px min practical touch area, large readable labels, focus rings.
- Section patterns: split image/text, calm dark-green campaign panels, alternating warm white/cream, wide photography, thin editorial dividers, quiet collection tiles, restrained microcopy.
- Portal app shell: navigation sidebar + topbar + breadcrumbs; sticky action areas where appropriate; collapsible mobile sidebar; fixed semantics for data tables/filter bars.

## Component inventory
Foundation: Button (solid/outline/quiet/destructive), IconButton, TextInput, SearchInput, Textarea, Select, Combobox, MultiSelect, Checkbox, Radio, Switch, FormField, Helper/ErrorText, Badge, Tabs, Breadcrumb, Dialog, Drawer/Sheet, Tooltip, Popover, Toast, Skeleton, EmptyState, Alert, Pagination, PaginationStatus, Price, ImageWithFallback, Separator, ResponsiveContainer, PageHeader, ConfirmDialog, DataTable, FilterBar, FileUploader, StatCard, Timeline/StatusStepper.

Commerce: SiteHeader/MobileMenu/SearchOverlay, StoreCard, ProductCard, ProductGallery, VariantSelector, AddOnSelector, PriceSummary, StockBadge, CartItem, PerStoreCartGroup, FulfilmentOption, OrderStatusTimeline, ShopRating, ReviewCard (actual data only).

Admin/Supplier: DashboardShell, RoleNavigation, StatsGrid, DataTableFilters, TableToolbar, LoadingRow, BulkActions (only authorized), KPI trend indication (only real data), ApprovalDrawer, OrderItemsTable, ImageProcessingState, StatusChip, AuditInfo (if supported).

## UX behavior
- Never rely on color alone. All form inputs have persistent labels and programmatic error descriptions.
- Avoid nested clickable interactive elements in product cards.
- Focus moves correctly on modal/drawer open/close. Escape dismisses appropriate overlays. Focus is visible for keyboard users.
- Product/add-to-cart/quantity/checkout feedback is immediate and clearly associated with the relevant item; error rollback is handled.
- Responsive filter drawer on mobile; applied filter chips, result counts and reset action on search/listing pages.
- Real shipping/fulfilment availability is shown before order confirmation; delivery price must come from verified quotes or say unavailable/pending.
- Cart totals and checkout totals are computed with server-verified prices at the appropriate stages.
- Table sorting, filters, counts, date ranges and CSV export must reflect actual backend capabilities; do not invent.

## Photographic direction and assets
Warm daylight, real botanical textures, cream stone, linen, pottery, pale studio walls, green foliage, bespoke bouquets. Mix full-bleed editorial still life with product cutouts on consistent neutral surfaces. Use only project-owned/licensed images and provide meaningful alt text, `width`/`height` or aspect ratio, srcset/sizes, lazy-loading below fold; prioritize hero LCP resource. The supplied reference's blue gradient and terracotta sections are **not** part of the new brand palette.

## Motion
Subtle reveal when helpful, small hover emphasis, no forced parallax, no layout-transform animations that impair use; respect reduced-motion preference. Inputs, drawers, tabs and page transitions must not delay interaction or block screen readers.

## Thematic separation
- **Public landing:** editorial serif, atmospheric oversized imagery, story sections, varied asymmetric composition.
- **Shop/PDP/cart:** more structured, shopping-first clarity, stable imagery, visible price and actions.
- **Supplier/Admin:** information dense but calm, sans-first UI, sticky table headers, accessible controls, strong information hierarchy, few decorative images.



---

<!-- Source: REQUIREMENTS_MAPPING.md -->

# Requirements Matrix and Route Architecture

The high-level scope is adapted from the supplied **Client Feature Document — Flower & Flora E-Commerce Platform (8 pages, dated November 2026)** and later project finalizations. Route names below are **proposals**, NOT claims about the actual source. Inspect existing routes first and preserve compatibility; implement route aliases only if justified.

## 1. Public/Customer experience

| Feature area | Candidate screens (adapt to repo) | Key UX responsibilities |
|---|---|---|
| Brand | `/`, `/about`, `/contact`, policy/help pages only if approved | Story, discovery, credible copy, legal/business details |
| Explore | `/shops`, `/shops/:storeSlug`, `/flowers` or `/products`, `/search` | Shop category + location filters, shop detail, product listings and search |
| Product | `/shops/:storeSlug/products/:productSlug` | Gallery, price, variant selectors, availability, clear store identity |
| Cart | `/cart` | Group by shop; explain checkout is per-store |
| Checkout | `/checkout/:storeId` or current route | Fulfilment delivery/pickup, provider quote if supported, address, totals, payment initiation |
| Post-checkout | Current order return/confirmation route | Verify server order/payment status; no success from URL only |
| Customer | `/account`, `/account/orders`, `/account/orders/:orderId`, `/account/settings` | Orders, fulfilment, payment/refund status, feedback eligibility |

## 2. Supplier / Store experience

| Feature area | Candidate screens | Key UX responsibilities |
|---|---|---|
| Entry | `/supplier/onboarding`, `/supplier` | Application/approval state, supplier role handling, one-store assumption |
| Store | `/supplier/store` | Profile, location, contact details, delivery/pickup capabilities |
| Catalog | `/supplier/products`, `/supplier/products/new`, `/supplier/products/:productId/edit` | Products, images, variant combinations, validation |
| Stock | `/supplier/inventory` | Stock per variant and store location, availability, bulk action only if supported |
| Orders | `/supplier/orders`, `/supplier/orders/:orderId` | Details, transitions, fulfillment/pickup, status constraints |
| Sales | `/supplier/sales` | Honest real backend aggregates, filters, zero states |
| Media | integrated product editor or `/supplier/media` if supported | Original image + processed variant, background processing states |

## 3. Super Admin experience

| Feature area | Candidate screens | Key UX responsibilities |
|---|---|---|
| Overview | `/admin` | Marketplace totals from real data, statuses, trends only if available |
| Suppliers/stores | `/admin/suppliers`, `/admin/stores` | Supplier applications and approvals, status, access |
| Customers/users | `/admin/users` | Search/filter permitted user account data, role/status actions only if authorized |
| Shop categories | `/admin/categories` | Manage classification for stores/shops; NO invented product-category linkage |
| Orders | `/admin/orders`, `/admin/orders/:id` | Cross-store oversight and filtering |
| Payments | `/admin/payments` | Gateway transaction status, linked order details |
| Refunds | `/admin/refunds` | Review/approve/reject/processed only according to real refund policy and API |
| Feedback | `/admin/reviews` | Review/moderation with real permissions and recorded reasons |
| Image status | `/admin/media` if supported | Track original → processing → processed/failure on authorized scope |

## Non-negotiable end-to-end UX workflows

1. Customer explores real shops, filters by supported store/category/location, opens store, opens product.
2. Customer selects a backend-valid variant and add-ons, sees accurate availability/pricing, adds product to cart.
3. Cart can contain store A and store B items; user checks out store A only; store B items remain in cart. One resulting order has exactly one store.
4. Checkout presents actual delivery vs pickup eligibility; provider quote/availability when supported; displays verified final total; initiates PayHere via backend.
5. Payment is rendered pending until backend verifies status; failed/cancelled/retry path is coherent; no false order success.
6. Supplier receives only that supplier's store orders, executes allowed status transitions, prepares pickup or delivery, sees actual sales overview.
7. Super admin reviews supplier applications, user and shop classifications, orders, payment/refund processes and post-delivery feedback moderation.
8. Supplier/admin uploads image through authorized backend/S3 flow; original + n8n processed lifecycle has visible states; a failed job is not displayed as complete.

## Business-rule uncertainty and design gates

- PDF uses "product categories" in admin scope; later marketplace finalization states categories apply to **shops only**. Follow later finalized decision and flag if backend differs.
- Supplier product publish approval is not established: show only real review state/workflow supported by backend.
- Guest checkout and required signup are not finalized: inspect existing auth contracts before deciding; checkout must not pretend guest checkout works.
- Refund timing, eligibility, partial refunds and delivery charge policy remain to confirm: UI should reflect actual allowed actions only.
- Delivery fee calculation, provider coverage and cancellation need approved integrations: no fake rates/ETAs.
- Store feedback may include stars/text; image review is not confirmed: do not invent photo submissions.
- Branding: final business name/logo/category names not supplied; implement brand config and use neutral site title as internal design placeholder only, not fake company registration.
- Live driver tracking and maps are **not** included in signed-off baseline; only add after backend provider capability and customer approval.
- Loyalty, subscriptions, coupon systems, automated payouts, advanced analytics and multi-currency are out of scope unless later agreed.



---

<!-- Source: QUALITY_GATES.md -->

# Acceptance and Quality Gates — apply to every phase

## A. Experience and design
- Distinct editorial identity on public pages; commerce is easy to use; admin/supplier have effective operational density.
- Design tokens, type hierarchy, image ratios, layout grid, spacing and interaction states are consistent.
- All meaningful controls have functional actions; never create dead CTA buttons or fake filters/exports.
- Every page includes appropriate loading, empty, error and success states; unsupported backend features remain disabled/explained, not falsely completed.

## B. Responsiveness
- Verify common viewport sizes 360px, 390px, 768px, 1024px, 1440px (and 320px if feasible).
- No horizontal overflow or clipped sticky controls; mobile nav, filter drawers, data tables and modal dialogs usable by touch/keyboard.
- Test long product/store names, high prices, validation errors, no images, and variable translated content length.

## C. Accessibility
- Target WCAG 2.2 AA. Contrast normal body text >=4.5:1, large text >=3:1, essential non-text UI components >=3:1 when applicable.
- Accessible names and relationships, visible focus, logical headings, skip navigation, dialog focus trap/return, live feedback as appropriate.
- Tap targets preferably >=44x44px for comfort, at least WCAG 2.2 AA requirements with applicable exceptions. Do not convey status only by color.
- Reduced motion, keyboard-only tests, accessible async status, useful image alt text.

## D. Security/data integrity
- Never infer administrative role from frontend UI alone. Backend role checks remain required.
- No private API keys, gateway secret, S3 access keys, presigned URL logs or n8n credentials client-side.
- Avoid `dangerouslySetInnerHTML` for untrusted user-controlled content; sanitize where unavoidable.
- Prevent stale product price/order total, double submission, optimistic payment success and cross-store order merging.
- Use typed server contracts and error handling; honor existing auth, cookies and CSRF strategy.

## E. Quality and build
- Keep TypeScript strict and no casual `any` casts.
- Run the existing project scripts for lint/typecheck/unit tests/build; if missing, state that honestly rather than inventing command results.
- Add tests for each feature's important state transitions, forms, filtering, cart split, checkout and approvals.
- Add Playwright smoke coverage for customer, supplier and admin critical paths when test infrastructure permits.
- No console errors, unhandled promises, broken images or uncontrolled layout shifts in inspected screens.

## F. Performance
- Favor responsive optimized assets; hero LCP image not accidentally lazy loaded.
- Avoid heavy carousels, huge JS bundles and duplicate requests. Route-level code-split feature areas appropriately.
- Measure rather than claim: targets at 75th percentile LCP <=2.5s, INP <=200ms, CLS <=0.1 on representative real traffic when available.
- Declare real measured results vs lab estimates; do not claim Core Web Vitals passed without evidence.

## Phase delivery checklist
1. List actual created/changed/deleted files.
2. State route paths/screens completed and what remains.
3. State backend contract usage and any unimplemented endpoints.
4. Report real lint/typecheck/test/build outputs.
5. Where browser available, provide or describe screenshot verification for mobile + desktop.
6. Identify outstanding UX or accessibility risks.
7. Ask for no additional redesign phase until the current one meets gates or blockers are logged.



---

<!-- Source: prompts/00_REPOSITORY_AUDIT.md -->

# Phase 00 — Real Repository Audit and Safe Redesign Migration

Read `docs/ui-redesign/CODEX_MASTER_PROMPT.md`, `DESIGN_SYSTEM.md`, `REQUIREMENTS_MAPPING.md`, `QUALITY_GATES.md` and the attached client document/reference image if accessible.

**Task:** Audit the actual existing project before deleting/replacing any UI. In this task, create an actionable redesign map and commit only safe preparatory changes.

1. Identify package manager, React/Vite/TS/router/Tailwind/shadcn versions, build/test scripts, lint config, aliases, asset strategy, fonts, deployed environment, routing and auth/session strategy.
2. Enumerate all actual public/customer/supplier/admin routes, corresponding entry files and shared components. Tag each route with role access, source hooks, backend dependency, current status and redesign phase.
3. Identify APIs and typed models for shops, shop categories, products, variants, per-location inventory, multi-store cart, per-store checkout, PayHere, delivery provider options/pickup, accounts/orders, reviews/refunds, supplier approval, image processing.
4. Check business assumptions against the current code: each supplier has one store; shop categories not product categories; cart may contain multiple shops but a single checkout belongs to one store.
5. Audit current UI styles, global CSS, legacy colors, reusable components and duplicated markup. Identify **presentation code safe to replace** vs business logic that must be preserved. Determine how to migrate without losing working functions.
6. Set up design-system integration plan, folder responsibilities and a screen-by-screen implementation ledger in `docs/ui-redesign/IMPLEMENTATION_STATUS.md`, with columns: route, phase, old component, API integration, new component, UX states, tests, screenshot status.
7. Propose feature folders compatible with existing conventions, e.g. `app/`, `features/storefront/`, `features/catalog/`, `features/checkout/`, `features/supplier/`, `features/admin/`, `components/ui/`, `lib/`, `layouts/`. Do not forcibly restructure if current structure is sound.
8. Establish a non-destructive migration sequence: shared design tokens, public shell, commerce core, customer, supplier, admin, quality. Call out backend contract gaps clearly.
9. If there is an existing test suite, run baseline scripts before changing presentation and record actual baseline failures. Do not fix unrelated business issues without necessity.

**Deliverables:** route and component inventory, architecture/migration decisions, prioritized issue register, created implementation status file, check outputs, ready-to-execute Phase 01 plan. **Do not redesign the homepage yet.**



---

<!-- Source: prompts/01_FOUNDATION_DESIGN_SYSTEM.md -->

# Phase 01 — Complete Botanical Design System Foundation

Read the master prompt, design system, requirements mapping, audit output and quality gates. Implement real reusable UI foundation in the existing app.

1. Replace old presentation theme with unified semantic tokens; ensure the five fixed colors are respected. Introduce neutral/semantic/error colors only for practical UI. Map tokens to project's actual Tailwind/shadcn conventions; handle all Radix/shadcn components. Remove old conflicting global CSS *only after confirming no retained feature depends on it*.
2. Configure typography responsibly: Cormorant Garamond (editorial public display) and DM Sans (body/UI) or approved existing equivalents. Load fonts safely. Define type scales, containers, spacing, border, shadow, radius, focus/hover and motion tokens.
3. Build and visually verify shared components: button variants, icon buttons, links, labeled inputs, selects, combobox, checkbox/radio, textarea, form errors, badges, drawers, dialogs, accessible dropdown, tabs, table primitives, skeleton, empty state, errors, price formatting, images, status tags, toasts and confirm dialogs.
4. Create public, supplier and super-admin layout primitives (not full pages yet): public site shell vs compact dashboard shell, content container, headers, page headings, responsive navigation patterns, consistent breadcrumbs. Avoid mixing serif hero typography into merchant/admin tables.
5. Add consistent support for focus-visible, disabled/busy state, reduced-motion and keyboard navigation. Define reusable form field components to support React Hook Form/Zod, preserving current forms.
6. Implement an isolated internal `/dev/design-system` preview route or Storybook stories if existing tooling supports; do not publicly expose in production. Include key color pairings and all component interaction variants.
7. Verify actual text contrast. Never use sage or gold as tiny text on cream. Primary solid button deep green/cream, outlined button deep green border, understated text button, and accessible destructive button.
8. Support responsive 360/390/768/1024/1440px and avoid mobile overflow, layout shifts and broken modal focus.

**Definition of done:** new tokens and primitives are visible, theme conflicts removed, reusable shells ready, no business logic modified, real build/typecheck/lint results and visual verification documented.



---

<!-- Source: prompts/02_PUBLIC_NAVIGATION.md -->

# Phase 02 — Global Public Website Shell and Navigation

Read all project redesign docs and preserve actual application routes and auth contracts.

**Outcome:** A premium, intuitive global site frame with predictable navigation, search and identity.

Implement:
- Announcement/utility strip **only if content is confirmed** (avoid fake 'free delivery' promises).
- Main navigation on desktop with configured brand/logo, Shop Flowers, Explore Shops, useful store categories if available, About and Help/Contact if routes exist; real account/auth access, search, cart count. Do not add empty nav routes.
- Sticky-on-scroll or compact header only if it remains unobtrusive and stable. Use cream/white surfaces, deep-green marks, fine borders and correct focus states.
- Search overlay or full search entry: keyboard usable, submit to the actual search route, meaningful query, clear/reset, zero/no-results handling, no fake instant suggestions.
- Mobile navigation drawer with large touch targets and category hierarchy if actual data exists; Escape and focus return; cart and account always accessible.
- Footer with approved brand/story, real policies, useful site links, social links only when provided; newsletter only if a legitimate subscriber endpoint and consent copy exists. Otherwise do not show dead signup.
- Breadcrumb primitive and clean navigation transitions; loading/error fallbacks for shared data, avoid flicker. Account menu varies properly by role/authorization.
- SEO fundamentals for public pages: descriptive titles/meta where supported, canonical strategy based on actual deployment, accessible landmark headings, skip-to-content.
- Cart item count synced from existing state without duplicate API fetches.

**Verify:** desktop/mobile navigation flows, tab/shift-tab/escape, long menu labels, active routes, authenticated/unauthenticated cases, missing logo fallback. Record screenshots and tests if available.



---

<!-- Source: prompts/03_EDITORIAL_HOMEPAGE.md -->

# Phase 03 — Complete Luxury Homepage from Zero

Use the new design system; replace all current homepage visual structure. **Never clone the supplied reference screenshot exactly**. Use its editorial restraint, product photography, serif composition, alternating image/text storytelling as inspiration; not its old blue and terracotta sections.

Build a mobile-first high-end florist marketplace homepage with an original layout:

1. **Hero:** responsive asymmetric split or image-dominant editorial hero, warm cream/deep green, one authentic floral photo asset with appropriate licensing, large elegant serif headline (e.g. "Thoughtfully gathered. Beautifully delivered." if approved copy isn't provided), concise supporting paragraph and strong functional CTA "Explore flowers" plus secondary "Discover shops". Optional short trust line ONLY if supported by real data/policies. Ensure strong contrast and readable text against image.
2. **Shop by inspiration / shop categories:** dynamically render **store categories** from real API; do not invent product categories. If category data absent, fall back to relevant browse-stores section or honest empty state.
3. **Featured flowers / recent discoveries:** actual product API integration or a clearly separated local development fixture. Product cards with photo, product name, store name, real price, availability and purposeful hover/quick action only if functional.
4. **Discover local florists:** horizontal or editorial grid of shop cards showing their profile, location and factual supporting metadata. Link to store details.
5. **Brand storytelling section:** large photo plus crisp typographic editorial statement about floral experiences; avoid fabricated company-history or sourcing claims.
6. **How marketplace ordering works:** three factual steps such as choose shop → personalize arrangement → arrange delivery/pickup; accurately state store-specific checkout.
7. **Mood/editorial campaign segment:** dark-green or soft-sage campaign block with secondary gold accents and one striking floral still-life. CTA remains accessible.
8. **Trust/help section:** clarify pickup, delivery-provider choices, payment process, subject to real availability; no invented guaranteed arrival dates.
9. **Footer invitation:** useful browsing CTA or approved contact links. Do not invent Instagram feeds, reviews, testimonials, mailing list or fake social proof.

Layout direction: ~1280px max-width, 12-column rhythm, purposeful asymmetry, high-end product image ratios, 2-column mobile product cards where readable, descriptive rather than decorative copy, distinct section transitions without heavy shadows. Buttons and links must work. Ensure hero content paints quickly and aspect ratio prevents CLS.

**Definition of done:** complete new homepage on mobile/tablet/desktop, no leftover legacy sections, actual navigation and product links work, no fake features, state handling and checks documented.



---

<!-- Source: prompts/04_SHOP_DISCOVERY.md -->

# Phase 04 — Marketplace Discovery, Search, Shop Listing and Shop Profile

Implement all actual browse/search/store screens according to existing backend contracts. This is a **marketplace**, not a single-florist shop.

1. Shop directory with editorial page heading, result count, responsive grid/list of well-designed store cards, verified store imagery, name, location, accurate badges/categories, optional ratings only if real.
2. Filters: shop name/search, available **shop categories** (multi-category associations), location if supported, sorting options only when backend supports. Provide applied filter chips, clear-all, URL-driven query state to preserve navigation/shareability, correct back/forward behavior and honest no-results state.
3. Products browse/search: product cards with store source, currency/price, availability, and sorting/filtering based on real searchable fields; **never attach product categories**. Product search may filter by store, variant attributes, price and availability if supported.
4. Mobile browse experience: accessible filter bottom sheet/drawer with Apply/Clear, visible active filter count and sticky sort/filter affordance without obscuring results. Desktop has compact sidebar or toolbar depending on context.
5. Shop details: large authentic cover/hero, store name, description, contact/location, store categories, verified fulfilment methods, product grid, store feedback if API exists and approved. Clear CTA to browse shop products. No invented operating hours or delivery area.
6. Add pagination/infinite load only if matching current backend conventions. TanStack Query caching/stale state, abort/cancel handling, clear loading skeletons, retry affordance, empty state.
7. Keyboard and screen reader access: filter labels, announced results, stable focus when filters change, and no nested click targets.

**Acceptance tests:** store-wise filters actually affect data, URL state survives reload, sorting is deterministic, categories belong to shops, 360px filter sheet works, no product-category references, errors and zero results are credible.



---

<!-- Source: prompts/05_PRODUCT_EXPERIENCE.md -->

# Phase 05 — Luxury Product Detail, Variant Selection and Add-to-Cart

Replace existing product details with a visually premium yet high-converting page, preserving actual variant and inventory contracts.

- Breadcrumb shop → product, prominent image gallery with good visual hierarchy, thumbnail navigation and accessible modal zoom if genuinely useful. Accurate alt text and image fallback. Avoid unlicensed synthetic gallery content.
- Product information: descriptive title, supplier/store link, product copy, actual price/price range, clear stock/availability state and size/color/wrapping/add-on selectors only as supported by current APIs.
- Correct variant selection state: no invalid combinations, update SKU/variant and price/stock from actual data; show selected attributes, availability per store location when relevant, and concise field-level validation. Add-ons update totals only using real pricing rules.
- Clear primary add-to-cart and secondary navigation to store. Disable invalid/unavailable combinations; handle server price/stock rejection gracefully. Use pending button and successful feedback without duplicate submits.
- Shop identity, delivery vs pickup information conditioned on confirmed provider/store settings; display fees/ETA only when verified; no fake countdown or scarcity.
- On mobile: image gallery above details, visible price, accessible fixed/sticky add-to-cart action only if it does not obstruct content and keyboard controls; bottom sheet for options if needed. On desktop: gallery left, buying summary right, restrained white space.
- Related items or other items from this shop from actual API; never imply same-store checkout for items from different shops.
- Add unit/component tests for selector validation, price rendering, disabled add-to-cart and backend error handling.

**Pass when:** variant selection genuinely changes sellable item, inventory prevents invalid purchase, one cart line refers to the correct store/product/variant/add-ons, UI is elegant and functional at 360px.



---

<!-- Source: prompts/06_CART_CHECKOUT.md -->

# Phase 06 — Multi-Store Cart and Store-Specific Checkout

This phase has the highest business integrity risk. Read the existing cart, order, payment, delivery and session contracts before editing.

## Cart
- Elegant cart layout with **store-separated groups**, store header, product thumbnails, variant/add-on summaries, unit price, stock status, increment/decrement/remove controls, accurate subtotal by shop, and whole-cart item count.
- One clear **"Checkout this store"** action for each store group; explain other stores remain in cart. Do not create a multi-store order or silently empty every store after one purchase.
- Empty cart, stale stock/price changes, quantity limits, network failures, removal confirmation (where appropriate), async state and rollback.
- Maintain cart state via existing contract; use TanStack Query for server state, Redux only if it already owns appropriate client cart state.

## Checkout (one store per order)
- Show trustworthy step structure: address/contact → fulfilment → review/payment as supported by existing workflow. Do not force a fictitious multistep flow.
- Display exact shop and order items persistently in an accessible summary; show fees, tax and final total from verified server/quote values.
- Delivery/Pickup selection: supplier-provided pickup location/instructions if available; Uber Connect and PickMe Flash options only when approved backend APIs signal availability. If provider not integrated, present unavailable explanation instead of working-looking buttons.
- Address inputs with persistent labels, validation, accessible errors and no redundant fields; do not presume guest checkout unless backend supports it.
- PayHere gateway initiation uses server-created payment intent/authorization; never expose merchant secrets or trust user-editable client amounts.
- On return, query the backend to confirm order and payment status. `pending`, `successful`, `failed`, `refunded` only if supported. URL query parameters alone do **not** establish success. Prevent duplicate purchase on retry/double-click.
- Payment failure/cancel/retry and order success/receipt screens with truthful next actions.

## Critical e2e scenario
Cart has store A and store B; checkout store A; verify the resulting order references **only A**; B remains in cart; backend-controlled totals match displayed totals; inaccessible provider option cannot be selected; payment result never falsely indicates success.

**Delivery:** type-safe functional cart + checkout with verified APIs and real tests, no fake delivery quotes or payment outcomes. Explicitly report any missing backend capabilities.



---

<!-- Source: prompts/07_CUSTOMER_ACCOUNT.md -->

# Phase 07 — Customer Auth, Account and Post-Purchase Experience

Reuse actual auth architecture, backend contracts and authorization. This is a UI/UX redesign, not a rewrite of login security.

1. Premium yet restrained account/auth screens; clear form labels, password visibility button, proper loading/lock states, links only for supported register/recover flows. Honor HttpOnly cookies, token refresh and CSRF strategy where present.
2. Customer account landing with personal details and compact side navigation; mobile accessible tabs/drawer; no fake loyalty dashboard.
3. Order history with real orders, search/filter if API supports, shop identity, order date, total, payment and fulfilment status, and empty state with explore CTA.
4. Order detail: items/variants/add-ons, supplier, order ID, timeline derived from actual backend events, delivery vs pickup details, payment status and delivery provider/tracking link **if supported**. Do not invent embedded live maps or moving couriers.
5. Refund request entry and status only when supported by real eligibility/policy/API. If not decided, explain unavailable state and raise a spec blocker rather than generating arbitrary rules.
6. Store rating/written feedback entry only after **delivered** order and verification as backend allows; prevent duplicate/ineligible submissions with server authority. Photos only if explicitly supported.
7. Update information forms with validation and optimistic behavior only where safe; explicit feedback for failed requests.

**Test:** unauthorized customer route, expired session recovery, empty history, filtered orders, delivered vs pending review eligibility, refund policy availability, payment pending/failed states, keyboard accessibility.



---

<!-- Source: prompts/08_SUPPLIER_WORKSPACE.md -->

# Phase 08 — Supplier Workspace Shell, Onboarding, Profile and Overview

Build a dedicated **merchant productivity interface**, not a copy of the editorial homepage. Use the same five brand colors, typography tokens and small premium details, with compact accessible tables and forms.

- Sidebar navigation appropriate to supplier role: Overview, Products, Inventory, Orders, Sales, Store Profile, Settings only if supported. Mobile navigation drawer and topbar account/action menu.
- Supplier pending/approved/rejected/disabled access states from actual backend. An unapproved merchant cannot enter protected operational pages because a frontend menu is hidden; retain backend enforcement.
- One supplier → one store. **Do not add multi-store switcher**. Overview page identifies store and status; cards for actual orders/sales/low stock only when real data available, with date range meaning and reliable zero states.
- Practical work queue: actionable order statuses and products needing attention, derived from API data; avoid invented statistics or decorative chart numbers.
- Store profile editor: store identity, description, logo/cover imagery, location, contact, store categories, delivery/pickup settings if backend supports; use forms with Zod validation and safe unsaved-changes behavior.
- Onboarding/registration screen according to confirmed approval workflow and current required data; do not fabricate legal fields or automatic approval behavior.
- Responsive operational UI: desktop content ~full width of shell, logical tab order, dialogs with robust focus, mobile cards for dense data where needed.

**Definition of done:** supplier shell and core profile/overview work with real auth/data, one-store invariant honored, good mobile usability, role access verified and no fabricated KPIs.



---

<!-- Source: prompts/09_SUPPLIER_CATALOG.md -->

# Phase 09 — Supplier Products, Variant Inventory and Flora Image Processing

Implement operational product management, not a static mock catalogue.

## Catalog list and editing
- Products table with thumbnail, name, status, price/price range, variant count, stock indicator and approved actions; responsive filters/search/sorting/pagination only as supported.
- Product create/edit layout with well-grouped sections: basic content, media, options/variants, price, availability/locations. Use typed form validation, dirty-state confirmation and safe save error handling. Products have **no product categories**.
- Variant builder for supported size/color/wrapping/add-on dimensions. Avoid combinatorial UI overload: group option types logically, generate or edit only valid variant combinations according to backend model. Show pricing and identifiers with clear distinction between an option and a sellable SKU.
- Inventory matrix by sellable variant × store location, with stock/available values and server-side validation. No optimistic stock changes without rollback and no editing for unauthorized supplier/location.

## Background removal lifecycle
- Authorized supplier or admin uploads image; integrate only via existing backend-signed upload endpoints for original to S3.
- Show original preview, uploading state, server-queued/processing n8n workflow state, processed preview, failure message and allowed retry/remove actions if supported.
- Fetch processed image via backend-authorized asset URLs or approved public assets. Never call n8n endpoints with secrets from the browser, never expose S3 credentials.
- If API only supports final URLs, build honest intermediate states from what's available; **do not fake progress percentages or job status**.
- Use good file-type/size constraints derived from actual backend, preview cleanup and screen reader announcements.

**Tests:** create/edit validation, variant selection and stock location correctness, upload failure/retry, pending processed image, 403 authorization, empty products and narrow mobile screens.



---

<!-- Source: prompts/10_SUPPLIER_ORDERS.md -->

# Phase 10 — Supplier Orders, Fulfilment and Sales Operations

Redesign merchant operations with clear actionable hierarchy; preserve backend-defined state machine.

- Orders list: useful status/date/customer/order ID filters, total, fulfilment method, actual store order only, pagination and sort according to API, small status chips with text and color.
- Order detail: clear heading/order metadata, items/variants/add-ons, fulfilment choice (delivery vs pickup), delivery address or store pickup instructions, order/payment statuses, linked timeline events, price breakdown.
- Allowed order actions only according to actual server-permitted transitions; ask confirmation for irreversible actions; show audit/status feedback; prevent double updates; gracefully handle `409 conflict` and stale versions.
- Uber Connect/PickMe Flash booking and shipping status **only when official backend integration exists and grants actual capabilities**. Do not fabricate shipping partner pricing, driver coordinates or delivery completion. When provider URL is supplied and permitted, show honest "Track with provider" link rather than invent an in-app map.
- Pickup workflow: order preparation → ready for pickup → collection/delivered, only if actual status transitions support it. Do not claim a customer collected an order without authoritative event.
- Sales overview with date range, revenue/orders and low-stock summary **only from real aggregation**. If only raw orders available, derive clearly and accurately with documented assumptions or request approved endpoint; no fictitious trend charts.
- Test role and store scoping, allowed/forbidden transitions, delivery vs pickup, cancelled/failed payments, empty queue, date-range behavior and mobile table/card transformation.

**Pass when:** suppliers can manage their own store's orders efficiently with no privilege escalation or made-up logistics data.



---

<!-- Source: prompts/11_ADMIN_CORE.md -->

# Phase 11 — Super Admin Shell, Overview, Stores, Suppliers, Users and Categories

Build an elegant, trustworthy **marketplace operations console**: compact sans-first navigation, crisp tables, careful permissions, muted botanical palette. No oversized flowers in operational tables.

- Responsive protected `/admin` shell, sidebar sections grouped by task, consistent page header/breadcrumb, topbar profile and notification indicator only if backend supports notifications.
- Overview with real total stores/suppliers, customers, orders and payments if accessible; date filters and trend charts only if aggregate data exists. Show backend-loading, empty and error states. Avoid fabricated KPIs.
- Supplier approval queue: registration details, actual application state, clear approve/reject confirmation and reason if backend requires; show request outcomes and conflict/stale update handling.
- Store directory and status management, filters by category/location/status if supported, link from store to supplier profile. Enforce one-store-per-supplier assumption.
- Users/customer list with minimum authorized personal data and role/status controls only if current backend grants. No displayed PII beyond operational need; never include unimplemented impersonation controls.
- Shop category manager: name, description and category-to-store association if API supports. **Do not create product categories**. Surface any existing backend discrepancy as a blocker.
- Table component quality: real column sorting/filtering/pagination, good density, selection only for meaningful bulk actions, accessible row action menus and proper skeleton/empty/error states.
- Audit metadata for approvals/changes if backend supplies it; do not fake recorded histories.

**Acceptance:** real role authorization, correct data ownership, functional actions, no missing server responses hidden by mock state, responsive dashboards and tests covering approvals and 403/409 cases.



---

<!-- Source: prompts/12_ADMIN_OPERATIONS.md -->

# Phase 12 — Super Admin Orders, Payment/Refund Oversight and Feedback

Complete the approved marketplace-wide operations suite with consistent shared admin table/form components.

- Cross-store order list and detail: filters by store, date, status and payment state as current API supports; show consistent linkages to customer/store/payment. No fake cross-store combined order.
- Payment oversight: gateway/status and transaction ID, order association, refunds where supported; clear pending/success/failed/refunded; data originates from backend. Never put gateway secrets in UI or trust return URL as payment confirmation.
- Refund queue: review requests, reason, status and allowed approve/reject/mark-processed actions **only according to confirmed policy, permissions and backend transitions**. If policy is unresolved, do not show arbitrary refund eligibility/clickable approval actions.
- Feedback moderation: delivered-order store reviews/ratings, reported content when supported, safe text rendering, approve/hide/remove or equivalent only if authorized API supports; confirmations and moderation reason where required.
- Image processing oversight where server supports it: original upload, queued/processing/completed/failed and processed URL for authorized records. No direct S3 secret or n8n credential exposure.
- Operational quality: audit trails where available, clear optimistic/pessimistic mutation strategy, concurrency state, 403/404/409 handling, date range and filters preserved in URL, accessibly rendered tables and sheets.
- Unit/RTL tests for refund transitions and moderation, Playwright smoke for core operational path if infrastructure is present.

**Pass when:** every visible action calls a real permitted backend operation, money and fulfilment statuses are accurate, and exceptions remain recoverable and clearly visible.



---

<!-- Source: prompts/13_POLISH_ACCESSIBILITY.md -->

# Phase 13 — End-to-End Visual Polish, Accessibility and Performance

Audit every page created in Phases 01–12 at 360, 390, 768, 1024 and 1440px, plus 320px where reasonable. Work through mismatches and implement fixes.

1. Replace leftover legacy blue/terracotta CSS, duplicated components, ugly placeholder icons, inconsistent cards, orphaned page headings and visual spacing drift. Ensure luxury brand coherence without sacrificing admin density.
2. Inspect page-by-page screenshots (real browser when available). Confirm high-quality public composition, no crop/clipping, correct mobile image stacking, readable filters, stable sticky UI, no wide tables causing horizontal page overflow.
3. Audit color contrast with actual computed styles; known weak pairs are sage text on cream and gold text on cream. Use deep-green UI text or other validated semantic shades.
4. Keyboard and screen reader audit: heading/landmark hierarchy, all labels/errors, skip links, active tab selection, dialog focus return, drawer focus, alert status announcements, disabled semantics, product gallery keyboard behavior.
5. Review full UI state inventory: skeleton, no data, no results, 401, 403, 404, 409, 422, 500, offline/retry, pending/success/failed operations, sold out, unavailable fulfilment, payment pending and image processing failure.
6. Clean up images: licensed/owned assets, responsive srcset/sizes, explicit dimensions, lazy below fold, hero LCP priority, no broken URLs or layout shift.
7. Review public SEO: route titles, canonical, meta tags, crawlability under current Vite architecture, product structured data only if accurate; recommend SSR/SSG migration **only if genuine SEO requirements justify it**.
8. Check perf risk: initial payload size, route splitting, duplicated network calls, large images, long lists, expensive admin re-renders; optimize only with measured evidence.
9. Apply frontend security review: XSS risks, credentials, PII leaks, role-specific UI, signed URL handling, checkout integrity and token lifecycle.

**Deliver:** UX defect list with severity, fixed screenshots or documented exceptions, audits/results with actual tool logs, remaining risks with owners.



---

<!-- Source: prompts/14_VERIFICATION_RELEASE.md -->

# Phase 14 — Complete Verification, Release Readiness and Handoff

Perform a comprehensive review of the real redesigned project. Fix issues discovered rather than merely describing them when feasible.

## Full customer E2E
Explore homepage → browse stores by shop category → search/filter → store page → product selection (size/color/wrapping/add-ons) → add to cart → have items from two stores → checkout ONE store → select supported delivery/pickup → initiate PayHere → verify backend status → view order history/detail → leave feedback only on delivered order. Also cover out-of-stock, invalid address, no delivery availability, failed payment and abandoned checkout.

## Full supplier E2E
Register/onboard if supported → approval state → profile → create/edit product → variant and location stock → image original/processing/processed/failure → view incoming order → fulfilment/pickup status transition → sales view. Validate strict one-store authorization.

## Full admin E2E
Admin access → totals → supplier review/approval → store and categories → user restrictions → cross-store orders → payment and refund states → feedback moderation → media status if available. Verify 401/403/409 handling and sensitive data boundaries.

## Engineering gates
- Run actual lint, typecheck, Vitest/RTL, Playwright smoke and production build where set up. If any unavailable, mark unverified.
- Capture desktop/mobile screenshots for every important screen; compare to visual design system, not old UI.
- Check accessible focus/contrast/forms/tab order, responsive breakpoints, image alt, reduced-motion, semantic page titles.
- Use performance tooling (Lighthouse or browser traces if available), record measured LCP/INP/CLS vs targets. Do not claim green scores without measurement.
- Check README setup, env var names without secrets, deployment instructions (Vite SPA route fallbacks, cache handling), migration/rollback notes and feature flags.
- Scan project for TODO/dead CTAs/mock responses/fake dashboards/unapproved components and fix/remove or clearly document as incomplete.
- Produce `docs/ui-redesign/REDESIGN_HANDOFF.md` with screen inventory, changed files, integration matrix, unresolved policies/APIs, test evidence, screenshots inventory and known risks.

**Final response:** state what is actually complete and tested, what remains blocked, and whether this is visual prototype, integrated staging, or genuinely release ready. Do not use "production-ready" unless verified against the definition of done.

