import { type ElementType, type ComponentPropsWithoutRef, type ReactNode } from 'react';

export type ContainerVariant = 'public' | 'dashboard' | 'narrow' | 'full';

export type ContainerProps<T extends ElementType = 'div'> = {
  as?: T;
  variant?: ContainerVariant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export function Container<T extends ElementType = 'div'>({
  as,
  variant = 'public',
  className = '',
  children,
  ...props
}: ContainerProps<T>) {
  const Component = as || 'div';
  return (
    <Component
      {...props}
      className={`container container--${variant} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
