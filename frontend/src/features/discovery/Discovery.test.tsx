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

it('preserves keyboard focus after applying and clearing filters', async () => {
  const user = userEvent.setup();
  mount('products');
  await screen.findByRole('link', { name: 'Little Fern' });
  await user.selectOptions(screen.getByRole('combobox', { name: 'Category' }), 'plants');
  const apply = screen.getByRole('button', { name: 'Apply filters' });
  await user.click(apply);
  expect(apply).toHaveFocus();
  const clear = screen.getByRole('button', { name: 'Clear filters' });
  await user.click(clear);
  expect(clear).toHaveFocus();
});

it('loads URL filters into controls and renders only matching sample products', async () => {
  mount('products', '/products?category=plants&location=kandy&sort=name-desc');
  expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue('plants');
  expect(screen.getByRole('combobox', { name: 'Location' })).toHaveValue('kandy');
  await screen.findByRole('link', { name: 'Little Fern' });
  const links = within(screen.getByRole('region', { name: 'Sample products' })).getAllByRole('heading', { level: 3 });
  expect(links.map((link) => link.textContent)).toEqual(['Little Fern', 'Leafy Companion']);
  expect(screen.queryByRole('link', { name: 'Morning Bouquet' })).not.toBeInTheDocument();
  expect(screen.getByText(/All shops and products here are fictional/)).toBeVisible();
});

