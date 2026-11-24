import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commandSchema, workspaceSchema, type SupplierWorkspace } from './model';
import { mockSupplierAdapter, type SupplierAdapter } from './api/mock';
import { matchesReceipt } from './receipt';

export const supplierKey = (adapter: SupplierAdapter) => ['MOCK', 'supplier', adapter.key] as const;
export function useSupplier(adapter: SupplierAdapter = mockSupplierAdapter) {
  return useQuery({ queryKey: supplierKey(adapter), queryFn: async ({ signal }) => {
    const result = await adapter.read(signal);
    signal.throwIfAborted();
    return workspaceSchema.parse(result);
  } });
}
export function useSupplierCommand(adapter: SupplierAdapter = mockSupplierAdapter) {
  const client = useQueryClient();
  return useMutation({ retry: false, mutationFn: async (input: Parameters<SupplierAdapter['execute']>[0]) => {
    const command = commandSchema.parse(input);
    const before = client.getQueryData<SupplierWorkspace>(supplierKey(adapter));
    if (before?.access !== 'allowed' || before.revision !== command.expectedRevision) throw new Error('Stale sample edit.');
    const result = workspaceSchema.parse(await adapter.execute(command));
    if (result.access !== 'allowed' || result.revision !== command.expectedRevision + 1 || !matchesReceipt(before, result, command)) throw new Error('Invalid sample acknowledgement.');
    return result;
  }, onSuccess: (data) => {
    // Cancel older reads before writing an acknowledged snapshot to the cache.
    void client.cancelQueries({ queryKey: supplierKey(adapter) });
    client.setQueryData<SupplierWorkspace>(supplierKey(adapter), (current) => current?.access === 'forbidden'
      || (current?.access === 'allowed' && current.revision > data.revision) ? current : data);
  }, onError: () => { void client.invalidateQueries({ queryKey: supplierKey(adapter) }); } });
}
