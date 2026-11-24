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
