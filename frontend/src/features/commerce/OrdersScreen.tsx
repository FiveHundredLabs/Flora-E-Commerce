import { useEffect, useId, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Content';
import { CommerceNotice, LineSummary, PaymentSummary } from './Common';
import { feedbackSchema, type CommerceCatalog, type SampleOrder } from './model';
import { useFeedback, useOrders } from './query';
import type { CommerceAdapter } from './api/mock';

function FeedbackForm({ order, adapter }: { order: SampleOrder; adapter?: CommerceAdapter }) {
  const [comment, setComment] = useState(order.review ?? '');
  const [error, setError] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const mutation = useFeedback(adapter);
  const submitted = useRef(false);
  const saveButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mutation.isPending && document.activeElement === document.body) {
      if (mutation.isError) input.current?.focus();
      else if (mutation.isSuccess) saveButton.current?.focus();
    }
  }, [mutation.isPending, mutation.isError, mutation.isSuccess]);
  return <form className="commerce-feedback" noValidate onSubmit={(event) => {
    event.preventDefault();
    if (submitted.current) return;
    const parsed = feedbackSchema.safeParse({ orderId: order.id, comment });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check sample feedback.'); input.current?.focus(); return; }
    setError(''); setComment(parsed.data.comment); submitted.current = true;
    mutation.mutate(parsed.data, { onSettled: () => { submitted.current = false; } });
  }}>
    <p>Sample text-only feedback. It is not published; the final rating and moderation format is not yet approved.</p>
    <div className="field"><label htmlFor={id}>Sample feedback</label>
      <textarea id={id} ref={input} value={comment} onChange={(event) => { setComment(event.target.value); if (mutation.isSuccess) mutation.reset(); }} rows={5} required disabled={mutation.isPending}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p className="field__error" id={`${id}-error`}>{error}</p>}
    </div>
    {mutation.isError && <p role="alert">Sample feedback could not be saved. Your text has been kept.</p>}
    <Button ref={saveButton} type="submit" busy={mutation.isPending}>Save sample feedback</Button>
    {mutation.isPending && <p role="status">Saving sample feedback.</p>}
    {mutation.isSuccess && <p role="status">Sample feedback saved for this session only.</p>}
  </form>;
}

export function OrdersScreen({ catalog, adapter }: { catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const query = useOrders(adapter);
  return <>
    <div className="page-heading"><h1>Sample orders</h1><p>Explore order history without making a purchase.</p></div><CommerceNotice />
    <AsyncRegion title="Order history" state={query.isPending || (query.isFetching && !query.data) ? { status: 'loading' }
      : query.isError ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : query.data.length === 0 ? { status: 'empty', message: 'There are no sample orders in this session.' }
      : { status: 'ready', children: <ul className="order-list">{query.data.map((order) => <li key={order.id}>
        <h3><Link to={`/account/orders/${order.id}`}>{order.id}</Link></h3>
        <p>{catalog.stores.find((store) => store.slug === order.storeSlug)?.name ?? 'Sample shop'} · {order.delivered ? 'Delivered (sample)' : 'Created (sample)'}</p>
        <p>Payment: {order.paymentStatus ? `${order.paymentStatus} (sample)` : 'not connected'}</p>
      </li>)}</ul> }} />
  </>;
}

export function OrderScreen({ catalog, adapter }: { catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const { orderId } = useParams();
  const query = useOrders(adapter);
  const order = query.data?.find((item) => item.id === orderId);
  useEffect(() => { document.title = 'Sample order | Flower & Flora'; }, []);
  return <>
    <div className="page-heading"><h1>Sample order</h1></div><CommerceNotice />
    <AsyncRegion title="Order details" state={query.isPending || (query.isFetching && (!query.data || !order)) ? { status: 'loading' }
      : query.isError ? { status: 'error', onRetry: () => { void query.refetch(); } }
      : !order ? { status: 'empty', message: 'This sample order could not be found.' }
      : { status: 'ready', children: <>
        <p>Reference: {order.id}</p><h3>{catalog.stores.find((store) => store.slug === order.storeSlug)?.name ?? 'Sample shop'}</h3>
        <LineSummary items={order.items} catalog={catalog} />
        <p>Fulfilment: {order.preference.method === 'pickup' ? 'store pickup' : `delivery preference — ${order.preference.provider === 'pickme' ? 'PickMe' : 'Uber Connect'}`} (sample only)</p>
        <p>Order state: {order.delivered ? 'Delivered (sample fixture)' : 'Created (sample only; no real fulfilment is underway)'}</p>
        <PaymentSummary order={order} />
      </> }} />
    {order && !query.isError && <Card title="Store feedback">
      {order.delivered && order.canReview ? <FeedbackForm key={order.id} order={order} adapter={adapter} />
        : <p>Feedback is not available for this sample order. Real eligibility will be confirmed by the service after delivery.</p>}
    </Card>}
    <Link to="/account/orders">Back to sample orders</Link>
  </>;
}
