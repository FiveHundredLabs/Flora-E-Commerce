import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';
import { Shell } from '../../shared/components/layout/Shell';
import { AdminScreen } from './AdminScreen';
import { createMockAdminAdapter, type AdminAdapter } from './api/mock';
import { workspaceSchema, type AllowedWorkspace } from './model';
import { adminKey } from './query';

const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });
function mount(entry: string, adapter: AdminAdapter = createMockAdminAdapter()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } }); clients.push(client);
  const view = render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[entry]}><Shell audience="admin"><Routes>
    <Route path="/admin" element={<AdminScreen screen="overview" adapter={adapter} />} />
    <Route path="/admin/categories/new" element={<AdminScreen screen="newCategory" adapter={adapter} />} />
    {(['suppliers', 'users', 'categories', 'orders', 'refunds', 'reviews'] as const).map((kind) => <Route key={kind} path={`/admin/${kind}`}>
      <Route index element={<AdminScreen screen={kind} adapter={adapter} />} />
      <Route path=":recordId" element={<AdminScreen screen={kind} detail adapter={adapter} />} />
    </Route>)}
  </Routes></Shell></MemoryRouter></QueryClientProvider>);
  return { ...view, client };
}
it('validates category creation, routes to its detail and persists a renamed sample label', async () => {
  const adapter = createMockAdminAdapter(); mount('/admin/categories/new', adapter); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'New sample category label' });
  await user.click(screen.getByRole('button', { name: 'Create sample category' })); expect(input).toHaveFocus(); expect(input).toHaveAccessibleDescription('Enter a sample label.');
  await user.type(input, 'Fictional category'); await user.click(screen.getByRole('button', { name: 'Create sample category' }));
  await user.click(await screen.findByRole('link', { name: 'Fictional category' }));
  const label = await screen.findByRole('textbox', { name: 'Sample display label' });
  await user.clear(label); await user.type(label, 'Edited fictional category'); await user.click(screen.getByRole('button', { name: 'Save sample label' }));
  expect(await screen.findByRole('heading', { name: 'Edited fictional category' })).toBeVisible();
  await user.type(label, ' draft'); expect(screen.queryByText('Sample changes saved for this session only.')).not.toBeInTheDocument();
});
it('validates an oversight note and preserves refund/order content after saving', async () => {
  mount('/admin/refunds/sample-request'); const user = userEvent.setup(); const input = await screen.findByRole('textbox', { name: 'Sample oversight note' });
  await user.click(screen.getByRole('button', { name: 'Save sample oversight note' })); expect(input).toHaveFocus(); expect(input).toHaveAccessibleDescription('Enter a sample oversight note.');
  await user.type(input, 'Fictional evidence review'); await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  expect(await screen.findByText('Saved sample oversight note: Fictional evidence review')).toBeVisible();
  expect(screen.getByText(/No refund decision, eligibility, amount/)).toBeVisible();
});
it('retains failed-save text, prevents duplicate writes and permits explicit retry only', async () => {
  const service = createMockAdminAdapter(); let fail: ((error: Error) => void) | undefined;
  const execute = vi.fn<AdminAdapter['execute']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.execute);
  mount('/admin/reviews/sample-feedback', { ...service, execute }); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample oversight note' }); await user.type(input, 'Retained fictional note');
  const save = screen.getByRole('button', { name: 'Save sample oversight note' }); await user.dblClick(save);
  expect(save).toBeDisabled(); expect(execute).toHaveBeenCalledOnce();
  await act(async () => { fail?.(new Error('private service details')); });
  expect(await screen.findByRole('alert')).toHaveTextContent('text has been kept'); expect(input).toHaveValue('Retained fictional note');
  expect(execute).toHaveBeenCalledOnce(); expect(screen.queryByText('private service details')).not.toBeInTheDocument();
  await user.click(save); expect(await screen.findByText('Saved sample oversight note: Retained fictional note')).toBeVisible();
});
it('rejects a correctly versioned receipt for the wrong note', async () => {
  const service = createMockAdminAdapter(); const before = workspaceSchema.parse(await service.read());
  if (before.access !== 'allowed') throw new Error('Missing fixture.');
  mount('/admin/orders/sample-order', { ...service, execute: async () => ({ ...before, revision: 1 }) }); const user = userEvent.setup();
  await user.type(await screen.findByRole('textbox', { name: 'Sample oversight note' }), 'Requested fictional note');
  await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved'); expect(screen.queryByText('Sample changes saved for this session only.')).not.toBeInTheDocument();
});
it('shows initial loading, safe read error and successful retry without premature missing content', async () => {
  const service = createMockAdminAdapter(); let fail: ((error: Error) => void) | undefined;
  const read = vi.fn<AdminAdapter['read']>().mockImplementationOnce(() => new Promise((_, reject) => { fail = reject; })).mockImplementationOnce(service.read);
  mount('/admin/orders/sample-order', { ...service, read }); expect(screen.getByRole('status')).toHaveTextContent('Loading');
  expect(screen.queryByText('This sample record could not be found.')).not.toBeInTheDocument();
  await act(async () => { fail?.(new Error('private read details')); }); await screen.findByRole('alert');
  await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' })); expect(await screen.findByRole('heading', { name: 'Fictional Posy Order' })).toBeVisible();
});
it('retains a mounted draft on failed background refresh and restores retry focus', async () => {
  const service = createMockAdminAdapter(); const read = vi.fn<AdminAdapter['read']>().mockImplementationOnce(service.read).mockRejectedValueOnce(new Error('private refresh details')).mockImplementation(service.read);
  const adapter = { ...service, read }; const { client } = mount('/admin/refunds/sample-request', adapter); const user = userEvent.setup();
  const input = await screen.findByRole('textbox', { name: 'Sample oversight note' }); await user.type(input, 'Unsaved fictional draft');
  await act(async () => { await client.invalidateQueries({ queryKey: adminKey(adapter) }); });
  expect(await screen.findByRole('alert')).toHaveTextContent('could not refresh'); expect(input).toHaveValue('Unsaved fictional draft'); expect(input).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Retry admin refresh' }));
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument()); expect(input).toHaveValue('Unsaved fictional draft');
  expect(screen.getByRole('heading', { name: 'Refund requests detail', level: 1 })).toHaveFocus();
});
it.each(['suppliers', 'users', 'categories', 'orders', 'refunds', 'reviews'] as const)('shows a clear empty %s list', async (kind) => {
  mount(`/admin/${kind}`, createMockAdminAdapter({ access: 'allowed', revision: 0, records: [] }));
  expect(await screen.findByText(/^No sample .* in this workspace\.$/)).toBeVisible();
});
it('removes editable content after an explicit denied refresh', async () => {
  const service = createMockAdminAdapter(); const read = vi.fn<AdminAdapter['read']>().mockImplementationOnce(service.read).mockResolvedValueOnce({ access: 'forbidden' });
  const adapter = { ...service, read }; const { client } = mount('/admin/users/sample-customer', adapter);
  await screen.findByRole('textbox', { name: 'Sample display label' });
  await act(async () => { await client.invalidateQueries({ queryKey: adminKey(adapter) }); });
  expect(await screen.findByRole('alert')).toHaveTextContent('permission'); expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});
it('keeps missing references distinct from read errors', async () => {
  mount('/admin/refunds/missing'); expect(await screen.findByText('This sample record could not be found.')).toBeVisible(); expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});
it('respects record capabilities without inventing approval or role controls', async () => {
  mount('/admin/suppliers/sample-nursery'); expect(await screen.findByText('Note editing is unavailable for this sample record.')).toBeVisible();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); expect(screen.queryByRole('button', { name: /approve|ban|refund/i })).not.toBeInTheDocument();
});
it('aborts abandoned reads and excludes ignored late responses from the cache', async () => {
  const service = createMockAdminAdapter(); const value = await service.read(); const signals: AbortSignal[] = []; let finish: ((value: unknown) => void) | undefined;
  const adapter = { ...service, read: (signal?: AbortSignal) => { if (signal) signals.push(signal); return new Promise<unknown>((resolve) => { finish = resolve; }); } };
  const { unmount, client } = mount('/admin/orders', adapter); expect(screen.getByRole('status')).toHaveTextContent('Loading'); unmount();
  expect(signals[0]?.aborted).toBe(true); await act(async () => { finish?.(value); }); expect(client.getQueryData<AllowedWorkspace>(adminKey(adapter))).toBeUndefined();
});
