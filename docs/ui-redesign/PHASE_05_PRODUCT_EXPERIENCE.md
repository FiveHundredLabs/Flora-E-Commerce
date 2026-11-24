# Phase 05 — Product experience verification

Updated 2026-11-22. Phase 05 advances requirement **C-01** within the repository's validated fixture and local-cart contracts.

## Delivered scope

- `/products/:slug` now uses a responsive Botanical Editorial product composition with shop→product breadcrumbs, a prominent visual stage, product copy, supplier identity and same-store related products.
- The only available visual is presented as a generic botanical illustration placeholder. No gallery, thumbnail duplication, modal zoom or supplier-media claim was invented.
- Price and availability are explicitly unavailable. Variants, SKU, wrapping, add-ons, inventory, delivery and pickup settings are visibly identified as awaiting a verified contract; no fake selector or total is rendered.
- A bounded sample quantity drives the existing local Redux cart action. The resulting line retains exactly the validated `{storeSlug, productSlug}` ownership and quantity; it does not imply stock reservation or a sale.
- The primary action adds to the sample cart and the secondary action returns to the owning shop. Direct checkout remains available elsewhere in the existing workflow but is intentionally omitted from the product summary.
- Related items are selected only from the current product's owning store.
- Loading, retry, malformed-data, refresh, missing-product and empty-related states remain handled by the Phase 04 TanStack Query boundary.

## Contract limits

- Product records contain only `slug`, `storeSlug`, `name` and `description`.
- Cart lines contain `productSlug`, `storeSlug`, `quantity` and an internal revision. There is no server add-to-cart mutation or rejection contract.
- Because no variant, inventory, media, price, currency, add-on or fulfilment data exists, selector validation, dynamic pricing, stock disabling and server rejection UI cannot truthfully be implemented. These remain blocked rather than simulated.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test -- --run`: passed, 23 files / 210 tests.
- `npm run build`: passed; existing Zod annotation and large-chunk warnings remain.
- Focused Chrome regression run: 22/29 passed initially; all seven Phase 05 failures were corrected test assumptions. The Phase 05 suite then passed its six-width axe/overflow matrix (320, 360, 390, 768, 1024 and 1440 px), related-item, missing-product and cart-reference checks across focused reruns.
- Full-page 360 px and 1440 px captures were visually inspected. A supplier-panel heading contrast issue found during visual review was corrected before the final gate.

## Readiness

Phase 06 can redesign cart and checkout around the existing store-grouped sample workflow. Live selling behavior remains blocked on approved catalog, inventory, pricing, fulfilment, cart-mutation and error contracts.
