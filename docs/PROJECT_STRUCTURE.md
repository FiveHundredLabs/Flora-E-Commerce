# Proposed structure (created by FE-0101)

```text
frontend/
  src/
    app/               # router, providers, app bootstrap
    pages/             # route compositions
    features/
      auth/ stores/ catalog/ cart/ checkout/ orders/ reviews/
      supplier/ admin/ media/ delivery/ payments/
    shared/
      api/ components/ui/ hooks/ lib/ types/ styles/
    test/              # MSW handlers and test setup
  public/
  e2e/
```

Do not generate empty placeholder modules merely to match the diagram. Each feature exposes a stable public API. Domain entity naming follows approved API contract, not inferred DB columns.

Implemented shared areas: `components/ui/` for basic primitives, `components/layout/` for the audience shell, `components/AsyncRegion` for async presentation, and `styles/tokens.css` for theme variables. Implemented features are `discovery/` (mock catalog), `commerce/` (in-memory customer commerce) and `supplier/` (isolated fictional workspace). Other proposed directories remain deferred until their tasks. Browser-only fixtures live under `e2e/`, with production-CSS setup in `e2e/helpers/fixture.ts`.
