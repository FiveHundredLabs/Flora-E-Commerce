import { DiscoveryDetail, DiscoveryList } from '../features/discovery';
import { AddSampleProduct } from '../features/commerce';

export function DiscoveryPage({ kind, detail = false }: { kind: 'shops' | 'products'; detail?: boolean }) {
  return detail ? (
    <DiscoveryDetail
      kind={kind}
      renderProductAction={(product, qty = 1) => (
        <AddSampleProduct
          key={`${product.storeSlug}/${product.slug}`}
          productSlug={product.slug}
          storeSlug={product.storeSlug}
          name={product.name}
          quantityToAdd={qty}
          showDirectCheckout={false}
        />
      )}
    />
  ) : (
    <DiscoveryList kind={kind} />
  );
}
