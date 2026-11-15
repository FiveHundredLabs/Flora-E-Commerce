import { Link, useLocation } from 'react-router';
import { Badge } from '../../shared/components/ui/Content';
import { Illustration } from './Illustration';
import { categoryNames, locationNames, type Catalog, type Product, type Store } from './model';

export function ProductCards({ products, catalog }: { products: Product[]; catalog: Catalog }) {
  const { pathname, search } = useLocation();
  return <ul className="catalog-grid">{products.map((product) => <li key={product.slug} className="catalog-card">
    <Link className="catalog-card__link" to={`/products/${product.slug}${pathname === '/products' ? search : ''}`}><Illustration category={product.category} /><h3>{product.name}</h3></Link>
    <div className="catalog-card__meta"><Badge tone="subtle">{categoryNames[product.category]}</Badge>
      <p>From <Link to={`/shops/${product.storeSlug}`}>{catalog.stores.find((store) => store.slug === product.storeSlug)?.name}</Link></p>
    </div>
  </li>)}</ul>;
}

export function StoreCards({ stores }: { stores: Store[] }) {
  const { pathname, search } = useLocation();
  return <ul className="catalog-grid">{stores.map((store) => <li key={store.slug} className="catalog-card">
    <Link className="catalog-card__link" to={`/shops/${store.slug}${pathname === '/shops' ? search : ''}`}><Illustration category={store.categories[0] ?? 'bouquets'} /><h3>{store.name}</h3></Link>
    <div className="catalog-card__meta"><p>{locationNames[store.location]} · Sample shop</p><p>{store.description}</p></div>
  </li>)}</ul>;
}
