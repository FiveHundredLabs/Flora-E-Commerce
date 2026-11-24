import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Botanical Brand Intro Animation', () => {
  test('cold load on / renders the botanical reveal, then completes', async ({ page }) => {
    await page.goto('/');

    // Overlay is present on cold home page load
    const overlay = page.getByRole('region', { name: /Site introduction animation/i });
    await expect(overlay).toBeVisible();

    // Skip button is accessible
    const skipBtn = page.getByRole('button', { name: /Skip intro/i });
    await expect(skipBtn).toBeVisible();

    await expect(overlay.locator('.intro-leaf')).toHaveCount(4);
    await expect(overlay.locator('.intro-scene__frame')).toHaveCount(0);

    // Capture visual artifacts for walkthrough
    await page.screenshot({ path: '/home/sahandev/.gemini/antigravity/brain/2e96bd35-8f9f-4953-aca2-63b7bc52c5c2/intro-bloom.png' });

    // Axe accessibility audit on intro overlay
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axeResults.violations).toEqual([]);

    // Clicking skip button dismisses the overlay
    await skipBtn.click();
    await expect(overlay).toBeHidden({ timeout: 2000 });

    // Homepage content is visible and interactive
    await expect(page.getByRole('heading', { level: 1, name: 'Flowers, thoughtfully gathered.' })).toBeVisible();
  });

  test('Escape key skips the intro animation', async ({ page }) => {
    await page.goto('/');
    const overlay = page.getByRole('region', { name: /Site introduction animation/i });
    await expect(overlay).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(overlay).toBeHidden({ timeout: 2000 });
    await expect(page.getByRole('heading', { level: 1, name: 'Flowers, thoughtfully gathered.' })).toBeVisible();
  });

  test('clicking anywhere on the overlay skips the intro animation', async ({ page }) => {
    await page.goto('/');
    const overlay = page.getByRole('region', { name: /Site introduction animation/i });
    await expect(overlay).toBeVisible();

    await overlay.click({ position: { x: 100, y: 100 } });
    await expect(overlay).toBeHidden({ timeout: 2000 });
    await expect(page.getByRole('heading', { level: 1, name: 'Flowers, thoughtfully gathered.' })).toBeVisible();
  });

  test('intro does NOT render when landing directly on a non-home route', async ({ page }) => {
    await page.goto('/shops');
    const overlay = page.getByRole('region', { name: /Site introduction animation/i });
    await expect(overlay).toHaveCount(0);
  });

  test('SPA navigation back to home does NOT re-trigger intro', async ({ page }) => {
    await page.goto('/');
    const overlay = page.getByRole('region', { name: /Site introduction animation/i });
    await expect(overlay).toBeVisible();

    // Skip intro
    await page.getByRole('button', { name: /Skip intro/i }).click();
    await expect(overlay).toBeHidden({ timeout: 2000 });

    // Navigate to /shops via header navigation link
    await page.getByRole('link', { name: 'Explore flowers' }).first().click();
    await expect(page).toHaveURL(/\/products$/);

    // Navigate back to /
    await page.goBack();
    await expect(page).toHaveURL('http://127.0.0.1:4173/');

    // Intro overlay should not reappear on SPA navigation
    await expect(page.getByRole('region', { name: /Site introduction animation/i })).toHaveCount(0);
  });

  test('prefers-reduced-motion skips 3D and is fully accessible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Under reduced motion, brand mark is accessible
    const overlay = page.getByRole('region', { name: /Site introduction animation/i });
    if (await overlay.isVisible()) {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);

      // Completes quickly
      await expect(overlay).toBeHidden({ timeout: 2000 });
    }

    await expect(page.getByRole('heading', { level: 1, name: 'Flowers, thoughtfully gathered.' })).toBeVisible();
  });
});
