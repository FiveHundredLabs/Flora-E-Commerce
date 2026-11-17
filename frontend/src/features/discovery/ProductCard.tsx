import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Badge } from '../../shared/components/ui/Content';
import { Illustration } from './Illustration';
import { QuickViewModal } from './QuickViewModal';
import { categoryNames, type Product } from './model';
import { useWishlist } from './wishlist';
import { cartActions, useCartDispatch, openCartDrawer } from '../commerce';

export function ProductCard({
  product,
  storeName,
  badgeType = 'sale',
}: {
  product: Product;
  storeName?: string;
  badgeType?: 'sale' | 'new' | 'stock';
}) {
  const { pathname, search } = useLocation();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const wishlist = useWishlist();
  const dispatch = useCartDispatch();
  const inWishlist = wishlist.has(product.slug);

  const productUrl = `/products/${product.slug}${pathname === '/products' ? search : ''}`;
  const storeUrl = `/shops/${product.storeSlug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(cartActions.add({ productSlug: product.slug, storeSlug: product.storeSlug }));
    openCartDrawer();
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle({
      productSlug: product.slug,
      storeSlug: product.storeSlug,
      name: product.name,
      category: product.category,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div className="fiama-product-card">
        <div className="product-card-thumb">
          <Link to={productUrl} className="product-image-link" tabIndex={-1} aria-hidden="true">
            <div className="product-image-primary">
              <Illustration category={product.category} />
            </div>
            <div className="product-image-secondary" aria-hidden="true">
              <Illustration category={product.category} />
            </div>
          </Link>

          {/* Badges */}
          <div className="product-badge-group">
            {badgeType === 'sale' && <Badge tone="sale" className="badge-tag">SALE -20%</Badge>}
            {badgeType === 'new' && <Badge tone="new" className="badge-tag">NEW</Badge>}
            {badgeType === 'stock' && <Badge tone="stock" className="badge-tag">IN STOCK</Badge>}
          </div>

          {/* 4-Button Hover Action Bar */}
          <div className="product-hover-action" role="group" aria-label={`Actions for ${product.name}`}>
            <button
              type="button"
              className="action-btn"
              aria-label={`Quick view ${product.name}`}
              data-tooltip="Quick View"
              onClick={handleQuickView}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="tooltip">Quick View</span>
            </button>

            <button
              type="button"
              className="action-btn"
              aria-label={`Add ${product.name} to cart`}
              data-tooltip="Add to Cart"
              onClick={handleAddToCart}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="tooltip">Add to Cart</span>
            </button>

            <button
              type="button"
              className={`action-btn wishlist-btn ${inWishlist ? 'is-active' : ''}`}
              aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={inWishlist}
              data-tooltip="Wishlist"
              onClick={handleWishlistToggle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="tooltip">{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <Link
              to={productUrl}
              className="action-btn details-btn"
              aria-label={`View details for ${product.name}`}
              data-tooltip="Details"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span className="tooltip">Details</span>
            </Link>
          </div>
        </div>

        <div className="product-card-body">
          <div className="product-category-row">
            <span className="product-category-badge">{categoryNames[product.category]}</span>
            {storeName && (
              <span className="product-store-attribution">
                From <Link to={storeUrl} className="store-link">{storeName}</Link>
              </span>
            )}
          </div>

          <h3 className="product-title">
            <Link to={productUrl}>{product.name}</Link>
          </h3>

          <div className="product-rating" aria-label="5 out of 5 stars">
            <span className="stars">★★★★★</span>
            <span className="rating-count">(4.9)</span>
          </div>

          <div className="product-price-row">
            <span className="price-current">$38.00</span>
            <span className="price-old">$45.00</span>
          </div>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          storeName={storeName}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
