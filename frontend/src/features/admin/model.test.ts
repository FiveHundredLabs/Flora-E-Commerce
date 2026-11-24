import { expect, it } from 'vitest';
import { createMockAdminAdapter } from './api/mock';
import { workspaceSchema } from './model';

async function read(adapter: ReturnType<typeof createMockAdminAdapter>) {
  const value = workspaceSchema.parse(await adapter.read());
  if (value.access !== 'allowed') throw new Error('Missing sample workspace.');
  return value;
}

it('isolates fixture instances and returns detached snapshots', async () => {
  const first = createMockAdminAdapter();
  const other = createMockAdminAdapter();
  const snapshot = await read(first);
  const record = snapshot.records[0];
  if (!record) throw new Error('Missing fixture.');
  record.label = 'Local mutation';
  expect((await read(first)).records[0]?.label).toBe('Fictional Stem Studio');
  await first.execute({ type: 'rename', expectedRevision: 0, kind: 'suppliers', id: 'sample-studio', label: 'Edited fictional studio' });
  expect((await read(other)).records[0]?.label).toBe('Fictional Stem Studio');
});

it('creates, renames and removes a category while preserving order/refund/feedback records', async () => {
  const adapter = createMockAdminAdapter();
  const before = await read(adapter);
  await adapter.execute({ type: 'createCategory', expectedRevision: 0, label: 'Fictional category' });
  const created = (await read(adapter)).records.find((record) => record.label === 'Fictional category');
  if (!created) throw new Error('Missing created category.');
  await adapter.execute({ type: 'rename', expectedRevision: 1, kind: 'categories', id: created.id, label: 'Renamed sample category' });
  await adapter.execute({ type: 'removeCategory', expectedRevision: 2, id: created.id });
  expect((await read(adapter)).records).toEqual(before.records);
});

it('targets the selected user label and rejects stale writes atomically', async () => {
  const adapter = createMockAdminAdapter();
  await adapter.execute({ type: 'rename', expectedRevision: 0, kind: 'users', id: 'sample-customer', label: 'Edited sample alias' });
  await expect(adapter.execute({ type: 'rename', expectedRevision: 0, kind: 'suppliers', id: 'sample-studio', label: 'Stale change' })).rejects.toThrow();
  const snapshot = await read(adapter);
  expect(snapshot.revision).toBe(1);
  expect(snapshot.records.find((record) => record.kind === 'users' && record.id === 'sample-customer')?.label).toBe('Edited sample alias');
  expect(snapshot.records.find((record) => record.kind === 'suppliers' && record.id === 'sample-studio')?.label).toBe('Fictional Stem Studio');
});

it.each([
  ['suppliers', 'sample-studio'],
  ['users', 'sample-customer'],
  ['orders', 'sample-order'],
  ['refunds', 'sample-request'],
  ['reviews', 'sample-feedback'],
] as const)('records a %s note without altering operational fields', async (kind, id) => {
  const adapter = createMockAdminAdapter();
  const before = await read(adapter);
  await adapter.execute({ type: 'annotate', expectedRevision: 0, kind, id, note: 'Fictional oversight note' });
  const after = await read(adapter);
  expect(after.records).toEqual(before.records.map((record) => record.kind === kind && record.id === id ? { ...record, note: 'Fictional oversight note' } : record));
});

it('enforces mock capabilities, denied access and known references', async () => {
  const adapter = createMockAdminAdapter();
  await expect(adapter.execute({ type: 'removeCategory', expectedRevision: 0, id: 'sample-plants' })).rejects.toThrow();
  await expect(adapter.execute({ type: 'rename', expectedRevision: 0, kind: 'users', id: 'sample-supplier-user', label: 'Sample' })).rejects.toThrow();
  await expect(adapter.execute({ type: 'annotate', expectedRevision: 0, kind: 'suppliers', id: 'sample-nursery', note: 'Sample' })).rejects.toThrow();
  await expect(adapter.execute({ type: 'removeCategory', expectedRevision: 0, id: 'missing' })).rejects.toThrow();
  await expect(createMockAdminAdapter({ access: 'forbidden' }).execute({ type: 'createCategory', expectedRevision: 0, label: 'Sample' })).rejects.toThrow();
  expect((await read(adapter)).revision).toBe(0);
});

