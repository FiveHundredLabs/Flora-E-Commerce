# FE-0401 — Customer commerce mock slice

Date: 2026-11-15. Requirements: C-02 (cart/checkout), C-03 (orders/payment presentation), C-04 (post-delivery feedback), D-01 (fulfilment choices), P-01 (payment status UI). Dependency: validated FE-0302.

## Scope and approvals

Owner-approved OD-02 is implemented: customers accumulate references from multiple stores and check out one store at a time. PayHere, PickMe and Uber Connect selections are reflected in the UI. Provider access, fees, service coverage, payment methods/currency, refund/cancellation rules, review format/moderation and backend/auth contracts remain unresolved. No live integration, price, total, inventory guarantee or real order is claimed.

The entire flow is labeled Sample commerce / MOCK. Cart, orders and feedback are held in memory and reset on a full refresh. A delivered-order fixture supports review presentation; it contains no real customer, payment or delivery data. No credentials, contact/address PII or browser persistence were added.

## Routes and composition

| Frontend route | Behavior |
|---|---|
| Product detail | Page-injected Add to sample cart control |
| `/cart` | Per-store groups, quantity validation, removal and independent checkout links |
| `/checkout?store=…` | Selected store only; sample pickup/delivery/provider preference and order creation |
| `/account/orders` | In-memory sample order history and payment presentation |
| `/account/orders/:orderId` | Sample receipt, fulfilment intent, payment availability/status and feedback eligibility |

These are browser routes, not HTTP API endpoints. `pages/` composes public discovery/commerce interfaces: commerce receives a minimal catalog projection; discovery accepts an optional product-action renderer. Neither feature imports the other's internals. Unknown/duplicate store parameters and missing records show recovery states.

## State and dependency decision

Added Redux Toolkit 2.x and react-redux 9.x, as specified by the architecture for real cross-feature client state. The lockfile pins the installed graph. Redux owns only product/store references, quantities and client revision counters. Catalog metadata and order/feedback entities remain in Query/service state. Local fields and disclosure state stay in components. `CartProvider` wraps the application and creates a store per application instance.

The mock quantity range 1–99 and feedback limit of 1,000 characters are provisional UI bounds, not approved business/stock rules. Zod validates references, snapshots, selected preferences, mutation inputs and returned records. Samples with unavailable catalog references cannot proceed to checkout.

## Mutation and cart safety

- A snapshot contains one store only. Other store groups remain untouched.
- Cart lines have monotonic client revisions. Successful acknowledgement removes only submitted lines whose revision and quantity are unchanged. Edits or remove/re-add operations during submission are conservatively retained for review, rather than silently discarded. This mock behavior does not settle real backend reconciliation rules.
- Local submission guards and disabled/busy buttons prevent double submission. Mutation retry is explicitly false.
- The in-memory service deduplicates repeated request keys and rejects the same key with different content. Keys are derived from sample cart snapshots/preferences; no real backend idempotency contract is inferred.
- Returned receipts must match the selected store, submitted items and preference before consuming cart intent. Failed/malformed/mismatched responses keep the cart. Commit reconciliation occurs in the hook-level success handler; navigation occurs only while the submitting screen remains mounted.
- Reads honor AbortSignal. Empty/loading/error/retry states use shared accessible components. A newly created order absent from a still-refreshing cache is not prematurely marked missing.

## Fulfilment, payment and feedback boundaries

Pickup/delivery and provider choices are sample preferences only. No quote, address collection, booking, availability check or pickup arrangement exists. Changing a valid provider clears its obsolete validation error.

New sample orders have no payment status: PayHere is explicitly not connected and no payment has been requested. Only the client PDF p3 example labels (pending/successful/failed/refunded) are accepted for illustrative fixtures; these are not PayHere API mappings or approved payment transitions. The delivered fixture uses successful as an example. URL parameters never establish payment success. Refund/cancellation UI and payment submission remain blocked pending contracts.

The service fixture supplies review capability, and feedback is allowed only for a delivered capability-enabled sample order. The demo supports text-only feedback saved in memory, never published; it does not approve ratings, photos, editing policy or moderation. New sample orders are not review-enabled. Backend authorization and verified-delivery enforcement remain required before real use.

## Tests and review

Unit/component coverage includes multi-store grouping, quantity bounds, changed snapshots, store isolation, preference validation, idempotent mock commands, failed-write non-retry, double-click protection, mismatched acknowledgement preservation, invalid checkout recovery, order read failures/empty history and delivered feedback validation. Existing discovery/design-system tests remain enabled.

Browser journeys add products from two stores, check out one with a delivery preference, verify payment remains disconnected, confirm the other store stays in the cart, and validate/save/revisit sample feedback. Responsive axe/overflow checks cover cart, invalid checkout, history, delivered order and missing order at 375/1440px. The valid checkout also receives axe and mobile visual review. Screenshots of the grouped cart and mobile checkout were inspected for wrapping, labels and clipping; full-page captures normalize scroll position to avoid offscreen fixed-element artifacts.

No manual NVDA/VoiceOver, non-Chrome or native OS high-contrast testing is claimed. Existing development-only advisories and Zod build-annotation warnings remain tracked. Live business behavior, auth and provider contracts are not approved by this implementation.

## Validation

- PASS: clean offline lockfile install with npm 11 (`npx --offline --cache /tmp/flower-flora-npm-cache npm@11 ci --offline --cache /tmp/flower-flora-npm-cache --no-audit`), 316 packages. Elevated execution was needed for install-script validation.
- PASS: final `npm run typecheck && npm run lint && npm run test -- --run && npm run build`: twelve files / 72 unit/component tests. JS 447.27 kB (139.00 kB gzip); CSS 10.62 kB (2.64 kB gzip).
- PASS: full `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: 64 browser tests. Following the final provider-error correction, `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- commerce.spec.ts` passed all 12 commerce tests. Browser/preview runs required sandbox escalation; builds and E2E were sequential.
- PASS: production dependency audit (`npm audit --omit=dev`): zero vulnerabilities after the dependency additions. Existing development-tool advisory/support risks remain tracked; no new full dev audit is claimed.
- PASS: responsive axe/overflow checks, grouped-cart/mobile-checkout screenshot inspection and `git diff --check`.

FE-0401 is complete as an in-memory mock commerce slice. FE-0402 and supplier implementation have not started; no hosted CI/deployment or live provider readiness is claimed.
