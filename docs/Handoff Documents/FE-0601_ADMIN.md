# FE-0601 — Super-admin mock slice

Date: 2026-11-16. Requirements: A-01 (supplier/user/category management and oversight), P-01 (refund/payment presentation), C-04 (feedback oversight). Dependency: FE-0502.

## Scope and contract boundaries

This task adds an isolated, fictional admin workspace. Supplier approval/publication (OD-01), refund eligibility/decisions/gateway operations (OD-05/OD-06), moderation/verification (OD-08), taxonomy/branding (OD-09), backend/auth/roles (OD-10/OD-11), and reporting (OD-12) remain unresolved. No approval, rejection, ban, role grant, account deletion, real refund, charge, publication or feedback removal is implemented.

The concrete mock management actions are editing supplier/user display labels, creating/renaming/removing sample categories, and saving editable oversight notes on supplier/user/order/refund/feedback records. These actions demonstrate frontend interaction and recovery without defining operational decisions. An oversight note is not an approval, refund decision, moderation result or authoritative audit trail.

All records and aliases are fictional. No contact details, credentials, real customer data or financial amounts are collected. Changes are in memory, reset on reload and do not modify discovery, supplier or customer commerce fixtures. The unauthenticated demo grants no administrator permissions. Production authorization, ownership, session/CSRF behavior and audit requirements require backend contracts before real data is introduced.

## Browser routes

| Route | Behavior |
|---|---|
| `/admin` | Fictional per-section counts, links and explanation dialog |
| `/admin/suppliers`, `/admin/suppliers/:recordId` | Application fixtures; capability-gated display labels/oversight notes |
| `/admin/users`, `/admin/users/:recordId` | Fictional aliases and read-only actor labels; capability-gated edits/notes |
| `/admin/categories`, `/admin/categories/:recordId` | Sample labels; capability-gated rename and confirmed removal |
| `/admin/categories/new` | Create an unpublished fictional category |
| `/admin/orders`, `/admin/orders/:recordId` | Line quantities, supplier/user relationships and disconnected payment presentation; oversight note |
| `/admin/refunds`, `/admin/refunds/:recordId` | Fictional request reason, related order and oversight note; no refund execution |
| `/admin/reviews`, `/admin/reviews/:recordId` | Fictional text feedback, related supplier/order and oversight note; no moderation action |

These are browser routes, not HTTP endpoints or DBML-derived contracts. Missing records link back to their list. Unknown admin paths retain the admin shell and existing not-found recovery. Shared workspace badges now say Sample workspace for both supplier and admin; historical shell tests are updated accordingly. The old unused `WorkspacePage` preview component is retained without rewriting unrelated code.

## Architecture and data safety

`features/admin/index.ts` exposes the screen interface to `pages/AdminPage.tsx`; app composition selects routes. Admin depends on shared primitives and its own local models/adapter/hooks/forms. It imports no supplier/commerce/discovery internals. Query owns validated snapshots and mutation lifecycles; drafts, validation errors and modal state stay local. No Redux additions, dependencies, persistence or architecture change are needed.

The mock adapter reads detached snapshots, honors AbortSignal, validates commands and checks fixture capabilities. Duplicate kind/ID pairs and broken supplier/user/order/feedback relationships are rejected. Revision checks reject stale writes atomically. Text bounds are provisional UX safeguards: labels 1–100 characters; notes 1–1,000 characters. Category names, permissions and relationship shapes are local samples, not approved business vocabulary or API DTOs. Read-only capabilities are illustrative flags, not inferred business restrictions or category-use rules.

Mutation retry is false. Forms/removal guard immediate duplicate submission. Valid acknowledgements must match the next revision and submitted effect/target before success; older reads are cancelled and newer or denied cached snapshots are preserved. Failed writes keep text, safe errors hide raw exception details, and save confirmations clear on edits. Notes change no underlying order/refund/feedback field. Public fixtures remain independent.

Initial reads have loading/error/retry states. Empty lists and missing records remain distinct; an unresolved detail refresh does not immediately manufacture a missing result. Background failures retain the last allowed fictional snapshot and mounted draft with a safe refresh warning. A denied snapshot removes edit controls. This cached-content policy is only for fictional samples and does not define production private-data/auth behavior. Adapter-keyed editors isolate mock-workspace state.

Payment labels accept only the existing client PDF example vocabulary, not PayHere API states. The seeded order has no connected payment or request; URL claims cannot establish success. Refund request fixtures imply no eligibility, amount or transition. Actor labels are read-only fixture descriptions, not permissions. Approval, account restrictions, refund execution and moderation controls are explicitly unavailable pending policy/contracts.

## Testing and review

Model/service coverage includes fixture isolation, detached reads, category CRUD, stale writes, capability/access denial, reference/duplicate validation, unsupported payment examples, text bounds, cancellation and note-only effects across five record types. Component coverage includes category validation/navigation/rename, note validation/save, failed writes/double submission/non-retry, wrong acknowledgements, initial and background read recovery, denied/missing/read-only states, six empty lists and abandoned-read cache protection.

Chrome journeys exercise category CRUD with native confirmation/Escape/focus, supplier/user label/note isolation and reload reset, refund/feedback notes and related-order navigation, and rejection of URL financial claims. List/detail/new/missing pages receive 320/1440px axe/overflow checks. Narrow mode emulates forced colors/reduced motion; refund detail also uses 200% CSS body text, not native browser zoom. Full-page screenshots normalize scroll position.

Source review introduces no live API/provider calls, credentials, real PII, browser storage, HTML injection, financial operations or cross-feature deep imports. Capability checks are UI plus mock validation, not server security. Dependencies are unchanged; no fresh dependency audit or clean installation is claimed. Existing development-tool advisory/support risks and Zod build warnings remain tracked.

## Validation

- PASS: `npm run typecheck && npm run lint && npm run test -- --run && npm run build`: 18 files / 149 unit/component tests, including 27 new admin cases. Production JS 481.69 kB (148.21 kB gzip); CSS 12.40 kB (2.82 kB gzip). Existing Zod annotation warnings remain non-fatal.
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: all 124 Chrome tests, including 31 new admin tests. Category confirmation/Escape/focus, sample management/oversight and all responsive checks passed.
- PASS: 320/1440px admin axe WCAG A/AA scans reported zero violations and overflow assertions passed. Category-creation and refund-detail screenshots at both widths were visually inspected for wrapping, controls and clipping; narrow refund detail also used CSS text enlargement. Existing shell keyboard/modal/enlarged-text coverage remains enabled.
- PASS: scoped source/diff review and `git diff --check`.
- Local Chrome/preview execution required sandbox escalation. The first automatic approval review timed out before execution; the permitted retry started successfully. Standalone build and E2E ran sequentially. No application action was rejected as unsafe.

FE-0601 is complete within mock admin scope. Subsequent hardening and validation are recorded in `FE-0602_ADMIN_REVIEW.md`; the evidence above records the original FE-0601 checks. Manual NVDA/VoiceOver speech, non-Chrome engines and native OS high-contrast behavior remain release follow-ups. No hosted CI/deployment or live admin readiness is claimed.
