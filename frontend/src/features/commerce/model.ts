import { z } from 'zod';

export const sampleSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const sampleQuantity = z.coerce.number().int().min(1).max(99);
export const cartRefSchema = z.object({ productSlug: sampleSlug, storeSlug: sampleSlug });
export const lineSchema = cartRefSchema.extend({ quantity: z.number().int().min(1).max(99), revision: z.number().int().positive() });
export type CartLine = z.infer<typeof lineSchema>;
export const preferenceSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('pickup') }),
  z.object({ method: z.literal('delivery'), provider: z.enum(['pickme', 'uber-connect']) }),
]);
export const checkoutSchema = z.object({
  key: z.string().min(1), storeSlug: sampleSlug, items: z.array(lineSchema).min(1), preference: preferenceSchema,
}).refine((input) => input.items.every((item) => item.storeSlug === input.storeSlug), 'Checkout must contain one store only.')
  .refine((input) => new Set(input.items.map((item) => item.productSlug)).size === input.items.length, 'Duplicate sample item.');
export type CheckoutInput = z.infer<typeof checkoutSchema>;
// Only the illustrative labels named by the client PDF p3; no gateway state mapping.
export const paymentExample = z.enum(['pending', 'successful', 'failed', 'refunded']);
export const orderSchema = z.object({
  id: sampleSlug, storeSlug: sampleSlug, items: z.array(lineSchema).min(1), preference: preferenceSchema,
  paymentStatus: paymentExample.nullable(), delivered: z.boolean(), canReview: z.boolean(), review: z.string().max(1000).nullable(),
}).refine((order) => order.items.every((item) => item.storeSlug === order.storeSlug), 'Mixed sample order.');
export const orderListSchema = z.array(orderSchema).refine((orders) => new Set(orders.map((order) => order.id)).size === orders.length, 'Duplicate sample order reference.');
export type SampleOrder = z.infer<typeof orderSchema>;
export const feedbackSchema = z.object({ orderId: sampleSlug, comment: z.string().trim().min(1, 'Enter sample feedback.').max(1000, 'Use 1,000 characters or fewer.') });

/** Presentation supplied by page composition; commerce never imports discovery internals. */
export type CommerceCatalog = {
  stores: readonly { slug: string; name: string }[];
  products: readonly { slug: string; storeSlug: string; name: string }[];
};

export function checkoutKey(storeSlug: string, items: CartLine[], preference: CheckoutInput['preference']) {
  return JSON.stringify({ storeSlug, items: [...items].sort((a, b) => a.productSlug.localeCompare(b.productSlug)), preference });
}

export function validCartLine(line: CartLine, catalog: CommerceCatalog) {
  return catalog.stores.some((store) => store.slug === line.storeSlug)
    && catalog.products.some((product) => product.slug === line.productSlug && product.storeSlug === line.storeSlug);
}
