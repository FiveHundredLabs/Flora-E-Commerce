# FE-0101 foundation handoff

Date: 2026-11-15. Requirement trace: foundational support for C-01, S-01 and A-01; no business workflow is implemented by this task.

## Scope and assumptions

The existing scaffold is extended in place. Vite SPA/declarative React Router and TanStack Query follow the architecture. Backend/auth contracts and branding remain open; the home page communicates catalog unavailability. Redux is deferred until real shared client state exists. No credentials, browser storage or live payment/provider calls are introduced.

## Delivered structure

- Root workspace manifest, shared lockfile, Node version hint and ignored build/test output.
- React entry point, app providers, isolated Query client factory and recoverable error boundary.
- Home/not-found route compositions and neutral semantic CSS with visible keyboard focus and skip navigation.
- Strict TypeScript, ESLint, Vitest/jsdom, Testing Library/user-event and MSW lifecycle setup. Tests fail on unhandled network calls.
- Playwright tests against the production build: route recovery, skip-link focus, responsive overflow, axe accessibility and screenshots at 375/768/1440px.
- CI workflow using npm 11 and Chromium; local Chrome is an optional configured channel.

## Acceptance and tests

Install from the lockfile; typecheck/lint/unit tests/build; browser smoke and accessibility checks; manual screenshot inspection. Unit/component tests cover empty home content, navigation recovery, error-boundary redaction, no automatic mutation retries and an explicitly labeled MSW fixture validated with Zod. The fixture URL is test-only and supplies no proposed backend route.

## Review limits

Automated accessibility and keyboard checks cover the foundation only. Full screen-reader review and feature-specific loading/error/permission states belong to later tasks. Provider and auth contracts remain unresolved. CI configuration is supplied; hosted CI execution is not claimed. Git status and diff are readable; committing is outside this task.

## Validation results — 2026-11-15

- PASS: clean offline lockfile install using `npx --offline --cache /tmp/flower-flora-npm-cache npm@11 ci --offline --cache /tmp/flower-flora-npm-cache --no-audit` (307 packages). Required an elevated execution because the sandbox denied esbuild's binary validation.
- PASS: `npm run typecheck && npm run lint && npm run test -- --run && npm run build`. Four test files/five tests passed; Vite production build succeeded (287.04 kB JS, 90.36 kB gzip).
- PASS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: five tests passed against the production preview. Elevated execution was required for loopback/browser access after sandbox EPERM.
- PASS: keyboard skip-link activation moves focus to main; no horizontal overflow or axe WCAG-tagged violations at 375/768/1440px.
- PASS: manually inspected 375px and 1440px screenshots for wrapping, spacing and clipping. Screenshots are generated under ignored `frontend/test-results/`.
- PASS: `git diff --check`.
- Security review: production dependencies report zero vulnerabilities; full audit reports seven moderate development-only findings in the TypeScript ESLint/minimatch dependency chain. No high/critical findings remain. Track an upstream-compatible update; do not force a major transitive override merely to silence the audit. ESLint 9 also emits an end-of-support notice; evaluate the supported next major with its Node requirements during tooling maintenance.
- Source review: no secret credentials, browser token persistence, invented backend operations or live provider requests added. Error fallback does not render internal exception text.

FE-0101 is complete within foundation scope. Full screen-reader testing, broader accessibility review and feature states remain FE-0102/later work. Hosted CI and deployment have not run.
