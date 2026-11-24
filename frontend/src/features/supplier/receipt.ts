import type { AllowedWorkspace, SupplierCommand } from './model';

/** Associate a mock acknowledgement with the requested effect, not just its version. */
export function matchesReceipt(before: AllowedWorkspace, after: AllowedWorkspace, command: SupplierCommand): boolean {
  const sameFields = (actual: { name: string; description: string } | null | undefined, expected: { name: string; description: string }) =>
    actual?.name === expected.name && actual.description === expected.description;
  switch (command.type) {
    case 'register': return sameFields(after.registration, command.data);
    case 'profile': return sameFields(after.profile, command.data);
    case 'createProduct': {
      const added = after.products.filter((item) => !before.products.some((old) => old.id === item.id));
      return added.length === 1 && sameFields(added[0], command.data) && added[0]?.variants.length === 0;
    }
    case 'fulfilmentNote': return after.orders.find((order) => order.id === command.orderId)?.note === command.data.note;
    default: {
      const previous = before.products.find((item) => item.id === command.productId);
      const product = after.products.find((item) => item.id === command.productId);
      if (!previous) return false;
      if (command.type === 'removeProduct') return !product;
      if (!product) return false;
      if (command.type === 'editProduct') return sameFields(product, command.data);
      if (command.type === 'addVariant') {
        const added = product.variants.filter((item) => !previous.variants.some((old) => old.id === item.id));
        return added.length === 1 && added[0]?.name === command.data.name && added[0]?.stock === command.data.stock;
      }
      if (!previous.variants.some((item) => item.id === command.variantId)) return false;
      const variant = product.variants.find((item) => item.id === command.variantId);
      if (command.type === 'removeVariant') return !variant;
      if (command.type === 'stock') return variant?.stock === command.stock;
      return variant?.name === command.data.name && variant?.stock === command.data.stock;
    }
  }
}
