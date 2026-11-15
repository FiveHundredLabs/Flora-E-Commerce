import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('feedback confirmation describes only the saved version, not later edits', async ({ page }) => {
  await page.goto('/account/orders/sample-delivered');
  const input = page.getByRole('textbox', { name: 'Sample feedback' });
  await input.fill('Saved fictional feedback');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save sample feedback' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Sample feedback saved for this session only.')).toBeVisible();
  await input.fill('Unsaved fictional changes');
  await expect(page.getByText('Sample feedback saved for this session only.')).toHaveCount(0);
  await page.getByRole('link', { name: 'Back to sample orders' }).click();
  await page.getByRole('link', { name: 'sample-delivered', exact: true }).click();
  await expect(input).toHaveValue('Saved fictional feedback');
});

test('cart quantity recovery and removal remain accessible with enlarged text and forced colors', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/products/morning-bouquet');
  await page.getByRole('button', { name: 'Add to sample cart' }).click();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Marketplace navigation' }).getByRole('link', { name: 'Cart', exact: true }).click();
  await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  const input = page.getByRole('spinbutton', { name: 'Quantity for Morning Bouquet' });
  await input.fill('0');
  const update = page.getByRole('button', { name: 'Update quantity for Morning Bouquet' });
  await update.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveAccessibleDescription(/whole quantity from 1 to 99/);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('cart-validation.png'), fullPage: true });
  await input.fill('2'); await update.click();
  await expect(input).not.toHaveAttribute('aria-invalid'); await expect(update).toBeFocused();
  await page.getByRole('button', { name: 'Remove Morning Bouquet' }).click();
  await expect(page.getByRole('heading', { name: 'Sample cart' })).toBeFocused();
  await expect(page.getByText('Your sample cart is empty.')).toBeVisible();
});

test('feedback length errors are usable at narrow widths and do not claim a save', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/account/orders/sample-delivered');
  await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  const input = page.getByRole('textbox', { name: 'Sample feedback' });
  await input.fill('x'.repeat(1001)); await page.getByRole('button', { name: 'Save sample feedback' }).click();
  await expect(input).toBeFocused(); await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription('Use 1,000 characters or fewer.');
  await expect(page.getByText('Sample feedback saved for this session only.')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('feedback-validation.png'), fullPage: true });
});

test('payment query claims cannot manufacture a missing order or feedback access', async ({ page }) => {
  await page.goto('/account/orders/missing?status=successful&paid=true');
  await expect(page.getByText('This sample order could not be found.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Payment status' })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Sample feedback' })).toHaveCount(0);
});
