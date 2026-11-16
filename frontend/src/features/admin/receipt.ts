import type { AdminCommand, AdminRecord, AllowedWorkspace } from './model';

const key = (record: AdminRecord) => `${record.kind}:${record.id}`;

/** Validate the entire mock record delta. List ordering is not part of the protocol. */
export function matchesReceipt(before: AllowedWorkspace, after: AllowedWorkspace, command: AdminCommand): boolean {
  const expected = structuredClone(before.records);
  if (command.type === 'createCategory') {
    const original = new Set(before.records.map(key));
    const added = after.records.filter((record) => !original.has(key(record)));
    const category = added[0];
    if (added.length !== 1 || category?.kind !== 'categories' || category.label !== command.label) return false;
    // New fixture capabilities come from the service, not from the submitted label.
    expected.push(category);
  } else {
    const kind = command.type === 'removeCategory' ? 'categories' : command.kind;
    const index = expected.findIndex((record) => record.kind === kind && record.id === command.id);
    const record = expected[index];
    if (!record) return false;
    if (command.type === 'removeCategory') expected.splice(index, 1);
    else if (command.type === 'rename') record.label = command.label;
    else if ('note' in record) record.note = command.note;
    else return false;
  }
  // Both snapshots have passed Zod parsing, which normalizes record field ordering.
  const actual = new Map(after.records.map((record) => [key(record), JSON.stringify(record)]));
  return expected.length === actual.size && expected.every((record) => actual.get(key(record)) === JSON.stringify(record));
}
