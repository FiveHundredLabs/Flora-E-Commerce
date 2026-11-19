import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../shared/components/ui/Button';
import { cartActions, useCartDispatch, useCartSelector } from './cart';
import { openCartDrawer } from './cartDrawer';

export function AddSampleProduct({
  productSlug,
  storeSlug,
  name,
  quantityToAdd = 1,
}: {
  productSlug: string;
  storeSlug: string;
  name: string;
  quantityToAdd?: number;
}) {
  const dispatch = useCartDispatch();
  const navigate = useNavigate();
  const currentQuantity = useCartSelector(
    (state) => state.cart.lines.find((line) => line.productSlug === productSlug && line.storeSlug === storeSlug)?.quantity ?? 0,
  );
  const [message, setMessage] = useState('');

  const addItems = (count: number) => {
    const toAdd = Math.min(Math.max(1, count), 99 - currentQuantity);
    for (let i = 0; i < toAdd; i++) {
      dispatch(cartActions.add({ productSlug, storeSlug }));
    }
    return toAdd;
  };

  const handleAddToCart = () => {
    const added = addItems(quantityToAdd);
    if (added > 0) {
      setMessage(`Added ${added > 1 ? `${added} × ` : ''}${name} to your sample cart.`);
      openCartDrawer();
    }
  };

  const handleBuyItNow = () => {
    addItems(quantityToAdd);
    navigate(`/checkout?store=${storeSlug}`);
  };

  return (
    <div className="commerce-add">
      <div className="pdp-buy-buttons-group">
        <Button
          type="button"
          variant="primary"
          className="pdp-add-cart-btn"
          disabled={currentQuantity >= 99}
          onClick={handleAddToCart}
        >
          Add to sample cart
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="pdp-buy-now-btn"
          disabled={currentQuantity >= 99}
          onClick={handleBuyItNow}
        >
          BUY IT NOW
        </Button>
      </div>
      <p>Sample cart only. No stock reservation or price is implied.</p>
      {currentQuantity >= 99 && <p>Sample quantity limit reached (99).</p>}
      <p role="status">{message}</p>
    </div>
  );
}
