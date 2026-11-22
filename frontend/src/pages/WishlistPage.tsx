import { useEffect } from 'react';
import { Heart, Leaf, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../shared/components/ui/Button';
import { useWishlist } from '../features/discovery/wishlist';
import { Illustration } from '../features/discovery/Illustration';
import { cartActions, useCartDispatch, openCartDrawer } from '../features/commerce';

export function WishlistPage() {
  const wishlist = useWishlist();
  const dispatch = useCartDispatch();

  useEffect(() => { document.title = 'Saved flowers | Flower & Flora'; }, []);

  const addToCart = (item: { productSlug: string; storeSlug: string }) => {
    dispatch(cartActions.add({ productSlug: item.productSlug, storeSlug: item.storeSlug }));
    openCartDrawer();
  };

  return <div className="customer-page wishlist-page">
    <header className="customer-hero">
      <p className="customer-eyebrow"><Heart size={15} aria-hidden="true" /> Browser-saved collection</p>
      <h1>Saved flowers</h1>
      <p>{wishlist.count === 0 ? 'Keep a considered collection of botanical finds.' : `${wishlist.count} ${wishlist.count === 1 ? 'item' : 'items'} saved in this browser.`}</p>
    </header>

    <div className="customer-contract-note"><Leaf size={18} aria-hidden="true" /><p>This is a guest wishlist stored only in this browser. It is not connected to a customer account and may be cleared with browser data.</p></div>

    {wishlist.items.length === 0 ? <section className="customer-empty" aria-labelledby="wishlist-empty-title">
      <div className="customer-empty__art" aria-hidden="true"><Illustration category="bouquets" /></div>
      <div><p className="customer-eyebrow">Your collection</p><h2 id="wishlist-empty-title">Nothing saved yet</h2><p>Explore the sample catalog and use the heart control to keep products here.</p><Link to="/products" className="button button--primary">Explore products</Link></div>
    </section> : <>
      <ul className="wishlist-grid" aria-label="Saved products">
        {wishlist.items.map((item) => <li key={`${item.storeSlug}/${item.productSlug}`}>
          <div className="wishlist-card__visual" aria-label="Product image unavailable"><Illustration category="bouquets" /></div>
          <div className="wishlist-card__body"><p className="customer-eyebrow">Saved product</p><h2><Link to={`/products/${item.productSlug}`}>{item.name}</Link></h2>
            <p>From <Link to={`/shops/${item.storeSlug}`}>{item.storeSlug.replace(/-/g, ' ')}</Link></p>
            <p className="wishlist-card__unavailable">Price, stock and product options are not connected.</p>
            <div className="wishlist-card__actions"><Button variant="primary" onClick={() => addToCart(item)}><ShoppingBag size={17} aria-hidden="true" /> Add to sample cart</Button><Button variant="secondary" onClick={() => wishlist.remove(item.productSlug)} aria-label={`Remove ${item.name} from wishlist`}><Trash2 size={17} aria-hidden="true" /> Remove</Button></div>
          </div>
        </li>)}
      </ul>
      <div className="wishlist-footer-actions"><Button variant="secondary" onClick={wishlist.clear}>Clear saved items</Button></div>
    </>}
  </div>;
}
