import { describe, expect, it } from 'vitest';
import { getCategoryPhoto, getStorePhoto } from './assets';

describe('searched sample image references', () => {
  it.each(['roses', 'orchids', 'gift-sets', 'wedding-flowers', 'dried-flowers'])('provides a referenced image for the %s category', (category) => {
    const photo = getCategoryPhoto(category);
    expect(photo?.primary).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
    expect(photo?.source).toMatch(/^https:\/\/unsplash\.com\//);
    expect(photo?.alt).not.toHaveLength(0);
  });

  it.each(['garden-notes', 'cedar-bloom', 'orchid-lane', 'moss-petal', 'rosewood-florals', 'wildflower-atelier', 'everleaf-studio'])('provides a referenced image for the %s shop', (slug) => {
    const photo = getStorePhoto(slug);
    expect(photo?.primary).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
    expect(photo?.source).toMatch(/^https:\/\/unsplash\.com\//);
    expect(photo?.alt).not.toHaveLength(0);
  });
});
