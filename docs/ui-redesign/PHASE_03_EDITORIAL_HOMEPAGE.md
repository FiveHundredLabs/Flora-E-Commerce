# Phase 03 — Editorial homepage

Date: 2026-11-22  
Status: complete within the approved homepage and local-fixture scope

## Requirement trace and boundaries

- **C-01:** discovery content is presented from the existing `useDiscovery` TanStack
  Query boundary and its `DiscoveryAdapter`; no endpoint was added.
- **C-02:** supplier identity and the store-specific cart/checkout model remain visible.
  No live delivery, payment or order behavior is claimed.
- **F-01:** the page has responsive 320–1440px layouts, semantic landmarks and headings,
  keyboard-reachable registered-route actions, forced-colors support and reduced-motion
  compatibility.
- The existing mock adapter is the only available homepage data source. It contains four
  fictional stores and eight fictional products but no price, rating, stock, promotion,
  delivery eligibility or live availability fields. Those fields are not synthesized.
- Authentication, personalization, live search suggestions, subscriptions, testimonials,
  guarantees and support SLAs were not introduced.

## Delivered

- Replaced the rejected legacy homepage with an asymmetrical Botanical Editorial hero,
  fixture-derived category navigation, featured product records, supplier-store features,
  marketplace story, store-specific ordering explanation, campaign panel, capability
  disclosures and closing calls to action.
- Removed the homepage's fabricated prices, ratings, discounts, stock labels, free-shipping
  promise, freshness guarantee, 24/7 support, subscription form, testimonials and blog.
- Added loading, empty, retryable error and ready states through the existing shared async
  region. The optional adapter injection is a test seam, not a second data path.
- Kept all calls to action on existing routes: `/products`, `/shops`, category query URLs,
  existing product/store details, `/about` and `/contact`.
- Added explicit development-preview and capability language wherever the fixture could be
  mistaken for production commerce data.

## Editorial assets

The ImageGen skill was used in generation mode for three original, text-free photographic
assets. The prompts requested: (1) a cream-wall floral arrangement in a forest ceramic
vessel with left-side editorial negative space; (2) white anthurium, hellebore and ferns
against a deep-green campaign backdrop; and (3) hands arranging stems on a wooden worktable.
All prompts excluded text, logos, watermarks and brand marks.

Final optimized assets:

- `frontend/public/assets/editorial-home-hero.webp` — 1672 × 941
- `frontend/public/assets/editorial-home-story.webp` — 1672 × 941
- `frontend/public/assets/editorial-home-campaign.webp` — 1024 × 1536

The generated PNG working copies were moved to the recoverable session path
`/tmp/flower-flora-phase03-source-assets/`; WebP files are the maintained application assets.

## Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test -- --run` — passed: 23 files, 218 tests.
- `npm run build` — passed. Output: HTML 0.84 kB (0.47 kB gzip), CSS 118.24 kB
  (19.69 kB gzip), JS 624.59 kB (182.44 kB gzip).
- `PLAYWRIGHT_CHANNEL=chrome npx playwright test e2e/editorial-homepage.spec.ts` —
  passed: 8/8. This covers 320, 360, 390, 768, 1024 and 1440px, axe WCAG A/AA tags,
  horizontal overflow, local-image loading/dimensions, registered routes, forced colors,
  reduced motion and 200% body text.
- Shared regression: foundation 9/9 passed; design-system state and public-navigation
  checks passed 18/18 in the combined run. The initial combined run exposed one obsolete
  foundation selector for the removed legacy region; it was updated and the affected suite
  rerun successfully.
- `npm run test:release` — passed: 9/9 artifact scenarios. `npm run verify:release` —
  passed against the generated production manifest.
- Full configured Chrome run — 152/156 passed on the first run. Three homepage-related
  legacy assertions were then corrected and their 11-test affected selection passed 11/11.
  The remaining failure is the pre-existing `admin.spec.ts:24` fixture reload mismatch
  (`Fictional Stem Studio`), unrelated to the homepage and already recorded in Phases 01–02.
- Visual review completed at 390px and 1440px; saved evidence is linked from the
  implementation ledger.

Build warnings remain for the pre-existing greater-than-500 kB application chunk and two
Rollup annotation positions inside Zod. Neither warning was introduced as a runtime error.

## Remaining risks and Phase 04 readiness

- Discovery listing/detail pages still use their scheduled legacy card composition, which
  can display fixture commerce values. Phase 04 must replace those surfaces before treating
  the public catalog as truthful end to end.
- About and Contact retain legacy content and are not evidence for Phase 03 acceptance.
- A real backend contract is still required for price, stock, ratings, eligibility,
  fulfillment, payment, authentication and authorization.
- The production JS chunk remains above the configured warning threshold; route-level code
  splitting should be addressed in the later performance phase.

Phase 04 can begin against the existing typed discovery adapter and registered route model.
It must preserve the explicit fixture labeling and must not reintroduce invented commerce
facts through the legacy `ProductCard`.
