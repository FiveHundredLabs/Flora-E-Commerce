import { useId, useState, type ReactNode, type CSSProperties } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, ImageOff } from 'lucide-react';

export function Card({
  title,
  children,
  className = '',
  eyebrow,
  actions,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  const id = useId();
  if (!title) {
    return (
      <div className={`card ${className}`.trim()}>
        {actions && <div className="card__header card__header--actions-only"><div className="card__actions">{actions}</div></div>}
        <div className="card__content">{children}</div>
      </div>
    );
  }

  return (
    <section className={`card ${className}`.trim()} aria-labelledby={id}>
      <div className="card__header">
        <div>
          {eyebrow && <span className="card__eyebrow">{eyebrow}</span>}
          <h2 id={id} className="card__title">
            {title}
          </h2>
        </div>
        {actions && <div className="card__actions">{actions}</div>}
      </div>
      <div className="card__content">{children}</div>
    </section>
  );
}

export type BadgeTone =
  | 'neutral'
  | 'subtle'
  | 'sale'
  | 'new'
  | 'stock'
  | 'sold-out'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'pending'
  | 'processing'
  | 'active'
  | 'suspended';

/** Visual emphasis only; caller supplies text from an approved contract. */
export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span className={`badge badge--${tone} ${className}`.trim()}>
      {children}
    </span>
  );
}

export function StatusChip({
  status,
  tone,
  className = '',
  withDot = true,
}: {
  status: string;
  tone: BadgeTone;
  className?: string;
  withDot?: boolean;
}) {
  return (
    <span className={`status-chip status-chip--${tone} ${className}`.trim()}>
      {withDot && <span className="status-chip__dot" aria-hidden="true" />}
      <span className="status-chip__label">{status}</span>
    </span>
  );
}

export function Skeleton({
  label = 'Loading content',
  variant = 'rectangular',
  width,
  height,
  className = '',
}: {
  label?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  const style: CSSProperties = {
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  return (
    <div
      role="status"
      className={`skeleton skeleton--${variant} ${className}`.trim()}
      style={style}
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="skeleton__pulse" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`empty-state ${className}`.trim()} role="status">
      {icon && <div className="empty-state__icon" aria-hidden="true">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export function Alert({
  tone = 'info',
  title,
  children,
  onDismiss,
  className = '',
}: {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const isAssertive = tone === 'danger' || tone === 'warning';
  const icons: Record<AlertTone, ReactNode> = {
    info: <Info size={18} aria-hidden="true" />,
    success: <CheckCircle size={18} aria-hidden="true" />,
    warning: <AlertTriangle size={18} aria-hidden="true" />,
    danger: <AlertCircle size={18} aria-hidden="true" />,
  };

  return (
    <div
      role={isAssertive ? 'alert' : 'status'}
      className={`alert alert--${tone} ${className}`.trim()}
    >
      <div className="alert__icon">{icons[tone]}</div>
      <div className="alert__body">
        {title && <h4 className="alert__title">{title}</h4>}
        <div className="alert__message">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="alert__dismiss"
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export function Price({
  amount,
  currency = 'LKR',
  className = '',
}: {
  amount?: number | null;
  currency?: string;
  className?: string;
}) {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return (
      <span className={`price price--unavailable ${className}`.trim()}>
        <span className="sr-only">Price: </span>
        <span aria-hidden="true">—</span>
        <span className="price__notice">Unavailable</span>
      </span>
    );
  }

  let formatted: string;
  try {
    formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    formatted = `${currency || 'LKR'} ${amount.toFixed(2)}`;
  }

  return (
    <span className={`price ${className}`.trim()}>
      <span className="sr-only">Price: </span>
      <span className="price__amount">{formatted}</span>
    </span>
  );
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  aspectRatio = '1 / 1',
  priority = false,
  className = '',
}: {
  src?: string | null;
  alt: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setHasError(false);
  }

  const containerStyle: CSSProperties = {
    aspectRatio,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  if (!src || hasError) {
    const isDecorative = !alt;
    return (
      <div
        className={`image-fallback ${className}`.trim()}
        style={containerStyle}
        role={isDecorative ? 'presentation' : 'img'}
        aria-label={isDecorative ? undefined : alt}
        aria-hidden={isDecorative ? true : undefined}
      >
        <div className="image-fallback__content" aria-hidden="true">
          <ImageOff size={28} className="image-fallback__icon" />
          <span className="image-fallback__text">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-wrapper ${className}`.trim()} style={containerStyle}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onError={() => setHasError(true)}
        className="image-wrapper__img"
      />
    </div>
  );
}

export function Separator({
  orientation = 'horizontal',
  className = '',
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={`separator separator--${orientation} ${className}`.trim()}
    />
  );
}
