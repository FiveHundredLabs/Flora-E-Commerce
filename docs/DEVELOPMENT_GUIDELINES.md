# Development guidelines

- Keep changes small and reviewable; follow the task dependency order.
- Use strict TS, named exports for feature modules, path aliases only after scaffold.
- Co-locate tests with implementation or use a consistent `__tests__` convention.
- Prefer composition over complex abstractions; no premature generic repository layer.
- Use accessible shadcn/ui primitives and semantic HTML.
- Define error/loading/empty states and optimistic update rollback when applicable.
- No silent feature creep or undocumented dependency additions.
- Conventional commit style recommended: `feat(catalog): ...`, `test(auth): ...`.
