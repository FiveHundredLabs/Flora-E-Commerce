# Task backlog

All tasks require `AGENTS.md` workflow and `docs/TESTING.md` gates. Tasks marked BLOCKED must not be completed with invented business rules.

## Phase 1: Foundation

### FE-0101 — Scaffold Vite React TS, tooling, router, providers, test harness
- **Status (2026-11-15): COMPLETE.** Foundation extended and validated. Evidence, reviewed limitations and dependency decisions: `docs/FE-0101_FOUNDATION.md`.
- **Objective:** Scaffold Vite React TS, tooling, router, providers, test harness.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 1; exact paths determined after inspection.
- **Dependencies:** none.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

### FE-0102 — Implement feature-level tests, error/empty/loading states and accessibility review
- **Status (2026-11-15): COMPLETE within foundation scope.** Shared async states, Query integration tests, route focus/title recovery and accessibility review delivered. Typecheck/lint/build, 14 unit/component tests and 14 Chrome browser tests passed. Evidence and manual assistive-technology follow-up: `docs/FE-0102_FOUNDATION_REVIEW.md`.
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 1; exact paths determined after inspection.
- **Dependencies:** FE-0101.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

## Phase 2: Design system

### FE-0201 — Tokens, shell layouts, shared components, accessibility baseline
- **Status (2026-11-15): COMPLETE within the design-system foundation slice.** Provisional semantic tokens, three responsive audience shells, native UI primitives and accessibility baseline implemented. Typecheck/lint/build, 19 unit/component tests and 25 Chrome browser tests passed. Component inventory, preview-route limits and follow-ups: `docs/FE-0201_DESIGN_SYSTEM.md`.
- **Objective:** Tokens, shell layouts, shared components, accessibility baseline.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 2; exact paths determined after inspection.
- **Dependencies:** FE-0102.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

### FE-0202 — Implement feature-level tests, error/empty/loading states and accessibility review
- **Status (2026-11-15): COMPLETE within implemented design-system scope.** Shell-level async/validation tests, native dialog state fix, E2E argument forwarding and forced-colors review delivered. Typecheck/lint/build, 24 unit/component tests and 34 Chrome browser tests passed. Evidence and assistive-technology limits: `docs/FE-0202_DESIGN_SYSTEM_REVIEW.md`.
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 2; exact paths determined after inspection.
- **Dependencies:** FE-0201.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

## Phase 3: Customer discovery

### FE-0301 — Store/product listing and detail, URL-driven filters
- **Status (2026-11-15): COMPLETE as a labeled mock-only slice.** Store/product lists and details, owning-shop navigation, URL filters and history recovery implemented. Typecheck/lint/build and 44 unit/component tests passed; full 45-test Chrome suite passed, plus final 11-test discovery regression after normalization. OD-07/09/10 remain open. Evidence/rules: `docs/FE-0301_CUSTOMER_DISCOVERY.md`.
- **Objective:** Store/product listing and detail, URL-driven filters.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 3; exact paths determined after inspection.
- **Dependencies:** FE-0202.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

### FE-0302 — Implement feature-level tests, error/empty/loading states and accessibility review
- **Status (2026-11-15): COMPLETE within mock discovery scope.** Stable filter focus/history, adapter-boundary validation, initial/refresh states, cached retry recovery and cancellation regressions implemented. Final typecheck/lint/build, 56 unit/component tests and 52 Chrome browser tests passed. Evidence/limits: `docs/FE-0302_DISCOVERY_REVIEW.md`.
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 3; exact paths determined after inspection.
- **Dependencies:** FE-0301.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

## Phase 4: Customer commerce

### FE-0401 — Cart, checkout shell, delivery/pickup, payment state, orders, reviews
- **Status (2026-11-15): COMPLETE as an in-memory mock slice.** Redux multi-store cart, per-store checkout preferences, safe sample-order creation/history/payment presentation and capability-gated sample feedback implemented. Clean install, typecheck/lint/build and 72 unit/component tests passed; full 64-test Chrome suite plus final 12-test commerce regression passed. Production audit clear. Original contracts/limits/evidence: `docs/FE-0401_CUSTOMER_COMMERCE.md`; subsequent review: FE-0402 below.
- **Objective:** Cart, checkout shell, delivery/pickup, payment state, orders, reviews.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 4; exact paths determined after inspection.
- **Dependencies:** FE-0302.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

### FE-0402 — Implement feature-level tests, error/empty/loading states and accessibility review
- **Status (2026-11-15): COMPLETE within mock commerce scope.** Added 13 unit/component cases and four browser journeys; fixed stale feedback confirmation, receipt association, store-switch checkout lifecycle and lost-focus recovery. Strengthened order response validation. Typecheck/lint/build, all 85 unit/component tests and all 68 Chrome tests passed, including narrow axe/overflow checks and screenshot review. Original evidence/limits: `docs/FE-0402_COMMERCE_REVIEW.md`; subsequent supplier implementation is recorded below.
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 4; exact paths determined after inspection.
- **Dependencies:** FE-0401.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

