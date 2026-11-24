import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 360, 390, 768, 1024, 1440] as const;

for (const width of widths) {
  test(`foundation is accessible without overflow at ${width}px`, async ({ page }, testInfo) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', error => pageErrors.push(error));
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/dev/design-system');
    await expect(page.getByRole('heading', { level: 1, name: 'Considered by nature.' })).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    expect(pageErrors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`foundation-${width}.png`), fullPage: true });
  });
}

test('keyboard patterns expose validation, tabs, dropdown and toast feedback', async ({ page }) => {
  await page.goto('/dev/design-system');
  await page.getByRole('button', { name: 'Validate preview' }).click();
  await expect(page.getByText('Enter a preview label.')).toBeVisible();
  await page.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Details' })).toBeFocused();
  await page.getByText('Preview links').click();
  await page.keyboard.press('Escape');
  await expect(page.getByText('Preview links')).toBeFocused();
  await page.getByRole('button', { name: 'solid', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'solid preview action.' })).toBeVisible();
});

for (const pattern of ['dialog', 'drawer', 'confirmation'] as const) {
  test(`${pattern} traps focus, closes with Escape, and returns focus`, async ({ page }) => {
    await page.goto('/dev/design-system');
    const trigger = page.getByRole('button', { name: `Open ${pattern}` });
    await trigger.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    const close = modal.getByRole('button', { name: pattern === 'confirmation' ? 'Cancel' : 'Close' });
    await close.focus();
    await page.keyboard.press('Tab');
    await expect(modal.locator(':focus')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

test('foundation supports reduced motion, forced colors and enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/dev/design-system');
  await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Open dialog' })).toBeVisible();
});
