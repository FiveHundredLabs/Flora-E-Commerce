# FE-0602 — Admin feature review

Date: 2026-11-16. Requirements: A-01 (admin management/oversight), P-01 (refund/payment presentation), C-04 (feedback oversight). Dependency: FE-0601.

## Scope and acceptance

Review the existing isolated fictional admin workspace. Preserve the sample-only category/label/note commands and the open approval, account, refund, moderation and backend/auth decisions. No dependency, public route, HTTP endpoint, permission grant, payment state or live integration is introduced.

Changes are scoped to admin receipt/query handling, route-entry lifecycle, feature/browser tests and documentation. Acceptance requires safe loading/empty/error/retry states, retained draft/record intent after failures, no unrelated record changes in write receipts, denial/newer-cache protection, isolated record/workspace navigation and accessible validation/removal recovery.

## Confirmed regressions and fixes

Three initial regression tests failed before fixes: an old failed write triggered a read after an explicit denial; a note acknowledgement was accepted while also changing the payment example; and category creation could acknowledge the requested label while silently removing another category.

- Failed writes no longer invalidate/refetch an explicitly denied cached workspace. This prevents an old operation from reopening that view through error recovery. Successful old writes already preserve denied/newer snapshots; the review adds coverage of both paths. These are mock UI/cache protections, not backend authorization.
- Receipt validation checks the entire parsed record delta against the submitted command. Existing records may change only in the requested field or be removed only by the requested category removal. Creation adds exactly one matching category and preserves every existing record. New category capabilities remain service-supplied; the submitted label grants no permissions. Record-list ordering is deliberately excluded from this comparison. Canonical Zod-parsed record fields allow structural JSON comparison; unknown backend response semantics still require approved contracts.
- A fourth regression exposed false missing-detail content when navigating from a stale empty list without a fresh read. Workspace lifecycle is now keyed by adapter, screen and detail ID; allowed detail entry refreshes the mock snapshot even within the normal cache freshness window. Existing denied snapshots do not automatically refetch on mount. The loading/error/missing presentations remain distinct, and adapter/record changes detach abandoned draft callbacks. Query cache keys still identify the mock workspace, not an invented endpoint.

These changes do not alter operational state, source fixtures or business approvals. The receipt delta rule applies to the existing atomic in-memory command protocol; it must not be treated as an approved production API contract.

## Coverage

`AdminReview.test.tsx` adds cases for denied late failures, unrelated payment/category receipt changes, initial loading/error/retry across all six record lists, stale empty-list detail entry, adapter changes during creation, newer/denied cache protection, cancelled refreshes after writes, identical IDs across record kinds, malformed reads, reordered valid receipts, deliberate external focus and failed category removal/double-submit/non-retry/explicit retry. Existing FE-0601 CRUD, empty-state, read-only capability and draft-retention tests remain enabled.

Failures and latency use injected component adapters. No public failure switches or synthetic service routes are added. The failed-removal test uses a local jsdom dialog open/close shim, restored after unmount. It asserts state and commands; native modal containment and keyboard focus are reviewed in Chrome.

`admin-review.spec.ts` adds four browser journeys: overlong oversight notes with correction, label limits with keyboard correction/dirty confirmation, narrow native removal cancellation/confirmation/read-only recovery, and saved-versus-abandoned drafts across detail navigation. Narrow validation uses 320px, 200% CSS body text, forced-colors/reduced-motion emulation, axe WCAG A/AA and overflow checks. CSS text enlargement is not native browser zoom. Screenshots normalize scroll position before full-page capture.

## Security and limits

Scoped source review adds no credentials, secrets, real customer/supplier data, storage, unsafe HTML, live provider/network calls or cross-feature imports. Oversight notes remain editable fictional text; they do not approve suppliers, restrict accounts, execute refunds, moderate feedback or establish an audit log. Cached content/denial behavior is for mock fixtures, not a production authentication/private-data policy.

No dependency changes, installation or new audit are claimed. Existing development-tool advisory/support risks and Zod annotation warnings remain tracked. Manual screen-reader speech, non-Chrome engines, native OS high-contrast and real authorization behavior remain unverified. No hosted CI/deployment or live integration readiness is claimed.

## Validation

- PASS: `npm run typecheck && npm run lint && npm run test -- --run && npm run build`: 19 files / 169 unit/component tests, including 20 new admin review cases. Production JS 482.07 kB (148.37 kB gzip); CSS 12.40 kB (2.82 kB gzip). Existing Zod annotation warnings remain non-fatal.
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: all 128 Chrome tests, including four new admin review journeys. Browser/preview execution required sandbox escalation; quality build and E2E ran sequentially.
- PASS: narrow note/label validation axe WCAG A/AA scans reported zero violations, overflow checks passed, and both full-page screenshots were visually inspected for wrapping, controls, error/focus visibility and clipping. Long native input contents scroll inside their controls. Existing 320/1440px admin checks and native dialog/keyboard coverage remain enabled.
- PASS: scoped source review, whitespace checks on new files and `git diff --check`. Existing FE-0601 workspace edits were preserved; no staging/commit or unrelated rewrite was performed.

FE-0602 is complete within mock admin scope. Subsequent FE-0701 readiness/hardening is recorded in `FE-0701_INTEGRATIONS_HARDENING.md`; live integration scope remains incomplete.
