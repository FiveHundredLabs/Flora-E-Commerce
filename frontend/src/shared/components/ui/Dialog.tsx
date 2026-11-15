import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from './Button';

/** Controlled native modal: showModal provides focus containment and inert background. */
export function Dialog({ open, title, description, onClose, children }: {
  open: boolean; title: string; description: string; onClose: () => void; children?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const trigger = document.activeElement;
    if (!element.open) element.showModal();
    return () => {
      element.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [open]);
  return <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId}
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <h2 id={titleId}>{title}</h2><p id={descriptionId}>{description}</p>{children}
    <div className="dialog__actions"><Button variant="secondary" onClick={onClose}>Close</Button></div>
  </dialog>;
}
