import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 360, 390, 768, 1024, 1440] as const;

for (const width of widths) {
  test(`product experience is accessible and stable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/products/morning-bouquet');
    await expect(page.getByRole('heading', { name: 'Morning Bouquet', level: 1 })).toBeVisible();
    await expect(page.getByText('Botanical illustration placeholder — supplier photography is not connected.')).toBeVisible();
    await expect(page.getByText('Price unavailable').first()).toBeVisible();
    await expect(page.getByText('Availability not connected').first()).toBeVisible();
    await expect(page.getByRole('radiogroup')).toHaveCount(0);
    await expect(page.getByText(/Fictional records; no live prices, stock, ratings/)).toBeVisible();
    await expect(page.getByText(/Free delivery|Only [0-9]+ left|sale ends/i)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`product-${width}.png`), fullPage: true });
  });
}

test('sample quantity adds one correct store/product cart line without unsupported options', async ({ page }) => {
  await page.goto('/products/morning-bouquet');
  await page.getByRole('combobox', { name: 'Sample quantity' }).selectOption('3');
  await page.getByRole('button', { name: 'Add to sample cart' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Added 3 × Morning Bouquet' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Shopping cart with 3 items' })).toBeVisible();
  await page.getByRole('button', { name: 'Shopping cart with 3 items' }).click();
  await page.getByRole('link', { name: 'Review full sample cart' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole('heading', { name: 'Willow & Stem', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Morning Bouquet', exact: true })).toBeVisible();
  await expect(page.getByRole('spinbutton', { name: 'Quantity for Morning Bouquet' })).toHaveValue('3');
  await expect(page.getByText(/variant|add-on|sku/i)).toHaveCount(0);
});

test('breadcrumbs and related products remain within the owning store', async ({ page }) => {
  await page.goto('/products/little-fern');
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumb.getByRole('link', { name: 'Fern House' })).toHaveAttribute('href', '/shops/fern-house');
  await expect(page.getByRole('heading', { name: 'More from Fern House' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Leafy Companion', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Morning Bouquet', exact: true })).toHaveCount(0);
});

test('missing product has truthful recovery without a purchase action', async ({ page }) => {
  await page.goto('/products/not-a-product');
  await expect(page.getByRole('heading', { name: 'Product not found', level: 1 })).toBeVisible();
  await expect(page.getByText(/could not be found/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to sample cart' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Back to products' })).toBeVisible();
});
