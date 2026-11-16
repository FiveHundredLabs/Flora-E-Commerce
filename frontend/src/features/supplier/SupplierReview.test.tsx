import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';
import { SupplierScreen, type SupplierScreenName } from './SupplierScreen';
import { createMockSupplierAdapter, type SupplierAdapter } from './api/mock';
import { supplierKey } from './query';
import { workspaceSchema, type AllowedWorkspace } from './model';

const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });
async function fixture() {
  const data = workspaceSchema.parse(await createMockSupplierAdapter().read());
  if (data.access !== 'allowed') throw new Error('Missing fixture.');
  return data;
}
function mount(screenName: SupplierScreenName, adapter: SupplierAdapter, entry = '/supplier') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } }); clients.push(client);
  const content = (source: SupplierAdapter) => <QueryClientProvider client={client}><MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/supplier/products/:productId" element={<SupplierScreen screen={screenName} adapter={source} />} />
    <Route path="*" element={<SupplierScreen screen={screenName} adapter={source} />} />
  </Routes></MemoryRouter></QueryClientProvider>;
  const view = render(content(adapter));
  return { ...view, client, switchAdapter: (source: SupplierAdapter) => view.rerender(content(source)) };
}

it('preserves a profile draft across a failed background refresh and retry', async () => {
  const service = createMockSupplierAdapter();
  const read = vi.fn<SupplierAdapter['read']>().mockImplementationOnce(service.read).mockRejectedValueOnce(new Error('private refresh details')).mockImplementation(service.read);
  const adapter = { ...service, read }; const { client } = mount('profile', adapter);
  const input = await screen.findByRole('textbox', { name: 'Sample store name' }); const user = userEvent.setup();
  await user.clear(input); await user.type(input, 'Unsaved fictional draft');
  await act(async () => { await client.invalidateQueries({ queryKey: supplierKey(adapter) }); });
  expect(await screen.findByRole('alert')).toHaveTextContent('could not refresh');
  expect(screen.getByRole('textbox', { name: 'Sample store name' })).toBe(input);
  expect(input).toHaveValue('Unsaved fictional draft'); expect(input).toHaveFocus();
  expect(screen.queryByText('private refresh details')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Retry workspace refresh' }));
  await waitFor(() => expect(read).toHaveBeenCalledTimes(3));
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  expect(input).toHaveValue('Unsaved fictional draft');
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Store profile', level: 1 })).toHaveFocus());
});

it('rejects a correctly versioned receipt that did not save the submitted profile', async () => {
  const service = createMockSupplierAdapter(); const before = await fixture();
  const execute = vi.fn<SupplierAdapter['execute']>().mockResolvedValue({ ...before, revision: 1 });
  mount('profile', { ...service, execute }); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample store name' });
  await user.clear(input); await user.type(input, 'Requested fictional name');
  await user.click(screen.getByRole('button', { name: 'Save sample profile' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved');
  expect(screen.queryByText('Sample changes saved for this session only.')).not.toBeInTheDocument();
  expect(input).toHaveValue('Requested fictional name'); expect(execute).toHaveBeenCalledOnce();
});

it.each(['registration', 'product', 'inventory', 'orders', 'sales'] as const)('separates initial loading/read failure/retry from missing or empty %s content', async (screenName) => {
  const service = createMockSupplierAdapter(); let fail: ((error: Error) => void) | undefined;
  const read = vi.fn<SupplierAdapter['read']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.read);
  mount(screenName, { ...service, read }, '/supplier/products/sample-posy');
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  expect(screen.queryByText('This sample product could not be found.')).not.toBeInTheDocument();
  await act(async () => { fail?.(new Error('private read details')); });
  expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t load');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  expect(screen.queryByRole('alert')).not.toBeInTheDocument(); expect(read).toHaveBeenCalledTimes(2);
});

it('removes cached edit controls when the refreshed capability denies workspace access', async () => {
  const service = createMockSupplierAdapter();
  const read = vi.fn<SupplierAdapter['read']>().mockImplementationOnce(service.read).mockResolvedValueOnce({ access: 'forbidden' });
  const adapter = { ...service, read }; const { client } = mount('profile', adapter);
  const input = await screen.findByRole('textbox', { name: 'Sample store name' });
  await userEvent.setup().type(input, ' draft');
  await act(async () => { await client.invalidateQueries({ queryKey: supplierKey(adapter) }); });
  expect(await screen.findByRole('alert')).toHaveTextContent('permission');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.queryByText('Meadow Studio')).not.toBeInTheDocument();
});

it('isolates drafts and late write callbacks when the adapter identity changes', async () => {
  const service = createMockSupplierAdapter(); let finish: (() => void) | undefined;
  const execute = vi.fn<SupplierAdapter['execute']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.execute(command).then(resolve); };
  }));
  const first = { ...service, execute }; const view = mount('profile', first); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample store name' });
  await user.clear(input); await user.type(input, 'Old workspace edit'); await user.click(screen.getByRole('button', { name: 'Save sample profile' }));
  const seed = await fixture(); const next = createMockSupplierAdapter({ ...seed, profile: { name: 'Other fictional store', description: '' } });
  view.switchAdapter(next);
  const nextInput = await screen.findByRole('textbox', { name: 'Sample store name' });
  expect(nextInput).toHaveValue('Other fictional store'); expect(nextInput).toBeEnabled();
  await act(async () => { finish?.(); });
  await waitFor(() => expect(view.client.isMutating()).toBe(0));
  expect(nextInput).toHaveValue('Other fictional store'); expect(screen.queryByText('Sample changes saved for this session only.')).not.toBeInTheDocument();
  expect(view.client.getQueryData<AllowedWorkspace>(supplierKey(next))?.profile.name).toBe('Other fictional store');
});

