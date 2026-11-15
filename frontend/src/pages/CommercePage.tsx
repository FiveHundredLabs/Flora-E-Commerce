import { useDiscovery } from '../features/discovery';
import { CartScreen, CheckoutScreen, OrderScreen, OrdersScreen } from '../features/commerce';
import { AsyncRegion } from '../shared/components/AsyncRegion';

export function CommercePage({ screen }: { screen: 'cart' | 'checkout' | 'orders' | 'order' }) {
  const query = useDiscovery();
  const title = { cart: 'Sample cart', checkout: 'Sample checkout', orders: 'Sample orders', order: 'Sample order' }[screen];
  if (!query.data) return <><h1>{title}</h1><AsyncRegion title="Sample catalog" state={query.isPending || query.isFetching ? { status: 'loading' }
    : { status: 'error', onRetry: () => { void query.refetch(); } }} /></>;
  return <>
    {query.isError && <p role="alert">The sample catalog could not be refreshed. Previously loaded sample information is shown.</p>}
    {screen === 'cart' ? <CartScreen catalog={query.data} /> : screen === 'checkout' ? <CheckoutScreen catalog={query.data} />
      : screen === 'orders' ? <OrdersScreen catalog={query.data} /> : <OrderScreen catalog={query.data} />}
  </>;
}
