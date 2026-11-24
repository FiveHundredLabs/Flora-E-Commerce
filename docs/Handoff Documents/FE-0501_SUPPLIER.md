# FE-0501 — Supplier mock slice

Date: 2026-11-16. Requirements: S-01 (registration/profile), S-02 (products/variants/inventory), S-03 (orders/fulfilment/sales). Dependency: FE-0402.

## Scope and unresolved contracts

This task adds an isolated, fictional supplier workspace. It does not approve OD-01 supplier publication/approval policy, OD-10 backend interfaces, OD-11 authentication/account mapping or OD-12 reporting/media behavior. No supplier account, public listing, provider booking, payment, stock reservation or sales transaction is created. Application text, profile, catalog, counts and notes are held only in memory and reset on a full refresh. The demo asks for fictional text and collects no passwords, email, phone, address or documents.

The sample application is separate from the existing fictional store profile: saving an application does not grant access or establish an approval status. The demo is intentionally available without authentication and exposes no real private data. Production authentication, CSRF, supplier ownership/isolation and server authorization remain blocked on approved contracts.

## Frontend routes

| Route | Sample behavior |
|---|---|
| `/supplier` | Store summary, product/order counts, explanation dialog |
| `/supplier/register` | Save a fictional application; no account creation or approval request |
| `/supplier/profile` | Edit the existing fictional store name/description |
| `/supplier/products` | List sample products and link to creation/editing |
| `/supplier/products/new` | Create an unpublished in-memory product |
| `/supplier/products/:productId` | Edit/remove a sample product; add/edit/remove its variants |
| `/supplier/inventory` | Edit per-variant sample counts |
| `/supplier/orders` | Read fictional incoming order lines and record capability-gated fulfilment notes |
| `/supplier/sales` | Basic sample order/unit counts, with no monetary totals |

These are browser routes only, not HTTP endpoints or schema-derived DTOs. Unknown product references receive a missing-record recovery link. Unknown supplier paths continue to use the existing not-found screen and supplier shell. Admin remains a layout preview.

## Implementation and state

`features/supplier/index.ts` exposes the screen and screen type to `pages/SupplierPage.tsx`; app composition selects the route. Supplier navigation is added to the existing shared shell. Discovery and customer commerce remain independent: supplier demo edits do not publish into their fixtures, change historical customer orders or grant customer access.

The feature contains local Zod models, an injectable mock adapter, Query hooks, forms/screens and scoped CSS. Query owns workspace reads and mutation results; transient fields, errors and dialogs remain local. No Redux state, new dependency, browser storage or architecture change is needed. A workspace-level revision rejects stale writes atomically, including competing stock edits. Mutation retry is false, forms guard duplicate submission, and safe errors retain entered inputs. Successful writes cancel older reads and keep a newer cached revision from being overwritten by a late acknowledgement. Returned snapshots are validated and must acknowledge the next revision. This local adapter protocol is not an approved backend API.

Sample entity IDs are opaque stable references within one fixture workspace. Duplicate product/order IDs and duplicate variant IDs within a product are rejected. The mock service validates commands and mock capabilities, returns detached snapshots and honors read cancellation. Product edits/removal do not rewrite historical order-line names. Stock changes do not alter order quantities. Removal requires an explicit confirmation dialog.

Provisional UX bounds: names 1–100 characters; descriptions and notes up to 1,000 characters; stock whole counts 0–9,999. These prevent unusable demo inputs and do not settle business limits, SKU rules, variant attributes or inventory/reservation policy. Variants use sample names/counts only. No prices/currency are guessed.

Order records expose a fixture capability for recording a note. Notes do not establish an order-state transition, mark delivery, charge/refund money or invoke PickMe/Uber Connect. Sales shows only fixture order/unit counts, explicitly including no claim of paid sales. Revenue, refunds, payouts, advanced analytics and reporting periods remain unavailable pending authoritative contracts. Image upload/processing is explicitly unavailable until media/storage contracts are approved; M-01 is not implemented here.

## Accessibility and review

Shared fields provide labels, required semantics, descriptions and error associations. Invalid submissions focus the first invalid field; async states use shared status/error/retry/permission presentations. Save controls expose busy/disabled state. Saved confirmations clear when forms are edited. Focus recovery after completion applies only when focus has fallen to the document body. Confirmed variant removal restores main focus; route navigation uses the existing main focus/title handling. Native dialog supplies modal containment and Escape/Close recovery.

Baseline tests cover service isolation, registration/profile separation, product/variant CRUD, zero stock and stale edits, invalid counts/references, capability/access denial, immutable reads, duplicate IDs and cancellation. Component tests cover profile validation/save/failure/double-submit/non-retry, read recovery, denied/missing states, malformed acknowledgements, stock changes, note gating, variant creation and empty products/inventory/orders/sales. Browser coverage exercises complete application/profile, catalog/variant/inventory/removal and note/sales journeys, plus responsive axe/overflow checks for all supplier screens and missing records.

Source review introduces no live network requests, secrets, customer PII, credentials, HTML injection, persistence, financial/provider behavior or cross-feature deep imports. Client capability checks are presentation plus mock validation, not production authorization. Dependencies are unchanged; the previous development-tool advisories/support risks and Zod build warnings remain tracked. No fresh dependency audit or clean install is claimed.

## Validation

- PASS: `npm run typecheck`, `npm run lint` and `npm run test -- --run` after the focus correction: 15 files / 105 tests (20 new supplier cases). The initial combined gate also passed `npm run build`; subsequent targeted/final browser runs build the production app through the same build script. Existing Zod annotation warnings remain non-fatal.
- PASS: final `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: all 89 Chrome tests, including 21 new supplier tests. The first full run passed 87 of 89 and exposed a variant-removal focus bug plus an obsolete supplier-preview label assertion. The focus effect now runs after the removed dialog's cleanup releases the inert background; the label assertion now checks the correct audience label. Both targeted regressions passed before the final full suite.
- PASS: supplier axe WCAG A/AA scans reported zero violations and overflow assertions passed at 320/1440px; 320px checks emulate forced colors and reduced motion. Product-editor and inventory screenshots at both widths were inspected for wrapping, labels, controls and clipping. Existing shell tests also retain enlarged-text/keyboard/modal coverage. This does not establish manual screen-reader speech or native browser zoom coverage for every supplier form.
- PASS: scoped source/diff review and `git diff --check`.
- Local Chrome/preview runs required sandbox escalation. The first automatic permission review timed out before execution; the permitted retry started successfully. No application operation was rejected as unsafe.

FE-0501 is complete within mock supplier scope. Subsequent hardening and validation are recorded in `FE-0502_SUPPLIER_REVIEW.md`; the evidence above records the original FE-0501 checks. Manual screen-reader speech, non-Chrome engines and native OS high-contrast behavior remain release follow-ups. No hosted CI, deployment or live supplier readiness is claimed.
