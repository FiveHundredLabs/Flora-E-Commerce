# Deployment and CI/CD

## Targets
Vercel, Netlify or Docker + Nginx are options; client hosting decision remains open. Vite SPA needs history fallback to `index.html` for client routes. Public SEO/SSR needs explicit review.

FE-0701 has completed local mock-preview hardening only. No host, domain, HTTPS setup, public preview or production deployment is configured. Vite preview is a local test server, not the production serving recommendation. Live release remains blocked on OD-10/OD-11/OD-12/OD-13 and the relevant operational decisions.

## Pipeline
Install locked dependencies → typecheck → lint → unit/component tests → production build → E2E smoke tests → dependency/security scan → preview deployment → approval → production release.

## Environment
Only `VITE_` variables intentionally public to browser. Never put secrets, JWT signing keys, AWS access keys or gateway secret keys in frontend env. Provide `.env.example` for public configuration only.

The only supported public variable is `VITE_APP_MODE=mock`; omitting it also means mock mode. Dev/build/preview config rejects live/unknown modes and other `VITE_` keys without printing their values. The previous speculative API base URL example was removed. Adding an API URL cannot enable a live adapter. Backend/auth/media operations must be approved and implemented before this gate is deliberately extended.

## Local preview and artifact checks

Use the existing Node 22/npm 11 installation instructions. From the workspace root:

```sh
npm run typecheck
npm run lint
npm run test -- --run
npm run test:release
npm run build
npm run verify:release
npm run preview
```

The preview binds to `127.0.0.1:4173`. The supported `npm run preview` command verifies the current artifact before starting Vite; Playwright uses that same command after its build. Stop a manual preview before `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`. Do not run two builds/E2E processes against the same `frontend/dist` directory. Invoking Vite directly bypasses the supported wrapper and is not the reviewed startup procedure.

`frontend/dist/release-manifest.json` labels the artifact `mock`, sets `liveIntegrations: false` and records byte counts/SHA-256 for each served asset and entry HTML. Verification rejects missing/changed/extra files, hidden files, symlinks, source maps, unsupported file paths, missing/external entry assets and a missing mock marker. Current output permits root `index.html` and flat `assets/` files with documented extensions; public asset layout changes require updating that explicit allowlist. Hashes detect mismatches against the manifest, not malicious replacement of both artifact and manifest; trusted CI provenance/signing remains a release concern.

The artifact checks now also require the known React mount point and a local module-JavaScript bootstrap; a CSS-only entry is not a usable release. Script/link resource references are checked separately from ordinary recovery links. The static entry displays recovery text before application startup and a noscript explanation when JavaScript is disabled. This is minimum known-output validation, not a general HTML parser or diagnosis of startup failure.

The CI workflow runs nine direct Node/assert artifact scenarios (five from FE-0701 and four added by FE-0702), release verification, a production dependency audit and a short-lived GitHub Actions mock-preview artifact after the quality/browser gates. The configured upload uses the official [upload-artifact action](https://github.com/actions/upload-artifact/blob/main/README.md). No remote CI run, artifact upload or hosted release has been executed by the local task.

## Local security-header policy

`frontend/config/preview.ts` configures local preview CSP, `nosniff`, anti-framing, no-referrer, disabled camera/microphone/geolocation and no-store caching. The mock preview denies browser connections, inline JavaScript/eval, frames, plugins and native form submission. Same-origin scripts/styles and local/data images support the current fixture UI. Inline **styles** remain permitted for the current preview/review environment; this is not an unrestricted script exception. The launch CSP, style policy and API allowlist must be reviewed for the approved host/backend. Browser enforcement is covered by `release.spec.ts`; see MDN's [connect-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src), [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors) and [form-action](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/form-action) references.

Headers are server configuration, not embedded in static files by the manifest. Copying `dist/` to a host does not apply these headers. The selected HTTPS host must configure routing fallback, asset 404 behavior, CSP/security headers, TLS/HSTS, cache policy, monitoring/redaction and access restrictions explicitly. No speculative API origin is allowed in the current CSP.

FE-0702 adds a local preview middleware for the reserved `/assets/` namespace: missing/unsupported flat assets return plain 404 responses (including HEAD) with the preview security headers. Ordinary document paths retain SPA/not-found recovery. This does not configure an external host. Local review evidence and remaining integration acceptance: `FE-0702_RELEASE_REVIEW.md`.

## Restore procedure

Keep the entire previous verified artifact and its matching manifest, identified by a trusted CI run/commit. On the approved host, switch atomically to that whole artifact, verify its hashes, then smoke-test deep links, correct shells, headers and allowed operations. Do not combine files from different builds or regenerate a manifest to conceal corruption. The local artifact scenarios exercise corruption detection and restoration; this is file-level recovery, not a tested host traffic rollback. Host-specific commands and production rollback remain blocked until the target is chosen.

## Operations
Versioned artifacts, source maps with controlled access, error monitoring with redaction, rollback to previous artifact, post-deploy smoke test and CDN cache strategy.
