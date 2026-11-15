import { catalogSchema, type Catalog } from '../model';

// Fictional sample records. No PII, service availability, pricing or live endpoint.
const fixture: unknown = {
  stores: [
    { slug: 'willow-stem', name: 'Willow & Stem', location: 'colombo', categories: ['bouquets', 'stems'], description: 'A sample studio for gathered flowers and thoughtfully arranged stems.' },
    { slug: 'fern-house', name: 'Fern House', location: 'kandy', categories: ['plants'], description: 'A fictional home for leafy greens and small indoor gardens.' },
    { slug: 'petal-room', name: 'The Petal Room', location: 'colombo', categories: ['bouquets', 'plants'], description: 'A sample collection of quiet blooms and growing gifts.' },
    { slug: 'garden-notes', name: 'Garden Notes', location: 'kandy', categories: ['stems', 'bouquets'], description: 'A fictional flower shop inspired by the shapes of a garden.' },
  ],
  products: [
    { slug: 'morning-bouquet', storeSlug: 'willow-stem', name: 'Morning Bouquet', category: 'bouquets', description: 'An illustrated sample bouquet of open blooms and soft foliage. This is not an item offered for sale.' },
    { slug: 'gathered-stems', storeSlug: 'willow-stem', name: 'Gathered Stems', category: 'stems', description: 'A sample arrangement of individual garden stems, shown for catalog exploration.' },
    { slug: 'little-fern', storeSlug: 'fern-house', name: 'Little Fern', category: 'plants', description: 'A fictional leafy plant for a little corner of green.' },
    { slug: 'leafy-companion', storeSlug: 'fern-house', name: 'Leafy Companion', category: 'plants', description: 'A sample potted plant with a simple, sculptural shape.' },
    { slug: 'quiet-blooms', storeSlug: 'petal-room', name: 'Quiet Blooms', category: 'bouquets', description: 'A fictional bouquet inspired by gentle flower shapes.' },
    { slug: 'table-garden', storeSlug: 'petal-room', name: 'Table Garden', category: 'plants', description: 'A sample small potted garden, illustrated rather than photographed.' },
    { slug: 'garden-stems', storeSlug: 'garden-notes', name: 'Garden Stems', category: 'stems', description: 'A fictional selection of stems with an open garden feel.' },
    { slug: 'afternoon-flowers', storeSlug: 'garden-notes', name: 'Afternoon Flowers', category: 'bouquets', description: 'An illustrated sample bouquet for exploring the marketplace.' },
  ],
};

export type DiscoveryAdapter = { key: string; load: (signal?: AbortSignal) => Promise<Catalog> };
export const mockDiscoveryAdapter: DiscoveryAdapter = {
  key: 'sample-catalog-v1',
  async load(signal) {
    signal?.throwIfAborted();
    // Async boundary without a fake latency timer or an invented HTTP contract.
    const data: unknown = await Promise.resolve(fixture);
    signal?.throwIfAborted();
    return catalogSchema.parse(data);
  },
};
