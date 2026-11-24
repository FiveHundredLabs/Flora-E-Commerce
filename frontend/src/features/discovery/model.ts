import { z } from 'zod';

// MOCK UI vocabulary only. Replace with approved DTOs before live integration.
export const categories = ['bouquets', 'plants', 'stems', 'roses', 'orchids', 'gift-sets', 'wedding-flowers', 'dried-flowers'] as const;
export const locations = ['colombo', 'kandy'] as const;
export const categoryNames = {
  bouquets: 'Bouquets',
  plants: 'Plants',
  stems: 'Stems',
  roses: 'Roses',
  orchids: 'Orchids',
  'gift-sets': 'Gift Sets',
  'wedding-flowers': 'Wedding Flowers',
  'dried-flowers': 'Dried Flowers',
} satisfies Record<typeof categories[number], string>;
export const locationNames = { colombo: 'Colombo', kandy: 'Kandy' };
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const storeSchema = z.object({
  slug, name: z.string().min(1), description: z.string().min(1),
  location: z.enum(locations), categories: z.array(z.enum(categories)).min(1),
});
export const productSchema = z.object({
  slug, storeSlug: slug, name: z.string().min(1), description: z.string().min(1),
});
export const catalogSchema = z.object({ stores: z.array(storeSchema), products: z.array(productSchema) }).superRefine((catalog, context) => {
  const stores = new Set(catalog.stores.map((store) => store.slug));
  const products = new Set(catalog.products.map((product) => product.slug));
  if (stores.size !== catalog.stores.length || products.size !== catalog.products.length) context.addIssue({ code: 'custom', message: 'Duplicate sample slug' });
  if (catalog.products.some((product) => !stores.has(product.storeSlug))) context.addIssue({ code: 'custom', message: 'Missing sample store' });
});
export type Catalog = z.infer<typeof catalogSchema>;
export type Product = z.infer<typeof productSchema>;
export type Store = z.infer<typeof storeSchema>;
export type Kind = 'shops' | 'products';

export const searchSchema = z.string().trim().max(100);
const filterSchemas = {
  q: searchSchema,
  category: z.enum(['', ...categories]),
  location: z.enum(['', ...locations]),
  store: z.union([z.literal(''), slug]),
  sort: z.enum(['name-asc', 'name-desc']),
};
export type Filters = { q: string; category: '' | typeof categories[number]; location: '' | typeof locations[number]; store: string; sort: 'name-asc' | 'name-desc' };
export const defaultFilters: Filters = { q: '', category: '', location: '', store: '', sort: 'name-asc' };

export function readFilters(params: URLSearchParams, kind?: Kind): { filters: Filters; invalid: boolean } {
  let invalid = false;
  function field<K extends keyof Filters>(key: K): Filters[K] {
    const values = params.getAll(key);
    const result = filterSchemas[key].safeParse(values[0] ?? defaultFilters[key]);
    if (values.length > 1 || !result.success) { invalid = true; return defaultFilters[key]; }
    return result.data as Filters[K];
  }
  const filters = { q: field('q'), category: field('category'), location: field('location'), store: field('store'), sort: field('sort') };
  if (kind === 'products' && filters.category) { filters.category = ''; invalid = true; }
  if (kind === 'shops' && filters.store) { filters.store = ''; invalid = true; }
  return { filters, invalid };
}

export function writeFilters(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of Object.keys(defaultFilters) as (keyof Filters)[]) {
    if (filters[key] !== defaultFilters[key]) params.set(key, filters[key]);
  }
  return params;
}

export function selectStores(catalog: Catalog, filters: Filters) {
  const query = filters.q.toLowerCase();
  return catalog.stores.filter((store) => (!query || `${store.name} ${store.description}`.toLowerCase().includes(query))
    && (!filters.category || store.categories.includes(filters.category)) && (!filters.location || store.location === filters.location))
    .sort((a, b) => filters.sort === 'name-desc' ? b.name.localeCompare(a.name, 'en') : a.name.localeCompare(b.name, 'en'));
}

export function selectProducts(catalog: Catalog, filters: Filters, storeSlug?: string) {
  const query = filters.q.toLowerCase();
  return catalog.products.filter((product) => (!storeSlug || product.storeSlug === storeSlug)
    && (!query || `${product.name} ${product.description}`.toLowerCase().includes(query))
    && (!filters.store || product.storeSlug === filters.store)
    && (!filters.location || catalog.stores.find((store) => store.slug === product.storeSlug)?.location === filters.location))
    .sort((a, b) => filters.sort === 'name-desc' ? b.name.localeCompare(a.name, 'en') : a.name.localeCompare(b.name, 'en'));
}
