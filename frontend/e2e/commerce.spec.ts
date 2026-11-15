import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('multi-store cart checks out one shop and preserves the other', async ({ page }, testInfo) => {
  await page.goto('/products');
  await page.getByRole('link', { name: 'Morning Bouquet', exact: true }).click();
  await page.getByRole('button', { name: 'Add to sample cart' }).click();
  await expect(page.getByRole('status')).toContainText('Added Morning Bouquet');
  const nav = page.getByRole('navigation', { name: 'Marketplace navigation' });
  await nav.getByRole('link', { name: 'Products', exact: true }).click();
  await page.getByRole('link', { name: 'Little Fern', exact: true }).click();
  await page.getByRole('button', { name: 'Add to sample cart' }).click();
  await nav.getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Willow & Stem' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Fern House' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Skip to content' })).not.toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('multi-store-cart.png'), fullPage: true });
  await page.getByRole('link', { name: 'Checkout Willow & Stem' }).click();
  const summary = page.getByRole('region', { name: 'Selected shop checkout' });
  await expect(summary.getByText('Morning Bouquet', { exact: true })).toBeVisible();
  await expect(summary.getByText('Little Fern', { exact: true })).toHaveCount(0);
  await page.getByRole('radio', { name: 'Delivery', exact: true }).check();
  await page.getByRole('button', { name: 'Create sample order' }).click();
  await expect(page.getByRole('combobox', { name: 'Sample delivery provider' })).toBeFocused();
  await page.getByRole('combobox', { name: 'Sample delivery provider' }).selectOption('uber-connect');
  await expect(page.getByRole('combobox', { name: 'Sample delivery provider' })).not.toHaveAttribute('aria-invalid');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('checkout-mobile.png'), fullPage: true });
  await page.getByRole('button', { name: 'Create sample order' }).click();
  await expect(page).toHaveURL(/\/account\/orders\/sample-1$/);
  await expect(page.getByText('PayHere is not connected. No payment has been requested.')).toBeVisible();
  await expect(page.getByText(/delivery preference — Uber Connect/)).toBeVisible();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await nav.getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Fern House' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Willow & Stem' })).toHaveCount(0);
});

test('sample delivered feedback validates, saves locally and ignores payment query claims', async ({ page }) => {
  await page.goto('/account/orders/sample-delivered?status=failed');
  await expect(page.getByText(/successful \(sample example only\)/)).toBeVisible();
  const comment = page.getByRole('textbox', { name: 'Sample feedback' });
  await page.getByRole('button', { name: 'Save sample feedback' }).click();
  await expect(comment).toBeFocused();
  await expect(comment).toHaveAttribute('aria-invalid', 'true');
  await comment.fill('A fictional review for the sample session.');
  await page.getByRole('button', { name: 'Save sample feedback' }).click();
  await expect(page.getByText('Sample feedback saved for this session only.')).toBeVisible();
  await page.getByRole('link', { name: 'Back to sample orders' }).click();
  await page.getByRole('link', { name: 'sample-delivered', exact: true }).click();
  await expect(comment).toHaveValue('A fictional review for the sample session.');
});

for (const width of [375, 1440]) {
  for (const path of ['/cart', '/checkout?store=missing', '/account/orders', '/account/orders/sample-delivered', '/account/orders/missing']) {
    test(`${path} commerce is accessible at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await expect(page.getByText('Sample commerce · MOCK')).toBeVisible();
      await expect(page.getByRole('status').filter({ hasText: 'Loading' })).toHaveCount(0);
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath('commerce.png'), fullPage: true });
    });
  }
}
