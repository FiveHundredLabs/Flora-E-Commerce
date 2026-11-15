import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'destructive';
  busy?: boolean;
};

export function Button({ variant = 'primary', busy = false, disabled, children, className = '', type = 'button', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`button button--${variant} ${className}`} disabled={disabled || busy} aria-busy={busy || undefined}>{children}</button>;
}
