import { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useRepositories } from '../context/RepositoryContext';
import { scrollToSegment } from '../utils/scrollToSegment';
import type { Parallel } from '../types';

export interface UseParallelNavigationReturn {
  /** For each parallel-text id, do any segments in the current chapter reference it? */
  textHasParallelsInActiveChapter: (textId: string) => boolean;
  /** Open the parallel panel to the first segment in the active chapter that references the given text. */
  openParallelForFirstMatch: (textId: string) => boolean;
  /** Open a specific parallel. */
  open: (parallel: Parallel) => void;
  /** Close the parallel panel. */
  close: () => void;
}

export function useParallelNavigation(): UseParallelNavigationReturn {
  const { state, openParallel, closeParallel } = useApp();
  const { texts } = useRepositories();
  const chapter = useMemo(
    () => texts.getChapter(state.activeChapterId),
    [texts, state.activeChapterId]
  );

  const textHasParallelsInActiveChapter = useCallback(
    (textId: string) => {
      if (!chapter) return false;
      return chapter.segments.some((s) => s.parallels.some((p) => p.textId === textId));
    },
    [chapter]
  );

  const openParallelForFirstMatch = useCallback(
    (textId: string) => {
      if (!chapter) return false;
      for (const segment of chapter.segments) {
        const parallel = segment.parallels.find((p) => p.textId === textId);
        if (parallel) {
          openParallel({
            textId: parallel.textId,
            chapterId: parallel.chapterId,
            segmentId: parallel.segmentId,
          });
          // Scroll the main text to the matching segment after a tick so the layout settles.
          window.setTimeout(() => scrollToSegment(segment.id), 50);
          return true;
        }
      }
      return false;
    },
    [chapter, openParallel]
  );

  const open = useCallback(
    (parallel: Parallel) =>
      openParallel({
        textId: parallel.textId,
        chapterId: parallel.chapterId,
        segmentId: parallel.segmentId,
      }),
    [openParallel]
  );

  return {
    textHasParallelsInActiveChapter,
    openParallelForFirstMatch,
    open,
    close: closeParallel,
  };
}
