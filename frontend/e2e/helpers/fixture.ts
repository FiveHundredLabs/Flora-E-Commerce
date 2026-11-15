import type { Page } from '@playwright/test';

/** Reuse the compiled production stylesheet in test-only static component fixtures. */
export async function mountFixture(page: Page, markup: string) {
  await page.goto('/');
  const stylesheet = await page.locator('link[rel="stylesheet"]').getAttribute('href');
  if (!stylesheet) throw new Error('Production stylesheet is missing');
  await page.setContent(`<!doctype html><html lang="en"><head><title>Component review</title><link rel="stylesheet" href="${stylesheet}"></head><body><main><h1>Component review</h1>${markup}</main></body></html>`);
}
