import { useId, type ReactNode } from 'react';

export function Card({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  const id = useId();
  return <section className={`card ${className}`.trim()} aria-labelledby={id}><h2 id={id}>{title}</h2>{children}</section>;
}

export type BadgeTone = 'neutral' | 'subtle' | 'sale' | 'new' | 'stock' | 'sold-out';

/** Visual emphasis only; caller supplies text from an approved contract. */
export function Badge({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return <span className={`badge badge--${tone} ${className}`.trim()}>{children}</span>;
}

export function Skeleton({ label = 'Loading content' }: { label?: string }) {
  return <div role="status" className="skeleton"><span className="sr-only">{label}</span><div aria-hidden="true" /></div>;
}
