# Phase 04 — Marketplace Discovery, Search, Shop Listing and Shop Profile

Implement all actual browse/search/store screens according to existing backend contracts. This is a **marketplace**, not a single-florist shop.

1. Shop directory with editorial page heading, result count, responsive grid/list of well-designed store cards, verified store imagery, name, location, accurate badges/categories, optional ratings only if real.
2. Filters: shop name/search, available **shop categories** (multi-category associations), location if supported, sorting options only when backend supports. Provide applied filter chips, clear-all, URL-driven query state to preserve navigation/shareability, correct back/forward behavior and honest no-results state.
3. Products browse/search: product cards with store source, currency/price, availability, and sorting/filtering based on real searchable fields; **never attach product categories**. Product search may filter by store, variant attributes, price and availability if supported.
4. Mobile browse experience: accessible filter bottom sheet/drawer with Apply/Clear, visible active filter count and sticky sort/filter affordance without obscuring results. Desktop has compact sidebar or toolbar depending on context.
5. Shop details: large authentic cover/hero, store name, description, contact/location, store categories, verified fulfilment methods, product grid, store feedback if API exists and approved. Clear CTA to browse shop products. No invented operating hours or delivery area.
6. Add pagination/infinite load only if matching current backend conventions. TanStack Query caching/stale state, abort/cancel handling, clear loading skeletons, retry affordance, empty state.
7. Keyboard and screen reader access: filter labels, announced results, stable focus when filters change, and no nested click targets.

**Acceptance tests:** store-wise filters actually affect data, URL state survives reload, sorting is deterministic, categories belong to shops, 360px filter sheet works, no product-category references, errors and zero results are credible.
