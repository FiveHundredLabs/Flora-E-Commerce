# Architecture decision records

## ADR-009: Fail-closed mock configuration and local release checks for FE-0701
Status: Implemented 2026-11-16 for local hardening only. Reject unsupported public Vite configuration rather than implying that an API URL enables live adapters. Apply loopback preview security headers and generate/verify a mock artifact manifest; add CI release checks without selecting or publishing to a host. No dependency or application-state architecture change. Backend/auth/media/hosting approvals remain required; FE-0701 is not complete. Evidence: `FE-0701_INTEGRATIONS_HARDENING.md`.

## ADR-008: Isolated admin oversight demo for FE-0601
Status: Implemented 2026-11-16. Use a private fictional Query snapshot for sample supplier/user labels, category CRUD and oversight notes, with validated references, revision checks and receipt association. Do not introduce supplier approval, account restrictions/roles, refund execution or moderation transitions while policies/contracts are open. No cross-feature state sharing, new dependency or architecture change. Evidence and limitations: `FE-0601_ADMIN.md`.

## ADR-007: Isolated supplier demo for FE-0501
Status: Implemented 2026-11-16. Keep supplier application/profile, catalog/inventory and order-note fixtures independent of public discovery/customer commerce. Query owns a validated workspace snapshot; local revision checks reject stale writes, while forms retain transient drafts. The adapter protocol is a mock implementation detail, not an approved API. Supplier approval, authentication, publication, stock reservations, fulfilment transitions, revenue and uploads remain contract-dependent. No new dependency or architecture change. Scope and validation: `FE-0501_SUPPLIER.md`.

## ADR-006: Activate client cart state for FE-0401
Status: Implemented 2026-11-15. Add Redux Toolkit/react-redux for multi-store cart references/quantities/revisions only; keep catalog/order/feedback entities in TanStack Query. Page composition injects the cart action into discovery through public interfaces. Use an in-memory mock service for commerce until approved backend contracts exist, with no prices, credentials, persistent storage or provider calls. Detailed safety rules, provisional UI bounds and validation evidence: `FE-0401_CUSTOMER_COMMERCE.md`.

## ADR-005: FE-0201 token and shell foundation
Status: Implemented 2026-11-15. Centralize semantic CSS variables and use a provisional neutral theme pending OD-09. Use native HTML controls and native dialog for this minimal component slice, retaining shadcn-compatible token names without dependency changes. Shared audience shells use local disclosure state; `/supplier` and `/admin` are labeled layout previews until auth contracts exist. Complex component inventory is added with actual consumers. Implementation evidence and limits: `FE-0201_DESIGN_SYSTEM.md`.

## ADR-001: Vite SPA + React Router v7
Status: Proposed. Rationale: user selected React 19 + Vite; React Router v7 aligns with SPA architecture. Trade-off: public storefront SEO may require SSR/prerendering; validate before launch.

## ADR-002: TanStack Query + Redux Toolkit
Status: Proposed. Rationale: separate server data from shared client state. Trade-off: dual state tools require strict ownership rules.

## ADR-003: Mock-first API boundary
Status: Proposed. Rationale: no backend OpenAPI supplied. Trade-off: mocks may drift; enforce contract validation before integration.

## ADR-004: FE-0101 foundation tooling
Status: Implemented for FE-0101 on 2026-11-15. Root npm workspace scripts delegate to `frontend/`. Strict TypeScript, ESLint, Vitest/jsdom, Testing Library/user-event, MSW and Playwright/axe provide the harness. Vitest is pinned to security-patched 4.1.12. Installation uses npm 11 after npm 9 failed resolving newer optional tooling peers and retained damaged dependency entries. MSW 2.12.7 is pinned to avoid CLI dependencies requiring a newer Node patch than the installed 22.22.1. No peer checks are disabled. TanStack Query is provided now; Redux is deferred until there is real shared client state. Styling is neutral pending OD-09. CI runs the same checks and Chromium smoke suite; publishing remains a separate task.
