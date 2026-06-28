import { useApp } from '../../context/AppContext';

/**
 * A pill next to the app title that appears only in research mode. Its presence is
 * the at-a-glance signal distinguishing research mode from the normal reading view.
 */
export function ResearchModeBadge() {
  const { state } = useApp();
  if (state.viewMode !== 'research') return null;

  return (
    <span
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
        // Optical nudge: the serif title's visual center sits below its line-box
        // center, so the geometrically-centered pill reads too high — push it down.
        position: 'relative',
        top: '2px',
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-inverse)',
        backgroundColor: 'var(--color-accent)',
        borderRadius: 9999,
        padding: '4px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      Research Mode
    </span>
  );
}
