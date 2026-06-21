import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useRepositories } from '../../context/RepositoryContext';
// ParallelPanel reads token-defined CSS vars only — no hardcoded hex.

export interface ParallelPanelProps {
  className?: string;
}

export function ParallelPanel({ className }: ParallelPanelProps) {
  const { state, closeParallel } = useApp();
  const { texts } = useRepositories();
  const containerRef = useRef<HTMLDivElement>(null);

  const panel = state.parallelPanel;
  const text = panel ? texts.getParallelText(panel.textId) : null;
  const segment = panel ? texts.getSegment(panel.textId, panel.chapterId, panel.segmentId) : null;

  useEffect(() => {
    if (panel && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [panel]);

  return (
    <aside
      ref={containerRef}
      aria-label="Parallel text"
      aria-hidden={!panel}
      className={className}
      style={{
        width: panel ? '50%' : 0,
        minWidth: 0,
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--color-background)',
        borderLeft: panel ? '1px solid var(--color-border)' : 'none',
        transition: 'width 300ms ease, border-color 300ms ease',
        flexShrink: 0,
      }}
    >
      {panel && text && segment && (
        <div
          className="mx-auto"
          style={{ maxWidth: 640, padding: '64px 32px 96px', height: '100%', overflowY: 'auto' }}
        >
          <header className="mb-10 text-center relative">
            <button
              type="button"
              aria-label="Close parallel"
              onClick={closeParallel}
              className="absolute top-0 right-0 inline-flex items-center justify-center hover:bg-surface-low rounded-full transition-colors"
              style={{ width: 32, height: 32, color: 'var(--color-secondary)' }}
            >
              <X size={16} />
            </button>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-secondary)',
                marginBottom: 12,
              }}
            >
              {text.title.en}
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 12,
                color: 'var(--color-text-primary)',
              }}
            >
              {text.title.zh}
            </h2>
            <div
              aria-hidden
              style={{
                width: 36,
                height: 1,
                backgroundColor: 'var(--color-border)',
                margin: '24px auto 0',
              }}
            />
          </header>
          <div
            style={{
              fontFamily: state.language === 'zh' ? 'var(--font-zh-body)' : 'var(--font-en-body)',
              fontSize: state.language === 'zh' ? 'var(--zh-body-size)' : 'var(--en-body-size)',
              lineHeight:
                state.language === 'zh' ? 'var(--zh-body-line-height)' : 'var(--en-body-line-height)',
              color: 'var(--color-text-primary)',
            }}
          >
            <p
              style={{
                padding: '6px 8px',
                backgroundColor: `var(--color-highlight-${text.colorKey ?? 'laozi'})`,
                borderRadius: 'var(--radius-sm)',
                outline: '2px solid var(--color-accent-bright)',
                outlineOffset: 1,
              }}
              className={state.language === 'zh' ? 'font-serif' : 'font-serif italic'}
            >
              {state.language === 'zh' ? segment.content.zh : segment.content.en}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
