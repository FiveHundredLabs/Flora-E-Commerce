import { Link } from 'react-router';

export function Breadcrumbs({ items, current }: { items: readonly { label: string; to: string }[]; current: string }) {
  return <nav aria-label="Breadcrumb"><ol className="breadcrumbs">
    {items.map((item) => <li key={item.to}><Link to={item.to}>{item.label}</Link><span aria-hidden="true">/</span></li>)}
    <li><span aria-current="page">{current}</span></li>
  </ol></nav>;
}
