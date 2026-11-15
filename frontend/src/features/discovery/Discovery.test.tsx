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
function mount(kind: Kind, entry = `/${kind}`, detail = false, adapter = mockDiscoveryAdapter) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  clients.push(client);
  return render(<MemoryRouter initialEntries={[entry]}><QueryClientProvider client={client}>
    <Routes><Route path={detail ? `/${kind}/:slug` : `/${kind}`} element={detail ? <DiscoveryDetail kind={kind} adapter={adapter} /> : <DiscoveryList kind={kind} adapter={adapter} />} /></Routes>
  </QueryClientProvider></MemoryRouter>);
}

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
});

it('renders product ownership and keeps purchase controls absent', async () => {
  mount('products', '/products/little-fern', true);
  await screen.findByRole('heading', { name: 'Little Fern', level: 1 });
  expect(screen.getByRole('link', { name: 'Fern House' })).toHaveAttribute('href', '/shops/fern-house');
  expect(screen.queryByRole('button', { name: /cart|buy/i })).not.toBeInTheDocument();
});

it.each(['shops', 'products'] as const)('recovers a missing %s detail without making up records', async (kind) => {
  mount(kind, `/${kind}/missing`, true);
  expect(await screen.findByText(/could not be found/)).toBeVisible();
  expect(screen.getByRole('link', { name: `Back to ${kind}` })).toHaveAttribute('href', `/${kind}`);
});
