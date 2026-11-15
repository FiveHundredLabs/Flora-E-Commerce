import { useQuery } from '@tanstack/react-query';
import { mockDiscoveryAdapter, type DiscoveryAdapter } from './api/mock';
import { catalogSchema } from './model';

export function useDiscovery(adapter: DiscoveryAdapter = mockDiscoveryAdapter) {
  return useQuery({ queryKey: ['MOCK', 'discovery', adapter.key], queryFn: async ({ signal }) => {
    const data = await adapter.load(signal);
    signal.throwIfAborted();
    return catalogSchema.parse(data);
  } });
}
