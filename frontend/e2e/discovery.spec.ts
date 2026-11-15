import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('store browsing leads to its own products and product ownership', async ({ page }) => {
  await page.goto('/shops');
  await expect(page.getByText('Sample catalog · MOCK')).toBeVisible();
  await page.getByRole('link', { name: 'Willow & Stem', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Willow & Stem', level: 1 })).toBeVisible();
  await expect(page).toHaveTitle('Willow & Stem | Flower & Flora');
  await expect(page.getByRole('link', { name: 'Little Fern', exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Morning Bouquet', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Morning Bouquet', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Willow & Stem', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to sample cart' })).toBeVisible();
  await expect(page.getByRole('button', { name: /pay now|buy now/i })).toHaveCount(0);
});

test('applied filters survive detail navigation, reload, back and forward', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('combobox', { name: 'Category' }).selectOption('plants');
  await page.getByRole('combobox', { name: 'Location' }).selectOption('kandy');
  await page.getByRole('combobox', { name: 'Sort by' }).selectOption('name-desc');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page).toHaveURL(/category=plants&location=kandy&sort=name-desc$/);
  const titles = page.getByRole('region', { name: 'Sample products' }).getByRole('heading', { level: 3 });
  await expect(titles).toHaveText(['Little Fern', 'Leafy Companion']);
  await page.getByRole('link', { name: 'Little Fern', exact: true }).click();
  await expect(page).toHaveURL(/little-fern\?category=plants&location=kandy&sort=name-desc$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Little Fern', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Back to products', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Category' })).toHaveValue('plants');
  await expect(titles).toHaveText(['Little Fern', 'Leafy Companion']);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page).toHaveURL(/\/products$/);
  await page.goBack();
  await expect(page.getByRole('combobox', { name: 'Location' })).toHaveValue('kandy');
  await page.goForward();
  await expect(page.getByRole('combobox', { name: 'Location' })).toHaveValue('');
});

test('invalid queries, empty matches and missing details have recovery', async ({ page }) => {
  await page.goto('/shops?sort=price&category=unknown');
  await expect(page.getByRole('alert')).toContainText('Some URL filters were invalid');
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('no matches');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page.getByText(/No matches/)).toBeVisible();
  await page.goto('/products/missing');
  await expect(page.getByRole('heading', { name: 'Product not found' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to products' }).click();
  await expect(page.getByRole('link', { name: 'Little Fern', exact: true })).toBeVisible();
});

for (const width of [375, 1440]) {
  for (const path of ['/shops', '/shops/willow-stem', '/products', '/products/little-fern']) {
    test(`${path} discovery is accessible at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await expect(page.getByText('Sample catalog · MOCK')).toBeVisible();
      await expect(page.getByRole('status').filter({ hasText: 'Loading' })).toHaveCount(0);
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath('discovery.png'), fullPage: true });
    });
  }
}
