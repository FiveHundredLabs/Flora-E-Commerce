# Phase 11 — Super Admin Shell, Overview, Stores, Suppliers, Users and Categories

Build an elegant, trustworthy **marketplace operations console**: compact sans-first navigation, crisp tables, careful permissions, muted botanical palette. No oversized flowers in operational tables.

- Responsive protected `/admin` shell, sidebar sections grouped by task, consistent page header/breadcrumb, topbar profile and notification indicator only if backend supports notifications.
- Overview with real total stores/suppliers, customers, orders and payments if accessible; date filters and trend charts only if aggregate data exists. Show backend-loading, empty and error states. Avoid fabricated KPIs.
- Supplier approval queue: registration details, actual application state, clear approve/reject confirmation and reason if backend requires; show request outcomes and conflict/stale update handling.
- Store directory and status management, filters by category/location/status if supported, link from store to supplier profile. Enforce one-store-per-supplier assumption.
- Users/customer list with minimum authorized personal data and role/status controls only if current backend grants. No displayed PII beyond operational need; never include unimplemented impersonation controls.
- Shop category manager: name, description and category-to-store association if API supports. **Do not create product categories**. Surface any existing backend discrepancy as a blocker.
- Table component quality: real column sorting/filtering/pagination, good density, selection only for meaningful bulk actions, accessible row action menus and proper skeleton/empty/error states.
- Audit metadata for approvals/changes if backend supplies it; do not fake recorded histories.

**Acceptance:** real role authorization, correct data ownership, functional actions, no missing server responses hidden by mock state, responsive dashboards and tests covering approvals and 403/409 cases.
