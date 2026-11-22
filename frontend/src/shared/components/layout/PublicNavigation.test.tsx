import { useState } from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router';
import { Shell, type ShellProps } from './Shell';
import { CartProvider, cartActions, useCartDispatch } from '../../../features/commerce';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouteAccessibility } from '../../../app/RouteAccessibility';

function LocationWatcher() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}{location.search}</div>;
}

function CartFixture({ initialItem = false }: { initialItem?: boolean }) {
  const dispatch = useCartDispatch();
  const [added, setAdded] = useState(false);
  return (
    <div>
      <LocationWatcher />
      <h1>Public Storefront</h1>
      <button
        type="button"
        onClick={() => {
          dispatch(cartActions.add({ productSlug: 'monstera-deliciosa', storeSlug: 'botanical-house' }));
          setAdded(true);
        }}
      >
        Add Monstera Plant
      </button>
      {initialItem && !added && (
        <button
          type="button"
          onClick={() => {
            dispatch(cartActions.add({ productSlug: 'morning-bouquet', storeSlug: 'willow-stem' }));
          }}
        >
          Add Initial Item
        </button>
      )}
    </div>
  );
}

function renderPublicShell(
  initialEntries: string[] = ['/'],
  shellProps?: Partial<ShellProps>
) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return {
    client,
    ...render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={initialEntries}>
          <CartProvider>
            <RouteAccessibility />
            <Shell audience="customer" {...shellProps}>
              <CartFixture />
            </Shell>
          </CartProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  };
}

