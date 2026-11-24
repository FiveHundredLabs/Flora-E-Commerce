# Phase 12 — Super Admin Orders, Payment/Refund Oversight and Feedback

Complete the approved marketplace-wide operations suite with consistent shared admin table/form components.

- Cross-store order list and detail: filters by store, date, status and payment state as current API supports; show consistent linkages to customer/store/payment. No fake cross-store combined order.
- Payment oversight: gateway/status and transaction ID, order association, refunds where supported; clear pending/success/failed/refunded; data originates from backend. Never put gateway secrets in UI or trust return URL as payment confirmation.
- Refund queue: review requests, reason, status and allowed approve/reject/mark-processed actions **only according to confirmed policy, permissions and backend transitions**. If policy is unresolved, do not show arbitrary refund eligibility/clickable approval actions.
- Feedback moderation: delivered-order store reviews/ratings, reported content when supported, safe text rendering, approve/hide/remove or equivalent only if authorized API supports; confirmations and moderation reason where required.
- Image processing oversight where server supports it: original upload, queued/processing/completed/failed and processed URL for authorized records. No direct S3 secret or n8n credential exposure.
- Operational quality: audit trails where available, clear optimistic/pessimistic mutation strategy, concurrency state, 403/404/409 handling, date range and filters preserved in URL, accessibly rendered tables and sheets.
- Unit/RTL tests for refund transitions and moderation, Playwright smoke for core operational path if infrastructure is present.

**Pass when:** every visible action calls a real permitted backend operation, money and fulfilment statuses are accurate, and exceptions remain recoverable and clearly visible.
