import type { ComponentProps, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'destructive' | 'icon-square' | 'solid' | 'outline' | 'quiet';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  busy?: boolean;
};

export function Button({ variant = 'primary', busy = false, disabled, children, className = '', type = 'button', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`button button--${variant} ${className}`} disabled={disabled || busy} aria-busy={busy || undefined}>{children}</button>;
}

export function IconButton({ label, ...props }: Omit<ButtonProps, 'aria-label'> & { label: string }) {
  return <Button {...props} variant="icon-square" aria-label={label} title={label} />;
}

export function TextLink({ children, className = '', ...props }: ComponentProps<'a'> & { children: ReactNode }) {
  return <a {...props} className={`text-link ${className}`.trim()}>{children}</a>;
}
