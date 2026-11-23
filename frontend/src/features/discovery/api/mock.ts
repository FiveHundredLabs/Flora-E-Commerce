import { catalogSchema, type Catalog } from '../model';

// Fictional sample records. No PII, service availability, pricing or live endpoint.
const fixture: unknown = {
  stores: [
    { slug: 'willow-stem', name: 'Willow & Stem', location: 'colombo', categories: ['bouquets', 'stems', 'roses', 'wedding-flowers'], description: 'A sample studio for gathered flowers and thoughtfully arranged stems.' },
    { slug: 'fern-house', name: 'Fern House', location: 'kandy', categories: ['plants', 'orchids', 'gift-sets'], description: 'A fictional home for leafy greens and small indoor gardens.' },
    { slug: 'petal-room', name: 'The Petal Room', location: 'colombo', categories: ['bouquets', 'plants', 'roses', 'gift-sets'], description: 'A sample collection of quiet blooms and growing gifts.' },
    { slug: 'garden-notes', name: 'Garden Notes', location: 'kandy', categories: ['stems', 'bouquets', 'dried-flowers', 'wedding-flowers'], description: 'A fictional flower shop inspired by the shapes of a garden.' },
    { slug: 'cedar-bloom', name: 'Cedar & Bloom', location: 'colombo', categories: ['dried-flowers', 'gift-sets', 'stems'], description: 'A fictional studio pairing preserved botanicals with simple floral gifts.' },
    { slug: 'orchid-lane', name: 'Orchid Lane', location: 'kandy', categories: ['orchids', 'plants'], description: 'A sample greenhouse-inspired shop for orchids and leafy plants.' },
    { slug: 'moss-petal', name: 'Moss & Petal', location: 'kandy', categories: ['plants', 'dried-flowers', 'gift-sets'], description: 'A fictional collection of textural greens and botanical keepsakes.' },
    { slug: 'rosewood-florals', name: 'Rosewood Florals', location: 'colombo', categories: ['roses', 'bouquets', 'wedding-flowers'], description: 'A sample floral studio focused on roses and gathered arrangements.' },
    { slug: 'wildflower-atelier', name: 'Wildflower Atelier', location: 'kandy', categories: ['stems', 'bouquets', 'dried-flowers'], description: 'A fictional atelier shaped by loose stems and meadow-inspired flowers.' },
    { slug: 'everleaf-studio', name: 'Everleaf Studio', location: 'colombo', categories: ['plants', 'orchids', 'gift-sets'], description: 'A sample plant studio for sculptural foliage and growing gifts.' },
  ],
  products: [
    { slug: 'morning-bouquet', storeSlug: 'willow-stem', name: 'Morning Bouquet', description: 'An illustrated sample bouquet of open blooms and soft foliage. This is not an item offered for sale.' },
    { slug: 'gathered-stems', storeSlug: 'willow-stem', name: 'Gathered Stems', description: 'A sample arrangement of individual garden stems, shown for catalog exploration.' },
    { slug: 'little-fern', storeSlug: 'fern-house', name: 'Little Fern', description: 'A fictional leafy plant for a little corner of green.' },
    { slug: 'leafy-companion', storeSlug: 'fern-house', name: 'Leafy Companion', description: 'A sample potted plant with a simple, sculptural shape.' },
    { slug: 'quiet-blooms', storeSlug: 'petal-room', name: 'Quiet Blooms', description: 'A fictional bouquet inspired by gentle flower shapes.' },
    { slug: 'table-garden', storeSlug: 'petal-room', name: 'Table Garden', description: 'A sample small potted garden, illustrated rather than photographed.' },
    { slug: 'garden-stems', storeSlug: 'garden-notes', name: 'Garden Stems', description: 'A fictional selection of stems with an open garden feel.' },
    { slug: 'afternoon-flowers', storeSlug: 'garden-notes', name: 'Afternoon Flowers', description: 'An illustrated sample bouquet for exploring the marketplace.' },
  ],
};

export type DiscoveryAdapter = { key: string; load: (signal?: AbortSignal) => Promise<unknown> };
export const mockDiscoveryAdapter = {
  key: 'sample-catalog-v3',
  async load(signal?: AbortSignal): Promise<Catalog> {
    signal?.throwIfAborted();
    // Async boundary without a fake latency timer or an invented HTTP contract.
    const data: unknown = await Promise.resolve(fixture);
    signal?.throwIfAborted();
    return catalogSchema.parse(data);
  },
} satisfies DiscoveryAdapter;
