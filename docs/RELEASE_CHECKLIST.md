# Release checklist

FE-0701 is partial as of 2026-11-16: local mock gates and release artifact checks pass, but no approved backend/auth/media contract, hosting selection, hosted CI/deployment or production release acceptance exists. Keep live release gates unchecked. Evidence: `FE-0701_INTEGRATIONS_HARDENING.md`.

- [ ] Client decisions approved and traced
- [ ] Backend OpenAPI and auth/CSRF contract signed off
- [ ] Functional acceptance criteria met for all committed scope
- [ ] Typecheck/lint/tests/build green with recorded CI evidence
- [ ] Keyboard/screen reader and responsive checks complete
- [ ] No secrets/PII in bundle, logs or fixtures
- [ ] Payment/provider callbacks validated on backend
- [ ] Hosting, routing fallback, headers, error monitoring configured
- [ ] Rollback and smoke-test plan exercised
- [ ] Product owner approval documented
