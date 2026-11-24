import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Shell } from '../../shared/components/layout/Shell';
import { AdminScreen } from './AdminScreen';
import { createMockAdminAdapter, type AdminAdapter } from './api/mock';
import { workspaceSchema, type AllowedWorkspace } from './model';
import { adminKey } from './query';

const clients: QueryClient[] = [];
afterEach(() => { for (const client of clients.splice(0)) client.clear(); });

beforeEach(() => {
  // Ensure native <dialog> methods exist in jsdom environment
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.open = true; };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) { this.open = false; };
  }
});

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

// Interactive Data Table & Moderation Dialogs Verification Tests
it('filters records interactively with live search input', async () => {
  mount('/admin/suppliers'); const user = userEvent.setup();
  expect(await screen.findByText('Fictional Stem Studio')).toBeVisible();
  expect(screen.getByText('Fictional Orchid Haven')).toBeVisible();

  const searchInput = screen.getByRole('searchbox', { name: 'Search Suppliers' });
  await user.type(searchInput, 'Orchid');
  expect(screen.getByText('Fictional Orchid Haven')).toBeVisible();
  expect(screen.queryByText('Fictional Stem Studio')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(screen.getByText('Fictional Stem Studio')).toBeVisible();
});

it('filters records with status pill tabs', async () => {
  mount('/admin/suppliers'); const user = userEvent.setup();
  await screen.findByText('Fictional Stem Studio');

  const pendingTab = screen.getByRole('tab', { name: /Pending/ });
  await user.click(pendingTab);
  expect(screen.getByText('Fictional Leaf Nursery')).toBeVisible();
  expect(screen.getByText('Fictional Orchid Haven')).toBeVisible();
  expect(screen.queryByText('Fictional Stem Studio')).not.toBeInTheDocument();

  const approvedTab = screen.getByRole('tab', { name: /Approved/ });
  await user.click(approvedTab);
  expect(screen.getByText('Fictional Stem Studio')).toBeVisible();
  expect(screen.queryByText('Fictional Leaf Nursery')).not.toBeInTheDocument();
});

it('reviews and approves a pending supplier via moderation modal', async () => {
  mount('/admin/suppliers'); const user = userEvent.setup();
  const reviewButtons = await screen.findAllByRole('button', { name: 'Review' });
  await user.click(reviewButtons[1]!); // Fictional Leaf Nursery

  expect(await screen.findByRole('heading', { name: /Review Supplier: Fictional Leaf Nursery/ })).toBeVisible();
  const noteInput = screen.getByRole('textbox', { name: 'Optional Onboarding Note' });
  await user.type(noteInput, 'Certified for artisanal greenery.');

  await user.click(screen.getByRole('button', { name: 'Approve Supplier' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: /Review Supplier: Fictional Leaf Nursery/ })).not.toBeInTheDocument());

  // Confirm supplier is now in approved tab
  await user.click(screen.getByRole('tab', { name: /Approved/ }));
  expect(screen.getByText('Fictional Leaf Nursery')).toBeVisible();
});

it('suspends a supplier with required reason via moderation modal', async () => {
  mount('/admin/suppliers'); const user = userEvent.setup();
  const reviewButtons = await screen.findAllByRole('button', { name: 'Review' });
  await user.click(reviewButtons[0]!); // Fictional Stem Studio

  await user.click(await screen.findByRole('button', { name: 'Suspend / Reject...' }));
  const reasonInput = screen.getByRole('textbox', { name: 'Reason for Suspension or Rejection' });

  // Try submitting blank
  await user.click(screen.getByRole('button', { name: 'Confirm Suspension / Rejection' }));
  expect(await screen.findByText('Reason for suspension or rejection is required.')).toBeVisible();

  await user.type(reasonInput, 'Temporary suspension for botanical audit.');
  await user.click(screen.getByRole('button', { name: 'Confirm Suspension / Rejection' }));

  await waitFor(() => expect(screen.queryByRole('heading', { name: /Review Supplier: Fictional Stem Studio/ })).not.toBeInTheDocument());
  await user.click(screen.getByRole('tab', { name: /Suspended/ }));
  expect(screen.getByText('Fictional Stem Studio')).toBeVisible();
});

