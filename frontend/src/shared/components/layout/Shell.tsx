import { useContext, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { QueryClientContext } from '@tanstack/react-query';
import { Search, User, Heart, ShoppingBag, X, Plus, Minus, Store, Users, FolderTree, Receipt, MessageSquare, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Content';
import { useWishlist } from '../../../features/discovery';
import { useCartDrawer, cartActions, useCartDispatch, useCartSelector, type CartLine } from '../../../features/commerce';
import type { AdminWorkspace } from '../../../features/admin/model';

type Audience = 'customer' | 'supplier' | 'admin';

export type AuthRole = 'customer' | 'supplier' | 'admin';

export type AuthUser = {
  name: string;
  email?: string;
  role: AuthRole;
  isAuthenticated?: boolean;
};

export type ShellProps = {
  audience: Audience;
  children: ReactNode;
  brandName?: string;
  brandTagline?: string;
  logoSrc?: string;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
};

const navigation = {
  customer: { title: 'Marketplace', home: '/', homeLabel: 'Home' },
  supplier: { title: 'Supplier workspace', home: '/supplier', homeLabel: 'Overview' },
  admin: { title: 'Super admin workspace', home: '/admin', homeLabel: 'Overview' },
} satisfies Record<Audience, { title: string; home: string; homeLabel: string }>;

function useSafeCart() {
  const lines = useCartSelector((state) => state.cart.lines);
  const dispatch = useCartDispatch();
  return { lines, dispatch };
}

export function Shell({
  audience,
  children,
  brandName = 'Flower & Flora',
  brandTagline = 'Botanical Studio & Marketplace',
  logoSrc,
  currentUser,
  onLogout,
}: ShellProps) {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigationId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const cartDrawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchMobileInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountToggleRef = useRef<HTMLButtonElement>(null);
  const config = navigation[audience];
  const workspace = audience !== 'customer';
  const navigate = useNavigate();

  const effectiveUser: AuthUser = useMemo(() => {
    if (currentUser) return currentUser;
    if (audience === 'admin') {
      return { name: 'Super Admin', role: 'admin', isAuthenticated: true };
    }
    if (audience === 'supplier') {
      return { name: 'Artisan Florist', role: 'supplier', isAuthenticated: true };
    }
    return { name: 'Guest Customer', role: 'customer', isAuthenticated: false };
  }, [currentUser, audience]);

  const wishlist = useWishlist();
  const cartDrawer = useCartDrawer();
  const { lines, dispatch } = useSafeCart();
  const queryClient = useContext(QueryClientContext);

  const adminWorkspace = useSyncExternalStore(
    (callback) => (audience === 'admin' && queryClient ? queryClient.getQueryCache().subscribe(callback) : () => {}),
    () => {
      if (audience !== 'admin' || !queryClient) return undefined;
      const entries = queryClient.getQueriesData<AdminWorkspace>({ queryKey: ['MOCK', 'admin'] });
      for (const [, data] of entries) {
        if (data?.access === 'allowed') return data;
      }
      return undefined;
    },
    () => undefined
  );

  const adminCounts = useMemo(() => {
    if (!adminWorkspace || adminWorkspace.access !== 'allowed') return null;
    const records = adminWorkspace.records;
    return {
      suppliers: records.filter((r) => r.kind === 'suppliers' && r.status === 'pending').length,
      users: records.filter((r) => r.kind === 'users').length,
      categories: records.filter((r) => r.kind === 'categories').length,
      orders: records.filter((r) => r.kind === 'orders').length,
      refunds: records.filter((r) => r.kind === 'refunds' && r.status === 'pending').length,
      reviews: records.filter((r) => r.kind === 'reviews' && r.status === 'flagged').length,
    };
  }, [adminWorkspace]);

  const totalCartCount = lines.reduce((acc, line) => acc + line.quantity, 0);
  const cartSubtotal = totalCartCount * 38;

  // Group cart lines by store (OD-02 compliant)
  const storeGroups = lines.reduce<Record<string, CartLine[]>>((acc, line) => {
    if (!acc[line.storeSlug]) acc[line.storeSlug] = [];
    acc[line.storeSlug]!.push(line);
    return acc;
  }, {});

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Outside click closes account menu
  useEffect(() => {
    if (!isAccountOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isAccountOpen]);

  // Close overlays on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAccountOpen) {
          setIsAccountOpen(false);
          accountToggleRef.current?.focus();
        }
        if (cartDrawer.isOpen) cartDrawer.close();
        if (expanded) {
          setExpanded(false);
          toggle.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartDrawer, expanded, isAccountOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().slice(0, 100);
    if (query) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
      if (expanded) {
        setExpanded(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
    searchMobileInputRef.current?.focus();
  };

  return (
    <div className={`shell shell--${audience}`}>
      <a className="skip-link" href="#main">Skip to content</a>

      {workspace ? (
        <header className="shell__header">
          <div className="shell__brand">
            <Link to="/">Flower & Flora</Link>
            <span className="shell__eyebrow">{config.title}</span>
          </div>
          <Badge>Sample workspace</Badge>
          <Button
            ref={toggle}
            className="shell__toggle"
            variant="secondary"
            aria-expanded={expanded}
            aria-controls={navigationId}
            onKeyDown={(event) => { if (event.key === 'Escape') setExpanded(false); }}
            onClick={() => setExpanded((value) => !value)}
          >
            Menu
          </Button>
        </header>
      ) : (
        <>
          {/* Tier 1: Top Announcement & Utility Bar */}
          <div className="top-utility-bar">
            <div className="top-utility-bar__inner">
              <div className="top-utility-bar__message">
                <span>Artisanal Botanical Studio &amp; Marketplace · Curated Independent Florists across Sri Lanka</span>
              </div>
              <div className="top-utility-bar__links">
                <Link to="/account/orders" className="utility-link">Track Orders</Link>
                <span className="utility-divider" aria-hidden="true">|</span>
                <Link to="/supplier" className="utility-link">Supplier Portal</Link>
                <span className="utility-divider" aria-hidden="true">|</span>
                <Link to="/admin" className="utility-link">Admin Access</Link>
              </div>
            </div>
          </div>

          {/* Tier 2: Main Header Row */}
          <header className={`shell__header fiama-header ${isScrolled ? 'is-sticky' : ''}`} role="banner">
            <div className="fiama-header__inner">
              {/* Brand Logo & Botanical Identity */}
              <div className="shell__brand">
                <Link to="/" className="brand-logo" aria-label={`${brandName} home`}>
                  {logoSrc && !logoError ? (
                    <img
                      src={logoSrc}
                      alt={brandName}
                      className="brand-logo-img"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <>
                      <span className="brand-logo-text">{brandName}</span>
                      <span className="brand-dot" aria-hidden="true">.</span>
                    </>
                  )}
                </Link>
                {brandTagline && (
                  <span className="shell__eyebrow" aria-hidden="true">
                    {brandTagline}
                  </span>
                )}
              </div>

              {/* Centered Search Pill (Customer mode) */}
              <form className="header-search-form" onSubmit={handleSearchSubmit} role="search">
                <div className="search-pill-wrapper">
                  <Search size={18} aria-hidden="true" className="search-pill-icon" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    className="search-pill-input"
                    placeholder="Search flowers, bouquets, florists..."
                    aria-label="Search catalog"
                    value={searchQuery}
                    maxLength={100}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape' && searchQuery) {
                        e.stopPropagation();
                        setSearchQuery('');
                      }
                    }}
                  />
                  {searchQuery.trim().length > 0 && (
                    <button
                      type="button"
                      className="search-pill-clear"
                      aria-label="Clear search"
                      onClick={handleClearSearch}
                    >
                      <X size={15} aria-hidden="true" />
                    </button>
                  )}
                  <button type="submit" className="search-pill-submit" aria-label="Submit search">
                    <Search size={16} aria-hidden="true" />
                  </button>
                </div>
              </form>

              {/* Right Action Icons */}
              <div className="header-actions">
                {/* Account / User Menu Dropdown */}
                <div className="account-menu-wrapper" ref={accountMenuRef}>
                  <button
                    ref={accountToggleRef}
                    type="button"
                    className={`header-action-btn account-toggle-btn ${isAccountOpen ? 'is-active' : ''}`}
                    aria-label={`Account menu for ${effectiveUser.name}`}
                    aria-haspopup="menu"
                    aria-expanded={isAccountOpen}
                    onClick={() => setIsAccountOpen((prev) => !prev)}
                  >
                    <User size={20} aria-hidden="true" />
                  </button>

                  {isAccountOpen && (
                    <div
                      className="account-dropdown-menu"
                      role="menu"
                      aria-label="Account menu options"
                    >
                      <div className="account-dropdown__header">
                        <div className="account-dropdown__identity">
                          <span className="account-dropdown__name">{effectiveUser.name}</span>
                          {effectiveUser.email && (
                            <span className="account-dropdown__email">{effectiveUser.email}</span>
                          )}
                        </div>
                        <span className={`account-role-badge account-role-badge--${effectiveUser.role}`}>
                          {effectiveUser.role === 'admin' ? 'Admin' : effectiveUser.role === 'supplier' ? 'Florist' : effectiveUser.isAuthenticated ? 'Customer' : 'Guest'}
                        </span>
                      </div>

                      <div className="account-dropdown__divider" role="separator" />

                      <div className="account-dropdown__group" role="group" aria-label="Account navigation">
                        {effectiveUser.role === 'customer' && (
                          <>
                            <Link
                              to="/account/orders"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <Receipt size={15} aria-hidden="true" />
                              <span>Track Orders</span>
                            </Link>
                            <Link
                              to="/wishlist"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <Heart size={15} aria-hidden="true" />
                              <span>Saved Arrangements ({wishlist.count})</span>
                            </Link>
                            <Link
                              to="/cart"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <ShoppingBag size={15} aria-hidden="true" />
                              <span>Shopping Cart ({totalCartCount})</span>
                            </Link>
                          </>
                        )}

                        {effectiveUser.role === 'supplier' && (
                          <>
                            <Link
                              to="/supplier"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <Store size={15} aria-hidden="true" />
                              <span>Supplier Dashboard</span>
                            </Link>
                            <Link
                              to="/supplier/products"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <FolderTree size={15} aria-hidden="true" />
                              <span>Product Catalog</span>
                            </Link>
                            <Link
                              to="/supplier/orders"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <Receipt size={15} aria-hidden="true" />
                              <span>Store Orders</span>
                            </Link>
                            <Link
                              to="/supplier/profile"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <User size={15} aria-hidden="true" />
                              <span>Store Profile</span>
                            </Link>
                          </>
                        )}

                        {effectiveUser.role === 'admin' && (
                          <>
                            <Link
                              to="/admin"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <LayoutDashboard size={15} aria-hidden="true" />
                              <span>Admin Overview</span>
                            </Link>
                            <Link
                              to="/admin/suppliers"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <Store size={15} aria-hidden="true" />
                              <span>Supplier Approvals</span>
                            </Link>
                            <Link
                              to="/admin/orders"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <Receipt size={15} aria-hidden="true" />
                              <span>Orders Oversight</span>
                            </Link>
                            <Link
                              to="/admin/categories"
                              role="menuitem"
                              className="account-dropdown__item"
                              onClick={() => setIsAccountOpen(false)}
                            >
                              <FolderTree size={15} aria-hidden="true" />
                              <span>Categories</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="account-dropdown__divider" role="separator" />

                      <div className="account-dropdown__group" role="group" aria-label="Marketplace Portals">
                        {effectiveUser.role !== 'customer' && (
                          <Link
                            to="/"
                            role="menuitem"
                            className="account-dropdown__item"
                            onClick={() => setIsAccountOpen(false)}
                          >
                            <span>Marketplace Storefront</span>
                          </Link>
                        )}
                        {effectiveUser.role !== 'supplier' && (
                          <Link
                            to="/supplier"
                            role="menuitem"
                            className="account-dropdown__item"
                            onClick={() => setIsAccountOpen(false)}
                          >
                            <span>Florist Supplier Portal</span>
                          </Link>
                        )}
                        {effectiveUser.role !== 'admin' && (
                          <Link
                            to="/admin"
                            role="menuitem"
                            className="account-dropdown__item"
                            onClick={() => setIsAccountOpen(false)}
                          >
                            <span>Super Admin Access</span>
                          </Link>
                        )}
                      </div>

                      {effectiveUser.isAuthenticated && onLogout && (
                        <>
                          <div className="account-dropdown__divider" role="separator" />
                          <button
                            type="button"
                            role="menuitem"
                            className="account-dropdown__item account-dropdown__logout"
                            onClick={() => {
                              setIsAccountOpen(false);
                              onLogout();
                            }}
                          >
                            <span>Sign Out</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <Link to="/wishlist" className="header-action-btn" aria-label={`Wishlist with ${wishlist.count} items`}>
                  <Heart size={20} aria-hidden="true" />
                  {wishlist.count > 0 && (
                    <span className="badge-count wishlist-badge">{wishlist.count}</span>
                  )}
                </Link>

                {/* Cart Toggle */}
                <button
                  type="button"
                  className="header-action-btn cart-toggle-btn"
                  aria-label={`Shopping cart with ${totalCartCount} items`}
                  aria-expanded={cartDrawer.isOpen}
                  onClick={cartDrawer.toggle}
                >
                  <ShoppingBag size={20} aria-hidden="true" />
                  <span className="badge-count cart-badge">{totalCartCount}</span>
                </button>

                {/* Mobile Menu Toggle Button */}
                <Button
                  ref={toggle}
                  className="shell__toggle"
                  variant="secondary"
                  aria-expanded={expanded}
                  aria-controls={navigationId}
                  onKeyDown={(event) => { if (event.key === 'Escape') setExpanded(false); }}
                  onClick={() => setExpanded((value) => !value)}
                >
                  Menu
                </Button>
              </div>
            </div>

            {/* Tier 3: Primary Navigation Bar & Mobile Drawer (Customer mode) */}
            <div className={`primary-nav-wrapper ${expanded ? 'is-drawer-open' : ''}`}>
              <div
                className={`mobile-drawer-overlay ${expanded ? 'is-visible' : ''}`}
                aria-hidden={!expanded}
                onClick={() => {
                  setExpanded(false);
                  toggle.current?.focus();
                }}
              />
              <nav
                id={navigationId}
                className={`primary-nav-bar ${expanded ? 'is-open' : ''}`}
                aria-label="Marketplace navigation"
                onKeyDown={(event) => {
                  if (event.key === 'Escape' && expanded) {
                    event.preventDefault();
                    setExpanded(false);
                    toggle.current?.focus();
                  }
                }}
              >
                <div className="primary-nav-bar__links">
                  <NavLink
                    end
                    to="/"
                    aria-label="Home"
                    className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setExpanded(false);
                      document.getElementById('main')?.focus();
                    }}
                  >
                    <span aria-hidden="true">HOME</span>
                  </NavLink>
                  <NavLink
                    to="/products"
                    aria-label="Products"
                    className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setExpanded(false);
                      document.getElementById('main')?.focus();
                    }}
                  >
                    <span aria-hidden="true">SHOP FLOWERS</span>
                  </NavLink>
                  <NavLink
                    to="/shops"
                    aria-label="Shops"
                    className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setExpanded(false);
                      document.getElementById('main')?.focus();
                    }}
                  >
                    <span aria-hidden="true">EXPLORE SHOPS</span>
                  </NavLink>

                  {/* Curated Categories */}
                  <div className="nav-categories-group">
                    <NavLink
                      to="/products?category=bouquets"
                      aria-label="Bouquets"
                      className={({ isActive }) => `nav-link nav-link--category ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setExpanded(false);
                        document.getElementById('main')?.focus();
                      }}
                    >
                      <span>Bouquets</span>
                    </NavLink>
                    <NavLink
                      to="/products?category=plants"
                      aria-label="Plants"
                      className={({ isActive }) => `nav-link nav-link--category ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setExpanded(false);
                        document.getElementById('main')?.focus();
                      }}
                    >
                      <span>Plants</span>
                    </NavLink>
                    <NavLink
                      to="/products?category=stems"
                      aria-label="Stems"
                      className={({ isActive }) => `nav-link nav-link--category ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setExpanded(false);
                        document.getElementById('main')?.focus();
                      }}
                    >
                      <span>Stems</span>
                    </NavLink>
                  </div>

                  <NavLink
                    to="/cart"
                    aria-label="Cart"
                    className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setExpanded(false);
                      document.getElementById('main')?.focus();
                    }}
                  >
                    <span aria-hidden="true">CART</span>
                    {totalCartCount > 0 && <span className="nav-badge-pill">{totalCartCount}</span>}
                  </NavLink>
                  <NavLink
                    to="/about"
                    aria-label="About Us"
                    className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setExpanded(false);
                      document.getElementById('main')?.focus();
                    }}
                  >
                    <span aria-hidden="true">ABOUT US</span>
                  </NavLink>
                  <NavLink
                    to="/contact"
                    aria-label="Contact Us"
                    className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setExpanded(false);
                      document.getElementById('main')?.focus();
                    }}
                  >
                    <span aria-hidden="true">CONTACT US</span>
                  </NavLink>
                  <NavLink
                    to="/account/orders"
                    aria-label="Orders"
                    className={({ isActive }) => `nav-link mobile-only-nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setExpanded(false);
                      document.getElementById('main')?.focus();
                    }}
                  >
                    <span aria-hidden="true">TRACK ORDERS</span>
                  </NavLink>
                </div>

                {/* Mobile Drawer Header (shown only on mobile when drawer is open) */}
                <div className="mobile-drawer-header">
                  <div className="mobile-drawer-brand-wrap">
                    <span className="brand-logo">
                      {brandName}<span className="brand-dot" aria-hidden="true">.</span>
                    </span>
                    {brandTagline && <span className="mobile-drawer-tagline">{brandTagline}</span>}
                  </div>
                  <button
                    type="button"
                    className="mobile-drawer-close-btn"
                    aria-label="Close navigation menu"
                    onClick={() => {
                      setExpanded(false);
                      toggle.current?.focus();
                    }}
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>

                {/* Mobile Search Form (Customer mode in drawer) */}
                <div className="mobile-drawer-search">
                  <form className="mobile-search-form" onSubmit={handleSearchSubmit} role="search">
                    <div className="search-pill-wrapper">
                      <Search size={16} aria-hidden="true" className="search-pill-icon" />
                      <input
                        ref={searchMobileInputRef}
                        type="search"
                        className="search-pill-input"
                        placeholder="Search flowers, bouquets..."
                        aria-label="Search catalog on mobile"
                        value={searchQuery}
                        maxLength={100}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape' && searchQuery) {
                            e.stopPropagation();
                            setSearchQuery('');
                          }
                        }}
                      />
                      {searchQuery.trim().length > 0 && (
                        <button
                          type="button"
                          className="search-pill-clear"
                          aria-label="Clear mobile search"
                          onClick={handleClearSearch}
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                      )}
                      <button type="submit" className="search-pill-submit" aria-label="Submit mobile search">
                        <Search size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Mobile Account Summary Banner */}
                <div className="mobile-drawer-account">
                  <div className="mobile-drawer-account-header">
                    <span className="mobile-drawer-account-name">{effectiveUser.name}</span>
                    <span className={`account-role-badge account-role-badge--${effectiveUser.role}`}>
                      {effectiveUser.role === 'admin' ? 'Admin' : effectiveUser.role === 'supplier' ? 'Florist' : effectiveUser.isAuthenticated ? 'Customer' : 'Guest'}
                    </span>
                  </div>
                </div>

                {/* Mobile Drawer Footer (shown only on mobile) */}
                <div className="mobile-drawer-footer">
                  <Link to="/supplier" className="mobile-portal-link" onClick={() => setExpanded(false)}>
                    Supplier Portal
                  </Link>
                  <span className="utility-divider" aria-hidden="true">|</span>
                  <Link to="/admin" className="mobile-portal-link" onClick={() => setExpanded(false)}>
                    Admin Access
                  </Link>
                </div>
              </nav>
            </div>
          </header>
        </>
      )}

      {/* Main Body */}
      <div className="shell__body">
        {/* Workspace Side Navigation (for supplier & admin only) */}
        {workspace && (
          <nav
            id={navigationId}
            className={`shell__nav ${expanded ? 'is-open' : ''}`}
            aria-label={`${config.title} navigation`}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && expanded) {
                setExpanded(false);
                toggle.current?.focus();
              }
            }}
          >
            <span className="shell__nav-label">Workspace</span>
            <NavLink end to={config.home} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>
              {audience === 'admin' && <LayoutDashboard size={16} aria-hidden="true" className="shell__nav-icon" />}
              <span>{config.homeLabel}</span>
            </NavLink>

            {audience === 'supplier' && (
              <>
                {([
                  ['/supplier/register', 'Registration'],
                  ['/supplier/profile', 'Store profile'],
                  ['/supplier/products', 'Products'],
                  ['/supplier/inventory', 'Inventory'],
                  ['/supplier/orders', 'Orders'],
                  ['/supplier/sales', 'Sales'],
                ] as const).map(([to, label]) => (
                  <NavLink key={to} to={to} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>
                    {label}
                  </NavLink>
                ))}
              </>
            )}

            {audience === 'admin' && (
              <>
                <span className="shell__nav-section-title">Marketplace Oversight</span>
                {([
                  ['/admin/suppliers', 'Suppliers', Store, adminCounts?.suppliers],
                  ['/admin/users', 'Users', Users, adminCounts?.users],
                  ['/admin/categories', 'Categories', FolderTree, adminCounts?.categories],
                  ['/admin/orders', 'Orders', ShoppingBag, adminCounts?.orders],
                  ['/admin/refunds', 'Refund requests', Receipt, adminCounts?.refunds],
                  ['/admin/reviews', 'Feedback', MessageSquare, adminCounts?.reviews],
                ] as const).map(([to, label, Icon, count]) => (
                  <NavLink key={to} to={to} aria-label={label} onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>
                    <Icon size={16} aria-hidden="true" className="shell__nav-icon" />
                    <span>{label}</span>
                    {count !== undefined && count > 0 && (
                      <span className="nav-badge-pill admin-nav-badge" aria-hidden="true">{count}</span>
                    )}
                  </NavLink>
                ))}
              </>
            )}

            <Link to="/" onClick={() => { setExpanded(false); document.getElementById('main')?.focus(); }}>
              Return to marketplace
            </Link>
          </nav>
        )}

        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>

      {workspace ? (
        <footer className="shell__footer">
          <span>Flower & Flora</span>
          <span>Growing a place for all things floral.</span>
        </footer>
      ) : (
        <>
          {/* Slide-out Cart Drawer (OD-02 compliant) */}
          <div
            className={`cart-drawer-overlay ${cartDrawer.isOpen ? 'is-visible' : ''}`}
            aria-hidden={!cartDrawer.isOpen}
            onClick={cartDrawer.close}
          />
          <aside
            ref={cartDrawerRef}
            className={`cart-drawer ${cartDrawer.isOpen ? 'is-open' : ''}`}
            aria-label="Shopping Cart Drawer"
            aria-hidden={!cartDrawer.isOpen}
          >
            <div className="cart-drawer__header">
              <h2 className="cart-drawer__title">Your Floral Cart ({totalCartCount})</h2>
              <button
                type="button"
                className="cart-drawer__close"
                aria-label="Close cart drawer"
                onClick={cartDrawer.close}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Truthful Editorial Fulfillment Note */}
            <div className="cart-drawer__editorial-note">
              <span className="cart-drawer__note-icon" aria-hidden="true">🌿</span>
              <p className="cart-drawer__note-text">
                Bouquets and arrangements are handcrafted and dispatched directly by each artisanal florist. Orders operate per store.
              </p>
            </div>

            <div className="cart-drawer__body">
              {lines.length === 0 ? (
                <div className="cart-drawer__empty">
                  <ShoppingBag size={48} strokeWidth={1.5} aria-hidden="true" />
                  <p>Your sample cart is currently empty.</p>
                  <Link to="/products" className="cart-drawer__browse-btn" onClick={cartDrawer.close}>
                    Browse Floral Products
                  </Link>
                </div>
              ) : (
                <div className="cart-drawer__groups">
                  <p className="cart-drawer__notice">
                    ℹ Items grouped by supplier store (OD-02 compliant). Checkout operates per store.
                  </p>
                  {Object.entries(storeGroups).map(([storeSlug, storeLines]) => (
                    <div key={storeSlug} className="cart-drawer__store-group">
                      <div className="cart-drawer__store-header">
                        <div className="cart-drawer__store-title-wrap">
                          <span className="store-badge-label">Florist Store:</span>
                          <Link to={`/shops/${storeSlug}`} onClick={cartDrawer.close} className="store-name-link">
                            {storeSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                          </Link>
                        </div>
                        <span className="store-group-subtotal">
                          ${(storeLines.reduce((acc, l) => acc + l.quantity, 0) * 38).toFixed(2)}
                        </span>
                      </div>
                      <ul className="cart-drawer__items-list">
                        {storeLines.map((line) => (
                          <li key={line.productSlug} className="cart-drawer__item">
                            <div className="cart-drawer__item-info">
                              <Link
                                to={`/products/${line.productSlug}`}
                                className="cart-drawer__item-name"
                                onClick={cartDrawer.close}
                              >
                                {line.productSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                              </Link>
                              <span className="cart-drawer__item-price">
                                ${(line.quantity * 38).toFixed(2)}
                                {line.quantity > 1 && (
                                  <span className="unit-price-sub"> (${(38).toFixed(2)} ea)</span>
                                )}
                              </span>
                            </div>
                            <div className="cart-drawer__item-stepper">
                              <button
                                type="button"
                                className="stepper-btn"
                                aria-label={`Decrease quantity of ${line.productSlug}`}
                                onClick={() => {
                                  if (line.quantity > 1) {
                                    dispatch(cartActions.update({ ...line, quantity: line.quantity - 1 }));
                                  } else {
                                    dispatch(cartActions.remove(line));
                                  }
                                }}
                              >
                                <Minus size={14} aria-hidden="true" />
                              </button>
                              <span className="stepper-val">{line.quantity}</span>
                              <button
                                type="button"
                                className="stepper-btn"
                                aria-label={`Increase quantity of ${line.productSlug}`}
                                disabled={line.quantity >= 99}
                                onClick={() => {
                                  dispatch(cartActions.update({ ...line, quantity: Math.min(99, line.quantity + 1) }));
                                }}
                              >
                                <Plus size={14} aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                className="remove-item-btn"
                                aria-label={`Remove ${line.productSlug} from cart`}
                                onClick={() => dispatch(cartActions.remove(line))}
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="cart-drawer__store-checkout">
                        <Link
                          to={`/checkout?store=${storeSlug}`}
                          className="store-checkout-btn"
                          onClick={cartDrawer.close}
                        >
                          Checkout with this Store →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="cart-drawer__footer">
                <div className="cart-drawer__subtotal-row">
                  <span>Subtotal:</span>
                  <span className="cart-drawer__subtotal-val">${cartSubtotal.toFixed(2)}</span>
                </div>
                <Link to="/cart" className="view-cart-full-btn" onClick={cartDrawer.close}>
                  View Full Cart & Review All Stores
                </Link>
              </div>
            )}
          </aside>

          {/* Botanical Editorial 4-Column Footer */}
          <footer className="shell__footer fiama-footer" role="contentinfo">
            <div className="fiama-footer__inner">
              <div className="footer-columns-grid">
                {/* Col 1: Brand & Philosophy */}
                <div className="footer-col footer-col--brand">
                  <h3 className="footer-brand-title">
                    Flower & Flora<span className="brand-dot" aria-hidden="true">.</span>
                  </h3>
                  <p className="footer-desc">
                    Connecting discerning flower lovers with dedicated local florists across Sri Lanka. Sustainable blooms, handcrafted bouquets, and mindful botanical living.
                  </p>
                  <div className="footer-values" aria-label="Brand principles">
                    <span className="footer-value-tag">Locally Sourced</span>
                    <span className="footer-value-dot" aria-hidden="true">·</span>
                    <span className="footer-value-tag">Artisanal Studios</span>
                    <span className="footer-value-dot" aria-hidden="true">·</span>
                    <span className="footer-value-tag">Fresh Daily</span>
                  </div>
                </div>

                {/* Col 2: Marketplace Collections */}
                <div className="footer-col">
                  <h4 className="footer-heading">Marketplace</h4>
                  <ul className="footer-links-list">
                    <li><Link to="/products">Shop Flowers</Link></li>
                    <li><Link to="/shops">Artisan Florists</Link></li>
                    <li><Link to="/products?category=bouquets">Bouquets Collection</Link></li>
                    <li><Link to="/products?category=plants">Plants &amp; Greenery</Link></li>
                    <li><Link to="/products?category=stems">Fresh Cut Stems</Link></li>
                    <li><Link to="/wishlist">Saved Arrangements</Link></li>
                  </ul>
                </div>

                {/* Col 3: Customer Care & Portals */}
                <div className="footer-col">
                  <h4 className="footer-heading">Care &amp; Portals</h4>
                  <ul className="footer-links-list">
                    <li><Link to="/account/orders">Track Orders</Link></li>
                    <li><Link to="/about">Our Story</Link></li>
                    <li><Link to="/contact">Floral Care Guide</Link></li>
                    <li><Link to="/contact">Contact Studio</Link></li>
                    <li><Link to="/supplier">Supplier Workspace</Link></li>
                    <li><Link to="/admin">Admin Oversight</Link></li>
                  </ul>
                </div>

                {/* Col 4: Marketplace Standards & Fulfillment */}
                <div className="footer-col footer-col--standards">
                  <h4 className="footer-heading">Marketplace Standards</h4>
                  <p className="footer-desc">
                    Demonstration multi-supplier botanical platform. Orders, arrangements, and delivery are fulfilled per independent studio.
                  </p>
                  <div className="footer-fulfillment-badges" aria-label="Marketplace standards">
                    <div className="fulfillment-badge">
                      <span className="badge-bullet" aria-hidden="true">●</span>
                      <span>Studio Pickup &amp; Dispatch</span>
                    </div>
                    <div className="fulfillment-badge">
                      <span className="badge-bullet" aria-hidden="true">●</span>
                      <span>Local Courier Delivery</span>
                    </div>
                    <div className="fulfillment-badge">
                      <span className="badge-bullet" aria-hidden="true">●</span>
                      <span>PayHere Verified Flow</span>
                    </div>
                    <div className="fulfillment-badge">
                      <span className="badge-bullet" aria-hidden="true">●</span>
                      <span>Single-Store Checkout</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-bottom-bar">
                <span>&copy; {new Date().getFullYear()} Flower & Flora. Growing a place for all things floral.</span>
                <div className="footer-bottom-links">
                  <Link to="/about">Story</Link>
                  <span aria-hidden="true">·</span>
                  <Link to="/contact">Contact</Link>
                  <span aria-hidden="true">·</span>
                  <Link to="/supplier">Supplier Portal</Link>
                  <span aria-hidden="true">·</span>
                  <Link to="/admin">Super Admin</Link>
                </div>
              </div>
            </div>
          </footer>

          {/* Sticky Bottom Mobile Dock (Customer mode) */}
          <nav className="mobile-bottom-dock" aria-label="Quick mobile dock">
            <NavLink end to="/" className={({ isActive }) => `dock-item ${isActive ? 'is-active' : ''}`}>
              <span className="dock-icon" aria-hidden="true">🌿</span>
              <span className="dock-label">Home</span>
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `dock-item ${isActive ? 'is-active' : ''}`}>
              <Search size={18} aria-hidden="true" />
              <span className="dock-label">Shop</span>
            </NavLink>
            <NavLink to="/wishlist" className={({ isActive }) => `dock-item ${isActive ? 'is-active' : ''}`}>
              <div className="dock-icon-wrap">
                <Heart size={18} aria-hidden="true" />
                {wishlist.count > 0 && <span className="dock-badge">{wishlist.count}</span>}
              </div>
              <span className="dock-label">Wishlist</span>
            </NavLink>
            <button
              type="button"
              className="dock-item dock-btn"
              aria-label={`Open cart with ${totalCartCount} items`}
              onClick={cartDrawer.open}
            >
              <div className="dock-icon-wrap">
                <ShoppingBag size={18} aria-hidden="true" />
                {totalCartCount > 0 && <span className="dock-badge">{totalCartCount}</span>}
              </div>
              <span className="dock-label">Cart</span>
            </button>
            <NavLink to="/account/orders" className={({ isActive }) => `dock-item ${isActive ? 'is-active' : ''}`}>
              <User size={18} aria-hidden="true" />
              <span className="dock-label">Account</span>
            </NavLink>
          </nav>
        </>
      )}
    </div>
  );
}
