import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 360, 390, 768, 1024, 1440] as const;

for (const width of widths) {
  test(`editorial homepage is accessible and stable at ${width}px`, async ({ page }, testInfo) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Flowers, thoughtfully gathered.' })).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'A closer look at the catalog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Morning Bouquet', exact: true })).toBeVisible();
    await expect(page.getByText('Price unavailable').first()).toBeVisible();
    await expect(page.getByText(/Free Shipping|Freshness Guaranteed|Testimonials|Subscribe now|Our Blog/i)).toHaveCount(0);
    const localImages = page.locator('.editorial-home img');
    await expect(localImages).toHaveCount(3);
    for (let imageIndex = 0; imageIndex < await localImages.count(); imageIndex += 1) {
      const image = localImages.nth(imageIndex);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    expect(await localImages.evaluateAll((images) => images.every((image) => image.getAttribute('src')?.startsWith('/assets/editorial-home-') && image.getAttribute('width') && image.getAttribute('height') && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    expect(pageErrors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`editorial-home-${width}.png`), fullPage: true });
  });
}

test('homepage product, store, category and primary actions use registered routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Explore flowers' }).first()).toHaveAttribute('href', '/products');
  await expect(page.getByRole('link', { name: 'Discover shops' }).first()).toHaveAttribute('href', '/shops');
  await expect(page.getByRole('link', { name: /Bouquets/ }).first()).toHaveAttribute('href', '/shops?category=bouquets');
  await page.getByRole('link', { name: 'Morning Bouquet', exact: true }).click();
  await expect(page).toHaveURL(/\/products\/morning-bouquet$/);
  await expect(page.getByRole('heading', { name: 'Morning Bouquet', level: 1 })).toBeVisible();
  await page.goto('/');
  await page.getByRole('link', { name: 'Willow & Stem' }).first().click();
  await expect(page).toHaveURL(/\/shops\/willow-stem$/);
});

test('homepage remains usable with forced colors, reduced motion and enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/');
  await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  await expect(page.getByRole('heading', { name: 'Flowers, thoughtfully gathered.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore flowers' }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
});
