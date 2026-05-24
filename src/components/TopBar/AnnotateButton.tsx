import { Pencil } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface AnnotateButtonProps {
  className?: string;
}

export function AnnotateButton({ className }: AnnotateButtonProps) {
  const { state, toggleAnnotationMode } = useApp();
  const active = state.annotationMode;
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? 'Exit annotation mode' : 'Enter annotation mode'}
      onClick={toggleAnnotationMode}
      className={`inline-flex items-center gap-2 transition-colors ${className ?? ''}`}
      style={{
        height: 36,
        padding: '0 16px',
        borderRadius: 'var(--radius-button)',
        backgroundColor: active ? 'var(--color-accent-pressed)' : 'var(--color-accent)',
        color: 'var(--color-text-inverse)',
        fontFamily: 'var(--font-ui)',
        fontWeight: 500,
        fontSize: 14,
        boxShadow: active ? 'inset 0 0 0 2px rgba(255,255,255,0.35)' : 'none',
      }}
    >
      <Pencil size={14} />
      Annotate
    </button>
  );
}
