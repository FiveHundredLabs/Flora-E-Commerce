# Agent Operating Contract (Codex + Antigravity)

## Mission
Build a production-quality frontend for the Flower & Flora multi-supplier marketplace, without changing agreed scope.

## Required reading order
`README.md` → `docs/PROJECT_CONTEXT.md` → `docs/PRODUCT_REQUIREMENTS.md` → `docs/OPEN_DECISIONS.md` → `docs/ARCHITECTURE.md` → `docs/DESIGN.md` → relevant task in `docs/TASKS.md` → `docs/TESTING.md`.

## Workflow
SPEC → ANALYZE → ARCHITECT → PLAN → IMPLEMENT → TEST → REVIEW → VALIDATE → RELEASE.
Before coding, cite requirement IDs and identify assumptions, impacted files, acceptance criteria and tests.

## Hard rules
- Inspect existing code first; do not rewrite without approval.
- No invented API routes, business rules, backend capabilities or payment states.
- DBML is schema reference only; do not expose tables directly as HTTP contracts.
- Prefer feature modules; avoid circular dependencies and cross-feature deep imports.
- Use TypeScript strict mode; no `any` without documented exception.
- TanStack Query owns remote data; Redux owns truly cross-feature client UI state; component state stays local.
- Validate user inputs with Zod; backend remains source of truth.
- Never put refresh tokens or credentials in localStorage; prefer HttpOnly Secure SameSite cookies with documented CSRF design.
- Enforce permissions server-side; route guards are UX only.
- No live payment/provider integrations without approved contracts.
- Include loading, empty, error, and accessible states in every async feature.
- No secrets, customer PII or production credentials in commits, fixtures, logs or screenshots.
- Do not silently install dependencies or change architecture; document decisions.
- Never claim a test passed unless it was actually run.

## Definition of done
Requirement traced; scoped implementation; tests; typecheck; lint; production build; accessibility and responsive checks; security review; documentation updated; review notes and remaining risks reported.

## Validation (once scaffolded)
`npm run typecheck && npm run lint && npm run test -- --run && npm run build`
`npm run test:e2e` for flows with configured Playwright environment.
If scripts are missing, report as blocker rather than inventing results.
