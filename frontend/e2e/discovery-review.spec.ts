import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/shops', '/products']) {
  test(`${path} validation and empty results remain accessible at 320px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.goto(path);
    const trigger = page.getByRole('button', { name: 'Filters', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    const input = dialog.getByRole('textbox', { name: path === '/shops' ? 'Search shops' : 'Search products' });
    await input.fill('x'.repeat(101));
    await dialog.getByRole('button', { name: 'Apply filters' }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await input.fill('no matching fixture');
    await dialog.getByRole('button', { name: 'Apply filters' }).click();
    await expect(page.getByText(new RegExp(`No ${path.slice(1)} match`))).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('empty-mobile.png'), fullPage: true });
  });
}

test('search treats markup and duplicate URL parameters as data', async ({ page }) => {
  const sample = '<img src=x onerror=alert(1)>';
  await page.goto(`/products?q=${encodeURIComponent(sample)}`);
  await expect(page.getByRole('textbox', { name: 'Search products' })).toHaveValue(sample);
  await expect(page.locator('img')).toHaveCount(0);
  await page.goto('/products?q=fern&q=bouquet&location=kandy');
  await expect(page.getByRole('alert')).toContainText('unsupported');
  await expect(page.getByRole('textbox', { name: 'Search products' })).toHaveValue('');
});

for (const path of ['/shops/missing', '/products/missing']) {
  test(`${path} has accessible recovery`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(/could not be found/)).toBeVisible();
    await expect(page.getByRole('link', { name: /^Back to/ })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}
