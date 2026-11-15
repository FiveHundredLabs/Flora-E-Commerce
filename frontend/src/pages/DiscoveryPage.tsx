import { DiscoveryDetail, DiscoveryList } from '../features/discovery';

export function DiscoveryPage({ kind, detail = false }: { kind: 'shops' | 'products'; detail?: boolean }) {
  return detail ? <DiscoveryDetail kind={kind} /> : <DiscoveryList kind={kind} />;
}
