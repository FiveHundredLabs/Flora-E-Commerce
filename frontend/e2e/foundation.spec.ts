import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('home and unknown route recovery',async({page})=>{await page.goto('/missing');await page.getByRole('link',{name:'Return home'}).click();await expect(page.getByRole('heading',{name:'Welcome to Flower & Flora'})).toBeVisible();});
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
 test(`accessible foundation at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(`foundation-${width}.png`), fullPage: true });
 });
}
