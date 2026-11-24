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
