# Flower & Flora Project Memory

Last reviewed: 2026-11-14

## Current state

- A minimal FE-0101 frontend foundation now exists with root workspace scripts, strict TypeScript, routing, Query provider, linting, component tests and a Playwright smoke scenario. Full marketplace features are not implemented.
- Owner approval on 2026-11-14: multi-store cart with separate checkout per store; PayHere payment gateway; PickMe and Uber Connect through backend-controlled APIs. See `OPEN_DECISIONS.md` for exact scope. Other proposals in `PRIORITY_REMEDIATION.md` remain unapproved; no live API access is established.
- The intended stack is React 19, Vite, TypeScript strict mode, React Router v7, TanStack Query, Redux Toolkit only for truly shared client state, Zod, Vitest, React Testing Library/MSW, and Playwright.
- No backend API contract is supplied. The DBML is a conceptual PostgreSQL reference only: 41 tables and 19 enums. It must not be exposed directly as browser/API contracts.
- The workspace is not currently a Git repository, so diff/status/release-history checks are unavailable until version control is initialized or the repository root is corrected.

## Product scope

Flower & Flora is a multi-supplier floral marketplace with separate customer, supplier/store, and super-admin surfaces.

- Customer: browse/search stores and products, cart/checkout, delivery or pickup, payment outcome, order history/tracking, and post-delivery store feedback.
- Supplier: registration/profile, products/variants/images, inventory/availability, incoming orders/fulfilment, and basic sales overview.
- Super Admin: dashboard, supplier/user/category management, order/payment/refund oversight, and feedback moderation.
- Mentioned external services (Uber Connect, PickMe Flash, payment gateway, S3, n8n) remain backend/provider concerns until contracts and approvals exist.
- Explicitly out of scope unless separately approved: loyalty, coupons/promotions, live driver tracking, supplier commission/payout automation, multi-currency, and advanced analytics.

## Requirement traceability

- `C-01` to `C-04`: customer discovery, commerce, order/payment status, and feedback.
- `S-01` to `S-03`: supplier registration/profile, catalog/inventory, and order/sales management.
- `M-01`: authorized flora image upload/processing state.
- `D-01`: delivery provider and store-pickup options when available.
- `P-01`: payment status and refund request/review UI.
- `A-01`: super-admin oversight and moderation.
- `F-01`: agreed store-wise and order-wise filtering/sorting.

## Non-negotiable implementation rules

- Do not invent routes, DTOs, endpoints, permissions, payment states, provider behavior, or business rules.
- Until OpenAPI/auth decisions are approved, isolate clearly labeled `MOCK` adapters behind feature APIs.
- Use feature-first boundaries: `app/` composition, `pages/` route composition, `features/` business modules, and `shared/` primitives/API/utilities. Shared must not import features; avoid direct feature-to-feature deep imports.
- Remote data belongs to TanStack Query; local interaction state stays in components; Redux is limited to cross-route client state such as cart coordination or session metadata.
- Prefer HttpOnly Secure SameSite cookies; never store refresh tokens, credentials, or secrets in localStorage or frontend environment variables.
- Backend enforces authentication, RBAC, ownership, supplier isolation, and CSRF policy. Frontend guards are UX only.
- Every async page/feature needs loading, empty, error, permission-denied, responsive, and accessible states. Target WCAG 2.2 AA.
- Client validation is for UX; backend remains authoritative. Use Zod at untrusted boundaries and do not use `any` without a documented exception.
- Never claim checks passed unless they were actually run; report missing scripts as blockers.

## Open decisions blocking final behavior

OD-02 business behavior is resolved: preserve items across stores and check out one store at a time. OD-03/04 are partially resolved by selecting PickMe and Uber Connect APIs; fees, coverage, exact PickMe product and access remain pending. OD-05 is partially resolved by selecting PayHere; currency, methods and flow remain pending. OD-01 and OD-06–OD-13 remain open. No decision on branding or backend/auth contracts was supplied.

Use neutral states or labeled mocks until each relevant decision is signed off. The three visual directions—Botanical Green, Floral Blush, and Lavender Bloom—are proposals, not approved branding.

## Delivery sequence

1. `FE-0101`: scaffold Vite/React/TypeScript, routing, providers, and test harness.
2. `FE-0102`: foundation tests, async states, and accessibility review.
3. `FE-0201`/`FE-0202`: tokens, shells, shared components, and their tests.
4. `FE-0301`/`FE-0302`: customer discovery.
5. `FE-0401`/`FE-0402`: customer commerce.
6. `FE-0501`/`FE-0502`: supplier features.
7. `FE-0601`/`FE-0602`: super-admin features.
8. `FE-0701`/`FE-0702`: approved integrations, auth, hardening, deployment, and final tests.

Do not start a dependent task before the preceding task is validated. Before implementation, record requirement IDs, assumptions, impacted files, acceptance criteria, tests, and contract dependencies.

## Validation baseline

Once the frontend is scaffolded and scripts exist, run and record:

```text
npm run typecheck
npm run lint
npm run test -- --run
npm run build
npm run test:e2e
```

The E2E command applies only when a configured Playwright environment exists. Also perform accessibility, responsive, security/PII, dependency, and production smoke checks before release.

## Authoritative references

Read `AGENTS.md` first, then `README.md`, `docs/PROJECT_CONTEXT.md`, `docs/PRODUCT_REQUIREMENTS.md`, `docs/OPEN_DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, the relevant task in `docs/TASKS.md`, and `docs/TESTING.md`. Role prompts are in `.agent/agents/`; project rules are in `.agent/rules/`; workflows are in `.agent/workflows/`. `CODEX.md` and `ANTIGRAVITY.md` are adapters and do not override `AGENTS.md`.
