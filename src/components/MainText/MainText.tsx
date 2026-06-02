import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRepositories } from '../../context/RepositoryContext';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useHighlightPulse } from '../../hooks/useHighlightPulse';
import { useParallelNavigation } from '../../hooks/useParallelNavigation';
import { useChapterNavigation } from '../../hooks/useChapterNavigation';
import { useToast } from '../shared/Toast';
import { TextSegment } from './TextSegment';
import { MultiParallelPopover } from './MultiParallelPopover';
import { AnnotationPopover } from '../Annotations/AnnotationPopover';
import type { Parallel } from '../../types';
import { scrollToSegment } from '../../utils/scrollToSegment';

export interface MainTextProps {
  className?: string;
}

export function MainText({ className }: MainTextProps) {
  const { state, selectSegment, openParallel } = useApp();
  const { texts } = useRepositories();
  const { activeChapter } = useChapterNavigation();
  const { countForSegment } = useAnnotations(state.activeChapterId);
  const { pulsingId } = useHighlightPulse();
  const { open: openParallelByObj } = useParallelNavigation();
  const { show } = useToast();

  const [multiAnchor, setMultiAnchor] = useState<HTMLElement | null>(null);
  const [multiParallels, setMultiParallels] = useState<Parallel[]>([]);
  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [annotationSegmentId, setAnnotationSegmentId] = useState<string | null>(null);

  const mainText = texts.getMainText();

  // When the parallel panel changes, scroll the main column to the matching segment.
  useEffect(() => {
    const pp = state.parallelPanel;
    if (!pp) return;
    const seg = activeChapter?.segments.find((s) =>
      s.parallels.some(
        (p) => p.textId === pp.textId && p.chapterId === pp.chapterId && p.segmentId === pp.segmentId
      )
    );
    if (seg) {
      window.setTimeout(() => scrollToSegment(seg.id), 100);
    }
  }, [state.parallelPanel, activeChapter]);

  if (!activeChapter) {
    return (
      <div className="p-8 text-text-secondary">
        Chapter not found.
      </div>
    );
  }

  const handleSegmentClick = (segmentId: string, anchor: HTMLElement) => {
    const segment = activeChapter.segments.find((s) => s.id === segmentId);
    if (!segment) return;

    if (state.annotationMode) {
      setAnnotationSegmentId(segmentId);
      setAnnotationOpen(true);
      selectSegment(segmentId);
      return;
    }

    if (segment.parallels.length === 0) return;
    selectSegment(segmentId);
    if (segment.parallels.length === 1) {
      openParallelByObj(segment.parallels[0]);
    } else {
      setMultiParallels(segment.parallels);
      setMultiAnchor(anchor);
    }
  };

  const handleAnnotationMarker = (segmentId: string) => {
    setAnnotationSegmentId(segmentId);
    setAnnotationOpen(true);
  };

  const chapterTitle = activeChapter.title;

  return (
    <div className={`overflow-y-auto h-full ${className ?? ''}`} style={{ backgroundColor: 'var(--color-background)' }}>
      <article
        className="mx-auto"
        style={{
          maxWidth: 'var(--main-text-max-width)',
          padding:
            state.viewMode === 'research'
              ? '64px 96px 96px 120px'
              : '96px 48px 128px 48px',
        }}
      >
        <header className="mb-12 text-center">
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              marginBottom: 16,
            }}
          >
            {mainText.title.en}
          </p>
          <h1
            className="font-serif"
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 16,
              color: 'var(--color-text-primary)',
            }}
          >
            {chapterTitle.zh}
          </h1>
          <p
            className="font-serif italic"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: 'var(--color-secondary)',
              lineHeight: 1.4,
            }}
          >
            {chapterTitle.en}
          </p>
          <div
            aria-hidden
            style={{
              width: 48,
              height: 1,
              backgroundColor: 'var(--color-border)',
              margin: '32px auto 0',
            }}
          />
        </header>
        <div
          style={{
            fontFamily: state.language === 'zh' ? 'var(--font-zh-body)' : 'var(--font-en-body)',
            fontSize: `calc(${state.language === 'zh' ? 'var(--zh-body-size)' : 'var(--en-body-size)'} * ${state.zoomLevel})`,
            lineHeight:
              state.language === 'zh' ? 'var(--zh-body-line-height)' : 'var(--en-body-line-height)',
            color: 'var(--color-text-primary)',
          }}
        >
          {activeChapter.segments.map((segment, i) => {
            const wantsRhymed = state.displayMode === 'rhymed';
            const hasRhymed =
              state.language === 'zh' ? !!segment.content.zhRhymed : !!segment.content.enRhymed;
            // graceful degradation: if rhymed mode but no rhymed for this segment, fall back silently.
            void wantsRhymed;
            void hasRhymed;
            return (
              <TextSegment
                key={segment.id}
                segment={segment}
                language={state.language}
                displayMode={state.displayMode}
                viewMode={state.viewMode}
                isSelected={state.selectedSegmentId === segment.id}
                isPulsing={pulsingId === segment.id}
                lineNumber={i + 1}
                annotationCount={countForSegment(segment.id)}
                onClick={handleSegmentClick}
                onAnnotationClick={handleAnnotationMarker}
              />
            );
          })}
        </div>
        <div style={{ height: 96 }} />
        {state.annotationMode && (
          <div
            aria-live="polite"
            style={{
              position: 'fixed',
              bottom: 16,
              left: 'calc(var(--sidebar-width) + 24px)',
              padding: '6px 12px',
              backgroundColor: 'var(--color-accent-bright)',
              color: 'var(--color-text-inverse)',
              borderRadius: 'var(--radius-toggle)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              fontWeight: 500,
              zIndex: 30,
              boxShadow: 'var(--shadow-popover)',
            }}
          >
            Annotation mode — click any segment to add a note.
          </div>
        )}
      </article>
      <MultiParallelPopover
        open={multiAnchor !== null}
        anchor={multiAnchor}
        parallels={multiParallels}
        language={state.language}
        onSelect={(p) => {
          openParallel({ textId: p.textId, chapterId: p.chapterId, segmentId: p.segmentId });
          show(
            `Opened parallel in ${texts.getParallelText(p.textId)?.title.en ?? p.textId}`,
            1800
          );
        }}
        onClose={() => setMultiAnchor(null)}
      />
      <AnnotationPopover
        open={annotationOpen}
        onClose={() => setAnnotationOpen(false)}
        chapterId={state.activeChapterId}
        segmentId={annotationSegmentId}
      />
    </div>
  );
}
