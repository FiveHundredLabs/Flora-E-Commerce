import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const accessibilityTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`public shell is accessible and stable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/products');
    await expect(page.getByRole('link', { name: 'Flower & Flora home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Shopping cart with 0 items' })).toBeVisible();
    await expect(page.locator('.public-header').getByRole('link', { name: 'Sample orders' })).toBeVisible();
    await expect(page.getByText(/Free delivery|Freshness Guaranteed|Subscribe|PayHere|SSL Secure/i)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(accessibilityTags).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`public-navigation-${width}.png`), fullPage: true });
  });
}

test('desktop navigation, category links, search, reset and no-results state use real routes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Marketplace navigation' });
  await expect(navigation.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
  await expect(navigation.getByRole('link', { name: 'Shops' })).toHaveAttribute('href', '/shops');
  await navigation.getByText('Categories').hover();
  await navigation.getByRole('link', { name: 'Plants' }).click();
  await expect(page).toHaveURL(/\/products\?category=plants$/);
  await expect(page.getByRole('link', { name: 'Plants' })).toHaveAttribute('aria-current', 'page');
  const search = page.getByRole('search').getByRole('searchbox', { name: 'Search flowers and botanical products' });
  await search.fill('not-a-sample-product');
  await page.getByRole('search').getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/q=not-a-sample-product/);
  await expect(page.getByText('No matches for your search filters.')).toBeVisible();
  await page.getByRole('search').getByRole('button', { name: 'Clear search' }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(search).toHaveValue('');
});

test('search rejects blank and overlong queries without navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const search = page.getByRole('search');
  await search.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(search.getByText('Enter a search term.')).toBeVisible();
  await search.getByRole('searchbox').fill('x'.repeat(101));
  await search.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(search.getByText('Use 100 characters or fewer.')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test('mobile drawer contains focus, exposes categories, closes with Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  const drawer = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('navigation', { name: 'Marketplace navigation' }).getByRole('link', { name: 'Supplier workspace' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Bouquets' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(drawer.getByRole('link').first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(drawer.locator(':focus')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(menu).toBeFocused();
});

test('cart drawer contains focus and returns to its always-available trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  const cart = page.getByRole('button', { name: 'Shopping cart with 0 items' });
  await cart.click();
  const drawer = page.getByRole('dialog', { name: 'Shopping Cart Drawer' });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('button', { name: 'Close cart drawer' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(cart).toBeFocused();
});

test('public metadata is descriptive and does not invent a deployment canonical', async ({ page }) => {
  await page.goto('/shops');
  await expect(page).toHaveTitle(/Flower & Flora/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /sample supplier stores/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
