import { expect, test } from '@playwright/test';

test('internal design-system preview is excluded from production', async ({ page }) => {
  await page.goto('/dev/design-system');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Considered by nature.' })).toHaveCount(0);
});