it('rejects a stock acknowledgement that changed a different variant', async () => {
  const seed = await fixture(); const wrong = structuredClone(seed); wrong.revision = 1;
  const variant = wrong.products[0]?.variants[1]; if (!variant) throw new Error('Missing variant.'); variant.stock = 0;
  const service = createMockSupplierAdapter(); const execute = vi.fn<SupplierAdapter['execute']>().mockResolvedValue(wrong);
  mount('inventory', { ...service, execute }); const user = userEvent.setup();
  const input = await screen.findByRole('spinbutton', { name: 'Stock for Sample Posy — Standard' });
  await user.clear(input); await user.type(input, '0'); await user.click(screen.getByRole('button', { name: 'Save stock for Standard' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved');
  expect(screen.getByText('Current sample count: 8')).toBeVisible(); expect(input).toHaveValue(0);
});

it('keeps a newer cached snapshot when an older valid acknowledgement arrives late', async () => {
  const service = createMockSupplierAdapter(); let finish: (() => void) | undefined;
  const adapter = { ...service, execute: vi.fn<SupplierAdapter['execute']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.execute(command).then(resolve); };
  })) };
  const { client } = mount('profile', adapter); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample store name' });
  await user.clear(input); await user.type(input, 'Earlier edit'); await user.click(screen.getByRole('button', { name: 'Save sample profile' }));
  const newer = { ...await fixture(), revision: 2, profile: { name: 'Newer acknowledged edit', description: '' } };
  act(() => client.setQueryData(supplierKey(adapter), newer));
  await act(async () => { finish?.(); });
  await waitFor(() => expect(client.isMutating()).toBe(0));
  expect(client.getQueryData<AllowedWorkspace>(supplierKey(adapter))?.profile.name).toBe('Newer acknowledged edit');
});

