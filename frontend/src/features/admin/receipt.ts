import { z } from 'zod';
import { recordSchema, type AdminCommand, type AdminRecord, type AllowedWorkspace } from './model';
import { getInitialSeedRecords } from './seed';

const key = (record: AdminRecord) => `${record.kind}:${record.id}`;

/** Validate the entire mock record delta. List ordering is not part of the protocol. */
export function matchesReceipt(before: AllowedWorkspace, after: AllowedWorkspace, command: AdminCommand): boolean {
  if (command.type === 'resetWorkspace') {
    const seed = z.array(recordSchema).parse(getInitialSeedRecords());
    const seedMap = new Map(seed.map((r) => [key(r), JSON.stringify(r)]));
    const actualMap = new Map(after.records.map((r) => [key(r), JSON.stringify(r)]));
    return seed.length === actualMap.size && seed.every((r) => actualMap.get(key(r)) === seedMap.get(key(r)));
  }

  const expected = structuredClone(before.records);
  if (command.type === 'createCategory') {
    const original = new Set(before.records.map(key));
    const added = after.records.filter((record) => !original.has(key(record)));
    const category = added[0];
    if (added.length !== 1 || category?.kind !== 'categories' || category.label !== command.label) return false;
    // New fixture capabilities come from the service, not from the submitted label.
    expected.push(category);
  } else {
    const kind = (command.type === 'removeCategory' || command.type === 'updateCategory') ? 'categories' : (
      'kind' in command ? command.kind : (
        command.type === 'approveSupplier' || command.type === 'rejectSupplier' ? 'suppliers' :
        command.type === 'toggleUserStatus' ? 'users' :
        command.type === 'processRefund' ? 'refunds' :
        command.type === 'moderateReview' ? 'reviews' :
        command.type === 'flagOrder' ? 'orders' : undefined
      )
    );
    if (!kind) return false;

    const index = expected.findIndex((record) => record.kind === kind && record.id === command.id);
    const record = expected[index];
    if (!record) return false;

    if (command.type === 'removeCategory') {
      expected.splice(index, 1);
    } else if (command.type === 'rename') {
      record.label = command.label;
    } else if (command.type === 'annotate') {
      if (!('note' in record)) return false;
      record.note = command.note;
    } else if (command.type === 'approveSupplier') {
      if (record.kind !== 'suppliers') return false;
      record.status = 'approved';
      if (command.note !== undefined) record.note = command.note;
    } else if (command.type === 'rejectSupplier') {
      if (record.kind !== 'suppliers') return false;
      record.status = 'suspended';
      record.note = command.reason;
    } else if (command.type === 'toggleUserStatus') {
      if (record.kind !== 'users') return false;
      record.status = command.status;
      if (command.actor) record.actor = command.actor;
      if (command.reason !== undefined) record.note = command.reason;
      if (command.label !== undefined) record.label = command.label;
    } else if (command.type === 'updateCategory') {
      if (record.kind !== 'categories') return false;
      record.label = command.label;
      if (command.slug !== undefined) record.slug = command.slug;
      if (command.description !== undefined) record.description = command.description;
    } else if (command.type === 'processRefund') {
      if (record.kind !== 'refunds') return false;
      record.status = command.decision;
      record.decisionReason = command.justification;
    } else if (command.type === 'moderateReview') {
      if (record.kind !== 'reviews') return false;
      record.status = command.status;
      if (command.reason !== undefined) record.moderationReason = command.reason;
    } else if (command.type === 'flagOrder') {
      if (record.kind !== 'orders') return false;
      record.status = command.status;
      if (command.note !== undefined) record.note = command.note;
    } else {
      return false;
    }
  }

  // Both snapshots have passed Zod parsing, which normalizes record field ordering.
  const actual = new Map(after.records.map((record) => [key(record), JSON.stringify(record)]));
  return expected.length === actual.size && expected.every((record) => actual.get(key(record)) === JSON.stringify(record));
}