it('supports draft search, applying filters, empty results and clearing even unapplied drafts', async () => {
  const user = userEvent.setup();
  mount('shops');
  await screen.findByRole('link', { name: 'Willow & Stem' });
  const search = screen.getByRole('textbox', { name: 'Search' });
  await user.type(search, 'no match');
  expect(screen.getByRole('link', { name: 'Willow & Stem' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Apply filters' }));
  expect(await screen.findByText(/No matches/)).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(await screen.findByRole('link', { name: 'Willow & Stem' })).toBeVisible();
  await user.type(screen.getByRole('textbox', { name: 'Search' }), 'draft');
  await user.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('');
});

it('validates long search input and focuses the field without changing results', async () => {
  const user = userEvent.setup();
  mount('shops');
  await screen.findByRole('link', { name: 'Willow & Stem' });
  await user.type(screen.getByRole('textbox', { name: 'Search' }), 'a'.repeat(101));
  await user.click(screen.getByRole('button', { name: 'Apply filters' }));
  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByRole('link', { name: 'Willow & Stem' })).toBeVisible();
});

it('normalizes a committed search even when the normalized URL does not change', async () => {
  const user = userEvent.setup();
  mount('shops', '/shops?q=fern');
  await screen.findByRole('link', { name: 'Fern House' });
  const input = screen.getByRole('textbox', { name: 'Search' });
  await user.clear(input);
  await user.type(input, ' fern ');
  await user.click(screen.getByRole('button', { name: 'Apply filters' }));
  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('fern');
});

it('shows an invalid-URL notice and safe defaults without echoing rejected values', async () => {
  mount('products', '/products?sort=internal-value&category=unknown');
  expect(screen.getByRole('alert')).toHaveTextContent('Some URL filters were invalid');
  expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveValue('name-asc');
  expect(await screen.findByRole('link', { name: 'Morning Bouquet' })).toBeVisible();
  expect(screen.queryByText('internal-value')).not.toBeInTheDocument();
});

it('handles pending and failed reads with safe retry recovery', async () => {
  let resolve: ((catalog: Catalog) => void) | undefined;
  const load = vi.fn<DiscoveryAdapter['load']>().mockRejectedValueOnce(new Error('private failure')).mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
  mount('shops', '/shops', false, { key: 'error-test', load });
  await screen.findByRole('alert');
  expect(screen.queryByText('private failure')).not.toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Loading');
  expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  const catalog = await mockDiscoveryAdapter.load();
  await act(async () => { resolve?.(catalog); });
  expect(await screen.findByRole('link', { name: 'Willow & Stem' })).toBeVisible();
  expect(load).toHaveBeenCalledTimes(2);
});

it('shows only the selected shop products and updates its document title', async () => {
  mount('shops', '/shops/willow-stem', true);
  await screen.findByRole('heading', { name: 'Willow & Stem', level: 1 });
  expect(screen.getByRole('link', { name: 'Morning Bouquet' })).toBeVisible();
  expect(screen.queryByRole('link', { name: 'Little Fern' })).not.toBeInTheDocument();
  expect(document.title).toBe('Willow & Stem | Flower & Flora');
  expect(screen.getByText('Verified Artisan Florist')).toBeVisible();
  expect(screen.queryByRole('group', { name: 'Product thumbnails' })).not.toBeInTheDocument();
});

it('renders product ownership and keeps purchase controls absent', async () => {
  mount('products', '/products/little-fern', true);
  await screen.findByRole('heading', { name: 'Little Fern', level: 1 });
  expect(screen.getByRole('link', { name: 'Fern House' })).toHaveAttribute('href', '/shops/fern-house');
  expect(screen.getByRole('group', { name: 'Product thumbnails' })).toBeVisible();
  expect(screen.queryByRole('button', { name: /cart|buy/i })).not.toBeInTheDocument();
});

it.each(['shops', 'products'] as const)('recovers a missing %s detail without making up records', async (kind) => {
  mount(kind, `/${kind}/missing`, true);
  expect(await screen.findByText(/could not be found/)).toBeVisible();
  expect(screen.getByRole('link', { name: `Back to ${kind}` })).toHaveAttribute('href', `/${kind}`);
});

it.each(['shops', 'products'] as const)('%s detail distinguishes pending/error from missing data and recovers safely', async (kind) => {
  let reject: ((error: Error) => void) | undefined;
  const catalog = await mockDiscoveryAdapter.load();
  const load = vi.fn<DiscoveryAdapter['load']>().mockImplementationOnce(() => new Promise((_, fail) => { reject = fail; })).mockResolvedValueOnce(catalog);
  mount(kind, kind === 'shops' ? '/shops/willow-stem' : '/products/morning-bouquet', true, { key: 'detail-failure', load });
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  expect(screen.queryByText(/could not be found/)).not.toBeInTheDocument();
  await act(async () => { reject?.(new Error('private adapter details')); });
  expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load');
  expect(screen.queryByText('private adapter details')).not.toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('heading', { level: 1, name: kind === 'shops' ? 'Willow & Stem' : 'Morning Bouquet' })).toBeVisible();
  expect(load).toHaveBeenCalledTimes(2);
});

it.each(['shops', 'products'] as const)('renders a genuinely empty %s catalog', async (kind) => {
  mount(kind, `/${kind}`, false, { key: 'empty', load: async () => ({ stores: [], products: [] }) });
  expect(await screen.findByText(/No matches/)).toBeVisible();
  expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
});

it('renders a shop without products without fabricating related items', async () => {
  const catalog = await mockDiscoveryAdapter.load();
  mount('shops', '/shops/willow-stem', true, { key: 'empty-shop', load: async () => ({ ...catalog, products: [] }) });
  expect(await screen.findByText('No sample products for this shop yet.')).toBeVisible();
  expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
});

it('validates unknown adapter output before rendering a catalog', async () => {
  mount('shops', '/shops', false, { key: 'malformed', load: async () => ({ stores: null, internal: 'private field' }) });
  expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load');
  expect(screen.queryByText(/private field/)).not.toBeInTheDocument();
});

it.each([
  ['products', '/products', false], ['shops', '/shops/willow-stem', true], ['products', '/products/morning-bouquet', true],
] as const)('retains cached %s content on refresh failure at %s', async (kind, path, detail) => {
  const catalog = await mockDiscoveryAdapter.load();
  let resolve: ((value: unknown) => void) | undefined;
  const load = vi.fn<DiscoveryAdapter['load']>().mockResolvedValueOnce(catalog).mockRejectedValueOnce(new Error('private refresh error'))
    .mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
  const { client } = mount(kind, path, detail, { key: 'refresh-test', load });
  const content = detail ? await screen.findByRole('heading', { level: 1, name: kind === 'shops' ? 'Willow & Stem' : 'Morning Bouquet' })
    : await screen.findByRole('link', { name: 'Morning Bouquet' });
  await act(async () => { await client.invalidateQueries({ queryKey: ['MOCK', 'discovery', 'refresh-test'] }); });
  expect(await screen.findByRole('alert')).toHaveTextContent('Previously loaded content is still shown');
  expect(content).toBeVisible();
  if (kind === 'shops') expect(screen.getByRole('link', { name: 'Morning Bouquet' })).toBeVisible();
  expect(screen.queryByText('private refresh error')).not.toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Retry refresh' }));
  expect(screen.getByRole('button', { name: 'Retry refresh' })).toBeDisabled();
  expect(content).toBeVisible();
  await act(async () => { resolve?.(catalog); });
  await screen.findByRole('heading', { name: detail ? `${kind === 'shops' ? 'Shop' : 'Product'} information` : 'Sample products' });
  // Wait for the refresh notice to clear after the Query notification is committed.
  await vi.waitFor(() => expect(screen.queryByRole('button', { name: 'Retry refresh' })).not.toBeInTheDocument());
  expect(screen.getByRole('heading', { name: detail ? `${kind === 'shops' ? 'Shop' : 'Product'} information` : 'Sample products' })).toHaveFocus();
  expect(load).toHaveBeenCalledTimes(3);
});

it('aborts an abandoned read and does not cache its late result', async () => {
  const signals: AbortSignal[] = [];
  let resolve: ((value: unknown) => void) | undefined;
  const { client, unmount } = mount('shops', '/shops', false, { key: 'cancel-test', load: (signal) => {
    if (signal) signals.push(signal);
    return new Promise((done) => { resolve = done; });
  } });
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  unmount();
  expect(signals[0]?.aborted).toBe(true);
  const catalog = await mockDiscoveryAdapter.load();
  await act(async () => { resolve?.(catalog); });
  expect(client.getQueryData(['MOCK', 'discovery', 'cancel-test'])).toBeUndefined();
});

it('does not steal focus when the user moves away during a refresh retry', async () => {
  const catalog = await mockDiscoveryAdapter.load();
  let resolve: ((value: unknown) => void) | undefined;
  const load = vi.fn<DiscoveryAdapter['load']>().mockResolvedValueOnce(catalog).mockRejectedValueOnce(new Error('refresh failed'))
    .mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
  const { client } = mount('products', '/products', false, { key: 'refresh-focus', load });
  await screen.findByRole('link', { name: 'Little Fern' });
  await act(async () => { await client.invalidateQueries({ queryKey: ['MOCK', 'discovery', 'refresh-focus'] }); });
  const user = userEvent.setup();
  await user.click(await screen.findByRole('button', { name: 'Retry refresh' }));
  const clear = screen.getByRole('button', { name: 'Clear filters' });
  await user.click(clear);
  await act(async () => { resolve?.(catalog); });
  await vi.waitFor(() => expect(screen.queryByRole('button', { name: 'Retry refresh' })).not.toBeInTheDocument());
  expect(clear).toHaveFocus();
});
