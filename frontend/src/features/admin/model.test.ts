import { expect, it } from 'vitest';
import { createMockAdminAdapter } from './api/mock';
import { workspaceSchema } from './model';

async function read(adapter: ReturnType<typeof createMockAdminAdapter>) {
  const value = workspaceSchema.parse(await adapter.read());
  if (value.access !== 'allowed') throw new Error('Missing sample workspace.'); return value;
}
it('isolates fixture instances and returns detached snapshots', async () => {
  const first = createMockAdminAdapter(); const other = createMockAdminAdapter(); const snapshot = await read(first);
  const record = snapshot.records[0]; if (!record) throw new Error('Missing fixture.'); record.label = 'Local mutation';
  expect((await read(first)).records[0]?.label).toBe('Fictional Stem Studio');
  await first.execute({ type: 'rename', expectedRevision: 0, kind: 'suppliers', id: 'sample-studio', label: 'Edited fictional studio' });
  expect((await read(other)).records[0]?.label).toBe('Fictional Stem Studio');
});
it('creates, renames and removes a category while preserving order/refund/feedback records', async () => {
  const adapter = createMockAdminAdapter(); const before = await read(adapter);
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
  expect(snapshot.revision).toBe(1); expect(snapshot.records.find((record) => record.kind === 'users' && record.id === 'sample-customer')?.label).toBe('Edited sample alias');
  expect(snapshot.records.find((record) => record.kind === 'suppliers' && record.id === 'sample-studio')?.label).toBe('Fictional Stem Studio');
});
it.each([
  ['suppliers', 'sample-studio'], ['users', 'sample-customer'], ['orders', 'sample-order'], ['refunds', 'sample-request'], ['reviews', 'sample-feedback'],
] as const)('records a %s note without altering operational fields', async (kind, id) => {
  const adapter = createMockAdminAdapter(); const before = await read(adapter);
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
  const adapter = createMockAdminAdapter(); const before = await read(adapter); const first = before.records[0];
  if (!first) throw new Error('Missing fixture.');
  expect(workspaceSchema.safeParse({ ...before, records: [...before.records, first] }).success).toBe(false);
  expect(workspaceSchema.safeParse({ ...before, records: before.records.filter((record) => record.kind !== 'orders') }).success).toBe(false);
  expect(workspaceSchema.safeParse({ ...before, records: before.records.map((record) => record.kind === 'orders' ? { ...record, paymentExample: 'invented-state' } : record) }).success).toBe(false);
  for (const label of ['', ' ', 'x'.repeat(101)]) await expect(adapter.execute({ type: 'createCategory', expectedRevision: 0, label })).rejects.toThrow();
  await expect(adapter.execute({ type: 'annotate', expectedRevision: 0, kind: 'refunds', id: 'sample-request', note: 'x'.repeat(1001) })).rejects.toThrow();
  expect((await read(adapter)).revision).toBe(0);
});
it('honors initial read cancellation', async () => {
  const controller = new AbortController(); controller.abort(); await expect(createMockAdminAdapter().read(controller.signal)).rejects.toThrow();
});
