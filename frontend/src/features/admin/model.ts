import { z } from 'zod';

// Local fictional vocabulary only. No backend DTOs, approval/refund transitions or permissions are inferred.
export const recordKind = z.enum(['suppliers', 'users', 'categories', 'orders', 'refunds', 'reviews']);
export type AdminSection = z.infer<typeof recordKind>;
export const sampleId = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);
export const labelInput = z.string().trim().min(1, 'Enter a sample label.').max(100, 'Use 100 characters or fewer.');
export const noteInput = z.string().trim().min(1, 'Enter a sample oversight note.').max(1000, 'Use 1,000 characters or fewer.');
const annotated = { id: sampleId, label: labelInput, note: z.string().max(1000), canAnnotate: z.boolean() };
export const recordSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('suppliers'), ...annotated, application: z.string().max(1000), canRename: z.boolean() }),
  z.object({ kind: z.literal('users'), ...annotated, actor: z.enum(['Customer', 'Supplier']), canRename: z.boolean() }),
  z.object({ kind: z.literal('categories'), id: sampleId, label: labelInput, canRename: z.boolean(), canRemove: z.boolean() }),
  z.object({ kind: z.literal('orders'), ...annotated, supplierId: sampleId, userId: sampleId,
    items: z.array(z.object({ label: labelInput, quantity: z.number().int().min(1).max(9999) })).min(1),
    // Client PDF example labels only; these are not PayHere mappings or approved state transitions.
    paymentExample: z.enum(['pending', 'successful', 'failed', 'refunded']).nullable(),
  }),
  z.object({ kind: z.literal('refunds'), ...annotated, orderId: sampleId, reason: z.string().max(1000) }),
  z.object({ kind: z.literal('reviews'), ...annotated, orderId: sampleId, supplierId: sampleId, comment: z.string().max(1000) }),
]);
export type AdminRecord = z.infer<typeof recordSchema>;
export const workspaceSchema = z.discriminatedUnion('access', [
  z.object({ access: z.literal('forbidden') }),
  z.object({ access: z.literal('allowed'), revision: z.number().int().nonnegative(), records: z.array(recordSchema) })
    .refine(({ records }) => {
      const keys = new Set(records.map((record) => `${record.kind}:${record.id}`));
      return keys.size === records.length && records.every((record) => {
        if (record.kind === 'orders') return keys.has(`suppliers:${record.supplierId}`) && keys.has(`users:${record.userId}`);
        if (record.kind === 'refunds') return keys.has(`orders:${record.orderId}`);
        if (record.kind === 'reviews') {
          const order = records.find((item) => item.kind === 'orders' && item.id === record.orderId);
          return order?.kind === 'orders' && order.supplierId === record.supplierId;
        }
        return true;
      });
    }, 'Unreliable sample record references.'),
]);
export type AdminWorkspace = z.infer<typeof workspaceSchema>;
export type AllowedWorkspace = Extract<AdminWorkspace, { access: 'allowed' }>;
const version = { expectedRevision: z.number().int().nonnegative() };
export const commandSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('createCategory'), ...version, label: labelInput }),
  z.object({ type: z.literal('rename'), ...version, kind: z.enum(['suppliers', 'users', 'categories']), id: sampleId, label: labelInput }),
  z.object({ type: z.literal('removeCategory'), ...version, id: sampleId }),
  z.object({ type: z.literal('annotate'), ...version, kind: z.enum(['suppliers', 'users', 'orders', 'refunds', 'reviews']), id: sampleId, note: noteInput }),
]);
export type AdminCommand = z.infer<typeof commandSchema>;
export const sectionLabels: Record<AdminSection, string> = { suppliers: 'Suppliers', users: 'Users', categories: 'Categories', orders: 'Orders', refunds: 'Refund requests', reviews: 'Feedback' };
