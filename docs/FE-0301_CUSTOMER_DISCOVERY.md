# FE-0301 — Customer discovery

Date: 2026-11-15. Requirements: C-01 (store/product discovery and detail), F-01 (sorting/filtering). Dependency: validated FE-0202.

## Delivered scope

`features/discovery/` owns mock catalog vocabulary, Zod schemas, adapter, Query hook, URL parsing/selectors, filter form, cards, illustrative art and page content. Its public entry point is imported by `pages/DiscoveryPage.tsx`; shared code does not import features. No dependencies were added.

| Frontend route | Behavior |
|---|---|
| `/` | Clearly labeled entry points to the sample catalog |
| `/shops` | Store listing with sample search/category/location/sort filters |
| `/shops/:slug` | Description, sample location/categories, contact-unavailable state and only that shop's products |
| `/products` | Product listing with the same provisional filter vocabulary |
| `/products/:slug` | Description/category, illustration, owning-shop link and missing-detail recovery |

These are browser routes, not proposed HTTP endpoints. Four fictional stores and eight products are isolated behind `api/mock.ts`; every discovery page labels the catalog MOCK/fictional/browsing-only. Zod parses fresh fixture copies and checks uniqueness/store references. AbortSignal is honored before/after the async boundary; there is no fake latency timer or network request. TanStack Query owns catalog lifecycle/cache with an adapter-specific key.

## Provisional UI rules — not business signoff

OD-07, OD-09 and OD-10 remain open. Sample categories (bouquets/plants/stems), locations (Colombo/Kandy), slugs and name sorting are fixture/UI examples only. They do not establish real shops, service areas, approved taxonomy, API schemas or search capabilities. No prices/currency, stock, ratings, contact PII, cart or purchase actions are invented. Original decorative SVG studies are not product photos or approved brand assets.

Final API wiring, public slug/id behavior and filter fields require backend/product approval. Catalog permissions are not guessed: these fixtures are public sample records, with no authenticated or provider operations.

## URL and form contract

- `q`: trimmed sample-name/description substring, case insensitive, UI maximum 100 characters.
- `category`: empty or sample category key.
- `location`: empty or sample location key; product filtering looks up the owning shop's sample location.
- `sort`: `name-asc` (default) or `name-desc`, using explicit English name comparison.
- Defaults are omitted when serializing; unrelated keys are ignored. Invalid values/duplicate recognized keys fall back per field, with a visible invalid-URL notice. Rejected raw values are not printed.
- Inputs are local drafts until Apply filters. Zod validates search submission; invalid input is described and focused. Clear resets applied and unapplied drafts. Browser history/deep links reconstruct control state.
- List-to-detail links retain the list query. Breadcrumb/Back links reconstruct a validated relative list URL. Owning-shop and shop-product links provide normal cross-discovery navigation. Browser back/forward and reload preserve URL state.

These UI rules may change after OD-07 approval; they are not approved backend pagination/search semantics. The small mock dataset is fully listed without speculative pagination.

## State, accessibility and review

Listings/details use shared loading/error/retry/empty presentation. Retry hides the action while fetching without cached data. Missing records show not-found headings and recovery links rather than fabricated content. Result counts use a polite status; detail titles update after data loads without stealing focus. Named links, form labels/descriptions, h1/h2/h3 hierarchy and responsive grids reuse the design system. Illustrations are decorative because item names/categories carry the content.

Tests cover schema failures, duplicates, orphan references, fixture isolation/cancellation, URL round trips/defaults/duplicates, sorting, sample location relationships, drafts/apply/clear, validation focus, safe retry recovery, store/product ownership and missing detail. Browser journeys cover navigation, deep links, filter restoration, reload/history, invalid queries and recovery. Axe/overflow checks cover four page types at 375/1440px. Desktop listing and mobile product-detail screenshots were manually inspected for wrapping and clipping.

No secrets, browser storage, raw error text, live fetch calls, external image/font requests or payment/provider actions were added. Dependency manifests/lockfile are unchanged. Existing audit findings, manual screen-reader/cross-browser testing and public storefront SEO review remain tracked. Zod build annotation warnings are emitted by the installed dependency; Rollup removes those comments and the build succeeds.

## Validation

- PASS: final `npm run typecheck && npm run lint && npm run test -- --run`: ten test files / 44 unit/component tests.
- PASS: final `npm run build`: JS 396.01 kB (122.49 kB gzip); CSS 8.88 kB (2.37 kB gzip). An earlier combined command reported completed checks/build output but exited with signal 143; checks and build were rerun separately and returned exit 0.
- PASS: full `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: 45 tests. After the final same-URL search-normalization correction, `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- discovery.spec.ts` passed all 11 discovery tests. Browser/preview execution required sandbox escalation. Builds and E2E ran sequentially.
- PASS: responsive axe/overflow checks on listing/detail pages, history/reload/invalid-URL recovery, and desktop/mobile screenshot inspection.
- PASS: `git diff --check` and direct source review of feature boundaries, safe mock content and absence of backend/provider calls.

FE-0301 is complete as a mock-only discovery slice. FE-0302 and later commerce tasks have not started. No hosted CI/deployment or backend contract approval is claimed.
