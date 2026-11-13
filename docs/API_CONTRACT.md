# API contract workflow

**No backend API specification was provided.** PostgreSQL table names and enum values do not establish REST URLs, JSON shapes, or authentication semantics.

See `PRIORITY_REMEDIATION.md` for the auth review specification, schema-to-capability boundary and decision ownership. An OpenAPI file with guessed paths would violate AGENTS.md; the backend owner must provide or approve operation paths first.

## Contract handoff acceptance

For each operation, provide requirement ID, approved method/path, role and ownership rules, request/response examples, Zod-compatible field constraints, success/error statuses and test fixtures. Define money representation/currency, timestamp timezone, opaque IDs, nullability, stable sort order, page limits and cursor/offset semantics. Writes need concurrency/idempotency behavior; payment operations require backend reconciliation rather than redirect-based success. Record contract version and backend owner approval. Validate the supplied OpenAPI and generate types before enabling live adapters. Require negative tests for malformed payloads, expired auth, forbidden access and tenant isolation.

Before implementation of a live integration, approve OpenAPI 3.x with:
- Auth/login/logout/refresh/current-user and CSRF policy.
- Store/product/category search and pagination contract.
- Cart, checkout, order, payment and refund idempotency rules.
- Supplier catalog, inventory, fulfilment and admin moderation APIs.
- Media upload initiation, processing status and final image URLs.
- Common error envelope, validation errors, pagination, sorting, timestamps, monetary representation and rate limits.

Use generated types from approved OpenAPI when available. Until then isolate fixtures behind `features/*/api/` adapters; label them `MOCK` and do not call them production endpoints.

## Security requirements
Owner-confirmed scope (2026-11-14): checkout must operate on one selected store while preserving other cart groups. Specify store ownership validation, server-calculated totals, idempotent order/payment creation and reconciliation before clearing purchased items. PayHere is the selected gateway; PickMe and Uber Connect are the delivery providers. Obtain their approved backend integration contracts without inferring browser endpoints or provider API access from this selection.

Payment provider secrets and signing operations remain server-side; client never assumes an order is paid based solely on redirect query parameters.
