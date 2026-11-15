import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { AsyncRegion } from '../src/shared/components/AsyncRegion';

const states: ComponentProps<typeof AsyncRegion>['state'][] = [
  { status: 'loading' },
  { status: 'empty', message: 'Nothing available yet.' },
  { status: 'error', onRetry: () => undefined },
  { status: 'forbidden' },
  { status: 'ready', children: <p>Sample content</p> },
];

// Browser-only fixtures of the actual component; no production demo route or API.
for (const state of states) {
  test(`${state.status} state is accessible at mobile and desktop widths`, async ({ page }, testInfo) => {
    const markup = renderToStaticMarkup(<AsyncRegion title="Sample content" state={state} />);
    await page.setContent(`<!doctype html><html lang="en"><head><title>State accessibility fixture</title></head><body><main><h1>State review</h1>${markup}</main></body></html>`);
    await page.addStyleTag({ path: 'src/shared/styles.css' });
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${state.status}-${width}.png`), fullPage: true });
    }
    if (state.status === 'loading') await expect(page.getByRole('status')).toHaveText('Loading. Please wait.');
    if (state.status === 'error') {
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Try again' })).toBeFocused();
    }
  });
}
