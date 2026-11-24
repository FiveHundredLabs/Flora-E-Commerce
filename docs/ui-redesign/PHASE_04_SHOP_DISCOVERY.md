# Phase 04 — Marketplace discovery verification

Updated 2026-11-23. Phase 04 implements requirements **C-01** and **F-01** within the currently available development-fixture contract.

## Delivered scope

- `/shops` is an editorial supplier directory with deterministic name sorting, shop-name search, multi-category shop filtering, supported-location filtering, applied chips, URL state, result announcements, and credible loading/error/empty states.
- `/shops/:slug` presents the supplier fixture's actual name, description, location, categories and owned products. It explicitly discloses that contact details, hours, fulfilment methods and delivery area are unavailable.
- `/products` supports product text search plus owning-store and store-location filters. Product categories were removed from the discovery model and all category navigation now targets shop discovery.
- Product cards expose their owning store and explicitly mark price and availability as unavailable. No ratings, stock, delivery, feedback or contact facts are fabricated.
- Mobile discovery uses a native modal filter dialog with Apply/Clear controls, active-filter count and focus restoration; desktop retains a compact sidebar.
- Homepage shop-category discovery uses an eight-item visual rail: Bouquets, Plants, Stems, Roses, Orchids, Gift Sets, Wedding Flowers and Dried Flowers. The compact cards fit in one desktop row and use horizontal touch/keyboard browsing at narrower widths.
- Homepage discovery order now moves from Categories into supplier-store discovery before presenting the sample product catalog, keeping store identity ahead of individual items.
- The homepage supplier section is titled “Our Shops” and displays ten fictional stores in an equal-size responsive card grid: three columns on desktop, two on tablet and one on mobile.
- TanStack Query remains the owner of remote-style fixture state, including cancellation, refresh, retry and schema validation. No API route, pagination convention or backend capability was invented.

## Assumptions and constraints

- The repository exposes ten fictional stores and eight fictional products through `mockDiscoveryAdapter`; there is no approved HTTP discovery contract.
- The expanded category labels are fictional shop-category samples requested for the local preview. They do not establish a finalized production taxonomy and are never assigned to products.
- Locations are retained because they exist in the validated fixture. Name sorting is local and deterministic because no backend sorting contract exists.
- There are no verified supplier image assets. Existing code-native botanical illustrations remain deliberately generic rather than presenting generated imagery as authentic supplier media.
- Homepage category and shop photography is remote sample imagery discovered through Google image search and hosted by Unsplash. It is presentation-only, does not represent the fictional suppliers, and falls back to code-native illustrations when unavailable.
- Local production preview allows only `https://images.unsplash.com` in addition to self/data image sources. Scripts and connections remain self/none restricted; a production host must independently review and apply its CSP.
- `/products/:slug` remains route-compatible with a minimal truthful presentation; its full redesign belongs to Phase 05.
- Pagination/infinite loading is omitted because neither the fixture nor a backend contract defines it.

### Sample image references

- Categories: [Roses](https://unsplash.com/photos/a-person-holding-a-bouquet-of-red-roses-xP0RKsjaY0U), [Orchids](https://unsplash.com/photos/un-bouquet-de-fleurs-qui-sont-a-linterieur-dun-batiment-PRnaoz8KPv8), [Gift Sets](https://unsplash.com/s/photos/flower-gift), [Wedding Flowers](https://unsplash.com/photos/a-bride-holding-a-bouquet-of-white-flowers-nG0NTufuJWY), [Dried Flowers](https://unsplash.com/photos/a-collection-of-dried-flowers-on-a-white-surface-1ICCvx5wRnA).
- Shops: [Garden Notes](https://unsplash.com/photos/flower-shop-interior-with-floral-bouquets-Qk5ZKKPJ5H8), [Cedar & Bloom](https://unsplash.com/photos/dried-flowers-next-to-a-framed-hc7zUpHeH8A), [Orchid Lane](https://unsplash.com/photos/a-large-white-flower-in-a-green-house-Heq_G_tzd1w), [Moss & Petal](https://unsplash.com/photos/lush-greenhouse-filled-with-diverse-plants-and-flowers-AUgafD40Ckw), [Rosewood Florals](https://unsplash.com/photos/a-person-holding-a-bouquet-of-red-roses-xP0RKsjaY0U), [Wildflower Atelier](https://unsplash.com/s/photos/wildflowers), [Everleaf Studio](https://unsplash.com/s/photos/plant-shop). The inherited Petal Room food image was replaced with this verified [flower-shop display](https://unsplash.com/photos/a-display-of-flowers-in-a-flower-shop-AZ7tXcQcchg).

## Verification

- 2026-11-23 homepage discovery follow-up: typecheck, lint, all 235 unit/component tests, the production build and nine release scenarios passed. The focused homepage, discovery and release Playwright suites passed 21/21 across 320, 360, 390, 768, 1024 and 1440 px, including axe, overflow, forced-colors, reduced-motion, enlarged-text, image loading, security headers, filtering, history and route-link assertions.
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
