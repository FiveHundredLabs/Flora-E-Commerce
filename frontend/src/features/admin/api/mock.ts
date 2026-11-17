import { commandSchema, workspaceSchema, type AdminCommand, type AdminWorkspace } from '../model';

export interface AdminAdapter {
  key: string;
  read: (signal?: AbortSignal) => Promise<unknown>;
  execute: (command: AdminCommand) => Promise<unknown>;
}
const seed: AdminWorkspace = { access: 'allowed', revision: 0, records: [
  { kind: 'suppliers', id: 'sample-studio', label: 'Fictional Stem Studio', application: 'Fictional seasonal floral supplier application.', note: '', canAnnotate: true, canRename: true },
  { kind: 'suppliers', id: 'sample-nursery', label: 'Fictional Leaf Nursery', application: 'Read-only supplier fixture.', note: '', canAnnotate: false, canRename: false },
  { kind: 'users', id: 'sample-customer', label: 'Sample customer alias', actor: 'Customer', note: '', canAnnotate: true, canRename: true },
  { kind: 'users', id: 'sample-supplier-user', label: 'Sample supplier alias', actor: 'Supplier', note: '', canAnnotate: false, canRename: false },
  { kind: 'categories', id: 'sample-stems', label: 'Sample stems', canRename: true, canRemove: true },
  { kind: 'categories', id: 'sample-plants', label: 'Sample plants', canRename: false, canRemove: false },
  { kind: 'orders', id: 'sample-order', label: 'Fictional Posy Order', supplierId: 'sample-studio', userId: 'sample-customer', items: [{ label: 'Fictional Posy', quantity: 2 }], paymentExample: null, note: '', canAnnotate: true },
  { kind: 'refunds', id: 'sample-request', label: 'Fictional refund request', orderId: 'sample-order', reason: 'Fictional request supplied for oversight review only.', note: '', canAnnotate: true },
  { kind: 'reviews', id: 'sample-feedback', label: 'Fictional store feedback', orderId: 'sample-order', supplierId: 'sample-studio', comment: 'This is fictional feedback for exploring oversight.', note: '', canAnnotate: true },
] };

/** Private fixture instance, not an HTTP contract, account directory or audit log. */
export function createMockAdminAdapter(initial: AdminWorkspace = seed): AdminAdapter {
  let state = workspaceSchema.parse(initial); let sequence = 0;
  return { key: crypto.randomUUID(),
    async read(signal) { signal?.throwIfAborted(); return structuredClone(state); },
    async execute(input) {
      const command = commandSchema.parse(input);
      if (state.access !== 'allowed' || state.revision !== command.expectedRevision) throw new Error('Sample edit unavailable.');
      const next = structuredClone(state);
      if (command.type === 'createCategory') {
        let id: string;
        do { id = `sample-category-${++sequence}`; } while (next.records.some((record) => record.kind === 'categories' && record.id === id));
        next.records.push({ kind: 'categories', id, label: command.label, canRename: true, canRemove: true });
      } else {
        const kind = command.type === 'removeCategory' ? 'categories' : command.kind;
        const record = next.records.find((item) => item.kind === kind && item.id === command.id);
        if (!record) throw new Error('Sample record unavailable.');
        if (command.type === 'removeCategory') {
          if (record.kind !== 'categories' || !record.canRemove) throw new Error('Sample action unavailable.');
          next.records = next.records.filter((item) => item !== record);
        } else if (command.type === 'rename') {
          if (!('canRename' in record) || !record.canRename) throw new Error('Sample action unavailable.');
          record.label = command.label;
        } else {
          if (!('canAnnotate' in record) || !record.canAnnotate) throw new Error('Sample action unavailable.');
          record.note = command.note;
        }
      }
      next.revision += 1; state = workspaceSchema.parse(next);
      return structuredClone(state);
    },
  };
}
export const mockAdminAdapter = createMockAdminAdapter();
