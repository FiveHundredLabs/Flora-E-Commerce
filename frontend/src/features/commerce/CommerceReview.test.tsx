import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';
import { createCartStore, cartActions } from './cart';
import { CheckoutScreen } from './CheckoutScreen';
import { OrdersScreen, OrderScreen } from './OrdersScreen';
import { createMockCommerceAdapter, type CommerceAdapter } from './api/mock';
import { orderKey } from './query';
import type { CommerceCatalog, SampleOrder } from './model';

const catalog: CommerceCatalog = { stores: [{ slug: 'alpha', name: 'Alpha Shop' }, { slug: 'beta', name: 'Beta Shop' }],
  products: [{ slug: 'a', storeSlug: 'alpha', name: 'Sample Alpha' }, { slug: 'b', storeSlug: 'beta', name: 'Sample Beta' }] };
const delivered: SampleOrder = { id: 'delivered', storeSlug: 'alpha', items: [{ productSlug: 'a', storeSlug: 'alpha', quantity: 1, revision: 1 }],
  preference: { method: 'pickup' }, paymentStatus: 'successful', delivered: true, canReview: true, review: null };
const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });
function mount(entry: string, adapter: CommerceAdapter = createMockCommerceAdapter([delivered])) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } }); clients.push(client);
  const store = createCartStore();
  store.dispatch(cartActions.add({ productSlug: 'a', storeSlug: 'alpha' }));
  store.dispatch(cartActions.add({ productSlug: 'b', storeSlug: 'beta' }));
  const navigation: { go?: NavigateFunction } = {};
  function CaptureNavigation() { navigation.go = useNavigate(); return null; }
  const view = render(<Provider store={store}><QueryClientProvider client={client}><MemoryRouter initialEntries={[entry]}>
    <CaptureNavigation /><Routes>
      <Route path="/checkout" element={<CheckoutScreen catalog={catalog} adapter={adapter} />} />
      <Route path="/account/orders" element={<OrdersScreen catalog={catalog} adapter={adapter} />} />
      <Route path="/account/orders/:orderId" element={<OrderScreen catalog={catalog} adapter={adapter} />} />
    </Routes>
  </MemoryRouter></QueryClientProvider></Provider>);
  return { ...view, client, store, navigate: (to: string) => { void navigation.go?.(to); } };
}

function clearDisabledControlFocus() {
  // jsdom does not consistently blur disabled controls like native browsers do.
  const previous = document.body.getAttribute('tabindex');
  document.body.setAttribute('tabindex', '-1'); document.body.focus();
  if (previous === null) document.body.removeAttribute('tabindex');
  else document.body.setAttribute('tabindex', previous);
}

it('does not show saved confirmation for a newly edited feedback draft', async () => {
  mount('/account/orders/delivered');
  const user = userEvent.setup(); const input = await screen.findByRole('textbox', { name: 'Sample feedback' });
  await user.type(input, 'Original sample'); await user.click(screen.getByRole('button', { name: 'Save sample feedback' }));
  await screen.findByText('Sample feedback saved for this session only.');
  await user.type(input, ' changed');
  expect(screen.queryByText('Sample feedback saved for this session only.')).not.toBeInTheDocument();
});

it('rejects a feedback acknowledgement belonging to another sample order', async () => {
  const adapter = { ...createMockCommerceAdapter([delivered]), feedback: async () => ({ ...delivered, id: 'wrong-order', review: 'Sample' }) };
  mount('/account/orders/delivered', adapter);
  const user = userEvent.setup(); const input = await screen.findByRole('textbox', { name: 'Sample feedback' });
  await user.type(input, 'Sample'); await user.click(screen.getByRole('button', { name: 'Save sample feedback' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved');
  expect(input).toHaveValue('Sample');
});

it('detaches old checkout navigation on store change but still reconciles its late acknowledgement', async () => {
  const service = createMockCommerceAdapter([]);
  let finish: (() => void) | undefined;
  const place = vi.fn<CommerceAdapter['place']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.place(command).then(resolve); };
  }));
  const view = mount('/checkout?store=alpha', { ...service, place });
  const user = userEvent.setup();
  expect(screen.getByRole('button', { name: 'Delivery unavailable' })).toBeDisabled();
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Create sample order' }));
  act(() => view.navigate('/checkout?store=beta'));
  expect(screen.getByRole('heading', { name: /^Beta Shop$/ })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Pickup unavailable' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Delivery unavailable' })).toBeDisabled();
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Create sample order' })).toBeEnabled();
  await act(async () => { finish?.(); });
  await waitFor(() => expect(view.store.getState().cart.lines.map((line) => line.storeSlug)).toEqual(['beta']));
  await waitFor(() => expect(view.client.isMutating()).toBe(0));
  expect(screen.getByRole('heading', { name: /^Beta Shop$/ })).toBeVisible();
  expect(screen.queryByRole('heading', { name: 'Sample order', level: 1 })).not.toBeInTheDocument();
});

