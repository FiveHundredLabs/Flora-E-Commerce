import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { BottomNav } from './BottomNav';

describe('BottomNav', () => {
  it('renders all mobile primary navigation destinations', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav cartCount={0} wishlistCount={0} />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^products$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /florist shops/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /wishlist with 0 items/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /shopping cart with 0 items/i })).toBeInTheDocument();
  });

  it('displays accurate count badges when wishlist and cart have items', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav cartCount={5} wishlistCount={3} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /wishlist with 3 items/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /shopping cart with 5 items/i })).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('triggers onCartToggle when the cart navigation item is clicked', async () => {
    const handleCartToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNav cartCount={2} wishlistCount={0} onCartToggle={handleCartToggle} />
      </MemoryRouter>
    );

    const cartLink = screen.getByRole('link', { name: /shopping cart with 2 items/i });
    await user.click(cartLink);

    expect(handleCartToggle).toHaveBeenCalledTimes(1);
  });
});
