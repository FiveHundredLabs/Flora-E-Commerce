# Deployment and CI/CD

## Targets
Vercel, Netlify or Docker + Nginx are options; client hosting decision remains open. Vite SPA needs history fallback to `index.html` for client routes. Public SEO/SSR needs explicit review.

## Pipeline
Install locked dependencies → typecheck → lint → unit/component tests → production build → E2E smoke tests → dependency/security scan → preview deployment → approval → production release.

## Environment
Only `VITE_` variables intentionally public to browser. Never put secrets, JWT signing keys, AWS access keys or gateway secret keys in frontend env. Provide `.env.example` for public configuration only.

## Operations
Versioned artifacts, source maps with controlled access, error monitoring with redaction, rollback to previous artifact, post-deploy smoke test and CDN cache strategy.
