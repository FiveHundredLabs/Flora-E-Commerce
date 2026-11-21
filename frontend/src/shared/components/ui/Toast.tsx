import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { AlertTone } from './Content';

export type Toast = {
  id: string;
  tone?: AlertTone;
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextValue = {
  toasts: readonly Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly Toast[]>([]);
  const idCounter = useRef(0);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ tone = 'info', title, description, duration = 5000 }: Omit<Toast, 'id'>) => {
      idCounter.current += 1;
      const id = `toast-${idCounter.current}`;
      const newToast: Toast = { id, tone, title, description, duration };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: readonly Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="toast-container"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration ?? 5000;

  const tone = toast.tone ?? 'info';
  const isAssertive = tone === 'danger' || tone === 'warning';
  const icons: Record<AlertTone, ReactNode> = {
    info: <Info size={18} aria-hidden="true" />,
    success: <CheckCircle size={18} aria-hidden="true" />,
    warning: <AlertTriangle size={18} aria-hidden="true" />,
    danger: <AlertCircle size={18} aria-hidden="true" />,
  };

  useEffect(() => {
    if (duration <= 0 || isPaused) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, isPaused, onDismiss]);

  return (
    <div
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      className={`toast toast--${tone}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="toast__icon">{icons[tone]}</div>
      <div className="toast__body">
        <h4 className="toast__title">{toast.title}</h4>
        {toast.description && <p className="toast__description">{toast.description}</p>}
      </div>
      <button
        type="button"
        className="toast__close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