## Phase 5: Supplier

### FE-0501 — Registration/profile, products, variants, inventory, orders, sales
- **Status (2026-11-16): COMPLETE within mock supplier scope.** Isolated sample application/profile, unpublished product/variant CRUD, stock counts with stale-write rejection, capability-gated fulfilment notes and basic order/unit summaries implemented. Typecheck/lint/production build, 105 unit/component tests and all 89 Chrome tests passed; responsive axe/overflow and product/inventory screenshot review completed. Supplier approval, live registration/auth, publication, media, order transitions and revenue remain contract-dependent. Original evidence: `docs/FE-0501_SUPPLIER.md`; subsequent review is recorded below.
- **Objective:** Registration/profile, products, variants, inventory, orders, sales.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 5; exact paths determined after inspection.
- **Dependencies:** FE-0402.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

### FE-0502 — Implement feature-level tests, error/empty/loading states and accessibility review
- **Status (2026-11-16): COMPLETE within mock supplier scope.** Added 17 feature tests and four browser journeys; fixed background-refresh draft loss, receipt association, late-write denial recovery, adapter isolation and instant-retry focus. Strengthened removal progress/double-submit/error recovery. Typecheck/lint/build, all 122 unit/component tests and all 93 Chrome tests passed; narrow enlarged-text axe/overflow checks and stock/note screenshot review completed. Original evidence/limits: `docs/FE-0502_SUPPLIER_REVIEW.md`; subsequent admin implementation is recorded below.
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 5; exact paths determined after inspection.
- **Dependencies:** FE-0501.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

## Phase 6: Super admin

### FE-0601 — Supplier/user/category management, order/refund/review oversight
- **Status (2026-11-16): COMPLETE within mock admin scope.** Added isolated supplier/user/category/order/refund/feedback lists/details, sample supplier/user label edits, category CRUD and capability-gated oversight notes. Operational approval/account/refund/moderation actions remain contract-dependent. Typecheck/lint/build, 149 unit/component tests and all 124 Chrome tests passed, including responsive axe/overflow and screenshot review. Original evidence/limits: `docs/FE-0601_ADMIN.md`; subsequent review is recorded below.
- **Objective:** Supplier/user/category management, order/refund/review oversight.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 6; exact paths determined after inspection.
- **Dependencies:** FE-0502.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

### FE-0602 — Implement feature-level tests, error/empty/loading states and accessibility review
- **Status (2026-11-16): COMPLETE within mock admin scope.** Added 20 feature tests and four browser journeys; fixed denied-cache recovery after late write failure, unrelated receipt changes and stale empty-list detail entry. Reviewed cancellation, workspace/record isolation, missing/error/empty recovery, native modal keyboard behavior and enlarged-text validation. Typecheck/lint/build, all 169 unit/component tests and all 128 Chrome tests passed, including axe/overflow and screenshot review. Original evidence/limits: `docs/FE-0602_ADMIN_REVIEW.md`; subsequent FE-0701 readiness work is recorded below.
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 6; exact paths determined after inspection.
- **Dependencies:** FE-0601.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

## Phase 7: Integrations and hardening

### FE-0701 — Approved API wiring, auth, media processing status, security, E2E, deployment
- **Status (2026-11-16): PARTIAL — local hardening validated; live integration/auth/media/hosted deployment BLOCKED.** Added mock-only public-config guard, preview security headers, artifact manifest/verification/restore checks and CI release gates. Original typecheck/lint/build, 177 unit/component tests, five direct artifact scenarios, all 131 Chrome tests and production audit (zero vulnerabilities) passed. No approved OpenAPI/auth/CSRF/media contract or hosting target exists; do not infer endpoints, media states, permissions or deployment approval. Required references were requested from the owner. Evidence/handoffs: `docs/FE-0701_INTEGRATIONS_HARDENING.md`. The owner subsequently requested FE-0702's independent local review; that does not unblock live acceptance or complete this task.
- **Objective:** Approved API wiring, auth, media processing status, security, E2E, deployment.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 7; exact paths determined after inspection.
- **Dependencies:** FE-0602.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

### FE-0702 — Implement feature-level tests, error/empty/loading states and accessibility review
- **Status (2026-11-16): PARTIAL — independently requested local review VALIDATED; live acceptance BLOCKED by incomplete FE-0701.** Added four artifact scenarios (nine total) and six browser checks; fixed missing bootstrap acceptance, reserved-asset HTML/200 fallback and blank first-load/JavaScript-disabled recovery. Supported preview startup now verifies the artifact. Typecheck/lint/build, 177 unit/component tests, nine artifact scenarios and all 137 Chrome checks passed, including recovery axe/overflow and visual review. No API/auth/media/provider/host contracts or approvals were invented. Evidence/dependency limits: `docs/FE-0702_RELEASE_REVIEW.md`. Do not mark the whole task complete until remaining live scope is available and validated.
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 7; exact paths determined after inspection.
- **Dependencies:** FE-0701.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.

