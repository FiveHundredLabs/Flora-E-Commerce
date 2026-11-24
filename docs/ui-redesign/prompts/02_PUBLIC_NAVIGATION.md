# Phase 02 — Global Public Website Shell and Navigation

Read all project redesign docs and preserve actual application routes and auth contracts.

**Outcome:** A premium, intuitive global site frame with predictable navigation, search and identity.

Implement:
- Announcement/utility strip **only if content is confirmed** (avoid fake 'free delivery' promises).
- Main navigation on desktop with configured brand/logo, Shop Flowers, Explore Shops, useful store categories if available, About and Help/Contact if routes exist; real account/auth access, search, cart count. Do not add empty nav routes.
- Sticky-on-scroll or compact header only if it remains unobtrusive and stable. Use cream/white surfaces, deep-green marks, fine borders and correct focus states.
- Search overlay or full search entry: keyboard usable, submit to the actual search route, meaningful query, clear/reset, zero/no-results handling, no fake instant suggestions.
- Mobile navigation drawer with large touch targets and category hierarchy if actual data exists; Escape and focus return; cart and account always accessible.
- Footer with approved brand/story, real policies, useful site links, social links only when provided; newsletter only if a legitimate subscriber endpoint and consent copy exists. Otherwise do not show dead signup.
- Breadcrumb primitive and clean navigation transitions; loading/error fallbacks for shared data, avoid flicker. Account menu varies properly by role/authorization.
- SEO fundamentals for public pages: descriptive titles/meta where supported, canonical strategy based on actual deployment, accessible landmark headings, skip-to-content.
- Cart item count synced from existing state without duplicate API fetches.

**Verify:** desktop/mobile navigation flows, tab/shift-tab/escape, long menu labels, active routes, authenticated/unauthenticated cases, missing logo fallback. Record screenshots and tests if available.
