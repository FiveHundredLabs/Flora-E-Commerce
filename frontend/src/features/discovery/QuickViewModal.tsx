import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { X, Minus, Plus, Heart } from 'lucide-react';
import { Badge } from '../../shared/components/ui/Content';
import { Button } from '../../shared/components/ui/Button';
import { Illustration } from './Illustration';
import { type Product } from './model';
import { useWishlist } from './wishlist';
import { getProductPhoto } from './assets';
import { cartActions, useCartDispatch, openCartDrawer } from '../commerce';

export function QuickViewModal({
  product,
  storeName,
  isOpen,
  onClose,
}: {
  product: Product | null;
  storeName?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedVariant, setSelectedVariant] = useState<'Standard' | 'Deluxe' | 'Premium'>('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState<1 | 2>(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const wishlist = useWishlist();
  const dispatch = useCartDispatch();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      setQuantity(1);
      setActiveThumb(1);
      setAddedNotice(false);
      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      }
    } else if (dialog.open) {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }
  }, [isOpen]);

  if (!product) return null;

  const inWishlist = wishlist.has(product.slug);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(cartActions.add({ productSlug: product.slug, storeSlug: product.storeSlug }));
    }
    setAddedNotice(true);
    setTimeout(() => {
      onClose();
      openCartDrawer();
    }, 300);
  };

  return (
    <dialog
      ref={dialogRef}
      className="quickview-dialog"
      aria-labelledby="quickview-title"
      onClose={onClose}
      onClick={(e) => {
        // Light dismiss on backdrop click
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="quickview-content">
        <button
          type="button"
          className="quickview-close"
          aria-label="Close quick view"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="quickview-grid">
          <div className="quickview-media">
            <div className="quickview-image-wrap">
              <Illustration
                category="bouquets"
                slug={product.slug}
                secondary={activeThumb === 2 && Boolean(getProductPhoto(product.slug).secondary)}
              />
              <Badge tone="sale" className="quickview-badge">-20%</Badge>
            </div>
            <div className="quickview-thumbnails">
              <button
                type="button"
                className={`quickview-thumb ${activeThumb === 1 ? 'is-active' : ''}`}
                aria-label="Thumbnail 1"
                onClick={() => setActiveThumb(1)}
              >
                <Illustration category="bouquets" slug={product.slug} />
              </button>
              {getProductPhoto(product.slug).secondary && (
                <button
                  type="button"
                  className={`quickview-thumb ${activeThumb === 2 ? 'is-active' : ''}`}
                  aria-label="Thumbnail 2"
                  onClick={() => setActiveThumb(2)}
                >
                  <Illustration category="bouquets" slug={product.slug} secondary />
                </button>
              )}
            </div>
          </div>

          <div className="quickview-details">
            <div className="quickview-meta-top">
              <Badge tone="subtle">Sample catalog item</Badge>
              {storeName && (
                <span className="quickview-store">
                  Crafted by: <Link to={`/shops/${product.storeSlug}`} onClick={onClose}>{storeName}</Link>
                </span>
              )}
            </div>

            <h2 id="quickview-title" className="quickview-title">{product.name}</h2>

            <div className="quickview-ratings" aria-label="5 out of 5 stars">
              <span className="stars-gold">★★★★★</span>
              <span className="rating-text">(4.9 · 18 reviews)</span>
            </div>

            <div className="quickview-pricing">
              <span className="price-current">$38.00</span>
              <span className="price-original">$48.00</span>
              <span className="stock-status">In Stock</span>
            </div>

            <p className="quickview-desc">{product.description}</p>

            <div className="quickview-variants">
              <span className="variant-label">Size:</span>
              <div className="variant-pills" role="radiogroup" aria-label="Arrangement Size">
                {(['Standard', 'Deluxe', 'Premium'] as const).map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    role="radio"
                    aria-checked={selectedVariant === variant}
                    className={`variant-pill ${selectedVariant === variant ? 'is-selected' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            <div className="quickview-actions">
              <div className="cart-plus-minus" role="group" aria-label="Product quantity">
                <button
                  type="button"
                  className="dec qtybutton"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus size={14} aria-hidden="true" />
                </button>
                <input
                  type="number"
                  aria-label="Quantity"
                  value={quantity}
                  min={1}
                  max={99}
                  readOnly
                  className="cart-plus-minus-box"
                />
                <button
                  type="button"
                  className="inc qtybutton"
                  aria-label="Increase quantity"
                  disabled={quantity >= 99}
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>

              <Button
                variant="primary"
                className="quickview-add-cart-btn"
                onClick={handleAddToCart}
              >
                {addedNotice ? 'Added to Cart!' : 'Add to Cart'}
              </Button>

              <button
                type="button"
                className={`quickview-wishlist-btn ${inWishlist ? 'is-active' : ''}`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={inWishlist}
                onClick={() => wishlist.toggle({
                  productSlug: product.slug,
                  storeSlug: product.storeSlug,
                  name: product.name,
                  category: 'catalog-item',
                })}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            </div>

            <div className="quickview-footer">
              <Link
                to={`/products/${product.slug}`}
                className="view-full-details-link"
                onClick={onClose}
              >
                View Full Product Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
