# Phase 06 — Cart and checkout verification

Updated 2026-11-22. Phase 06 advances requirements **C-02**, **C-03** and **D-01**, subject to open decisions **OD-02**, **OD-04** and **OD-05**.

## Delivered scope

- `/cart` now presents local Redux cart lines in accessible supplier-separated groups with a whole-cart item/store count, accurate product ownership, quantity decrement/increment/update, removal, and one “Checkout this store” action per group.
- Each group states that other suppliers remain in the cart. The acknowledged one-store order consumes only the unchanged submitted lines for that supplier; concurrent edits and other supplier groups remain protected by the existing revision reconciliation.
- `/checkout?store=<slug>` now uses an editorial three-section review around the capabilities that actually exist: selected items, unavailable fulfilment, and unavailable payment. A persistent accessible summary names the exact supplier and lines.
- Pickup and delivery controls are disabled with contract-specific explanations. PickMe and Uber Connect are not selectable because no approved availability or quote API exists.
- Subtotal, fees, tax and final total are marked unavailable because the catalog has no verified price or currency fields. PayHere is identified as unconnected and no client amount or URL parameter is treated as payment proof.
- The existing in-memory sample-order mutation remains idempotent and protected against double submission, late acknowledgement and mismatched acknowledgement. Its internal pickup preference placeholder is disclosed as non-confirming.
- Empty, invalid-store, quantity-validation, removal, submitting, sanitized error and acknowledged states remain covered by the existing commerce boundaries.

## Contract limits

- Cart lines contain only product slug, store slug, quantity and an internal revision. Product fixtures provide no price, currency, stock, variant, add-on or media URL.
- There is no customer identity/profile, address, guest-checkout, supplier pickup location/instructions, delivery availability/quote, tax, PayHere intent/callback or backend receipt contract.
- Consequently, stale server price/stock rollback, verified totals, address validation, fulfilment booking, payment retry/cancel and backend-confirmed payment states cannot be implemented truthfully. No endpoint or working-looking substitute was invented.
- The sample order and receipt are session-memory demonstrations only and reset on refresh.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test -- --run`: passed, 23 files / 210 tests. The focused commerce suite passed 23/23.
- `npm run build`: passed. Existing third-party Zod annotation notices and the 607.05 kB chunk-size warning remain.
- Chrome Playwright/axe matrix: 31/32 passed on the first executable run; the sole failure was a stale receipt wording assertion. After correction, the critical multi-store flow passed, yielding 32/32 verified scenarios across the combined run/rerun.
- Responsive routes were checked at 320, 360, 390, 768, 1024 and 1440 px with no reported WCAG A/AA axe violations or horizontal overflow.
- Full-page desktop filled-cart and 375 px filled-checkout captures were visually reviewed. Supplier separation, focus-safe controls, summary prominence and unavailable states were legible without clipping.
- The first browser attempt could not launch because Playwright’s bundled Chromium was absent. The suite was rerun against the installed Google Chrome; this is an environment limitation, not a passing claim for the failed attempt.

## Readiness

Phase 07 can redesign wishlist and customer order views around the existing local wishlist and sample-order contracts. Live checkout remains blocked on approved catalog pricing/inventory, identity/address, fulfilment quote, tax, payment-intent/callback and persistent order APIs.
