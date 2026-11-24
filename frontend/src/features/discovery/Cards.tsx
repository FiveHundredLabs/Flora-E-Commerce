import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Price, StatusTag } from '../../shared/components/ui/Feedback';
import { Illustration } from './Illustration';
import { categoryNames, locationNames, type Catalog, type Product, type Store } from './model';
import { cartActions, useCartDispatch, openCartDrawer } from '../commerce';

export function ProductCards({
  products,
  catalog,
  enableQuickAdd = false,
}: {
  products: Product[];
  catalog: Catalog;
  enableQuickAdd?: boolean;
}) {
  const { pathname, search } = useLocation();
  const dispatch = useCartDispatch();
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(cartActions.add({ productSlug: p.slug, storeSlug: p.storeSlug }));
    setAddedMap((prev) => ({ ...prev, [p.slug]: true }));
    openCartDrawer();
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [p.slug]: false }));
    }, 1500);
  };

  return (
    <ul className="discovery-card-grid">
      {products.map((p) => {
        const store = catalog.stores.find((s) => s.slug === p.storeSlug);
        const url = `/products/${p.slug}${pathname === '/products' ? search : ''}`;
        return (
          <li key={p.slug}>
            <article className="discovery-product-card">
              <Link className="discovery-card-art" to={url} aria-label={`View ${p.name}`}>
                <Illustration
                  category={store?.categories[0] ?? 'bouquets'}
                  slug={p.slug}
                  alt={p.name}
                />
              </Link>
              <div className="discovery-card-body">
                <p className="discovery-card-kicker">Sample catalog item</p>
                <h2><Link to={url}>{p.name}</Link></h2>
                {store && <p>From <Link to={`/shops/${store.slug}`}>{store.name}</Link></p>}
                <p>{p.description}</p>
                <div className="discovery-product-facts">
                  <Price />
                  <StatusTag>Availability not connected</StatusTag>
                </div>
                {enableQuickAdd && (
                  <div className="discovery-card-order-action">
                    <button
                      type="button"
                      className={`discovery-quick-add-btn ${addedMap[p.slug] ? 'discovery-quick-add-btn--added' : ''}`}
                      onClick={(e) => handleQuickAdd(p, e)}
                      aria-label={`Add ${p.name} to order`}
                    >
                      {addedMap[p.slug] ? '✓ Added to order' : '+ Add to order'}
                    </button>
                  </div>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

export function StoreCards({ stores }: { stores: Store[] }) {
  const { pathname, search } = useLocation();
  return (
    <ul className="discovery-card-grid">
      {stores.map((s) => {
        const url = `/shops/${s.slug}${pathname === '/shops' ? search : ''}`;
        return (
          <li key={s.slug}>
            <article className="discovery-store-card">
              <Link className="discovery-card-art" to={url} aria-label={`Visit ${s.name}`}>
                <Illustration
                  category={s.categories[0] ?? 'bouquets'}
                  slug={s.slug}
                  alt={s.name}
                />
              </Link>
              <div className="discovery-card-body">
                <p className="discovery-location"><MapPin size={16} aria-hidden="true" />{locationNames[s.location]}</p>
                <h2><Link to={url}>{s.name}</Link></h2>
                <p>{s.description}</p>
                <ul className="discovery-categories" aria-label={`Shop categories for ${s.name}`}>
                  {s.categories.map((c) => <li key={c}>{categoryNames[c]}</li>)}
                </ul>
                <div className="discovery-store-card__actions">
                  <Link className="discovery-text-link" to={url}>
                    Browse shop &amp; flowers <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
