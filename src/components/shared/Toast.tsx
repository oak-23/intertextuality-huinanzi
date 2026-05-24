import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface ToastItem {
  id: string;
  message: string;
  duration: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  show: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, message, duration }]);
      const handle = window.setTimeout(() => dismiss(id), duration);
      timers.current.set(id, handle);
    },
    [dismiss]
  );

  useEffect(() => {
    return () => {
      for (const t of timers.current.values()) window.clearTimeout(t);
      timers.current.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside a ToastProvider');
  return ctx;
}

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      role="status"
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className="animate-slide-up-in"
          onClick={() => onDismiss(t.id)}
          style={{
            pointerEvents: 'auto',
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-text-inverse)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-button)',
            boxShadow: 'var(--shadow-popover)',
            font: '500 14px/20px var(--font-ui)',
            border: 'none',
            cursor: 'pointer',
            maxWidth: 480,
            textAlign: 'left',
          }}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
