import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';
import { Shell } from '../../shared/components/layout/Shell';
import { AdminScreen } from './AdminScreen';
import { createMockAdminAdapter, type AdminAdapter } from './api/mock';
import { workspaceSchema, type AllowedWorkspace } from './model';
import { adminKey } from './query';

const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });
async function fixture() {
  const value = workspaceSchema.parse(await createMockAdminAdapter().read());
  if (value.access !== 'allowed') throw new Error('Missing fixture.'); return value;
}
function mount(entry: string, adapter: AdminAdapter) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } }); clients.push(client);
  const navigation: { go?: NavigateFunction } = {};
  function CaptureNavigation() { navigation.go = useNavigate(); return null; }
  const content = (source: AdminAdapter) => <QueryClientProvider client={client}><MemoryRouter initialEntries={[entry]}><CaptureNavigation /><Shell audience="admin"><Routes>
    <Route path="/admin" element={<AdminScreen screen="overview" adapter={source} />} />
    <Route path="/admin/categories/new" element={<AdminScreen screen="newCategory" adapter={source} />} />
    {(['suppliers', 'users', 'categories', 'orders', 'refunds', 'reviews'] as const).map((kind) => <Route key={kind} path={`/admin/${kind}`}>
      <Route index element={<AdminScreen screen={kind} adapter={source} />} />
      <Route path=":recordId" element={<AdminScreen screen={kind} detail adapter={source} />} />
    </Route>)}
  </Routes></Shell></MemoryRouter></QueryClientProvider>;
  const view = render(content(adapter));
  return { ...view, client, navigate: (to: string) => { void navigation.go?.(to); }, switchAdapter: (source: AdminAdapter) => view.rerender(content(source)) };
}

it('does not reopen a denied workspace after an earlier write fails', async () => {
  const service = createMockAdminAdapter(); let fail: ((error: Error) => void) | undefined;
  const read = vi.fn<AdminAdapter['read']>().mockImplementation(service.read);
  const execute = vi.fn<AdminAdapter['execute']>().mockImplementation(() => new Promise((_, reject) => { fail = reject; }));
  const adapter = { ...service, read, execute }; const { client } = mount('/admin/orders/sample-order', adapter);
  const user = userEvent.setup(); await user.type(await screen.findByRole('textbox', { name: 'Sample oversight note' }), 'Pending fictional note');
  await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  act(() => client.setQueryData(adminKey(adapter), { access: 'forbidden' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('permission');
  await act(async () => { fail?.(new Error('private late failure')); });
  await waitFor(() => expect(client.isMutating()).toBe(0));
  expect(read).toHaveBeenCalledOnce(); expect(screen.getByRole('alert')).toHaveTextContent('permission');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('rejects a note receipt that also changes the payment example', async () => {
  const service = createMockAdminAdapter(); const before = await fixture();
  const execute = vi.fn<AdminAdapter['execute']>().mockImplementation(async () => ({ ...before, revision: 1,
    records: before.records.map((record) => record.kind === 'orders' ? { ...record, note: 'Requested sample note', paymentExample: 'successful' } : record),
  }));
  mount('/admin/orders/sample-order', { ...service, execute }); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample oversight note' }); await user.type(input, 'Requested sample note');
  await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved'); expect(input).toHaveValue('Requested sample note');
  expect(screen.getByText('Payment: not connected; no payment has been requested')).toBeVisible();
});

it('rejects category creation receipts that silently remove another category', async () => {
  const service = createMockAdminAdapter(); const before = await fixture();
  const execute = vi.fn<AdminAdapter['execute']>().mockResolvedValue({ ...before, revision: 1,
    records: [...before.records.filter((record) => record.kind !== 'categories' || record.id !== 'sample-plants'),
      { kind: 'categories', id: 'new-category', label: 'Requested sample category', canRename: true, canRemove: true }],
  });
  mount('/admin/categories/new', { ...service, execute }); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'New sample category label' }); await user.type(input, 'Requested sample category');
  await user.click(screen.getByRole('button', { name: 'Create sample category' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved'); expect(input).toHaveValue('Requested sample category');
});

it.each(['suppliers', 'users', 'categories', 'orders', 'refunds', 'reviews'] as const)('distinguishes initial loading, failure and explicit retry for %s', async (kind) => {
  const service = createMockAdminAdapter(); let fail: ((error: Error) => void) | undefined;
  const read = vi.fn<AdminAdapter['read']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.read);
  mount(`/admin/${kind}`, { ...service, read }); expect(screen.getByRole('status')).toHaveTextContent('Loading');
  expect(screen.queryByText(/^No sample .* in this workspace\.$/)).not.toBeInTheDocument();
  await act(async () => { fail?.(new Error('private initial details')); });
  expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t load'); expect(screen.queryByText('private initial details')).not.toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
  await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  expect(screen.queryByRole('alert')).not.toBeInTheDocument(); expect(read).toHaveBeenCalledTimes(2);
});

it('does not turn a stale empty list into a premature missing-detail result', async () => {
  const service = createMockAdminAdapter(); const seed = await fixture(); let finish: ((data: unknown) => void) | undefined;
  const read = vi.fn<AdminAdapter['read']>().mockResolvedValueOnce({ access: 'allowed', revision: 0, records: [] }).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
  const view = mount('/admin/orders', { ...service, read }); await screen.findByText('No sample orders in this workspace.');
  act(() => view.navigate('/admin/orders/sample-order'));
  await waitFor(() => expect(read).toHaveBeenCalledTimes(2));
  expect(screen.queryByText('This sample record could not be found.')).not.toBeInTheDocument();
  expect(screen.getByText('Loading. Please wait.')).toBeInTheDocument();
  await act(async () => { finish?.(seed); }); expect(await screen.findByRole('heading', { name: 'Fictional Posy Order' })).toBeVisible();
});

it('detaches old creation navigation and drafts when the adapter identity changes', async () => {
  const service = createMockAdminAdapter(); let finish: (() => void) | undefined;
  const adapter = { ...service, execute: vi.fn<AdminAdapter['execute']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.execute(command).then(resolve); };
  })) };
  const view = mount('/admin/categories/new', adapter); const user = userEvent.setup();
  await user.type(await screen.findByRole('textbox', { name: 'New sample category label' }), 'Old fictional category');
  await user.click(screen.getByRole('button', { name: 'Create sample category' }));
  const next = createMockAdminAdapter(); view.switchAdapter(next);
  const input = await screen.findByRole('textbox', { name: 'New sample category label' }); expect(input).toHaveValue(''); expect(input).toBeEnabled();
  await act(async () => { finish?.(); }); await waitFor(() => expect(view.client.isMutating()).toBe(0));
  expect(input).toHaveValue(''); expect(screen.getByRole('heading', { name: 'New sample category', level: 1 })).toBeVisible();
  expect(view.client.getQueryData<AllowedWorkspace>(adminKey(next))?.records.some((record) => record.label === 'Old fictional category')).toBe(false);
});

it('keeps a newer cached snapshot when an older valid write completes', async () => {
  const service = createMockAdminAdapter(); let finish: (() => void) | undefined;
  const adapter = { ...service, execute: vi.fn<AdminAdapter['execute']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.execute(command).then(resolve); };
  })) };
  const { client } = mount('/admin/orders/sample-order', adapter); const user = userEvent.setup();
  await user.type(await screen.findByRole('textbox', { name: 'Sample oversight note' }), 'Earlier fictional note'); await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  const newer = await fixture(); newer.revision = 2; const order = newer.records.find((record) => record.kind === 'orders');
  if (order?.kind !== 'orders') throw new Error('Missing fixture order.'); order.note = 'Newer fictional note';
  act(() => client.setQueryData(adminKey(adapter), newer)); await act(async () => { finish?.(); });
  await waitFor(() => expect(client.isMutating()).toBe(0));
  expect(screen.getByText('Saved sample oversight note: Newer fictional note')).toBeVisible();
});