it('does not reopen a denied workspace when an earlier allowed write completes', async () => {
  const service = createMockSupplierAdapter(); let finish: (() => void) | undefined;
  const adapter = { ...service, execute: vi.fn<SupplierAdapter['execute']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.execute(command).then(resolve); };
  })) };
  const { client } = mount('profile', adapter);
  await screen.findByRole('textbox', { name: 'Sample store name' }); await userEvent.setup().click(screen.getByRole('button', { name: 'Save sample profile' }));
  act(() => client.setQueryData(supplierKey(adapter), { access: 'forbidden' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('permission');
  await act(async () => { finish?.(); });
  await waitFor(() => expect(client.isMutating()).toBe(0));
  expect(screen.getByRole('alert')).toHaveTextContent('permission'); expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('cancels an older refresh when a save succeeds and prevents its late cache overwrite', async () => {
  const service = createMockSupplierAdapter(); const old = await fixture(); const signals: AbortSignal[] = [];
  let finish: ((data: unknown) => void) | undefined;
  const read = vi.fn<SupplierAdapter['read']>().mockImplementationOnce(service.read).mockImplementation((signal) => {
    if (signal) signals.push(signal); return new Promise((resolve) => { finish = resolve; });
  });
  const adapter = { ...service, read }; const { client } = mount('profile', adapter); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample store name' });
  act(() => { void client.invalidateQueries({ queryKey: supplierKey(adapter) }); });
  await waitFor(() => expect(read).toHaveBeenCalledTimes(2));
  await user.clear(input); await user.type(input, 'Saved during refresh'); await user.click(screen.getByRole('button', { name: 'Save sample profile' }));
  await screen.findByText('Sample changes saved for this session only.'); expect(signals[0]?.aborted).toBe(true);
  await act(async () => { finish?.(old); });
  expect(client.getQueryData<AllowedWorkspace>(supplierKey(adapter))?.profile.name).toBe('Saved during refresh');
});

it('aborts abandoned initial reads and excludes ignored late results from the cache', async () => {
  const signals: AbortSignal[] = []; let finish: ((data: unknown) => void) | undefined;
  const service = createMockSupplierAdapter(); const old = await fixture();
  const adapter = { ...service, read: (signal?: AbortSignal) => {
    if (signal) signals.push(signal); return new Promise<unknown>((resolve) => { finish = resolve; });
  } };
  const { unmount, client } = mount('inventory', adapter); expect(screen.getByRole('status')).toHaveTextContent('Loading'); unmount();
  expect(signals[0]?.aborted).toBe(true); await act(async () => { finish?.(old); });
  expect(client.getQueryData(supplierKey(adapter))).toBeUndefined();
});

it.each([{ access: 'allowed', revision: -1 }, { invalid: 'response' }])('fails safely on an invalid initial workspace response', async (value) => {
  const service = createMockSupplierAdapter(); mount('orders', { ...service, read: async () => value });
  expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t load'); expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('keeps a failed removal open, prevents duplicate commands and allows an explicit retry', async () => {
  // jsdom has no native modal API. This shim only tests state/commands; Chrome tests containment and focus.
  const prototype = HTMLDialogElement.prototype;
  const show = Object.getOwnPropertyDescriptor(prototype, 'showModal'); const close = Object.getOwnPropertyDescriptor(prototype, 'close');
  Object.defineProperty(prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.open = true; } });
  Object.defineProperty(prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.open = false; } });
  const service = createMockSupplierAdapter(); let fail: ((error: Error) => void) | undefined;
  const execute = vi.fn<SupplierAdapter['execute']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.execute);
  const adapter = { ...service, execute }; const view = mount('product', adapter, '/supplier/products/sample-posy');
  try {
    const user = userEvent.setup(); await user.click(await screen.findByRole('button', { name: 'Remove sample product' }));
    const confirm = screen.getByRole('button', { name: 'Confirm removal' }); await user.dblClick(confirm);
    expect(confirm).toBeDisabled(); expect(screen.getByText('Removing sample item.')).toBeVisible(); expect(execute).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    await act(async () => { fail?.(new Error('private removal details')); });
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be removed');
    expect(screen.queryByText('private removal details')).not.toBeInTheDocument(); expect(execute).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'Sample Posy' })).toBeVisible();
    await user.click(confirm); await waitFor(() => expect(view.client.isMutating()).toBe(0));
    expect(execute).toHaveBeenCalledTimes(2);
    expect(view.client.getQueryData<AllowedWorkspace>(supplierKey(adapter))?.products).toEqual([]);
    expect(view.client.getQueryData<AllowedWorkspace>(supplierKey(adapter))?.orders).toHaveLength(2);
  } finally {
    view.unmount();
    if (show) Object.defineProperty(prototype, 'showModal', show); else Reflect.deleteProperty(prototype, 'showModal');
    if (close) Object.defineProperty(prototype, 'close', close); else Reflect.deleteProperty(prototype, 'close');
  }
});
