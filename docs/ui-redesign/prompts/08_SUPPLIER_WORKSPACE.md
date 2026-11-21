# Phase 08 — Supplier Workspace Shell, Onboarding, Profile and Overview

Build a dedicated **merchant productivity interface**, not a copy of the editorial homepage. Use the same five brand colors, typography tokens and small premium details, with compact accessible tables and forms.

- Sidebar navigation appropriate to supplier role: Overview, Products, Inventory, Orders, Sales, Store Profile, Settings only if supported. Mobile navigation drawer and topbar account/action menu.
- Supplier pending/approved/rejected/disabled access states from actual backend. An unapproved merchant cannot enter protected operational pages because a frontend menu is hidden; retain backend enforcement.
- One supplier → one store. **Do not add multi-store switcher**. Overview page identifies store and status; cards for actual orders/sales/low stock only when real data available, with date range meaning and reliable zero states.
- Practical work queue: actionable order statuses and products needing attention, derived from API data; avoid invented statistics or decorative chart numbers.
- Store profile editor: store identity, description, logo/cover imagery, location, contact, store categories, delivery/pickup settings if backend supports; use forms with Zod validation and safe unsaved-changes behavior.
- Onboarding/registration screen according to confirmed approval workflow and current required data; do not fabricate legal fields or automatic approval behavior.
- Responsive operational UI: desktop content ~full width of shell, logical tab order, dialogs with robust focus, mobile cards for dense data where needed.

**Definition of done:** supplier shell and core profile/overview work with real auth/data, one-store invariant honored, good mobile usability, role access verified and no fabricated KPIs.
