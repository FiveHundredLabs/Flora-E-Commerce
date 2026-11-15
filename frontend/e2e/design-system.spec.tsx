import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../src/shared/components/ui/Button';
import { TextField, SelectField } from '../src/shared/components/ui/Fields';
import { Card, Badge } from '../src/shared/components/ui/Content';
import { mountFixture } from './helpers/fixture';

for (const path of ['/', '/supplier', '/admin']) {
  for (const width of [375, 768, 1440]) {
    test(`${path} shell works at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      const nav = page.getByRole('navigation', { name: /navigation$/ });
      if (width < 768) {
        await expect(nav).toBeHidden();
        await menu.click();
        await expect(menu).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Escape');
        await expect(menu).toHaveAttribute('aria-expanded', 'false');
        await menu.click();
        await expect(nav).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(nav.getByRole('link').first()).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(menu).toBeFocused();
        await expect(nav).toBeHidden();
        await menu.click();
        await nav.getByRole('link').first().click();
        await expect(page.getByRole('main')).toBeFocused();
        await expect(nav).toBeHidden();
      } else {
        await expect(menu).toBeHidden();
        await expect(nav).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath(`shell-${width}.png`), fullPage: true });
    });
  }
}

test('native modal contains focus, closes with Escape and restores the trigger', async ({ page }) => {
  await page.goto('/supplier');
  const trigger = page.getByRole('button', { name: 'About this workspace' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'About this workspace' });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'Close' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  // Native modal tab order may include the dialog/document boundary; background links stay inert.
  expect(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement?.closest('dialog'))).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await close.click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('form and content primitives have accessible names, descriptions and contrast', async ({ page }, testInfo) => {
  await mountFixture(page, renderToStaticMarkup(<Card title="Sample form">
    <Badge>Sample label</Badge>
    <TextField label="Sample name" hint="For component review only." error="Enter a name." required />
    <SelectField label="Sample choice" required><option value="">Choose an option</option><option value="a">Alpha</option></SelectField>
    <Button>Continue</Button> <Button variant="secondary">Cancel</Button> <Button variant="destructive">Remove</Button>
  </Card>));
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`components-${width}.png`), fullPage: true });
  }
  await page.getByRole('textbox', { name: 'Sample name' }).fill('Sample');
  await page.getByRole('combobox').selectOption('a');
  await expect(page.getByRole('combobox')).toHaveValue('a');
});
