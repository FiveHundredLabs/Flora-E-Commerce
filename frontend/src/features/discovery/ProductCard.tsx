import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Eye, Heart, ShoppingBag, Plus, Minus, ArrowUpRight } from 'lucide-react';
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
  const [cardQuantity, setCardQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const wishlist = useWishlist();
  const dispatch = useCartDispatch();
  const inWishlist = wishlist.has(product.slug);

  const productUrl = `/products/${product.slug}${pathname === '/products' ? search : ''}`;
  const storeUrl = `/shops/${product.storeSlug}`;

  const colors = [
    { name: 'Pure White', hex: '#FAF9F6' },
    { name: 'Sage Leaf', hex: '#6F967B' },
    { name: 'Warm Cream', hex: '#EED9C4' },
    { name: 'Blush Rose', hex: '#E8B4B8' },
  ];

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    for (let i = 0; i < cardQuantity; i++) {
      dispatch(cartActions.add({ productSlug: product.slug, storeSlug: product.storeSlug }));
    }
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
              <Illustration category={product.category} slug={product.slug} />
            </div>
            <div className="product-image-secondary" aria-hidden="true">
              <Illustration category={product.category} slug={product.slug} secondary />
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
              <Eye size={18} aria-hidden="true" />
              <span className="tooltip">Quick View</span>
            </button>

            <button
              type="button"
              className="action-btn"
              aria-label={`Add ${product.name} to cart`}
              data-tooltip="Add to Cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} aria-hidden="true" />
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
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} aria-hidden="true" />
              <span className="tooltip">{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <Link
              to={productUrl}
              className="action-btn details-btn"
              aria-label={`View details for ${product.name}`}
              data-tooltip="Details"
            >
              <ArrowUpRight size={18} aria-hidden="true" />
              <span className="tooltip">Details</span>
            </Link>
          </div>
        </div>

        <div className="product-card-body">
          <div className="product-category-row">
            <span className="product-category-badge">{categoryNames[product.category]}</span>
            {storeName && (
              <span className="product-store-attribution">
                Crafted by: <Link to={storeUrl} className="store-link">{storeName}</Link>
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
            <span className="price-old">$48.00</span>
          </div>

          {/* Color Swatches */}
          <div className="card-swatches" aria-label="Available flower tones">
            {colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                className={`card-swatch-circle ${selectedColor === i ? 'is-active' : ''}`}
                style={{ backgroundColor: c.hex }}
                aria-label={c.name}
                onClick={(e) => { e.preventDefault(); setSelectedColor(i); }}
              />
            ))}
          </div>

          {/* Size Selector Pills & Inline Stepper Buy Row */}
          <div className="card-inline-controls">
            <div className="card-size-pills" role="group" aria-label="Arrangement size">
              {(['S', 'M', 'L'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`card-size-btn ${selectedSize === size ? 'is-active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setSelectedSize(size); }}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="card-stepper-wrap" role="group" aria-label="Quantity and add to cart">
              <div className="card-stepper">
                <button
                  type="button"
                  className="card-stepper-btn"
                  aria-label="Decrease quantity"
                  disabled={cardQuantity <= 1}
                  onClick={(e) => { e.preventDefault(); setCardQuantity((q) => Math.max(1, q - 1)); }}
                >
                  <Minus size={12} aria-hidden="true" />
                </button>
                <span className="card-stepper-val">{cardQuantity}</span>
                <button
                  type="button"
                  className="card-stepper-btn"
                  aria-label="Increase quantity"
                  disabled={cardQuantity >= 99}
                  onClick={(e) => { e.preventDefault(); setCardQuantity((q) => Math.min(99, q + 1)); }}
                >
                  <Plus size={12} aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                className="card-quick-buy-btn"
                aria-label={`Buy ${cardQuantity} of ${product.name}`}
                title="Add to cart"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={14} aria-hidden="true" />
              </button>
            </div>
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
