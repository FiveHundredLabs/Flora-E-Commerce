import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { DiscoveryAdapter } from '../features/discovery';
import { HomePage } from './HomePage';

function renderHome(adapter: DiscoveryAdapter) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<QueryClientProvider client={client}><MemoryRouter><HomePage adapter={adapter} /></MemoryRouter></QueryClientProvider>);
}

const catalog = {
  stores: [{ slug: 'sample-store', name: 'Sample Store', location: 'colombo' as const, categories: ['bouquets' as const], description: 'A clearly fictional store.' }],
  products: [{ slug: 'sample-product', storeSlug: 'sample-store', name: 'Sample Product', category: 'bouquets' as const, description: 'A fictional catalog item.' }],
};

describe('editorial homepage', () => {
  it('renders fixture-backed discovery without inventing commercial facts', async () => {
    renderHome({ key: 'home-ready', load: async () => catalog });
    expect(await screen.findByRole('heading', { name: 'Sample Product' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Sample Store' })).toBeVisible();
    expect(screen.getByText('Price unavailable')).toBeVisible();
    expect(screen.getByText('Availability not connected')).toBeVisible();
    expect(screen.queryByText(/SALE -20%|\$38\.00|4\.9|free delivery|freshness guaranteed/i)).not.toBeInTheDocument();
  });

  it('shows an honest empty catalog state', async () => {
    renderHome({ key: 'home-empty', load: async () => ({ stores: [], products: [] }) });
    expect(await screen.findByText('The sample marketplace does not have catalog records yet.')).toBeVisible();
  });

  it('shows a retryable error without manufacturing fallback records', async () => {
    const user = userEvent.setup();
    renderHome({ key: 'home-error', load: async () => { throw new Error('fixture unavailable'); } });
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load this content.');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Sample Product' })).not.toBeInTheDocument();
  });
});
