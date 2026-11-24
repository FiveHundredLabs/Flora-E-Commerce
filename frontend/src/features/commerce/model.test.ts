import { describe, expect, it } from 'vitest';
import { cartActions, createCartStore } from './cart';
import { createMockCommerceAdapter } from './api/mock';
import { checkoutKey, checkoutSchema, preferenceSchema, sampleQuantity, type CheckoutInput, type SampleOrder } from './model';

const alpha = { productSlug: 'a', storeSlug: 'alpha' };
const beta = { productSlug: 'b', storeSlug: 'beta' };
const input: CheckoutInput = { key: 'test-1', storeSlug: 'alpha', items: [{ ...alpha, quantity: 1, revision: 1 }], preference: { method: 'pickup' } };

describe('multi-store cart intent', () => {
  it('groups references without replacing another store and consumes only submitted lines', () => {
    const store = createCartStore();
    store.dispatch(cartActions.add(alpha)); store.dispatch(cartActions.add(beta)); store.dispatch(cartActions.add(alpha));
    expect(store.getState().cart.lines.map((line) => line.quantity)).toEqual([2, 1]);
    store.dispatch(cartActions.consume(store.getState().cart.lines.filter((line) => line.storeSlug === 'alpha')));
    expect(store.getState().cart.lines.map((line) => line.storeSlug)).toEqual(['beta']);
  });
  it('preserves changed and removed/re-added references during an outstanding checkout', () => {
    const store = createCartStore(); store.dispatch(cartActions.add(alpha));
    const snapshot = store.getState().cart.lines;
    store.dispatch(cartActions.add(alpha)); store.dispatch(cartActions.consume(snapshot));
    expect(store.getState().cart.lines[0]?.quantity).toBe(2);
    store.dispatch(cartActions.remove(alpha)); store.dispatch(cartActions.add(alpha)); store.dispatch(cartActions.consume(snapshot));
    expect(store.getState().cart.lines).toHaveLength(1);
  });
  it('rejects invalid quantities and caps the sample UI without inventing inventory', () => {
    const store = createCartStore(); store.dispatch(cartActions.add(alpha));
    const line = store.getState().cart.lines[0]; if (!line) throw new Error('Missing fixture');
    store.dispatch(cartActions.update({ ...line, quantity: 0 }));
    expect(store.getState().cart.lines[0]?.quantity).toBe(1);
    for (let index = 0; index < 105; index += 1) store.dispatch(cartActions.add(alpha));
    expect(store.getState().cart.lines[0]?.quantity).toBe(99);
    for (const value of ['', '-1', '1.5', '100', 'NaN']) expect(sampleQuantity.safeParse(value).success).toBe(false);
  });
});

it('validates store-scoped snapshots and provider preferences', () => {
  expect(checkoutSchema.safeParse({ ...input, items: [...input.items, { ...beta, quantity: 1, revision: 2 }] }).success).toBe(false);
  expect(preferenceSchema.safeParse({ method: 'delivery', provider: '' }).success).toBe(false);
  expect(preferenceSchema.safeParse({ method: 'delivery', provider: 'uber-connect' }).success).toBe(true);
  expect(checkoutKey(input.storeSlug, input.items, input.preference)).toBe(checkoutKey(input.storeSlug, [...input.items], input.preference));
});

it('deduplicates a mock placement, rejects conflicting reuse and never creates a payment', async () => {
  const service = createMockCommerceAdapter([]);
  const first = await service.place(input);
  expect(await service.place(input)).toEqual(first);
  expect(await service.orders()).toHaveLength(1);
  expect(first).toMatchObject({ paymentStatus: null, canReview: false, delivered: false });
  await expect(service.place({ ...input, preference: { method: 'delivery', provider: 'pickme' } })).rejects.toThrow();
});

it('accepts feedback only for a delivered capability-enabled sample order', async () => {
  const delivered: SampleOrder = { ...input, id: 'delivered', paymentStatus: 'successful', delivered: true, canReview: true, review: null };
  const service = createMockCommerceAdapter([delivered, { ...delivered, id: 'not-delivered', delivered: false }]);
  await expect(service.feedback({ orderId: 'not-delivered', comment: 'Sample' })).rejects.toThrow();
  await expect(service.feedback({ orderId: 'delivered', comment: ' ' })).rejects.toThrow();
  expect(await service.feedback({ orderId: 'delivered', comment: ' Sample feedback ' })).toMatchObject({ review: 'Sample feedback' });
});
