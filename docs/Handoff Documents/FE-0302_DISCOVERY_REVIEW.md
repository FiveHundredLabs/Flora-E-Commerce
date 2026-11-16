# FE-0302 — Customer discovery regression and accessibility review

Date: 2026-11-15. Requirement trace: C-01 (discovery/details) and F-01 (filters/sorting). Dependency: FE-0301's validated mock-only slice.

## Scope

Strengthen the existing discovery feature without changing provisional taxonomy, API assumptions, payment behavior or branding. All catalog content remains fictional, visibly labeled MOCK and non-purchasable. No dependency manifests or lockfile changes were needed. Existing staged FE-0301 work was preserved; this task does not stage or commit files.

## Findings and implementation

1. **Filter focus loss:** URL changes keyed/remounted the form, dropping the focused Apply/Clear button to body. A failing regression reproduced this before the fix. The form now retains its DOM identity and synchronizes drafts using parsed values plus the navigation-entry key. This also resets unsaved drafts when history moves between equivalent URLs (explicit default versus omitted default). Validation still focuses/describes invalid input, and ordinary filter updates do not steal focus to main.
2. **Untrusted adapter output:** the adapter interface now returns `unknown`; Query validates every result with the existing mock catalog Zod schema, checks cancellation after awaiting it and only caches validated results. The built-in mock retains its explicit validated Catalog return type for fixture consumers. This is not an approved production DTO/endpoint.
3. **Background refresh errors:** initial reads without data still use loading/blocking error/retry. When previously loaded public sample data exists, refresh keeps it visible with a polite progress status or explicit failure notice. Manual retry is disabled while fetching. When successful retry removes its action, focus returns to the stable results heading only if it was lost to body; a user who moved elsewhere keeps their focus.
4. **Detail-state consistency:** pending/failed reads are not mislabeled as missing records. A validated result without the requested slug produces not-found recovery. A shop with no products has its own empty related-products state. Cached shop information and its products remain consistently visible during refresh failure, with the notice explaining their status.

Cached-display behavior is scoped to public MOCK content. It must not be treated as an authentication/permission-denial policy for future private API data. Live integration still depends on OD-07/OD-09/OD-10 and the relevant auth contract.

## Coverage

Component tests cover Apply/Clear focus, initial detail loading/failure/retry for both kinds, truly empty store/product catalogs, shops without products, malformed adapter output, cached list/detail failures, successful refresh retry, preserving a deliberate focus move and cancellation with late-result cache protection. Existing URL/schema/filter/ownership tests remain enabled.

Browser additions cover keyboard-only filter application/clearing, history reconstruction including equivalent URLs, missing store/product recovery, duplicate URL parameters, markup-shaped search values as inert data, and validation/empty states at 320px with reduced motion, forced colors and 200% body text. Enlargement uses CSS and does not claim native zoom testing. Existing browsing, detail, shell, dialog and responsive accessibility tests remain enabled.

Artificial failures/slow reads use injected component-test adapters. There are no production error toggles, new API URLs or test-only public routes. Browser checks exercise actual production-preview pages; shared async markup already has separate browser fixtures.

## Accessibility, visual and security review

Reviewed stable focus order, field descriptions, validation focus, result/progress announcements, error recovery, heading/landmark hierarchy, cached-content messaging and narrow layouts. Manually inspected normalized forced-colors enlarged empty-product and mobile missing-product screenshots. Full-page screenshots scroll to top before capture to avoid including an offscreen fixed skip link; a live viewport assertion independently verifies that link stays outside the viewport when not focused.

Manual NVDA/VoiceOver speech output, native OS high-contrast settings and non-Chrome browsers remain release follow-ups. Axe/Chrome emulation is not WCAG certification. Native text/select controls may scroll or truncate long field values while their labels and options remain available.

Source review found no credentials/PII, browser token persistence, raw exception presentation, unsafe HTML rendering or live provider calls. Mock fixtures and approved-boundary distinctions remain intact. Existing dependency advisories and Zod annotation build warnings are unchanged; no fresh audit is claimed.

## Validation

- Before fix: the targeted filter-focus regression failed with focus on body after Apply.
- PASS: final `npm run typecheck && npm run lint && npm run test -- --run && npm run build`: ten files / 56 unit/component tests. JS 397.06 kB (122.80 kB gzip); CSS 9.01 kB (2.39 kB gzip).
- PASS: final `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: 52 browser tests, including the equivalent-URL history case. Browser/local preview required sandbox escalation. Build and E2E ran sequentially.
- PASS: responsive axe/overflow assertions, keyboard focus/history recovery, inert query markup, forced-colors enlarged-text and missing-detail review, plus manual screenshot inspection.
- PASS: `git diff --check` and direct source/security review.

FE-0302 is complete within the mock discovery scope. Hosted CI/deployment and Phase 4 work have not started. Manual assistive-technology/cross-browser checks and real API/business-rule approval remain open.
