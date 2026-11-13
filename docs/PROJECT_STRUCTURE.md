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