it('moderates user role and account status via modal', async () => {
  mount('/admin/users'); const user = userEvent.setup();
  const moderateButtons = await screen.findAllByRole('button', { name: 'Moderate' });
  await user.click(moderateButtons[0]!); // Sample customer alias

  expect(await screen.findByRole('heading', { name: /Moderate User: Sample customer alias/ })).toBeVisible();
  const actorSelect = screen.getByRole('combobox', { name: 'Actor Role' });
  const statusSelect = screen.getByRole('combobox', { name: 'Account Status' });

  await user.selectOptions(actorSelect, 'Supplier');
  await user.selectOptions(statusSelect, 'suspended');

  await user.click(screen.getByRole('button', { name: 'Save User Changes' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: /Moderate User: Sample customer alias/ })).not.toBeInTheDocument());

  // Check that row reflects Suspended badge
  const suspendedBadges = await screen.findAllByText('Suspended');
  expect(suspendedBadges.length).toBeGreaterThan(0);
});

it('creates a new category using the table creation modal', async () => {
  mount('/admin/categories'); const user = userEvent.setup();
  await screen.findByText('Sample stems');

  await user.click(screen.getByRole('button', { name: 'New Category' }));
  expect(await screen.findByRole('heading', { name: 'Create New Category' })).toBeVisible();

  const nameInput = screen.getByRole('textbox', { name: 'Category Name' });
  await user.type(nameInput, 'Exotic Proteas');

  const descInput = screen.getByRole('textbox', { name: 'Description (optional)' });
  await user.type(descInput, 'Imported rare wild blooms.');

  await user.click(screen.getByRole('button', { name: 'Create Category' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Create New Category' })).not.toBeInTheDocument());

  expect(await screen.findByText('Exotic Proteas')).toBeVisible();
});

it('processes a refund decision with required justification', async () => {
  mount('/admin/refunds'); const user = userEvent.setup();
  const decisionBtns = await screen.findAllByRole('button', { name: 'Decision' });
  await user.click(decisionBtns[0]!);

  expect(await screen.findByRole('heading', { name: /Refund Decision: Fictional refund request/ })).toBeVisible();
  const justificationInput = screen.getByRole('textbox', { name: 'Decision Justification' });

  // Submit empty -> error
  await user.click(screen.getByRole('button', { name: 'Approve Refund Request' }));
  expect(await screen.findByText('Justification is required for refund decisions.')).toBeVisible();

  await user.type(justificationInput, 'Verified transit bloom wilting.');
  await user.click(screen.getByRole('button', { name: 'Approve Refund Request' }));

  await waitFor(() => expect(screen.queryByRole('heading', { name: /Refund Decision: Fictional refund request/ })).not.toBeInTheDocument());
  expect(await screen.findByText('Verified transit bloom wilting.')).toBeVisible();
});

it('moderates customer feedback visibility via dialog', async () => {
  mount('/admin/reviews'); const user = userEvent.setup();
  const moderateBtns = await screen.findAllByRole('button', { name: 'Moderate' });
  await user.click(moderateBtns[1]!); // Flagged store feedback

  expect(await screen.findByRole('heading', { name: /Moderate Feedback: Flagged store feedback/ })).toBeVisible();
  const statusSelect = screen.getByRole('combobox', { name: 'Moderation Visibility' });
  await user.selectOptions(statusSelect, 'hidden');

  const reasonInput = screen.getByRole('textbox', { name: 'Moderation Reason / Note' });
  await user.clear(reasonInput);
  await user.type(reasonInput, 'Suppressed as competitor promotional spam.');

  await user.click(screen.getByRole('button', { name: 'Save Moderation Decision' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: /Moderate Feedback: Flagged store feedback/ })).not.toBeInTheDocument());

  // Filter to Hidden tab and verify
  await user.click(screen.getByRole('tab', { name: /Hidden/ }));
  expect(screen.getByText('Flagged store feedback')).toBeVisible();
});

it('resets demo workspace back to default state via reset dialog', async () => {
  mount('/admin'); const user = userEvent.setup();
  const resetBtn = await screen.findByRole('button', { name: 'Reset Demo State' });
  await user.click(resetBtn);

  expect(await screen.findByRole('heading', { name: 'Reset Admin Workspace' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Confirm Reset Workspace' }));

  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Reset Admin Workspace' })).not.toBeInTheDocument());
  expect(screen.getByRole('heading', { name: 'Super admin workspace' })).toBeVisible();
});

it('traps keyboard focus inside open dialog and cycles with Tab and Shift+Tab', async () => {
  mount('/admin/categories'); const user = userEvent.setup();
  await screen.findByText('Sample stems');
  await user.click(screen.getByRole('button', { name: 'New Category' }));
  expect(await screen.findByRole('dialog')).toHaveAttribute('aria-modal', 'true');

  const dialog = screen.getByRole('dialog');
  const focusable = dialog.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
  );
  const first = focusable[0]!;
  const last = focusable[focusable.length - 1]!;

  // Focus the last element and press Tab -> should cycle to first
  last.focus();
  expect(document.activeElement).toBe(last);
  await user.tab();
  expect(document.activeElement).toBe(first);

  // Press Shift+Tab from first element -> should cycle to last
  await user.tab({ shift: true });
  expect(document.activeElement).toBe(last);
});

it('returns keyboard focus to trigger button when modal dialog is closed', async () => {
  mount('/admin/categories'); const user = userEvent.setup();
  await screen.findByText('Sample stems');
  const triggerBtn = screen.getByRole('button', { name: 'New Category' });
  await user.click(triggerBtn);

  expect(await screen.findByRole('heading', { name: 'Create New Category' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Close' }));

  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Create New Category' })).not.toBeInTheDocument());
  expect(triggerBtn).toHaveFocus();
});

it('opens oversight note dialog directly from row action and updates record note', async () => {
  mount('/admin/suppliers'); const user = userEvent.setup();
  await screen.findByText('Fictional Stem Studio');
  const addNoteBtns = screen.getAllByRole('button', { name: 'Add Note' });
  await user.click(addNoteBtns[0]!); // Fictional Stem Studio

  expect(await screen.findByRole('heading', { name: /Oversight Note: Fictional Stem Studio/ })).toBeVisible();
  const noteInput = screen.getByRole('textbox', { name: 'Sample oversight note' });
  await user.type(noteInput, 'Audited on-site organic practices.');

  await user.click(screen.getByRole('button', { name: 'Save sample oversight note' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: /Oversight Note: Fictional Stem Studio/ })).not.toBeInTheDocument());

  expect(await screen.findByText('Audited on-site organic practices.')).toBeVisible();
});

it('updates user display label and actor role via UserStatusDialog', async () => {
  mount('/admin/users'); const user = userEvent.setup();
  const moderateBtns = await screen.findAllByRole('button', { name: 'Moderate' });
  await user.click(moderateBtns[0]!); // Sample customer alias

  expect(await screen.findByRole('heading', { name: /Moderate User: Sample customer alias/ })).toBeVisible();
  const labelInput = screen.getByRole('textbox', { name: 'User Display Label' });
  await user.clear(labelInput);
  await user.type(labelInput, 'VIP Floral Buyer');

  await user.click(screen.getByRole('button', { name: 'Save User Changes' }));
  await waitFor(() => expect(screen.queryByRole('heading', { name: /Moderate User: Sample customer alias/ })).not.toBeInTheDocument());

  expect(await screen.findByText('VIP Floral Buyer')).toBeVisible();
});

it('displays dynamic count badges in the admin sidebar navigation', async () => {
  mount('/admin');
  expect(await screen.findByRole('heading', { name: 'Super admin workspace' })).toBeVisible();

  // Sidebar navigation link for Suppliers should have badge for 2 pending applications
  const suppliersNav = screen.getByRole('link', { name: /Suppliers/ });
  expect(suppliersNav).toBeVisible();
  expect(suppliersNav).toHaveTextContent('2');

  // Refund requests should have badge for 1 pending request
  const refundsNav = screen.getByRole('link', { name: /Refund requests/ });
  expect(refundsNav).toBeVisible();
  expect(refundsNav).toHaveTextContent('1');

  // Feedback should have badge for 1 flagged review
  const reviewsNav = screen.getByRole('link', { name: /Feedback/ });
  expect(reviewsNav).toBeVisible();
  expect(reviewsNav).toHaveTextContent('1');
});
