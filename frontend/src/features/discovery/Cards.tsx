import { Link, useLocation } from 'react-router';
import { Badge } from '../../shared/components/ui/Content';
import { Illustration } from './Illustration';
import { ProductCard } from './ProductCard';
import { categoryNames, locationNames, type Catalog, type Product, type Store } from './model';

export function ProductCards({
  products,
  catalog,
  viewMode = '3-col',
}: {
  products: Product[];
  catalog: Catalog;
  viewMode?: '3-col' | '4-col' | 'list';
}) {
  return (
    <ul className={`catalog-grid catalog-grid--${viewMode}`}>
      {products.map((product, idx) => {
        const storeName = catalog.stores.find((s) => s.slug === product.storeSlug)?.name;
        const badgeType = idx % 3 === 0 ? 'sale' : idx % 3 === 1 ? 'new' : 'stock';
        return (
          <li key={product.slug} className="catalog-grid-item">
            <ProductCard
              product={product}
              storeName={storeName}
              badgeType={badgeType}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function StoreCards({ stores }: { stores: Store[] }) {
  const { pathname, search } = useLocation();
  return (
    <ul className="catalog-grid catalog-grid--stores">
      {stores.map((store) => (
        <li key={store.slug} className="store-card">
          <div className="store-card__banner">
            <Illustration category={store.categories[0] ?? 'bouquets'} />
            <Badge tone="new" className="store-card__badge">Verified Florist</Badge>
          </div>
          <div className="store-card__content">
            <div className="store-card__avatar" aria-hidden="true">
              <span>{store.name.slice(0, 2).toUpperCase()}</span>
            </div>
            <h3 className="store-card__title">
              <Link to={`/shops/${store.slug}${pathname === '/shops' ? search : ''}`}>
                {store.name}
              </Link>
            </h3>
            <p className="store-card__location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {locationNames[store.location]} · Artisanal Florist
            </p>
            <p className="store-card__desc">{store.description}</p>
            <div className="store-card__tags">
              {store.categories.map((c) => (
                <span key={c} className="store-tag">{categoryNames[c]}</span>
              ))}
            </div>
            <div className="store-card__footer">
              <Link to={`/shops/${store.slug}${pathname === '/shops' ? search : ''}`} className="store-visit-btn">
                Visit Floral Studio →
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
