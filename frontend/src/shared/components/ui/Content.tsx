import { useId, type ReactNode } from 'react';

export function Card({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return <section className="card" aria-labelledby={id}><h2 id={id}>{title}</h2>{children}</section>;
}

/** Visual emphasis only; caller supplies text from an approved contract. */
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'subtle' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function Skeleton({ label = 'Loading content' }: { label?: string }) {
  return <div role="status" className="skeleton"><span className="sr-only">{label}</span><div aria-hidden="true" /></div>;
}
