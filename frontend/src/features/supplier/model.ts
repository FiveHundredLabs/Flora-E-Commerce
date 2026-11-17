import { z } from 'zod';

// Provisional demo validation only; these are not backend DTOs or publication rules.
export const sampleId = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);
const name = z.string().trim().min(1, 'Enter a sample name.').max(100, 'Use 100 characters or fewer.');
export const profileInput = z.object({ name, description: z.string().trim().max(1000, 'Use 1,000 characters or fewer.') });
export const productInput = profileInput;
const stockMessage = 'Enter a whole sample count from 0 to 9,999.';
export const stockValue = z.number({ error: stockMessage }).int(stockMessage).min(0, stockMessage).max(9999, stockMessage);
export const variantInput = z.object({ name, stock: stockValue });
export const noteInput = z.object({ note: z.string().trim().min(1, 'Enter a sample fulfilment note.').max(1000, 'Use 1,000 characters or fewer.') });
const variantSchema = variantInput.extend({ id: sampleId });
const productSchema = productInput.extend({ id: sampleId, variants: z.array(variantSchema) })
  .refine((product) => new Set(product.variants.map((variant) => variant.id)).size === product.variants.length);
const orderSchema = z.object({
  id: sampleId, items: z.array(z.object({ name, quantity: z.number().int().min(1).max(9999) })).min(1),
  fulfilment: z.enum(['Store pickup', 'Delivery preference']), note: z.string().max(1000), canRecordNote: z.boolean(),
});
export const workspaceSchema = z.discriminatedUnion('access', [
  z.object({ access: z.literal('forbidden') }),
  z.object({ access: z.literal('allowed'), revision: z.number().int().nonnegative(),
    registration: profileInput.nullable(), profile: profileInput,
    products: z.array(productSchema), orders: z.array(orderSchema),
  }).refine((data) => new Set(data.products.map((product) => product.id)).size === data.products.length
    && new Set(data.orders.map((order) => order.id)).size === data.orders.length),
]);
const version = { expectedRevision: z.number().int().nonnegative() };
export const commandSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('register'), ...version, data: profileInput }),
  z.object({ type: z.literal('profile'), ...version, data: profileInput }),
  z.object({ type: z.literal('createProduct'), ...version, data: productInput }),
  z.object({ type: z.literal('editProduct'), ...version, productId: sampleId, data: productInput }),
  z.object({ type: z.literal('removeProduct'), ...version, productId: sampleId }),
  z.object({ type: z.literal('addVariant'), ...version, productId: sampleId, data: variantInput }),
  z.object({ type: z.literal('editVariant'), ...version, productId: sampleId, variantId: sampleId, data: variantInput }),
  z.object({ type: z.literal('removeVariant'), ...version, productId: sampleId, variantId: sampleId }),
  z.object({ type: z.literal('stock'), ...version, productId: sampleId, variantId: sampleId, stock: stockValue }),
  z.object({ type: z.literal('fulfilmentNote'), ...version, orderId: sampleId, data: noteInput }),
]);
export type SupplierWorkspace = z.infer<typeof workspaceSchema>;
export type AllowedWorkspace = Extract<SupplierWorkspace, { access: 'allowed' }>;
export type SupplierProduct = AllowedWorkspace['products'][number];
export type SupplierCommand = z.infer<typeof commandSchema>;
export type ProfileInput = z.infer<typeof profileInput>;
export type VariantInput = z.infer<typeof variantInput>;
