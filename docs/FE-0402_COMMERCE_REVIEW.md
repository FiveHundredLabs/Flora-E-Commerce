# FE-0402 — Customer commerce review

Date: 2026-11-15. Requirements: C-02 (cart/checkout), C-03 (orders), C-04 (post-delivery feedback), D-01 (fulfilment choices), P-01 (payment presentation). Dependency: FE-0401.

## Scope and acceptance

Review the existing in-memory commerce slice with deterministic failure, loading, empty, recovery and accessibility coverage. Keep the approved per-store checkout behavior and the existing sample-only boundaries. No dependencies, backend endpoints, provider calls, payment transitions or business approvals are introduced. The 1–99 quantity and 1,000-character feedback bounds remain provisional UI limits.

Impacted modules are commerce screens, Query response validation, mock seed validation and feature/browser tests. Acceptance requires preserved cart/draft intent after failures, reliable acknowledgement association, isolated store editors, accessible recovery and passing repository quality gates.

## Findings and fixes

- Two targeted regression tests initially failed: editing feedback retained an obsolete saved confirmation, and an acknowledgement for another order was accepted. Editing now clears the saved status; feedback receipts must match both the submitted order ID and normalized comment before success/cache invalidation.
- Switching stores now remounts the checkout editor. Preferences and submission state belong to that store. A late acknowledgement still reconciles only unchanged submitted cart lines through the hook-level handler, but its detached navigation callback cannot move the customer away from the new store editor.
- Checkout errors and feedback completion restore focus only when focus has fallen to the document body. Errors return feedback focus to its retained text; success returns focus to Save. Deliberate focus elsewhere is preserved.
- Order reads reject duplicate IDs and malformed records; returned feedback is bounded consistently with the existing demo input limit. Invalid data receives the safe error/retry presentation rather than ambiguous order links or untrusted error details.

## Coverage

`CommerceReview.test.tsx` adds 13 cases: stale saved status, wrong-order acknowledgement, store switching during a pending write, feedback retention/retry/double-write prevention, checkout failure/cart preservation, history and detail loading/error/retry, stale empty-cache detail loading, malformed/duplicate order records, both feedback eligibility gates, and aborted-read cache protection. Existing commerce tests retain empty cart/history, invalid selection, quantity validation, idempotency and snapshot coverage. Writes never automatically retry.

Failure and latency scenarios use injected adapters in component tests; no public failure switches or invented service routes were added. jsdom does not consistently clear focus from disabled native controls, so the focus recovery tests explicitly move focus to the body before settling the request. This tests the recovery condition without claiming native-browser blur behavior from jsdom.

`commerce-review.spec.ts` adds four browser journeys: keyboard feedback save/edit/revisit, cart quantity recovery/removal, feedback length errors, and payment-query spoofing on a missing order. Narrow cart and feedback validation receive axe WCAG A/AA checks, overflow assertions, forced-colors/reduced-motion emulation and 200% CSS body text at 320px. CSS text enlargement is not native browser zoom. Full-page screenshots normalize scroll position before capture.

## Review boundaries

Source review found no new secrets, real customer data, browser persistence, unsafe HTML rendering or live integrations in this change. Validation is a mock boundary, not backend authorization. Prices, payments, booking, authentication, review policy and remaining business decisions still require approved contracts before live implementation.

Manual NVDA/VoiceOver speech output, non-Chrome engines and native OS high-contrast behavior remain unverified. Existing development-tool advisories/support risks and Zod annotation warnings remain tracked. Dependencies are unchanged; no new dependency audit or clean installation is claimed. Hosted CI and deployment are not part of this review.

## Validation

- PASS: `npm run typecheck && npm run lint && npm run test -- --run && npm run build`: 13 files / 85 unit and component tests. Production JS 447.94 kB (139.16 kB gzip); CSS 10.62 kB (2.64 kB gzip). Existing Zod annotation warnings remain non-fatal.
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: all 68 Chrome tests, including four new commerce review journeys. Local browser/preview execution required sandbox escalation; the quality build and E2E ran sequentially.
- PASS: narrow validation axe scans reported zero violations, overflow assertions passed, and cart/feedback screenshots were visually inspected for wrapping, control boundaries, focus and error visibility. Native textarea content scrolls within its control.
- PASS: reviewed scoped diff and `git diff --check`.

FE-0402 is complete within mock commerce scope. Subsequent supplier implementation and evidence are recorded in `FE-0501_SUPPLIER.md`.
