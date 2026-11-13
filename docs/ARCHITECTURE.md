# Frontend architecture

## Decision
Vite SPA with React Router v7 (declarative routing), feature-first modular monolith. Next.js App Router is not used because Vite is the chosen build tool. SSR/SEO requirements must be evaluated before finalizing public storefront deployment.

## Boundaries
`app/` composition/router/providers; `features/` business modules; `shared/` design system, API client, utilities; `pages/` route composition. Features may depend on shared; shared must not import features. Avoid direct feature-to-feature imports; expose stable public module interfaces.

## State ownership
- TanStack Query: network reads, mutation lifecycles, invalidation and cache.
- Redux Toolkit: authenticated UI session metadata if needed, cart UI coordination or persistent cross-route client state; avoid duplicating server entities.
- React local state: forms, dialogs, tabs and transient interactions.
- URL search params: shareable filters, search, sort and pagination.

## Auth
Prefer HttpOnly Secure SameSite cookies issued by backend; `withCredentials` only for approved origin. Handle 401 with a single-flight refresh strategy only after auth contract approval; never retry indefinitely. CSRF protection must be defined with backend. Authorization remains server-side.

## API
Typed endpoint functions and Zod parsing at untrusted boundaries; consistent error normalization; AbortSignal cancellation; bounded retries for safe requests; never retry payment submission blindly.

## Routes (proposed, not approved contract)
`/` storefront; `/shops`, `/products/:slug`, `/cart`, `/checkout`, `/account/orders`; `/supplier/*`; `/admin/*`. Confirm slug/id behavior before API binding.

## Performance
Route-level lazy loading; image sizes and responsive sources; virtualization only for large lists; avoid eager chart bundles; measure LCP/INP/CLS before setting budgets.

## Observability
Error boundaries, scrubbed client error telemetry, correlation IDs from backend, no PII in analytics.
