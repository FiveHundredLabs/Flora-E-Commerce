import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commandSchema, workspaceSchema, type AdminCommand, type AdminWorkspace } from './model';
import { mockAdminAdapter, type AdminAdapter } from './api/mock';
import { matchesReceipt } from './receipt';

export const adminKey = (adapter: AdminAdapter) => ['MOCK', 'admin', adapter.key] as const;
export function useAdmin(adapter: AdminAdapter, refreshOnEntry = false) {
  return useQuery<AdminWorkspace>({ queryKey: adminKey(adapter),
    refetchOnMount: (query) => query.state.data?.access === 'forbidden' ? false : refreshOnEntry ? 'always' : true,
    queryFn: async ({ signal }) => {
    const value = await adapter.read(signal); signal.throwIfAborted(); return workspaceSchema.parse(value);
  } });
}
export function useAdminCommand(adapter: AdminAdapter = mockAdminAdapter) {
  const client = useQueryClient();
  return useMutation({ retry: false, mutationFn: async (input: AdminCommand) => {
    const command = commandSchema.parse(input); const before = client.getQueryData<AdminWorkspace>(adminKey(adapter));
    if (before?.access !== 'allowed' || before.revision !== command.expectedRevision) throw new Error('Stale sample edit.');
    const result = workspaceSchema.parse(await adapter.execute(command));
    if (result.access !== 'allowed' || result.revision !== command.expectedRevision + 1 || !matchesReceipt(before, result, command)) throw new Error('Invalid sample acknowledgement.');
    return result;
  }, onSuccess: (data) => {
    void client.cancelQueries({ queryKey: adminKey(adapter) });
    client.setQueryData<AdminWorkspace>(adminKey(adapter), (current) => current?.access === 'forbidden'
      || (current?.access === 'allowed' && current.revision > data.revision) ? current : data);
  }, onError: () => {
    // An old failed write must not trigger a read that replaces an explicit denial.
    if (client.getQueryData<AdminWorkspace>(adminKey(adapter))?.access !== 'forbidden') void client.invalidateQueries({ queryKey: adminKey(adapter) });
  } });
}
