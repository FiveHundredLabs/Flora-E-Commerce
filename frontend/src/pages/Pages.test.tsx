import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, beforeEach } from 'vitest';
import { WishlistPage } from './WishlistPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';
import { CartProvider, cartActions, useCartDispatch, closeCartDrawer, AddSampleProduct } from '../features/commerce';
import { Shell } from '../shared/components/layout/Shell';
import { ProductCard } from '../features/discovery/ProductCard';

describe('New Brand & Discovery Pages', () => {
  beforeEach(() => {
    localStorage.clear();
    closeCartDrawer();
  });

  describe('WishlistPage', () => {
    it('renders empty state when there are no saved botanicals', () => {
      render(
        <MemoryRouter>
          <CartProvider>
            <WishlistPage />
          </CartProvider>
        </MemoryRouter>
      );
      expect(screen.getByRole('heading', { name: 'Saved flowers' })).toBeVisible();
      expect(screen.getByText('Nothing saved yet')).toBeVisible();
      expect(screen.getByRole('link', { name: 'Explore products' })).toHaveAttribute('href', '/products');
    });

    it('renders saved items from local storage, removes an item, and adds to cart', async () => {
      const user = userEvent.setup();
      localStorage.setItem('flora_wishlist', JSON.stringify([
        {
          productSlug: 'morning-bouquet',
          storeSlug: 'willow-stem',
          name: 'Morning Bouquet',
          category: 'bouquets',
        },
      ]));

      render(
        <MemoryRouter>
          <CartProvider>
            <WishlistPage />
          </CartProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('1 item saved in this browser.')).toBeVisible();
      expect(screen.getByRole('link', { name: 'Morning Bouquet' })).toBeVisible();
      expect(screen.getByText('Price, stock and product options are not connected.')).toBeVisible();

      // Add to cart
      await user.click(screen.getByRole('button', { name: 'Add to sample cart' }));

      // Remove from wishlist
      await user.click(screen.getByRole('button', { name: 'Remove Morning Bouquet from wishlist' }));
      expect(screen.getByText('Nothing saved yet')).toBeVisible();
    });

    it('recovers gracefully when localStorage contains corrupted or non-array JSON', () => {
      localStorage.setItem('flora_wishlist', '{"not":"an array"}');
      render(
        <MemoryRouter>
          <CartProvider>
            <WishlistPage />
          </CartProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Nothing saved yet')).toBeVisible();
    });
  });

  describe('AboutPage', () => {
    it('renders the botanical story, core values and video banner with accessible modal', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      );
      expect(screen.getByRole('heading', { name: 'Connecting Local Florists with Flower Lovers' })).toBeVisible();
      expect(screen.getByText('Artisanal Craftsmanship')).toBeVisible();
      expect(screen.getByText('Eco-Mindful Sourcing')).toBeVisible();
      expect(screen.getByText('Grower Empowerment')).toBeVisible();
      expect(document.title).toBe('About Us | Flower & Flora');

      // Click video play button to open preview modal
      const playBtn = screen.getByRole('button', { name: /documentary/i });
      await user.click(playBtn);
      expect(screen.getByRole('dialog', { name: /Documentary/i })).toBeVisible();
      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('dismisses the video preview modal on Escape key press', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      );
      await user.click(screen.getByRole('button', { name: /documentary/i }));
      expect(screen.getByRole('dialog', { name: /Documentary/i })).toBeVisible();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('ContactPage', () => {
    it('validates required fields, shows error feedback, and then submits successfully', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      );

      // Attempt to submit empty form
      await user.click(screen.getByRole('button', { name: /Send Message/i }));
      expect(screen.getByText('Please provide your full name.')).toBeVisible();
      expect(screen.getByText('Please provide your email address.')).toBeVisible();
      expect(screen.getByText('Please tell us how we can help you.')).toBeVisible();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      // Enter invalid email
      await user.type(screen.getByLabelText(/Your Full Name/i), 'Ruwan Silva');
      await user.type(screen.getByLabelText(/Email Address/i), 'invalid-email');
      await user.type(screen.getByLabelText(/How can we help you/i), 'Inquiry about blooms.');
      await user.click(screen.getByRole('button', { name: /Send Message/i }));
      expect(screen.getByText('Please enter a valid email address.')).toBeVisible();

      // Correct email and submit
      await user.clear(screen.getByLabelText(/Email Address/i));
      await user.type(screen.getByLabelText(/Email Address/i), 'ruwan@example.com');
      await user.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(screen.getByRole('status')).toHaveTextContent('Thank You, Ruwan Silva!');
      expect(screen.getByText(/Your message has been safely received/)).toBeVisible();
    });

    it('renders contact channels and submits an inquiry message', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: 'We Would Love to Hear From You' })).toBeVisible();
      expect(screen.getByText('Customer Care')).toBeVisible();
      expect(screen.getByText('Studio Pavilions')).toBeVisible();
      expect(screen.getByText('Florist Partnerships')).toBeVisible();

      // Fill in and submit form
      await user.type(screen.getByLabelText(/Your Full Name/i), 'Ruwan Silva');
      await user.type(screen.getByLabelText(/Email Address/i), 'ruwan@example.com');
      await user.type(screen.getByLabelText(/How can we help you/i), 'Interested in custom wedding florals.');
      await user.click(screen.getByRole('button', { name: /Send Message/i }));

      expect(screen.getByRole('status')).toHaveTextContent('Thank You, Ruwan Silva!');
      expect(screen.getByText(/Your message has been safely received/)).toBeVisible();
    });
  });

  describe('ProductCard & QuickViewModal', () => {
    it('opens Quick View modal with variant selectors and stepper without dialog errors', async () => {
      const user = userEvent.setup();
      const sampleProduct = {
        slug: 'morning-bouquet',
        storeSlug: 'willow-stem',
        name: 'Morning Bouquet',
        category: 'bouquets' as const,
        description: 'Open blooms and fresh eucalyptus.',
      };

      render(
        <MemoryRouter>
          <CartProvider>
            <ProductCard product={sampleProduct} storeName="Willow & Stem" />
          </CartProvider>
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { level: 3, name: 'Morning Bouquet' })).toBeVisible();

      // Open Quick View
      const quickViewBtn = screen.getByRole('button', { name: 'Quick view Morning Bouquet' });
      await user.click(quickViewBtn);

      expect(screen.getByRole('heading', { level: 2, name: 'Morning Bouquet' })).toBeVisible();
      expect(screen.getByRole('radio', { name: 'Standard' })).toBeVisible();
      expect(screen.getByRole('radio', { name: 'Deluxe' })).toBeVisible();

      // Close modal
      await user.click(screen.getByRole('button', { name: 'Close quick view' }));
      expect(screen.queryByRole('heading', { level: 2, name: 'Morning Bouquet' })).not.toBeInTheDocument();
    });

    it('switches between primary and secondary thumbnails in Quick View modal', async () => {
      const user = userEvent.setup();
      const sampleProduct = {
        slug: 'morning-bouquet',
        storeSlug: 'willow-stem',
        name: 'Morning Bouquet',
        category: 'bouquets' as const,
        description: 'Open blooms and fresh eucalyptus.',
      };

      render(
        <MemoryRouter>
          <CartProvider>
            <ProductCard product={sampleProduct} storeName="Willow & Stem" />
          </CartProvider>
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: 'Quick view Morning Bouquet' }));
      expect(screen.getByRole('button', { name: 'Thumbnail 1' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Thumbnail 2' })).toBeVisible();

      // Click thumbnail 2
      await user.click(screen.getByRole('button', { name: 'Thumbnail 2' }));
      expect(screen.getByRole('button', { name: 'Thumbnail 2' })).toHaveClass('is-active');

      // Click thumbnail 1
      await user.click(screen.getByRole('button', { name: 'Thumbnail 1' }));
      expect(screen.getByRole('button', { name: 'Thumbnail 1' })).toHaveClass('is-active');
    });
  });

  describe('AddSampleProduct (PDP Buy Controls)', () => {
    it('renders Add to Cart and BUY IT NOW buttons, supports quantity and updates cart', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <CartProvider>
            <AddSampleProduct
              productSlug="morning-bouquet"
              storeSlug="willow-stem"
              name="Morning Bouquet"
              quantityToAdd={3}
            />
          </CartProvider>
        </MemoryRouter>
      );

      const addBtn = screen.getByRole('button', { name: 'Add to sample cart' });
      const directCheckoutBtn = screen.getByRole('button', { name: 'Direct shop checkout' });
      expect(addBtn).toBeVisible();
      expect(directCheckoutBtn).toBeVisible();

      await user.click(addBtn);
      expect(screen.getByRole('status')).toHaveTextContent('Added 3 × Morning Bouquet to your sample cart.');
    });
  });

  describe('Shell Cart Integration', () => {
    function AddButtonFixture() {
      const dispatch = useCartDispatch();
      return (
        <button
          type="button"
          onClick={() => dispatch(cartActions.add({ productSlug: 'morning-bouquet', storeSlug: 'willow-stem' }))}
        >
          Add Morning Bouquet
        </button>
      );
    }

    it('subscribes to cart state changes, updates cart badge and displays items in drawer', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <CartProvider>
            <Shell audience="customer">
              <AddButtonFixture />
            </Shell>
          </CartProvider>
        </MemoryRouter>
      );

      // Initially cart badge is 0
      const cartToggle = screen.getByRole('button', { name: /Shopping cart with 0 items/i });
      expect(cartToggle).toBeVisible();

      // Add item to cart
      await user.click(screen.getByRole('button', { name: 'Add Morning Bouquet' }));

      // Cart badge must update to 1 immediately
      expect(screen.getByRole('button', { name: /Shopping cart with 1 items/i })).toBeVisible();

      // Open cart drawer
      await user.click(screen.getByRole('button', { name: /Shopping cart with 1 items/i }));
      expect(screen.getByRole('heading', { name: /Your Floral Cart \(1\)/i })).toBeVisible();
      expect(screen.getByText('Morning Bouquet')).toBeVisible();
      expect(screen.getByRole('link', { name: /Checkout with this Store/i })).toHaveAttribute(
        'href',
        '/checkout?store=willow-stem'
      );
    });
  });
});
