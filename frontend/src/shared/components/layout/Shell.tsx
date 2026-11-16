import { useId, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Content';

type Audience = 'customer' | 'supplier' | 'admin';
const navigation = {
  customer: { title: 'Marketplace', home: '/', homeLabel: 'Marketplace' },
  supplier: { title: 'Supplier workspace', home: '/supplier', homeLabel: 'Overview' },
  admin: { title: 'Super admin workspace', home: '/admin', homeLabel: 'Overview' },
} satisfies Record<Audience, { title: string; home: string; homeLabel: string }>;

export function Shell({ audience, children }: { audience: Audience; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const navigationId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const config = navigation[audience];
  const workspace = audience !== 'customer';
  return <div className={`shell shell--${audience}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="shell__header">
      <div className="shell__brand"><Link to="/">Flower & Flora</Link><span className="shell__eyebrow">{config.title}</span></div>
      {workspace && <Badge>{audience === 'supplier' ? 'Sample workspace' : 'Layout preview'}</Badge>}
      <Button ref={toggle} className="shell__toggle" variant="secondary" aria-expanded={expanded} aria-controls={navigationId}
        onKeyDown={(event) => { if (event.key === 'Escape') setExpanded(false); }}
        onClick={() => setExpanded((value) => !value)}>Menu</Button>
    </header>
    <div className="shell__body">
      <nav id={navigationId} className={`shell__nav ${expanded ? 'is-open' : ''}`} aria-label={`${config.title} navigation`}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && expanded) { setExpanded(false); toggle.current?.focus(); }
        }}>
        <span className="shell__nav-label">{workspace ? 'Workspace' : 'Explore'}</span>
        <NavLink end to={config.home} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>{config.homeLabel}</NavLink>
        {!workspace && <>
          <NavLink to="/shops" onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>Shops</NavLink>
          <NavLink to="/products" onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>Products</NavLink>
          <NavLink to="/cart" onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>Cart</NavLink>
          <NavLink to="/account/orders" onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>Orders</NavLink>
        </>}
        {audience === 'supplier' && <>
          {([
            ['/supplier/register', 'Registration'], ['/supplier/profile', 'Store profile'], ['/supplier/products', 'Products'],
            ['/supplier/inventory', 'Inventory'], ['/supplier/orders', 'Orders'], ['/supplier/sales', 'Sales'],
          ] as const).map(([to, label]) => <NavLink key={to} to={to} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>{label}</NavLink>)}
        </>}
        {workspace && <Link to="/" onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>Return to marketplace</Link>}
      </nav>
      <main id="main" tabIndex={-1}>{children}</main>
    </div>
    <footer className="shell__footer"><span>Flower & Flora</span><span>Growing a place for all things floral.</span></footer>
  </div>;
}
