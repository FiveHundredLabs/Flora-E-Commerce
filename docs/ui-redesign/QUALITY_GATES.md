# Acceptance and Quality Gates — apply to every phase

## A. Experience and design
- Distinct editorial identity on public pages; commerce is easy to use; admin/supplier have effective operational density.
- Design tokens, type hierarchy, image ratios, layout grid, spacing and interaction states are consistent.
- All meaningful controls have functional actions; never create dead CTA buttons or fake filters/exports.
- Every page includes appropriate loading, empty, error and success states; unsupported backend features remain disabled/explained, not falsely completed.

## B. Responsiveness
- Verify common viewport sizes 360px, 390px, 768px, 1024px, 1440px (and 320px if feasible).
- No horizontal overflow or clipped sticky controls; mobile nav, filter drawers, data tables and modal dialogs usable by touch/keyboard.
- Test long product/store names, high prices, validation errors, no images, and variable translated content length.

## C. Accessibility
- Target WCAG 2.2 AA. Contrast normal body text >=4.5:1, large text >=3:1, essential non-text UI components >=3:1 when applicable.
- Accessible names and relationships, visible focus, logical headings, skip navigation, dialog focus trap/return, live feedback as appropriate.
- Tap targets preferably >=44x44px for comfort, at least WCAG 2.2 AA requirements with applicable exceptions. Do not convey status only by color.
- Reduced motion, keyboard-only tests, accessible async status, useful image alt text.

## D. Security/data integrity
- Never infer administrative role from frontend UI alone. Backend role checks remain required.
- No private API keys, gateway secret, S3 access keys, presigned URL logs or n8n credentials client-side.
- Avoid `dangerouslySetInnerHTML` for untrusted user-controlled content; sanitize where unavoidable.
- Prevent stale product price/order total, double submission, optimistic payment success and cross-store order merging.
- Use typed server contracts and error handling; honor existing auth, cookies and CSRF strategy.

## E. Quality and build
- Keep TypeScript strict and no casual `any` casts.
- Run the existing project scripts for lint/typecheck/unit tests/build; if missing, state that honestly rather than inventing command results.
- Add tests for each feature's important state transitions, forms, filtering, cart split, checkout and approvals.
- Add Playwright smoke coverage for customer, supplier and admin critical paths when test infrastructure permits.
- No console errors, unhandled promises, broken images or uncontrolled layout shifts in inspected screens.

## F. Performance
- Favor responsive optimized assets; hero LCP image not accidentally lazy loaded.
- Avoid heavy carousels, huge JS bundles and duplicate requests. Route-level code-split feature areas appropriately.
- Measure rather than claim: targets at 75th percentile LCP <=2.5s, INP <=200ms, CLS <=0.1 on representative real traffic when available.
- Declare real measured results vs lab estimates; do not claim Core Web Vitals passed without evidence.

## Phase delivery checklist
1. List actual created/changed/deleted files.
2. State route paths/screens completed and what remains.
3. State backend contract usage and any unimplemented endpoints.
4. Report real lint/typecheck/test/build outputs.
5. Where browser available, provide or describe screenshot verification for mobile + desktop.
6. Identify outstanding UX or accessibility risks.
7. Ask for no additional redesign phase until the current one meets gates or blockers are logged.
