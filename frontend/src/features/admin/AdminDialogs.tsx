import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { z } from 'zod';
import { Button } from '../../shared/components/ui/Button';
import { TextField, SelectField } from '../../shared/components/ui/Fields';
import { labelInput, noteInput, type AdminRecord } from './model';
import type { AdminAdapter } from './api/mock';
import { useAdminCommand } from './query';

export function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
  className = '',
  isBusy = false,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  isBusy?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    if (open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (typeof el.showModal === 'function') {
        if (!el.open) el.showModal();
      } else {
        el.open = true;
      }
      // Focus the first focusable element inside dialog or dialog container
      const focusable = el.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        const auto = el.querySelector<HTMLElement>('[autofocus]');
        (auto ?? focusable[0])?.focus();
      } else {
        el.focus();
      }
    }

    return () => {
      if (typeof el.close === 'function') {
        if (el.open) el.close();
      } else {
        el.open = false;
      }
      if (triggerRef.current && triggerRef.current.isConnected) {
        triggerRef.current.focus();
      }
    };
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (!isBusy) onClose();
      return;
    }

    if (e.key === 'Tab') {
      const el = dialog.current;
      if (!el) return;
      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((node) => !node.hidden && node.getAttribute('aria-hidden') !== 'true' && node.style.display !== 'none');

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !el.contains(document.activeElement)) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last || !el.contains(document.activeElement)) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
  };

  return (
    <dialog
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className={`admin-modal ${className}`.trim()}
      onKeyDown={handleKeyDown}
      onClose={() => {
        if (open && dialog.current && !dialog.current.open && !isBusy) onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        if (!isBusy) onClose();
      }}
    >
      <div className="admin-modal__header">
        <div>
          <h2 id={titleId}>{title}</h2>
          <p id={descId} className="admin-modal__desc">{description}</p>
        </div>
      </div>
      <div className="admin-modal__body">
        {children}
      </div>
      <div className="dialog__actions">
        <Button variant="secondary" disabled={isBusy} onClick={() => { if (!isBusy) onClose(); }}>Close</Button>
      </div>
    </dialog>
  );
}

