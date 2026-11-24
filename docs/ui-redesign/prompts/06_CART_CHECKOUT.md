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
