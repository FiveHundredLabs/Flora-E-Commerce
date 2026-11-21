import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { DesignSystemPreview } from './DesignSystemPreview';
import { App } from '../../app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('DesignSystemPreview Harness & Route Gating', () => {
  it('renders all foundation preview sections without errors', () => {
    render(
      <MemoryRouter>
        <DesignSystemPreview />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Botanical Editorial Design System Foundation/i, level: 1 })).toBeVisible();
    expect(screen.getByRole('heading', { name: /1. Brand Palette & Contrast Matrix/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /2. Typography & Thematic Separation/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /3. Shared Accessible UI Primitives/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /4. Breadcrumbs & Navigational Hierarchy/i })).toBeVisible();

    // Verify contrast matrix table exists
    expect(screen.getByRole('table', { name: 'Contrast Verification Matrix' })).toBeVisible();
  });

  it('routes to /dev/design-system in development environment', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/dev/design-system']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByRole('heading', { name: /Botanical Editorial Design System Foundation/i, level: 1 })).toBeVisible();
  });
});
