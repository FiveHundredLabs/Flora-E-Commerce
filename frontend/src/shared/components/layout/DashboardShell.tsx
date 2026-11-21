import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Menu, X, ArrowLeft } from 'lucide-react';

export type DashboardRole = 'supplier' | 'admin';

export type DashboardShellProps = {
  role: DashboardRole;
  workspaceTitle: string;
  workspaceSubtitle?: string;
  sidebarNav: ReactNode;
  breadcrumbs?: ReactNode;
  topbarActions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DashboardShell({
  role,
  workspaceTitle,
  workspaceSubtitle,
  sidebarNav,
  breadcrumbs,
  topbarActions,
  children,
  className = '',
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSidebarOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const handleClose = () => {
    setSidebarOpen(false);
    menuBtnRef.current?.focus();
  };

  return (
    <div className={`dashboard-shell dashboard-shell--${role} ${className}`.trim()}>
      <a href="#portal-content" className="skip-link">
        Skip to workspace content
      </a>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="dashboard-shell__backdrop"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Operational Sidebar */}
      <aside
        className={`dashboard-shell__sidebar ${sidebarOpen ? 'is-open' : ''}`.trim()}
        aria-label={`${role === 'admin' ? 'Super admin' : 'Supplier'} navigation`}
      >
        <div className="dashboard-shell__sidebar-header">
          <div className="dashboard-shell__brand-block">
            <span className="dashboard-shell__brand-tag">
              {role === 'admin' ? 'Super Admin' : 'Supplier Portal'}
            </span>
            <h2 className="dashboard-shell__workspace-name">{workspaceTitle}</h2>
            {workspaceSubtitle && (
              <p className="dashboard-shell__workspace-sub">{workspaceSubtitle}</p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="dashboard-shell__sidebar-close"
            onClick={handleClose}
            aria-label="Close navigation sidebar"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="dashboard-shell__sidebar-nav">
          {sidebarNav}
        </nav>

        <div className="dashboard-shell__sidebar-footer">
          <Link to="/" className="dashboard-shell__return-link">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-shell__main-wrap">
        <header className="dashboard-shell__topbar" role="banner">
          <div className="dashboard-shell__topbar-left">
            <button
              ref={menuBtnRef}
              type="button"
              className="dashboard-shell__mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open workspace navigation"
              aria-expanded={sidebarOpen}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            {breadcrumbs && (
              <div className="dashboard-shell__topbar-breadcrumbs">
                {breadcrumbs}
              </div>
            )}
          </div>

          {topbarActions && (
            <div className="dashboard-shell__topbar-actions">
              {topbarActions}
            </div>
          )}
        </header>

        <main id="portal-content" className="dashboard-shell__content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
