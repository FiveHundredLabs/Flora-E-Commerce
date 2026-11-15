import { describe, expect, it } from 'vitest';
import { catalogSchema, defaultFilters, readFilters, selectProducts, selectStores, writeFilters } from './model';
import { mockDiscoveryAdapter } from './api/mock';

describe('provisional discovery URL rules', () => {
  it('round-trips valid filter state without persisting defaults', () => {
    const values = { ...defaultFilters, q: 'Fern & leaf', category: 'plants' as const, location: 'kandy' as const, sort: 'name-desc' as const };
    expect(readFilters(writeFilters(values))).toEqual({ filters: values, invalid: false });
    expect(writeFilters(defaultFilters).toString()).toBe('');
  });
  it.each(['sort=price', 'category=unknown', 'location=unknown', 'q=a&q=b', `q=${'a'.repeat(101)}`])('handles invalid or duplicate parameters: %s', (search) => {
    expect(readFilters(new URLSearchParams(search))).toEqual({ filters: defaultFilters, invalid: true });
  });
  it('trims search text and ignores unrelated URL keys without accepting them as filters', () => {
    expect(readFilters(new URLSearchParams('q=%20fern%20&debug=true'))).toEqual({ filters: { ...defaultFilters, q: 'fern' }, invalid: false });
  });
});

it('filters products through their store location and uses stable alphabetical ordering', async () => {
  const catalog = await mockDiscoveryAdapter.load();
  const products = selectProducts(catalog, { ...defaultFilters, category: 'plants', location: 'kandy', sort: 'name-desc' });
  expect(products.map((product) => product.name)).toEqual(['Little Fern', 'Leafy Companion']);
  expect(selectStores(catalog, { ...defaultFilters, q: 'WILLOW' }).map((store) => store.slug)).toEqual(['willow-stem']);
  expect(selectProducts(catalog, defaultFilters, 'willow-stem').every((product) => product.storeSlug === 'willow-stem')).toBe(true);
  expect(selectProducts(catalog, { ...defaultFilters, q: 'no-match' })).toEqual([]);
});

it('rejects invalid mock shapes, duplicate slugs and orphan products', async () => {
  const catalog = await mockDiscoveryAdapter.load();
  expect(catalogSchema.safeParse({ stores: null, products: [] }).success).toBe(false);
  expect(catalogSchema.safeParse({ ...catalog, stores: [...catalog.stores, catalog.stores[0]] }).success).toBe(false);
  expect(catalogSchema.safeParse({ ...catalog, stores: [] }).success).toBe(false);
});

it('honors cancellation and returns independently parsed fixture data', async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(mockDiscoveryAdapter.load(controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
  const first = await mockDiscoveryAdapter.load();
  first.stores.splice(0);
  expect((await mockDiscoveryAdapter.load()).stores).toHaveLength(4);
});
