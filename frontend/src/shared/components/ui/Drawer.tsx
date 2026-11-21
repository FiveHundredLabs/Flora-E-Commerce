import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: 'left' | 'right' | 'bottom';
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  children,
  footer,
  className = '',
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !drawerRef.current?.contains(document.activeElement)) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last || !drawerRef.current?.contains(document.activeElement)) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Focus close button or first focusable element
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0]?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose} aria-hidden={!open}>
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`drawer drawer--${side} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__header">
          <div>
            <h2 id={titleId} className="drawer__title">{title}</h2>
            {description && (
              <p id={descriptionId} className="drawer__description">{description}</p>
            )}
          </div>
          <button
            type="button"
            className="drawer__close-btn"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="drawer__content">{children}</div>

        {footer && <div className="drawer__footer">{footer}</div>}
      </div>
    </div>
  );
}
