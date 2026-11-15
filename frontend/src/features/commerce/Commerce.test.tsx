import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';
import { cartActions, createCartStore } from './cart';
import { CartScreen } from './CartScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { OrderScreen, OrdersScreen } from './OrdersScreen';
import { createMockCommerceAdapter, type CommerceAdapter } from './api/mock';
import type { CommerceCatalog, SampleOrder } from './model';

const catalog: CommerceCatalog = { stores: [{ slug: 'alpha', name: 'Alpha Shop' }, { slug: 'beta', name: 'Beta Shop' }],
  products: [{ slug: 'a', storeSlug: 'alpha', name: 'Sample Alpha' }, { slug: 'b', storeSlug: 'beta', name: 'Sample Beta' }] };
const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });
function mount(entry: string, adapter = createMockCommerceAdapter([]), store = createCartStore()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } }); clients.push(client);
  const view = render(<Provider store={store}><QueryClientProvider client={client}><MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/cart" element={<CartScreen catalog={catalog} />} />
    <Route path="/checkout" element={<CheckoutScreen catalog={catalog} adapter={adapter} />} />
    <Route path="/account/orders" element={<OrdersScreen catalog={catalog} adapter={adapter} />} />
    <Route path="/account/orders/:orderId" element={<OrderScreen catalog={catalog} adapter={adapter} />} />
  </Routes></MemoryRouter></QueryClientProvider></Provider>);
  return { ...view, store };
}
function filledCart() { const store = createCartStore(); store.dispatch(cartActions.add({ productSlug: 'a', storeSlug: 'alpha' })); store.dispatch(cartActions.add({ productSlug: 'b', storeSlug: 'beta' })); return store; }

it('renders empty cart and independently grouped stores with validated quantities', async () => {
  const store = createCartStore(); mount('/cart', undefined, store);
  expect(screen.getByText('Your sample cart is empty.')).toBeVisible();
  act(() => { store.dispatch(cartActions.add({ productSlug: 'a', storeSlug: 'alpha' })); store.dispatch(cartActions.add({ productSlug: 'b', storeSlug: 'beta' })); });
  expect(screen.getByRole('region', { name: 'Alpha Shop' })).toBeVisible();
  expect(screen.getByRole('region', { name: 'Beta Shop' })).toBeVisible();
  const user = userEvent.setup(); const input = screen.getByRole('spinbutton', { name: 'Quantity for Sample Alpha' });
  await user.clear(input); await user.type(input, '0'); await user.click(screen.getByRole('button', { name: 'Update quantity for Sample Alpha' }));
  expect(input).toHaveFocus(); expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(store.getState().cart.lines[0]?.quantity).toBe(1);
  await user.click(screen.getByRole('button', { name: 'Remove Sample Alpha' }));
  expect(screen.getByRole('heading', { name: 'Sample cart' })).toHaveFocus();
  expect(screen.getByRole('region', { name: 'Beta Shop' })).toBeVisible();
});

it('checks out only one store, validates delivery intent and never treats query parameters as payment proof', async () => {
  const store = filledCart(); const service = createMockCommerceAdapter([]); mount('/checkout?store=alpha', service, store);
  const checkout = screen.getByRole('region', { name: 'Selected shop checkout' });
  expect(within(checkout).queryByText('Sample Beta')).not.toBeInTheDocument();
  const user = userEvent.setup(); await user.click(screen.getByRole('radio', { name: 'Delivery' }));
  await user.click(screen.getByRole('button', { name: 'Create sample order' }));
  expect(screen.getByRole('combobox')).toHaveFocus();
  await user.selectOptions(screen.getByRole('combobox'), 'pickme');
  expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
  await user.click(screen.getByRole('button', { name: 'Create sample order' }));
  expect(await screen.findByText('PayHere is not connected. No payment has been requested.')).toBeVisible();
  expect(store.getState().cart.lines.map((line) => line.storeSlug)).toEqual(['beta']);
  expect(await service.orders()).toHaveLength(1);
});

