import { Link } from 'react-router';

export function Breadcrumbs({
  items,
  current,
  variant = 'public',
  className = '',
}: {
  items: readonly { label: string; to: string }[];
  current: string;
  variant?: 'public' | 'dashboard';
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs-nav breadcrumbs-nav--${variant} ${className}`.trim()}>
      <ol className="breadcrumbs">
        {items.map((item) => (
          <li key={item.to}>
            <Link to={item.to}>{item.label}</Link>
            <span className="breadcrumbs__separator" aria-hidden="true">/</span>
          </li>
        ))}
        <li>
          <span className="breadcrumbs__current" aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
