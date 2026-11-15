import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router';
import { Shell } from '../src/shared/components/layout/Shell';
import { AsyncRegion } from '../src/shared/components/AsyncRegion';
import { TextField } from '../src/shared/components/ui/Fields';
import { Button } from '../src/shared/components/ui/Button';
import { mountFixture } from './helpers/fixture';

const states: ComponentProps<typeof AsyncRegion>['state'][] = [
  { status: 'loading' }, { status: 'empty', message: 'No sample content.' },
  { status: 'error', onRetry: () => undefined }, { status: 'forbidden' },
  { status: 'ready', children: <p>Sample content ready.</p> },
];

// Static composition fixtures check markup/CSS; ShellStates.test covers Query interactions.
for (const audience of ['customer', 'supplier', 'admin'] as const) {
  test(`${audience} shell supports every async state at mobile and desktop widths`, async ({ page }) => {
    for (const state of states) {
      await mountFixture(page, renderToStaticMarkup(<MemoryRouter initialEntries={[audience === 'customer' ? '/' : `/${audience}`]}>
        <Shell audience={audience}><h1>Sample workspace</h1><AsyncRegion title="Sample content" state={state} /></Shell>
      </MemoryRouter>), { fullPage: true });
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(page.getByRole('main')).toHaveCount(1);
        await expect(page.getByRole('region', { name: 'Sample content' })).toBeVisible();
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        expect(results.violations, `${audience}/${state.status}/${width}`).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    }
  });
}

for (const path of ['/', '/supplier', '/admin']) {
  test(`${path} remains operable with forced colors, enlarged text and reduced motion`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await page.goto(path);
    await page.addStyleTag({ content: 'body { font-size: 200%; }' });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.click();
    const nav = page.getByRole('navigation', { name: /navigation$/ });
    await expect(nav).toBeVisible();
    await page.keyboard.press('Tab');
    const current = nav.getByRole('link').first();
    await expect(current).toBeFocused();
    await expect(current).toHaveAttribute('aria-current', 'page');
    expect(await current.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('forced-colors.png'), fullPage: true });
  });
}

test('unknown workspace routes retain their shell and recover without account data', async ({ page }) => {
  for (const path of ['/supplier/missing', '/admin/missing']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('banner').getByText('Layout preview')).toBeVisible();
    await page.getByRole('link', { name: 'Return home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('main')).toBeFocused();
    await expect(page.getByRole('banner').getByText('Layout preview')).toHaveCount(0);
  }
});

test('forced colors preserve loading, validation and disabled-control boundaries', async ({ page }, testInfo) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.setViewportSize({ width: 320, height: 900 });
  await mountFixture(page, renderToStaticMarkup(<>
    <TextField label="Sample input" error="Enter sample text." required />
    <Button busy>Waiting for sample</Button>
    <AsyncRegion title="Sample content" state={{ status: 'loading' }} />
  </>));
  await expect(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('button')).toBeDisabled();
  await expect(page.getByRole('status')).toHaveText('Loading. Please wait.');
  const border = await page.getByRole('status').locator('[aria-hidden="true"]').evaluate((element) => getComputedStyle(element).borderTopStyle);
  expect(border).toBe('solid');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('forced-color-states.png'), fullPage: true });
});
