import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button, type ButtonVariant } from './Button';
import { X } from 'lucide-react';

export type DialogProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  showCloseButton?: boolean;
  actions?: ReactNode;
  className?: string;
};

/** Controlled native modal: showModal provides focus containment and inert background. */
export function Dialog({
  open,
  title,
  description,
  onClose,
  size = 'md',
  children,
  showCloseButton = false,
  actions,
  className = '',
}: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open) {
      const trigger = document.activeElement;
      if (!element.open) {
        if (typeof element.showModal === 'function') {
          element.showModal();
        } else {
          element.setAttribute('open', '');
        }
      }
      return () => {
        if (typeof element.close === 'function') {
          element.close();
        } else {
          element.removeAttribute('open');
        }
        if (trigger instanceof HTMLElement && trigger.isConnected) {
          trigger.focus();
        }
      };
    } else {
      if (element.open) {
        if (typeof element.close === 'function') {
          element.close();
        } else {
          element.removeAttribute('open');
        }
      }
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={`dialog dialog--${size} ${className}`.trim()}
      onClose={() => {
        // Ignore stale close events if an effect already reopened the native modal.
        if (open && dialog.current && !dialog.current.open) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Light dismiss on backdrop click
        if (e.target === dialog.current) {
          onClose();
        }
      }}
    >
      <div className="dialog__header">
        <div>
          <h2 id={titleId} className="dialog__title">{title}</h2>
          <p id={descriptionId} className="dialog__description">{description}</p>
        </div>
        {showCloseButton && (
          <button
            type="button"
            className="dialog__close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="dialog__body">{children}</div>

      {actions !== null && (
        <div className="dialog__actions">
          {actions !== undefined ? (
            actions
          ) : (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      )}
    </dialog>
  );
}

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ButtonVariant;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  busy = false,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    if (open) {
      const trigger = document.activeElement;
      if (!element.open) {
        if (typeof element.showModal === 'function') {
          element.showModal();
        } else {
          element.setAttribute('open', '');
        }
      }
      return () => {
        if (typeof element.close === 'function') {
          element.close();
        } else {
          element.removeAttribute('open');
        }
        if (trigger instanceof HTMLElement && trigger.isConnected) {
          trigger.focus();
        }
      };
    } else {
      if (element.open) {
        if (typeof element.close === 'function') {
          element.close();
        } else {
          element.removeAttribute('open');
        }
      }
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="dialog dialog--confirm dialog--sm"
      onClose={() => {
        if (open && dialog.current && !dialog.current.open && !busy) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current && !busy) onClose();
      }}
    >
      <div className="dialog__header">
        <div>
          <h2 id={titleId} className="dialog__title">{title}</h2>
          <p id={descriptionId} className="dialog__description">{description}</p>
        </div>
      </div>

      {children && <div className="dialog__body">{children}</div>}

      <div className="dialog__actions">
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} busy={busy}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
