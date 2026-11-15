import { useQuery } from '@tanstack/react-query';
import { mockDiscoveryAdapter, type DiscoveryAdapter } from './api/mock';

export function useDiscovery(adapter: DiscoveryAdapter = mockDiscoveryAdapter) {
  return useQuery({ queryKey: ['MOCK', 'discovery', adapter.key], queryFn: ({ signal }) => adapter.load(signal) });
}