it('keeps denied content hidden after an older allowed write succeeds', async () => {
  const service = createMockAdminAdapter(); let finish: (() => void) | undefined;
  const adapter = { ...service, execute: vi.fn<AdminAdapter['execute']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.execute(command).then(resolve); };
  })) };
  const { client } = mount('/admin/refunds/sample-request', adapter); const user = userEvent.setup();
  await user.type(await screen.findByRole('textbox', { name: 'Sample oversight note' }), 'Earlier fictional note'); await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  act(() => client.setQueryData(adminKey(adapter), { access: 'forbidden' })); await screen.findByRole('alert');
  await act(async () => { finish?.(); }); await waitFor(() => expect(client.isMutating()).toBe(0));
  expect(screen.getByRole('alert')).toHaveTextContent('permission'); expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('cancels a refresh before a successful write so its ignored late result cannot overwrite the receipt', async () => {
  const service = createMockAdminAdapter(); const old = await fixture(); let finish: ((data: unknown) => void) | undefined; const signals: AbortSignal[] = [];
  const read = vi.fn<AdminAdapter['read']>().mockImplementationOnce(service.read).mockImplementation((signal) => {
    if (signal) signals.push(signal); return new Promise((resolve) => { finish = resolve; });
  });
  const adapter = { ...service, read }; const { client } = mount('/admin/orders/sample-order', adapter); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample oversight note' });
  act(() => { void client.invalidateQueries({ queryKey: adminKey(adapter) }); }); await waitFor(() => expect(read).toHaveBeenCalledTimes(2));
  await user.type(input, 'Saved during refresh'); await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  await screen.findByText('Saved sample oversight note: Saved during refresh'); expect(signals[0]?.aborted).toBe(true);
  await act(async () => { finish?.(old); }); expect(screen.getByText('Saved sample oversight note: Saved during refresh')).toBeVisible();
});

