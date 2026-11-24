import { setupServer } from 'msw/node';

// Add handlers per feature once contracts or explicit test fixtures exist.
// Unhandled network requests fail tests rather than reaching real services.
export const server = setupServer();
