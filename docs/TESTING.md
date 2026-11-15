# Testing strategy

## Unit
Vitest: pure utilities, schemas, reducers, selectors and formatters.

## Component
React Testing Library + user-event + MSW: forms, permission-aware navigation, loading/error/empty states, responsive interactions where testable.

## E2E
Playwright: browse/search, cart, checkout with mocked gateway, order history, supplier product CRUD, order fulfilment, admin approval/refund moderation. Use approved test data and no live payment actions.

## Integration/contract
MSW mock parity tests against approved OpenAPI; verify status handling, pagination and schema drift. Mock external services in CI.

## Quality gates
`npm run typecheck`, `npm run lint`, `npm run test -- --run`, `npm run build`, `npm run test:e2e` after scaffold and scripts exist. Add a11y checks and bundle analysis. Record executed checks rather than assuming success.

## Foundation harness

Use npm 11 for lockfile installation (`npm ci`, or `npx npm@11 ci` with older bundled npm). Component tests install MSW lifecycle hooks and reject unhandled network requests. Pure `.test.ts` and component `.test.tsx` files are discovered under `frontend/src/`; browser specs are separate under `frontend/e2e/`. Install Chromium with `npm exec -w frontend playwright install chromium` or use `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` with installed Chrome. E2E starts a production build/preview automatically. Recorded FE-0101 evidence and remaining tooling risks are in `FE-0101_FOUNDATION.md`.

FE-0102 adds shared async-state integration tests with a local Query fixture and browser fixtures of the actual component markup. Browser fixtures are test-only; they do not add application routes or backend URLs. Both home and not-found pages receive responsive/axe review. See `FE-0102_FOUNDATION_REVIEW.md` for interaction coverage, results and manual screen-reader limitations.
