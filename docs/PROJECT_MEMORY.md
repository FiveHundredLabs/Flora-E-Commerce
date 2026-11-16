# Flower & Flora Project Memory

Last reviewed: 2026-11-16

## Current state

- FE-0101 is complete: npm 11 workspace/lockfile, strict TypeScript, routing/pages, Query provider/error boundary, ESLint, Vitest/RTL/MSW, Playwright/axe and CI configuration. See `FE-0101_FOUNDATION.md` for its original validation evidence.
- FE-0102 is complete within foundation scope: typed AsyncRegion, retry focus recovery, route titles/focus and Query integration/accessibility tests. See `FE-0102_FOUNDATION_REVIEW.md` for original evidence and manual NVDA/VoiceOver release follow-up.
- FE-0201 is complete within the design-system foundation slice: provisional neutral tokens; three shells; native form/content/navigation/modal primitives. Original supplier/admin layouts contained no account data; supplier now has the fictional FE-0501 workspace and admin remains a layout preview. See `FE-0201_DESIGN_SYSTEM.md` for original inventory and evidence.
- FE-0202 is complete: shell-level Query/Zod tests, native dialog synchronization, E2E flag forwarding and forced-colors review. Original evidence: `FE-0202_DESIGN_SYSTEM_REVIEW.md`.
- FE-0301 is complete as a labeled mock discovery slice: four fictional stores/eight products, store/product lists/details, URL filters and ownership navigation. Provisional vocabulary and original evidence: `FE-0301_CUSTOMER_DISCOVERY.md`.
- FE-0302 is complete: stable filter focus/history, Query validation, initial/refresh states and cancellation/accessibility regressions. Original evidence: `FE-0302_DISCOVERY_REVIEW.md`; cached-content policy is for public samples only.
- FE-0401 is complete as an in-memory mock slice: Redux cart references/quantities/revisions, per-store checkout, pickup/delivery/provider preferences, sample orders/payment presentation and delivered capability-enabled feedback. Snapshots preserve other stores and edited lines; failed/mismatched writes never consume cart intent and mutations do not auto-retry. Original validation: clean install, typecheck/lint/build, 72 unit/component tests, full 64-test Chrome suite and final 12-test commerce regression; production dependency audit clear. See `FE-0401_CUSTOMER_COMMERCE.md`. Refresh resets demo state; no real prices, charges, bookings or publication. OD-03–OD-11 details, live/auth/branding and manual AT/cross-browser testing remain open.
- FE-0402 is complete within mock commerce scope: feedback confirmation resets on edits; receipts match order/comment; duplicate/malformed order data fails safely. Store-keyed checkout editors isolate preferences and detach stale navigation while hook-level reconciliation handles late receipts. Lost-focus recovery preserves drafts/cart intent. Added 13 unit/component cases and four browser journeys; original typecheck/lint/build, all 85 unit/component tests and all 68 Chrome tests passed. Narrow axe/overflow/visual review used 320px, forced colors, reduced motion and CSS text enlargement. Evidence and jsdom/manual-AT limitations: `FE-0402_COMMERCE_REVIEW.md`. No dependency or live contract changes.
- FE-0501 is complete within mock supplier scope: `/supplier` now exposes an isolated fictional workspace for application/profile, unpublished products/variants, stock counts, capability-gated order notes and sample order/unit summaries. Registration creates no real account or approval request; supplier changes do not publish into discovery or change customer commerce. Query owns validated snapshots; local revisions reject stale writes, and save failures retain inputs. Confirmed variant removal restores focus after the dialog releases the inert background. Original typecheck/lint/production build, 105 unit/component tests (20 new) and all 89 Chrome tests (21 new) passed. Responsive axe/overflow checks and product/inventory screenshots at 320/1440px were reviewed. No dependencies or live contracts changed. See `FE-0501_SUPPLIER.md` for remaining approval/auth/media/fulfilment/reporting and manual-AT limits.
- FE-0502 is complete within mock supplier scope: background read failures retain the allowed fictional snapshot and mounted drafts, with safe refresh/retry progress and lost-focus recovery, including instant settlement. Receipt validation associates requested effects/targets and revision; older writes cannot replace a denied or newer cached snapshot. Adapter-keyed editors isolate drafts/late callbacks; read cancellation protects acknowledged cache data. Removal has immediate duplicate protection, progress and explicit failure retry. Added 17 component cases and four browser journeys; typecheck/lint/build, all 122 unit/component tests and all 93 Chrome tests passed. Narrow stock/note validation received axe/overflow, forced-colors/reduced-motion and 200% CSS text/screenshot review. Cached-content behavior applies to fictional fixtures, not production authorization/private data. Evidence and local jsdom modal/manual-AT limits: `FE-0502_SUPPLIER_REVIEW.md`. No dependencies or live contracts changed. FE-0601 has not started.
- Production dependency audit is clear; seven moderate development-only TypeScript ESLint/minimatch findings and ESLint 9 support status remain tracked tooling risks.
- Owner approval on 2026-11-14: multi-store cart with separate checkout per store; PayHere payment gateway; PickMe and Uber Connect through backend-controlled APIs. See `OPEN_DECISIONS.md` for exact scope. Other proposals in `PRIORITY_REMEDIATION.md` remain unapproved; no live API access is established.
- The intended stack is React 19, Vite, TypeScript strict mode, React Router v7, TanStack Query, Redux Toolkit only for truly shared client state, Zod, Vitest, React Testing Library/MSW, and Playwright.
- No backend API contract is supplied. The DBML is a conceptual PostgreSQL reference only: 41 tables and 19 enums. It must not be exposed directly as browser/API contracts.
- As of 2026-11-15, Git status/diff are available. Earlier notes about absent Git metadata are historical.

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
