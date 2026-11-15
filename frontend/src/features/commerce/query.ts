import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkoutSchema, feedbackSchema, orderListSchema, orderSchema, type CheckoutInput } from './model';
import { mockCommerceAdapter, type CommerceAdapter } from './api/mock';
import { cartActions, useCartDispatch } from './cart';

export const orderKey = (adapter: CommerceAdapter) => ['MOCK', 'commerce', adapter.key, 'orders'] as const;
export function useOrders(adapter: CommerceAdapter = mockCommerceAdapter) {
  return useQuery({ queryKey: orderKey(adapter), queryFn: async ({ signal }) => {
    const result = await adapter.orders(signal);
    signal.throwIfAborted();
    return orderListSchema.parse(result);
  } });
}
export function usePlaceOrder(adapter: CommerceAdapter = mockCommerceAdapter) {
  const client = useQueryClient();
  const dispatch = useCartDispatch();
  return useMutation({ retry: false, mutationFn: async (input: CheckoutInput) => {
    const command = checkoutSchema.parse(input);
    const order = orderSchema.parse(await adapter.place(command));
    const snapshot = (items: typeof order.items) => JSON.stringify([...items].sort((a, b) => a.productSlug.localeCompare(b.productSlug)));
    if (order.storeSlug !== command.storeSlug || snapshot(order.items) !== snapshot(command.items)
      || JSON.stringify(order.preference) !== JSON.stringify(command.preference)) throw new Error('Mismatched sample receipt.');
    return order;
  },
    onSuccess: (_order, input) => { dispatch(cartActions.consume(input.items)); void client.invalidateQueries({ queryKey: orderKey(adapter) }); } });
}
export function useFeedback(adapter: CommerceAdapter = mockCommerceAdapter) {
  const client = useQueryClient();
  return useMutation({ retry: false, mutationFn: async (input: { orderId: string; comment: string }) => {
    const command = feedbackSchema.parse(input);
    const order = orderSchema.parse(await adapter.feedback(command));
    if (order.id !== command.orderId || order.review !== command.comment) throw new Error('Mismatched sample feedback receipt.');
    return order;
  },
    onSuccess: () => { void client.invalidateQueries({ queryKey: orderKey(adapter) }); } });
}
