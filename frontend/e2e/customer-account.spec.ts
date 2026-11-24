import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('browser-local wishlist is truthful and supports add/remove', async ({ page }) => {
  await page.goto('/wishlist');
  await page.evaluate(() => localStorage.setItem('flora_wishlist', JSON.stringify([{
    productSlug: 'morning-bouquet', storeSlug: 'willow-stem', name: 'Morning Bouquet', category: 'bouquets',
  }])));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Saved flowers' })).toBeVisible();
  await expect(page.getByText('1 item saved in this browser.')).toBeVisible();
  await expect(page.getByText('Price, stock and product options are not connected.')).toBeVisible();
  await expect(page.getByText('$38.00')).toHaveCount(0);
  await page.getByRole('button', { name: 'Add to sample cart' }).click();
  await expect(page.getByRole('button', { name: /Shopping cart with 1 items/ })).toBeVisible();
  await page.getByRole('button', { name: 'Close cart drawer' }).click();
  await page.getByRole('button', { name: 'Remove Morning Bouquet from wishlist' }).click();
  await expect(page.getByText('Nothing saved yet')).toBeVisible();
});

test('delivered sample exposes eligible text feedback and truthful unavailable capabilities', async ({ page }) => {
  await page.goto('/account/orders/sample-delivered?status=failed&paid=true');
  await expect(page.getByRole('heading', { name: 'Delivered sample' })).toBeVisible();
  await expect(page.getByText('successful (sample example only). No real payment record is connected.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Refund requests unavailable' })).toBeVisible();
  await expect(page.getByText(/No verified address, pickup instructions, provider booking/)).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Sample feedback' })).toBeVisible();
});

test('/account remains unavailable without an auth and profile contract', async ({ page }) => {
  await page.goto('/account');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  for (const path of ['/wishlist', '/account/orders', '/account/orders/sample-delivered']) {
    test(`${path} customer experience is accessible at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await expect(page.locator('#main')).toBeVisible();
      await expect(page.getByRole('status').filter({ hasText: 'Loading' })).toHaveCount(0);
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath('customer.png'), fullPage: true });
    });
  }
}
