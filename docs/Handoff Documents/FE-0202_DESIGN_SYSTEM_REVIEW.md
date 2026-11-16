# FE-0202 — Design-system states and accessibility review

Date: 2026-11-15. Requirement trace: C-01–C-04, S-01–S-03 and A-01 through their shared UI baseline; DESIGN accessibility requirements. Dependency: validated FE-0201.

## Scope and assumptions

Review and strengthen the existing three shells, fields, async region and modal. No business features, API routes, auth assumptions, palette approvals or dependency additions are introduced. Supplier/admin remain layout previews containing no account data. The test-only consumer uses explicitly local sample data and a sample Zod rule; these are not proposed marketplace contracts.

## Findings and fixes

1. **Native dialog state drift:** a native `dialog.close()` event hid the dialog while the consumer's React state remained open, preventing reopening. A targeted browser test reproduced the failure. Dialog now forwards native closure to the controlled owner, while ignoring stale close events if the modal has already reopened. The regression now passes; existing Escape/Close/focus restoration tests also pass.
2. **E2E argument forwarding:** the root script dropped `--grep` before reaching Playwright. Root `test:e2e` now forwards arguments through the workspace script. The targeted regression invocation verified forwarding. No dependency or lockfile change is needed for this script-only correction.
3. **Forced-colors presentation:** selected navigation relied on a background fill and loading skeletons on fills/shadows. Forced-colors CSS adds system-colored boundaries, selected-link weight, explicit focus outlines, disabled-control treatment and invalid-field borders. Default provisional tokens remain unchanged.

## Added coverage

- `ShellStates.test.tsx`: a local TanStack Query consumer within each customer/supplier/admin shell transitions through loading, malformed untrusted fixture error, retry, empty and ready content. Zod rejects invalid response shape; safe error presentation hides internal data. A ready-state sample form validates local input, focuses errors and removes stale invalid descriptions on successful submission. Query clients and rendered trees are cleaned up per test.
- `Fields.test.tsx`: explicit IDs, corrected select-error descriptions, read-only values and disabled-control tab exclusion.
- `design-system-states.spec.tsx`: all five async states composed into all three shells, at 320/1440px (30 state/width reviews). These are static React-rendered composition fixtures using production CSS; Query interaction is tested by the component suite.
- Real route checks combine Chrome forced-colors/reduced-motion emulation with 200% body text at 320px, checking skip navigation, menu keyboard operation, current-page semantics, visible focus and overflow. Text enlargement is CSS-based, not a native browser zoom claim.
- Unknown supplier/admin routes retain the correct preview shell and recover to the customer shell with main focus.
- A forced-colors component fixture verifies invalid-field, disabled-button and loading-status presentation, including a visible skeleton border. Existing responsive, contrast, native-modal and route-history coverage remains active.

## Accessibility and security review

Reviewed landmark composition, heading hierarchy, live announcements, labels/descriptions, error focus, keyboard exclusion, route recovery, active-navigation indicators, forced-colors boundaries and narrow layouts. Manually inspected the forced-colors enlarged admin screenshot and invalid/disabled/loading component screenshot for readability, wrapping and clipping. Artifacts are generated in ignored `frontend/test-results/`.

Actual NVDA/VoiceOver output, native OS high-contrast settings and non-Chrome browser behavior were not tested. Chrome emulation and axe are not WCAG certification. Existing auth/provider/branding decisions and development-only dependency audit findings remain tracked. No new audit is claimed for unchanged dependencies. React escaping and fixed safe error messages remain intact; no credentials, PII, persistence or live payment/provider calls were added.

## Validation — 2026-11-15

- Before fix: targeted native-close browser test reproduced the inability to reopen the dialog.
- PASS: `npm run typecheck && npm run lint && npm run test -- --run && npm run build`. Eight files / 24 unit/component tests passed; production JS 292.68 kB (91.99 kB gzip), CSS 6.89 kB (2.03 kB gzip).
- PASS: typecheck/lint after the final browser-test additions.
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: 34 browser tests. Browser/preview execution required sandbox escalation. Builds and E2E ran sequentially.
- PASS: axe checks for all tested shell/state combinations, responsive overflow assertions, forced-color keyboard/presentation checks and manual screenshot review.
- PASS: `git diff --check`.

FE-0202 is complete within the implemented design-system scope. FE-0301 has not started. Hosted CI and deployment have not run.
