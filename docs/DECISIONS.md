# Architecture decision records

## ADR-001: Vite SPA + React Router v7
Status: Proposed. Rationale: user selected React 19 + Vite; React Router v7 aligns with SPA architecture. Trade-off: public storefront SEO may require SSR/prerendering; validate before launch.

## ADR-002: TanStack Query + Redux Toolkit
Status: Proposed. Rationale: separate server data from shared client state. Trade-off: dual state tools require strict ownership rules.

## ADR-003: Mock-first API boundary
Status: Proposed. Rationale: no backend OpenAPI supplied. Trade-off: mocks may drift; enforce contract validation before integration.

## ADR-004: FE-0101 foundation tooling
Status: Implemented for FE-0101 on 2026-11-15. Root npm workspace scripts delegate to `frontend/`. Strict TypeScript, ESLint, Vitest/jsdom, Testing Library/user-event, MSW and Playwright/axe provide the harness. Vitest is pinned to security-patched 4.1.12. Installation uses npm 11 after npm 9 failed resolving newer optional tooling peers and retained damaged dependency entries. MSW 2.12.7 is pinned to avoid CLI dependencies requiring a newer Node patch than the installed 22.22.1. No peer checks are disabled. TanStack Query is provided now; Redux is deferred until there is real shared client state. Styling is neutral pending OD-09. CI runs the same checks and Chromium smoke suite; publishing remains a separate task.
