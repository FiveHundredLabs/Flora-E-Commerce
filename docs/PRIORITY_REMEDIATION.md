# Priority remediation — 2026-11-14

Update 2026-11-15: FE-0101 installation and validation blockers recorded below are historical and have been resolved. See `FE-0101_FOUNDATION.md` for the successful clean npm 11 install, quality checks and browser evidence. Business/API decisions remain governed by OPEN_DECISIONS.

Scope: FE-0101 foundation; contract readiness for C-01–C-04, S-01–S-03, M-01, D-01, P-01, A-01, F-01. No business decision is approved by this document.

## Findings and implementation

The absent application was intentional in the starter pack. A minimal React 19/Vite foundation now provides routing, a Query provider, strict TypeScript, ESLint, component tests and a Playwright smoke scenario. Root scripts delegate to the frontend workspace. Redux is deferred until shared client state exists. No backend calls or credential storage are introduced. Acceptance: install reproducibly from a lockfile and pass typecheck, lint, tests and production build; browser validation is reported separately.

The other three findings are related: a data model cannot establish a transport contract, and a transport contract cannot settle unresolved commercial rules. The following decision package supplies concrete proposals and identifies the evidence needed to close each gap. No live API can safely be implemented solely from these files.

## Decision package

Owner confirmations on 2026-11-14 supersede the OD-02/04/05 starting proposals as recorded below and in OPEN_DECISIONS. All other rows remain proposals.

| ID | Suggested starting point | Owner and evidence required |
|---|---|---|
| OD-01 | Require approval before publication; expose backend eligibility | Product owner: approve publication lifecycle and rejected/resubmitted handling |
| OD-02 | APPROVED: multi-store cart; checkout one store at a time; preserve other stores' items | Backend: store-scoped checkout and reconciliation contracts |
| OD-03 | Backend quotes eligible options and price; no browser fee calculations | Operations/backend: regions, fee schedule, quote expiry, unavailable-provider fallback |
| OD-04 | APPROVED selection: PickMe and Uber Connect via backend APIs | Operations: exact PickMe product, provider agreement, sandbox access, supported booking/cancel/status operations |
| OD-05 | APPROVED selection: PayHere; flow remains undecided | Product/backend: merchant eligibility, currency, methods, sandbox and callback contract |
| OD-06 | Disable refund submission until eligibility is returned by backend | Product/operations: cancellation cutoff, partial refunds, fees, approval and processing responsibilities |
| OD-07 | Start with store name/category/location; orders date/status/store/payment status | Product/backend: exact searchable fields, sort keys, default ordering and pagination |
| OD-08 | Verified delivered-order feedback, text/rating proposal, reporting/moderation | Product: rating scale, repeat-review rules, photos, visibility and moderation policy |
| OD-09 | Neutral configurable styling until palette is selected | Product: approve one of three palettes, logo, displayed name and category list |
| OD-10 | Approved versioned OpenAPI as transport source of truth | Backend: supply URL, operation paths, schemas, errors and test environment; checklist in API_CONTRACT |
| OD-11 | Same-origin backend cookie session with server CSRF verification | Backend/security: session lifetime, login/registration flows, role/store mapping and failure semantics |
| OD-12 | Explicit processing status and manual retry only when backend permits | Product/backend: notification channels, report scope, job lifecycle and retry permission |
| OD-13 | Static SPA hosting with history fallback, subject to SEO review | Product/DevOps: host, public SEO requirements, domain/origins, headers and rollback |

## Auth review specification

This defines proposed security requirements, not existing endpoints. The backend owner must supply paths and payload schemas for login, registration, logout, current identity and any refresh operation. Prefer a same-origin session cookie with HttpOnly, Secure, Path=/ and appropriate SameSite; use a __Host- cookie where deployment permits. Session lifetime, renewal and invalidation remain backend-owned. Do not add speculative refresh logic.

For state-changing requests, backend verifies a session-bound CSRF token and exact trusted Origin; SameSite is defense in depth. Reject missing/invalid tokens, avoid state-changing GETs, and use explicit credentialed CORS allowlists only if cross-origin deployment is approved. Keep tokens out of logs and URLs. Login/logout also require an agreed CSRF design. Rotate sessions after authentication/privilege changes; invalidate on logout. Frontend handles unauthenticated and forbidden states distinctly and never treats its navigation controls as authorization.

Contract acceptance tests: unauthenticated identity; expired session; logout invalidation; missing/invalid CSRF; forbidden role; cross-supplier resource access; untrusted origin; failed login rate limit; no sensitive fields in identity responses. Backend integration remains blocked until these can be exercised against the approved implementation.

## Data model to contract boundary

| Schema group | Required frontend capability | Never expose by default |
|---|---|---|
| users/roles/stores | Current identity and permitted store context | Password hashes, refresh tokens, login history |
| products/variants/images/inventory | Public catalog projection and authorized catalog editing | Internal inventory ledger or unrestricted writes |
| carts/orders/order items | Server-priced cart and order summary | Client-controlled totals, ownership or status changes |
| payments/refunds/deliveries | Safe outcomes and available actions from backend | Gateway secrets, webhook bodies, provider requests |
| media/jobs/reviews/notifications | Authorized media status, feedback, agreed notifications | Storage credentials, internal worker payloads |
| audit/permission joins | Backend enforcement | Direct browser table access or raw audit exports |

The presence of wishlists, notification queues or audit tables does not approve additional UI scope. DB enums are not automatically public status enums. Monetary values, IDs, timestamps, nullable fields, image URLs and pagination must be defined in API DTOs before runtime schemas are generated.

## Research references

## Validation record

- Runtime dependencies downloaded successfully initially.
- Development dependency installation encountered a socket timeout followed by npm internal `edgesOut` errors, including with npm 10. Installation is not validated.
- `npm run typecheck && npm run lint && npm run test -- --run && npm run build` attempted: typecheck failed because `tsc` was unavailable; subsequent commands did not run.
- Browser/E2E, accessibility and responsive checks have not run. The smoke scenarios are authored, not verified.
- Interrupted dependency files were moved to `/tmp/flower-flora-partial-node-modules-20261114` and `/tmp/flower-flora-runtime-only-package-lock-20261114.json` for recovery. Do not treat the runtime-only lockfile as a complete reproducible install.
- FE-0101 remains incomplete until dependency installation and all applicable checks succeed. No live API/auth implementation or business approval is claimed.

### Sources

- https://vite.dev/guide/ — supported Node versions; installed Node 22.22.1 satisfies the documented 22.12+ floor.
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html — CSRF token and origin verification; SameSite alone is not a general replacement.
- Local client PDF and DBML remain product/schema inputs; neither supplies operational API access or business approval.
