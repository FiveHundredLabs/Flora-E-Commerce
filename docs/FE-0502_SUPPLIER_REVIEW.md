# FE-0502 — Supplier feature review

Date: 2026-11-16. Requirements: S-01 (application/profile), S-02 (catalog/inventory), S-03 (orders/sales). Dependency: FE-0501.

## Scope and acceptance

Review the existing fictional supplier workspace with failure/recovery, cancellation, stale-response, permission-presentation and accessibility tests. Keep the FE-0501 mock protocol and provisional validation bounds. No dependencies, business approvals, authentication, public publishing, HTTP endpoints, provider operations or payment/reporting states are introduced.

Changes are limited to supplier screen/mutation lifecycle handling, receipt association, a small refresh-notice style, feature/browser tests and documentation. Acceptance requires preserving unsaved inputs after refresh failure, associating saves with the submitted effect, retaining denial/newer cache state against late responses, accessible recovery and passing repository gates.

## Confirmed regressions and fixes

The first two regression tests failed before changes: a failed background read replaced the editor with a full-page error, losing its draft, and a correctly versioned but unchanged profile receipt was presented as a successful save. A third regression test subsequently reproduced a late allowed write replacing a newer denied workspace.

- Initial read failures still show the shared loading/error/retry presentation. Failed background reads of an existing allowed **fictional** snapshot now show a safe refresh warning beside the mounted editor, retaining its inputs and focus. Retry exposes progress and restores lost focus to the page title after the retry control disappears. This cached-content policy does not establish a production private-data/auth policy.
- Mutation results must match the submitted effect as well as the next revision. Application/profile fields, product fields/removal, newly added product/variant IDs, variant fields/removal, stock target and order-note target are checked. Stale commands cannot execute against a different cached revision. Receipt checks establish local request/result association; approved backend contracts must still define full response/authorization semantics.
- A newer cached revision and an explicit denied snapshot survive older write acknowledgements. A refreshed denial removes editable content. Client presentation and the in-memory capability checks are not server authorization.
- Workspace editors are keyed by the adapter identity. Switching mock workspaces unmounts old drafts and per-call callbacks; a late result stays in its own cache key. Keys must uniquely identify fixture workspaces; production account mapping remains unresolved.
- Removal now has an immediate submission guard, visible progress and conditional lost-focus recovery after an error. Closing is held while the command is pending. Failure keeps the item/dialog available for explicit retry; automatic mutation retry remains disabled.

## Test coverage

`SupplierReview.test.tsx` covers background failure/draft retention/retry focus, wrong profile/stock acknowledgements, initial loading/error/retry across application/product/inventory/orders/sales, refreshed denial, adapter identity changes during pending writes, newer-cache preservation, late-write denial preservation, cancelled refreshes after save, abandoned-read cache protection, malformed reads, and removal failure/double-submit/non-retry/recovery. Existing FE-0501 empty-state and CRUD coverage remains enabled.

Slow/failing operations use injected component adapters. No production failure toggles or artificial service routes were added. The removal component test supplies a local jsdom `showModal`/`close` state shim and restores it after unmount; it asserts command and error state, not native modal containment or focus behavior.

`supplier-review.spec.ts` adds keyboard name-validation/save/edit recovery, blank-stock/zero-count recovery, overlong note validation and Escape/confirmed-removal/empty-inventory journeys. Narrow validation uses 320px, 200% CSS body text, forced-colors/reduced-motion emulation, axe WCAG A/AA and overflow assertions. CSS text enlargement is not native zoom. Native dialog focus restoration is checked in Chrome. Full-page screenshots normalize scroll position before capture.

## Security and limitations

Scoped source review adds no secrets, real customer/supplier PII, credentials, browser persistence, unsafe HTML, live network calls or cross-feature imports. The workspace remains isolated from customer commerce/discovery; notes do not establish fulfilment/payment state and counts are not monetary sales. Business/auth/media/reporting contracts remain open. Dependencies are unchanged; no fresh installation or dependency audit is claimed. Existing development-tool advisory/support risks and non-fatal Zod annotation warnings remain tracked.

Manual screen-reader speech, non-Chrome engines, native OS high-contrast and production session/ownership behavior remain unverified. No hosted CI or deployment is claimed.

## Validation

- PASS: final `npm run typecheck && npm run lint && npm run test -- --run && npm run build`: 16 files / 122 unit/component tests, including 17 new supplier review cases. Production JS 466.47 kB (143.95 kB gzip); CSS 11.54 kB (2.75 kB gzip). Existing Zod annotation warnings remain non-fatal.
- The refresh-retry focus assertion also exposed a batched instant-settlement case; recovery now observes completion/error state as well as the fetching flag. The final component suite includes that regression.
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: all 93 Chrome tests, including four new supplier review journeys. Local browser/preview execution required sandbox escalation. The standalone quality build and E2E ran sequentially.
- PASS: narrow stock/note validation axe scans reported zero violations, overflow assertions passed, and full-page screenshots were visually inspected for wrapping, control/error visibility and clipping. Long native input contents scroll within the control. Existing 320/1440px supplier screen checks remain enabled.
- PASS: scoped source/diff review and `git diff --check`.

FE-0502 is complete within mock supplier scope. FE-0601 has not started.
