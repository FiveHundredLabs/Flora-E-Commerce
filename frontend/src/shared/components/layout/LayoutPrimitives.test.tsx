import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import {
  Container,
  PageHeader,
  PublicShell,
  DashboardShell,
} from './index';
import { Breadcrumbs } from '../ui/Breadcrumbs';

describe('Layout Primitives', () => {
  it('renders Container with different responsive variants and elements', () => {
    const { rerender } = render(<Container variant="public">Content</Container>);
    expect(screen.getByText('Content')).toHaveClass('container--public');

    rerender(<Container variant="dashboard">Dashboard Content</Container>);
    expect(screen.getByText('Dashboard Content')).toHaveClass('container--dashboard');

    rerender(<Container as="section" variant="narrow">Narrow Form</Container>);
    const section = screen.getByText('Narrow Form');
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveClass('container--narrow');
  });

  it('renders PageHeader with public and dashboard variants', () => {
    const { rerender } = render(
      <PageHeader
        title="Artisanal Florists"
        eyebrow="Marketplace"
        description="Curated studios in Sri Lanka."
        variant="public"
      />
    );

    expect(screen.getByRole('heading', { name: 'Artisanal Florists', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toHaveClass('page-header__eyebrow');
    expect(screen.getByText('Curated studios in Sri Lanka.')).toBeInTheDocument();

    rerender(
      <PageHeader
        title="Product Inventory"
        variant="dashboard"
        actions={<button>Add Stem</button>}
      />
    );
    expect(screen.getByRole('banner')).toHaveClass('page-header--dashboard');
    expect(screen.getByRole('button', { name: 'Add Stem' })).toBeInTheDocument();
  });

  it('renders PublicShell with landmark regions, skip link and mobile drawer', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PublicShell
          announcement={<span>Free studio pickups</span>}
          navigation={<a href="/shops">Browse</a>}
        >
          <h1>Public Storefront</h1>
        </PublicShell>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content');
    expect(screen.getByText('Free studio pickups')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    // Mobile menu toggle
    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(toggle);
    expect(screen.getByRole('dialog', { name: 'Site navigation' })).toBeInTheDocument();

    // Escape closes mobile drawer and restores focus to toggle button
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Site navigation' })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('renders DashboardShell with operational sidebar, topbar and sans typography', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DashboardShell
          role="supplier"
          workspaceTitle="Meadow Studio"
          workspaceSubtitle="Active Vendor"
          sidebarNav={<a href="/supplier/products">Catalog</a>}
          topbarActions={<button>Logout</button>}
        >
          <h2>Workspace Content</h2>
        </DashboardShell>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Skip to workspace content' })).toHaveAttribute('href', '#portal-content');
    expect(screen.getByRole('complementary', { name: 'Supplier navigation' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveClass('dashboard-shell__topbar');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'portal-content');
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();

    const mobileToggle = screen.getByRole('button', { name: 'Open workspace navigation' });
    await user.click(mobileToggle);
    const closeBtn = screen.getByRole('button', { name: 'Close navigation sidebar' });
    expect(closeBtn).toBeInTheDocument();

    // Escape closes sidebar and restores focus to mobile toggle button
    await user.keyboard('{Escape}');
    expect(mobileToggle).toHaveFocus();
  });

  it('renders Breadcrumbs with public and dashboard variants', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Breadcrumbs
          variant="public"
          items={[{ label: 'Home', to: '/' }]}
          current="Florists"
        />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveClass('breadcrumbs-nav--public');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByText('Florists')).toHaveAttribute('aria-current', 'page');

    rerender(
      <MemoryRouter>
        <Breadcrumbs
          variant="dashboard"
          items={[{ label: 'Portal', to: '/supplier' }]}
          current="Stems"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveClass('breadcrumbs-nav--dashboard');
  });
});