it('rejects duplicate/broken references, unsupported payment examples and invalid text', async () => {
  const adapter = createMockAdminAdapter();
  const before = await read(adapter);
  const first = before.records[0];
  if (!first) throw new Error('Missing fixture.');
  expect(workspaceSchema.safeParse({ ...before, records: [...before.records, first] }).success).toBe(false);
  expect(workspaceSchema.safeParse({ ...before, records: before.records.filter((record) => record.kind !== 'orders') }).success).toBe(false);
  expect(workspaceSchema.safeParse({ ...before, records: before.records.map((record) => record.kind === 'orders' ? { ...record, paymentExample: 'invented-state' } : record) }).success).toBe(false);
  for (const label of ['', ' ', 'x'.repeat(101)]) {
    await expect(adapter.execute({ type: 'createCategory', expectedRevision: 0, label })).rejects.toThrow();
  }
  await expect(adapter.execute({ type: 'annotate', expectedRevision: 0, kind: 'refunds', id: 'sample-request', note: 'x'.repeat(1001) })).rejects.toThrow();
  expect((await read(adapter)).revision).toBe(0);
});

it('approves a pending supplier and logs an onboarding note', async () => {
  const adapter = createMockAdminAdapter();
  await adapter.execute({
    type: 'approveSupplier',
    expectedRevision: 0,
    id: 'sample-nursery',
    note: 'Approved for botanical foliage distribution.',
  });
  const snapshot = await read(adapter);
  const supplier = snapshot.records.find((r) => r.kind === 'suppliers' && r.id === 'sample-nursery');
  if (supplier?.kind !== 'suppliers') throw new Error('Missing supplier');
  expect(supplier.status).toBe('approved');
  expect(supplier.note).toBe('Approved for botanical foliage distribution.');
  expect(snapshot.revision).toBe(1);
});

it('suspends/rejects a supplier with required reason and rejects empty reasons', async () => {
  const adapter = createMockAdminAdapter();
  await expect(adapter.execute({
    type: 'rejectSupplier',
    expectedRevision: 0,
    id: 'sample-studio',
    reason: '   ',
  })).rejects.toThrow();

  await adapter.execute({
    type: 'rejectSupplier',
    expectedRevision: 0,
    id: 'sample-studio',
    reason: 'Requires greenhouse safety re-certification.',
  });
  const snapshot = await read(adapter);
  const supplier = snapshot.records.find((r) => r.kind === 'suppliers' && r.id === 'sample-studio');
  if (supplier?.kind !== 'suppliers') throw new Error('Missing supplier');
  expect(supplier.status).toBe('suspended');
  expect(supplier.note).toBe('Requires greenhouse safety re-certification.');
});

it('toggles user status and actor role atomically', async () => {
  const adapter = createMockAdminAdapter();
  await adapter.execute({
    type: 'toggleUserStatus',
    expectedRevision: 0,
    id: 'sample-customer',
    actor: 'Supplier',
    status: 'suspended',
    reason: 'Account verification in progress.',
  });
  const snapshot = await read(adapter);
  const user = snapshot.records.find((r) => r.kind === 'users' && r.id === 'sample-customer');
  if (user?.kind !== 'users') throw new Error('Missing user');
  expect(user.actor).toBe('Supplier');
  expect(user.status).toBe('suspended');
  expect(user.note).toBe('Account verification in progress.');
});

