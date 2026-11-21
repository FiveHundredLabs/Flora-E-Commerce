# Phase 02 — Global public shell and navigation

Completed 2026-11-21. Requirement traceability: C-01 and C-04 navigation support, F-01 responsive/accessibility support, and Phase 02 acceptance criteria. Public shell presentation changed; registered routes, discovery filtering, cart Redux ownership, wishlist persistence, Query state, portal navigation and marketplace workflows remain intact.

## Delivered

- Replaced the rejected three-tier public header with a restrained sticky cream/white frame, text brand fallback, desktop navigation and mobile drawer.
- Navigation contains only registered routes: products, shops, about, contact, cart, wishlist, sample orders and supplier workspace. Bouquets, Plants and Stems link to the existing validated `category` query contract.
- Kept cart count synchronized directly from the existing Redux selector. No duplicate request or new state owner was introduced.
- Added a Zod-backed catalog search entry using the existing `/products?q=` contract. Blank and overlong queries show local errors; clear removes the query; discovery owns zero-results rendering. There are no invented suggestions.
- Added mobile drawer and cart drawer focus containment, Escape handling, trigger focus return, active route states and 44px interaction targets.
- Added a truthful footer with only existing routes. It explicitly identifies the marketplace as a preview and omits unsupported social links, newsletter signup, policies, payment badges, promotions and delivery promises.
- Added public-page meta descriptions. No canonical tag is emitted because an approved production origin is unavailable.
- Preserved the existing breadcrumb primitive and route-level focus/title management.

No announcement strip is shown because no approved announcement content exists. No authenticated account menu is claimed because OD-11 remains unresolved; `/account/orders` is labelled as sample order access. The official identity/logo remains unconfirmed under OD-09, so the accessible text brand is the intentional fallback.

## Removed unsupported presentation

- “Free delivery” and “Freshness Guaranteed” announcement claims.
- Fabricated cart shipping threshold/progress.
- Public super-admin links.
- Placeholder social anchors, newsletter form, policy anchor, payment-provider and “SSL Secure” badges.
- Decorative mobile dock duplicating primary navigation.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test -- --run`: 22 files passed; 215 tests passed.
- `npm run build`: passed.
- `npm run test:release`: 9/9 release scenarios passed.
- `npm run verify:release`: passed.
- Phase 02 Chrome suite: 10/10 passed at 320, 390, 768, 1024 and 1440px with axe WCAG A/AA tags, overflow assertions, search flows, query reset, active categories, drawer focus and metadata checks.
- Compatibility suite covering shell, commerce, review and release flows: 41/41 passed after correction.
- Full production Chrome suite: 146/148 initially passed. The Phase 02 forced-colors active-Home compatibility failure was corrected and its three customer/supplier/admin regressions then passed 3/3. The sole remaining known failure is the pre-existing `admin.spec.ts:24` reload assertion expecting `Fictional Stem Studio` instead of the restored source fixture heading.

Final build output: HTML 0.84 kB (0.47 kB gzip), CSS 107.68 kB (17.87 kB gzip), JS 628.36 kB (183.94 kB gzip). The existing chunk-over-500-kB and Zod annotation warnings remain.

## Responsive evidence

- [320px public shell](evidence/phase-02/public-navigation-320.png)
- [390px public shell](evidence/phase-02/public-navigation-390.png)
- [768px public shell](evidence/phase-02/public-navigation-768.png)
- [1024px public shell](evidence/phase-02/public-navigation-1024.png)
- [1440px public shell](evidence/phase-02/public-navigation-1440.png)

The evidence intentionally shows the existing product-list composition beneath the new shell. Narrow product-card typography and legacy discovery composition remain assigned to Phases 04–05; they were not silently rewritten in the shell phase.

## Files

Created:

- `frontend/src/shared/components/layout/PublicChrome.tsx`
- `frontend/src/shared/styles/public-shell.css`
- `frontend/e2e/public-navigation.spec.ts`
- `docs/ui-redesign/evidence/phase-02/*.png`

Updated:

- `frontend/src/shared/components/layout/Shell.tsx`
- `frontend/src/app/RouteAccessibility.tsx`
- `frontend/src/features/discovery/index.ts`
- `frontend/src/main.tsx`
- redesign implementation ledger and task status

## Phase 03 readiness and risks

Phase 02 is complete within public-shell scope and Phase 03 can begin. The public homepage/about/contact compositions remain legacy and are assigned to Phase 03. Discovery/product grids remain assigned to Phases 04–05. Official logo assets, authentication/account roles, production canonical origin, legal policy routes, social profiles, newsletter consent/endpoint and delivery/pricing contracts remain unavailable and were not fabricated.
