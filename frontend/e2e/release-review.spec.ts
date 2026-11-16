import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('missing preview assets return 404 instead of the SPA HTML fallback', async ({ request }) => {
  for (const path of ['/assets/missing-review.js', '/assets/missing-review.css']) {
    const response = await request.get(path); expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).not.toContain('text/html');
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    const head = await request.head(path); expect(head.status()).toBe(404); expect(await head.body()).toHaveLength(0);
  }
});

test('CSP blocks native form submission without issuing a POST', async ({ page }) => {
  await page.goto('/'); await expect(page.getByRole('heading', { name: 'Welcome to Flower & Flora' })).toBeVisible();
  const posts: string[] = []; page.on('request', (request) => { if (request.method() === 'POST') posts.push(request.url()); });
  const directive = await page.evaluate(() => new Promise<string>((resolve) => {
    document.addEventListener('securitypolicyviolation', (event) => { if (event.effectiveDirective === 'form-action') resolve(event.effectiveDirective); });
    const form = document.createElement('form'); form.method = 'post'; form.action = '/'; document.body.appendChild(form); form.submit();
  }));
  expect(directive).toBe('form-action'); expect(posts).toEqual([]);
  // A denied native navigation can leave Playwright's locator navigation wait pending.
  // Inspect the unchanged document directly after observing the actual CSP violation.
  expect(await page.evaluate(() => document.querySelector('h1')?.textContent)).toBe('Welcome to Flower & Flora');
});

test('preview refuses embedding from a document without its own CSP', async ({ page, baseURL }) => {
  if (!baseURL) throw new Error('Missing preview URL.');
  const denied = page.waitForEvent('console', (message) => message.type() === 'error' && /frame-ancestors|X-Frame-Options/i.test(message.text()));
  await page.setContent(`<html lang="en"><head><title>Embedding review</title></head><body><iframe title="Preview frame" src="${baseURL}"></iframe></body></html>`);
  await denied;
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'Welcome to Flower & Flora' })).toHaveCount(0);
});

test('blocked application scripts leave an accessible first-load recovery screen', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Flower & Flora', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try opening the home page' })).toHaveAttribute('href', '/');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('bootstrap-recovery.png'), fullPage: true });
});

test('JavaScript-disabled preview explains the requirement without showing a blank page', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL }); const page = await context.newPage();
  try {
    await page.goto('/');
    await expect(page.locator('noscript p')).toBeVisible();
    await expect(page.locator('noscript p')).toHaveText('JavaScript is disabled. Enable it to use this sample marketplace.');
    await expect(page.getByRole('link', { name: 'Try opening the home page' })).toBeVisible();
  } finally { await context.close(); }
});

test('unknown customer and workspace routes retain accessible recovery under preview headers', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 1000 }); await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  for (const path of ['/missing-release-review', '/supplier/missing-release-review', '/admin/missing-release-review']) {
    await page.goto(path); await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await page.addStyleTag({ content: 'body { font-size: 200%; }' });
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'Return home' }).click(); await expect(page.getByRole('main')).toBeFocused();
  }
});
