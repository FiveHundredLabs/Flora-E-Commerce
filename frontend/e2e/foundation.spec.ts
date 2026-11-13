import { test, expect } from '@playwright/test';
test('home and unknown route recovery',async({page})=>{await page.goto('/missing');await page.getByRole('link',{name:'Return home'}).click();await expect(page.getByRole('heading',{name:'Welcome to Flower & Flora'})).toBeVisible();});
test('mobile layout and keyboard skip link',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
