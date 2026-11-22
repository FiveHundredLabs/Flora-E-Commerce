import { useEffect } from 'react';
import { Link } from 'react-router';
import { Breadcrumbs } from '../shared/components/ui/Breadcrumbs';
import { Badge } from '../shared/components/ui/Content';
import { Button } from '../shared/components/ui/Button';
import { useWishlist } from '../features/discovery/wishlist';
import { Illustration } from '../features/discovery/Illustration';
import { cartActions, useCartDispatch, openCartDrawer } from '../features/commerce';

export function WishlistPage() {
  const wishlist = useWishlist();
  const dispatch = useCartDispatch();

  useEffect(() => {
    document.title = 'My Wishlist | Flower & Flora';
  }, []);

  const handleAddToCart = (item: { productSlug: string; storeSlug: string }) => {
    dispatch(cartActions.add({ productSlug: item.productSlug, storeSlug: item.storeSlug }));
    openCartDrawer();
  };

  const handleMoveAllToCart = () => {
    wishlist.items.forEach((item) => {
      dispatch(cartActions.add({ productSlug: item.productSlug, storeSlug: item.storeSlug }));
    });
    openCartDrawer();
  };

  return (
    <div className="wishlist-page">
      <Breadcrumbs
        items={[{ label: 'Home', to: '/' }]}
        current="My Wishlist"
      />

      <div className="page-heading">
        <p className="eyebrow">Saved Botanicals</p>
        <h1>My Wishlist ({wishlist.count})</h1>
        <p>Guest saved items remain in your browser storage across sessions.</p>
      </div>

      {wishlist.items.length === 0 ? (
        <div className="wishlist-empty-state">
          <div className="empty-state-art">
            <Illustration category="bouquets" />
          </div>
          <h2>Your wishlist is currently empty</h2>
          <p>Explore our fresh floral collections and click the heart icon on any bouquet to save it here.</p>
          <Link to="/products" className="button button--primary">
            Explore Floral Catalog
          </Link>
        </div>
      ) : (
        <div className="wishlist-content">
          <div className="wishlist-table-wrapper">
            <table className="wishlist-table" aria-label="Wishlist items">
              <thead>
                <tr>
                  <th scope="col" className="col-remove">Remove</th>
                  <th scope="col" className="col-thumb">Item</th>
                  <th scope="col" className="col-name">Product & Studio</th>
                  <th scope="col" className="col-price">Unit Price</th>
                  <th scope="col" className="col-stock">Stock</th>
                  <th scope="col" className="col-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.items.map((item) => (
                  <tr key={item.productSlug}>
                    <td className="col-remove">
                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        aria-label={`Remove ${item.name} from wishlist`}
                        onClick={() => wishlist.remove(item.productSlug)}
                      >
                        ×
                      </button>
                    </td>
                    <td className="col-thumb">
                      <Link to={`/products/${item.productSlug}`} className="wishlist-thumb-link">
                        <Illustration category="bouquets" />
                      </Link>
                    </td>
                    <td className="col-name">
                      <Link to={`/products/${item.productSlug}`} className="wishlist-item-title">
                        {item.name}
                      </Link>
                      <span className="wishlist-item-store">
                        Studio: <Link to={`/shops/${item.storeSlug}`}>{item.storeSlug.replace(/-/g, ' ')}</Link>
                      </span>
                    </td>
                    <td className="col-price">
                      <span className="unit-price-text">$38.00</span>
                    </td>
                    <td className="col-stock">
                      <Badge tone="stock">In Stock</Badge>
                    </td>
                    <td className="col-action">
                      <Button
                        variant="primary"
                        className="wishlist-add-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="wishlist-footer-actions">
            <Button
              variant="secondary"
              onClick={wishlist.clear}
            >
              Clear Entire Wishlist
            </Button>
            <Button
              variant="primary"
              onClick={handleMoveAllToCart}
            >
              Transfer All to Cart →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
