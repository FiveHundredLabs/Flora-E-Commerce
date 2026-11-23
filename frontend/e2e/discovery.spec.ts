import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('shop category, location and sort filters persist through history', async ({ page }) => {
  await page.goto('/shops');
  await page.getByRole('combobox', { name: 'Shop category' }).selectOption('plants');
  await page.getByRole('combobox', { name: 'Location' }).selectOption('kandy');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page).toHaveURL(/category=plants&location=kandy$/);
  await page.getByRole('combobox', { name: 'Sort by' }).selectOption('name-desc');
  await expect(page).toHaveURL(/category=plants&location=kandy&sort=name-desc$/);
  await expect(page.getByText('3 stores found')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Fern House', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Shop category' })).toHaveValue('plants');
  await page.getByRole('button', { name: 'Clear all' }).click();
  await expect(page).toHaveURL(/\/shops$/);
  await page.goBack();
  await expect(page.getByRole('combobox', { name: 'Location' })).toHaveValue('kandy');
});

test('product discovery uses store ownership and does not expose product categories', async ({ page }) => {
  await page.goto('/products?store=fern-house&location=kandy&sort=name-desc');
  await expect(page.getByRole('combobox', { name: 'Store' })).toHaveValue('fern-house');
  await expect(page.getByRole('combobox', { name: /category/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Little Fern', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Morning Bouquet', exact: true })).toHaveCount(0);
  await expect(page.getByText('Price unavailable').first()).toBeVisible();
  await expect(page.getByText('Availability not connected').first()).toBeVisible();
});

test('shop profile discloses unavailable capabilities and only shows owned products', async ({ page }) => {
  await page.goto('/shops/willow-stem');
  await expect(page.getByRole('heading', { name: 'Willow & Stem', level: 1 })).toBeVisible();
  await expect(page.getByText(/Contact details, operating hours/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Morning Bouquet', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Little Fern', exact: true })).toHaveCount(0);
  await expect(page.locator('[aria-label*="star" i], .rating, .review-count')).toHaveCount(0);
});

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`shop discovery is accessible and stable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/shops');
    await expect(page.getByRole('heading', { name: 'Independent floral stores' })).toBeVisible();
    await expect(page.getByText('10 stores found')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`shops-${width}.png`), fullPage: true });
  });
}

test('mobile filter dialog applies and clears filters then returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto('/shops');
  const trigger = page.getByRole('button', { name: 'Filters', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Filter shops' });
  await dialog.getByRole('combobox', { name: 'Shop category' }).selectOption('plants');
  await dialog.getByRole('button', { name: 'Apply filters' }).click();
  const activeTrigger = page.getByRole('button', { name: 'Filters (1)' });
  await expect(activeTrigger).toBeFocused();
  await activeTrigger.click();
  await dialog.getByRole('button', { name: 'Clear all' }).click();
  await expect(trigger).toBeFocused();
  await expect(page).toHaveURL(/\/shops$/);
});
