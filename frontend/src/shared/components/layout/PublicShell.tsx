import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';

export type PublicShellProps = {
  announcement?: ReactNode;
  brandName?: string;
  brandTagline?: string;
  navigation?: ReactNode;
  actions?: ReactNode;
  search?: ReactNode;
  mobileMenuContent?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PublicShell({
  announcement,
  brandName = 'Flower & Flora',
  brandTagline = 'Botanical Studio & Marketplace',
  navigation,
  actions,
  search,
  mobileMenuContent,
  footer,
  children,
  className = '',
}: PublicShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleClose = () => {
    setMobileMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <div className={`public-shell ${className}`.trim()}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {announcement && <div className="public-shell__announcement">{announcement}</div>}

      <header className="public-shell__header" role="banner">
        <div className="public-shell__header-inner">
          <div className="public-shell__brand-col">
            <button
              ref={toggleRef}
              type="button"
              className="public-shell__mobile-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                if (mobileMenuOpen) {
                  handleClose();
                } else {
                  setMobileMenuOpen(true);
                }
              }}
            >
              {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>

            <Link to="/" className="public-shell__logo" aria-label={`${brandName} home`}>
              <span className="public-shell__logo-text">{brandName}</span>
              <span className="public-shell__logo-dot" aria-hidden="true">.</span>
            </Link>
            {brandTagline && (
              <span className="public-shell__tagline" aria-hidden="true">
                {brandTagline}
              </span>
            )}
          </div>

          {search && <div className="public-shell__search-col">{search}</div>}

          {actions && <div className="public-shell__actions-col">{actions}</div>}
        </div>

        {navigation && (
          <nav className="public-shell__nav" aria-label="Primary navigation">
            <div className="public-shell__nav-inner">{navigation}</div>
          </nav>
        )}
      </header>

      {mobileMenuOpen && (
        <div
          className="public-shell__mobile-drawer-overlay"
          onClick={handleClose}
        >
          <div
            className="public-shell__mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="public-shell__mobile-drawer-header">
              <span className="public-shell__logo-text">{brandName}</span>
              <button
                ref={closeBtnRef}
                type="button"
                className="public-shell__mobile-close"
                onClick={handleClose}
                aria-label="Close navigation"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="public-shell__mobile-drawer-content">
              {mobileMenuContent || navigation}
            </div>
          </div>
        </div>
      )}

      <main id="main-content" className="public-shell__main" tabIndex={-1}>
        {children}
      </main>

      <footer className="public-shell__footer" role="contentinfo">
        {footer || (
          <Container variant="public">
            <div className="public-shell__footer-grid">
              <div className="public-shell__footer-brand">
                <span className="public-shell__logo-text">{brandName}</span>
                <p className="public-shell__footer-note">
                  A multi-supplier curated marketplace for artisanal florists and botanical studios.
                </p>
              </div>
              <div className="public-shell__footer-col">
                <h4 className="public-shell__footer-heading">Marketplace</h4>
                <ul className="public-shell__footer-links">
                  <li><Link to="/shops">Browse Florists</Link></li>
                  <li><Link to="/products">Browse Bouquets</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
              <div className="public-shell__footer-col">
                <h4 className="public-shell__footer-heading">Portals</h4>
                <ul className="public-shell__footer-links">
                  <li><Link to="/supplier">Supplier Workspace</Link></li>
                  <li><Link to="/admin">Admin Workspace</Link></li>
                </ul>
              </div>
            </div>
            <div className="public-shell__footer-bottom">
              <p className="public-shell__copyright">
                &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
              </p>
            </div>
          </Container>
        )}
      </footer>
    </div>
  );
}
