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
- **Status (2026-11-15): COMPLETE within foundation scope.** Shared async states, Query integration tests, route focus/title recovery and accessibility review delivered. Typecheck/lint/build, 14 unit/component tests and 14 Chrome browser tests passed. Evidence and manual assistive-technology follow-up: `docs/FE-0102_FOUNDATION_REVIEW.md`. FE-0201 has not started.
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
