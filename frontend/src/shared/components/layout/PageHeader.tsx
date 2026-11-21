import { type ReactNode } from 'react';

export type PageHeaderVariant = 'public' | 'dashboard';

export type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  variant?: PageHeaderVariant;
  className?: string;
};

export function PageHeader({
  title,
  eyebrow,
  description,
  breadcrumbs,
  actions,
  variant = 'public',
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`page-header page-header--${variant} ${className}`.trim()}>
      {breadcrumbs && <div className="page-header__breadcrumbs">{breadcrumbs}</div>}
      <div className="page-header__row">
        <div className="page-header__titles">
          {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
          <h1 className="page-header__title">{title}</h1>
          {description && <p className="page-header__description">{description}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
    </header>
  );
}
