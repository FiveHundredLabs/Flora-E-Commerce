# Phase 04 — Marketplace discovery verification

Updated 2026-11-22. Phase 04 implements requirements **C-01** and **F-01** within the currently available development-fixture contract.

## Delivered scope

- `/shops` is an editorial supplier directory with deterministic name sorting, shop-name search, multi-category shop filtering, supported-location filtering, applied chips, URL state, result announcements, and credible loading/error/empty states.
- `/shops/:slug` presents the supplier fixture's actual name, description, location, categories and owned products. It explicitly discloses that contact details, hours, fulfilment methods and delivery area are unavailable.
- `/products` supports product text search plus owning-store and store-location filters. Product categories were removed from the discovery model and all category navigation now targets shop discovery.
- Product cards expose their owning store and explicitly mark price and availability as unavailable. No ratings, stock, delivery, feedback or contact facts are fabricated.
- Mobile discovery uses a native modal filter dialog with Apply/Clear controls, active-filter count and focus restoration; desktop retains a compact sidebar.
- TanStack Query remains the owner of remote-style fixture state, including cancellation, refresh, retry and schema validation. No API route, pagination convention or backend capability was invented.

## Assumptions and constraints

- The repository exposes only four fictional stores and eight fictional products through `mockDiscoveryAdapter`; there is no approved HTTP discovery contract.
- Locations are retained because they exist in the validated fixture. Name sorting is local and deterministic because no backend sorting contract exists.
- There are no verified supplier image assets. Existing code-native botanical illustrations remain deliberately generic rather than presenting generated imagery as authentic supplier media.
- `/products/:slug` remains route-compatible with a minimal truthful presentation; its full redesign belongs to Phase 05.
- Pagination/infinite loading is omitted because neither the fixture nor a backend contract defines it.

## Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run test -- --run`: passed, 23 files / 209 tests.
- `npm run build`: passed. Vite reports existing Zod annotation warnings and a 598.35 kB minified JavaScript chunk warning.
- `npm run test:release`: passed, 9 scenarios; `npm run verify:release`: passed.
- Focused Chrome verification covered discovery, discovery review, public navigation and the editorial homepage. The first application run passed 22/33 and exposed count wording, missing-detail heading and accessible-name defects; after correction, the affected 25-test set passed 24/25 and its remaining URL-history timing assertion passed on focused rerun. The six-width shop matrix then passed 6/6 with axe and overflow checks at 320, 360, 390, 768, 1024 and 1440 px.
- The 390 px and 1440 px full-page captures were visually inspected for hierarchy, clipping, card layout, control visibility and footer behavior. Playwright run artifacts remain under `frontend/test-results/` and are intentionally not treated as durable source assets.

## Remaining risks

- Live prices, currency, availability, ratings, feedback, fulfilment, delivery, contact data and supplier media remain blocked on approved backend/media contracts.
- Production bundle code splitting remains a Phase 13 performance concern.
- Phase 05 must replace the compatibility product-detail presentation without reintroducing product categories.
