# Phase 07 — Customer Auth, Account and Post-Purchase Experience

Reuse actual auth architecture, backend contracts and authorization. This is a UI/UX redesign, not a rewrite of login security.

1. Premium yet restrained account/auth screens; clear form labels, password visibility button, proper loading/lock states, links only for supported register/recover flows. Honor HttpOnly cookies, token refresh and CSRF strategy where present.
2. Customer account landing with personal details and compact side navigation; mobile accessible tabs/drawer; no fake loyalty dashboard.
3. Order history with real orders, search/filter if API supports, shop identity, order date, total, payment and fulfilment status, and empty state with explore CTA.
4. Order detail: items/variants/add-ons, supplier, order ID, timeline derived from actual backend events, delivery vs pickup details, payment status and delivery provider/tracking link **if supported**. Do not invent embedded live maps or moving couriers.
5. Refund request entry and status only when supported by real eligibility/policy/API. If not decided, explain unavailable state and raise a spec blocker rather than generating arbitrary rules.
6. Store rating/written feedback entry only after **delivered** order and verification as backend allows; prevent duplicate/ineligible submissions with server authority. Photos only if explicitly supported.
7. Update information forms with validation and optimistic behavior only where safe; explicit feedback for failed requests.

**Test:** unauthorized customer route, expired session recovery, empty history, filtered orders, delivered vs pending review eligibility, refund policy availability, payment pending/failed states, keyboard accessibility.
