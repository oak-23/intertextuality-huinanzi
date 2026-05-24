export interface AnnotationMarkerProps {
  count: number;
  onClick: () => void;
}

export function AnnotationMarker({ count, onClick }: AnnotationMarkerProps) {
  if (count === 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${count} annotation${count > 1 ? 's' : ''} on this segment`}
      className="inline-flex items-center justify-center transition-transform hover:scale-110"
      style={{
        position: 'absolute',
        right: -24,
        top: 8,
        width: 14,
        height: 14,
        borderRadius: 9999,
        backgroundColor: 'var(--color-accent-bright)',
        border: '2px solid var(--color-background)',
        color: 'var(--color-text-inverse)',
        fontFamily: 'var(--font-ui)',
        fontSize: 9,
        fontWeight: 600,
        cursor: 'pointer',
        padding: 0,
        lineHeight: 1,
      }}
    >
      {count > 1 ? count : ''}
    </button>
  );
}
