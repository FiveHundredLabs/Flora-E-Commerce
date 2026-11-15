import { checkoutSchema, feedbackSchema, orderSchema, type CheckoutInput, type SampleOrder } from '../model';

export interface CommerceAdapter {
  key: string;
  orders: (signal?: AbortSignal) => Promise<unknown>;
  place: (input: CheckoutInput) => Promise<unknown>;
  feedback: (input: { orderId: string; comment: string }) => Promise<unknown>;
}
const seed: SampleOrder[] = [{
  id: 'sample-delivered', storeSlug: 'fern-house', items: [{ productSlug: 'little-fern', storeSlug: 'fern-house', quantity: 1, revision: 1 }],
  preference: { method: 'pickup' }, paymentStatus: 'successful', delivered: true, canReview: true, review: null,
}];

/** In-memory demo service only. Reload resets orders/feedback. No money, PII or provider calls. */
export function createMockCommerceAdapter(initial: SampleOrder[] = seed): CommerceAdapter {
  const records = initial.map((order) => orderSchema.parse(order));
  const placed = new Map<string, { order: SampleOrder; signature: string }>();
  let sequence = 1;
  return {
    key: 'sample-commerce-v1',
    async orders(signal) {
      signal?.throwIfAborted();
      await Promise.resolve();
      signal?.throwIfAborted();
      return records.map((order) => orderSchema.parse(order));
    },
    async place(input) {
      const command = checkoutSchema.parse(input);
      await Promise.resolve();
      const signature = JSON.stringify({ storeSlug: command.storeSlug, items: [...command.items].sort((a, b) => a.productSlug.localeCompare(b.productSlug)), preference: command.preference });
      const previous = placed.get(command.key);
      if (previous) {
        if (previous.signature !== signature) throw new Error('Sample request key was reused with different content.');
        return orderSchema.parse(previous.order);
      }
      let id = `sample-${sequence++}`;
      while (records.some((record) => record.id === id)) id = `sample-${sequence++}`;
      const order = orderSchema.parse({ id, storeSlug: command.storeSlug, items: command.items, preference: command.preference,
        paymentStatus: null, delivered: false, canReview: false, review: null });
      records.unshift(order);
      placed.set(command.key, { order, signature });
      return orderSchema.parse(order);
    },
    async feedback(input) {
      const command = feedbackSchema.parse(input);
      const order = records.find((record) => record.id === command.orderId);
      if (!order?.canReview || !order.delivered) throw new Error('Sample feedback is unavailable.');
      await Promise.resolve();
      order.review = command.comment;
      return orderSchema.parse(order);
    },
  };
}
export const mockCommerceAdapter = createMockCommerceAdapter();
