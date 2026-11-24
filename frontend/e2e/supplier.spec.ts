import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('sample application and profile save separately without creating an account', async ({ page }) => {
  await page.goto('/supplier/register');
  await page.getByRole('textbox', { name: 'Sample store name' }).fill('Fictional Applicant');
  await page.getByRole('button', { name: 'Save sample application' }).click();
  await expect(page.getByText('A sample application is saved in this session. It has no real approval status.')).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Supplier workspace navigation' });
  await nav.getByRole('link', { name: 'Store profile', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Sample store name' })).toHaveValue('Meadow Studio');
  await page.getByRole('textbox', { name: 'Sample store name' }).fill('Fictional Profile');
  await page.getByRole('button', { name: 'Save sample profile' }).click();
  await expect(page.getByText('Sample changes saved for this session only.')).toBeVisible();
  await nav.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Fictional Profile' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Meadow Studio' })).toBeVisible();
});

test('supplier catalog supports product and variant edits, stock recovery and confirmed removal', async ({ page }) => {
  await page.goto('/supplier/products');
  await page.getByRole('link', { name: 'Add sample product', exact: true }).click();
  await page.getByRole('button', { name: 'Create sample product' }).click();
  await expect(page.getByRole('textbox', { name: 'Sample product name' })).toBeFocused();
  await page.getByRole('textbox', { name: 'Sample product name' }).fill('Fictional Arrangement');
  await page.getByRole('textbox', { name: 'Sample product description' }).fill('A catalog workflow fixture.');
  await page.getByRole('button', { name: 'Create sample product' }).click();
  await page.getByRole('link', { name: 'Fictional Arrangement', exact: true }).click();
  await expect(page.getByText('No sample variants yet.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Sample product name' }).fill('Edited Arrangement');
  await page.getByRole('button', { name: 'Save sample product' }).click();
  await expect(page.getByRole('heading', { name: 'Edited Arrangement', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'New variant name' }).fill('Mini');
  await page.getByRole('spinbutton', { name: 'New variant stock' }).fill('4');
  await page.getByRole('button', { name: 'Add sample variant', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mini', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Variant name for Mini' }).fill('Small');
  await page.getByRole('button', { name: 'Save variant Mini', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Small', exact: true })).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Supplier workspace navigation' });
  await nav.getByRole('link', { name: 'Inventory', exact: true }).click();
  const count = page.getByRole('spinbutton', { name: 'Stock for Edited Arrangement — Small' });
  await count.fill('-1'); await page.getByRole('button', { name: 'Save stock for Small', exact: true }).click();
  await expect(count).toBeFocused(); await expect(count).toHaveAttribute('aria-invalid', 'true');
  await count.fill('0'); await page.getByRole('button', { name: 'Save stock for Small', exact: true }).click();
  await expect(page.getByText('Current sample count: 0', { exact: true })).toBeVisible();
  await nav.getByRole('link', { name: 'Products', exact: true }).click();
  await page.getByRole('link', { name: 'Edited Arrangement', exact: true }).click();
  await page.getByRole('button', { name: 'Remove variant Small', exact: true }).click();
  await page.getByRole('dialog', { name: 'Remove variant Small', exact: true }).getByRole('button', { name: 'Confirm removal' }).click();
  await expect(page.getByText('No sample variants yet.')).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('button', { name: 'Remove sample product', exact: true }).click();
  await page.getByRole('dialog', { name: 'Remove sample product', exact: true }).getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Edited Arrangement', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove sample product', exact: true }).click();
  await page.getByRole('dialog', { name: 'Remove sample product', exact: true }).getByRole('button', { name: 'Confirm removal' }).click();
  await expect(page.getByRole('heading', { name: 'Supplier products', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edited Arrangement', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Sample Posy', exact: true })).toBeVisible();
});

test('fulfilment notes preserve sample order counts and never claim a provider booking', async ({ page }) => {
  await page.goto('/supplier/orders');
  const input = page.getByRole('textbox', { name: 'Fulfilment note for sample-order-one' });
  await input.fill('Fictional stems packed for review.');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save note for sample-order-one' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Saved sample note: Fictional stems packed for review.')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Fulfilment note for sample-order-two' })).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Supplier workspace navigation' }).getByRole('link', { name: 'Sales', exact: true }).click();
  const orders = page.getByText('Sample order count', { exact: true }).locator('..');
  await expect(orders).toContainText('2');
  await expect(page.getByText('Sample units ordered', { exact: true }).locator('..')).toContainText('3');
  await expect(page.getByText(/Revenue, currency, refunds and payouts are unavailable/)).toBeVisible();
});

for (const path of ['/supplier/register', '/supplier/profile', '/supplier/products', '/supplier/products/new', '/supplier/products/sample-posy', '/supplier/products/missing', '/supplier/inventory', '/supplier/orders', '/supplier/sales']) {
  for (const width of [320, 1440]) {
    test(`${path} supplier screen is accessible at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      if (width === 320) await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
      await page.goto(path);
      await expect(page.getByRole('status')).toHaveCount(0);
      await expect(page.getByText(/No account is created and nothing is published/)).toBeVisible();
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (path === '/supplier/products/sample-posy' || path === '/supplier/inventory') {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: testInfo.outputPath(`supplier-${width}.png`), fullPage: true });
      }
    });
  }
}
