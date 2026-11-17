import { http, HttpResponse } from 'msw';
import { expect, it } from 'vitest';
import { z } from 'zod';
import { server } from './server';

// Harness-only URL, deliberately unrelated to marketplace/backend operations.
it('intercepts an explicit test fixture and validates its shape', async () => {
  server.use(http.get('https://fixture.invalid/harness', () => HttpResponse.json({ source: 'MOCK' })));
  const response = await fetch('https://fixture.invalid/harness');
  const result: unknown = await response.json();
  expect(z.object({ source: z.literal('MOCK') }).parse(result).source).toBe('MOCK');
});
