# Frontend security standard

- Backend enforces authentication, RBAC, resource ownership and supplier isolation.
- Prefer cookie-based sessions with HttpOnly, Secure and SameSite attributes; coordinate CSRF defense and CORS with backend.
- Never persist JWT refresh tokens in browser storage; never log access tokens.
- Validate inputs client-side for UX and server-side for security.
- React escapes text by default; prohibit unreviewed `dangerouslySetInnerHTML`.
- Validate file type/size and signed upload scope; never embed AWS credentials.
- Payment and delivery integrations must use backend-controlled requests.
- Use CSP and security headers configured at hosting layer; dependency scanning in CI.
- Avoid leaking private customer/supplier data in telemetry, URL params or test fixtures.
- Handle 403/401 consistently; do not mistake hidden buttons for authorization.

FE-0701 adds a mock-only public-config allowlist, local production-preview security headers, build integrity checks and browser enforcement smoke tests. These do not establish live auth, CSRF, tenant isolation or production host security. Preview CSP intentionally allows inline styles, but not inline scripts/eval or browser connections. Review the final HTTPS host policy and integration allowlists before enabling live operations. Evidence and remaining gates: `FE-0701_INTEGRATIONS_HARDENING.md`; operational commands/limits: `DEPLOYMENT.md`.
