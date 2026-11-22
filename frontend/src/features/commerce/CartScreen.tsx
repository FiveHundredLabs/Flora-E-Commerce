import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Minus, Plus, Store, Trash2 } from 'lucide-react';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Button } from '../../shared/components/ui/Button';
import { TextField } from '../../shared/components/ui/Fields';
import { cartActions, useCartDispatch, useCartSelector } from './cart';
import { sampleQuantity, validCartLine, type CartLine, type CommerceCatalog } from './model';
import { CommerceNotice } from './Common';

function QuantityEditor({ line, name }: { line: CartLine; name: string }) {
  const dispatch = useCartDispatch();
  const [value, setValue] = useState(String(line.quantity));
  const [error, setError] = useState<string>();
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { setValue(String(line.quantity)); }, [line.quantity]);
  const update = (quantity: number) => dispatch(cartActions.update({ ...line, quantity }));
  return <form className="cart-quantity" noValidate onSubmit={(event) => {
    event.preventDefault();
    const parsed = sampleQuantity.safeParse(value);
    if (!parsed.success) { setError('Use a whole quantity from 1 to 99 for this sample.'); input.current?.focus(); return; }
    setError(undefined); update(parsed.data);
  }}>
    <span className="cart-quantity__label">Quantity</span>
    <div className="cart-quantity__controls">
      <Button type="button" variant="quiet" aria-label={`Decrease quantity of ${name}`} disabled={line.quantity <= 1} onClick={() => update(line.quantity - 1)}><Minus size={16} aria-hidden="true" /></Button>
      <TextField ref={input} label={`Quantity for ${name}`} type="number" min={1} max={99} step={1} value={value} onChange={(event) => setValue(event.target.value)} error={error} />
      <Button type="button" variant="quiet" aria-label={`Increase quantity of ${name}`} disabled={line.quantity >= 99} onClick={() => update(line.quantity + 1)}><Plus size={16} aria-hidden="true" /></Button>
      <Button type="submit" variant="outline" aria-label={`Update quantity for ${name}`}>Update</Button>
    </div>
  </form>;
}

export function CartScreen({ catalog }: { catalog: CommerceCatalog }) {
  const lines = useCartSelector((state) => state.cart.lines);
  const dispatch = useCartDispatch();
  const stores = [...new Set(lines.map((line) => line.storeSlug))];
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  return <main className="commerce-page commerce-cart-page">
    <header className="commerce-hero"><p className="commerce-eyebrow">Store-separated checkout</p><h1 id="cart-title" tabIndex={-1}>Sample cart</h1><p>{itemCount} {itemCount === 1 ? 'item' : 'items'} across {stores.length} {stores.length === 1 ? 'store' : 'stores'}. Each store checks out independently.</p></header>
    <CommerceNotice />
    {lines.length === 0 ? <div className="commerce-empty"><AsyncRegion title="Your cart" state={{ status: 'empty', message: 'Your sample cart is empty.' }} /><Link className="button button--solid" to="/products">Browse sample products</Link></div>
      : <div className="cart-store-list">{stores.map((storeSlug) => {
        const items = lines.filter((line) => line.storeSlug === storeSlug);
        const name = catalog.stores.find((store) => store.slug === storeSlug)?.name ?? 'Unavailable sample shop';
        const valid = items.every((line) => validCartLine(line, catalog));
        const storeCount = items.reduce((total, line) => total + line.quantity, 0);
        return <section className="cart-store" key={storeSlug} aria-labelledby={`cart-store-${storeSlug}`}>
          <header className="cart-store__header"><div><p className="commerce-eyebrow"><Store size={16} aria-hidden="true" /> Supplier store</p><h2 id={`cart-store-${storeSlug}`}><Link to={`/shops/${storeSlug}`}>{name}</Link></h2></div><p>{storeCount} {storeCount === 1 ? 'item' : 'items'}</p></header>
          <ul className="cart-items">{items.map((line) => {
            const product = catalog.products.find((item) => item.slug === line.productSlug && item.storeSlug === line.storeSlug);
            const productName = product?.name ?? 'Unavailable sample item';
            return <li key={line.productSlug} className="cart-item"><div className="cart-item__visual" aria-label="Product image unavailable" role="img">{productName.charAt(0)}</div><div className="cart-item__content"><p className="commerce-eyebrow">Sample catalog item</p><h3><Link to={`/products/${line.productSlug}`}>{productName}</Link></h3><p>Variant, add-on, unit price and stock data are not connected.</p><QuantityEditor line={line} name={productName} /></div><Button className="cart-item__remove" variant="quiet" aria-label={`Remove ${productName}`} onClick={() => { dispatch(cartActions.remove(line)); document.getElementById('cart-title')?.focus(); }}><Trash2 size={17} aria-hidden="true" /> Remove</Button></li>;
          })}</ul>
          <footer className="cart-store__footer"><div><span>Store subtotal</span><strong>Unavailable</strong><p>No verified prices, tax, fees or totals exist in the current contract.</p></div>{valid ? <div><Link className="button button--solid" to={`/checkout?store=${storeSlug}`}>Checkout this store</Link>{stores.length > 1 && <p>{stores.length - 1} other store {stores.length - 1 === 1 ? 'group remains' : 'groups remain'} in your cart.</p>}</div> : <p role="alert">Remove unavailable items before continuing.</p>}</footer>
        </section>;
      })}</div>}
  </main>;
}
