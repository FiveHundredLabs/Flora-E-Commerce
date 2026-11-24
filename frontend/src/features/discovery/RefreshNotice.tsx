import { useEffect, useRef, type RefObject } from 'react';
import { Button } from '../../shared/components/ui/Button';

/** Cached public sample content stays usable when a background read fails. */
export function RefreshNotice({ fetching, failed, retry, target }: {
  fetching: boolean; failed: boolean; retry: () => Promise<unknown>; target: RefObject<HTMLDivElement | null>;
}) {
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (restoreFocus.current && !fetching) {
      restoreFocus.current = false;
      if (document.activeElement === document.body) target.current?.querySelector<HTMLHeadingElement>('h2')?.focus();
    }
  }, [fetching, failed, target]);

  return <div className="catalog-refresh">
    {fetching && <p role="status">Refreshing the sample catalog. Previously loaded content is still shown.</p>}
    {failed && <>
      <p role="alert">We couldn’t refresh the sample catalog. Previously loaded content is still shown.</p>
      <Button variant="secondary" busy={fetching} onClick={() => { restoreFocus.current = true; void retry(); }}>Retry refresh</Button>
    </>}
  </div>;
}
