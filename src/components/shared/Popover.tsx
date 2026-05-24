import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'bottom' | 'right' | 'left' | 'top';

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchor: HTMLElement | null;
  placement?: PopoverPlacement;
  /** Offset from the anchor edge in px. Default 8. */
  offset?: number;
  /** Visual width of the popover card. */
  width?: number | string;
  children: ReactNode;
  /** Optional aria-label. */
  ariaLabel?: string;
}

export function Popover({
  open,
  onClose,
  anchor,
  placement = 'bottom-end',
  offset = 8,
  width,
  children,
  ariaLabel,
}: PopoverProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useClickOutside(cardRef, () => open && onClose(), open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open || !anchor || !cardRef.current) return;
    const rect = anchor.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    switch (placement) {
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - card.width / 2;
        break;
      case 'bottom-end':
        top = rect.bottom + offset;
        left = rect.right - card.width;
        break;
      case 'bottom-start':
        top = rect.bottom + offset;
        left = rect.left;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - card.height / 2;
        left = rect.right + offset;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - card.height / 2;
        left = rect.left - card.width - offset;
        break;
      case 'top':
        top = rect.top - card.height - offset;
        left = rect.left + rect.width / 2 - card.width / 2;
        break;
    }
    // Clamp to viewport
    const padding = 8;
    const maxLeft = window.innerWidth - card.width - padding;
    const maxTop = window.innerHeight - card.height - padding;
    left = Math.max(padding, Math.min(left, maxLeft));
    top = Math.max(padding, Math.min(top, maxTop));
    setPosition({ top, left });
  }, [open, anchor, placement, offset]);

  if (!open) return null;

  const style: CSSProperties = {
    position: 'fixed',
    top: position?.top ?? -9999,
    left: position?.left ?? -9999,
    width,
    backgroundColor: 'var(--color-background)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-popover)',
    boxShadow: 'var(--shadow-popover)',
    opacity: position ? 1 : 0,
    transition: 'opacity 150ms ease',
    zIndex: 80,
  };

  return (
    <div ref={cardRef} role="dialog" aria-label={ariaLabel} style={style} className="animate-fade-in">
      {children}
    </div>
  );
}
