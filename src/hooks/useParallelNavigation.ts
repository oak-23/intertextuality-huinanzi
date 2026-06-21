import { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useRepositories } from '../context/RepositoryContext';
import type { Parallel } from '../types';

export interface UseParallelNavigationReturn {
  /** For each parallel-text id, do any inline parallels in the current chapter reference it? */
  textHasParallelsInActiveChapter: (textId: string) => boolean;
  /** Open the parallel panel to the first inline parallel in the active chapter that references the given text. */
  openParallelForFirstMatch: (textId: string) => boolean;
  /** Open a specific parallel. */
  open: (parallel: Parallel) => void;
  /** Close the parallel panel. */
  close: () => void;
}

export function useParallelNavigation(): UseParallelNavigationReturn {
  const { state, openParallel, closeParallel } = useApp();
  const { texts } = useRepositories();

  const continuousChapter = useMemo(
    () => texts.getContinuousChapter(state.activeChapterId),
    [texts, state.activeChapterId]
  );

  const textHasParallelsInActiveChapter = useCallback(
    (textId: string) => {
      if (!continuousChapter) return false;
      return continuousChapter.inlineParallels.some((p) => p.textId === textId);
    },
    [continuousChapter]
  );

  const openParallelForFirstMatch = useCallback(
    (textId: string) => {
      if (!continuousChapter) return false;
      const match = continuousChapter.inlineParallels.find((p) => p.textId === textId);
      if (match) {
        openParallel({
          textId: match.textId,
          chapterId: match.chapterId,
          segmentId: match.segmentId,
        });
        return true;
      }
      return false;
    },
    [continuousChapter, openParallel]
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
