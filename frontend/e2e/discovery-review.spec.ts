import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('keyboard filter application and clearing retain focus and synchronize history', async ({ page }) => {
  await page.goto('/shops');
  const search = page.getByRole('textbox', { name: 'Search' });
  await search.fill('fern');
  for (let step = 0; step < 4; step += 1) await page.keyboard.press('Tab');
  const apply = page.getByRole('button', { name: 'Apply filters' });
  await expect(apply).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/q=fern$/);
  await expect(apply).toBeFocused();
  await expect(page.getByRole('link', { name: 'Fern House', exact: true })).toBeVisible();
  await page.keyboard.press('Tab');
  const clear = page.getByRole('button', { name: 'Clear filters' });
  await expect(clear).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/shops$/);
  await expect(clear).toBeFocused();
  await page.goBack();
  await expect(search).toHaveValue('fern');
  await page.goForward();
  await expect(search).toHaveValue('');
});

for (const path of ['/shops', '/products']) {
  test(`${path} validation and empty results remain accessible at 320px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto(path);
    await page.addStyleTag({ content: 'body { font-size: 200%; }' });
    const input = page.getByRole('textbox', { name: 'Search' });
    await input.fill('x'.repeat(101));
    await page.getByRole('button', { name: 'Apply filters' }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(/Use 100 characters or fewer/);
    expect(await input.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
    await input.fill('no matching sample');
    await page.getByRole('button', { name: 'Apply filters' }).click();
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(page.getByText(/No matches/)).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole('link', { name: 'Skip to content' })).not.toBeInViewport();
    // Full-page captures of a scrolled viewport can include offscreen fixed elements.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath('empty-forced-colors.png'), fullPage: true });
  });
}

for (const path of ['/shops/missing', '/products/missing']) {
  test(`${path} missing details have accessible recovery`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/not found/);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    await expect(page.getByRole('link', { name: /^Back to/ })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('missing-detail.png'), fullPage: true });
  });
}

test('search treats markup and duplicate URL parameters as data', async ({ page }) => {
  const sample = '<img src=x onerror=alert(1)>';
  await page.goto(`/products?q=${encodeURIComponent(sample)}`);
  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue(sample);
  await expect(page.getByText(/No matches/)).toBeVisible();
  await expect(page.locator('img')).toHaveCount(0);
  await page.goto('/products?q=fern&q=bouquet&location=kandy');
  await expect(page.getByRole('alert')).toContainText('Some URL filters were invalid');
  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Location' })).toHaveValue('kandy');
});

test('history discards drafts when equivalent URLs represent the same filter values', async ({ page }) => {
  await page.goto('/products?sort=name-asc');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page).toHaveURL(/\/products$/);
  await page.getByRole('textbox', { name: 'Search' }).fill('unsaved draft');
  await page.goBack();
  await expect(page).toHaveURL(/sort=name-asc$/);
  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue('');
});
