import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/** Announce client-side navigation through the page title and main landmark. */
export function RouteAccessibility() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const main = document.getElementById('main');
    const title = main?.querySelector('h1')?.textContent;
    document.title = title ? `${title} | Flower & Flora` : 'Flower & Flora';
    if (previousPath.current !== pathname) main?.focus();
    previousPath.current = pathname;
  }, [pathname]);

  return null;
}