## Botanical Editorial redesign (2026-11-21)

This migration has separate Phase 00–14 numbering; it does not replace historical
FE task acceptance or unblock FE-0701 live integrations.

- **UI-R00 — COMPLETE within audit scope:** current architecture, 36 route entries,
  component/contract inventory, prioritized gaps, migration boundaries and Phase 01
  execution plan recorded in `ui-redesign/REPOSITORY_AUDIT.md` and
  `ui-redesign/IMPLEMENTATION_STATUS.md`. Documentation-only preparatory changes;
  no homepage or runtime redesign. Actual baseline checks and limitations:
  `ui-redesign/PHASE_00_VERIFICATION.md`.
- **UI-R01 — COMPLETE within foundation scope:** semantic tokens, accessible shared
  primitives, dependency-free public/dashboard frames and a development-only design
  library implemented. Phase 00 shell-rendering, admin-link naming and status-contrast
  failures were corrected. Typecheck/lint, 215 unit/component tests, production build,
  nine artifact scenarios and 11 focused Chrome checks passed; 70/71 affected production
  regressions passed, with one pre-existing admin fixture reload mismatch recorded in
  `ui-redesign/PHASE_01_FOUNDATION.md`. Existing feature pages
  retain legacy composition for their scheduled phases. Live API/auth/media/provider
  work remains blocked.
- **UI-R02 — COMPLETE within public-shell scope:** truthful responsive header/footer,
  existing-route navigation, fixture-backed category hierarchy, validated `/products?q=`
  search, active states, metadata, Redux cart count and keyboard-safe mobile/cart drawers
  delivered. The focused Chrome suite passed 10/10 across 320–1440px; the full suite's
  only remaining known failure is the pre-existing admin fixture reload assertion.
  Evidence and deferred contracts: `ui-redesign/PHASE_02_PUBLIC_NAVIGATION.md`.
- **UI-R03 — COMPLETE within editorial-homepage scope:** `/` was replaced with a
  responsive Botanical Editorial composition backed by the existing discovery query.
  Categories, products and stores come from the development fixture; unavailable price,
  stock, ratings, delivery and payment capabilities remain explicitly unavailable rather
  than fabricated. Loading, empty, retryable error and ready states are covered, and three
  local optimized editorial images replace homepage hotlinks. Typecheck, lint, 218
  unit/component tests, build and the six-width accessibility/browser matrix passed.
  Evidence, generated-asset provenance and remaining risks:
  `ui-redesign/PHASE_03_EDITORIAL_HOMEPAGE.md`.
- **UI-R04 — COMPLETE within discovery-fixture scope:** `/shops`, `/shops/:slug`
  and `/products` now use responsive Botanical Editorial discovery layouts with
  URL-driven shop category/location and product store/location filtering. Product
  categories were removed, unsupported commerce/store facts remain explicitly
  unavailable, and async/cancellation/error/empty behavior remains Query-owned.
  Typecheck, lint, 209 unit/component tests and the production build passed; browser
  evidence and environment notes are recorded in
  `ui-redesign/PHASE_04_SHOP_DISCOVERY.md`. Live APIs, pagination, supplier media,
  ratings, stock, fulfilment and contact data remain blocked on approved contracts.
- **UI-R05 — COMPLETE within product/cart-fixture scope:** `/products/:slug` now
  provides a responsive luxury product composition, supplier breadcrumbs, truthful
  unavailable price/options, bounded sample quantity, exact store/product cart
  ownership and same-store related products. No variants, inventory, SKU, add-ons,
  fulfilment or server rejection behavior was fabricated. Typecheck, lint, 210
  unit/component tests, production build and the six-width axe/overflow matrix
  passed. Evidence and contract blockers:
  `ui-redesign/PHASE_05_PRODUCT_EXPERIENCE.md`.
- **UI-R06 — COMPLETE within local commerce-contract scope:** `/cart` now groups
  lines by owning supplier with quantity/remove controls and one checkout action per
  store; `/checkout?store=<slug>` persistently reviews only that store and preserves
  other groups after acknowledgement. Missing price, currency, tax, stock, identity,
  address, pickup, provider quote and PayHere contracts are explicitly unavailable,
  not simulated. Typecheck, lint, 210 unit/component tests, production build, the
  32-scenario six-width Chrome/axe matrix and the corrected critical multi-store flow
  passed. Evidence and blockers: `ui-redesign/PHASE_06_CART_CHECKOUT.md`.
