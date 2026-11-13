# Product requirements and traceability

The source PDF is a **high-level feature document**, not a complete signed technical specification. IDs below are internal traceability identifiers, not client-authored IDs.

| ID | Actor | Frontend capability | Source |
|---|---|---|---|
| C-01 | Customer | Browse stores, store details, product discovery/search/sort | PDF p1 |
| C-02 | Customer | Cart and checkout, delivery or pickup choice | PDF pp1,2,4 |
| C-03 | Customer | Payment outcome, order tracking and history | PDF pp1,3 |
| C-04 | Customer | Store feedback after delivered order | PDF pp1,4 |
| S-01 | Supplier | Registration and store profile | PDF p1 |
| S-02 | Supplier | Product/variant/image and inventory management | PDF p1 |
| S-03 | Supplier | Incoming orders, fulfilment and sales overview | PDF pp1–2 |
| M-01 | Authorized admin | Original/processed flora images and processing state | PDF p2 |
| D-01 | Customer/Supplier | Uber Connect, PickMe Flash, store pickup options when available | PDF p2 |
| P-01 | Customer/Admin | Payment status and refund request/review UI | PDF p3 |
| A-01 | Super Admin | Dashboard, supplier/users/categories/orders/payment/refunds/moderation | PDF p3 |
| F-01 | Relevant roles | Agreed store-wise and order-wise sorting/filtering | PDF p4 |

## Explicitly excluded unless separately agreed
Loyalty, coupons/promotions, live driver tracking, supplier commission/payout automation, multi-currency and advanced analytics (PDF p5).

## Acceptance baseline
Owner clarification (2026-11-14): C-02 supports adding items from multiple stores to the cart and checking out each store separately, preserving other store groups. P-01 uses PayHere. D-01 uses PickMe and Uber Connect APIs through backend services. Detailed approval scope and remaining contract questions are in `OPEN_DECISIONS.md`.

Each approved screen: correct role shell, responsive and accessible behavior, loading/empty/error states, typed forms, validation, tests, no invented backend data. Business-rule-specific acceptance criteria remain pending `OPEN_DECISIONS.md`.
