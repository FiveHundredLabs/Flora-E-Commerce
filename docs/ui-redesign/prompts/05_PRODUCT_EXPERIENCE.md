# Phase 05 — Luxury Product Detail, Variant Selection and Add-to-Cart

Replace existing product details with a visually premium yet high-converting page, preserving actual variant and inventory contracts.

- Breadcrumb shop → product, prominent image gallery with good visual hierarchy, thumbnail navigation and accessible modal zoom if genuinely useful. Accurate alt text and image fallback. Avoid unlicensed synthetic gallery content.
- Product information: descriptive title, supplier/store link, product copy, actual price/price range, clear stock/availability state and size/color/wrapping/add-on selectors only as supported by current APIs.
- Correct variant selection state: no invalid combinations, update SKU/variant and price/stock from actual data; show selected attributes, availability per store location when relevant, and concise field-level validation. Add-ons update totals only using real pricing rules.
- Clear primary add-to-cart and secondary navigation to store. Disable invalid/unavailable combinations; handle server price/stock rejection gracefully. Use pending button and successful feedback without duplicate submits.
- Shop identity, delivery vs pickup information conditioned on confirmed provider/store settings; display fees/ETA only when verified; no fake countdown or scarcity.
- On mobile: image gallery above details, visible price, accessible fixed/sticky add-to-cart action only if it does not obstruct content and keyboard controls; bottom sheet for options if needed. On desktop: gallery left, buying summary right, restrained white space.
- Related items or other items from this shop from actual API; never imply same-store checkout for items from different shops.
- Add unit/component tests for selector validation, price rendering, disabled add-to-cart and backend error handling.

**Pass when:** variant selection genuinely changes sellable item, inventory prevents invalid purchase, one cart line refers to the correct store/product/variant/add-ons, UI is elegant and functional at 360px.
