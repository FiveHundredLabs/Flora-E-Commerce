import { useSyncExternalStore } from 'react';

let drawerOpen = false;
const drawerListeners = new Set<() => void>();

export function openCartDrawer() {
  drawerOpen = true;
  drawerListeners.forEach((l) => l());
}

export function closeCartDrawer() {
  drawerOpen = false;
  drawerListeners.forEach((l) => l());
}

export function resetCartDrawer() {
  drawerOpen = false;
  drawerListeners.forEach((l) => l());
}

export function toggleCartDrawer() {
  drawerOpen = !drawerOpen;
  drawerListeners.forEach((l) => l());
}

export function useCartDrawer() {
  const isOpen = useSyncExternalStore(
    (callback) => {
      drawerListeners.add(callback);
      return () => drawerListeners.delete(callback);
    },
    () => drawerOpen,
    () => false,
  );
  return { isOpen, open: openCartDrawer, close: closeCartDrawer, toggle: toggleCartDrawer };
}
