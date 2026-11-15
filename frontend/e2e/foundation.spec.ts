import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('keyboard recovery and browser history announce route changes', async ({ page }) => {
 await page.goto('/missing');
 await expect(page).toHaveTitle('Page not found | Flower & Flora');
 await page.keyboard.press('Tab');
 await page.keyboard.press('Tab');
 await page.keyboard.press('Tab');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link', { name: 'Return home' })).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('heading', { name: 'Welcome to Flower & Flora' })).toBeVisible();
 await expect(page.getByRole('main')).toBeFocused();
 await expect(page).toHaveTitle('Welcome to Flower & Flora | Flower & Flora');
 await page.goBack();
 await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
 await expect(page.getByRole('main')).toBeFocused();
});
test('mobile layout and keyboard skip link',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('main')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

for (const width of [375, 768, 1440]) {
 for (const path of ['/', '/missing']) {
 test(`accessible ${path} at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(`foundation-${width}.png`), fullPage: true });
 });
 }
}

test('home supports reduced motion and enlarged text at 320px', async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 900 });
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/');
 await page.addStyleTag({ content: 'body { font-size: 200%; }' });
 await expect(page.getByRole('region', { name: 'Stores and products' })).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
 expect(results.violations).toEqual([]);
});
