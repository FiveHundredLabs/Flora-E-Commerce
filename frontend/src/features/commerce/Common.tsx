import { Badge } from '../../shared/components/ui/Content';
import type { CartLine, CommerceCatalog, SampleOrder } from './model';

export function CommerceNotice() {
  return <div className="commerce-notice"><Badge>Sample commerce · MOCK</Badge><p>No real orders, charges, reservations or delivery bookings. Cart, orders and feedback reset when this page is refreshed.</p></div>;
}
export function LineSummary({ items, catalog }: { items: CartLine[]; catalog: CommerceCatalog }) {
  return <ul className="commerce-lines">{items.map((line) => <li key={`${line.storeSlug}/${line.productSlug}`}>
    <span>{catalog.products.find((product) => product.slug === line.productSlug && product.storeSlug === line.storeSlug)?.name ?? 'Unavailable sample item'}</span><span>Quantity: {line.quantity}</span>
  </li>)}</ul>;
}
export function PaymentSummary({ order }: { order: SampleOrder }) {
  return <><h2>Payment status</h2>{order.paymentStatus
    ? <p>{order.paymentStatus} (sample example only). No real payment record is connected.</p>
    : <p>PayHere is not connected. No payment has been requested.</p>}
    <p>Currency, prices, totals and payment methods await approved contracts.</p></>;
}
