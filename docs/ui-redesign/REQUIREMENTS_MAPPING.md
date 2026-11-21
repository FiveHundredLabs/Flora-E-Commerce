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
