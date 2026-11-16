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
- **Status (2026-11-16): COMPLETE within mock supplier scope.** Added 17 feature tests and four browser journeys; fixed background-refresh draft loss, receipt association, late-write denial recovery, adapter isolation and instant-retry focus. Strengthened removal progress/double-submit/error recovery. Typecheck/lint/build, all 122 unit/component tests and all 93 Chrome tests passed; narrow enlarged-text axe/overflow checks and stock/note screenshot review completed. Evidence/limits: `docs/FE-0502_SUPPLIER_REVIEW.md`. FE-0601 has not started.
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
- **Objective:** Implement feature-level tests, error/empty/loading states and accessibility review.
- **Context/requirements:** `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_DECISIONS.md`; confirm affected requirement IDs before coding.
- **Affected modules:** `frontend/src/` feature/app/shared areas relevant to phase 7; exact paths determined after inspection.
- **Dependencies:** FE-0701.
- **Implementation:** minimal vertical slice; use mock adapter if backend contract unavailable; block final business behavior on open decisions.
- **Acceptance:** typed, responsive, accessible, deterministic loading/empty/error behavior, no unsupported scope.
- **Tests:** unit/component tests; E2E for critical flows; no live payment/provider calls.
- **Validation:** typecheck, lint, unit tests, build, relevant Playwright tests (after scaffold).
- **Done:** reviewed diff, evidence of tests, requirement traceability and documented blockers.
