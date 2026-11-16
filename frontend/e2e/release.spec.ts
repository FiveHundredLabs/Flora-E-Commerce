import { test, expect } from '@playwright/test';

test('production preview applies security headers and labels the release as mock', async ({ request }) => {
  const response = await request.get('/admin/orders/sample-order'); expect(response.ok()).toBe(true);
  const headers = response.headers();
  expect(headers['content-security-policy']).toContain("connect-src 'none'");
  expect(headers['content-security-policy']).toContain("script-src 'self'");
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['x-content-type-options']).toBe('nosniff'); expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe('no-referrer'); expect(headers['cache-control']).toContain('no-store');
  const manifest = await request.get('/release-manifest.json'); expect(manifest.ok()).toBe(true);
  const value: unknown = await manifest.json();
  expect(value).toMatchObject({ schemaVersion: 1, dataMode: 'mock', liveIntegrations: false });
});

test('preview blocks inline scripts and browser connections while the app remains usable', async ({ page, request }) => {
  await page.goto('/products'); await expect(page.getByRole('heading', { name: /products/i, level: 1 })).toBeVisible();
  expect((await request.get('/')).ok()).toBe(true);
  await page.addScriptTag({ content: "document.documentElement.dataset.inlineExecuted = 'yes'" }).catch(() => undefined);
  expect(await page.locator('html').getAttribute('data-inline-executed')).toBeNull();
  expect(await page.evaluate(async () => { try { await fetch('/'); return false; } catch { return true; } })).toBe(true);
  await page.getByRole('navigation', { name: 'Marketplace navigation' }).getByRole('link', { name: 'Shops', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: /shops/i })).toBeVisible();
});

test('deep links reload in the correct shell without credentials or persistent demo state', async ({ page, context }) => {
  for (const [path, heading] of [['/supplier/inventory', 'Supplier inventory'], ['/admin/refunds/sample-request', 'Refund requests detail']]) {
    if (!path || !heading) throw new Error('Missing test case.');
    await page.goto(path); await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await page.reload(); await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});
