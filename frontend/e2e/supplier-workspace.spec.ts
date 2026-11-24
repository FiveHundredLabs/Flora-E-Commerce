import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('supplier overview derives a one-store work queue without fabricated KPIs', async ({ page }) => {
  await page.goto('/supplier');
  await expect(page.getByRole('heading', { name: 'Meadow Studio' })).toBeVisible();
  await expect(page.getByText('Allowed by fixture')).toBeVisible();
  await expect(page.getByText('Not an approval or authenticated role')).toBeVisible();
  await expect(page.getByText('1 low-count variant')).toBeVisible();
  await expect(page.getByText('1 editable order note')).toBeVisible();
  await expect(page.getByText(/These counts are not KPIs/)).toBeVisible();
  await expect(page.getByRole('combobox', { name: /store/i })).toHaveCount(0);
});

test('mobile supplier drawer exposes the supported one-store navigation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/supplier');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.click();
  const navigation = page.getByRole('navigation', { name: 'Supplier workspace navigation' });
  await expect(navigation.getByRole('link', { name: 'Store profile' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Products' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(navigation).not.toBeVisible();
});

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  for (const path of ['/supplier', '/supplier/register', '/supplier/profile']) {
    test(`${path} supplier foundation is accessible at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await expect(page.getByRole('status')).toHaveCount(0);
      await expect(page.getByText(/No account is created and nothing is published/)).toBeVisible();
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath('supplier-foundation.png'), fullPage: true });
    });
  }
}
