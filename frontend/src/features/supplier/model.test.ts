import { describe, expect, it } from 'vitest';
import { createMockSupplierAdapter } from './api/mock';
import { workspaceSchema } from './model';

async function read(adapter: ReturnType<typeof createMockSupplierAdapter>) {
  const data = workspaceSchema.parse(await adapter.read());
  if (data.access !== 'allowed') throw new Error('Expected sample workspace.');
  return data;
}
describe('supplier sample service boundaries', () => {
  it('keeps registration separate from profile, other instances and publication', async () => {
    const first = createMockSupplierAdapter(); const other = createMockSupplierAdapter();
    await first.execute({ type: 'register', expectedRevision: 0, data: { name: 'Fictional Applicant', description: '' } });
    expect((await read(first)).registration?.name).toBe('Fictional Applicant');
    expect((await read(first)).profile.name).toBe('Meadow Studio');
    expect((await read(other)).registration).toBeNull();
  });
  it('creates, edits and removes products without rewriting historical sample order lines', async () => {
    const adapter = createMockSupplierAdapter();
    await adapter.execute({ type: 'createProduct', expectedRevision: 0, data: { name: 'New Sample', description: '' } });
    const created = (await read(adapter)).products.find((product) => product.name === 'New Sample');
    expect(created?.variants).toEqual([]);
    await adapter.execute({ type: 'editProduct', expectedRevision: 1, productId: 'sample-posy', data: { name: 'Edited Sample', description: '' } });
    await adapter.execute({ type: 'removeProduct', expectedRevision: 2, productId: 'sample-posy' });
    const data = await read(adapter);
    expect(data.products).toHaveLength(1); expect(data.orders[0]?.items[0]?.name).toBe('Sample Posy — Standard');
  });
  it('supports variants and stock with stale-write rejection and no partial commit', async () => {
    const adapter = createMockSupplierAdapter();
    await adapter.execute({ type: 'addVariant', expectedRevision: 0, productId: 'sample-posy', data: { name: 'Mini', stock: 2 } });
    const variant = (await read(adapter)).products[0]?.variants.find((item) => item.name === 'Mini');
    if (!variant) throw new Error('Missing created variant.');
    await adapter.execute({ type: 'editVariant', expectedRevision: 1, productId: 'sample-posy', variantId: variant.id, data: { name: 'Tiny', stock: 5 } });
    await adapter.execute({ type: 'stock', expectedRevision: 2, productId: 'sample-posy', variantId: variant.id, stock: 0 });
    await expect(adapter.execute({ type: 'stock', expectedRevision: 2, productId: 'sample-posy', variantId: variant.id, stock: 8 })).rejects.toThrow();
    expect((await read(adapter)).products[0]?.variants.find((item) => item.id === variant.id)?.stock).toBe(0);
    await adapter.execute({ type: 'removeVariant', expectedRevision: 3, productId: 'sample-posy', variantId: variant.id });
    expect((await read(adapter)).products[0]?.variants).toHaveLength(2);
  });
  it('rejects invalid counts and unknown references atomically', async () => {
    const adapter = createMockSupplierAdapter();
    for (const stock of [-1, 1.5, 10000, NaN]) await expect(adapter.execute({ type: 'stock', expectedRevision: 0, productId: 'sample-posy', variantId: 'standard', stock })).rejects.toThrow();
    await expect(adapter.execute({ type: 'removeProduct', expectedRevision: 0, productId: 'missing' })).rejects.toThrow();
    expect((await read(adapter)).revision).toBe(0);
  });
  it('enforces mock access and note capability without changing fulfilment or quantities', async () => {
    const denied = createMockSupplierAdapter({ access: 'forbidden' });
    await expect(denied.execute({ type: 'profile', expectedRevision: 0, data: { name: 'Sample', description: '' } })).rejects.toThrow();
    const adapter = createMockSupplierAdapter(); const before = await read(adapter);
    await expect(adapter.execute({ type: 'fulfilmentNote', expectedRevision: 0, orderId: 'sample-order-two', data: { note: 'Sample' } })).rejects.toThrow();
    await adapter.execute({ type: 'fulfilmentNote', expectedRevision: 0, orderId: 'sample-order-one', data: { note: 'Fictional preparation note' } });
    const after = await read(adapter);
    expect(after.orders[0]).toEqual({ ...before.orders[0], note: 'Fictional preparation note' });
    expect(after.products).toEqual(before.products);
  });
  it('clones service reads and rejects duplicate entity IDs', async () => {
    const adapter = createMockSupplierAdapter(); const data = await read(adapter);
    const product = data.products[0]; const variant = product?.variants[0];
    if (!product || !variant) throw new Error('Missing seed product/variant.');
    variant.stock = 999;
    expect((await read(adapter)).products[0]?.variants[0]?.stock).toBe(8);
    expect(workspaceSchema.safeParse({ ...data, products: [product, product] }).success).toBe(false);
    expect(workspaceSchema.safeParse({ ...data, products: [{ ...product, variants: [variant, variant] }] }).success).toBe(false);
  });
  it('honors read cancellation', async () => {
    const controller = new AbortController(); controller.abort();
    await expect(createMockSupplierAdapter().read(controller.signal)).rejects.toThrow();
  });
});
