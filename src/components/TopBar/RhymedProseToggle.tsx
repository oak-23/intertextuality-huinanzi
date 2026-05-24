import { useApp } from '../../context/AppContext';
import { useRepositories } from '../../context/RepositoryContext';
import { useToast } from '../shared/Toast';

export interface RhymedProseToggleProps {
  className?: string;
}

export function RhymedProseToggle({ className }: RhymedProseToggleProps) {
  const { state, setDisplayMode } = useApp();
  const { texts } = useRepositories();
  const { show } = useToast();

  if (state.viewMode !== 'research') return null;

  const flip = () => {
    const next = state.displayMode === 'rhymed' ? 'prose' : 'rhymed';
    if (next === 'rhymed') {
      const chapter = texts.getChapter(state.activeChapterId);
      const hasRhyme = chapter?.segments.some(
        (s) =>
          (state.language === 'zh' ? s.content.zhRhymed : s.content.enRhymed) !== undefined
      );
      if (!hasRhyme) {
        show('Rhymed version not available for this chapter.');
        return;
      }
    }
    setDisplayMode(next);
  };

  const rhymed = state.displayMode === 'rhymed';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={rhymed}
      aria-label={`Display mode: ${rhymed ? 'rhymed' : 'prose'}. Click to switch.`}
      onClick={flip}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-surface-high)',
        borderRadius: 'var(--radius-toggle)',
        padding: 4,
        height: 32,
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {(['rhymed', 'prose'] as const).map((m) => {
        const active = state.displayMode === m;
        return (
          <span
            key={m}
            aria-hidden
            className="text-ui-label transition-all pointer-events-none"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 24,
              padding: '0 12px',
              borderRadius: 'var(--radius-toggle)',
              backgroundColor: active ? 'var(--color-accent-bright)' : 'transparent',
              color: active ? 'var(--color-text-inverse)' : 'var(--color-secondary)',
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.12)' : 'none',
              fontWeight: 500,
            }}
          >
            {m === 'rhymed' ? 'Rhyme' : 'Prose'}
          </span>
        );
      })}
    </button>
  );
}
