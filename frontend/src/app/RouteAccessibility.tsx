import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const routeDescriptions: Record<string, string> = {
  '/': 'Artisanal botanical studio and curated marketplace connecting flower lovers with independent florists across Sri Lanka.',
  '/products': 'Explore handcrafted bouquets, lush plants, and fresh cut stems from curated independent florists across Sri Lanka.',
  '/shops': 'Discover independent artisan florist studios and local botanical creators across Sri Lanka.',
  '/wishlist': 'Your saved floral arrangements and botanical inspirations.',
  '/about': "Our story · Curating sustainable botanical design and celebrating Sri Lanka's independent floral artisans.",
  '/contact': 'Get in touch with the Flower & Flora botanical studio and customer concierge.',
  '/cart': 'Your floral shopping cart · Handcrafted bouquets fulfilled per independent studio.',
  '/checkout': 'Per-store secure checkout with verified PayHere flow and flexible fulfilment.',
  '/account/orders': 'Track your floral orders, delivery updates, and store feedback.',
  '/supplier': 'Supplier workspace for independent florists and botanical creators.',
  '/admin': 'Marketplace oversight, supplier approvals, and catalogue management.',
};

/** Announce client-side navigation through the page title, meta description, canonical link, and main landmark. */
export function RouteAccessibility() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const main = document.getElementById('main') || document.getElementById('main-content') || document.getElementById('portal-content');
    const heading = main?.querySelector('h1')?.textContent?.trim();

    // 1. Dynamic descriptive title
    if (heading) {
      document.title = `${heading} | Flower & Flora`;
    } else {
      document.title = 'Flower & Flora · Artisanal Botanical Studio & Marketplace';
    }

    // 2. Dynamic meta description
    if (typeof document !== 'undefined') {
      let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      const matchingDescription = routeDescriptions[pathname] ||
        (pathname.startsWith('/shops/') ? 'Handcrafted botanical arrangements and florist studio profile.' :
         pathname.startsWith('/products/') ? 'Botanical bouquet and floral arrangement details from independent florists.' :
         'Artisanal botanical studio and curated marketplace across Sri Lanka.');
      metaDesc.content = matchingDescription;

      // 3. Dynamic canonical link strategy
      let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://flowerflora.lk';
      canonicalLink.href = `${origin}${pathname}`;
    }

    // 4. Focus management on route transition
    if (previousPath.current !== pathname) {
      main?.focus();
    }
    previousPath.current = pathname;
  }, [pathname]);

  return null;
}
