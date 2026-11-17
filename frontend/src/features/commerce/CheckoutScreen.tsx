import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Button } from '../../shared/components/ui/Button';
import { SelectField } from '../../shared/components/ui/Fields';
import { useCartSelector, useCartStore } from './cart';
import { checkoutKey, checkoutSchema, preferenceSchema, sampleSlug, validCartLine, type CommerceCatalog } from './model';
import { CommerceNotice, LineSummary } from './Common';
import { usePlaceOrder } from './query';
import type { CommerceAdapter } from './api/mock';

export function CheckoutScreen({ catalog, adapter }: { catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const [params] = useSearchParams();
  const parsed = sampleSlug.safeParse(params.get('store'));
  const storeSlug = parsed.success && params.getAll('store').length === 1 ? parsed.data : '';
  // A checkout editor belongs to one store. Switching stores detaches its per-call
  // navigation callbacks, while hook-level reconciliation still handles late commits.
  return <StoreCheckout key={storeSlug} storeSlug={storeSlug} catalog={catalog} adapter={adapter} />;
}

function StoreCheckout({ storeSlug, catalog, adapter }: { storeSlug: string; catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const allLines = useCartSelector((state) => state.cart.lines);
  const lines = allLines.filter((line) => line.storeSlug === storeSlug);
  const redux = useCartStore();
  const navigate = useNavigate();
  const mutation = usePlaceOrder(adapter);
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');
  const [providerError, setProviderError] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const submission = useRef(false);
  const submitButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (mutation.isError && document.activeElement === document.body) submitButton.current?.focus();
  }, [mutation.isError]);
  const name = catalog.stores.find((store) => store.slug === storeSlug)?.name;
  const valid = !!name && lines.length > 0 && lines.every((line) => validCartLine(line, catalog));

  return <>
    <div className="page-heading"><h1>Sample checkout</h1><p>Only the selected shop’s items are included.</p></div><CommerceNotice />
    {!valid ? <><AsyncRegion title="Checkout unavailable" state={{ status: 'empty', message: 'Choose a shop with available sample items in your cart.' }} /><Link to="/cart">Return to sample cart</Link></>
      : <section className="card" aria-label="Selected shop checkout"><h2>{name}</h2><LineSummary items={lines} catalog={catalog} />
        <form ref={form} noValidate onSubmit={(event) => {
          event.preventDefault();
          if (submission.current) return;
          const preference = preferenceSchema.safeParse(method === 'pickup' ? { method } : { method, provider });
          if (!preference.success) { setProviderError('Choose a sample delivery provider.'); form.current?.querySelector('select')?.focus(); return; }
          setProviderError('');
          const snapshot = redux.getState().cart.lines.filter((line) => line.storeSlug === storeSlug);
          if (snapshot.length === 0 || !snapshot.every((line) => validCartLine(line, catalog))) { setError('The cart changed. Return to the cart and review its items.'); return; }
          const input = checkoutSchema.parse({ key: checkoutKey(storeSlug, snapshot, preference.data), storeSlug, items: snapshot, preference: preference.data });
          setError(''); submission.current = true;
          mutation.mutate(input, { onSuccess: (order) => {
            navigate(`/account/orders/${order.id}`);
          }, onSettled: () => { submission.current = false; } });
        }}>
          <fieldset disabled={mutation.isPending}><legend>Sample fulfilment preference</legend>
            <label className="commerce-radio"><input type="radio" name="method" value="pickup" checked={method === 'pickup'} onChange={() => setMethod('pickup')} />Store pickup</label>
            <label className="commerce-radio"><input type="radio" name="method" value="delivery" checked={method === 'delivery'} onChange={() => setMethod('delivery')} />Delivery</label>
            {method === 'delivery' && <SelectField label="Sample delivery provider" value={provider} error={providerError || undefined} onChange={(event) => { setProvider(event.target.value); setProviderError(''); }}>
              <option value="">Choose a provider</option><option value="pickme">PickMe</option><option value="uber-connect">Uber Connect</option>
            </SelectField>}
          </fieldset>
          <p>Preferences only. Provider availability, fees, addresses and pickup arrangements await approved service contracts.</p>
          <h2>PayHere</h2><p>Not connected. No payment will be requested. Prices and totals are unavailable.</p>
          {error && <p role="alert">{error}</p>}
          {mutation.isError && <p role="alert">The sample order could not be created. Your cart has been kept. Try again.</p>}
          {mutation.isPending && <p role="status">Creating sample order. No payment is being made.</p>}
          <Button ref={submitButton} type="submit" busy={mutation.isPending}>Create sample order</Button>
        </form>
      </section>}
  </>;
}
