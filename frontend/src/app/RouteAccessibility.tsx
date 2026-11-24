import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const descriptions: Record<string, string> = {
  '/': 'Explore the Flower & Flora sample marketplace for floral products and supplier stores.',
  '/products': 'Browse sample floral products from Flower & Flora marketplace suppliers.',
  '/shops': 'Explore sample supplier stores in the Flower & Flora marketplace.',
  '/about': 'Learn about the Flower & Flora marketplace preview.',
  '/contact': 'Contact the Flower & Flora marketplace team through the sample contact experience.',
};

/** Announce client-side navigation through the page title and main landmark. */
export function RouteAccessibility() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const main = document.getElementById('main');
    const title = main?.querySelector('h1')?.textContent;
    document.title = title ? `${title} | Flower & Flora` : 'Flower & Flora';
    let description = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.append(description);
    }
    description.content = descriptions[pathname] ?? 'Flower & Flora sample marketplace experience.';
    if (previousPath.current !== pathname) main?.focus();
    previousPath.current = pathname;
  }, [pathname]);

  return null;
}
