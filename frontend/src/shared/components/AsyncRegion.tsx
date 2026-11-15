import { useEffect, useId, useRef, type ReactNode } from 'react';

type RegionState =
  | { status: 'loading' }
  | { status: 'empty'; message: string }
  | { status: 'error'; onRetry?: () => void }
  | { status: 'forbidden' }
  | { status: 'ready'; children: ReactNode };

type AsyncRegionProps = { title: string; state: RegionState };

/** Presentation only. Callers own queries, permissions and trusted error mapping. */
export function AsyncRegion({ title, state }: AsyncRegionProps) {
  const titleId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (restoreFocus.current && state.status !== 'loading') {
      // Restore focus lost with the retry button, but respect a user who moved on.
      if (document.activeElement === document.body) heading.current?.focus();
      restoreFocus.current = false;
    }
  }, [state.status]);

  return (
    <section className="async-region" aria-labelledby={titleId}>
      <h2 id={titleId} ref={heading} tabIndex={-1}>{title}</h2>
      {state.status === 'loading' && <p role="status">Loading. Please wait.</p>}
      {state.status === 'empty' && <p>{state.message}</p>}
      {state.status === 'error' && (
        <>
          <p role="alert">We couldn’t load this content. Please try again.</p>
          {state.onRetry && (
            <button type="button" onClick={() => {
              restoreFocus.current = true;
              state.onRetry?.();
            }}>Try again</button>
          )}
        </>
      )}
      {state.status === 'forbidden' && <p role="alert">You don’t have permission to view this content.</p>}
      {state.status === 'ready' && state.children}
    </section>
  );
}
