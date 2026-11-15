import { useState } from 'react';
import { Button } from '../../shared/components/ui/Button';
import { cartActions, useCartDispatch, useCartSelector } from './cart';

export function AddSampleProduct({ productSlug, storeSlug, name }: { productSlug: string; storeSlug: string; name: string }) {
  const dispatch = useCartDispatch();
  const quantity = useCartSelector((state) => state.cart.lines.find((line) => line.productSlug === productSlug && line.storeSlug === storeSlug)?.quantity ?? 0);
  const [message, setMessage] = useState('');
  return <div className="commerce-add"><Button disabled={quantity >= 99} onClick={() => {
    dispatch(cartActions.add({ productSlug, storeSlug })); setMessage(`Added ${name} to your sample cart.`);
  }}>Add to sample cart</Button>
    <p>Sample cart only. No stock reservation or price is implied.</p>
    {quantity >= 99 && <p>Sample quantity limit reached (99).</p>}
    <p role="status">{message}</p>
  </div>;
}
