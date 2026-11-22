import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';
import { DiscoveryDetail, DiscoveryList } from './Discovery';
import { mockDiscoveryAdapter, type DiscoveryAdapter } from './api/mock';
import type { Catalog, Kind } from './model';

const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });
function mount(kind: Kind, entry = `/${kind}`, detail = false, adapter: DiscoveryAdapter = mockDiscoveryAdapter) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  clients.push(client);
  const view = render(<MemoryRouter initialEntries={[entry]}><QueryClientProvider client={client}>
    <Routes><Route path={detail ? `/${kind}/:slug` : `/${kind}`} element={detail ? <DiscoveryDetail kind={kind} adapter={adapter} /> : <DiscoveryList kind={kind} adapter={adapter} />} /></Routes>
  </QueryClientProvider></MemoryRouter>);
  return { ...view, client };
}

it('filters shops by their multi-category and location metadata', async () => {
  mount('shops', '/shops?category=plants&location=kandy&sort=name-desc');
  expect(screen.getByRole('combobox', { name: 'Shop category' })).toHaveValue('plants');
  expect(screen.getByRole('combobox', { name: 'Location' })).toHaveValue('kandy');
  expect(await screen.findByRole('link', { name: 'Fern House' })).toBeVisible();
  expect(screen.queryByRole('link', { name: 'Willow & Stem' })).not.toBeInTheDocument();
  expect(screen.getByText('1 store found')).toBeVisible();
});

it('filters products by owning store and location without a product category control', async () => {
  mount('products', '/products?store=fern-house&location=kandy&sort=name-desc');
  expect(await screen.findByRole('combobox', { name: 'Store' })).toHaveValue('fern-house');
  expect(screen.queryByRole('combobox', { name: /category/i })).not.toBeInTheDocument();
  const region = await screen.findByRole('region', { name: 'Product results' });
  expect(within(region).getAllByRole('heading', { level: 2 }).slice(1).map((node) => node.textContent)).toEqual(['Little Fern', 'Leafy Companion']);
  expect(screen.queryByRole('link', { name: 'Morning Bouquet' })).not.toBeInTheDocument();
});

it('rejects product category URLs and never echoes unsupported values', async () => {
  mount('products', '/products?category=plants&sort=private-value');
  expect(screen.getByRole('alert')).toHaveTextContent('unsupported');
  expect(screen.queryByRole('combobox', { name: /category/i })).not.toBeInTheDocument();
  expect(screen.queryByText('private-value')).not.toBeInTheDocument();
  expect(await screen.findByRole('link', { name: 'Morning Bouquet' })).toBeVisible();
});

it('applies, validates, normalizes and clears draft search', async () => {
  const user = userEvent.setup();
  mount('shops');
  await screen.findByRole('link', { name: 'Willow & Stem' });
  const input = screen.getByRole('textbox', { name: 'Search shops' });
  await user.type(input, 'a'.repeat(101));
  await user.click(screen.getByRole('button', { name: 'Apply filters' }));
  expect(input).toHaveFocus();
  expect(input).toHaveAttribute('aria-invalid', 'true');
  await user.clear(input);
  await user.type(input, ' fern ');
  await user.click(screen.getByRole('button', { name: 'Apply filters' }));
  expect(input).toHaveValue('fern');
  expect(await screen.findByRole('link', { name: 'Fern House' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear all' }));
  expect(input).toHaveValue('');
});

it('renders a truthful shop profile and only products owned by that shop', async () => {
  mount('shops', '/shops/willow-stem', true);
  expect(await screen.findByRole('heading', { name: 'Willow & Stem', level: 1 })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Morning Bouquet' })).toBeVisible();
  expect(screen.queryByRole('link', { name: 'Little Fern' })).not.toBeInTheDocument();
  expect(screen.getByText(/Contact details, operating hours/)).toBeVisible();
  expect(screen.getByText(/no live prices, stock, ratings/i)).toBeVisible();
  expect(document.title).toBe('Willow & Stem | Flower & Flora');
});

it('keeps the Phase 05 product route compatible without fabricated commerce facts', async () => {
  mount('products', '/products/little-fern', true);
  expect(await screen.findByRole('heading', { name: 'Little Fern', level: 1 })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Fern House' })).toHaveAttribute('href', '/shops/fern-house');
  expect(screen.getByText('Price unavailable')).toBeVisible();
  expect(screen.getByText('Availability not connected')).toBeVisible();
  expect(screen.queryByRole('button', { name: /cart|buy/i })).not.toBeInTheDocument();
});

it.each(['shops', 'products'] as const)('renders a genuine empty %s catalog', async (kind) => {
  mount(kind, `/${kind}`, false, { key: `empty-${kind}`, load: async () => ({ stores: [], products: [] }) });
  expect(await screen.findByText(new RegExp(`No ${kind} match`))).toBeVisible();
});

it.each(['shops', 'products'] as const)('recovers a missing %s record without fabrication', async (kind) => {
  mount(kind, `/${kind}/missing`, true);
  expect(await screen.findByText(/could not be found/)).toBeVisible();
  expect(screen.getByRole('link', { name: `Back to ${kind}` })).toHaveAttribute('href', `/${kind}`);
});

it('distinguishes pending, error and successful retry states', async () => {
  let resolve: ((catalog: Catalog) => void) | undefined;
  const load = vi.fn<DiscoveryAdapter['load']>().mockRejectedValueOnce(new Error('private failure')).mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
  mount('shops', '/shops', false, { key: 'error-test', load });
  expect(await screen.findByRole('alert')).not.toHaveTextContent('private failure');
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  const catalog = await mockDiscoveryAdapter.load();
  await act(async () => { resolve?.(catalog); });
  expect(await screen.findByRole('link', { name: 'Willow & Stem' })).toBeVisible();
});

it('aborts abandoned reads without caching late invalid data', async () => {
  const signals: AbortSignal[] = [];
  let resolve: ((value: unknown) => void) | undefined;
  const { client, unmount } = mount('shops', '/shops', false, { key: 'cancel', load: (signal) => {
    if (signal) signals.push(signal);
    return new Promise((done) => { resolve = done; });
  } });
  unmount();
  expect(signals[0]?.aborted).toBe(true);
  await act(async () => { resolve?.({ stores: null, products: [] }); });
  expect(client.getQueryData(['MOCK', 'discovery', 'cancel'])).toBeUndefined();
});
