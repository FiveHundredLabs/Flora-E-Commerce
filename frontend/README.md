# Frontend foundation

React 19 + Vite + strict TypeScript foundation for FE-0101. Use Node 22 (at least 22.12; see `.nvmrc`) and npm 11. If your environment ships npm 9, use `npx npm@11 ci` for installation. From the workspace root run `npm ci`, `npm run dev`, and the validation commands in `docs/TESTING.md`. The home page shows catalog unavailability; unknown routes offer recovery. No backend calls are enabled. The `.env.example` is illustrative, not an approved backend URL.

Playwright tests build and serve the production bundle. Install Chromium with `npm exec -w frontend playwright install chromium`, then run `npm run test:e2e`. To use an already installed Google Chrome instead, run `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`. The smoke suite checks navigation, keyboard skip focus, overflow and axe accessibility at mobile/tablet/desktop widths. Automated accessibility checks do not replace screen-reader review.

`app/` composes the router, error boundary and Query provider; `pages/` composes route content; `shared/` contains neutral base styling; `test/` installs React Testing Library and MSW lifecycle hooks. Add feature modules only when implementing them. Test requests require explicit MSW fixtures; unhandled network requests fail. Redux is deferred until cross-feature client state exists.
