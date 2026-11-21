import { useContext, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { QueryClientContext } from '@tanstack/react-query';
import { FolderTree, LayoutDashboard, MessageSquare, Minus, Plus, Receipt, ShoppingBag, Store, Users, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Content';
import { useWishlist } from '../../../features/discovery';
import { cartActions, useCartDispatch, useCartDrawer, useCartSelector, type CartLine } from '../../../features/commerce';
import type { AdminWorkspace } from '../../../features/admin/model';
import { PublicFooter, PublicHeader } from './PublicChrome';

type Audience = 'customer' | 'supplier' | 'admin';
const navigation = {
  customer: { title: 'Marketplace', home: '/', homeLabel: 'Home' },
  supplier: { title: 'Supplier workspace', home: '/supplier', homeLabel: 'Overview' },
  admin: { title: 'Super admin workspace', home: '/admin', homeLabel: 'Overview' },
} satisfies Record<Audience, { title: string; home: string; homeLabel: string }>;

function focusable(container: HTMLElement | null) {
  if (!container) return [];
  return [...container.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter((element) => element.getClientRects().length > 0);
}

export function Shell({ audience, children }: { audience: Audience; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const navigationId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const cartDrawerRef = useRef<HTMLElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const config = navigation[audience];
  const workspace = audience !== 'customer';
  const wishlist = useWishlist();
  const cartDrawer = useCartDrawer();
  const lines = useCartSelector((state) => state.cart.lines);
  const dispatch = useCartDispatch();
  const queryClient = useContext(QueryClientContext);

  const adminWorkspace = useSyncExternalStore(
    (callback) => (audience === 'admin' && queryClient ? queryClient.getQueryCache().subscribe(callback) : () => {}),
    () => {
      if (audience !== 'admin' || !queryClient) return undefined;
      for (const [, data] of queryClient.getQueriesData<AdminWorkspace>({ queryKey: ['MOCK', 'admin'] })) if (data?.access === 'allowed') return data;
      return undefined;
    },
    () => undefined,
  );

  const adminCounts = useMemo(() => {
    if (!adminWorkspace || adminWorkspace.access !== 'allowed') return null;
    const records = adminWorkspace.records;
    return {
      suppliers: records.filter((record) => record.kind === 'suppliers' && record.status === 'pending').length,
      users: records.filter((record) => record.kind === 'users').length,
      categories: records.filter((record) => record.kind === 'categories').length,
      orders: records.filter((record) => record.kind === 'orders').length,
      refunds: records.filter((record) => record.kind === 'refunds' && record.status === 'pending').length,
      reviews: records.filter((record) => record.kind === 'reviews' && record.status === 'flagged').length,
    };
  }, [adminWorkspace]);

  const totalCartCount = lines.reduce((total, line) => total + line.quantity, 0);
  const storeGroups = lines.reduce<Record<string, CartLine[]>>((groups, line) => {
    (groups[line.storeSlug] ??= []).push(line);
    return groups;
  }, {});

  useEffect(() => {
    if (!cartDrawer.isOpen) return;
    requestAnimationFrame(() => cartDrawerRef.current?.querySelector<HTMLElement>('[data-cart-close]')?.focus());
  }, [cartDrawer.isOpen]);

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (cartDrawer.isOpen) {
        cartDrawer.close();
        requestAnimationFrame(() => cartButtonRef.current?.focus());
      }
      if (expanded) {
        setExpanded(false);
        requestAnimationFrame(() => toggle.current?.focus());
      }
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [cartDrawer, expanded]);

  function containCartFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') return;
    const controls = focusable(cartDrawerRef.current);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const closeCart = (returnFocus = false) => {
    cartDrawer.close();
    if (returnFocus) requestAnimationFrame(() => cartButtonRef.current?.focus());
  };

  return <div className={`shell shell--${audience}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    {workspace ? <header className="shell__header">
      <div className="shell__brand"><Link to="/">Flower & Flora</Link><span className="shell__eyebrow">{config.title}</span></div>
      <Badge>Sample workspace</Badge>
      <Button ref={toggle} className="shell__toggle" variant="secondary" aria-expanded={expanded} aria-controls={navigationId} onClick={() => setExpanded((value) => !value)}>Menu</Button>
    </header> : <PublicHeader cartCount={totalCartCount} wishlistCount={wishlist.count} cartOpen={cartDrawer.isOpen} onCartToggle={cartDrawer.toggle} cartButtonRef={cartButtonRef} />}

    <div className="shell__body">
      {workspace && <nav id={navigationId} className={`shell__nav ${expanded ? 'is-open' : ''}`} aria-label={`${config.title} navigation`} onKeyDown={(event) => { if (event.key === 'Escape' && expanded) { setExpanded(false); toggle.current?.focus(); } }}>
        <span className="shell__nav-label">Workspace</span>
        <NavLink end to={config.home} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>{audience === 'admin' && <LayoutDashboard size={16} aria-hidden="true" className="shell__nav-icon" />}<span>{config.homeLabel}</span></NavLink>
        {audience === 'supplier' && ([['/supplier/register', 'Registration'], ['/supplier/profile', 'Store profile'], ['/supplier/products', 'Products'], ['/supplier/inventory', 'Inventory'], ['/supplier/orders', 'Orders'], ['/supplier/sales', 'Sales']] as const).map(([to, label]) => <NavLink key={to} to={to} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>{label}</NavLink>)}
        {audience === 'admin' && <>
          <span className="shell__nav-section-title">Marketplace Oversight</span>
          {([['/admin/suppliers', 'Suppliers', Store, adminCounts?.suppliers], ['/admin/users', 'Users', Users, adminCounts?.users], ['/admin/categories', 'Categories', FolderTree, adminCounts?.categories], ['/admin/orders', 'Orders', ShoppingBag, adminCounts?.orders], ['/admin/refunds', 'Refund requests', Receipt, adminCounts?.refunds], ['/admin/reviews', 'Feedback', MessageSquare, adminCounts?.reviews]] as const).map(([to, label, Icon, count]) => <NavLink key={to} to={to} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}><Icon size={16} aria-hidden="true" className="shell__nav-icon" /><span>{label}</span>{count !== undefined && count > 0 && <span aria-hidden="true" className="nav-badge-pill admin-nav-badge">{count}</span>}</NavLink>)}
        </>}
        <Link to="/" onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>Return to marketplace</Link>
      </nav>}
      <main id="main" tabIndex={-1}>{children}</main>
    </div>

    {workspace ? <footer className="shell__footer"><span>Flower & Flora</span><span>Sample workspace — no live marketplace operations.</span></footer> : <>
      <div className={`cart-drawer-overlay ${cartDrawer.isOpen ? 'is-visible' : ''}`} aria-hidden="true" onClick={() => closeCart(true)} />
      <aside ref={cartDrawerRef} className={`cart-drawer ${cartDrawer.isOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping Cart Drawer" aria-hidden={!cartDrawer.isOpen} inert={!cartDrawer.isOpen ? true : undefined} onKeyDown={containCartFocus}>
        <div className="cart-drawer__header"><h2 className="cart-drawer__title">Your Floral Cart ({totalCartCount})</h2><button data-cart-close type="button" className="cart-drawer__close" aria-label="Close cart drawer" onClick={() => closeCart(true)}><X size={20} aria-hidden="true" /></button></div>
        <div className="cart-drawer__body">
          {lines.length === 0 ? <div className="cart-drawer__empty"><ShoppingBag size={48} strokeWidth={1.5} aria-hidden="true" /><p>Your sample cart is currently empty.</p><Link to="/products" className="cart-drawer__browse-btn" onClick={() => closeCart()}>Browse floral products</Link></div> : <div className="cart-drawer__groups">
            <p className="cart-drawer__notice">Sample items are grouped by supplier store. Checkout remains per store.</p>
            {Object.entries(storeGroups).map(([storeSlug, storeLines]) => <section key={storeSlug} className="cart-drawer__store-group" aria-label={storeSlug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}>
              <div className="cart-drawer__store-header"><span className="store-badge-label">Supplier store</span><Link to={`/shops/${storeSlug}`} onClick={() => closeCart()} className="store-name-link">{storeSlug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}</Link></div>
              <ul className="cart-drawer__items-list">{storeLines.map((line) => <li key={line.productSlug} className="cart-drawer__item"><div className="cart-drawer__item-info"><Link to={`/products/${line.productSlug}`} className="cart-drawer__item-name" onClick={() => closeCart()}>{line.productSlug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}</Link><span>Quantity {line.quantity}</span></div><div className="cart-drawer__item-stepper"><button type="button" className="stepper-btn" aria-label={`Decrease quantity of ${line.productSlug}`} onClick={() => line.quantity > 1 ? dispatch(cartActions.update({ ...line, quantity: line.quantity - 1 })) : dispatch(cartActions.remove(line))}><Minus size={14} aria-hidden="true" /></button><span className="stepper-val">{line.quantity}</span><button type="button" className="stepper-btn" aria-label={`Increase quantity of ${line.productSlug}`} disabled={line.quantity >= 99} onClick={() => dispatch(cartActions.update({ ...line, quantity: Math.min(99, line.quantity + 1) }))}><Plus size={14} aria-hidden="true" /></button><button type="button" className="remove-item-btn" aria-label={`Remove ${line.productSlug} from cart`} onClick={() => dispatch(cartActions.remove(line))}>Remove</button></div></li>)}</ul>
              <div className="cart-drawer__store-checkout"><Link to={`/checkout?store=${storeSlug}`} className="store-checkout-btn" onClick={() => closeCart()}>Checkout with this Store</Link></div>
            </section>)}
          </div>}
        </div>
        {lines.length > 0 && <div className="cart-drawer__footer"><Link to="/cart" className="view-cart-full-btn" onClick={() => closeCart()}>Review full sample cart</Link></div>}
      </aside>
      <PublicFooter />
    </>}
  </div>;
}