it('keeps feedback text on failed save, prevents duplicate writes and never auto-retries', async () => {
  const service = createMockCommerceAdapter([delivered]);
  let fail: ((reason: Error) => void) | undefined;
  const feedback = vi.fn<CommerceAdapter['feedback']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; }))
    .mockImplementationOnce(service.feedback);
  mount('/account/orders/delivered', { ...service, feedback });
  const user = userEvent.setup(); const input = await screen.findByRole('textbox', { name: 'Sample feedback' });
  await user.type(input, 'Fictional retained comment');
  const button = screen.getByRole('button', { name: 'Save sample feedback' });
  await user.dblClick(button);
  expect(input).toBeDisabled(); expect(button).toBeDisabled(); expect(feedback).toHaveBeenCalledOnce();
  clearDisabledControlFocus();
  await act(async () => { fail?.(new Error('private write details')); });
  expect(await screen.findByRole('alert')).toHaveTextContent('Your text has been kept');
  expect(input).toHaveValue('Fictional retained comment'); expect(input).toHaveFocus();
  expect(feedback).toHaveBeenCalledOnce(); expect(screen.queryByText('private write details')).not.toBeInTheDocument();
  await user.click(button);
  expect(await screen.findByText('Sample feedback saved for this session only.')).toBeVisible();
  expect(feedback).toHaveBeenCalledTimes(2);
});

it('restores a failed checkout action without removing either cart group', async () => {
  let reject: ((reason: Error) => void) | undefined;
  const service = createMockCommerceAdapter([]);
  const place = vi.fn<CommerceAdapter['place']>().mockImplementation(() => new Promise((_, fail) => { reject = fail; }));
  const { store } = mount('/checkout?store=alpha', { ...service, place });
  const button = screen.getByRole('button', { name: 'Create sample order' });
  await userEvent.setup().click(button); clearDisabledControlFocus();
  await act(async () => { reject?.(new Error('private failure')); });
  await screen.findByRole('alert'); expect(button).toHaveFocus();
  expect(store.getState().cart.lines.map((line) => line.storeSlug)).toEqual(['alpha', 'beta']);
  expect(place).toHaveBeenCalledOnce();
});

it.each(['/account/orders', '/account/orders/delivered'])('distinguishes pending, failed and successful order reads at %s', async (path) => {
  let reject: ((reason: Error) => void) | undefined;
  const service = createMockCommerceAdapter([delivered]);
  const orders = vi.fn<CommerceAdapter['orders']>().mockImplementationOnce(() => new Promise((_, fail) => { reject = fail; })).mockImplementationOnce(service.orders);
  mount(path, { ...service, orders });
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  expect(screen.queryByText('This sample order could not be found.')).not.toBeInTheDocument();
  await act(async () => { reject?.(new Error('private read details')); });
  expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load');
  expect(screen.queryByText('private read details')).not.toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  if (path.endsWith('delivered')) await screen.findByRole('textbox', { name: 'Sample feedback' });
  else await screen.findByRole('link', { name: 'delivered' });
  expect(orders).toHaveBeenCalledTimes(2);
});

it('does not turn a stale order-list cache into a false missing-order result', async () => {
  let resolve: ((value: unknown) => void) | undefined;
  const service = createMockCommerceAdapter([]);
  const orders = vi.fn<CommerceAdapter['orders']>().mockResolvedValueOnce([]).mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
  const view = mount('/account/orders', { ...service, orders });
  await screen.findByText('There are no sample orders in this session.');
  act(() => view.navigate('/account/orders/delivered'));
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  expect(screen.queryByText('This sample order could not be found.')).not.toBeInTheDocument();
  await act(async () => { resolve?.([delivered]); });
  expect(await screen.findByRole('textbox', { name: 'Sample feedback' })).toBeVisible();
});

it.each([
  { name: 'malformed record', value: [{ id: 'bad', paymentStatus: 'guessed-state' }] },
  { name: 'duplicate references', value: [delivered, delivered] },
])('rejects $name rather than displaying unreliable order data', async ({ value }) => {
  const service = createMockCommerceAdapter([]);
  mount('/account/orders', { ...service, orders: async () => value });
  expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load');
  expect(screen.queryByRole('link', { name: 'delivered' })).not.toBeInTheDocument();
});

it.each([
  { delivered: false, canReview: true }, { delivered: true, canReview: false },
])('keeps feedback unavailable for delivered=$delivered capability=$canReview', async (flags) => {
  mount('/account/orders/delivered', createMockCommerceAdapter([{ ...delivered, ...flags }]));
  expect(await screen.findByText(/Feedback is not available for this sample order/)).toBeVisible();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('aborts an abandoned orders read and excludes its late result from the cache', async () => {
  const signals: AbortSignal[] = []; let resolve: ((value: unknown) => void) | undefined;
  const adapter = { ...createMockCommerceAdapter([]), orders: (signal?: AbortSignal) => {
    if (signal) signals.push(signal);
    return new Promise<unknown>((done) => { resolve = done; });
  } };
  const view = mount('/account/orders', adapter);
  expect(screen.getByRole('status')).toHaveTextContent('Loading'); view.unmount();
  expect(signals[0]?.aborted).toBe(true);
  await act(async () => { resolve?.([delivered]); });
  expect(view.client.getQueryData(orderKey(adapter))).toBeUndefined();
});
