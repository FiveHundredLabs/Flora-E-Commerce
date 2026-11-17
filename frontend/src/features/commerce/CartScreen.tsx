import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Card } from '../../shared/components/ui/Content';
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
  return <form className="quantity-editor" noValidate onSubmit={(event) => {
    event.preventDefault();
    const parsed = sampleQuantity.safeParse(value);
    if (!parsed.success) { setError('Use a whole quantity from 1 to 99 for this sample.'); input.current?.focus(); return; }
    setError(undefined); dispatch(cartActions.update({ ...line, quantity: parsed.data }));
  }}>
    <TextField ref={input} label={`Quantity for ${name}`} type="number" min={1} max={99} step={1} value={value} onChange={(event) => setValue(event.target.value)} error={error} />
    <Button type="submit" variant="secondary" aria-label={`Update quantity for ${name}`}>Update</Button>
  </form>;
}

export function CartScreen({ catalog }: { catalog: CommerceCatalog }) {
  const lines = useCartSelector((state) => state.cart.lines);
  const dispatch = useCartDispatch();
  const stores = [...new Set(lines.map((line) => line.storeSlug))];
  return <>
    <div className="page-heading"><h1 id="cart-title" tabIndex={-1}>Sample cart</h1><p>Keep items from several shops. Check out one shop at a time.</p></div>
    <CommerceNotice />
    {lines.length === 0 ? <><AsyncRegion title="Your cart" state={{ status: 'empty', message: 'Your sample cart is empty.' }} /><Link to="/products">Browse sample products</Link></>
      : stores.map((storeSlug) => {
        const items = lines.filter((line) => line.storeSlug === storeSlug);
        const name = catalog.stores.find((store) => store.slug === storeSlug)?.name ?? 'Unavailable sample shop';
        const valid = items.every((line) => validCartLine(line, catalog));
        return <Card key={storeSlug} title={name}>
          <ul className="cart-items">{items.map((line) => {
            const product = catalog.products.find((item) => item.slug === line.productSlug && item.storeSlug === line.storeSlug);
            return <li key={line.productSlug}><h3>{product?.name ?? 'Unavailable sample item'}</h3>
              <QuantityEditor line={line} name={product?.name ?? line.productSlug} />
              <Button variant="secondary" aria-label={`Remove ${product?.name ?? line.productSlug}`} onClick={() => {
                dispatch(cartActions.remove(line)); document.getElementById('cart-title')?.focus();
              }}>Remove</Button>
            </li>;
          })}</ul>
          <p>Prices and totals are not available in this sample.</p>
          {valid ? <Link to={`/checkout?store=${storeSlug}`}>Checkout {name}</Link> : <p role="alert">Remove unavailable items before continuing.</p>}
        </Card>;
      })}
  </>;
}