it('separates identical IDs across record kinds and detaches old record callbacks on navigation', async () => {
  const seed = await fixture();
  seed.records = seed.records.map((record) => record.kind === 'users' && record.id === 'sample-customer' ? { ...record, id: 'sample-studio' }
    : record.kind === 'orders' ? { ...record, userId: 'sample-studio' } : record);
  const service = createMockAdminAdapter(seed); let finish: (() => void) | undefined;
  const adapter = { ...service, execute: vi.fn<AdminAdapter['execute']>().mockImplementation((command) => new Promise((resolve) => {
    finish = () => { void service.execute(command).then(resolve); };
  })) };
  const view = mount('/admin/suppliers/sample-studio', adapter); const user = userEvent.setup();
  await user.type(await screen.findByRole('textbox', { name: 'Sample oversight note' }), 'Supplier-only fictional note'); await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  act(() => view.navigate('/admin/users/sample-studio')); const input = await screen.findByRole('textbox', { name: 'Sample oversight note' });
  expect(input).toHaveValue(''); expect(input).toBeEnabled();
  await act(async () => { finish?.(); }); await waitFor(() => expect(view.client.isMutating()).toBe(0));
  expect(input).toHaveValue(''); expect(screen.getByRole('heading', { name: 'Sample customer alias' })).toBeVisible();
  expect(screen.queryByText('Sample changes saved for this session only.')).not.toBeInTheDocument();
});

it.each([{ access: 'allowed', revision: -1, records: [] }, { invalid: 'response' }])('rejects malformed initial snapshots without false empty content', async (value) => {
  const service = createMockAdminAdapter(); mount('/admin/categories', { ...service, read: async () => value });
  expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t load'); expect(screen.queryByText('No sample categories in this workspace.')).not.toBeInTheDocument();
});

it('accepts a valid note acknowledgement when records are reordered', async () => {
  const service = createMockAdminAdapter(); const adapter = { ...service, execute: async (command: Parameters<AdminAdapter['execute']>[0]) => {
    const value = workspaceSchema.parse(await service.execute(command)); if (value.access === 'allowed') value.records.reverse(); return value;
  } };
  mount('/admin/orders/sample-order', adapter); const user = userEvent.setup();
  await user.type(await screen.findByRole('textbox', { name: 'Sample oversight note' }), 'Fictional reordered receipt'); await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  expect(await screen.findByText('Saved sample oversight note: Fictional reordered receipt')).toBeVisible();
});

it('preserves deliberate external focus after a save fails', async () => {
  const service = createMockAdminAdapter(); let fail: ((error: Error) => void) | undefined;
  mount('/admin/orders/sample-order', { ...service, execute: () => new Promise((_, reject) => { fail = reject; }) });
  const user = userEvent.setup(); const input = await screen.findByRole('textbox', { name: 'Sample oversight note' });
  await user.type(input, 'Retained fictional draft'); await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  const heading = screen.getByRole('heading', { name: 'Orders detail', level: 1 }); heading.focus();
  await act(async () => { fail?.(new Error('private write details')); }); await screen.findByRole('alert');
  expect(heading).toHaveFocus(); expect(input).toHaveValue('Retained fictional draft');
});

it('retains a failed category removal, prevents duplicates and permits explicit retry', async () => {
  // Only model open/close state in jsdom; Chrome checks native modality and keyboard focus.
  const prototype = HTMLDialogElement.prototype;
  const show = Object.getOwnPropertyDescriptor(prototype, 'showModal'); const close = Object.getOwnPropertyDescriptor(prototype, 'close');
  Object.defineProperty(prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.open = true; } });
  Object.defineProperty(prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.open = false; } });
  const service = createMockAdminAdapter(); let fail: ((error: Error) => void) | undefined;
  const execute = vi.fn<AdminAdapter['execute']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.execute);
  const adapter = { ...service, execute }; const view = mount('/admin/categories/sample-stems', adapter);
  try {
    const user = userEvent.setup(); await user.click(await screen.findByRole('button', { name: 'Remove sample category' }));
    const confirm = screen.getByRole('button', { name: 'Confirm removal' }); await user.dblClick(confirm);
    expect(confirm).toBeDisabled(); expect(execute).toHaveBeenCalledOnce(); expect(screen.getByText('Removing sample category.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Close' })); expect(screen.getByRole('dialog')).toHaveAttribute('open');
    await act(async () => { fail?.(new Error('private removal details')); });
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be removed'); expect(execute).toHaveBeenCalledOnce();
    expect(screen.queryByText('private removal details')).not.toBeInTheDocument(); expect(screen.getByRole('heading', { name: 'Sample stems' })).toBeVisible();
    await user.click(confirm); await waitFor(() => expect(view.client.isMutating()).toBe(0));
    expect(execute).toHaveBeenCalledTimes(2); expect(await screen.findByRole('link', { name: 'Sample plants' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Sample stems' })).not.toBeInTheDocument();
  } finally {
    view.unmount();
    if (show) Object.defineProperty(prototype, 'showModal', show); else Reflect.deleteProperty(prototype, 'showModal');
    if (close) Object.defineProperty(prototype, 'close', close); else Reflect.deleteProperty(prototype, 'close');
  }
});
