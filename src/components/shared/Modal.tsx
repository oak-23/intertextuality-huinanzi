import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Visual width of the card. Default 'md' (~480px). */
  size?: 'sm' | 'md' | 'lg';
  /** Show the close X in the top-right of the card. */
  showClose?: boolean;
  children: ReactNode;
  /** Optional aria-label for the modal as a whole when no `title` is set. */
  ariaLabel?: string;
}

const SIZE_MAP: Record<NonNullable<ModalProps['size']>, string> = {
  sm: '360px',
  md: '480px',
  lg: '640px',
};

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  showClose = true,
  ariaLabel,
  children,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const card = cardRef.current;
    const focusable = card?.querySelector<HTMLElement>(
      'input,textarea,select,button,[tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'input,textarea,select,button,a[href],[tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : ariaLabel}
    >
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ backgroundColor: 'rgba(0,0,0,0.32)' }}
        onClick={onClose}
      />
      <div
        ref={cardRef}
        className="relative animate-scale-in"
        style={{
          width: '100%',
          maxWidth: SIZE_MAP[size],
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-modal)',
          boxShadow: 'var(--shadow-modal)',
          padding: '24px',
        }}
      >
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full hover:bg-surface-low transition-colors"
            style={{ width: 32, height: 32, color: 'var(--color-secondary)' }}
          >
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
