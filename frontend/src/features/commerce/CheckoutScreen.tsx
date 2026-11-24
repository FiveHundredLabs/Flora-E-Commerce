import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { CircleOff, CreditCard, MapPin, Store } from 'lucide-react';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Button } from '../../shared/components/ui/Button';
import { useCartSelector, useCartStore } from './cart';
import { checkoutKey, checkoutSchema, sampleSlug, validCartLine, type CommerceCatalog } from './model';
import { CommerceNotice, LineSummary } from './Common';
import { usePlaceOrder } from './query';
import type { CommerceAdapter } from './api/mock';

export function CheckoutScreen({ catalog, adapter }: { catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const [params] = useSearchParams();
  const parsed = sampleSlug.safeParse(params.get('store'));
  const storeSlug = parsed.success && params.getAll('store').length === 1 ? parsed.data : '';
  return <StoreCheckout key={storeSlug} storeSlug={storeSlug} catalog={catalog} adapter={adapter} />;
}

function StoreCheckout({ storeSlug, catalog, adapter }: { storeSlug: string; catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const allLines = useCartSelector((state) => state.cart.lines);
  const lines = allLines.filter((line) => line.storeSlug === storeSlug);
  const otherCount = allLines.filter((line) => line.storeSlug !== storeSlug).reduce((total, line) => total + line.quantity, 0);
  const redux = useCartStore();
  const navigate = useNavigate();
  const mutation = usePlaceOrder(adapter);
  const [error, setError] = useState('');
  const submission = useRef(false);
  const submitButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (mutation.isError && document.activeElement === document.body) submitButton.current?.focus(); }, [mutation.isError]);
  const name = catalog.stores.find((store) => store.slug === storeSlug)?.name;
  const valid = !!name && lines.length > 0 && lines.every((line) => validCartLine(line, catalog));
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

  function submit() {
    if (submission.current) return;
    const snapshot = redux.getState().cart.lines.filter((line) => line.storeSlug === storeSlug);
    if (snapshot.length === 0 || !snapshot.every((line) => validCartLine(line, catalog))) { setError('The cart changed. Return to the cart and review its items.'); return; }
    const preference = { method: 'pickup' as const };
    const input = checkoutSchema.parse({ key: checkoutKey(storeSlug, snapshot, preference), storeSlug, items: snapshot, preference });
    setError(''); submission.current = true;
    mutation.mutate(input, { onSuccess: (order) => navigate(`/account/orders/${order.id}`), onSettled: () => { submission.current = false; } });
  }

  return <main className="commerce-page checkout-page">
    <header className="commerce-hero"><p className="commerce-eyebrow">One supplier per order</p><h1>Review sample order</h1><p>This session can create a mock record for one store. It cannot reserve stock, book fulfilment or request payment.</p></header>
    <CommerceNotice />
    {!valid ? <div className="commerce-empty"><AsyncRegion title="Checkout unavailable" state={{ status: 'empty', message: 'Choose a shop with available sample items in your cart.' }} /><Link className="button button--outline" to="/cart">Return to sample cart</Link></div>
      : <div className="checkout-layout">
        <div className="checkout-main">
          <section className="checkout-step" aria-labelledby="checkout-review-title"><header><span>1</span><div><p className="commerce-eyebrow">Order review</p><h2 id="checkout-review-title">Items from {name}</h2></div></header><p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in this store-specific order.</p><LineSummary items={lines} catalog={catalog} />{otherCount > 0 && <p className="checkout-preserved">{otherCount} {otherCount === 1 ? 'item remains' : 'items remain'} in other store groups after this order is created.</p>}</section>
          <section className="checkout-step" aria-labelledby="checkout-fulfilment-title"><header><span>2</span><div><p className="commerce-eyebrow">Fulfilment</p><h2 id="checkout-fulfilment-title">Availability not connected</h2></div></header><div className="checkout-unavailable-grid"><article><Store aria-hidden="true"/><h3>Store pickup</h3><p>No verified pickup location, hours or instructions are available.</p><button type="button" disabled>Pickup unavailable</button></article><article><MapPin aria-hidden="true"/><h3>Delivery providers</h3><p>PickMe and Uber Connect require backend availability and quotes.</p><button type="button" disabled>Delivery unavailable</button></article></div><p className="checkout-contract-note"><CircleOff aria-hidden="true"/>No address or contact fields are requested because customer identity and fulfilment contracts are not connected.</p></section>
          <section className="checkout-step" aria-labelledby="checkout-payment-title"><header><span>3</span><div><p className="commerce-eyebrow">Payment</p><h2 id="checkout-payment-title">PayHere not connected</h2></div></header><div className="checkout-payment"><CreditCard aria-hidden="true"/><div><strong>No payment intent will be created.</strong><p>Currency, line prices, tax, delivery fees and final totals are unavailable. URL parameters never establish payment success.</p></div></div></section>
        </div>
        <aside className="checkout-summary" role="region" aria-label="Selected shop checkout"><p className="commerce-eyebrow">Selected supplier</p><h2>{name}</h2><LineSummary items={lines} catalog={catalog}/><dl><div><dt>Items</dt><dd>{itemCount}</dd></div><div><dt>Subtotal</dt><dd>Unavailable</dd></div><div><dt>Fees and tax</dt><dd>Unavailable</dd></div><div><dt>Final total</dt><dd>Unavailable</dd></div></dl>{error && <p role="alert">{error}</p>}{mutation.isError && <p role="alert">The sample order could not be created. Your cart has been kept. Try again.</p>}{mutation.isPending && <p role="status">Creating a sample order record. No payment is being made.</p>}<Button ref={submitButton} type="button" busy={mutation.isPending} onClick={submit}>Create sample order</Button><Link to="/cart">Return to cart</Link><p>This local action records the existing pickup preference placeholder only; it does not confirm pickup eligibility.</p></aside>
      </div>}
  </main>;
}
