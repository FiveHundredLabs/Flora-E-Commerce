import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';
import { SupplierScreen, type SupplierScreenName } from './SupplierScreen';
import { createMockSupplierAdapter, type SupplierAdapter } from './api/mock';
import { workspaceSchema } from './model';

const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });
function mount(screenName: SupplierScreenName, adapter: SupplierAdapter = createMockSupplierAdapter(), entry = '/supplier') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } }); clients.push(client);
  return render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/supplier/products/:productId" element={<SupplierScreen screen={screenName} adapter={adapter} />} />
    <Route path="*" element={<SupplierScreen screen={screenName} adapter={adapter} />} />
  </Routes></MemoryRouter></QueryClientProvider>);
}
it('validates a profile, focuses its field and saves fictional text without stale success on edits', async () => {
  const service = createMockSupplierAdapter(); mount('profile', service);
  const user = userEvent.setup(); const input = await screen.findByRole('textbox', { name: 'Sample store name' });
  await user.clear(input); await user.click(screen.getByRole('button', { name: 'Save sample profile' }));
  expect(input).toHaveFocus(); expect(input).toHaveAccessibleDescription('Enter a sample name.');
  await user.type(input, 'Fictional Profile'); await user.click(screen.getByRole('button', { name: 'Save sample profile' }));
  await screen.findByText('Sample changes saved for this session only.');
  const result = workspaceSchema.parse(await service.read());
  expect(result.access === 'allowed' && result.profile.name).toBe('Fictional Profile');
  await user.type(input, ' edited'); expect(screen.queryByText('Sample changes saved for this session only.')).not.toBeInTheDocument();
});
it('keeps failed profile inputs, prevents duplicate writes and does not auto-retry', async () => {
  const service = createMockSupplierAdapter(); let fail: ((error: Error) => void) | undefined;
  const execute = vi.fn<SupplierAdapter['execute']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.execute);
  mount('profile', { ...service, execute });
  const user = userEvent.setup(); const input = await screen.findByRole('textbox', { name: 'Sample store name' });
  await user.clear(input); await user.type(input, 'Retained Sample');
  const button = screen.getByRole('button', { name: 'Save sample profile' }); await user.dblClick(button);
  expect(button).toBeDisabled(); expect(execute).toHaveBeenCalledOnce();
  await act(async () => { fail?.(new Error('private service details')); });
  expect(await screen.findByRole('alert')).toHaveTextContent('inputs have been kept');
  expect(input).toHaveValue('Retained Sample'); expect(execute).toHaveBeenCalledOnce();
  expect(screen.queryByText('private service details')).not.toBeInTheDocument();
  await user.click(button); expect(await screen.findByText('Sample changes saved for this session only.')).toBeVisible();
});
it('renders loading, failed read and successful retry', async () => {
  const service = createMockSupplierAdapter(); let fail: ((error: Error) => void) | undefined;
  const read = vi.fn<SupplierAdapter['read']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.read);
  mount('overview', { ...service, read });
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  await act(async () => { fail?.(new Error('private read details')); });
  await screen.findByRole('alert'); await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('heading', { name: 'Meadow Studio' })).toBeVisible(); expect(read).toHaveBeenCalledTimes(2);
});
it('shows a denied state without exposing edit controls', async () => {
  mount('profile', createMockSupplierAdapter({ access: 'forbidden' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('permission'); expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});
it('rejects malformed acknowledgements rather than claiming a save', async () => {
  const service = createMockSupplierAdapter();
  mount('profile', { ...service, execute: async () => ({ access: 'allowed', revision: 999 }) });
  await screen.findByRole('textbox', { name: 'Sample store name' });
  await userEvent.setup().click(screen.getByRole('button', { name: 'Save sample profile' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved');
  expect(screen.queryByText('Sample changes saved for this session only.')).not.toBeInTheDocument();
});
it('keeps missing products distinct from read errors', async () => {
  mount('product', createMockSupplierAdapter(), '/supplier/products/missing');
  expect(await screen.findByText('This sample product could not be found.')).toBeVisible();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});
it('requires a whole stock count and saves zero without changing another variant', async () => {
  const service = createMockSupplierAdapter(); mount('inventory', service);
  const user = userEvent.setup(); const input = await screen.findByRole('spinbutton', { name: 'Stock for Sample Posy — Standard' });
  await user.clear(input); await user.type(input, '-1'); await user.click(screen.getByRole('button', { name: 'Save stock for Standard' }));
  expect(input).toHaveFocus(); expect(input).toHaveAttribute('aria-invalid', 'true');
  await user.clear(input); await user.type(input, '0'); await user.click(screen.getByRole('button', { name: 'Save stock for Standard' }));
  expect(await screen.findByText('Current sample count: 0')).toBeVisible();
  expect(screen.getByText('Current sample count: 3')).toBeVisible();
});
it('keeps note controls capability-gated and saves only the selected order', async () => {
  mount('orders'); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Fulfilment note for sample-order-one' });
  expect(screen.queryByRole('textbox', { name: 'Fulfilment note for sample-order-two' })).not.toBeInTheDocument();
  await user.type(input, 'Fictional packing note'); await user.click(screen.getByRole('button', { name: 'Save note for sample-order-one' }));
  expect(await screen.findByText('Saved sample note: Fictional packing note')).toBeVisible();
  expect(screen.getByText('Saved sample note: Sample note: packed for review.')).toBeVisible();
});
it.each(['products', 'inventory', 'orders', 'sales'] as const)('shows the %s empty state without fabricated totals', async (screenName) => {
  const service = createMockSupplierAdapter(); const data = workspaceSchema.parse(await service.read());
  if (data.access !== 'allowed') throw new Error('Missing fixture.');
  mount(screenName, createMockSupplierAdapter({ ...data, products: [], orders: [] }));
  expect(await screen.findByText(/No sample (products|variants|orders|sales)/)).toBeVisible();
});
it('adds a variant, then keeps its saved value in the product editor', async () => {
  mount('product', createMockSupplierAdapter(), '/supplier/products/sample-posy');
  const user = userEvent.setup(); const form = await screen.findByRole('form', { name: 'Add sample variant' });
  await user.type(within(form).getByRole('textbox', { name: 'New variant name' }), 'Mini');
  await user.click(within(form).getByRole('button', { name: 'Add sample variant' }));
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Mini' })).toBeVisible());
  expect(within(form).getByRole('textbox', { name: 'New variant name' })).toHaveValue('');
});