it('updates user label along with status when user canRename is true', async () => {
  const adapter = createMockAdminAdapter();
  await adapter.execute({
    type: 'toggleUserStatus',
    expectedRevision: 0,
    id: 'sample-customer',
    actor: 'Customer',
    status: 'active',
    label: 'Updated Customer Alias',
  });
  const snapshot = await read(adapter);
  const user = snapshot.records.find((r) => r.kind === 'users' && r.id === 'sample-customer');
  if (user?.kind !== 'users') throw new Error('Missing user');
  expect(user.label).toBe('Updated Customer Alias');
});

it('updates category metadata including slug and description', async () => {
  const adapter = createMockAdminAdapter();
  await adapter.execute({
    type: 'updateCategory',
    expectedRevision: 0,
    id: 'sample-stems',
    label: 'Artisanal Fresh Stems',
    slug: 'artisanal-stems',
    description: 'Hand-picked daily from certified local nurseries.',
  });
  const snapshot = await read(adapter);
  const cat = snapshot.records.find((r) => r.kind === 'categories' && r.id === 'sample-stems');
  if (cat?.kind !== 'categories') throw new Error('Missing category');
  expect(cat.label).toBe('Artisanal Fresh Stems');
  expect(cat.slug).toBe('artisanal-stems');
  expect(cat.description).toBe('Hand-picked daily from certified local nurseries.');
});

it('processes refund decisions with mandatory justification', async () => {
  const adapter = createMockAdminAdapter();
  await expect(adapter.execute({
    type: 'processRefund',
    expectedRevision: 0,
    id: 'sample-request',
    decision: 'approved',
    justification: '',
  })).rejects.toThrow();

  await adapter.execute({
    type: 'processRefund',
    expectedRevision: 0,
    id: 'sample-request',
    decision: 'approved',
    justification: 'Photographic evidence verified by floral concierge.',
  });
  const snapshot = await read(adapter);
  const refund = snapshot.records.find((r) => r.kind === 'refunds' && r.id === 'sample-request');
  if (refund?.kind !== 'refunds') throw new Error('Missing refund');
  expect(refund.status).toBe('approved');
  expect(refund.decisionReason).toBe('Photographic evidence verified by floral concierge.');
});

it('moderates customer review visibility and records moderation reasons', async () => {
  const adapter = createMockAdminAdapter();
  await adapter.execute({
    type: 'moderateReview',
    expectedRevision: 0,
    id: 'sample-review-flagged',
    status: 'hidden',
    reason: 'Suppressed pending review of transit temperature log.',
  });
  const snapshot = await read(adapter);
  const review = snapshot.records.find((r) => r.kind === 'reviews' && r.id === 'sample-review-flagged');
  if (review?.kind !== 'reviews') throw new Error('Missing review');
  expect(review.status).toBe('hidden');
  expect(review.moderationReason).toBe('Suppressed pending review of transit temperature log.');
});

it('flags orders with custom status and oversight notes', async () => {
  const adapter = createMockAdminAdapter();
  await adapter.execute({
    type: 'flagOrder',
    expectedRevision: 0,
    id: 'sample-order',
    status: 'flagged',
    note: 'Administrative hold placed pending recipient address confirmation.',
  });
  const snapshot = await read(adapter);
  const order = snapshot.records.find((r) => r.kind === 'orders' && r.id === 'sample-order');
  if (order?.kind !== 'orders') throw new Error('Missing order');
  expect(order.status).toBe('flagged');
  expect(order.note).toBe('Administrative hold placed pending recipient address confirmation.');
});

it('resets workspace back to initial seed data', async () => {
  const adapter = createMockAdminAdapter();
  const initial = await read(adapter);
  await adapter.execute({
    type: 'createCategory',
    expectedRevision: 0,
    label: 'Temporary Category',
  });
  expect((await read(adapter)).records.length).toBe(initial.records.length + 1);

  await adapter.execute({
    type: 'resetWorkspace',
    expectedRevision: 1,
  });
  const afterReset = await read(adapter);
  expect(afterReset.records).toEqual(initial.records);
  expect(afterReset.revision).toBe(2);
});

it('honors initial read cancellation', async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(createMockAdminAdapter().read(controller.signal)).rejects.toThrow();
});
