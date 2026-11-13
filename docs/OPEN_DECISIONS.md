# Open decisions — DO NOT GUESS

Status: **partially resolved by project-owner confirmation on 2026-11-14**. Confirmed choices are recorded below; other decisions remain open.

## Owner-confirmed decisions — 2026-11-14

Decision maker: project owner (user), through this project's conversation. Approval applies to the specific choices below, not every earlier proposal.

- **OD-02 — resolved business behavior (C-02, C-03, S-03):** Customers may accumulate items from multiple stores in the cart. Checkout operates separately for each store. Moving to another store must not replace or discard existing cart items. A checkout includes only the selected store's items; unrelated store groups remain available for later checkout. There is no combined multi-store checkout requiring automatic order splitting. Backend order creation, payment reconciliation and cart-update contracts remain pending.
- **OD-05 — gateway selection resolved (P-01, C-02, C-03):** PayHere is approved. Currency, payment methods, hosted/embedded flow, merchant access, sandbox configuration, callbacks and refund capabilities remain to be specified.
- **OD-04 — provider selection and API approach resolved (D-01):** PickMe and Uber Connect are approved delivery providers, integrated through backend-controlled APIs. This approval does not establish API access, supported operations or service coverage. Confirm the exact PickMe product (the original brief names PickMe Flash), agreements, API documentation and sandbox access before wiring live delivery.
- **OD-03 — partially resolved (D-01, C-02):** Providers are selected as above. Fees, availability, regions and whether customers select a provider remain open.

Acceptance examples for OD-02: add items from stores A and B and see both groups; start checkout for A with no B items in its summary; completing A must preserve B's items. Failed/cancelled payments must not accidentally clear another store's items. Payment states and retry semantics still follow the approved backend contract.

Concrete starting proposals, accountable owners and required evidence for all 13 decisions are in `PRIORITY_REMEDIATION.md`. They support review and do not constitute signoff.

| ID | Question | Affects |
|---|---|---|
| OD-01 | Can suppliers publish immediately or require approval? | Product UI, permissions |
| OD-02 | RESOLVED: multi-store cart, separate checkout per store; backend operation contracts pending | Cart, checkout, orders |
| OD-03 | Delivery fee rules, provider selection and serviceable regions? | Checkout |
| OD-04 | PARTIAL: PickMe and Uber Connect APIs selected; exact PickMe product, access and operations pending | Delivery |
| OD-05 | PARTIAL: PayHere selected; currencies, supported methods and redirect/embedded flow pending | Payment |
| OD-06 | Refund eligibility, partial refunds, cancellation, timing and charge responsibility? | Refunds |
| OD-07 | Required search/sort/filter fields? | Catalog and tables |
| OD-08 | Feedback format, verified order criteria and moderation rules? | Reviews |
| OD-09 | Approved visual palette, business name, logo and categories? | Design |
| OD-10 | Backend base URL, endpoint schemas, pagination, error format and auth contract? | API layer |
| OD-11 | Login/registration, session refresh, CSRF, roles and supplier account mapping? | Auth |
| OD-12 | Notifications, reporting, image processing failure/retry UX? | Dashboards/media |
| OD-13 | Hosting target and environment configuration? | Deployment |

## Decision record template
ID; proposed options; chosen option; decision maker; approval date; rationale; affected requirements; implementation changes.

Until resolved: use documented neutral UI states or clearly labeled mocks; never claim integrations are live.
