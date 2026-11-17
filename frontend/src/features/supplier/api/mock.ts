import { commandSchema, workspaceSchema, type SupplierCommand, type SupplierWorkspace } from '../model';

export interface SupplierAdapter {
  key: string;
  read: (signal?: AbortSignal) => Promise<unknown>;
  execute: (command: SupplierCommand) => Promise<unknown>;
}
const seed: SupplierWorkspace = { access: 'allowed', revision: 0, registration: null,
  profile: { name: 'Meadow Studio', description: 'A fictional supplier workspace for exploring catalog tools.' },
  products: [{ id: 'sample-posy', name: 'Sample Posy', description: 'Fictional seasonal stems.', variants: [
    { id: 'standard', name: 'Standard', stock: 8 }, { id: 'large', name: 'Large', stock: 3 },
  ] }],
  orders: [
    { id: 'sample-order-one', items: [{ name: 'Sample Posy — Standard', quantity: 2 }], fulfilment: 'Store pickup', note: '', canRecordNote: true },
    { id: 'sample-order-two', items: [{ name: 'Sample Posy — Large', quantity: 1 }], fulfilment: 'Delivery preference', note: 'Sample note: packed for review.', canRecordNote: false },
  ],
};

/** Isolated in-memory fixture. No auth, publishing, payment or provider access. */
export function createMockSupplierAdapter(initial: SupplierWorkspace = seed): SupplierAdapter {
  let state = workspaceSchema.parse(initial);
  let sequence = 0;
  return { key: crypto.randomUUID(),
    async read(signal) { signal?.throwIfAborted(); return structuredClone(state); },
    async execute(input) {
      const command = commandSchema.parse(input);
      if (state.access !== 'allowed') throw new Error('Sample workspace unavailable.');
      if (command.expectedRevision !== state.revision) throw new Error('Stale sample edit.');
      const next = structuredClone(state);
      switch (command.type) {
        case 'register': next.registration = command.data; break;
        case 'profile': next.profile = command.data; break;
        case 'createProduct': {
          let id: string;
          do { id = `sample-product-${++sequence}`; } while (next.products.some((product) => product.id === id));
          next.products.push({ id, ...command.data, variants: [] }); break;
        }
        case 'fulfilmentNote': {
          const order = next.orders.find((item) => item.id === command.orderId);
          if (!order?.canRecordNote) throw new Error('Sample action unavailable.');
          order.note = command.data.note; break;
        }
        default: {
          const product = next.products.find((item) => item.id === command.productId);
          if (!product) throw new Error('Sample product unavailable.');
          if (command.type === 'removeProduct') next.products = next.products.filter((item) => item.id !== product.id);
          else if (command.type === 'editProduct') Object.assign(product, command.data);
          else if (command.type === 'addVariant') {
            let id: string;
            do { id = `sample-variant-${++sequence}`; } while (product.variants.some((variant) => variant.id === id));
            product.variants.push({ id, ...command.data });
          } else {
            const variant = product.variants.find((item) => item.id === command.variantId);
            if (!variant) throw new Error('Sample variant unavailable.');
            if (command.type === 'removeVariant') product.variants = product.variants.filter((item) => item.id !== variant.id);
            else if (command.type === 'editVariant') Object.assign(variant, command.data);
            else variant.stock = command.stock;
          }
        }
      }
      next.revision += 1;
      state = workspaceSchema.parse(next);
      return structuredClone(state);
    },
  };
}
export const mockSupplierAdapter = createMockSupplierAdapter();
