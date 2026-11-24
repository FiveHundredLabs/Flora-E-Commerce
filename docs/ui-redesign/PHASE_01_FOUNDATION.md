# Phase 01 — Botanical design-system foundation

Completed 2026-11-21. Requirement traceability: FE-0201/FE-0202 foundation supporting C-01–C-04, S-01–S-03, A-01, D-01, P-01, M-01 and F-01. This phase changes shared presentation and layout primitives only. Commerce reducers, feature adapters, route URLs, mock data, permissions and mutation contracts are unchanged.

## Delivered foundation

- Replaced the remote Google Fonts import and provisional token set with an offline-safe semantic system. The five fixed brand colors remain exact; accessible foregrounds and success, warning, danger and information pairs are explicit. System serif/sans fallbacks remain until licensed local Cormorant Garamond and DM Sans files are supplied.
- Added final shared styles for solid, outline, quiet, accent, destructive, icon, disabled and busy buttons; labeled text/search/select/textarea/combobox/checkbox/radio controls; badges and status tags; alerts, toasts, skeletons and empty states; price and image fallbacks; tabs, dropdowns and responsive table primitives; dialogs, drawers and confirmation dialogs.
- Added `PublicShell`, `DashboardShell`, `ResponsiveContainer` and `PageHeader` presentation frames. They accept navigation/content slots and import no feature modules, so authorization, Query state and commerce state stay with app/feature composition.
- Kept existing shared component APIs compatible while moving their final rules into `shared/styles/foundation.css`. Legacy page CSS and its older shared rules remain for later route phases; the new stylesheet is deliberately loaded last and provides the final semantic overrides without risking an out-of-scope page rewrite.
- Corrected the current portal typography to a compact sans-first hierarchy. Corrected admin status colors and made navigation count badges decorative to preserve stable accessible link names. Added a deterministic server snapshot for the existing shell's admin count subscription.
- Added explicit modal focus wrapping, Escape close and trigger focus return. Confirmation dialogs focus Cancel first. Reduced-motion and forced-colors behaviors are covered.
- Added a development-only `/dev/design-system` preview with palette, type, controls, async/status patterns, overlays, table, image/price fallbacks and public/supplier/admin layout examples. Vite replaces `import.meta.env.DEV` at build time; the production regression asserts the route resolves to the normal not-found screen.

The preview contains local examples only. It does not create marketplace records or claim unavailable prices, delivery, payment, approval or media behavior.

## Contrast and responsive evidence

Calculated sRGB ratios for rendered semantic pairs: cream on deep green 8.70:1; dark forest on light sage 7.74:1; dark forest on muted gold 6.06:1; muted copy on cream 7.09:1; white on danger 6.96:1; warning on warning-soft 6.41:1. The input boundary against white is 4.04:1, exceeding the 3:1 non-text requirement.

The focused browser suite checks 320, 360, 390, 768, 1024 and 1440px. Each width passed axe WCAG A/AA tags, horizontal-overflow checks, page-error checks and full-page capture. It also covers long labels, a high LKR price, missing image/price states, local Zod validation, tabs, dropdown Escape handling, persistent toast feedback, native modal containment/return, enlarged text, forced colors and reduced motion.

Evidence:

- [320px preview](evidence/phase-01/foundation-320.png)
- [360px preview](evidence/phase-01/foundation-360.png)
- [390px preview](evidence/phase-01/foundation-390.png)
- [768px preview](evidence/phase-01/foundation-768.png)
- [1024px preview](evidence/phase-01/foundation-1024.png)
- [1440px preview](evidence/phase-01/foundation-1440.png)

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test -- --run`: 22 files passed; 215 tests passed.
- `npm run build`: passed, including release-manifest generation.
- `npm run test:release`: 9 release-integrity scenarios passed.
- `npm run verify:release`: passed.
- `PLAYWRIGHT_CHANNEL=chrome npm run test:foundation`: 11/11 passed.
- Production-only preview exclusion: 1/1 passed.
- Final portal/form regression subset after forced-colors correction: 70 passed, 1 failed. The sole failure is the existing `admin.spec.ts:24` fixture/test mismatch: reload restores the source fixture heading, while the test expects `Fictional Stem Studio`. Phase 01 did not change fixtures or business behavior to conceal that mismatch.

Build output remains a single application chunk: CSS 98.88 kB (16.53 kB gzip), JS 630.86 kB (184.08 kB gzip), HTML 0.84 kB (0.47 kB gzip). Vite still reports the existing chunk-over-500-kB warning and removes two misplaced Zod pure annotations. Route-level splitting remains Phase 13 work; these build sizes are not Core Web Vitals measurements.

Browser inspection found no preview overflow or axe violations at the six target widths. Explicit edge wrapping keeps Tab inside native dialogs, and the final 11-test run passed. A wider regression run exposed custom brand foregrounds surviving forced-colors conversion on buttons and badges; explicit system-color mappings fixed all 21 related failures. The narrow table exposes a keyboard-focusable horizontal region and visible scrolling hint instead of compressing cells into unreadable fragments.

## Files

Created:

- `frontend/src/shared/styles/foundation.css`
- `frontend/src/shared/components/layout/Frames.tsx`
- `frontend/src/shared/components/ui/Feedback.tsx`
- `frontend/src/shared/components/ui/Navigation.tsx`
- `frontend/src/shared/components/ui/Table.tsx`
- `frontend/src/shared/components/ui/Foundation.test.tsx`
- `frontend/src/pages/dev/DesignSystemPage.tsx`
- `frontend/src/pages/dev/design-system.css`
- `frontend/playwright.foundation.config.ts`
- `frontend/foundation-e2e/foundation.spec.ts`
- `frontend/e2e/foundation-production.spec.ts`
- `docs/ui-redesign/evidence/phase-01/*.png`

Updated:

- token/global CSS, shared Button/Dialog/Fields, current Shell, app route composition and stylesheet entry
- admin semantic status colors
- root/frontend scripts and TypeScript test inclusion
- redesign ledger and task status

No dependency, lockfile, endpoint, schema, route contract, authentication, fixture or business-rule change was introduced.

## Remaining risks and next-phase readiness

Phase 01 is complete within foundation scope and Phase 02 can begin. The existing homepage, discovery, cart drawer and portal screens still contain legacy page-level composition; their scheduled phases will compose the new primitives without discarding feature logic. Remote storefront imagery and unsupported promotional/pricing copy remain logged for Phases 02–06. Licensed local brand fonts and production media assets are still unavailable. The known admin fixture reload assertion, manual screen-reader speech, native browser zoom and field Core Web Vitals remain follow-up work.

Phase 02 can begin with public navigation and app-shell composition. Live API/auth/payment/delivery/media/deployment work remains blocked by the contracts listed in the Phase 00 audit.
