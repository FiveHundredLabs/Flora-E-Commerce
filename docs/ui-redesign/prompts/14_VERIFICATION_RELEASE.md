# Phase 14 — Complete Verification, Release Readiness and Handoff

Perform a comprehensive review of the real redesigned project. Fix issues discovered rather than merely describing them when feasible.

## Full customer E2E
Explore homepage → browse stores by shop category → search/filter → store page → product selection (size/color/wrapping/add-ons) → add to cart → have items from two stores → checkout ONE store → select supported delivery/pickup → initiate PayHere → verify backend status → view order history/detail → leave feedback only on delivered order. Also cover out-of-stock, invalid address, no delivery availability, failed payment and abandoned checkout.

## Full supplier E2E
Register/onboard if supported → approval state → profile → create/edit product → variant and location stock → image original/processing/processed/failure → view incoming order → fulfilment/pickup status transition → sales view. Validate strict one-store authorization.

## Full admin E2E
Admin access → totals → supplier review/approval → store and categories → user restrictions → cross-store orders → payment and refund states → feedback moderation → media status if available. Verify 401/403/409 handling and sensitive data boundaries.

## Engineering gates
- Run actual lint, typecheck, Vitest/RTL, Playwright smoke and production build where set up. If any unavailable, mark unverified.
- Capture desktop/mobile screenshots for every important screen; compare to visual design system, not old UI.
- Check accessible focus/contrast/forms/tab order, responsive breakpoints, image alt, reduced-motion, semantic page titles.
- Use performance tooling (Lighthouse or browser traces if available), record measured LCP/INP/CLS vs targets. Do not claim green scores without measurement.
- Check README setup, env var names without secrets, deployment instructions (Vite SPA route fallbacks, cache handling), migration/rollback notes and feature flags.
- Scan project for TODO/dead CTAs/mock responses/fake dashboards/unapproved components and fix/remove or clearly document as incomplete.
- Produce `docs/ui-redesign/REDESIGN_HANDOFF.md` with screen inventory, changed files, integration matrix, unresolved policies/APIs, test evidence, screenshots inventory and known risks.

**Final response:** state what is actually complete and tested, what remains blocked, and whether this is visual prototype, integrated staging, or genuinely release ready. Do not use "production-ready" unless verified against the definition of done.
