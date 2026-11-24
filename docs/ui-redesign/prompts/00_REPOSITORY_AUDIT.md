# Phase 00 — Real Repository Audit and Safe Redesign Migration

Read `docs/ui-redesign/CODEX_MASTER_PROMPT.md`, `DESIGN_SYSTEM.md`, `REQUIREMENTS_MAPPING.md`, `QUALITY_GATES.md` and the attached client document/reference image if accessible.

**Task:** Audit the actual existing project before deleting/replacing any UI. In this task, create an actionable redesign map and commit only safe preparatory changes.

1. Identify package manager, React/Vite/TS/router/Tailwind/shadcn versions, build/test scripts, lint config, aliases, asset strategy, fonts, deployed environment, routing and auth/session strategy.
2. Enumerate all actual public/customer/supplier/admin routes, corresponding entry files and shared components. Tag each route with role access, source hooks, backend dependency, current status and redesign phase.
3. Identify APIs and typed models for shops, shop categories, products, variants, per-location inventory, multi-store cart, per-store checkout, PayHere, delivery provider options/pickup, accounts/orders, reviews/refunds, supplier approval, image processing.
4. Check business assumptions against the current code: each supplier has one store; shop categories not product categories; cart may contain multiple shops but a single checkout belongs to one store.
5. Audit current UI styles, global CSS, legacy colors, reusable components and duplicated markup. Identify **presentation code safe to replace** vs business logic that must be preserved. Determine how to migrate without losing working functions.
6. Set up design-system integration plan, folder responsibilities and a screen-by-screen implementation ledger in `docs/ui-redesign/IMPLEMENTATION_STATUS.md`, with columns: route, phase, old component, API integration, new component, UX states, tests, screenshot status.
7. Propose feature folders compatible with existing conventions, e.g. `app/`, `features/storefront/`, `features/catalog/`, `features/checkout/`, `features/supplier/`, `features/admin/`, `components/ui/`, `lib/`, `layouts/`. Do not forcibly restructure if current structure is sound.
8. Establish a non-destructive migration sequence: shared design tokens, public shell, commerce core, customer, supplier, admin, quality. Call out backend contract gaps clearly.
9. If there is an existing test suite, run baseline scripts before changing presentation and record actual baseline failures. Do not fix unrelated business issues without necessity.

**Deliverables:** route and component inventory, architecture/migration decisions, prioritized issue register, created implementation status file, check outputs, ready-to-execute Phase 01 plan. **Do not redesign the homepage yet.**
