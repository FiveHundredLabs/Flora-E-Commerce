# Architecture decision records

## ADR-001: Vite SPA + React Router v7
Status: Proposed. Rationale: user selected React 19 + Vite; React Router v7 aligns with SPA architecture. Trade-off: public storefront SEO may require SSR/prerendering; validate before launch.

## ADR-002: TanStack Query + Redux Toolkit
Status: Proposed. Rationale: separate server data from shared client state. Trade-off: dual state tools require strict ownership rules.

## ADR-003: Mock-first API boundary
Status: Proposed. Rationale: no backend OpenAPI supplied. Trade-off: mocks may drift; enforce contract validation before integration.
