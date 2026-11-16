import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('supplier name validation supports keyboard correction without an obsolete saved confirmation', async ({ page }) => {
  await page.goto('/supplier/profile');
  const input = page.getByRole('textbox', { name: 'Sample store name' });
  await input.fill('x'.repeat(101)); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(input).toBeFocused(); await expect(input).toHaveAccessibleDescription('Use 100 characters or fewer.');
  await input.fill('Fictional corrected profile'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page.getByText('Sample changes saved for this session only.')).toBeVisible();
  await input.fill('Fictional unsaved edit'); await expect(page.getByText('Sample changes saved for this session only.')).toHaveCount(0);
});

test('blank stock errors and zero-count recovery work with enlarged text at 320px', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1000 }); await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/supplier/inventory'); await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  const input = page.getByRole('spinbutton', { name: 'Stock for Sample Posy — Standard' });
  await input.fill(''); await page.getByRole('button', { name: 'Save stock for Standard' }).click();
  await expect(input).toBeFocused(); await expect(input).toHaveAccessibleDescription('Enter a whole sample count from 0 to 9,999.');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: testInfo.outputPath('stock-error.png'), fullPage: true });
  await input.fill('0'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page.getByText('Current sample count: 0')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save stock for Standard' })).toBeFocused();
});

test('overlong fulfilment notes expose a readable error and never claim a save at 320px', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1000 }); await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/supplier/orders'); await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  const input = page.getByRole('textbox', { name: 'Fulfilment note for sample-order-one' });
  await input.fill('x'.repeat(1001)); await page.getByRole('button', { name: 'Save note for sample-order-one' }).click();
  await expect(input).toBeFocused(); await expect(input).toHaveAccessibleDescription('Use 1,000 characters or fewer.');
  await expect(page.getByText('Sample changes saved for this session only.')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: testInfo.outputPath('note-error.png'), fullPage: true });
});

test('removal cancellation restores its trigger and confirmed removal exposes useful empty states', async ({ page }) => {
  await page.goto('/supplier/products/sample-posy');
  const remove = page.getByRole('button', { name: 'Remove sample product', exact: true });
  await remove.click(); const dialog = page.getByRole('dialog', { name: 'Remove sample product', exact: true });
  await expect(dialog).toBeVisible(); expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(remove).toBeFocused();
  await page.keyboard.press('Enter'); await dialog.getByRole('button', { name: 'Confirm removal' }).click();
  await expect(page.getByText('No sample products yet. Add one to explore variants and inventory.')).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('navigation', { name: 'Supplier workspace navigation' }).getByRole('link', { name: 'Inventory', exact: true }).click();
  await expect(page.getByText('No sample variants to count. Add a variant from Products.')).toBeVisible();
  await page.getByRole('navigation', { name: 'Supplier workspace navigation' }).getByRole('link', { name: 'Orders', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'sample-order-one' })).toBeVisible();
});
