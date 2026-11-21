# Phase 00 verification evidence

Date: 2026-11-21, Asia/Colombo. Baseline source `84b2396`. Application source, lockfile and configuration were unchanged throughout this documentation-only audit. Results below are from this task, not copied historical claims.

## Executed checks

| Check | Actual result |
| --- | --- |
| `npm run typecheck` | PASS, tsc exit 0 |
| `npm run lint` | PASS, ESLint exit 0 |
| `npm run test -- --run` | PASS, 21 files / 211 tests, reported duration 37.23s |
| `npm run build` | PASS, Vite 7.3.8 / 2,360 modules; release manifest generated |
| `npm run test:release` | PASS, all 9 artifact scenarios |
| `npm run verify:release` | PASS, current mock artifact verified |
| `git diff --check` | PASS; new Markdown also checked for trailing whitespace |
| Default Playwright baseline | Environment failure: sandbox preview listen EPERM, then permitted retry could not launch missing Chromium headless shell build 1255. Retry interrupted rather than repeat identical launch failures. No default-browser assertion pass claimed. |
| Chrome baseline | See final result below. Uses installed Chrome; no package/browser installation. |

Build warnings: two Zod pure-comment annotations were removed by Rollup; JS chunk exceeds 500 kB. Output: JS 629.98 kB / gzip 183.87 kB; CSS 89.69 kB / gzip 14.59 kB; HTML 0.84 kB / gzip 0.47 kB. These are build sizes, not Core Web Vitals measurements. A redundant baseline build was inadvertently started while the original chain was finishing; both exited 0. Subsequent Playwright build ran sequentially, and release verification was repeated against the resulting artifact.

## Browser baseline

Command: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- --workers=2 --max-failures=8 --reporter=line`.

The suite discovers 137 tests. The failure limit deliberately bounds audit execution; this is not a full green-suite claim. Application changes were not made to make baseline tests pass. Errors must be triaged against current behavior, not fixed by indiscriminately weakening assertions.

**FAIL (bounded baseline): 33 passed, 8 failed, 1 interrupted, 95 not run; duration 1.6 minutes, exit 1.** The extra non-test error is the configured maximum-failure stop. The interrupted forced-colors admin check has no pass/fail assertion result.

| Failure | Evidence | Follow-up |
| --- | --- | --- |
| `admin-review.spec.ts:50`, `admin.spec.ts:24`, `admin.spec.ts:42` | Timed out finding exact Users / Orders / Feedback links in admin navigation; current navigation includes counts | Phase 02/11: inspect accessible naming and intended link labels before updating selectors. Preserve behavioral expectations. |
| `admin.spec.ts:64`, suppliers and orders at 1440px | axe serious color-contrast failures: #b06000 on #fef7e0 = 4.33:1 for 11px bold status badges; minimum 4.5:1 | Phase 01 semantic status foregrounds and Phase 11 consuming styles. |
| `design-system-states.spec.tsx:20`, all three audiences | Server-rendered shell fixture throws Missing getServerSnapshot from useSyncExternalStore | Phase 01/02: generic shell/data composition and deterministic server snapshot; retain browser fixture tests. |

Raw local logs: `/tmp/flora-phase00-{release,build,e2e,chrome}.log`. Playwright traces/error contexts are in ignored `frontend/test-results/`; these are ephemeral and will be overwritten by later runs. The results and durable screenshots here remain the handoff evidence.

## Screenshot and responsive observations

Six full-page baseline screenshots were captured in installed Chrome against the production preview, then visually inspected. All are **before-redesign evidence**. Data shown is the app's fictional fixture data; no customer information or credentials were used.

| Route | 360px | 1440px | Observed |
| --- | --- | --- | --- |
| `/` | [Mobile](evidence/phase-00/home-360.png) | [Desktop](evidence/phase-00/home-1440.png) | 15 of 15 HTML images unresolved at capture at both widths; broken images visible. SVG product illustrations remain visible. Unsupported subscription/free-shipping/price/review content remains. |
| `/supplier` | [Mobile](evidence/phase-00/supplier-360.png) | [Desktop](evidence/phase-00/supplier-1440.png) | No horizontal overflow; oversized serif workspace heading, sparse operational hierarchy and footer spacing issues. |
| `/admin` | [Mobile](evidence/phase-00/admin-360.png) | [Desktop](evidence/phase-00/admin-1440.png) | No horizontal overflow; several moderation action labels wrap inside words; oversized serif heading and inconsistent button presentation. |

[`observations.json`](evidence/phase-00/observations.json) records viewport/overflow/image counts. The image check counted incomplete or zero-naturalWidth images at capture, not a standalone network diagnosis; the source CSP independently excludes the remote photo/font origins. All six observations had document scrollWidth <= viewport width. This does not establish route-wide accessibility, other viewport behavior or image reliability.

390/768/1024px coverage for the new design, keyboard-only flows, all async/error states, manual screen-reader speech, native zoom, performance metrics and full console/network cleanliness remain future phase gates. These six captures are not a claim that the existing UI passes WCAG. The reference PDF palette was rendered separately for inspection; no PDF asset was copied into the application.

## Changed files and review

Created:
- `docs/ui-redesign/REPOSITORY_AUDIT.md`: stack/component/contract inventory, 11 prioritized findings, replacement boundaries, migration decisions and executable Phase 01 plan.
- `docs/ui-redesign/IMPLEMENTATION_STATUS.md`: 36 actual route entries (including catch-all), hooks/access/status legend, test and screenshot mapping, absent candidate routes.
- `docs/ui-redesign/PHASE_00_VERIFICATION.md`: this report.
- `docs/ui-redesign/evidence/phase-00/{home,supplier,admin}-{360,1440}.png`: six baseline screenshots.
- `docs/ui-redesign/evidence/phase-00/observations.json`: capture measurements.

Updated:
- `README.md`: entry links to current redesign evidence.
- `docs/DESIGN.md`: marks conflicting legacy design instructions superseded.
- `docs/OPEN_DECISIONS.md`: records current visual direction and shop-only category/one-store constraints without inventing live contracts.
- `docs/TASKS.md`: separate UI-R00/UI-R01 status and handoff.

No application code, routes, dependencies, data models, authentication, adapters or fixtures changed. Existing prompt-pack files were already untracked and were not rewritten. No Git commit or deployment was made. Generated `frontend/dist` and Playwright test-results remain ignored build/test artifacts.

Security review: preserve the mock-only environment guard, restrictive preview CSP, release manifest checks and absence of client credentials. The existing reachable supplier/admin demos are not secure live portals; an approved server identity/ownership/CSRF contract remains required. No new endpoint or permission assumption was introduced.

## Readiness

**Phase 00 complete within audit/preparation scope. Phase 01 ready to start, not implemented.** The audit includes a bounded implementation plan and explicit acceptance tests. Existing browser/design defects are logged rather than hidden. Foundation work is not blocked by missing live APIs, but live commerce, authoritative portal operations, media and deployment remain blocked by their contracts. The homepage was deliberately not redesigned in Phase 00.
