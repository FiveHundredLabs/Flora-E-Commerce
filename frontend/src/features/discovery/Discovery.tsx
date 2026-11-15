import { Link, useLocation, useParams, useSearchParams } from 'react-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Badge } from '../../shared/components/ui/Content';
import { Breadcrumbs } from '../../shared/components/ui/Breadcrumbs';
import { useDiscovery } from './query';
import { type DiscoveryAdapter } from './api/mock';
import { categoryNames, defaultFilters, locationNames, readFilters, selectProducts, selectStores, writeFilters, type Kind, type Product } from './model';
import { Filters } from './Filters';
import { ProductCards, StoreCards } from './Cards';
import { Illustration } from './Illustration';
import { RefreshNotice } from './RefreshNotice';

export function MockNotice() {
  return <div className="mock-notice"><Badge>Sample catalog · MOCK</Badge><p>All shops and products here are fictional. No real purchases or payments are available.</p></div>;
}

export function DiscoveryList({ kind, adapter }: { kind: Kind; adapter?: DiscoveryAdapter }) {
  const query = useDiscovery(adapter);
  const results = useRef<HTMLDivElement>(null);
  const { key: navigationKey } = useLocation();
  const [params, setParams] = useSearchParams();
  const { filters, invalid } = readFilters(params);
  const title = kind === 'shops' ? 'Shops' : 'Products';
  const stores = query.data ? selectStores(query.data, filters) : [];
  const products = query.data ? selectProducts(query.data, filters) : [];
  const count = kind === 'shops' ? stores.length : products.length;
  return <>
    <div className="page-heading"><p className="eyebrow">Discover at your own pace</p><h1>{title}</h1><p>{kind === 'shops' ? 'Meet the spaces behind the stems.' : 'A small collection of flowers, foliage and growing things.'}</p></div>
    <MockNotice />
    <p className="catalog-provisional">Sample filters are provisional while the final catalog rules are agreed.</p>
    {invalid && <p role="alert">Some URL filters were invalid. Safe defaults are shown; you can clear or change the filters.</p>}
    <Filters values={filters} revision={navigationKey} apply={(values) => setParams(writeFilters(values))} clear={() => setParams({})} />
    {query.data && <><p role="status" aria-live="polite">{count} sample {kind === 'shops' ? 'shops' : 'products'} found.</p>
      <RefreshNotice fetching={query.isFetching} failed={query.isError} retry={() => query.refetch()} target={results} /></>}
    <div ref={results}><AsyncRegion title={`Sample ${title.toLowerCase()}`} state={query.isPending || (query.isFetching && !query.data) ? { status: 'loading' }
      : !query.data ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : count === 0 ? { status: 'empty', message: 'No matches. Try another search or clear the filters.' }
      : { status: 'ready', children: kind === 'shops' ? <StoreCards stores={stores} /> : <ProductCards products={products} catalog={query.data} /> }} /></div>
  </>;
}

export function DiscoveryDetail({ kind, adapter, renderProductAction }: { kind: Kind; adapter?: DiscoveryAdapter; renderProductAction?: (product: Product) => ReactNode }) {
  const results = useRef<HTMLDivElement>(null);
  const { slug } = useParams();
  const [params] = useSearchParams();
  const returnSearch = writeFilters(readFilters(params).filters).toString();
  const listPath = `/${kind}${returnSearch ? `?${returnSearch}` : ''}`;
  const query = useDiscovery(adapter);
  const record = kind === 'shops' ? query.data?.stores.find((store) => store.slug === slug) : query.data?.products.find((product) => product.slug === slug);
  const store = kind === 'products' ? query.data?.stores.find((item) => item.slug === query.data?.products.find((product) => product.slug === slug)?.storeSlug) : undefined;
  const label = kind === 'shops' ? 'Shop' : 'Product';
  const pageTitle = record?.name ?? (query.data ? `${label} not found` : `${label} details`);
  useEffect(() => { document.title = `${pageTitle} | Flower & Flora`; }, [pageTitle]);
  return <>
    <Breadcrumbs items={[{ label: 'Marketplace', to: '/' }, { label: kind === 'shops' ? 'Shops' : 'Products', to: listPath }]} current={record?.name ?? `${label} details`} />
    <div className="page-heading"><h1>{pageTitle}</h1></div>
    <MockNotice />
    {query.data && <RefreshNotice fetching={query.isFetching} failed={query.isError} retry={() => query.refetch()} target={results} />}
    <div ref={results}><AsyncRegion title={`${label} information`} state={query.isPending || (query.isFetching && !query.data) ? { status: 'loading' }
      : !query.data ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : !record ? { status: 'empty', message: `This sample ${label.toLowerCase()} could not be found.` }
      : { status: 'ready', children: <div className="catalog-detail">
        <Illustration category={'category' in record ? record.category : record.categories[0] ?? 'bouquets'} />
        <div><p>{record.description}</p>
          {'location' in record ? <><p>{locationNames[record.location]} · Fictional location</p><p>{record.categories.map((category) => categoryNames[category]).join(' · ')}</p><p>Contact details are not available in the sample catalog.</p></>
            : <><Badge tone="subtle">{categoryNames[record.category]}</Badge>{store && <p>From <Link to={`/shops/${store.slug}`}>{store.name}</Link></p>}<p>Illustration only. Price and availability are not offered in this sample catalog.</p>{renderProductAction?.(record)}</>}
        </div>
      </div> }} />
    {kind === 'shops' && query.data && record && <AsyncRegion title="Products from this shop" state={selectProducts(query.data, defaultFilters, record.slug).length === 0
      ? { status: 'empty', message: 'No sample products for this shop yet.' }
      : { status: 'ready', children: <ProductCards products={selectProducts(query.data, defaultFilters, record.slug)} catalog={query.data} /> }} />}</div>
    <Link className="catalog-back" to={listPath}>Back to {kind}</Link>
  </>;
}
