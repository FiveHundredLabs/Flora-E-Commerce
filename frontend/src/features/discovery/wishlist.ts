import { useSyncExternalStore } from 'react';

export type WishlistItem = {
  productSlug: string;
  storeSlug: string;
  name: string;
  category: string;
};

const STORAGE_KEY = 'flora_wishlist';
let cachedRaw: string | null = null;
let cachedItems: WishlistItem[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('flora_wishlist_change'));
  }
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        const parsed = raw ? JSON.parse(raw) : [];
        cachedItems = Array.isArray(parsed)
          ? parsed.filter(
              (item): item is WishlistItem =>
                Boolean(item && typeof item === 'object' && typeof item.productSlug === 'string' && typeof item.storeSlug === 'string')
            )
          : [];
      } catch {
        cachedItems = [];
      }
    }
    return cachedItems;
  } catch {
    return cachedItems;
  }
}

function saveWishlist(items: WishlistItem[]) {
  try {
    const serialized = JSON.stringify(items);
    localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedItems = items;
  } catch {
    cachedItems = items;
  }
  notify();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  const handleCustom = () => {
    callback();
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
    window.addEventListener('flora_wishlist_change', handleCustom);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('flora_wishlist_change', handleCustom);
    }
  };
}

export function useWishlist() {
  const items = useSyncExternalStore(subscribe, getWishlist, () => []);

  const has = (productSlug: string) => items.some((i) => i.productSlug === productSlug);

  const toggle = (item: WishlistItem) => {
    if (has(item.productSlug)) {
      saveWishlist(items.filter((i) => i.productSlug !== item.productSlug));
    } else {
      saveWishlist([...items, item]);
    }
  };

  const remove = (productSlug: string) => {
    saveWishlist(items.filter((i) => i.productSlug !== productSlug));
  };

  const clear = () => saveWishlist([]);

  return {
    items,
    count: items.length,
    has,
    toggle,
    remove,
    clear,
  };
}
