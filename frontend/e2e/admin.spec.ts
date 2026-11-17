import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('admin category workflow validates, renames and confirms session-only removal', async ({ page }) => {
  await page.goto('/admin/categories'); await page.getByRole('link', { name: 'Add sample category' }).click();
  await page.getByRole('button', { name: 'Create sample category' }).click();
  const input = page.getByRole('textbox', { name: 'New sample category label' }); await expect(input).toBeFocused();
  await expect(input).toHaveAccessibleDescription('Enter a sample label.');
  await input.fill('Fictional event category'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await page.getByRole('link', { name: 'Fictional event category', exact: true }).click();
  await page.getByRole('textbox', { name: 'Sample display label' }).fill('Edited fictional category');
  await page.getByRole('button', { name: 'Save sample label' }).click();
  await expect(page.getByRole('heading', { name: 'Edited fictional category', exact: true })).toBeVisible();
  const remove = page.getByRole('button', { name: 'Remove sample category', exact: true }); await remove.click();
  const dialog = page.getByRole('dialog', { name: 'Remove sample category', exact: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(remove).toBeFocused();
  await page.keyboard.press('Enter'); await dialog.getByRole('button', { name: 'Confirm removal' }).click();
  await expect(page.getByRole('heading', { name: 'Categories', level: 1 })).toBeVisible(); await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Edited fictional category', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Sample stems', exact: true })).toBeVisible();
});

test('sample supplier and user edits remain isolated from permissions and reset on reload', async ({ page }) => {
  await page.goto('/admin/suppliers/sample-studio');
  await page.getByRole('textbox', { name: 'Sample display label' }).fill('Edited fictional studio');
  await page.getByRole('button', { name: 'Save sample label' }).click();
  await expect(page.getByRole('heading', { name: 'Edited fictional studio', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Sample oversight note' }).fill('Fictional supplier assessment');
  await page.getByRole('button', { name: 'Save sample oversight note' }).click();
  await expect(page.getByText('Saved sample oversight note: Fictional supplier assessment')).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Super admin workspace navigation' });
  await nav.getByRole('link', { name: 'Users', exact: true }).click(); await page.getByRole('link', { name: 'Sample customer alias', exact: true }).click();
  await page.getByRole('textbox', { name: 'Sample display label' }).fill('Fictional renamed alias'); await page.getByRole('button', { name: 'Save sample label' }).click();
  await expect(page.getByRole('heading', { name: 'Fictional renamed alias', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /approve|reject|ban|grant role/i })).toHaveCount(0);
  await nav.getByRole('link', { name: 'Suppliers', exact: true }).click(); await page.getByRole('link', { name: 'Edited fictional studio', exact: true }).click();
  await expect(page.getByText('Saved sample oversight note: Fictional supplier assessment')).toBeVisible();
  await page.reload(); await expect(page.getByRole('heading', { name: 'Fictional Stem Studio', exact: true })).toBeVisible();
});

test('refund and feedback oversight notes do not establish financial or moderation decisions', async ({ page }) => {
  await page.goto('/admin/refunds/sample-request');
  await page.getByRole('textbox', { name: 'Sample oversight note' }).fill('Fictional refund evidence reviewed');
  await page.getByRole('button', { name: 'Save sample oversight note' }).click();
  await expect(page.getByText('Saved sample oversight note: Fictional refund evidence reviewed')).toBeVisible();
  await expect(page.getByText(/No refund decision, eligibility, amount/)).toBeVisible();
  await page.getByRole('link', { name: 'View related sample order' }).click();
  await expect(page.getByText('Payment: not connected; no payment has been requested')).toBeVisible();
  await page.getByRole('navigation', { name: 'Super admin workspace navigation' }).getByRole('link', { name: 'Feedback', exact: true }).click();
  await page.getByRole('link', { name: 'Fictional store feedback', exact: true }).click();
  await page.getByRole('textbox', { name: 'Sample oversight note' }).fill('Fictional moderation assessment');
  await page.getByRole('button', { name: 'Save sample oversight note' }).click();
  await expect(page.getByText('Saved sample oversight note: Fictional moderation assessment')).toBeVisible();
  await expect(page.getByText('Fictional feedback: This is fictional feedback for exploring oversight.')).toBeVisible();
  await expect(page.getByRole('button', { name: /refund|publish|hide|delete feedback/i })).toHaveCount(0);
  await page.goto('/admin/orders/sample-order?payment=successful&refund=approved');
  await expect(page.getByText('Payment: not connected; no payment has been requested')).toBeVisible();
});

for (const path of ['/admin/suppliers', '/admin/users', '/admin/categories', '/admin/orders', '/admin/refunds', '/admin/reviews',
  '/admin/suppliers/sample-studio', '/admin/users/sample-customer', '/admin/categories/sample-plants', '/admin/orders/sample-order', '/admin/refunds/sample-request', '/admin/reviews/sample-feedback', '/admin/categories/new', '/admin/orders/missing']) {
  for (const width of [320, 1440]) {
    test(`${path} admin oversight is accessible at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      if (width === 320) await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
      await page.goto(path);
      await expect(page.getByText(/No real accounts, approvals, refunds or moderation actions/)).toBeVisible();
      await expect(page.getByRole('status')).toHaveCount(0);
      if (width === 320 && path === '/admin/refunds/sample-request') await page.addStyleTag({ content: 'body { font-size: 200%; }' });
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (path === '/admin/refunds/sample-request' || path === '/admin/categories/new') {
        await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: testInfo.outputPath(`admin-${width}.png`), fullPage: true });
      }
    });
  }
}
