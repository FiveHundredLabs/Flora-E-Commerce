# FE-0702 — Local release and accessibility review

Date: 2026-11-16. Status: **PARTIAL — local mock/release review; live integration acceptance blocked by incomplete FE-0701.**

## Scope and dependency

The owner explicitly requested starting FE-0702 after the FE-0701 partial handoff. This authorizes reviewing the implemented local features; it does not approve backend paths, auth/CSRF, media states, provider operations or hosting. The earlier backlog sequencing restriction is superseded only for this independent review. Neither FE-0701 nor FE-0702 may be marked fully complete on mock evidence.

Coverage traces C-01–C-03, S-01–S-03 and A-01 through existing mock workflows and shared recovery/accessibility behavior. M-01 and live auth/payment/delivery/hosted acceptance still require the handoffs in `FE-0701_INTEGRATIONS_HARDENING.md`. No new credentials, API route, provider access, approval, state vocabulary or deployment is introduced.

Impacted files are the release verifier/scenarios, local preview asset middleware/configuration and startup scripts, static HTML bootstrap/CSS, browser review tests and documentation. Acceptance for this review is usable local startup/recovery, trustworthy minimum artifact structure, correct reserved-asset failures, effective browser restrictions and passing applicable local gates.

## Confirmed findings and fixes

- Two artifact tests failed before fixes: CSS-only entry HTML and an entry without the React mount point were accepted. Verification now requires the known mount element and an existing local module-JavaScript bootstrap. It inspects script/link resource references separately from ordinary navigation links, allowing the recovery link without weakening asset checks. This is validation of the known Vite output structure, not a general HTML security parser or artifact signature.
- A browser regression confirmed that missing `/assets/…` resources returned status 200 with the SPA HTML document. A local Vite preview hook now returns a plain 404 with security headers for missing/unsupported reserved assets, including HEAD handling, while normal document routes retain the SPA fallback. The chosen production host still needs equivalent configuration; no hosting decision is inferred.
- Two browser regressions confirmed blank first-load screens when application scripts were blocked or JavaScript was disabled. The entry HTML now provides a semantic, script-free recovery message/link and a noscript explanation. React replaces this content on successful startup. This fallback does not diagnose a backend error or automatically retry; it remains usable before application code can run and adds no inline JavaScript exception to CSP.
- Supported manual and Playwright preview startup now runs manifest verification before starting Vite. The direct artifact scenario runner reports all failed cases before exiting nonzero and always attempts fixture cleanup.

## Tests and accessibility

Four additional direct Node/assert scenarios cover absent/non-executable bootstrap, absent mount point, legitimate recovery links and malformed/tampered manifest data. The original five scenarios retain corruption/restore, hidden/unsupported/map, symlink, asset-reference/mode and metadata coverage. No new test library or dependency was installed.

Six `release-review.spec.ts` checks cover missing asset GET/HEAD, native form-action blocking without a POST, anti-framing from a parent without its own CSP, script-load failure recovery, JavaScript-disabled explanation, and customer/supplier/admin not-found recovery under preview headers. Browser-only failed-script injection aborts compiled asset requests; it adds no application failure switch or HTTP API contract.

The 320px bootstrap recovery and cross-shell recovery receive axe WCAG A/AA/overflow review. Cross-shell checks also use forced-colors/reduced-motion emulation and 200% CSS body text (not native zoom). JavaScript-disabled behavior is inspected with browser locators; no claim of an axe run in that disabled context is made. Existing feature tests retain loading, empty, error, retry, capability, keyboard and responsive coverage under the preview policy.

## Remaining acceptance gaps

Approved API/auth/CSRF/media contracts, backend role/tenant isolation, provider callbacks, authoritative processing states, chosen HTTPS host/security headers, deployment smoke/traffic rollback and manual screen-reader/non-Chrome review remain outstanding. No synthetic login/session/media endpoint or status fixture was added to stand in for these missing implementations. Inline styles remain allowed in local preview as recorded by FE-0701; the final host policy is unapproved.

Source review is limited to fictional local artifacts and recovery. No new dependency graph, credentials, real customer/supplier data, persistence, live requests or publication is introduced. No fresh installation/audit or remote CI run is claimed. FE-0701's earlier production audit is historical evidence; existing development-tool risks and non-fatal Zod annotation warnings remain tracked.

## Validation

- PASS: typecheck, lint, 20 Vitest files / 177 unit/component tests, nine direct artifact scenarios, production build and manifest verification. Build HTML 0.81 kB (0.46 kB gzip), JS 482.07 kB (148.37 kB gzip), CSS 12.45 kB (2.83 kB gzip).
- Initial regression evidence: two artifact scenarios and three targeted browser checks failed before their fixes. Those failures were recorded rather than counted as passing review.
- The first post-fix full browser run passed 135/137 checks. DOM inspection confirmed that the noscript paragraph was visible; its assertion now targets that paragraph directly. The native-form test observes the actual form-action violation and zero POSTs, then reads the unchanged document directly to avoid a locator wait on the denied navigation. Both targeted checks passed without relaxing CSP or changing the fallback. Temporary diagnostics were removed.
- PASS: final `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: all 137 Chrome checks, including six new review checks. Native form/framing restrictions, asset GET/HEAD failures, disabled/failed-script recovery and cross-shell accessible recovery passed under the existing CSP. Browser/loopback preview required sandbox escalation; builds and browser runs were sequential.
- PASS: the 320px startup recovery screenshot was visually inspected for readable text, recovery link, wrapping and clipping. Axe WCAG A/AA and overflow checks passed for that screen and the cross-shell review; no manual screen-reader speech or native zoom coverage is claimed.
- PASS: final typecheck/lint, nine artifact scenarios, production build and verification after the browser-test correction. The 177 unit/component tests passed earlier on the same application changes; no new Vitest cases were added by this review. The final supported preview command verifies the artifact before serving.
- PASS: source/whitespace review, `git diff --check` and post-browser artifact verification. Prior FE-0701 workspace changes were preserved; no staging, commit, remote CI or deployment was performed.

The local review is validated. FE-0702 remains PARTIAL overall: these results do not complete FE-0701 or live integration acceptance.
