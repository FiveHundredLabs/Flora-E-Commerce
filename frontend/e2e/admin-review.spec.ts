import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('oversight note length errors remain usable at 320px with enlarged text', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1000 }); await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/admin/refunds/sample-request'); await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  const input = page.getByRole('textbox', { name: 'Sample oversight note' }); await input.fill('x'.repeat(1001));
  await page.getByRole('button', { name: 'Save sample oversight note' }).click();
  await expect(input).toBeFocused(); await expect(input).toHaveAccessibleDescription('Use 1,000 characters or fewer.');
  await expect(page.getByText('Sample changes saved for this session only.')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: testInfo.outputPath('admin-note-error.png'), fullPage: true });
  await input.fill('Fictional corrected oversight note'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page.getByText('Saved sample oversight note: Fictional corrected oversight note')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save sample oversight note' })).toBeFocused();
});

test('category label errors support keyboard correction and dirty drafts clear saved status', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1000 }); await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/admin/categories/sample-stems'); await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  const input = page.getByRole('textbox', { name: 'Sample display label' }); await input.fill('x'.repeat(101));
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(input).toBeFocused(); await expect(input).toHaveAccessibleDescription('Use 100 characters or fewer.');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: testInfo.outputPath('admin-label-error.png'), fullPage: true });
  await input.fill('Corrected fictional stems'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page.getByText('Sample changes saved for this session only.')).toBeVisible();
  await input.fill('Unsaved fictional stems'); await expect(page.getByText('Sample changes saved for this session only.')).toHaveCount(0);
});

test('narrow category removal restores focus on cancellation and respects the remaining read-only category', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 1000 }); await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/admin/categories/sample-stems'); await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  const trigger = page.getByRole('button', { name: 'Remove sample category', exact: true }); await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Remove sample category', exact: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter'); await dialog.getByRole('button', { name: 'Close', exact: true }).click(); await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter'); await dialog.getByRole('button', { name: 'Confirm removal' }).click();
  await expect(page.getByRole('heading', { name: 'Categories', level: 1 })).toBeVisible(); await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('link', { name: 'Sample plants', exact: true }).click();
  await expect(page.getByText('Removal is unavailable for this sample category.')).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveCount(0); await expect(page.getByRole('button', { name: 'Remove sample category', exact: true })).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('detail navigation retains saved notes while discarding abandoned drafts', async ({ page }) => {
  await page.goto('/admin/users/sample-customer');
  const input = page.getByRole('textbox', { name: 'Sample oversight note' }); await input.fill('Saved fictional alias assessment');
  await page.getByRole('button', { name: 'Save sample oversight note' }).click();
  await expect(page.getByText('Saved sample oversight note: Saved fictional alias assessment')).toBeVisible();
  await input.fill('Abandoned fictional edit');
  const nav = page.getByRole('navigation', { name: 'Super admin workspace navigation' });
  await nav.getByRole('link', { name: 'Orders', exact: true }).click(); await page.getByRole('link', { name: 'Fictional Posy Order', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Sample oversight note' })).toHaveValue('');
  await nav.getByRole('link', { name: 'Users', exact: true }).click(); await page.getByRole('link', { name: 'Sample customer alias', exact: true }).click();
  await expect(input).toHaveValue('Saved fictional alias assessment');
  await expect(page.getByText('Sample changes saved for this session only.')).toHaveCount(0);
});