describe('Public Navigation & Storefront Shell (Phase 02)', () => {
  it('renders announcement strip with verified marketplace message and honest utility links', () => {
    const { container } = renderPublicShell();

    expect(
      screen.getByText(/Artisanal Botanical Studio & Marketplace · Curated Independent Florists across Sri Lanka/i)
    ).toBeInTheDocument();

    const utilityBar = container.querySelector('.top-utility-bar') as HTMLElement;
    expect(utilityBar).toBeInTheDocument();

    const trackLink = within(utilityBar).getByRole('link', { name: 'Track Orders' });
    expect(trackLink).toHaveAttribute('href', '/account/orders');

    const supplierLink = within(utilityBar).getByRole('link', { name: 'Supplier Portal' });
    expect(supplierLink).toHaveAttribute('href', '/supplier');

    const adminLink = within(utilityBar).getByRole('link', { name: 'Admin Access' });
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  it('renders brand identity linking to home with text fallback and configured logo fallback', () => {
    // 1. Default text brand identity
    const { unmount } = renderPublicShell();
    const logoLink = screen.getByRole('link', { name: 'Flower & Flora home' });
    expect(logoLink).toHaveAttribute('href', '/');
    expect(within(logoLink).getByText('Flower & Flora')).toBeInTheDocument();
    unmount();

    // 2. Configured logo with image fallback upon error
    renderPublicShell(['/'], { logoSrc: '/assets/logo.png', brandName: 'Bespoke Flora' });
    const configuredLink = screen.getByRole('link', { name: 'Bespoke Flora home' });
    const img = within(configuredLink).getByRole('img', { name: 'Bespoke Flora' });
    expect(img).toHaveAttribute('src', '/assets/logo.png');

    // Image load failure triggers graceful text fallback
    fireEvent.error(img);
    expect(screen.queryByRole('img', { name: 'Bespoke Flora' })).not.toBeInTheDocument();
    expect(within(configuredLink).getByText('Bespoke Flora')).toBeInTheDocument();
  });

  it('handles search input, clear button appearance, Escape clearing, and submission to actual search route with length clamping', async () => {
    const user = userEvent.setup();
    renderPublicShell();

    const searchInput = screen.getByRole('searchbox', { name: 'Search catalog' });
    expect(searchInput).toHaveValue('');
    expect(searchInput).toHaveAttribute('maxlength', '100');

    // Clear button should not be present initially
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    // Type query
    await user.type(searchInput, 'orchids');
    expect(searchInput).toHaveValue('orchids');

    // Clear button should appear
    const clearBtn = screen.getByRole('button', { name: 'Clear search' });
    expect(clearBtn).toBeInTheDocument();

    // Escape clears search
    await user.keyboard('{Escape}');
    expect(searchInput).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    // Re-type and submit
    await user.type(searchInput, '  wild lilies  ');
    await user.click(screen.getByRole('button', { name: 'Submit search' }));

    // Verifies navigation to actual products search route with trimmed query
    expect(screen.getByTestId('location-display')).toHaveTextContent('/products?q=wild%20lilies');

    // Query longer than 100 characters is safely clamped to 100
    await user.clear(searchInput);
    const longQuery = 'a'.repeat(110);
    // Directly fire change to bypass typing speed
    fireEvent.change(searchInput, { target: { value: longQuery } });
    await user.click(screen.getByRole('button', { name: 'Submit search' }));
    expect(screen.getByTestId('location-display')).toHaveTextContent(`/products?q=${'a'.repeat(100)}`);
  });

  it('does not submit search when query is empty or whitespace only', async () => {
    const user = userEvent.setup();
    renderPublicShell();

    const searchInput = screen.getByRole('searchbox', { name: 'Search catalog' });
    await user.type(searchInput, '   ');
    await user.click(screen.getByRole('button', { name: 'Submit search' }));

    // Still on home page
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');
  });

  it('submits search via mobile drawer search form', async () => {
    const user = userEvent.setup();
    renderPublicShell();

    // Open mobile drawer
    const menuBtn = screen.getByRole('button', { name: 'Menu' });
    await user.click(menuBtn);

    const mobileSearchInput = screen.getByRole('searchbox', { name: 'Search catalog on mobile' });
    expect(mobileSearchInput).toBeInTheDocument();

    await user.type(mobileSearchInput, 'ferns');
    await user.click(screen.getByRole('button', { name: 'Submit mobile search' }));

    expect(screen.getByTestId('location-display')).toHaveTextContent('/products?q=ferns');
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders all primary desktop navigation links and store categories', () => {
    renderPublicShell();

    const nav = screen.getByRole('navigation', { name: 'Marketplace navigation' });

    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
    expect(within(nav).getByRole('link', { name: 'Shops' })).toHaveAttribute('href', '/shops');
    expect(within(nav).getByRole('link', { name: 'Bouquets' })).toHaveAttribute('href', '/products?category=bouquets');
    expect(within(nav).getByRole('link', { name: 'Plants' })).toHaveAttribute('href', '/products?category=plants');
    expect(within(nav).getByRole('link', { name: 'Stems' })).toHaveAttribute('href', '/products?category=stems');
    expect(within(nav).getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
    expect(within(nav).getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about');
    expect(within(nav).getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact');
    expect(within(nav).getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/account/orders');
  });

  it('renders account dropdown menu and varies options properly by role and authorization', async () => {
    const user = userEvent.setup();

    // 1. Guest customer (unauthenticated)
    const { unmount } = renderPublicShell();
    const accountToggle = screen.getByRole('button', { name: /Account menu for Guest Customer/i });
    expect(accountToggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(accountToggle);
    expect(accountToggle).toHaveAttribute('aria-expanded', 'true');

    const menu = screen.getByRole('menu', { name: 'Account menu options' });
    expect(menu).toBeInTheDocument();
    expect(within(menu).getByText('Guest Customer')).toBeInTheDocument();
    expect(within(menu).getByText('Guest')).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: /Track Orders/i })).toHaveAttribute('href', '/account/orders');
    expect(within(menu).getByRole('menuitem', { name: /Saved Arrangements/i })).toHaveAttribute('href', '/wishlist');
    expect(within(menu).getByRole('menuitem', { name: /Shopping Cart/i })).toHaveAttribute('href', '/cart');

    // Escape closes account menu and restores focus to toggle button
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu', { name: 'Account menu options' })).not.toBeInTheDocument();
    expect(accountToggle).toHaveFocus();
    unmount();

    // 2. Authenticated Florist Supplier role
    const { unmount: unmountSupplier } = renderPublicShell(['/'], {
      currentUser: { name: 'Nayana Bloom', role: 'supplier', isAuthenticated: true, email: 'nayana@flora.lk' },
    });
    const supplierToggle = screen.getByRole('button', { name: /Account menu for Nayana Bloom/i });
    await user.click(supplierToggle);

    const supplierMenu = screen.getByRole('menu', { name: 'Account menu options' });
    expect(within(supplierMenu).getByText('Nayana Bloom')).toBeInTheDocument();
    expect(within(supplierMenu).getByText('nayana@flora.lk')).toBeInTheDocument();
    expect(within(supplierMenu).getByText('Florist')).toBeInTheDocument();
    expect(within(supplierMenu).getByRole('menuitem', { name: /Supplier Dashboard/i })).toHaveAttribute('href', '/supplier');
    expect(within(supplierMenu).getByRole('menuitem', { name: /Product Catalog/i })).toHaveAttribute('href', '/supplier/products');
    expect(within(supplierMenu).getByRole('menuitem', { name: /Store Orders/i })).toHaveAttribute('href', '/supplier/orders');
    expect(within(supplierMenu).getByRole('menuitem', { name: /Store Profile/i })).toHaveAttribute('href', '/supplier/profile');
    unmountSupplier();

    // 3. Authenticated Super Admin role
    renderPublicShell(['/'], {
      currentUser: { name: 'Platform Admin', role: 'admin', isAuthenticated: true },
    });
    const adminToggle = screen.getByRole('button', { name: /Account menu for Platform Admin/i });
    await user.click(adminToggle);

    const adminMenu = screen.getByRole('menu', { name: 'Account menu options' });
    expect(within(adminMenu).getByText('Platform Admin')).toBeInTheDocument();
    expect(within(adminMenu).getByText('Admin')).toBeInTheDocument();
    expect(within(adminMenu).getByRole('menuitem', { name: /Admin Overview/i })).toHaveAttribute('href', '/admin');
    expect(within(adminMenu).getByRole('menuitem', { name: /Supplier Approvals/i })).toHaveAttribute('href', '/admin/suppliers');
    expect(within(adminMenu).getByRole('menuitem', { name: /Orders Oversight/i })).toHaveAttribute('href', '/admin/orders');
    expect(within(adminMenu).getByRole('menuitem', { name: /Categories/i })).toHaveAttribute('href', '/admin/categories');
  });

  it('syncs cart counter and opens drawer with store grouping on toggle', async () => {
    const user = userEvent.setup();
    renderPublicShell();

    // Initial cart count is 0
    const cartToggle = screen.getByRole('button', { name: 'Shopping cart with 0 items' });
    expect(cartToggle).toBeInTheDocument();
    expect(cartToggle).toHaveAttribute('aria-expanded', 'false');

    // Add item to cart
    await user.click(screen.getByRole('button', { name: 'Add Monstera Plant' }));

    // Count updates to 1
    const updatedToggle = screen.getByRole('button', { name: 'Shopping cart with 1 items' });
    expect(updatedToggle).toBeInTheDocument();

    // Open cart drawer
    await user.click(updatedToggle);
    expect(updatedToggle).toHaveAttribute('aria-expanded', 'true');

    // Drawer is visible with header
    const drawer = screen.getByRole('complementary', { name: 'Shopping Cart Drawer' });
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByRole('heading', { name: 'Your Floral Cart (1)', level: 2 })).toBeVisible();

    // Editorial fulfillment note is present (no fake $60 free delivery progress bar)
    expect(within(drawer).getByText(/Bouquets and arrangements are handcrafted and dispatched directly/i)).toBeInTheDocument();

    // Grouped by store
    expect(within(drawer).getByText('Botanical House')).toBeInTheDocument();
    expect(within(drawer).getByText('Monstera Deliciosa')).toBeInTheDocument();

    // Per-store checkout link
    const checkoutLink = within(drawer).getByRole('link', { name: /Checkout with this Store/i });
    expect(checkoutLink).toHaveAttribute('href', '/checkout?store=botanical-house');

    // Quantity controls
    const increaseBtn = within(drawer).getByRole('button', { name: 'Increase quantity of monstera-deliciosa' });
    await user.click(increaseBtn);
    expect(within(drawer).getByRole('heading', { name: 'Your Floral Cart (2)', level: 2 })).toBeVisible();

    // Close drawer via Escape
    await user.keyboard('{Escape}');
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  it('mobile menu drawer opens via Menu button, has close button, closes via Escape and restores trigger focus', async () => {
    const user = userEvent.setup();
    renderPublicShell();

    const menuBtn = screen.getByRole('button', { name: 'Menu' });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    // Click Menu button to open
    await user.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    const nav = screen.getByRole('navigation', { name: 'Marketplace navigation' });
    expect(nav).toHaveClass('is-open');

    // Close button exists inside mobile drawer header
    const closeBtn = within(nav).getByRole('button', { name: 'Close navigation menu' });
    expect(closeBtn).toBeInTheDocument();

    // Escape closes drawer and restores focus to Menu toggle button
    await user.keyboard('{Escape}');
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    expect(menuBtn).toHaveFocus();

    // Open again and click close button
    await user.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    await user.click(closeBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    expect(menuBtn).toHaveFocus();
  });

  it('clicking a navigation link inside mobile drawer closes drawer and focuses main content', async () => {
    const user = userEvent.setup();
    renderPublicShell();

    const menuBtn = screen.getByRole('button', { name: 'Menu' });
    await user.click(menuBtn);

    const nav = screen.getByRole('navigation', { name: 'Marketplace navigation' });
    const shopsLink = within(nav).getByRole('link', { name: 'Shops' });

    await user.click(shopsLink);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getByTestId('location-display')).toHaveTextContent('/shops');
  });

  it('renders 4-column botanical editorial footer with verified standards and no fake signups', () => {
    renderPublicShell();

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    // Brand and philosophy
    expect(within(footer).getByText(/Connecting discerning flower lovers with dedicated local florists across Sri Lanka/i)).toBeInTheDocument();
    expect(within(footer).getByText('Locally Sourced')).toBeInTheDocument();
    expect(within(footer).getByText('Artisanal Studios')).toBeInTheDocument();
    expect(within(footer).getByText('Fresh Daily')).toBeInTheDocument();

    // Marketplace collections
    expect(within(footer).getByRole('link', { name: 'Shop Flowers' })).toHaveAttribute('href', '/products');
    expect(within(footer).getByRole('link', { name: 'Artisan Florists' })).toHaveAttribute('href', '/shops');
    expect(within(footer).getByRole('link', { name: 'Bouquets Collection' })).toHaveAttribute('href', '/products?category=bouquets');
    expect(within(footer).getByRole('link', { name: 'Plants & Greenery' })).toHaveAttribute('href', '/products?category=plants');
    expect(within(footer).getByRole('link', { name: 'Fresh Cut Stems' })).toHaveAttribute('href', '/products?category=stems');

    // Care & Portals
    expect(within(footer).getByRole('link', { name: 'Our Story' })).toHaveAttribute('href', '/about');
    expect(within(footer).getByRole('link', { name: 'Supplier Workspace' })).toHaveAttribute('href', '/supplier');
    expect(within(footer).getByRole('link', { name: 'Admin Oversight' })).toHaveAttribute('href', '/admin');

    // Marketplace Standards badges
    expect(within(footer).getByText('Studio Pickup & Dispatch')).toBeInTheDocument();
    expect(within(footer).getByText('Local Courier Delivery')).toBeInTheDocument();
    expect(within(footer).getByText('PayHere Verified Flow')).toBeInTheDocument();
    expect(within(footer).getByText('Single-Store Checkout')).toBeInTheDocument();

    // Verified: No dead newsletter form or fake social links
    expect(screen.queryByPlaceholderText(/Enter your email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Join/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Instagram' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Facebook' })).not.toBeInTheDocument();

    // Copyright
    expect(within(footer).getByText(new RegExp(`© ${new Date().getFullYear()} Flower & Flora`, 'i'))).toBeInTheDocument();
  });

  it('renders skip to content link targeting #main and proper landmark structure with SEO fundamentals', () => {
    renderPublicShell();

    const skipLink = screen.getByRole('link', { name: 'Skip to content' });
    expect(skipLink).toHaveAttribute('href', '#main');

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Marketplace navigation' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    // SEO Fundamentals
    expect(document.title).toBe('Public Storefront | Flower & Flora');
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).toBeInTheDocument();
    expect(metaDesc?.getAttribute('content')).toContain('Artisanal botanical studio');

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toBeInTheDocument();
    expect(canonicalLink?.getAttribute('href')).toContain('/');
  });
});
