import { type ComponentProps, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'quiet'
  | 'text'
  | 'destructive'
  | 'accent'
  | 'icon-square';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  busy?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  busy = false,
  disabled,
  children,
  className = '',
  type = 'button',
  startIcon,
  endIcon,
  ...props
}: ButtonProps) {
  const normalizedVariant = variant === 'text' ? 'quiet' : variant === 'outline' ? 'secondary' : variant;
  const classes = [
    'button',
    `button--${normalizedVariant}`,
    size !== 'md' && `button--${size}`,
    busy && 'is-busy',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      type={type}
      className={classes}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
    >
      {busy && (
        <span className="button__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spinner-icon">
            <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
            <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {!busy && startIcon && <span className="button__icon button__icon--start" aria-hidden="true">{startIcon}</span>}
      <span className="button__text">{children}</span>
      {!busy && endIcon && <span className="button__icon button__icon--end" aria-hidden="true">{endIcon}</span>}
    </button>
  );
}

export type IconButtonProps = Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon'> & {
  'aria-label': string;
  icon: ReactNode;
  title?: string;
};

export function IconButton({
  'aria-label': ariaLabel,
  icon,
  variant = 'icon-square',
  size = 'md',
  className = '',
  busy = false,
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      busy={busy}
      variant={variant}
      size={size}
      className={`icon-button ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <span className="icon-button__icon" aria-hidden="true">{busy ? null : icon}</span>
    </Button>
  );
}

export type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  startIcon,
  endIcon,
  ...props
}: ButtonLinkProps) {
  const normalizedVariant = variant === 'text' ? 'quiet' : variant === 'outline' ? 'secondary' : variant;
  const classes = [
    'button',
    `button--${normalizedVariant}`,
    size !== 'md' && `button--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Link {...props} className={classes}>
      {startIcon && <span className="button__icon button__icon--start" aria-hidden="true">{startIcon}</span>}
      <span className="button__text">{children}</span>
      {endIcon && <span className="button__icon button__icon--end" aria-hidden="true">{endIcon}</span>}
    </Link>
  );
}
