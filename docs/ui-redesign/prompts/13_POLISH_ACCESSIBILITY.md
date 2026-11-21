# Phase 13 — End-to-End Visual Polish, Accessibility and Performance

Audit every page created in Phases 01–12 at 360, 390, 768, 1024 and 1440px, plus 320px where reasonable. Work through mismatches and implement fixes.

1. Replace leftover legacy blue/terracotta CSS, duplicated components, ugly placeholder icons, inconsistent cards, orphaned page headings and visual spacing drift. Ensure luxury brand coherence without sacrificing admin density.
2. Inspect page-by-page screenshots (real browser when available). Confirm high-quality public composition, no crop/clipping, correct mobile image stacking, readable filters, stable sticky UI, no wide tables causing horizontal page overflow.
3. Audit color contrast with actual computed styles; known weak pairs are sage text on cream and gold text on cream. Use deep-green UI text or other validated semantic shades.
4. Keyboard and screen reader audit: heading/landmark hierarchy, all labels/errors, skip links, active tab selection, dialog focus return, drawer focus, alert status announcements, disabled semantics, product gallery keyboard behavior.
5. Review full UI state inventory: skeleton, no data, no results, 401, 403, 404, 409, 422, 500, offline/retry, pending/success/failed operations, sold out, unavailable fulfilment, payment pending and image processing failure.
6. Clean up images: licensed/owned assets, responsive srcset/sizes, explicit dimensions, lazy below fold, hero LCP priority, no broken URLs or layout shift.
7. Review public SEO: route titles, canonical, meta tags, crawlability under current Vite architecture, product structured data only if accurate; recommend SSR/SSG migration **only if genuine SEO requirements justify it**.
8. Check perf risk: initial payload size, route splitting, duplicated network calls, large images, long lists, expensive admin re-renders; optimize only with measured evidence.
9. Apply frontend security review: XSS risks, credentials, PII leaks, role-specific UI, signed URL handling, checkout integrity and token lifecycle.

**Deliver:** UX defect list with severity, fixed screenshots or documented exceptions, audits/results with actual tool logs, remaining risks with owners.
