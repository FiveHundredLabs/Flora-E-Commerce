import { commandSchema, workspaceSchema, type AdminCommand, type AdminWorkspace } from '../model';
import { getInitialSeedRecords } from '../seed';

export interface AdminAdapter {
  key: string;
  read: (signal?: AbortSignal) => Promise<unknown>;
  execute: (command: AdminCommand) => Promise<unknown>;
}

const STORAGE_KEY = 'ff_admin_workspace_v1';

export function createDefaultSeed(): AdminWorkspace {
  return {
    access: 'allowed',
    revision: 0,
    records: getInitialSeedRecords(),
  };
}

/** Private fixture instance, not an HTTP contract, account directory or audit log. */
export function createMockAdminAdapter(initial?: AdminWorkspace, persistSession = false): AdminAdapter {
  let state: AdminWorkspace;
  if (persistSession && typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        state = workspaceSchema.parse(JSON.parse(stored));
      } else {
        state = workspaceSchema.parse(initial ?? createDefaultSeed());
      }
    } catch {
      state = workspaceSchema.parse(initial ?? createDefaultSeed());
    }
  } else {
    state = workspaceSchema.parse(initial ?? createDefaultSeed());
  }

  let sequence = 0;
  return {
    key: crypto.randomUUID(),
    async read(signal) {
      signal?.throwIfAborted();
      return structuredClone(state);
    },
    async execute(input) {
      const command = commandSchema.parse(input);
      if (state.access !== 'allowed' || state.revision !== command.expectedRevision) {
        throw new Error('Sample edit unavailable.');
      }
      const next = structuredClone(state);

      if (command.type === 'createCategory') {
        let id: string;
        do {
          id = `sample-category-${++sequence}`;
        } while (next.records.some((record) => record.kind === 'categories' && record.id === id));
        next.records.push({
          kind: 'categories',
          id,
          label: command.label,
          slug: command.slug ?? command.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: command.description ?? '',
          status: 'active',
          canRename: true,
          canRemove: true,
        });
      } else if (command.type === 'resetWorkspace') {
        next.records = getInitialSeedRecords();
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
        if (!kind) throw new Error('Sample record kind unavailable.');

        const record = next.records.find((item) => item.kind === kind && item.id === command.id);
        if (!record) throw new Error('Sample record unavailable.');

        if (command.type === 'removeCategory') {
          if (record.kind !== 'categories' || !record.canRemove) throw new Error('Sample action unavailable.');
          next.records = next.records.filter((item) => item !== record);
        } else if (command.type === 'rename') {
          if (!('canRename' in record) || !record.canRename) throw new Error('Sample action unavailable.');
          record.label = command.label;
        } else if (command.type === 'annotate') {
          if (!('canAnnotate' in record) || !record.canAnnotate) throw new Error('Sample action unavailable.');
          record.note = command.note;
        } else if (command.type === 'approveSupplier') {
          if (record.kind !== 'suppliers') throw new Error('Sample action unavailable.');
          record.status = 'approved';
          if (command.note !== undefined) record.note = command.note;
        } else if (command.type === 'rejectSupplier') {
          if (record.kind !== 'suppliers') throw new Error('Sample action unavailable.');
          record.status = 'suspended';
          record.note = command.reason;
        } else if (command.type === 'toggleUserStatus') {
          if (record.kind !== 'users') throw new Error('Sample action unavailable.');
          record.status = command.status;
          if (command.actor) record.actor = command.actor;
          if (command.reason !== undefined) record.note = command.reason;
          if (command.label !== undefined) {
            if (!record.canRename) throw new Error('Sample action unavailable.');
            record.label = command.label;
          }
        } else if (command.type === 'updateCategory') {
          if (record.kind !== 'categories') throw new Error('Sample action unavailable.');
          record.label = command.label;
          if (command.slug !== undefined) record.slug = command.slug;
          if (command.description !== undefined) record.description = command.description;
        } else if (command.type === 'processRefund') {
          if (record.kind !== 'refunds') throw new Error('Sample action unavailable.');
          record.status = command.decision;
          record.decisionReason = command.justification;
        } else if (command.type === 'moderateReview') {
          if (record.kind !== 'reviews') throw new Error('Sample action unavailable.');
          record.status = command.status;
          if (command.reason !== undefined) record.moderationReason = command.reason;
        } else if (command.type === 'flagOrder') {
          if (record.kind !== 'orders') throw new Error('Sample action unavailable.');
          record.status = command.status;
          if (command.note !== undefined) record.note = command.note;
        }
      }

      next.revision += 1;
      state = workspaceSchema.parse(next);

      if (persistSession && typeof window !== 'undefined' && window.sessionStorage) {
        try {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
          // Ignore session storage write failures in restricted environments
        }
      }

      return structuredClone(state);
    },
  };
}

export const mockAdminAdapter = createMockAdminAdapter(undefined, true);
