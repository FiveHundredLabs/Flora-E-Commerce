import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { categories, categoryNames, searchSchema } from '../../../features/discovery';

const brand = { name: 'Flower & Flora', home: '/' } as const;

type HeaderProps = {
  cartCount: number;
  wishlistCount: number;
  cartOpen: boolean;
  onCartToggle: () => void;
  cartButtonRef: RefObject<HTMLButtonElement | null>;
};

function focusable(container: HTMLElement | null) {
  if (!container) return [];
  return [...container.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter((element) => element.getClientRects().length > 0);
}

export function PublicHeader({ cartCount, wishlistCount, cartOpen, onCartToggle, cartButtonRef }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const navigationId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextQuery = location.pathname === '/products' ? new URLSearchParams(location.search).get('q') ?? '' : '';
    setQuery(nextQuery);
    setSearchError('');
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') closeMenu(true);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  function closeMenu(returnFocus = false) {
    setMenuOpen(false);
    if (returnFocus) requestAnimationFrame(() => menuButton.current?.focus());
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = searchSchema.safeParse(query);
    if (!result.success || !result.data) {
      setSearchError(result.success ? 'Enter a search term.' : 'Use 100 characters or fewer.');
      return;
    }
    setSearchError('');
    closeMenu();
    navigate(`/products?q=${encodeURIComponent(result.data)}`);
  }

  function clearSearch() {
    setQuery('');
    setSearchError('');
    if (location.pathname === '/products' && new URLSearchParams(location.search).has('q')) navigate('/products');
  }

  function containFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = focusable(mobilePanel.current);
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

  const search = (mobile = false) => <form className={`public-search ${mobile ? 'public-search--mobile' : ''}`} role="search" onSubmit={submitSearch} noValidate>
    <label className="sr-only" htmlFor={`${navigationId}-${mobile ? 'mobile' : 'desktop'}-search`}>Search flowers and botanical products</label>
    <div className="public-search__control">
      <Search size={18} aria-hidden="true" />
      <input id={`${navigationId}-${mobile ? 'mobile' : 'desktop'}-search`} type="search" maxLength={101} value={query} onChange={(event) => { setQuery(event.target.value); setSearchError(''); }} aria-invalid={searchError ? true : undefined} aria-describedby={searchError ? `${navigationId}-${mobile ? 'mobile' : 'desktop'}-error` : undefined} placeholder="Search flowers and products" />
      {query && <button type="button" className="public-search__clear" aria-label="Clear search" onClick={clearSearch}><X size={16} aria-hidden="true" /></button>}
      <button type="submit" className="public-search__submit">Search</button>
    </div>
    {searchError && <p className="public-search__error" id={`${navigationId}-${mobile ? 'mobile' : 'desktop'}-error`}>{searchError}</p>}
  </form>;

  const primaryLinks = (mobile = false) => <>
    <NavLink end to="/" className="public-nav__link public-nav__home">Home</NavLink>
    <NavLink to="/products" aria-label="Products" className="public-nav__link">Shop flowers</NavLink>
    <NavLink to="/shops" aria-label="Shops" className="public-nav__link">Explore shops</NavLink>
    <div className="public-nav__categories" aria-label="Shop by category">
      <span>Categories</span>
      <div>{categories.map((category) => {
        const active = location.pathname === '/products' && new URLSearchParams(location.search).get('category') === category;
        return <Link key={category} to={`/products?category=${category}`} aria-current={active ? 'page' : undefined} onClick={() => mobile && closeMenu()}>{categoryNames[category]}</Link>;
      })}</div>
    </div>
    <NavLink to="/about" className="public-nav__link">About</NavLink>
    <NavLink to="/contact" className="public-nav__link">Contact</NavLink>
    <NavLink to="/cart" aria-label="Cart" className="public-nav__link">Cart</NavLink>
  </>;

  return <header className="public-header">
    <div className="public-header__bar">
      <Link to={brand.home} className="public-brand" aria-label={`${brand.name} home`}>{brand.name}<span aria-hidden="true">.</span></Link>
      <nav className="public-nav public-nav--desktop" aria-label="Marketplace navigation">{primaryLinks()}</nav>
      <div className="public-header__actions">
        <Link to="/account/orders" className="public-action" aria-label="Sample orders"><UserRound size={20} aria-hidden="true" /><span>Orders</span></Link>
        <Link to="/wishlist" className="public-action public-action--wishlist" aria-label={`Wishlist with ${wishlistCount} items`}><Heart size={20} aria-hidden="true" /><span>Wishlist</span>{wishlistCount > 0 && <b aria-hidden="true">{wishlistCount}</b>}</Link>
        <button ref={cartButtonRef} type="button" className="public-action" aria-label={`Shopping cart with ${cartCount} items`} aria-expanded={cartOpen} onClick={onCartToggle}><ShoppingBag size={20} aria-hidden="true" /><span>Cart</span>{cartCount > 0 && <b aria-hidden="true">{cartCount}</b>}</button>
        <button ref={menuButton} type="button" className="public-menu-button" aria-label="Menu" aria-expanded={menuOpen} aria-controls={navigationId} onKeyDown={(event) => { if (menuOpen && event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); mobilePanel.current?.querySelector<HTMLElement>('.public-nav--mobile a[href]')?.focus(); } }} onClick={() => setMenuOpen((open) => !open)}><Menu size={22} aria-hidden="true" /><span>Menu</span></button>
      </div>
    </div>
    <div className="public-header__search">{search()}</div>
    <div className={`public-menu-overlay ${menuOpen ? 'is-open' : ''}`} aria-hidden="true" onClick={() => closeMenu(true)} />
    <div ref={mobilePanel} id={navigationId} className={`public-menu ${menuOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined} onKeyDown={containFocus}>
      <div className="public-menu__heading"><span className="public-brand">{brand.name}<span aria-hidden="true">.</span></span><button type="button" aria-label="Close navigation" onClick={() => closeMenu(true)}><X aria-hidden="true" /></button></div>
      {search(true)}
      <nav className="public-nav public-nav--mobile" aria-label="Marketplace navigation">{primaryLinks(true)}<NavLink to="/wishlist" className="public-nav__link">Wishlist</NavLink><NavLink to="/account/orders" className="public-nav__link">Sample orders</NavLink><NavLink to="/supplier" className="public-nav__link">Supplier workspace</NavLink></nav>
    </div>
  </header>;
}

export function PublicFooter() {
  return <footer className="public-footer">
    <div className="public-footer__inner">
      <div><Link to={brand.home} className="public-footer__brand">{brand.name}<span aria-hidden="true">.</span></Link><p>A sample marketplace for discovering floral products and the supplier stores behind them.</p></div>
      <nav aria-label="Shop links"><h2>Discover</h2><Link to="/products">Shop flowers</Link><Link to="/shops">Explore shops</Link><Link to="/wishlist">Wishlist</Link></nav>
      <nav aria-label="Information links"><h2>Information</h2><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/account/orders">Sample orders</Link></nav>
      <nav aria-label="Supplier links"><h2>For suppliers</h2><Link to="/supplier">Supplier workspace</Link><Link to="/supplier/register">Sample registration</Link></nav>
    </div>
    <div className="public-footer__bottom"><span>Flower & Flora marketplace preview</span><span>No live accounts, payments, delivery quotes or orders.</span></div>
  </footer>;
}
