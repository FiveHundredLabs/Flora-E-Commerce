import { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, CircleOff, PackageCheck, ReceiptText, Store } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { AsyncRegion } from '../../shared/components/AsyncRegion';
import { Button } from '../../shared/components/ui/Button';
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
      if (mutation.isError) input.current?.focus(); else if (mutation.isSuccess) saveButton.current?.focus();
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
    <p>Text-only sample feedback. It stays in this session and is not published; rating and moderation rules are not approved.</p>
    <div className="field"><label htmlFor={id}>Sample feedback</label><textarea id={id} ref={input} value={comment} onChange={(event) => { setComment(event.target.value); if (mutation.isSuccess) mutation.reset(); }} rows={5} required disabled={mutation.isPending} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} />{error && <p className="field__error" id={`${id}-error`}>{error}</p>}</div>
    {mutation.isError && <p role="alert">Sample feedback could not be saved. Your text has been kept.</p>}
    <Button ref={saveButton} type="submit" busy={mutation.isPending}>Save sample feedback</Button>
    {mutation.isPending && <p role="status">Saving sample feedback.</p>}{mutation.isSuccess && <p role="status">Sample feedback saved for this session only.</p>}
  </form>;
}

function storeName(catalog: CommerceCatalog, slug: string) {
  return catalog.stores.find((store) => store.slug === slug)?.name ?? 'Unavailable sample shop';
}

export function OrdersScreen({ catalog, adapter }: { catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const query = useOrders(adapter);
  useEffect(() => { document.title = 'Sample orders | Flower & Flora'; }, []);
  return <div className="customer-page orders-page">
    <header className="customer-hero"><p className="customer-eyebrow"><ReceiptText size={15} aria-hidden="true" /> Session order archive</p><h1>Sample orders</h1><p>Review the commerce records created in this local preview.</p></header>
    <CommerceNotice />
    <nav className="account-nav" aria-label="Customer area"><Link to="/wishlist">Saved flowers</Link><Link to="/account/orders" aria-current="page">Sample orders</Link><span aria-disabled="true">Profile unavailable</span></nav>
    <AsyncRegion title="Order history" state={query.isPending || (query.isFetching && !query.data) ? { status: 'loading' } : query.isError ? { status: 'error', onRetry: () => { void query.refetch(); } } : query.data.length === 0 ? { status: 'empty', message: 'There are no sample orders in this session.' } : { status: 'ready', children: <ul className="order-list">{query.data.map((order) => <li key={order.id}>
      <div className="order-card__icon"><Store aria-hidden="true" /></div><div className="order-card__body"><p className="customer-eyebrow">{order.delivered ? 'Delivered sample' : 'Created sample'}</p><h2><Link to={`/account/orders/${order.id}`}>{storeName(catalog, order.storeSlug)}</Link></h2><p>Reference <strong>{order.id}</strong> · {order.items.reduce((sum, line) => sum + line.quantity, 0)} {order.items.reduce((sum, line) => sum + line.quantity, 0) === 1 ? 'item' : 'items'}</p><p>Payment: {order.paymentStatus ? `${order.paymentStatus} (sample example)` : 'not connected'}</p><p className="order-card__unavailable">Order date and total are unavailable in the current contract.</p></div><Link className="order-card__link" to={`/account/orders/${order.id}`}>View details</Link>
    </li>)}</ul> }} />
  </div>;
}

export function OrderScreen({ catalog, adapter }: { catalog: CommerceCatalog; adapter?: CommerceAdapter }) {
  const { orderId } = useParams();
  const query = useOrders(adapter);
  const order = query.data?.find((item) => item.id === orderId);
  useEffect(() => { document.title = 'Sample order | Flower & Flora'; }, []);
  return <div className="customer-page order-page">
    <header className="customer-hero"><p className="customer-eyebrow"><PackageCheck size={15} aria-hidden="true" /> Session receipt</p><h1>Sample order</h1><p>{orderId ? `Reference ${orderId}` : 'Order reference unavailable'}</p></header>
    <CommerceNotice />
    <AsyncRegion title="Order details" state={query.isPending || (query.isFetching && (!query.data || !order)) ? { status: 'loading' } : query.isError ? { status: 'error', onRetry: () => { void query.refetch(); } } : !order ? { status: 'empty', message: 'This sample order could not be found.' } : { status: 'ready', children: <div className="order-detail-grid">
      <section className="order-detail-card"><p className="customer-eyebrow">Supplier and items</p><h2>{storeName(catalog, order.storeSlug)}</h2><p>Order reference: <strong>{order.id}</strong></p><LineSummary items={order.items} catalog={catalog} /><p>Variants, add-ons, unit prices and totals are unavailable.</p></section>
      <section className="order-detail-card"><p className="customer-eyebrow">Fulfilment</p><h2>{order.delivered ? 'Delivered sample' : 'Created sample'}</h2><p>{order.preference.method === 'pickup' ? 'Store pickup preference (sample only).' : `Delivery preference: ${order.preference.provider === 'pickme' ? 'PickMe' : 'Uber Connect'} (sample only).`}</p><p>No verified address, pickup instructions, provider booking, tracking link, timeline or backend event history is connected.</p></section>
      <section className="order-detail-card"><p className="customer-eyebrow">Payment</p><PaymentSummary order={order} /></section>
      <section className="order-detail-card"><p className="customer-eyebrow"><CircleOff size={15} aria-hidden="true" /> Refunds</p><h2>Refund requests unavailable</h2><p>Eligibility, partial refunds, cancellation timing and the PayHere refund API remain undecided.</p></section>
    </div> }} />
    {order && !query.isError && <section className="feedback-card" aria-labelledby="feedback-title"><p className="customer-eyebrow"><CheckCircle2 size={15} aria-hidden="true" /> Verified-order feedback</p><h2 id="feedback-title">Store feedback</h2>{order.delivered && order.canReview ? <FeedbackForm key={order.id} order={order} adapter={adapter} /> : <p>Feedback is unavailable. The order must be delivered and the service must confirm eligibility.</p>}</section>}
    <Link className="order-back-link" to="/account/orders">Back to sample orders</Link>
  </div>;
}
