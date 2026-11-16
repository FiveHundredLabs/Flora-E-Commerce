# FE-0102 — Async states, regression tests and accessibility review

Date: 2026-11-15. Requirement trace: foundation support for C-01, S-01 and A-01; acceptance baseline in PRODUCT_REQUIREMENTS and accessibility requirements in DESIGN.

## Scope and assumptions

FE-0101 was validated before this task. The foundation has home/not-found routes and no business features or approved backend DTOs. This task implements reusable state presentation and tests its consumer behavior through a local Query fixture. It does not advance catalog, supplier or admin features from later phases. Default home content remains an honest unavailable state. No additional dependencies or changes to backend, payment, branding or authentication decisions were needed.

## Implementation

- `shared/components/AsyncRegion.tsx`: typed loading, empty, error, forbidden and ready states. Regions have unique accessible heading associations; loading uses a polite status announcement, failures use alerts. Error messages are fixed safe text, with optional keyboard-operable retry. Permission-denied presentation never implies authorization enforcement.
- Retry results restore focus lost when the button disappears. If the user moves to another control while waiting, focus stays there. The loading state removes the retry action to prevent repeated submission from that control. Callers still own query lifecycle, allowed retries and server-authoritative permissions.
- `HomePage.tsx`: uses the real shared empty state with no request or fake timer.
- `app/RouteAccessibility.tsx`: updates document title from route content and focuses main after pathname changes, including history navigation. Initial entry preserves the normal tab sequence; URL search/hash changes do not trigger this focus reset.
- Shared CSS supplies neutral action styling and a minimum region height to reduce layout movement. There is no motion animation.

## Tests

- Component tests cover status replacement, uniquely named regions, restricted-content removal, errors without retry, React escaping and preserving intentional focus changes.
- A test-only TanStack Query fixture fails with private error text, then resolves to empty or ready content after keyboard retry. It checks pending state, safe error copy, focus restoration and exact request counts. It has no URL, API contract or production route.
- App regression tests cover empty content, not-found recovery, route title/focus and initial focus preservation. Existing mutation, error-boundary and MSW harness tests remain in the suite.
- Browser state fixtures render the actual AsyncRegion with React server rendering, then run axe and overflow checks at 375/1440px. These fixtures test markup/CSS and retry button keyboard reachability; React interactions are covered by component integration tests, not by static fixtures.
- Browser route tests cover home/not-found at 375/768/1440px, keyboard recovery/history, skip-link activation and reduced-motion plus 200% body text at 320px. The text-enlargement test uses CSS; it does not claim native browser zoom testing.

## Accessibility and security review

Reviewed landmarks, heading hierarchy, accessible names, live-status/alert roles, title changes, focus order/recovery, keyboard actions, visible focus, color contrast (axe), target minimum height, narrow layout and enlarged text. Manually inspected mobile error and desktop home screenshots for readability, wrapping, spacing and clipping. Screenshots are generated under ignored `frontend/test-results/`.

Actual NVDA/VoiceOver speech output was not tested. Automated axe and semantic review are not a WCAG certification; manual assistive-technology testing remains a release follow-up. This review covers the current foundation, not future forms, dialogs or role-specific pages.

No untrusted exception text, credentials, customer data, browser token storage or live provider calls were introduced. React escaping is preserved. Static browser fixtures inject only markup generated from local test data. Dependency manifests and lockfile are unchanged; FE-0101's seven moderate development-only audit findings and ESLint support notice remain tracked, with no new audit run claimed.

## Validation

- PASS: `npm run typecheck && npm run lint && npm run test -- --run && npm run build` on final application source. Five test files / 14 unit/component tests passed. Vite built successfully (288.24 kB JS, 90.73 kB gzip).
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` on final source: 14 tests passed. Browser/local preview execution required sandbox escalation, as in FE-0101.
- PASS: no axe WCAG-tagged violations or horizontal overflow across the tested routes/states and widths. Keyboard retry/focus behavior passed component integration tests; actual route keyboard/history behavior passed browser tests.
- PASS: visual review of mobile error and desktop empty home screenshots.
- PASS: `git diff --check`.

FE-0102 is complete within foundation scope. Manual NVDA/VoiceOver output testing remains a release follow-up. Hosted CI and deployment have not run. FE-0201 has not started.
