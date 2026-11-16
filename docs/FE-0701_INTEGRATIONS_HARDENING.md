# FE-0701 — Integration readiness and local hardening

Date: 2026-11-16. Status: **PARTIAL — local mock hardening validated; live wiring, auth, media and hosted deployment blocked.** Dependency: FE-0602.

## Requirement and scope review

C-01–C-03, S-01–S-03 and A-01 are covered by existing mock journeys and the new build/preview safeguards. M-01 media processing remains unimplemented because no approved upload/status/result/error contract exists. No auth, PayHere, PickMe/Uber Connect, storage or image-processing endpoint has been supplied or invented.

The repository contains no approved OpenAPI/auth/CSRF/media contract or hosting decision. `API_CONTRACT.md` and `PRIORITY_REMEDIATION.md` are proposals/process documentation, not approval. Root `AGENTS.md` requires “No invented API routes, business rules, backend capabilities or payment states” and “No live payment/provider integrations without approved contracts.” These requirements prevent marking this task complete or treating mock adapters as live integrations. The owner was asked for approved reference paths/URLs and the hosting target; no answer or credentials were inferred from elapsed time.

## Completed independent work

- `frontend/config/preview.ts` allows only default/explicit mock mode and rejects unsupported `VITE_` keys or modes without echoing values. Vite dev/build/preview all apply the guard. `.env.example` now uses `VITE_APP_MODE=mock`; the speculative API URL was removed. Configuring an API URL cannot silently enable a live adapter.
- Local production preview applies CSP, no-referrer, anti-framing, nosniff, disabled device permissions and no-store caching. Same-origin scripts remain usable, inline scripts and browser connections are blocked. Inline styles remain allowed for the preview/review environment and are an explicit launch-policy limitation. The selected host must apply its own reviewed headers; static assets do not apply server headers. CSP rationale follows the [MDN directive documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy).
- Build output includes an explicit mock marker and `release-manifest.json` with mock mode, disabled live integrations, file sizes and SHA-256 hashes. Build inspection/verification rejects unsupported/hidden files, symlinks, source maps, invalid entry assets, missing mock labels and manifest/file mismatches. The manifest is an integrity comparison, not a signature or a complete secret scanner.
- `npm run test:release` runs five direct Node/assert scenarios, including changed-asset detection and restoration. `npm run verify:release` checks the current output. Existing scripts/dependency ownership remain unchanged except for adding these release commands and post-build verification; no packages or lockfile graph were changed.
- CI now runs artifact scenarios, verification and production audit, then configures an identified seven-day mock-preview artifact after E2E. The official [upload-artifact documentation](https://github.com/actions/upload-artifact/blob/main/README.md) supplies the configured v7 action/input contract. Local YAML parsing succeeded; remote CI/upload has not run and no site was published.
- `release.spec.ts` checks headers/mock metadata, rejects inline script execution/browser fetch while preserving navigation, reloads supplier/admin deep links and checks absence of cookies/browser persistence in this demo. This is not an authentication/CSRF/tenant-isolation test against a real backend.

## Required handoffs — still blocking completion

| Area | Required evidence |
|---|---|
| Approved API wiring | Versioned OpenAPI with approved operation paths, schemas/errors, role/ownership checks, pagination, IDs, timestamps and concurrency/idempotency rules; backend owner approval and test environment |
| Authentication | Login/registration/logout/identity/refresh operation contracts, cookie/session policy, CSRF and trusted origins, role/store mapping, expiry/denial/logout semantics and negative tests |
| Media processing (M-01) | Authorized upload contract, file/type/size bounds, status vocabulary, original/processed URL access, cancellation/failure/retry semantics and backend ownership; no guessed worker states |
| Payments/delivery | Approved backend PayHere and PickMe/Uber Connect operations, sandbox access references, amounts/currency, reconciliation/callback/error rules; selection alone is insufficient |
| Deployment | Chosen host, environment/domain/origins, HTTPS/headers/cache/history fallback, monitoring/redaction, CI access references, rollout/rollback ownership and release approval |
| Final acceptance | Open supplier/refund/moderation/branding decisions as applicable; manual screen-reader/cross-browser review; real backend authorization/provider callback and hosted smoke/rollback evidence |

Only paths/URLs and ownership references are needed in conversation. Credentials must remain in the approved secret store, never in frontend variables, fixtures or messages.

## Validation evidence

- PASS: typecheck, lint, 20 Vitest files / 177 unit/component tests (eight new public-config cases), production build and artifact verification. Build JS 482.07 kB (148.37 kB gzip); CSS 12.40 kB (2.82 kB gzip); HTML 0.40 kB. Existing non-fatal Zod annotation warnings remain.
- PASS: five direct artifact scenarios, including corruption rejection/restoration, unsupported files/maps, asset/manifest symlinks, entry references/mock marker and manifest metadata validation. No extra test library was installed. This is file-level restore coverage, not a deployed traffic rollback.
- PASS (expected rejection): `VITE_APP_MODE=live npm run build` exits nonzero with the fixed unavailable-integration error. Subsequent `npm run verify:release` confirms the existing mock artifact remains valid.
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: all 131 Chrome tests, including three new release smoke tests, under the new preview headers. Existing responsive/keyboard/axe checks remain enabled. Build and browser execution were sequential; browser/preview required sandbox escalation.
- PASS: fresh `npm audit --omit=dev --audit-level=moderate`: zero production vulnerabilities. Initial restricted-network DNS attempt failed; the read-only network-enabled retry succeeded. No full development audit refresh is claimed; existing development-tool advisory/support risks remain tracked.
- PASS: workflow YAML parsed locally. Remote GitHub Actions, uploaded artifacts and hosted deployment remain unverified.
- PASS: final scoped source review and `git diff --check`; no live routes, credentials, dependency graph changes or unapproved operational states were introduced.

No live/backend/auth/media acceptance, host security configuration, published deployment, production rollback, new business approval or full FE-0701 completion is claimed. The owner subsequently requested FE-0702's independent local review; its results are in `FE-0702_RELEASE_REVIEW.md` and do not complete live scope. Evidence above records the original FE-0701 checks.
