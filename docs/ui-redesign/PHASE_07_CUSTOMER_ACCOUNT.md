# Phase 07 — Customer experience verification

Updated 2026-11-22. Phase 07 advances requirements **C-03** and **C-04**, subject to open decisions **OD-06**, **OD-08**, **OD-10** and **OD-11**.

## Delivered scope

- `/wishlist` is now a responsive Botanical Editorial saved collection backed by the existing `localStorage` store. It explicitly identifies itself as guest, browser-local state rather than an account feature.
- The legacy fabricated `$38.00` price and “In Stock” label were removed. Product price, stock and options remain visibly unavailable. Add-to-sample-cart, remove, clear, empty and corrupt-storage recovery preserve existing behavior.
- `/account/orders` now presents Query-owned session records as an accessible order archive with supplier identity, reference, item count, fulfilment state and the fixture-provided payment example. It does not fabricate dates, totals, filters or customer identity.
- `/account/orders/:orderId` now separates supplier/items, fulfilment, payment, refund availability and feedback eligibility. Missing variants, add-ons, pricing, addresses, provider booking/tracking and event history are disclosed.
- Text feedback remains available only when both `delivered` and `canReview` are authoritative in the validated sample record. Zod validation, retained drafts, disabled write state, duplicate-submit protection, sanitized errors and Query invalidation remain unchanged.
- `/account` and `/account/settings` remain unregistered and resolve through the existing not-found route. A disabled “Profile unavailable” navigation label makes that boundary visible without inventing auth or personal data.

## Contract limits and blockers

- No login, registration, recovery, customer session, token refresh, CSRF, role guard, customer profile or settings contract exists. Unauthorized/expired-session recovery cannot be implemented or meaningfully tested until **OD-10/OD-11** are resolved.
- Orders provide no date, money, currency, variants, add-ons, address, fulfilment events or tracking URL. Search/filter has no supported fields and was not added.
- Refund eligibility, cancellation rules, partial refunds and PayHere refund operations are unresolved under **OD-06**; the detail screen explains that requests are unavailable.
- Feedback supports one provisional text field only. Ratings, photos, moderation and durable duplicate-submission authority remain blocked by **OD-08** and a persistent backend contract.
- All orders and feedback remain in-memory sample records that reset on refresh. Wishlist state is browser-local and is not synchronized to an account.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test -- --run`: passed, 23 files / 210 tests. Focused customer/commerce coverage passed 34/34.
- `npm run build`: passed. Existing third-party Zod annotation notices and the 610.44 kB large-chunk warning remain.
- Phase 07 Chrome suite: the four inherited commerce-review scenarios passed. The dedicated customer suite passed its delivered-order, unsupported-account and 18 route/width checks; its wishlist interaction passed after correctly closing the modal cart drawer. Combined verified result: 25 scenarios.
- Axe and horizontal-overflow checks passed at 320, 360, 390, 768, 1024 and 1440 px for wishlist, order history and delivered order detail.
- A first browser attempt revealed a nested `main` landmark and a test trying to interact behind the open modal cart drawer. The landmark was corrected and the test now closes the drawer through its accessible control before continuing.
- Full-page 320 px order-detail and 1440 px order-history/wishlist captures were visually reviewed. Content remained legible, controls unobscured and disclosures prominent.

## Readiness

Phase 08 can redesign supplier onboarding and profile screens around the existing fictional supplier capabilities. Live customer account work remains blocked on approved auth/session, customer profile, persistent order, refund and feedback contracts.
