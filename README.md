# Flower & Flora — Frontend Agentic Starter Pack

Spec-driven development workspace for **React 19 + Vite + TypeScript**, operated with **OpenAI Codex** and **Google Antigravity**.

> This workspace includes a validated frontend/design-system foundation, mock discovery, in-memory multi-store commerce, a fictional supplier workspace, and an isolated admin demo for sample labels, categories and oversight notes. Live backend, authentication, payment and delivery integrations remain pending. See `docs/FE-0401_CUSTOMER_COMMERCE.md`, `docs/FE-0501_SUPPLIER.md`, `docs/FE-0601_ADMIN.md` and `docs/OPEN_DECISIONS.md` for scope and remaining approvals.

FE-0701 is partial: local mock configuration/security/artifact/E2E hardening is validated, while approved API/auth/media wiring and hosted deployment remain blocked. See `docs/FE-0701_INTEGRATIONS_HARDENING.md` and `docs/DEPLOYMENT.md` for evidence, commands and required handoffs. Only default/explicit `VITE_APP_MODE=mock` is supported.

The independently requested FE-0702 local review is validated with startup recovery, reserved-asset 404s and expanded release/security/accessibility checks. Phase 7 live acceptance remains incomplete. See `docs/FE-0702_RELEASE_REVIEW.md` for verified results and limits.

## Read first
1. `docs/PROJECT_CONTEXT.md`
2. `docs/PRODUCT_REQUIREMENTS.md`
3. `docs/OPEN_DECISIONS.md`
4. `docs/ARCHITECTURE.md`
5. `docs/DESIGN.md`
6. `docs/TASKS.md`
7. `AGENTS.md`

## Source of truth
- `references/client-feature-document.pdf` — high-level client scope; contains unresolved decisions.
- `references/flower-marketplace-schema.dbml` — data model reference, **not** a frontend REST API contract.
- `docs/OPEN_DECISIONS.md` — blocks implementation where business behavior is undefined.
- `docs/API_CONTRACT.md` — proposed interface process; must be approved before backend wiring.

## Start
1. Review open decisions with client and backend owner.
2. Use Node 22 and npm 11, run `npm ci` from the root, then `npm run dev` to start the frontend foundation. With older bundled npm, use `npx npm@11 ci`.
3. Implement design tokens and shell before feature pages.
4. Use mock adapters with clearly labeled fixtures until APIs are specified.
5. Run checks defined in `docs/TESTING.md` before merging.

## Agent coordination
Codex: root `AGENTS.md`, optional `.codex/config.toml`, and `CODEX.md`.
Antigravity: `.agent/rules/`, `.agent/workflows/`, `.agent/agents/` (agent definitions are **project role prompts**, not a guarantee of native automatic subagent registration).

## Scope
Customer, supplier, and super-admin interfaces; provider calls, payments, storage, n8n, and authoritative permission enforcement belong to backend/services.

## Source summary
Client target completion: **25 December 2026**, contingent on scope and third-party availability. Schema: **41 tables**, **19 enums**.