// 1. Supplier Review Dialog
export function SupplierReviewDialog({
  open,
  onClose,
  supplier,
  revision,
  adapter,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  supplier: Extract<AdminRecord, { kind: 'suppliers' }>;
  revision: number;
  adapter: AdminAdapter;
  onUpdated?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [onboardingNote, setOnboardingNote] = useState('');
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setRejectMode(false);
      setRejectReason('');
      setOnboardingNote('');
      setError('');
    }
  }, [open, supplier.id]);

  const handleApprove = () => {
    if (submitting.current) return;
    submitting.current = true;
    mutation.mutate(
      {
        type: 'approveSupplier',
        expectedRevision: revision,
        id: supplier.id,
        note: onboardingNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          onUpdated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  const handleReject = () => {
    if (submitting.current) return;
    const reasonValidation = z.string().trim().min(1, 'Reason for suspension or rejection is required.').max(1000).safeParse(rejectReason);
    if (!reasonValidation.success) {
      setError(reasonValidation.error.issues[0]?.message ?? 'Reason required.');
      return;
    }
    setError('');
    submitting.current = true;
    mutation.mutate(
      {
        type: 'rejectSupplier',
        expectedRevision: revision,
        id: supplier.id,
        reason: reasonValidation.data,
      },
      {
        onSuccess: () => {
          onClose();
          onUpdated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title={`Review Supplier: ${supplier.label}`}
      description={`Examine application details and perform moderation decisions for ${supplier.label}.`}
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <div className="admin-dialog-details">
        <div className="admin-detail-row">
          <span className="admin-detail-label">Status:</span>
          <span className={`badge badge--status-${supplier.status}`}>{supplier.status.toUpperCase()}</span>
        </div>
        {supplier.location && (
          <div className="admin-detail-row">
            <span className="admin-detail-label">Location:</span>
            <span>{supplier.location}</span>
          </div>
        )}
        {supplier.specialties && (
          <div className="admin-detail-row">
            <span className="admin-detail-label">Specialties:</span>
            <span>{supplier.specialties}</span>
          </div>
        )}
        <div className="admin-detail-row">
          <span className="admin-detail-label">Application:</span>
          <p className="admin-detail-text">{supplier.application}</p>
        </div>
        {supplier.note && (
          <div className="admin-detail-row">
            <span className="admin-detail-label">Oversight Note:</span>
            <p className="admin-detail-text">{supplier.note}</p>
          </div>
        )}
      </div>

      {mutation.isPending && <p role="status" className="field__status">Saving supplier moderation decision...</p>}
      {mutation.isError && <p role="alert" className="field__error">Supplier decision could not be recorded. Review and try again.</p>}

      {!rejectMode ? (
        <div className="admin-dialog-actions">
          <TextField
            label="Optional Onboarding Note"
            value={onboardingNote}
            onChange={(e) => setOnboardingNote(e.target.value)}
            disabled={mutation.isPending}
            placeholder="e.g. Approved for premium seasonal blooms."
          />
          <div className="admin-btn-group">
            <Button
              variant="primary"
              busy={mutation.isPending}
              onClick={handleApprove}
            >
              Approve Supplier
            </Button>
            <Button
              variant="destructive"
              disabled={mutation.isPending}
              onClick={() => { setRejectMode(true); setError(''); }}
            >
              Suspend / Reject...
            </Button>
          </div>
        </div>
      ) : (
        <div className="admin-dialog-actions admin-reject-box">
          <TextField
            label="Reason for Suspension or Rejection"
            required
            error={error}
            value={rejectReason}
            onChange={(e) => { setRejectReason(e.target.value); if (error) setError(''); }}
            disabled={mutation.isPending}
            placeholder="Explain required compliance or inspection criteria..."
          />
          <div className="admin-btn-group">
            <Button
              variant="destructive"
              busy={mutation.isPending}
              onClick={handleReject}
            >
              Confirm Suspension / Rejection
            </Button>
            <Button
              variant="secondary"
              disabled={mutation.isPending}
              onClick={() => { setRejectMode(false); setError(''); }}
            >
              Back to Review
            </Button>
          </div>
        </div>
      )}
    </AdminModal>
  );
}

// 2. User Status & Actor Moderation Dialog
export function UserStatusDialog({
  open,
  onClose,
  user,
  revision,
  adapter,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  user: Extract<AdminRecord, { kind: 'users' }>;
  revision: number;
  adapter: AdminAdapter;
  onUpdated?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [actor, setActor] = useState<'Customer' | 'Supplier'>(user.actor);
  const [status, setStatus] = useState<'active' | 'suspended'>(user.status);
  const [reason, setReason] = useState(user.note ?? '');
  const [label, setLabel] = useState(user.label);
  const [labelError, setLabelError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setActor(user.actor);
      setStatus(user.status);
      setReason(user.note ?? '');
      setLabel(user.label);
      setLabelError('');
    }
  }, [open, user.id, user.actor, user.status, user.note, user.label]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    let validatedLabel: string | undefined;
    if (user.canRename) {
      const labelRes = labelInput.safeParse(label);
      if (!labelRes.success) {
        setLabelError(labelRes.error.issues[0]?.message ?? 'Enter a valid user label.');
        return;
      }
      validatedLabel = labelRes.data;
    }
    setLabelError('');
    submitting.current = true;
    mutation.mutate(
      {
        type: 'toggleUserStatus',
        expectedRevision: revision,
        id: user.id,
        actor,
        status,
        reason: reason.trim() || undefined,
        label: validatedLabel,
      },
      {
        onSuccess: () => {
          onClose();
          onUpdated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title={`Moderate User: ${user.label}`}
      description={`Update role, account suspension status, or display alias for ${user.label}.`}
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <form onSubmit={handleSubmit} noValidate className="admin-modal-form">
        {user.canRename && (
          <TextField
            label="User Display Label"
            required
            value={label}
            error={labelError}
            disabled={mutation.isPending}
            onChange={(e) => {
              setLabel(e.target.value);
              if (labelError) setLabelError('');
            }}
            placeholder="e.g. Sample customer alias"
          />
        )}

        <SelectField
          label="Actor Role"
          value={actor}
          disabled={mutation.isPending}
          onChange={(e) => setActor(e.target.value as 'Customer' | 'Supplier')}
        >
          <option value="Customer">Customer</option>
          <option value="Supplier">Supplier</option>
        </SelectField>

        <SelectField
          label="Account Status"
          value={status}
          disabled={mutation.isPending}
          onChange={(e) => setStatus(e.target.value as 'active' | 'suspended')}
        >
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </SelectField>

        <TextField
          label="Oversight / Suspension Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={mutation.isPending}
          placeholder="Reason for suspension or note on account..."
        />

        {mutation.isPending && <p role="status" className="field__status">Saving user account status...</p>}
        {mutation.isError && <p role="alert" className="field__error">User changes could not be saved. Review and try again.</p>}

        <Button type="submit" variant="primary" busy={mutation.isPending}>
          Save User Changes
        </Button>
      </form>
    </AdminModal>
  );
}

// 3. Category Create Dialog
export function CategoryCreateDialog({
  open,
  onClose,
  revision,
  adapter,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  revision: number;
  adapter: AdminAdapter;
  onCreated?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [label, setLabel] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setLabel('');
      setSlug('');
      setDescription('');
      setError('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const validation = labelInput.safeParse(label);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Enter a category name.');
      return;
    }
    setError('');
    submitting.current = true;
    mutation.mutate(
      {
        type: 'createCategory',
        expectedRevision: revision,
        label: validation.data,
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          onCreated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title="Create New Category"
      description="Add a new floral category to the sample marketplace catalog taxonomy."
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <form onSubmit={handleSubmit} noValidate className="admin-modal-form">
        <TextField
          label="Category Name"
          required
          value={label}
          error={error}
          disabled={mutation.isPending}
          onChange={(e) => {
            setLabel(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. Seasonal Stems"
        />

        <TextField
          label="Category Slug (optional)"
          value={slug}
          disabled={mutation.isPending}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. seasonal-stems"
        />

        <TextField
          label="Description (optional)"
          value={description}
          disabled={mutation.isPending}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of catalog items in this category..."
        />

        {mutation.isPending && <p role="status" className="field__status">Creating new category...</p>}
        {mutation.isError && <p role="alert" className="field__error">Category could not be created. Review and try again.</p>}

        <Button type="submit" variant="primary" busy={mutation.isPending}>
          Create Category
        </Button>
      </form>
    </AdminModal>
  );
}

// 4. Category Edit Dialog
export function CategoryEditDialog({
  open,
  onClose,
  category,
  revision,
  adapter,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  category: Extract<AdminRecord, { kind: 'categories' }>;
  revision: number;
  adapter: AdminAdapter;
  onUpdated?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [label, setLabel] = useState(category.label);
  const [slug, setSlug] = useState(category.slug ?? '');
  const [description, setDescription] = useState(category.description ?? '');
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setLabel(category.label);
      setSlug(category.slug ?? '');
      setDescription(category.description ?? '');
      setError('');
    }
  }, [open, category.id, category.label, category.slug, category.description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const validation = labelInput.safeParse(label);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Enter a category name.');
      return;
    }
    setError('');
    submitting.current = true;
    mutation.mutate(
      {
        type: 'updateCategory',
        expectedRevision: revision,
        id: category.id,
        label: validation.data,
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          onUpdated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title={`Edit Category: ${category.label}`}
      description="Update category name, URL slug, or descriptive summary."
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <form onSubmit={handleSubmit} noValidate className="admin-modal-form">
        <TextField
          label="Category Name"
          required
          value={label}
          error={error}
          disabled={mutation.isPending}
          onChange={(e) => {
            setLabel(e.target.value);
            if (error) setError('');
          }}
        />

        <TextField
          label="Category Slug (optional)"
          value={slug}
          disabled={mutation.isPending}
          onChange={(e) => setSlug(e.target.value)}
        />

        <TextField
          label="Description (optional)"
          value={description}
          disabled={mutation.isPending}
          onChange={(e) => setDescription(e.target.value)}
        />

        {mutation.isPending && <p role="status" className="field__status">Saving category changes...</p>}
        {mutation.isError && <p role="alert" className="field__error">Category could not be updated. Review and try again.</p>}

        <Button type="submit" variant="primary" busy={mutation.isPending}>
          Save Category
        </Button>
      </form>
    </AdminModal>
  );
}

// 5. Category Delete Dialog (Retains exact title & text for test compatibility)
export function CategoryDeleteDialog({
  open,
  onClose,
  category,
  revision,
  adapter,
  onRemoved,
}: {
  open: boolean;
  onClose: () => void;
  category: Extract<AdminRecord, { kind: 'categories' }>;
  revision: number;
  adapter: AdminAdapter;
  onRemoved?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const submitting = useRef(false);
  const confirm = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (mutation.isError && document.activeElement === document.body) {
      confirm.current?.focus();
    }
  }, [mutation.isError]);

  const handleConfirm = () => {
    if (submitting.current) return;
    submitting.current = true;
    mutation.mutate(
      {
        type: 'removeCategory',
        expectedRevision: revision,
        id: category.id,
      },
      {
        onSuccess: () => {
          onClose();
          onRemoved?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title="Remove sample category"
      description="Remove this fictional category from the current session? Public products and supplier categories are unaffected."
      onClose={() => {
        if (!submitting.current) onClose();
      }}
      isBusy={mutation.isPending}
    >
      {mutation.isPending && <p role="status" className="field__status">Removing sample category.</p>}
      {mutation.isError && <p role="alert" className="field__error">The sample category could not be removed. Try again.</p>}

      <div className="admin-btn-group">
        <Button
          ref={confirm}
          variant="destructive"
          busy={mutation.isPending}
          onClick={handleConfirm}
        >
          Confirm removal
        </Button>
      </div>
    </AdminModal>
  );
}

// 6. Order Inspection & Flag Dialog
export function OrderInspectDialog({
  open,
  onClose,
  order,
  revision,
  adapter,
  supplierLabel,
  userLabel,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  order: Extract<AdminRecord, { kind: 'orders' }>;
  revision: number;
  adapter: AdminAdapter;
  supplierLabel?: string;
  userLabel?: string;
  onUpdated?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.note);
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setStatus(order.status);
      setNote(order.note);
    }
  }, [open, order.id, order.status, order.note]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    mutation.mutate(
      {
        type: 'flagOrder',
        expectedRevision: revision,
        id: order.id,
        status,
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          onUpdated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title={`Order Inspection: ${order.label}`}
      description={`Examine line items, customer and supplier references, and manage administrative hold for order ${order.id}.`}
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <div className="admin-dialog-details">
        <div className="admin-detail-row">
          <span className="admin-detail-label">Order Reference:</span>
          <span>{order.id}</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Customer:</span>
          <span>{userLabel ?? order.userId}</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Supplier:</span>
          <span>{supplierLabel ?? order.supplierId}</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Payment Example:</span>
          <span>{order.paymentExample ?? 'not connected; mock mode'}</span>
        </div>
        {order.totalAmount !== undefined && (
          <div className="admin-detail-row">
            <span className="admin-detail-label">Total Amount:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="admin-order-items">
        <h4>Order Items</h4>
        <ul className="admin-items-list">
          {order.items.map((item, i) => (
            <li key={i} className="admin-item-row">
              <span className="admin-item-name">{item.label}</span>
              <span className="admin-item-qty">Qty: {item.quantity}</span>
              {item.unitPrice !== undefined && (
                <span className="admin-item-price">${(item.unitPrice * item.quantity).toFixed(2)}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSave} noValidate className="admin-modal-form">
        <SelectField
          label="Order Status"
          value={status}
          disabled={mutation.isPending}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="flagged">Flagged (Administrative Hold)</option>
          <option value="cancelled">Cancelled</option>
        </SelectField>

        <TextField
          label="Administrative Oversight Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={mutation.isPending}
          placeholder="Oversight or hold explanation..."
        />

        {mutation.isPending && <p role="status" className="field__status">Saving order changes...</p>}
        {mutation.isError && <p role="alert" className="field__error">Order status could not be saved. Review and try again.</p>}

        <Button type="submit" variant="primary" busy={mutation.isPending}>
          Update Order Status
        </Button>
      </form>
    </AdminModal>
  );
}

// 7. Refund Decision Dialog
export function RefundDecisionDialog({
  open,
  onClose,
  refund,
  revision,
  adapter,
  onDecided,
}: {
  open: boolean;
  onClose: () => void;
  refund: Extract<AdminRecord, { kind: 'refunds' }>;
  revision: number;
  adapter: AdminAdapter;
  onDecided?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setDecision('approved');
      setJustification('');
      setError('');
    }
  }, [open, refund.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const validation = z.string().trim().min(1, 'Justification is required for refund decisions.').max(1000).safeParse(justification);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Justification required.');
      return;
    }
    setError('');
    submitting.current = true;
    mutation.mutate(
      {
        type: 'processRefund',
        expectedRevision: revision,
        id: refund.id,
        decision,
        justification: validation.data,
      },
      {
        onSuccess: () => {
          onClose();
          onDecided?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title={`Refund Decision: ${refund.label}`}
      description={`Review reason for refund request on order ${refund.orderId} and log an administrative approval or rejection.`}
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <div className="admin-dialog-details">
        <div className="admin-detail-row">
          <span className="admin-detail-label">Current Status:</span>
          <span className={`badge badge--status-${refund.status}`}>{refund.status.toUpperCase()}</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Order Reference:</span>
          <span>{refund.orderId}</span>
        </div>
        {refund.amount !== undefined && (
          <div className="admin-detail-row">
            <span className="admin-detail-label">Requested Refund Amount:</span>
            <span>${refund.amount.toFixed(2)}</span>
          </div>
        )}
        <div className="admin-detail-row">
          <span className="admin-detail-label">Customer Reason:</span>
          <p className="admin-detail-text">{refund.reason}</p>
        </div>
        {refund.decisionReason && (
          <div className="admin-detail-row">
            <span className="admin-detail-label">Prior Decision Note:</span>
            <p className="admin-detail-text">{refund.decisionReason}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="admin-modal-form">
        <SelectField
          label="Administrative Decision"
          value={decision}
          disabled={mutation.isPending}
          onChange={(e) => setDecision(e.target.value as 'approved' | 'rejected')}
        >
          <option value="approved">Approve Refund</option>
          <option value="rejected">Reject Refund</option>
        </SelectField>

        <TextField
          label="Decision Justification"
          required
          value={justification}
          error={error}
          disabled={mutation.isPending}
          onChange={(e) => {
            setJustification(e.target.value);
            if (error) setError('');
          }}
          placeholder="State the policy or inspection reason for this decision..."
        />

        {mutation.isPending && <p role="status" className="field__status">Processing refund decision...</p>}
        {mutation.isError && <p role="alert" className="field__error">Refund decision could not be processed. Review and try again.</p>}

        <Button
          type="submit"
          variant={decision === 'approved' ? 'primary' : 'destructive'}
          busy={mutation.isPending}
        >
          {decision === 'approved' ? 'Approve Refund Request' : 'Reject Refund Request'}
        </Button>
      </form>
    </AdminModal>
  );
}

// 8. Review / Feedback Moderation Dialog
export function ReviewModerationDialog({
  open,
  onClose,
  review,
  revision,
  adapter,
  onModerated,
}: {
  open: boolean;
  onClose: () => void;
  review: Extract<AdminRecord, { kind: 'reviews' }>;
  revision: number;
  adapter: AdminAdapter;
  onModerated?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [status, setStatus] = useState(review.status);
  const [reason, setReason] = useState(review.moderationReason ?? '');
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setStatus(review.status);
      setReason(review.moderationReason ?? '');
    }
  }, [open, review.id, review.status, review.moderationReason]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    mutation.mutate(
      {
        type: 'moderateReview',
        expectedRevision: revision,
        id: review.id,
        status,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          onModerated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title={`Moderate Feedback: ${review.label}`}
      description="Manage feedback visibility, supplier dispute flags, or suppress inappropriate content."
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <div className="admin-dialog-details">
        <div className="admin-detail-row">
          <span className="admin-detail-label">Rating:</span>
          <span className="admin-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} ({review.rating}/5)</span>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Feedback Content:</span>
          <p className="admin-detail-text">"{review.comment}"</p>
        </div>
        <div className="admin-detail-row">
          <span className="admin-detail-label">Related Order:</span>
          <span>{review.orderId}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="admin-modal-form">
        <SelectField
          label="Moderation Visibility"
          value={status}
          disabled={mutation.isPending}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="approved">Approved (Publicly Visible)</option>
          <option value="flagged">Flagged (Under Internal Review)</option>
          <option value="hidden">Hidden (Suppressed from Public)</option>
        </SelectField>

        <TextField
          label="Moderation Reason / Note"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={mutation.isPending}
          placeholder="e.g. Verified genuine review or suppressed due to spam..."
        />

        {mutation.isPending && <p role="status" className="field__status">Saving moderation decision...</p>}
        {mutation.isError && <p role="alert" className="field__error">Moderation decision could not be saved. Review and try again.</p>}

        <Button type="submit" variant="primary" busy={mutation.isPending}>
          Save Moderation Decision
        </Button>
      </form>
    </AdminModal>
  );
}

// 9. Reset Demo State Dialog
export function ResetWorkspaceDialog({
  open,
  onClose,
  revision,
  adapter,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  revision: number;
  adapter: AdminAdapter;
  onReset?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const submitting = useRef(false);

  const handleReset = () => {
    if (submitting.current) return;
    submitting.current = true;
    mutation.mutate(
      {
        type: 'resetWorkspace',
        expectedRevision: revision,
      },
      {
        onSuccess: () => {
          onClose();
          onReset?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title="Reset Admin Workspace"
      description="Revert all admin records back to initial botanical demo seeds? All modifications in this session will be reset."
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <p className="admin-modal-warning">
        This will restore default suppliers, sample orders, user accounts, categories, refunds, and feedback.
      </p>

      {mutation.isPending && <p role="status" className="field__status">Resetting sample workspace...</p>}
      {mutation.isError && <p role="alert" className="field__error">Workspace could not be reset. Try again.</p>}

      <div className="admin-btn-group">
        <Button
          variant="destructive"
          busy={mutation.isPending}
          onClick={handleReset}
        >
          Confirm Reset Workspace
        </Button>
      </div>
    </AdminModal>
  );
}

// 10. Oversight Note Dialog (For direct row-level "Add Note" actions)
export function AnnotateDialog({
  open,
  onClose,
  record,
  revision,
  adapter,
  onAnnotated,
}: {
  open: boolean;
  onClose: () => void;
  record: Extract<AdminRecord, { kind: 'suppliers' | 'users' | 'orders' | 'refunds' | 'reviews' }>;
  revision: number;
  adapter: AdminAdapter;
  onAnnotated?: () => void;
}) {
  const mutation = useAdminCommand(adapter);
  const [note, setNote] = useState(record.note ?? '');
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (open) {
      setNote(record.note ?? '');
      setError('');
    }
  }, [open, record.id, record.note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const validation = noteInput.safeParse(note);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Enter a sample oversight note.');
      return;
    }
    setError('');
    submitting.current = true;
    mutation.mutate(
      {
        type: 'annotate',
        expectedRevision: revision,
        kind: record.kind,
        id: record.id,
        note: validation.data,
      },
      {
        onSuccess: () => {
          onClose();
          onAnnotated?.();
        },
        onSettled: () => {
          submitting.current = false;
        },
      }
    );
  };

  return (
    <AdminModal
      open={open}
      title={`Oversight Note: ${record.label}`}
      description={`Record an administrative oversight note for ${record.kind.slice(0, -1)} reference ${record.id}.`}
      onClose={onClose}
      isBusy={mutation.isPending}
    >
      <form onSubmit={handleSubmit} noValidate className="admin-modal-form">
        <TextField
          label="Sample oversight note"
          required
          value={note}
          error={error}
          disabled={mutation.isPending}
          onChange={(e) => {
            setNote(e.target.value);
            if (error) setError('');
          }}
          placeholder="State the administrative observation or session note..."
        />

        {mutation.isPending && <p role="status" className="field__status">Saving oversight note...</p>}
        {mutation.isError && <p role="alert" className="field__error">Oversight note could not be saved. Review and try again.</p>}

        <Button type="submit" variant="primary" busy={mutation.isPending}>
          Save sample oversight note
        </Button>
      </form>
    </AdminModal>
  );
}
