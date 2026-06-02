import { useEffect, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useRepositories } from '../../context/RepositoryContext';
import type { ColorKey } from '../../types';
// ParallelPanel reads token-defined CSS vars only — no hardcoded hex.

export interface ParallelPanelProps {
  className?: string;
}

export function ParallelPanel({ className }: ParallelPanelProps) {
  const { state, closeParallel, selectSegment, openParallel } = useApp();
  const { texts } = useRepositories();
  const containerRef = useRef<HTMLDivElement>(null);
  const matchRef = useRef<HTMLDivElement>(null);

  const panel = state.parallelPanel;
  const text = panel ? texts.getParallelText(panel.textId) : null;
  const chapter = panel ? texts.getParallelChapter(panel.textId, panel.chapterId) : null;

  // Map from parallel segment ID to an array of main text segment IDs
  const parallelToMainMap = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!panel) return map;
    const activeMain = texts.getChapter(state.activeChapterId);
    if (!activeMain) return map;
    for (const seg of activeMain.segments) {
      for (const p of seg.parallels) {
        if (p.textId === panel.textId && p.chapterId === panel.chapterId) {
          const mainIds = map.get(p.segmentId) || [];
          mainIds.push(seg.id);
          map.set(p.segmentId, mainIds);
        }
      }
    }
    return map;
  }, [panel, state.activeChapterId, texts]);

  useEffect(() => {
    if (panel && matchRef.current) {
      matchRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      {panel && text && chapter && (
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
            <p
              className="font-serif italic"
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--color-secondary)',
              }}
            >
              {chapter.title.zh} · {chapter.title.en}
            </p>
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
            {chapter.segments.map((seg) => {
              const isPrimary = seg.id === panel.segmentId;
              const mainIds = parallelToMainMap.get(seg.id);
              const isReferenced = mainIds && mainIds.length > 0;
              const showHighlight = isPrimary || isReferenced;
              const colorKey = (text.colorKey ?? 'laozi') as ColorKey;
              
              const handleClick = () => {
                if (isReferenced) {
                  openParallel({ ...panel, segmentId: seg.id });
                  selectSegment(mainIds[0]);
                }
              };

              return (
                <p
                  key={seg.id}
                  ref={isPrimary ? matchRef : undefined}
                  onClick={handleClick}
                  style={{
                    marginBottom: 16,
                    padding: showHighlight ? '6px 8px' : '4px 0',
                    backgroundColor: showHighlight
                      ? `var(--color-highlight-${colorKey})`
                      : 'transparent',
                    outline: isPrimary ? '2px solid var(--color-accent-bright)' : 'none',
                    outlineOffset: 1,
                    borderRadius: 'var(--radius-sm)',
                    cursor: isReferenced ? 'pointer' : 'default',
                  }}
                  className={state.language === 'zh' ? 'font-serif' : 'font-serif italic'}
                >
                  {state.language === 'zh' ? seg.content.zh : seg.content.en}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