it('does not retry a failed write automatically and preserves every cart group', async () => {
  const store = filledCart(); const service = createMockCommerceAdapter([]);
  const place = vi.fn<CommerceAdapter['place']>().mockRejectedValueOnce(new Error('private provider detail')).mockImplementationOnce(service.place);
  mount('/checkout?store=alpha', { ...service, place }, store);
  const user = userEvent.setup(); await user.click(screen.getByRole('button', { name: 'Create sample order' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Your cart has been kept');
  expect(place).toHaveBeenCalledTimes(1); expect(store.getState().cart.lines).toHaveLength(2);
  expect(screen.queryByText('private provider detail')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Create sample order' }));
  await screen.findByRole('heading', { name: 'Sample order', level: 1 });
  expect(place).toHaveBeenCalledTimes(2);
});

it('keeps edits made while a write is pending and prevents a double submission', async () => {
  const store = filledCart(); const service = createMockCommerceAdapter([]);
  let finish: (() => void) | undefined;
  const place = vi.fn<CommerceAdapter['place']>().mockImplementation((input) => new Promise((resolve) => { finish = () => { void service.place(input).then(resolve); }; }));
  mount('/checkout?store=alpha', { ...service, place }, store);
  const user = userEvent.setup(); await user.dblClick(screen.getByRole('button', { name: 'Create sample order' }));
  expect(screen.getByRole('button', { name: 'Create sample order' })).toBeDisabled(); expect(place).toHaveBeenCalledOnce();
  act(() => { store.dispatch(cartActions.add({ productSlug: 'a', storeSlug: 'alpha' })); });
  await act(async () => { finish?.(); });
  await screen.findByRole('heading', { name: 'Sample order', level: 1 });
  expect(store.getState().cart.lines.map((line) => [line.storeSlug, line.quantity])).toEqual([['alpha', 2], ['beta', 1]]);
});

it('does not consume cart items for a mismatched acknowledgement', async () => {
  const store = filledCart(); const service = createMockCommerceAdapter([]);
  const place: CommerceAdapter['place'] = async () => ({ id: 'wrong', storeSlug: 'beta', items: [store.getState().cart.lines[1]], preference: { method: 'pickup' }, paymentStatus: null, delivered: false, canReview: false, review: null });
  mount('/checkout?store=alpha', { ...service, place }, store);
  await userEvent.setup().click(screen.getByRole('button', { name: 'Create sample order' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Your cart has been kept');
  expect(store.getState().cart.lines).toHaveLength(2);
});

it.each(['/checkout', '/checkout?store=unknown', '/checkout?store=alpha&store=beta'])('recovers an invalid or empty checkout: %s', (entry) => {
  mount(entry); expect(screen.getByRole('link', { name: 'Return to sample cart' })).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Create sample order' })).not.toBeInTheDocument();
});

it('shows order loading/error/empty states and safe missing-record recovery', async () => {
  const service = createMockCommerceAdapter([]); const orders = vi.fn<CommerceAdapter['orders']>().mockRejectedValueOnce(new Error('private read detail')).mockResolvedValueOnce([]);
  mount('/account/orders', { ...service, orders });
  expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load');
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByText('There are no sample orders in this session.')).toBeVisible();
});

it('gates feedback using the sample service capability and validates/saves sample text', async () => {
  const order: SampleOrder = { id: 'delivered', storeSlug: 'alpha', items: [{ productSlug: 'a', storeSlug: 'alpha', quantity: 1, revision: 1 }], preference: { method: 'pickup' }, paymentStatus: 'successful', delivered: true, canReview: true, review: null };
  mount('/account/orders/delivered?status=failed', createMockCommerceAdapter([order]));
  const input = await screen.findByRole('textbox', { name: 'Sample feedback' }); const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Save sample feedback' }));
  expect(input).toHaveFocus(); expect(input).toHaveAttribute('aria-invalid', 'true');
  await user.type(input, 'A fictional review for the sample.'); await user.click(screen.getByRole('button', { name: 'Save sample feedback' }));
  expect(await screen.findByText('Sample feedback saved for this session only.')).toBeVisible();
  expect(screen.getByText(/successful \(sample example only\)/)).toBeVisible();
});
